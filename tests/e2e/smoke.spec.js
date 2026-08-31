import { expect, test } from "@playwright/test";

const silentWav = (seconds = 1, sampleRate = 8000) => {
  const samples = Math.round(seconds * sampleRate);
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);
  return buffer;
};

const baselineStems = Object.fromEntries(
  ["vocals", "drums", "bass", "other"].map(name => [name, `/stems/e2e-baseline/${name}.wav`]),
);
const baselineSession = {
  id: "e2e-baseline",
  title: "E2E Baseline",
  bpm: 120,
  date: "2026-08-16",
  assets: { stems: baselineStems },
};
const baselineResult = {
  ...baselineSession,
  total_bars: 1,
  duration: 1,
  sections: [{ label: "verse", start_bar: 1, end_bar: 1, bar_count: 1, start_time: 0, end_time: 1, start_time_str: "00:00" }],
  beats: [0],
  downbeats: [0],
  assets: { stems: baselineStems },
};

const installDesktopSettingsMock = page => page.addInitScript(() => {
  window.practiceLabDesktop = {
    getSettings: async () => ({
      autoUpdate: true,
      updateMode: "manual",
      platform: "darwin",
      dataPath: "/Users/tester/Library/Application Support/PracticeLab",
      version: "1.1.4",
      cloud: { enabled: false, prefix: "sessions", hasSecret: false },
    }),
    saveSettings: async settings => settings,
    getToken: async () => "test-token",
    onUpdateStatus: () => () => {},
    onCommand: () => () => {},
  };
});

test.beforeEach(async ({ page }) => {
  await page.route("**/cloud/status", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ configured: true, bucket: "e2e-bucket" }),
  }));
  await page.route("**/results/manifest.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([baselineSession]),
  }));
  await page.route("**/results/e2e-baseline.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(baselineResult),
  }));
  await page.route("**/audio/e2e-baseline.mp3", route => route.abort());
  await page.route("**/stems/e2e-baseline/*.wav", route => route.fulfill({
    contentType: "audio/wav",
    body: silentWav(),
  }));
});

test("主要画面をネットワークCDNなしで開ける", async ({ page }) => {
  const dependencyRequests = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (["unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"].includes(url.hostname)) {
      dependencyRequests.push(url.href);
    }
  });

  await page.goto("/");
  await expect(page).toHaveTitle("PracticeLab");
  await expect(page.locator("#analyze-btn")).toBeAttached();
  await expect(page.getByRole("button", { name: "楽譜抽出", exact: true })).toBeVisible();
  await expect(page.locator("#btn-audio-file svg")).toBeAttached();
  expect(dependencyRequests).toEqual([]);
});

test("デスクトップ版は同期済み動画とパートをローカルから再生する", async ({ page }) => {
  const cloudAssets = {
    result: "https://media.example.test/sessions/e2e-baseline/session.json",
    audio: "https://media.example.test/sessions/e2e-baseline/audio.mp3",
    video: "https://media.example.test/sessions/e2e-baseline/video.mp4",
    stems: Object.fromEntries(
      ["vocals", "drums", "bass", "other"].map(name => [name, `https://media.example.test/sessions/e2e-baseline/stems/${name}.mp3`]),
    ),
  };
  await page.route("**/results/manifest.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{ ...baselineSession, assets: cloudAssets }]),
  }));
  await page.route("**/results/e2e-baseline.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ ...baselineResult, assets: cloudAssets }),
  }));
  const cloudRequests = [];
  page.on("request", request => {
    if (request.url().startsWith("https://media.example.test/")) cloudRequests.push(request.url());
  });

  // The fixture has no real MP4, so the video element removes its src after
  // the expected 404. Observe the request itself to verify local URL routing.
  const localVideoRequest = page.waitForRequest(request =>
    /\/video\/e2e-baseline\.mp4\?v=/.test(request.url()),
  );
  await page.goto("/");
  await localVideoRequest;
  expect(cloudRequests).toEqual([]);
});

test("可視操作を小さく潰さず文字を切らない", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  const issues = await page.locator("button").evaluateAll(buttons => buttons
    .filter(button => {
      const style = getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    })
    .map(button => {
      const rect = button.getBoundingClientRect();
      return {
        id: button.id,
        width: rect.width,
        height: rect.height,
        clipped: button.scrollWidth > button.clientWidth + 1 || button.scrollHeight > button.clientHeight + 1,
        outside: rect.left < -1 || rect.right > innerWidth + 1,
      };
    })
    .filter(button => button.width < 30 || button.height < 30 || button.clipped || button.outside));
  expect(issues).toEqual([]);
});

test("PCの動画全画面でも練習情報と操作を見渡せる", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".kbd-hint")).toHaveCount(0);
  await expect(page.locator("#meta-bars")).toBeVisible();
  await expect(page.locator("#btn-bpm-half")).toHaveText("半分");
  await expect(page.locator("#btn-bpm-double")).toHaveText("2倍");
  await expect(page.locator("#btn-bpm-reset")).toHaveText("元に戻す");
  const normalRows = await page.locator(".practice-controls > .transport-bar, .practice-controls > .vol-bar").evaluateAll(rows =>
    rows.map(row => row.getBoundingClientRect().top),
  );
  expect(normalRows[1]).toBeGreaterThan(normalRows[0]);
  await expect(page.locator("#video-wrap")).toHaveClass(/no-video/);
  await page.locator("#video-wrap").evaluate(videoWrap => {
    videoWrap.classList.remove("no-video");
    document.body.classList.add("video-fullscreen-mode");
  });

  const playerBox = await page.locator("#player-card").boundingBox();
  expect(playerBox).toEqual({ x: 0, y: 0, width: 1440, height: 900 });
  for (const selector of [
    "#btn-play",
    "#btn-restart",
    "#btn-loop",
    "#btn-metro",
    "#vol-music",
    "#vol-metro",
    "#meta-bpm",
    "#playback-rate",
    "#video-player",
    "#waveform",
    "#time-cur",
  ]) {
    await expect(page.locator(selector)).toBeVisible();
  }
  await expect(page.locator("#sections")).toBeHidden();
  await expect(page.locator("#meta-bars")).toBeHidden();
  const controlRows = await page.locator(".transport-controls, .volume-controls, .tempo-controls").evaluateAll(groups =>
    groups.map(group => {
      const rect = group.getBoundingClientRect();
      return Math.round(rect.top + rect.height / 2);
    }),
  );
  expect(Math.max(...controlRows) - Math.min(...controlRows)).toBeLessThanOrEqual(1);
  const clickLabel = await page.locator(".volume-controls .vol-item").nth(1).locator(".vol-lbl").evaluate(label => ({
    height: label.getBoundingClientRect().height,
    whiteSpace: getComputedStyle(label).whiteSpace,
  }));
  expect(clickLabel.whiteSpace).toBe("nowrap");
  expect(clickLabel.height).toBeLessThanOrEqual(20);
  const lowerRows = await page.locator(".waveform-wrap, .time-bar, .stats-bar").evaluateAll(rows =>
    rows.map(row => getComputedStyle(row).gridRowStart),
  );
  expect(new Set(lowerRows)).toEqual(new Set(["3"]));
  expect(await page.locator("#player-card").evaluate(player => player.scrollHeight <= player.clientHeight + 1)).toBe(true);
});

test("スマホ縦横で主要画面と設定全項目が画面内に収まる", async ({ page }) => {
  await installDesktopSettingsMock(page);
  const assertFitsViewport = async locator => {
    const fit = await locator.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
      };
    });
    expect(fit.left).toBeGreaterThanOrEqual(-1);
    expect(fit.top).toBeGreaterThanOrEqual(-1);
    expect(fit.right).toBeLessThanOrEqual(fit.viewportWidth + 1);
    expect(fit.bottom).toBeLessThanOrEqual(fit.viewportHeight + 1);
  };

  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

    await page.getByRole("button", { name: "新しい解析", exact: true }).click();
    await assertFitsViewport(page.locator("#analysis-dialog"));
    expect(await page.locator("#analysis-dialog").evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await page.getByRole("button", { name: "解析画面を閉じる" }).click();

    await page.locator("#btn-top-settings").click();
    const settings = page.locator("#settings-dialog");
    await assertFitsViewport(settings);
    await expect(settings.locator("#settings-save")).toBeVisible();
    for (const section of ["general", "analysis", "features", "cloud", "storage", "history", "updates", "about"]) {
      await settings.locator(`[data-settings-section="${section}"]`).click();
      const panel = settings.locator(`[data-settings-panel="${section}"]`);
      await expect(panel).toBeVisible();
      expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    await settings.locator("#settings-close").click();

    await page.getByRole("button", { name: "楽譜抽出", exact: true }).click();
    await expect(page.locator("#score-panel")).toBeVisible();
    const scoreOverflow = await page.locator("#score-panel").evaluate(panel => {
      const panelRect = panel.getBoundingClientRect();
      return [...panel.querySelectorAll("*")]
        .filter(element => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && rect.width > 0 && (rect.left < panelRect.left - 1 || rect.right > panelRect.right + 1);
        })
        .map(element => ({ tag: element.tagName, id: element.id, className: String(element.className), text: element.textContent?.trim().slice(0, 40) }));
    });
    expect(scoreOverflow).toEqual([]);
    await page.getByRole("button", { name: "曲構成", exact: true }).click();

    await page.locator("#btn-edit-sections").click();
    await assertFitsViewport(page.locator("#section-editor"));
    await expect(page.locator("#btn-save-sections")).toBeVisible();
    await page.locator("#section-editor").getByRole("button", { name: "閉じる" }).click();
  }
});

test("端末間同期ラベルをボタン中央に配置する", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#btn-cloud-sync")).toBeVisible();
  await expect(page.locator("#btn-cloud-sync")).toContainText("端末間同期");
  await expect(page.locator("#btn-cloud-sync .topbar-sync-content svg")).toBeVisible();
  const centers = await page.locator("#btn-cloud-sync").evaluate(button => {
    const content = button.querySelector(".topbar-sync-content");
    const icon = content.querySelector("svg");
    const buttonBox = button.getBoundingClientRect();
    const contentBox = content.getBoundingClientRect();
    const iconBox = icon.getBoundingClientRect();
    return {
      button: buttonBox.left + buttonBox.width / 2,
      content: contentBox.left + contentBox.width / 2,
      iconWidth: iconBox.width,
      iconVisible: getComputedStyle(icon).display !== "none" && getComputedStyle(icon).opacity === "1",
    };
  });
  expect(Math.abs(centers.button - centers.content)).toBeLessThanOrEqual(1);
  expect(centers.iconWidth).toBeGreaterThanOrEqual(13);
  expect(centers.iconVisible).toBe(true);
});

test("曲構成と楽譜抽出を切り替えられる", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#player-card")).toBeVisible();
  await page.getByRole("button", { name: "楽譜抽出", exact: true }).click();
  await expect(page.locator("#score-panel")).toBeVisible();
  await page.getByRole("button", { name: "曲構成", exact: true }).click();
  await expect(page.locator("#structure-panel")).toBeVisible();
});

test("処理履歴に所要時間と結果を表示する", async ({ page }) => {
  await installDesktopSettingsMock(page);
  await page.route("**/jobs/history", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{
      id: "history-analysis",
      stage: "done",
      message: "Complete",
      description: "Queued analysis",
      kind: "analysis",
      display_title: "テスト楽曲",
      done: true,
      started_at: 100,
      finished_at: 225.5,
      updated_at: 225.5,
      duration_seconds: 125.5,
    }]),
  }));

  await page.goto("/");
  await page.locator("#btn-top-settings").click();
  const dialog = page.locator("#settings-dialog");
  await dialog.getByRole("button", { name: "処理履歴", exact: true }).click();
  const placement = await dialog.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return {
      horizontalOffset: Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2),
      verticalOffset: Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2),
    };
  });
  expect(placement.horizontalOffset).toBeLessThanOrEqual(1);
  expect(placement.verticalOffset).toBeLessThanOrEqual(1);
  await expect(dialog.getByText("曲構成の解析 · テスト楽曲", { exact: true })).toBeVisible();
  await expect(dialog.getByText("2分 6秒", { exact: true })).toBeVisible();
  await expect(dialog.getByText("成功", { exact: true })).toBeVisible();
});

test("処理一覧を処理を消さずに最小化して再表示できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topbar-song")).toHaveText("E2E Baseline");
  await expect(page.locator("#topbar-song")).toBeVisible();
  await page.locator("#queue-dock").evaluate(dock => {
    dock.hidden = false;
    dock.querySelector("#queue-list").innerHTML = '<div class="queue-item running">処理中</div>';
  });

  await page.locator("#queue-toggle").click();
  await expect(page.locator("#queue-dock")).toHaveClass(/minimized/);
  await expect(page.locator("#queue-list")).toBeHidden();
  await expect(page.locator("#queue-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#queue-count")).toBeVisible();

  await page.locator("#queue-toggle").click();
  await expect(page.locator("#queue-dock")).not.toHaveClass(/minimized/);
  await expect(page.locator("#queue-list")).toBeVisible();
  await expect(page.locator("#queue-list")).toContainText("処理中");
});

test("古い処理履歴にもライブラリから曲名を補完する", async ({ page }) => {
  await installDesktopSettingsMock(page);
  await page.route("**/jobs/history", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{
      id: "e2e-baseline:stems:history:1",
      stage: "done",
      message: "Complete",
      kind: "stems",
      done: true,
      started_at: 100,
      finished_at: 110,
      updated_at: 110,
      duration_seconds: 10,
    }]),
  }));
  await page.goto("/");
  await page.locator("#btn-top-settings").click();
  const dialog = page.locator("#settings-dialog");
  await dialog.getByRole("button", { name: "処理履歴", exact: true }).click();
  await expect(dialog.getByText("パート分離 · E2E Baseline", { exact: true })).toBeVisible();
});

test("R2静的閲覧版では処理履歴を表示しない", async ({ page }) => {
  await page.addInitScript(() => {
    window.PRACTICE_LAB_CONFIG = { mode: "static", libraryBaseUrl: "results" };
  });
  let historyRequested = false;
  await page.route("**/jobs/history", route => {
    historyRequested = true;
    return route.abort();
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "処理履歴", exact: true })).toBeHidden();
  expect(historyRequested).toBe(false);
});

test("スマホのR2閲覧版は初回に曲一覧を開き、パート音源を遅延読み込みする", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    window.PRACTICE_LAB_CONFIG = { mode: "static", libraryBaseUrl: "results" };
  });
  await page.route("**/results/e2e-baseline/session.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(baselineResult),
  }));
  await page.route("**/results/e2e-baseline/audio.mp3", route => route.fulfill({
    contentType: "audio/wav",
    body: silentWav(),
  }));
  const stemRequests = [];
  page.on("request", request => {
    if (request.url().includes("/stems/e2e-baseline/")) stemRequests.push(request.url());
  });

  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/sidebar-open/);
  await expect(page.getByRole("button", { name: "曲を選ぶ" })).toBeVisible();
  await expect(page.getByText("E2E Baseline", { exact: true })).toBeVisible();

  await page.getByText("E2E Baseline", { exact: true }).click();
  await expect(page.locator("body")).not.toHaveClass(/sidebar-open/);
  await expect(page.locator("#stem-status")).toContainText("軽量再生");
  expect(stemRequests).toEqual([]);
});

test("再生中にループ端を連続ドラッグしても音源とクリック予約を多重化しない", async ({ page }) => {
  const result = {
    ...baselineResult,
    duration: 8,
    total_bars: 4,
    // Keep a future click voice scheduled throughout the drag so cancellation
    // is deterministic instead of depending on a 55 ms timing window.
    beats: Array.from({ length: 160 }, (_, index) => index * .05),
    downbeats: [0, 2, 4, 6],
    sections: [{ label: "verse", start_bar: 1, end_bar: 4, bar_count: 4, start_time: 0, end_time: 8, start_time_str: "00:00" }],
  };
  await page.route("**/results/e2e-baseline.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(result),
  }));
  await page.route("**/audio/e2e-baseline.mp3", route => route.fulfill({
    contentType: "audio/wav",
    body: silentWav(8),
  }));
  await page.route("**/stems/e2e-baseline/*.wav", route => route.fulfill({
    contentType: "audio/wav",
    body: silentWav(8),
  }));
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    const audit = window.__playbackAudit = {
      audioInstances: 0,
      mediaPlayCalls: 0,
      oscillatorStopCalls: 0,
      repeatedOscillatorStops: 0,
      stemNonBaseRateWrites: 0,
      diagnostics: [],
    };
    window.practiceLabDesktop = {
      logPlaybackEvent: event => audit.diagnostics.push(event),
      onUpdateStatus: () => () => {},
    };
    window.Audio = function Audio(...args) {
      audit.audioInstances += 1;
      return new NativeAudio(...args);
    };
    window.Audio.prototype = NativeAudio.prototype;
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      audit.mediaPlayCalls += 1;
      return nativePlay.apply(this, args);
    };
    const nativeCurrentTime = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "currentTime");
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      configurable: nativeCurrentTime.configurable,
      enumerable: nativeCurrentTime.enumerable,
      get() {
        const value = nativeCurrentTime.get.call(this);
        return this.src.includes("/stems/e2e-baseline/vocals.wav") ? value + .09 : value;
      },
      set(value) {
        return nativeCurrentTime.set.call(this, value);
      },
    });
    const nativePlaybackRate = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "playbackRate");
    Object.defineProperty(HTMLMediaElement.prototype, "playbackRate", {
      configurable: nativePlaybackRate.configurable,
      enumerable: nativePlaybackRate.enumerable,
      get() {
        return nativePlaybackRate.get.call(this);
      },
      set(value) {
        if (this.src.includes("/stems/e2e-baseline/") && Math.abs(value - 1) > .001) {
          audit.stemNonBaseRateWrites += 1;
        }
        return nativePlaybackRate.set.call(this, value);
      },
    });
    const NativeContext = window.AudioContext || window.webkitAudioContext;
    if (NativeContext) {
      const nativeCreateOscillator = NativeContext.prototype.createOscillator;
      NativeContext.prototype.createOscillator = function (...args) {
        const oscillator = nativeCreateOscillator.apply(this, args);
        const nativeStop = oscillator.stop.bind(oscillator);
        let stops = 0;
        oscillator.stop = (...stopArgs) => {
          stops += 1;
          audit.oscillatorStopCalls += 1;
          if (stops > 1) audit.repeatedOscillatorStops += 1;
          return nativeStop(...stopArgs);
        };
        return oscillator;
      };
    }
  });

  await page.goto("/");
  await expect(page.locator("#btn-play")).toBeEnabled();
  await page.locator("#btn-metro").click();
  await page.locator("#btn-play").click();
  const waveform = page.locator(".waveform-wrap");
  const box = await waveform.boundingBox();
  expect(box).not.toBeNull();
  await page.waitForTimeout(170);
  await page.mouse.click(box.x + box.width * .1, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .65, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('.loop-selection-handle[data-loop-handle="start"]')).toBeVisible();

  const beforeResize = await page.evaluate(() => ({ ...window.__playbackAudit }));
  const startHandle = page.locator('.loop-selection-handle[data-loop-handle="start"]');
  const handleBox = await startHandle.boundingBox();
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .45, box.y + box.height / 2, { steps: 60 });
  await page.mouse.up();
  await page.waitForTimeout(100);

  const audit = await page.evaluate(() => window.__playbackAudit);
  expect(audit.audioInstances).toBe(beforeResize.audioInstances);
  expect(audit.audioInstances).toBe(4);
  expect(audit.repeatedOscillatorStops).toBeGreaterThan(0);
  expect(audit.stemNonBaseRateWrites).toBe(0);
  expect(audit.mediaPlayCalls - beforeResize.mediaPlayCalls).toBeLessThan(16);
  expect(audit.diagnostics.some(event => event.type === "audio-play" && event.sessionId === "e2e-baseline")).toBe(true);
  expect(audit.diagnostics.some(event => event.type === "stem-resync" && event.forced === 0)).toBe(false);
});

test("パート書き出し操作を右パネル内に収める", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#stem-panel");
  const scope = page.locator("#stem-export-scope");
  const exportButton = page.locator("#btn-export-stem-mix");
  await expect(panel).toBeVisible();
  await expect(scope).toBeVisible();
  await expect(exportButton).toBeVisible();
  const panelBox = await panel.boundingBox();
  const scopeBox = await scope.boundingBox();
  const exportBox = await exportButton.boundingBox();
  expect(scopeBox.width).toBeGreaterThanOrEqual(88);
  expect(exportBox.x + exportBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width);
});

test("入力ポップアップをアプリ内の画面として表示する", async ({ page }) => {
  const browserDialogs = [];
  page.on("dialog", dialog => browserDialogs.push(dialog.type()));

  await page.goto("/");
  await page.getByRole("button", { name: "新しいフォルダー" }).click();
  const dialog = page.getByRole("dialog", { name: "フォルダーを追加" });
  await expect(dialog).toBeVisible();
  const closeButton = dialog.getByRole("button", { name: "閉じる" });
  await expect(closeButton).toHaveCSS("width", "34px");
  await expect(closeButton).toHaveCSS("height", "34px");
  await expect(closeButton).not.toHaveCSS("background-color", "rgb(255, 255, 255)");
  const box = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(Math.abs((box.x + box.width / 2) - viewport.width / 2)).toBeLessThan(3);
  expect(Math.abs((box.y + box.height / 2) - viewport.height / 2)).toBeLessThan(3);
  await expect(dialog.getByRole("textbox", { name: "フォルダー名" })).toHaveValue("新しいフォルダー");
  await dialog.getByRole("button", { name: "キャンセル" }).click();
  await expect(dialog).toBeHidden();
  expect(browserDialogs).toEqual([]);
});

test("新しい解析と再解析をプレイヤーを押し下げないモーダルで開く", async ({ page }) => {
  const session = { id: "analysis-modal", title: "Modal Test", bpm: 120, date: "2026-08-16" };
  const result = {
    ...session,
    sourceVideoId: "D8AZyKMBVVY",
    total_bars: 1,
    duration: 4,
    sections: [{ label: "verse", start_bar: 1, end_bar: 1, bar_count: 1, start_time: 0, end_time: 4, start_time_str: "00:00" }],
    beats: [],
    downbeats: [0],
  };
  await page.route("**/results/manifest.json", route => route.fulfill({ contentType: "application/json", body: JSON.stringify([session]) }));
  await page.route("**/results/analysis-modal.json", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(result) }));
  await page.route("**/audio/analysis-modal.mp3", route => route.abort());

  await page.goto("/");
  await expect(page.locator("#player-card")).toBeVisible();
  await expect(page.getByRole("button", { name: "この曲を再解析" })).toBeVisible();
  const playerBefore = await page.locator("#player-card").boundingBox();
  await page.getByRole("button", { name: "新しい解析", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "練習したい曲を追加" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "解析画面を閉じる" })).toBeVisible();
  const playerWhileOpen = await page.locator("#player-card").boundingBox();
  expect(playerWhileOpen.y).toBe(playerBefore.y);
  await dialog.getByRole("button", { name: "解析画面を閉じる" }).click();

  await page.getByRole("button", { name: "この曲を再解析" }).click();
  await expect(page.getByRole("dialog", { name: "この曲を再解析" })).toBeVisible();
  await expect(page.locator("#url-input")).toHaveValue("https://www.youtube.com/watch?v=D8AZyKMBVVY");
  await expect(page.locator("#analyze-btn")).toHaveText("再解析を開始");
});

test("再起動で中断したジョブを利用者が再開できる", async ({ page }) => {
  await page.route("**/jobs?recoverable=true", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{
      id: "recovery-test",
      stage: "interrupted",
      message: "Application restarted; resume when ready",
      description: "Queued analysis",
      kind: "analysis",
      display_title: "再開対象の曲",
      done: true,
      interrupted: true,
      resumable: true,
      started_at: Date.now() / 1000,
    }]),
  }));
  await page.route("**/jobs/recovery-test/resume", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ jobId: "recovery-test", stage: "queued", message: "Queued analysis" }),
  }));
  await page.route("**/jobs/recovery-test/cancel-interrupted", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ ok: true }),
  }));

  await page.goto("/");
  const resume = page.getByRole("button", { name: "再開", exact: true });
  await expect(resume).toBeVisible();
  await expect(page.getByText("曲構成の解析 · 再開対象の曲", { exact: true })).toBeVisible();
  await expect(page.getByText(/8170秒|8339秒/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "キャンセル", exact: true })).toBeVisible();
  await resume.click();
  await expect(resume).toBeHidden();
});

test("未対応バックエンドではキャンセル成功扱いにしない", async ({ page }) => {
  await page.route("**/jobs?recoverable=true", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([{
      id: "old-backend-job",
      stage: "interrupted",
      message: "Application restarted; resume when ready",
      description: "Queued stem separation",
      kind: "stems",
      display_title: "削除対象の曲",
      done: true,
      interrupted: true,
      resumable: true,
    }]),
  }));
  await page.route("**/jobs/old-backend-job/cancel-interrupted", route => route.fulfill({ status: 405, contentType: "application/json", body: JSON.stringify({ detail: "Method Not Allowed" }) }));

  await page.goto("/");
  await expect(page.getByText("パート分離 · 削除対象の曲", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "キャンセル", exact: true }).click();
  await expect(page.getByText("このアプリはキャンセル処理に未対応です。バックエンドを含む修正版へ更新してください", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page.getByText("パート分離 · 削除対象の曲", { exact: true })).toBeVisible();
});

test("曲名とタグでライブラリを検索できる", async ({ page }) => {
  const session = {
    id: "library-test",
    title: "Midnight Practice",
    bpm: 120,
    date: "2026-08-10",
    tags: ["ライブ"],
  };
  await page.route("**/results/manifest.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify([session]),
  }));
  await page.route("**/results/library-test.json", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ ...session, total_bars: 0, duration: 0, sections: [], beats: [], downbeats: [] }),
  }));
  await page.route("**/audio/library-test.mp3", route => route.abort());

  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "曲名・タグを検索" });
  await expect(page.locator("#sidebar-list").getByText("Midnight Practice", { exact: true })).toBeVisible();
  await search.fill("ライブ");
  await expect(page.locator("#sidebar-list").getByText("Midnight Practice", { exact: true })).toBeVisible();
  await search.fill("存在しない曲");
  await expect(page.getByText("条件に一致する曲がありません", { exact: true })).toBeVisible();
});

test("セクション編集のスクラブ中は音声を止めて動画だけ追従する", async ({ page }) => {
  const assets = { video: "/video/section-test.mp4" };
  const session = { id: "section-test", title: "Section Test", bpm: 120, date: "2026-08-10", assets };
  const result = {
    ...session,
    total_bars: 4,
    duration: 4,
    sections: [{ label: "verse", start_bar: 1, end_bar: 4, bar_count: 4, start_time: 0, end_time: 4, start_time_str: "00:00" }],
    beats: [],
    downbeats: [0, 1, 2, 3],
    assets,
  };
  let saved = null;
  await page.route("**/results/manifest.json", route => route.fulfill({ contentType: "application/json", body: JSON.stringify([session]) }));
  await page.route("**/results/section-test.json", route => route.fulfill({ contentType: "application/json", body: JSON.stringify(result) }));
  await page.route("**/audio/section-test.mp3", route => route.fulfill({ contentType: "audio/wav", body: silentWav(4) }));
  await page.route("**/video/section-test.mp4*", route => route.fulfill({ contentType: "audio/wav", body: silentWav(4) }));
  await page.route("**/results/section-test/sections", async route => {
    if (route.request().method() !== "PUT") return route.continue();
    saved = route.request().postDataJSON();
    const sections = saved.sections.map(section => ({
      label: section.label,
      start_bar: section.startBar,
      end_bar: section.endBar,
      bar_count: section.endBar - section.startBar + 1,
      start_time: section.startBar - 1,
      end_time: section.endBar,
      start_time_str: `00:0${section.startBar - 1}`,
    }));
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ ...result, sections, automaticSections: result.sections }) });
  });

  await page.goto("/");
  await page.locator("#video-player").evaluate(video => {
    let currentTime = 0;
    Object.defineProperty(video, "readyState", { configurable: true, get: () => 4 });
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      get: () => currentTime,
      set: value => { currentTime = Number(value) || 0; },
    });
  });
  await page.locator("#btn-edit-sections").click();
  await expect(page.getByText("区間を選択", { exact: true })).toBeVisible();
  await expect(page.getByLabel("曲をプレビュー")).toBeVisible();
  await expect(page.getByRole("slider", { name: "曲の再生位置" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "再生インジケーター" })).toBeVisible();
  await expect(page.locator("#section-editor-waveform")).toBeVisible();
  await expect(page.locator(".section-editor-stage #section-editor-waveform")).toHaveCount(1);
  await expect(page.locator(".section-editor-grid-minor")).toHaveCount(1);
  await expect(page.locator(".section-editor-grid-major")).toHaveCount(1);
  await expect(page.locator(".section-editor-wave-texture, .section-editor-wave-base")).toHaveCount(0);
  const playhead = page.getByRole("slider", { name: "再生インジケーター" });
  await expect.poll(async () => Number(await playhead.getAttribute("aria-valuemax"))).toBeGreaterThan(0);
  const playheadBox = await playhead.boundingBox();
  const scrubBox = await page.getByRole("slider", { name: "曲の再生位置" }).boundingBox();
  expect(playheadBox).not.toBeNull();
  expect(scrubBox).not.toBeNull();
  const playerToggle = page.locator("#section-editor-player-toggle");
  await playerToggle.click();
  await expect(playerToggle).toHaveAttribute("data-playing", "true");
  await page.mouse.move(playheadBox.x + playheadBox.width / 2, playheadBox.y + playheadBox.height / 2);
  await page.mouse.down();
  await expect(playerToggle).toHaveAttribute("data-playing", "false");
  await page.mouse.move(scrubBox.x + scrubBox.width * .7, scrubBox.y + scrubBox.height / 2);
  await expect.poll(() => page.locator("#video-player").evaluate(video => video.currentTime)).toBeGreaterThan(2.5);
  await expect(playerToggle).toHaveAttribute("data-playing", "false");
  await page.mouse.up();
  await expect(playerToggle).toHaveAttribute("data-playing", "true");
  await expect.poll(async () => Number(await playhead.getAttribute("aria-valuenow"))).toBeGreaterThan(.5);
  await expect(page.getByLabel("選択中のセクション名")).toHaveValue("Aメロ");
  await page.getByRole("button", { name: "中央で分割", exact: true }).click();
  await expect(page.locator(".section-editor-segment")).toHaveCount(2);
  await expect(page.getByLabel("選択中のセクション名")).toHaveValue("Aメロ");
  await page.locator("#btn-save-sections").click();
  await expect.poll(() => saved?.sections?.length).toBe(2);
  expect(saved.sections.map(section => [section.startBar, section.endBar])).toEqual([[1, 2], [3, 4]]);
  expect(saved.sections.map(section => section.label)).toEqual(["Aメロ", "Aメロ"]);
});

test("容量を確認して再生成可能なキャッシュだけを整理できる", async ({ page }) => {
  await installDesktopSettingsMock(page);
  let cleanupRequest = null;
  const report = {
    totalBytes: 3072,
    categories: [
      { key: "work", label: "作業キャッシュ", bytes: 1024, files: 2, cleanup: true },
      { key: "source-audio", label: "元音声", bytes: 2048, files: 1, cleanup: false },
    ],
  };
  await page.route("**/storage", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(report),
  }));
  await page.route("**/storage/cleanup", async route => {
    cleanupRequest = route.request().postDataJSON();
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ removedBytes: 1024, removedFiles: 2, report: { ...report, totalBytes: 2048, categories: report.categories.map(category => category.key === "work" ? { ...category, bytes: 0, files: 0 } : category) } }),
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "容量とキャッシュ" }).click();
  await expect(page.getByText("作業キャッシュ", { exact: true })).toBeVisible();
  await expect(page.getByText("元音声", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "整理", exact: true })).toHaveCount(1);
  await page.getByRole("button", { name: "整理", exact: true }).click();
  const confirmDialog = page.getByRole("dialog", { name: "キャッシュを整理" });
  await expect(confirmDialog).toBeVisible();
  await confirmDialog.getByRole("button", { name: "整理する" }).click();
  await expect.poll(() => cleanupRequest).toEqual({ categories: ["work"] });
  await expect(page.locator("#storage-total")).toContainText("1.00 KB削除");
});

test("デスクトップ設定で利用者ごとのクラウド連携を編集できる", async ({ page }) => {
  await page.setViewportSize({ width: 1060, height: 768 });
  await page.addInitScript(() => {
    window.practiceLabDesktop = {
      getSettings: async () => ({
        autoUpdate: true,
        dataPath: "C:\\Users\\tester\\AppData\\Local\\PracticeLab",
        version: "1.0.0",
        cloud: { enabled: false, prefix: "sessions", hasSecret: false },
      }),
      saveSettings: async settings => settings,
      openDataFolder: async () => "",
      checkForUpdates: async () => true,
      getToken: async () => "test-token",
      onUpdateStatus: () => () => {},
      onCommand: () => () => {},
    };
  });
  await page.goto("/");
  const topSettings = page.locator("#btn-top-settings");
  await expect(topSettings).toBeVisible();
  await expect(topSettings).toHaveCSS("height", "38px");
  await topSettings.click();
  const settings = page.locator("#settings-dialog");
  await expect(settings).toBeVisible();
  const settingsBox = await settings.boundingBox();
  const viewport = page.viewportSize();
  expect(settingsBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(Math.abs(settingsBox.x + settingsBox.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
  expect(Math.abs(settingsBox.y + settingsBox.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(1);
  await settings.getByRole("button", { name: "クラウド連携" }).click();
  await expect(settings.getByText("自分のCloudflare R2と連携")).toBeVisible();
  const sections = settings.locator(".settings-sections");
  await expect.poll(() => sections.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  await sections.hover();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => sections.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect(settings.locator("#settings-save")).toBeVisible();
  await settings.getByRole("checkbox", { name: /クラウド連携を有効/ }).check();
  await expect(settings.getByLabel("R2 バケット名")).toBeEnabled();
  await expect(settings.getByRole("button", { name: "接続ファイルを書き出す" })).toBeDisabled();
  await expect(settings.getByRole("button", { name: "接続ファイルを読み込む" })).toBeEnabled();
});

test("暗号化接続ファイルを書き出して別端末の設定を読み込める", async ({ page }) => {
  await page.addInitScript(() => {
    window.__importedCloudConnection = null;
    window.practiceLabDesktop = {
      getSettings: async () => ({
        autoUpdate: true,
        dataPath: "C:\\Users\\tester\\AppData\\Local\\PracticeLab",
        version: "1.0.0",
        cloud: { enabled: true, bucket: "practice-lab", prefix: "sessions", hasSecret: true },
      }),
      exportCloudConnection: async () => ({
        canceled: false,
        fileName: "PracticeLab-connection.practicelab-link",
        code: "0123-4567-89AB-CDEF-0123-4567-89AB-CDEF",
      }),
      chooseCloudConnection: async () => ({
        canceled: false,
        selectionId: "selection-1",
        fileName: "PracticeLab-connection.practicelab-link",
      }),
      importCloudConnection: async payload => {
        window.__importedCloudConnection = structuredClone(payload);
        return { autoUpdate: true, cloud: { enabled: true, hasSecret: true } };
      },
      saveSettings: async settings => settings,
      openDataFolder: async () => "",
      checkForUpdates: async () => true,
      onUpdateStatus: () => () => {},
      onCommand: () => () => {},
    };
  });
  await page.goto("/");
  await page.locator("#btn-top-settings").click();
  const settings = page.locator("#settings-dialog");
  await settings.getByRole("button", { name: "クラウド連携" }).click();

  await settings.getByRole("button", { name: "接続ファイルを書き出す" }).click();
  const reveal = page.getByRole("dialog", { name: "接続ファイルを保存しました" });
  await expect(reveal.locator("input")).toHaveValue("0123-4567-89AB-CDEF-0123-4567-89AB-CDEF");
  await expect(reveal.locator("input")).toHaveAttribute("readonly", "");
  await reveal.locator("#app-dialog-confirm").click();

  await settings.getByRole("button", { name: "接続ファイルを読み込む" }).click();
  const importDialog = page.getByRole("dialog", { name: "接続ファイルを読み込む" });
  await expect(importDialog.locator("input")).toHaveAttribute("type", "password");
  await importDialog.locator("input").fill("0123-4567-89AB-CDEF-0123-4567-89AB-CDEF");
  await importDialog.getByRole("button", { name: "読み込む" }).click();
  await expect.poll(() => page.evaluate(() => window.__importedCloudConnection)).toEqual({
    selectionId: "selection-1",
    code: "0123-4567-89AB-CDEF-0123-4567-89AB-CDEF",
  });
});

test("デスクトップの再生設定を固定保存先から復元して変更を保存する", async ({ page }) => {
  await page.addInitScript(() => {
    window.__savedPlayerSettings = null;
    window.practiceLabDesktop = {
      getPlayerSettings: () => ({ volMusic: 37, volMetro: 64, playbackRate: 0.8 }),
      savePlayerSettings: settings => {
        window.__savedPlayerSettings = structuredClone(settings);
        return { ok: true, settings };
      },
      getSettings: async () => ({ autoUpdate: true, version: "1.0.0", cloud: { enabled: false } }),
      getToken: async () => "test-token",
      onUpdateStatus: () => () => {},
      onCommand: () => () => {},
    };
  });
  await page.goto("/");
  await expect(page.locator("#vol-music")).toHaveValue("37");
  await expect(page.locator("#vol-metro")).toHaveValue("64");
  await expect(page.locator("#playback-rate")).toHaveValue("0.8");

  await page.locator("#vol-music").evaluate(element => {
    element.value = "52";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect.poll(() => page.evaluate(() => window.__savedPlayerSettings?.volMusic)).toBe(52);
});

test("アップデート確認の結果を設定画面へ表示する", async ({ page }) => {
  await page.addInitScript(() => {
    let updateListener = () => {};
    window.practiceLabDesktop = {
      getPlayerSettings: () => ({}),
      savePlayerSettings: settings => ({ ok: true, settings }),
      getSettings: async () => ({ autoUpdate: true, version: "1.0.0", cloud: { enabled: false } }),
      getToken: async () => "test-token",
      checkForUpdates: async () => {
        updateListener({ state: "current" });
        return { state: "started" };
      },
      installUpdate: async () => false,
      onUpdateStatus: callback => {
        updateListener = callback;
        return () => {};
      },
      onCommand: () => () => {},
    };
  });
  await page.goto("/");
  await page.locator("#btn-top-settings").click();
  await page.getByRole("button", { name: "アップデート", exact: true }).click();
  await page.getByRole("button", { name: "アップデートを確認" }).click();
  await expect(page.locator("#settings-update-status")).toHaveText("現在のバージョンが最新です。");
});
