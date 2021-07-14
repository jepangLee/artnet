import { app, BrowserWindow } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

let mainWindow: BrowserWindow;

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    center: true,
    fullscreen: false,
    fullscreenable: true,
    height: 680,
    kiosk: !isDev,
    resizable: true,
    webPreferences: {
      devTools: isDev,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    width: 900,
  });

  await mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.setResizable(true);

  mainWindow.on('closed', () => (mainWindow));
  mainWindow.focus();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow();
  }
});
