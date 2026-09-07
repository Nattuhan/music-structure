const { app, BrowserWindow, Menu, dialog, ipcMain, safeStorage, screen, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const net = require("net");
const path = require("path");
const os = require("os");
const { spawn, spawnSync } = require("child_process");
const { randomBytes } = require("crypto");
const {
  MAX_FILE_BYTES: MAX_CONNECTION_FILE_BYTES,
  createConnectionFile,
  openConnectionFile,
} = require("./cloud-connection-transfer.cjs");
const { cloudSettingsFromLegacyEnv, parseEnv, stripLegacyR2Settings } = require("./legacy-cloud-settings.cjs");
const { sanitizePlayerSettings } = require("./player-settings.cjs");
const { RELEASES_LATEST_URL, getUpdateMode, hasDeveloperIdSignature } = require("./update-policy.cjs");
const { analysisEnvironment, sanitizeAnalysisMode } = require("./analysis-settings.cjs");
const { createDesktopSecretsStore } = require("./desktop-secrets.cjs");
const { appendPlaybackEvent } = require("./playback-diagnostics.cjs");

let mainWindow = null;
let backend = null;
let backendUrl = null;
let updateDownloaded = false;
const desktopToken = randomBytes(32).toString("hex");
const selectedConnectionFiles = new Map();

const defaultDesktopSettings = Object.freeze({
  autoUpdate: true,
  analysisMode: "cpu",
  cloud: {
    enabled: false,
    bucket: "",
    accountId: "",
    endpointUrl: "",
    publicBaseUrl: "",
    prefix: "sessions",
    accessKeyId: "",
  },
});

const settingsFile = () => path.join(app.getPath("userData"), "settings.json");
const secretsFile = () => path.join(app.getPath("userData"), "secrets.bin");
const playerSettingsFile = () => path.join(app.getPath("userData"), "player-settings.json");
const desktopSecretsStore = createDesktopSecretsStore({ safeStorage, fs, filePath: secretsFile });

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readDesktopSettings() {
  const saved = readJson(settingsFile(), {});
  return {
    autoUpdate: saved.autoUpdate !== false,
    analysisMode: sanitizeAnalysisMode(saved.analysisMode, process.platform),
    cloud: { ...defaultDesktopSettings.cloud, ...(saved.cloud || {}) },
  };
}

function readPlayerSettings() {
  try {
    return sanitizePlayerSettings(readJson(playerSettingsFile(), {}));
  } catch {
    return {};
  }
}

function writePlayerSettings(input) {
  const settings = sanitizePlayerSettings(input);
  const file = playerSettingsFile();
  const temporaryFile = `${file}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(temporaryFile, JSON.stringify(settings, null, 2), "utf8");
  try {
    fs.renameSync(temporaryFile, file);
  } catch {
    fs.copyFileSync(temporaryFile, file);
    fs.rmSync(temporaryFile);
  }
  return settings;
}

const readDesktopSecrets = () => desktopSecretsStore.read();

function settingsForRenderer() {
  const settings = readDesktopSettings();
  return {
    ...settings,
    cloud: { ...settings.cloud, hasSecret: desktopSecretsStore.hasStored() },
    dataPath: app.getPath("userData"),
    version: app.getVersion(),
    packaged: app.isPackaged,
    platform: process.platform,
    updateMode: getDesktopUpdateMode(),
  };
}

function writeDesktopSettings(input = {}) {
  const current = readDesktopSettings();
  const cloudInput = input.cloud || {};
  const cloud = {
    ...current.cloud,
    enabled: !!cloudInput.enabled,
    bucket: String(cloudInput.bucket || "").trim(),
    accountId: String(cloudInput.accountId || "").trim(),
    endpointUrl: String(cloudInput.endpointUrl || "").trim(),
    publicBaseUrl: String(cloudInput.publicBaseUrl || "").trim().replace(/\/$/, ""),
    prefix: String(cloudInput.prefix || "sessions").trim().replace(/^\/+|\/+$/g, "") || "sessions",
    accessKeyId: String(cloudInput.accessKeyId || "").trim(),
  };
  if (cloud.enabled && (!cloud.bucket || (!cloud.accountId && !cloud.endpointUrl) || !cloud.accessKeyId)) {
    throw new Error("R2のバケット、アカウントIDまたはエンドポイント、アクセスキーIDを入力してください");
  }
  if (cloud.enabled && !String(cloudInput.secretAccessKey || "") && !desktopSecretsStore.hasStored()) {
    throw new Error("R2のシークレットアクセスキーを入力してください");
  }
  const settings = {
    autoUpdate: input.autoUpdate !== false,
    analysisMode: sanitizeAnalysisMode(input.analysisMode, process.platform),
    cloud,
  };
  fs.writeFileSync(settingsFile(), JSON.stringify(settings, null, 2), "utf8");

  const nextSecret = String(cloudInput.secretAccessKey || "");
  if (nextSecret) {
    desktopSecretsStore.write({ r2SecretAccessKey: nextSecret });
  } else if (!cloud.enabled && fs.existsSync(secretsFile())) {
    desktopSecretsStore.clear();
  }
  return settingsForRenderer();
}

function cloudSettingsMatchLegacy(settings, secrets, legacy) {
  const cloud = settings.cloud || {};
  return cloud.enabled
    && cloud.bucket === legacy.bucket
    && cloud.accountId === legacy.accountId
    && cloud.endpointUrl === legacy.endpointUrl
    && cloud.publicBaseUrl === legacy.publicBaseUrl
    && cloud.prefix === legacy.prefix
    && cloud.accessKeyId === legacy.accessKeyId
    && secrets.r2SecretAccessKey === legacy.secretAccessKey;
}

function removeMigratedR2Values(legacyFile, sourceText) {
  const cleaned = stripLegacyR2Settings(sourceText);
  if (cleaned.trim()) fs.writeFileSync(legacyFile, cleaned, "utf8");
  else fs.rmSync(legacyFile);
}

function migrateLegacyCloudSettings() {
  const legacyFile = path.join(app.getPath("userData"), ".env.local");
  if (!fs.existsSync(legacyFile)) return false;
  const sourceText = fs.readFileSync(legacyFile, "utf8");
  const legacy = cloudSettingsFromLegacyEnv(parseEnv(sourceText));
  if (!legacy) return false;

  let settings = readDesktopSettings();
  let secrets = readDesktopSecrets();
  const hasCurrentCloudSettings = settings.cloud.enabled
    || settings.cloud.bucket
    || settings.cloud.accountId
    || settings.cloud.endpointUrl
    || settings.cloud.accessKeyId
    || secrets.r2SecretAccessKey;

  if (hasCurrentCloudSettings) {
    if (cloudSettingsMatchLegacy(settings, secrets, legacy)) {
      removeMigratedR2Values(legacyFile, sourceText);
      return true;
    }
    return false;
  }

  writeDesktopSettings({
    autoUpdate: settings.autoUpdate,
    cloud: legacy,
  });
  settings = readDesktopSettings();
  secrets = readDesktopSecrets();
  if (!cloudSettingsMatchLegacy(settings, secrets, legacy)) {
    throw new Error("旧R2設定を暗号化設定へ移行できませんでした");
  }
  removeMigratedR2Values(legacyFile, sourceText);
  return true;
}

if (process.platform === "win32") {
  const localAppData = process.env.LOCALAPPDATA
    || path.join(app.getPath("home"), "AppData", "Local");
  const practiceLabHome = path.join(localAppData, "PracticeLab");
  fs.mkdirSync(practiceLabHome, { recursive: true });
  app.setPath("userData", practiceLabHome);
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function pathsForRuntime() {
  const repositoryRoot = path.resolve(__dirname, "..");
  if (!app.isPackaged) {
    return {
      resourceDir: repositoryRoot,
      executable: process.platform === "win32"
        ? path.join(repositoryRoot, ".venv", "Scripts", "python.exe")
        : path.join(repositoryRoot, ".venv", "bin", "python"),
      args: [path.join(repositoryRoot, "desktop", "backend_entry.py")],
      binDir: null,
    };
  }
  return {
    resourceDir: path.join(process.resourcesPath, "app"),
    executable: path.join(
      process.resourcesPath,
      "backend",
      process.platform === "win32" ? "practice-lab-backend.exe" : "practice-lab-backend",
    ),
    args: [],
    binDir: path.join(process.resourcesPath, "bin"),
  };
}

function writeBackendLog(chunk) {
  const logDir = path.join(app.getPath("userData"), "logs");
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(path.join(logDir, "backend.log"), chunk);
}

function writePlaybackLog(input) {
  appendPlaybackEvent({
    fs,
    logDir: path.join(app.getPath("userData"), "logs"),
    input,
  });
}

async function waitForBackend(url, child, instanceId) {
  let lastError = null;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`バックエンドが終了しました (${child.exitCode})`);
    try {
      const response = await fetch(`${url}/healthz`, { signal: AbortSignal.timeout(1000) });
      const health = response.ok ? await response.json() : null;
      if (health?.instanceId === instanceId && child.exitCode === null) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw lastError || new Error("PracticeLabの起動がタイムアウトしました");
}

async function startBackend({ cloudSecret = "" } = {}) {
  const runtime = pathsForRuntime();
  const appHome = app.getPath("userData");
  const runtimeBin = runtime.binDir ? `${runtime.binDir}${path.delimiter}` : "";
  const desktopSettings = readDesktopSettings();
  const cloud = desktopSettings.cloud;
  const cloudEnabled = cloud.enabled && !!cloudSecret;
  const analysis = analysisEnvironment(desktopSettings.analysisMode, process.platform);
  let lastError = null;
  for (let startAttempt = 1; startAttempt <= 4; startAttempt += 1) {
    const port = await findFreePort();
    const url = `http://127.0.0.1:${port}`;
    const instanceId = randomBytes(16).toString("hex");
    const env = {
      ...process.env,
      PATH: `${runtimeBin}${process.env.PATH || ""}`,
      PRACTICE_LAB_DESKTOP: "1",
      PRACTICE_LAB_HOME: appHome,
      PRACTICE_LAB_RESOURCE_DIR: runtime.resourceDir,
      PRACTICE_LAB_PORT: String(port),
      PRACTICE_LAB_HOST: "127.0.0.1",
      PRACTICE_LAB_BACKEND_ORIGIN: url,
      PRACTICE_LAB_DESKTOP_TOKEN: desktopToken,
      PRACTICE_LAB_INSTANCE_ID: instanceId,
      PRACTICE_LAB_DEVICE_NAME: os.hostname(),
      PRACTICE_LAB_VERSION: app.getVersion(),
      PRACTICE_LAB_NODE_PATH: process.execPath,
      ELECTRON_RUN_AS_NODE: "1",
      PRACTICE_LAB_ANALYSIS_MODE: analysis.mode,
      ANALYZER_EXECUTOR: analysis.analyzerExecutor,
      ANALYZER_DEVICE: analysis.analyzerDevice,
      ANALYZER_TIMEOUT_SECONDS: "1800",
      ANALYZER_NO_OUTPUT_TIMEOUT_SECONDS: "0",
      STEM_DEVICE: analysis.stemDevice,
      STEM_TIMEOUT_SECONDS: "3600",
      STEM_NO_OUTPUT_TIMEOUT_SECONDS: "600",
      PRACTICE_LAB_SKIP_ENV_FILE: "1",
      R2_ENABLED: cloudEnabled ? "1" : "0",
      R2_BUCKET: cloud.bucket,
      CLOUDFLARE_ACCOUNT_ID: cloud.accountId,
      R2_ENDPOINT_URL: cloud.endpointUrl,
      R2_PUBLIC_BASE_URL: cloud.publicBaseUrl,
      R2_PREFIX: cloud.prefix,
      R2_ACCESS_KEY_ID: cloud.accessKeyId,
      R2_SECRET_ACCESS_KEY: cloudSecret,
    };
    const child = spawn(runtime.executable, runtime.args, {
      cwd: runtime.resourceDir,
      env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    backend = child;
    child.stdout.on("data", writeBackendLog);
    child.stderr.on("data", writeBackendLog);
    try {
      await waitForBackend(url, child, instanceId);
      backendUrl = url;
      mainWindow?.webContents.session.webRequest.onBeforeSendHeaders(
        { urls: [`${url}/*`] },
        (details, callback) => {
          details.requestHeaders["X-Practice-Lab-Desktop-Token"] = desktopToken;
          callback({ requestHeaders: details.requestHeaders });
        },
      );
      return url;
    } catch (error) {
      lastError = error;
      writeBackendLog(`Backend start attempt ${startAttempt} failed: ${error.message}\n`);
      if (child.exitCode === null) child.kill();
      await new Promise(resolve => {
        if (child.exitCode !== null) return resolve();
        child.once("exit", resolve);
        setTimeout(resolve, 1500);
      });
      if (backend === child) backend = null;
    }
  }
  throw lastError || new Error("PracticeLabのバックエンドを起動できませんでした");
}

async function restartBackend(options = {}) {
  const previous = backend;
  backend = null;
  if (previous && previous.exitCode === null) {
    previous.kill();
    await new Promise(resolve => {
      previous.once("exit", resolve);
      setTimeout(resolve, 2000);
    });
  }
  const url = await startBackend(options);
  await mainWindow?.loadURL(url);
}

function sendUpdateStatus(payload) {
  mainWindow?.webContents.send("desktop:update-status", payload);
}

let desktopUpdateMode;
function getDesktopUpdateMode() {
  if (desktopUpdateMode === undefined) {
    const developerIdSigned = app.isPackaged && process.platform === "darwin" && hasDeveloperIdSignature(
      spawnSync("/usr/bin/codesign", ["-dvv", path.resolve(process.resourcesPath, "../..")], { encoding: "utf8", timeout: 5000 }),
    );
    desktopUpdateMode = getUpdateMode({ packaged: app.isPackaged, platform: process.platform, developerIdSigned });
  }
  return desktopUpdateMode;
}

function configureUpdates() {
  if (getDesktopUpdateMode() !== "automatic") return;
  autoUpdater.autoDownload = true;
  // MornNotary produces a fresh signed ZIP; pre-signing blockmaps cannot be reused.
  if (process.platform === "darwin") autoUpdater.disableDifferentialDownload = true;
  autoUpdater.on("checking-for-update", () => sendUpdateStatus({ state: "checking" }));
  autoUpdater.on("update-available", info => sendUpdateStatus({ state: "available", version: info.version }));
  autoUpdater.on("update-not-available", () => sendUpdateStatus({ state: "current" }));
  autoUpdater.on("download-progress", progress => sendUpdateStatus({ state: "downloading", percent: Math.round(progress.percent) }));
  autoUpdater.on("update-downloaded", info => {
    updateDownloaded = true;
    sendUpdateStatus({ state: "downloaded", version: info.version });
  });
  autoUpdater.on("error", error => sendUpdateStatus({ state: "error", message: error.message }));
  if (readDesktopSettings().autoUpdate) {
    void checkForUpdates();
  }
}

function sendCommand(command) {
  mainWindow?.webContents.send("desktop:command", command);
}

async function checkForUpdates() {
  const mode = getDesktopUpdateMode();
  if (mode === "development") {
    const status = { state: "unsupported", message: "開発版ではアップデート確認を行いません。" };
    sendUpdateStatus(status);
    return status;
  }
  if (mode === "manual") {
    await shell.openExternal(RELEASES_LATEST_URL);
    const status = {
      state: "manual",
      message: "未署名のMac版は自動更新に対応していません。最新版の配布ページを開きました。",
    };
    sendUpdateStatus(status);
    return status;
  }
  sendUpdateStatus({ state: "checking" });
  try {
    await autoUpdater.checkForUpdates();
    return { state: "started" };
  } catch (error) {
    const status = { state: "error", message: error.message };
    sendUpdateStatus(status);
    return status;
  }
}

function configureApplicationMenu() {
  const fileMenu = {
    label: "ファイル",
    submenu: [
      { label: "新しい解析", accelerator: "CmdOrCtrl+N", click: () => sendCommand("new-analysis") },
      { label: "音声ファイルを開く", accelerator: "CmdOrCtrl+O", click: () => sendCommand("open-audio") },
      { type: "separator" },
      { label: "設定", accelerator: "CmdOrCtrl+,", click: () => sendCommand("open-settings") },
      { type: "separator" },
      process.platform === "darwin" ? { role: "close", label: "ウィンドウを閉じる" } : { role: "quit", label: "終了" },
    ],
  };
  const template = [
    ...(process.platform === "darwin" ? [{
      label: app.name,
      submenu: [
        { label: "PracticeLabについて", click: () => sendCommand("about") },
        { type: "separator" },
        { label: "設定", accelerator: "CmdOrCtrl+,", click: () => sendCommand("open-settings") },
        { type: "separator" },
        { role: "hide", label: "PracticeLabを隠す" },
        { role: "hideOthers", label: "ほかを隠す" },
        { role: "unhide", label: "すべて表示" },
        { type: "separator" },
        { role: "quit", label: "PracticeLabを終了" },
      ],
    }] : []),
    fileMenu,
    {
      label: "編集",
      submenu: [
        { role: "undo", label: "元に戻す" }, { role: "redo", label: "やり直す" },
        { type: "separator" },
        { role: "cut", label: "切り取り" }, { role: "copy", label: "コピー" }, { role: "paste", label: "貼り付け" },
        { role: "selectAll", label: "すべて選択" },
      ],
    },
    {
      label: "表示",
      submenu: [
        { role: "resetZoom", label: "実際のサイズ" },
        { role: "zoomIn", label: "拡大" },
        { role: "zoomOut", label: "縮小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "フルスクリーン" },
      ],
    },
    {
      label: "ウィンドウ",
      submenu: [
        { role: "minimize", label: "最小化" },
        ...(process.platform === "darwin" ? [{ role: "zoom", label: "拡大／縮小" }] : []),
        { role: "close", label: "閉じる" },
      ],
    },
    {
      label: "ヘルプ",
      submenu: [
        {
          label: process.platform === "darwin" ? "最新版の配布ページを開く" : "アップデートを確認",
          click: checkForUpdates,
        },
        { label: "データ保存場所を開く", click: () => shell.openPath(app.getPath("userData")) },
        { type: "separator" },
        { label: "PracticeLabについて", click: () => sendCommand("about") },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function createWindow() {
  const workArea = screen.getPrimaryDisplay().workArea;
  const width = Math.min(1280, Math.max(1024, workArea.width - 96));
  const height = Math.min(820, Math.max(700, workArea.height - 96));
  mainWindow = new BrowserWindow({
    width,
    height,
    x: Math.round(workArea.x + (workArea.width - width) / 2),
    y: Math.round(workArea.y + (workArea.height - height) / 2),
    minWidth: 1024,
    minHeight: 700,
    show: false,
    backgroundColor: "#111827",
    webPreferences: {
      // Audio beat reservations must continue while the window is hidden or minimized.
      backgroundThrottling: false,
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.center();
    mainWindow.show();
  });
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  mainWindow.webContents.on("will-attach-webview", event => event.preventDefault());
  const url = await startBackend();
  configureApplicationMenu();
  mainWindow.webContents.setWindowOpenHandler(details => {
    const target = new URL(details.url);
    if (target.origin === url) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
        },
      };
    }
    if (target.protocol === "https:") shell.openExternal(details.url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, targetUrl) => {
    if (new URL(targetUrl).origin !== url) event.preventDefault();
  });
  await mainWindow.loadURL(url);
  configureUpdates();
}

function requireTrustedIpc(event) {
  const senderUrl = event.senderFrame?.url || event.sender?.getURL?.() || "";
  let senderOrigin = "";
  try {
    senderOrigin = new URL(senderUrl).origin;
  } catch {}
  if (!backendUrl || senderOrigin !== backendUrl) throw new Error("許可されていない画面からの操作です");
}

ipcMain.handle("desktop:get-version", event => {
  requireTrustedIpc(event);
  return app.getVersion();
});
ipcMain.on("desktop:get-player-settings", event => {
  try {
    requireTrustedIpc(event);
  } catch (error) {
    event.returnValue = { error: error.message };
    return;
  }
  event.returnValue = readPlayerSettings();
});
ipcMain.on("desktop:save-player-settings", (event, payload) => {
  try {
    requireTrustedIpc(event);
    event.returnValue = { ok: true, settings: writePlayerSettings(payload) };
  } catch (error) {
    event.returnValue = { ok: false, message: error.message };
  }
});
ipcMain.on("desktop:log-playback-event", (event, payload) => {
  try {
    requireTrustedIpc(event);
    writePlaybackLog(payload);
  } catch {}
});
ipcMain.handle("desktop:get-settings", event => {
  requireTrustedIpc(event);
  try {
    migrateLegacyCloudSettings();
  } catch (error) {
    writeBackendLog(`Legacy R2 settings migration failed: ${error.message}\n`);
  }
  return settingsForRenderer();
});
ipcMain.handle("desktop:clear-cache", async event => {
  requireTrustedIpc(event);
  const browserSession = event.sender.session;
  const beforeBytes = await browserSession.getCacheSize();
  await browserSession.clearCache();
  const afterBytes = await browserSession.getCacheSize();
  return { removedBytes: Math.max(0, beforeBytes - afterBytes) };
});
ipcMain.handle("desktop:save-settings", (event, payload) => {
  requireTrustedIpc(event);
  const saved = writeDesktopSettings(payload);
  const cloudSecret = payload?.activateCloud && saved.cloud.enabled
    ? readDesktopSecrets().r2SecretAccessKey || ""
    : "";
  setTimeout(() => restartBackend({ cloudSecret }).catch(error => {
    dialog.showErrorBox("設定を反映できませんでした", error.stack || error.message);
  }), 350);
  return saved;
});
ipcMain.handle("desktop:export-cloud-connection", async event => {
  requireTrustedIpc(event);
  const settings = readDesktopSettings();
  const secret = readDesktopSecrets().r2SecretAccessKey;
  if (!settings.cloud.enabled || !secret) throw new Error("先に有効なクラウド連携設定を保存してください");
  const selected = await dialog.showSaveDialog(mainWindow, {
    title: "別の端末用の接続ファイルを保存",
    defaultPath: path.join(app.getPath("documents"), "PracticeLab-connection.practicelab-link"),
    filters: [
      { name: "PracticeLab接続ファイル", extensions: ["practicelab-link"] },
    ],
  });
  if (selected.canceled || !selected.filePath) return { canceled: true };
  const filePath = selected.filePath.toLowerCase().endsWith(".practicelab-link")
    ? selected.filePath
    : `${selected.filePath}.practicelab-link`;
  if (filePath !== selected.filePath && fs.existsSync(filePath)) {
    throw new Error("同名の接続ファイルがあります。別の名前を指定してください");
  }
  const exported = createConnectionFile({ ...settings.cloud, secretAccessKey: secret });
  fs.writeFileSync(filePath, exported.contents, { encoding: "utf8", mode: 0o600 });
  try {
    fs.chmodSync(filePath, 0o600);
  } catch {}
  return {
    canceled: false,
    fileName: path.basename(filePath),
    code: exported.code,
  };
});
ipcMain.handle("desktop:choose-cloud-connection", async event => {
  requireTrustedIpc(event);
  const selected = await dialog.showOpenDialog(mainWindow, {
    title: "PracticeLab接続ファイルを選択",
    properties: ["openFile"],
    filters: [
      { name: "PracticeLab接続ファイル", extensions: ["practicelab-link"] },
    ],
  });
  if (selected.canceled || selected.filePaths.length !== 1) return { canceled: true };
  const filePath = selected.filePaths[0];
  if (!filePath.toLowerCase().endsWith(".practicelab-link")) throw new Error("PracticeLab接続ファイルを選択してください");
  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size <= 0 || stat.size > MAX_CONNECTION_FILE_BYTES) {
    throw new Error("接続ファイルのサイズが正しくありません");
  }
  const now = Date.now();
  for (const [id, item] of selectedConnectionFiles) {
    if (item.expiresAt <= now) selectedConnectionFiles.delete(id);
  }
  const selectionId = randomBytes(24).toString("hex");
  selectedConnectionFiles.set(selectionId, { filePath, expiresAt: now + 10 * 60 * 1000 });
  return { canceled: false, selectionId, fileName: path.basename(filePath) };
});
ipcMain.handle("desktop:import-cloud-connection", (event, payload = {}) => {
  requireTrustedIpc(event);
  const selectionId = String(payload.selectionId || "");
  const selected = selectedConnectionFiles.get(selectionId);
  if (!selected || selected.expiresAt <= Date.now()) {
    selectedConnectionFiles.delete(selectionId);
    throw new Error("接続ファイルをもう一度選択してください");
  }
  const contents = fs.readFileSync(selected.filePath, "utf8");
  const cloud = openConnectionFile(contents, payload.code);
  selectedConnectionFiles.delete(selectionId);
  const saved = writeDesktopSettings({
    autoUpdate: readDesktopSettings().autoUpdate,
    cloud,
  });
  const cloudSecret = readDesktopSecrets().r2SecretAccessKey || "";
  setTimeout(() => restartBackend({ cloudSecret }).catch(error => {
    dialog.showErrorBox("設定を反映できませんでした", error.stack || error.message);
  }), 350);
  return saved;
});
ipcMain.handle("desktop:prepare-cloud", async event => {
  requireTrustedIpc(event);
  const settings = readDesktopSettings();
  if (!settings.cloud.enabled) return { configured: false };
  const cloudSecret = readDesktopSecrets().r2SecretAccessKey || "";
  if (!cloudSecret) throw new Error("クラウド連携の秘密鍵を確認できません。設定を保存し直してください");
  const response = await fetch(`${backendUrl}/desktop/cloud-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Practice-Lab-Desktop-Token": desktopToken,
    },
    body: JSON.stringify({ ...settings.cloud, secretAccessKey: cloudSecret }),
    signal: AbortSignal.timeout(5000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.detail || "クラウド設定を反映できませんでした");
  return result;
});
ipcMain.handle("desktop:open-data-folder", event => {
  requireTrustedIpc(event);
  return shell.openPath(app.getPath("userData"));
});
ipcMain.handle("desktop:check-for-updates", event => {
  requireTrustedIpc(event);
  return checkForUpdates();
});
ipcMain.handle("desktop:install-update", event => {
  requireTrustedIpc(event);
  if (updateDownloaded) autoUpdater.quitAndInstall(false, true);
  return updateDownloaded;
});

const hasLock = app.requestSingleInstanceLock();
if (!hasLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(createWindow).catch(error => {
    dialog.showErrorBox("PracticeLabを起動できません", error.stack || error.message);
    app.quit();
  });
}

app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => {
  if (backend && backend.exitCode === null) backend.kill();
});
