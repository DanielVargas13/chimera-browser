//dependancies and stuff
const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
const electron = require('electron');
const Menu = electron.Menu;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
      width: 1024, 
      height: 600,
      minWidth: 640,
      minHeight: 380,
      frame: false,
      backgroundColor: "#343538",
      webviewTag: true,
      nodeIntegration: true,
      fullscreenable: true,
      plugins: true,
    })

    const template =
    [
      {
        label: 'File',
        submenu: [
          {
            label: 'Add Bookmark',
            click () { win.webContents.send('new-bookmark') },
            accelerator: 'CmdOrCtrl+D',
          },
          {
            label: 'New Tab',
            click () { win.webContents.send('new-tab') },
            accelerator: 'CmdOrCtrl+T',
          },
          {
            label: 'Home',
            click () { win.webContents.send('go-home') },
            accelerator: 'ALT+H',
          },
          {
            label: 'Library',
            click () { win.webContents.send('library') },
            accelerator: 'Ctrl+H',
          },
          {
            label: 'New Window',
            click () { },
            // click () { createWindow() },
            accelerator: 'CmdOrCtrl+N',
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {role: 'undo'},
          {role: 'redo'},
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy'},
          {role: 'paste'},
          {role: 'delete'},
          {role: 'selectall'}
        ]
      },
      {
        label: 'View',
        submenu: [
          // {role: 'reload'},
          {
            label: 'Reload',
            click () { win.webContents.send('refresh-tab') },
            accelerator: 'CmdOrCtrl+R',
          },
          {role: 'forcereload'},
          // {role: 'toggledevtools'},
          {
            label: 'Developer Tools',
            click () {} ,
            accelerator: 'CmdOrCtrl+Shift+I',
          },
          {type: 'separator'},
          {role: 'resetzoom'},
          {role: 'zoomin'},
          {role: 'zoomout'},
          {type: 'separator'},
          {role: 'togglefullscreen'}
        ]
      },
      {
        role: 'window',
        submenu: [
          {role: 'minimize'},
          // {role: 'close'}
          {
            label: 'Close Tab',
            click () { win.webContents.send('close-tab') },
            accelerator: 'Ctrl+W',
          },
          {
            label: 'Preferences',
            click () { win.webContents.send('settings') },
            accelerator: 'Alt+P',
          },
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'No help available yet',
            disabled: true,
          }
        ]
      }
    ]
  
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  

  // and load the app ui of the app.
  win.loadFile('browser-view/index.html')
    if (process.platform === "win32"){
      win.on('app-command', function(e, cmd) { //listen for back button
        if (cmd === 'browser-backward') {
          win.webContents.send('go-back')
        } else if (cmd === 'browser-forward') {
          win.webContents.send('go-fwd')
        }
      });
    }
}

app.on('ready', createWindow)

app.on('window-all-closed', () =>
{
  app.quit()
})

ipc.on('new-window', function (event, arg) {
  // browserWindow.setSheetOffset(38,34)
  createWindow()
})
