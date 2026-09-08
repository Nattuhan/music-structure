const { app, BrowserWindow } = require('electron');
app.setPath('userData', process.env.PRACTICE_LAB_AUDIO_PROBE_PROFILE);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.whenReady().then(() => new BrowserWindow({
  show: false, width: 1400, height: 1000,
  webPreferences: { backgroundThrottling: false },
}).loadURL('about:blank'));
