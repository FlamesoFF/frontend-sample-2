let remote;

if (isElectron()) remote = require('electron').remote;

export function isElectron() {
  const userAgent = navigator.userAgent.toLowerCase();
  return ~userAgent.indexOf(' electron/');
}

export function toggleDevTools() {
  if (isElectron()) {
    const win = remote.getCurrentWindow();

    if (win.isDevToolsOpened()) win.closeDevTools();
    else win.openDevTools({ mode: 'undocked' });

    // Not using the built-in .toggleDevTools()
    // because it does not support undocked mode.
  }
}
