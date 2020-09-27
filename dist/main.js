const {app, BrowserWindow, shell, ipcMain, dialog} =require('electron');//引入electron
const path = require('path')
const renderProcessApi = path.join(__dirname, './preload.js')

let win;

function createWindow() {
  win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload:  renderProcessApi,//预加载全局的js脚本
        webSecurity: false,
        enableRemoteModule: true
      }
  })

  win.webContents.openDevTools();  //开启调试工具

  //在窗口内要展示的内容index.html 就是打包生成的index.html
  // win.loadURL(`file://${__dirname}/index.html`)

  win.loadURL(path.join(__dirname, 'index.html'));

  // win.loadFile('./index.html')

  win.on('close',() => {
      //回收BrowserWindow对象
      win = null;
    });
    win.on('resize',() => {
      win.reload();
    })

}

app.on('ready',createWindow);

app.on('window-all-closed',() => {
  app.quit();
});
app.on('activate',() => {
  if(win == null){
    createWindow();
  }
});


if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('my-vue-electron', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('my-vue-electron')
}

app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})