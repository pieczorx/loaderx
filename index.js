// const electron = require('electron');

console.log('siemanko z tej strony index electronowy');
const {app, BrowserWindow} = require('electron')
// const ipc = electron.ipcMain;
// ipc.on('downloadVideo', (x) => {
//   console.log(x);
// });
  function createWindow () {
    // Create the browser window.
    //win = new BrowserWindow({width: 400, height: 600, frame: false, transparent: true})
    //win = new BrowserWindow({width: 400, height: 600})
    let xd = new BrowserWindow({width: 420, height: 460, frame: false, transparent: true});
    xd.loadURL('file://' + __dirname + '/app/index.html');
  }

  app.on('ready', createWindow)
