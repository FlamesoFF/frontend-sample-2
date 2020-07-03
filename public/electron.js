const userAgent = navigator.userAgent.toLowerCase();

if (~userAgent.indexOf(' electron/')) {
  // Electron-specific code
  console.log('Running in Electron!');

  const os = process.platform;
  const darwin = () => os == 'darwin';
  const win32 = () => os == 'win32';

  const remote = require('electron').remote;
  if (win32()) {
    remote.getCurrentWindow().on('maximize', () => {
      const maxBtn = document.querySelector('#maximize');
      maxBtn.innerHTML = `<i class="material-icons">fullscreen_exit</i>`;
    });
    remote.getCurrentWindow().on('unmaximize', () => {
      const maxBtn = document.querySelector('#maximize');
      maxBtn.innerHTML = `<i class="material-icons">fullscreen</i>`;
    });
  }

  if (darwin()) {
    remote.getCurrentWindow().on('enter-full-screen', () => {
      const titlebar = document.querySelector('#titlebar');
      titlebar.classList.add('full-screen');
    });
    remote.getCurrentWindow().on('leave-full-screen', () => {
      const titlebar = document.querySelector('#titlebar');
      titlebar.classList.remove('full-screen');
    });
  }

  const minimize = () => {
    remote.getCurrentWindow().minimize();
  };

  const maximize = () => {
    const window = remote.getCurrentWindow();
    const maxBtn = document.querySelector('#maximize');
    if (!window.isMaximized()) {
      window.maximize();
      maxBtn.innerHTML = `<i class="material-icons">fullscreen_exit</i>`;

    } else {
      window.unmaximize();
      maxBtn.innerHTML = `<i class="material-icons">fullscreen</i>`;

    }
  };

  const quit = () => {
    remote.app.quit();
  };

  const titlebar = document.createElement('div');
  titlebar.id = 'titlebar';
  if (darwin()) titlebar.ondblclick = maximize;

  titlebar.innerHTML = `
    <div id="version">v${remote.app.getVersion()}</div>
    <div class="title-buttons">
      <button type="button" title="Minimize" class="button" name="close" id="minimize">
        <i class="material-icons">remove</i>
      </button>
      <button type="button" title="Maximize" class="button" name="maximize" id="maximize">
        <i class="material-icons">${
          remote.getCurrentWindow().isMaximized()
            ? 'fullscreen_exit'
            : 'fullscreen'
        }</i>
      </button>
      <button type="button" title="Close" class="button" name="close" id="close">
        <i class="material-icons">close</i>
      </button>
    </div>
  `;

  titlebar.querySelector('#minimize').onclick = minimize;
  titlebar.querySelector('#maximize').onclick = maximize;
  titlebar.querySelector('#close').onclick = quit;

  document.onreadystatechange = () => {
    if (document.readyState == 'interactive') {
      const { body } = document;
      body.prepend(titlebar);
      body.classList.add(process.platform);
    }

    if (document.readyState == 'complete') {
      document.addEventListener('keydown', event => {
        // console.log(event);
        if (event.keyCode == 123) {
          const win = remote.getCurrentWindow();
          if (win.isDevToolsOpened()) win.closeDevTools();
          else win.openDevTools({ mode: 'detach' });
        }
      });

      if (remote.getCurrentWindow().isFullScreen()) {
        document.querySelector('#titlebar').classList.add('full-screen');
      }
    }
  };
}
