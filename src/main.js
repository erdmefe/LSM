const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const database = require('./database/database');

// Keep a global reference of the window object
let mainWindow;
// Keep track of the active profile
let activeProfileId = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'views/index.html'));

  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();

  // Handle window closed event
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Initialize the database before creating the window
app.whenReady().then(async () => {
  try {
    await database.initDatabase();
    console.log('Database initialized successfully');
    
    // Get the first profile or create default if none exist
    const profiles = await database.getAllProfiles();
    if (profiles && profiles.length > 0) {
      activeProfileId = profiles[0].id;
    }
    
    createWindow();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    dialog.showErrorBox(
      'Database Error', 
      'Failed to initialize database. Application may not function correctly.'
    );
    createWindow();
  }

  app.on('activate', function () {
    // On macOS, re-create a window when the dock icon is clicked
    if (mainWindow === null) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS, applications stay active until the user quits explicitly
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for profile operations
ipcMain.handle('get-all-profiles', async () => {
  try {
    return await database.getAllProfiles();
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
});

ipcMain.handle('get-profile', async (_, id) => {
  try {
    return await database.getProfileById(id);
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    return null;
  }
});

ipcMain.handle('create-profile', async (_, { name, description }) => {
  try {
    const id = await database.createProfile(name, description);
    return { success: true, id };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-profile', async (_, { id, name, description }) => {
  try {
    await database.updateProfile(id, name, description);
    return { success: true };
  } catch (error) {
    console.error(`Error updating profile ${id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-profile', async (_, id) => {
  try {
    await database.deleteProfile(id);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting profile ${id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-active-profile', async (_, id) => {
  activeProfileId = id;
  return { success: true };
});

ipcMain.handle('get-active-profile', async () => {
  return activeProfileId;
}); 