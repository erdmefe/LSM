const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const database = require('./database/database');
const animalModel = require('./database/animalModel');

// Keep a global reference of the window object
let mainWindow;
// Keep track of the active profile
let activeProfileId = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Menü çubuğunu kaldır
  Menu.setApplicationMenu(null);

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
    const profiles = await database.all('SELECT * FROM profiles LIMIT 1');
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
    return await database.all('SELECT * FROM profiles ORDER BY name');
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
});

ipcMain.handle('get-profile', async (_, id) => {
  try {
    return await database.get('SELECT * FROM profiles WHERE id = ?', [id]);
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    return null;
  }
});

ipcMain.handle('create-profile', async (_, { name, description }) => {
  try {
    const result = await database.run(
      'INSERT INTO profiles (name, description) VALUES (?, ?)',
      [name, description || '']
    );
    return { success: true, id: result.lastID };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-profile', async (_, { id, name, description }) => {
  try {
    await database.run(
      'UPDATE profiles SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );
    return { success: true };
  } catch (error) {
    console.error(`Error updating profile ${id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-profile', async (_, id) => {
  try {
    await database.executeTransaction(async () => {
      // İlişkili tüm verileri sil
      await database.run('DELETE FROM animal_types WHERE profile_id = ?', [id]);
      await database.run('DELETE FROM animals WHERE profile_id = ?', [id]);
      await database.run('DELETE FROM transactions WHERE profile_id = ?', [id]);
      await database.run('DELETE FROM profiles WHERE id = ?', [id]);
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting profile ${id}:`, error);
    return { success: false, error: error.message };
  }
});

// Hayvan Türleri API
ipcMain.handle('get-animal-types', async (_, profileId) => {
  try {
    return await animalModel.types.getAll(profileId);
  } catch (error) {
    console.error('Error fetching animal types:', error);
    return [];
  }
});

ipcMain.handle('create-animal-type', async (_, typeData) => {
  try {
    return await animalModel.types.create(typeData);
  } catch (error) {
    console.error('Error creating animal type:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-animal-type', async (_, typeData) => {
  try {
    return await animalModel.types.update(typeData);
  } catch (error) {
    console.error(`Error updating animal type ${typeData.id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-animal-type', async (_, typeId) => {
  try {
    return await animalModel.types.delete(typeId);
  } catch (error) {
    console.error(`Error deleting animal type ${typeId}:`, error);
    return { success: false, error: error.message };
  }
});

// Hayvanlar API
ipcMain.handle('get-all-animals', async (_, profileId) => {
  try {
    return await animalModel.animals.getAll(profileId);
  } catch (error) {
    console.error('Error fetching animals:', error);
    return [];
  }
});

ipcMain.handle('get-animal', async (_, animalId) => {
  try {
    return await animalModel.animals.getById(animalId);
  } catch (error) {
    console.error(`Error fetching animal ${animalId}:`, error);
    return null;
  }
});

ipcMain.handle('create-animal', async (_, animalData) => {
  try {
    return await animalModel.animals.create(animalData);
  } catch (error) {
    console.error('Error creating animal:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-animal', async (_, animalData) => {
  try {
    return await animalModel.animals.update(animalData);
  } catch (error) {
    console.error(`Error updating animal ${animalData.id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-animal', async (_, animalId) => {
  try {
    return await animalModel.animals.delete(animalId);
  } catch (error) {
    console.error(`Error deleting animal ${animalId}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-animal-stats', async (_, profileId) => {
  try {
    return await animalModel.animals.getStats(profileId);
  } catch (error) {
    console.error(`Error getting animal stats for profile ${profileId}:`, error);
    return null;
  }
});

// Uygulama kapatılırken veritabanı bağlantısını kapat
app.on('will-quit', async () => {
  try {
    await database.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Failed to close database:', error);
  }
});

ipcMain.handle('set-active-profile', async (_, id) => {
  activeProfileId = id;
  return { success: true };
});

ipcMain.handle('get-active-profile', async () => {
  return activeProfileId;
}); 