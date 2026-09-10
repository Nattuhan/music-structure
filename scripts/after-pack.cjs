const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function sign(pathToCode, entitlements) {
  const args = ["--force"];
  if (entitlements) args.push("--entitlements", entitlements);
  args.push("--sign", "-", pathToCode);
  const result = spawnSync("codesign", args, { encoding: "utf8" });

  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`Failed to apply an ad-hoc signature to ${pathToCode}${details ? `:\n${details}` : ""}`);
  }
}

module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") {
    return;
  }

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  const electronEntitlements = path.join(__dirname, "..", "desktop", "entitlements.mac.plist");
  const backendEntitlements = path.join(__dirname, "..", "desktop", "entitlements.backend.plist");
  const productName = context.packager.appInfo.productFilename;

  // MornNotary preserves entitlements already present in the submitted app.
  // Embed each process's minimum required rights here so a generic signer does
  // not need PracticeLab-specific paths or signing rules.
  sign(path.join(appPath, "Contents", "MacOS", productName), electronEntitlements);

  const frameworksPath = path.join(appPath, "Contents", "Frameworks");
  for (const entry of fs.readdirSync(frameworksPath, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith(`${productName} Helper`) || !entry.name.endsWith(".app")) continue;
    const helperName = entry.name.slice(0, -4);
    sign(path.join(frameworksPath, entry.name, "Contents", "MacOS", helperName), electronEntitlements);
  }

  sign(
    path.join(appPath, "Contents", "Resources", "backend", "practice-lab-backend"),
    backendEntitlements,
  );

  const result = spawnSync("codesign", [
    "--force", "--deep", "--preserve-metadata=entitlements", "--sign", "-", appPath,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`Failed to seal ${appPath}${details ? `:\n${details}` : ""}`);
  }
};
