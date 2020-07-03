'use strict';

import { app, protocol, BrowserWindow, Menu, MenuItem } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import createProtocol from 'vue-cli-plugin-electron-builder/lib/createProtocol.js';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });
function createMainWindow() {
  let options = {
    width: 500,
    minWidth: 440,
    height: 700,
    minHeight: 630,
    backgroundColor: '#eee',
    show: false,
  };

  if (process.platform == 'darwin') {
    options.titleBarStyle = 'hidden';
    options.icon = path.join(__static, 'electron.icns');

    const menu = new Menu();
    menu.append(new MenuItem(
      {
        label: 'Menu',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectall' },
          { type: 'separator' },
          { role: 'toggleDevTools' },
          { role: 'forceReload' },
        ]
      }
    ));
    Menu.setApplicationMenu(menu);
  }

  if (process.platform == 'win32') {
    options.autoHideMenuBar = true;
    options.frame = false;
    options.icon = path.join(__static, 'electron.ico');
  }

  const window = new BrowserWindow(options);

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST)
      window.webContents.openDevTools({ mode: 'detach' });
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
    // window.webContents.openDevTools({ mode: 'detach' });
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // mainWindow.openDevTools({ mode: 'detach' });
  });
});
