const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const database = require('./database/database');
const animalModel = require('./database/animalModel');
const healthRecordModel = require('./database/healthRecordModel');
const milkRecordModel = require('./database/milkRecordModel');
const breedingRecordModel = require('./database/breedingRecordModel');
const profileModel = require('./database/profileModel');

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

  // DevTools'u aç
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

// Sağlık Kayıtları API
ipcMain.handle('get-all-health-records', async (_, profileId) => {
  try {
    console.log('Main process: get-all-health-records called with profileId:', profileId);
    
    if (!profileId || profileId <= 0) {
      console.error('Main process: Invalid profile ID:', profileId);
      return [];
    }
    
    // Test için profildeki hayvanları sorgula
    const animals = await database.all("SELECT id FROM animals WHERE profile_id = ?", [profileId]);
    console.log(`Main process: Found ${animals.length} animals for profile ${profileId}`);
    
    const records = await healthRecordModel.getHealthRecordsByProfile(profileId);
    console.log('Main process: Found records count:', records.length);
    if (records.length > 0) {
      console.log('Main process: Sample record:', records[0]);
    }
    return records;
  } catch (error) {
    console.error('Error fetching health records:', error);
    return [];
  }
});

ipcMain.handle('create-health-record', async (_, recordData) => {
  try {
    console.log('Main process: create-health-record called with data:', JSON.stringify(recordData, null, 2));
    
    // Validate the input data
    if (!recordData.animal_id) {
      console.error('Main process: Missing animal_id in health record data');
      return { success: false, error: 'Hayvan seçilmedi.' };
    }
    
    if (!recordData.date && !recordData.record_date) {
      console.error('Main process: Missing date in health record data');
      return { success: false, error: 'İşlem tarihi girilmedi.' };
    }
    
    // Ensure we use record_date as expected by the database model
    if (recordData.date && !recordData.record_date) {
      recordData.record_date = recordData.date;
    }
    
    const id = await healthRecordModel.createHealthRecord(recordData);
    console.log('Main process: Successfully created health record with ID:', id);
    return { success: true, id };
  } catch (error) {
    console.error('Main process: Error creating health record:', error);
    
    // Return a more descriptive error message
    let errorMessage = 'Sağlık kaydı oluşturulurken bir hata oluştu.';
    if (error.userMessage) {
      errorMessage = error.userMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('update-health-record', async (_, recordData) => {
  try {
    await healthRecordModel.updateHealthRecord(recordData);
    return { success: true };
  } catch (error) {
    console.error(`Error updating health record ${recordData.id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-health-record', async (_, recordId) => {
  try {
    await healthRecordModel.deleteHealthRecord(recordId);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting health record ${recordId}:`, error);
    return { success: false, error: error.message };
  }
});

// Sağım Kayıtları API
ipcMain.handle('get-all-milk-records', async (_, profileId) => {
  try {
    console.log('Main process: get-all-milk-records called with profileId:', profileId);
    
    if (!profileId || profileId <= 0) {
      console.error('Main process: Invalid profile ID:', profileId);
      return [];
    }
    
    // Profildeki sağılabilir hayvanları kontrol et
    const milkingAnimals = await database.all(
      "SELECT id FROM animals WHERE profile_id = ? AND (status = 'Sağmal' OR status = 'Gebe') AND status != 'Kuruda'", 
      [profileId]
    );
    console.log(`Main process: Found ${milkingAnimals.length} milkable animals for profile ${profileId}`);
    
    const records = await milkRecordModel.getMilkRecordsByProfile(profileId);
    console.log('Main process: Found milk records count:', records.length);
    if (records.length > 0) {
      console.log('Main process: Sample milk record:', records[0]);
    }
    return records;
  } catch (error) {
    console.error('Error fetching milk records:', error);
    return [];
  }
});

ipcMain.handle('create-milk-record', async (_, recordData) => {
  try {
    const id = await milkRecordModel.createMilkRecord(recordData);
    return { success: true, id };
  } catch (error) {
    console.error('Error creating milk record:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-milk-record', async (_, recordData) => {
  try {
    await milkRecordModel.updateMilkRecord(recordData);
    return { success: true };
  } catch (error) {
    console.error(`Error updating milk record ${recordData.id}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-milk-record', async (_, recordId) => {
  try {
    await milkRecordModel.deleteMilkRecord(recordId);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting milk record ${recordId}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-milk-stats', async (_, profileId, options) => {
  try {
    const stats = await milkRecordModel.getMilkStats(profileId, options);
    return stats;
  } catch (error) {
    console.error(`Error getting milk stats for profile ${profileId}:`, error);
    return null;
  }
});

// Üreme/Gebelik Kayıtları API
ipcMain.handle('get-all-breeding-records', async (_, profileId, options) => {
  try {
    console.log('Main process: get-all-breeding-records called with profileId:', profileId);
    
    if (!profileId || profileId <= 0) {
      console.error('Main process: Invalid profile ID:', profileId);
      return [];
    }
    
    // Profildeki hayvanları kontrol et
    const animals = await database.all("SELECT id, gender FROM animals WHERE profile_id = ?", [profileId]);
    const femaleAnimals = animals.filter(a => a.gender === 'Dişi');
    console.log(`Main process: Found ${animals.length} animals (${femaleAnimals.length} female) for profile ${profileId}`);
    
    const records = await breedingRecordModel.getBreedingRecordsByProfile(profileId, options);
    console.log('Main process: Found breeding records count:', records.length);
    if (records.length > 0) {
      console.log('Main process: Sample breeding record:', records[0]);
    }
    return records;
  } catch (error) {
    console.error('Error fetching breeding records:', error);
    return [];
  }
});

ipcMain.handle('create-breeding-record', async (_, recordData) => {
  try {
    console.log('Main process: create-breeding-record called with data:', JSON.stringify(recordData, null, 2));
    
    // Validate the input data
    if (!recordData.animal_id) {
      console.error('Main process: Missing animal_id in breeding record data');
      return { success: false, error: 'Hayvan seçilmedi.' };
    }
    
    if (!recordData.breeding_date) {
      console.error('Main process: Missing breeding_date in breeding record data');
      return { success: false, error: 'Çiftleşme tarihi girilmedi.' };
    }

    const id = await breedingRecordModel.createBreedingRecord(recordData);
    console.log('Main process: Successfully created breeding record with ID:', id);
    return { success: true, id };
  } catch (error) {
    console.error('Main process: Error creating breeding record:', error);
    
    // Return a more descriptive error message
    let errorMessage = 'Üreme/gebelik kaydı oluşturulurken bir hata oluştu.';
    if (error.userMessage) {
      errorMessage = error.userMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('update-breeding-record', async (_, recordData) => {
  try {
    console.log('Main process: update-breeding-record called with data:', JSON.stringify(recordData, null, 2));
    await breedingRecordModel.updateBreedingRecord(recordData);
    return { success: true };
  } catch (error) {
    console.error(`Error updating breeding record ${recordData.id}:`, error);
    let errorMessage = 'Üreme/gebelik kaydı güncellenirken bir hata oluştu.';
    if (error.userMessage) {
      errorMessage = error.userMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('delete-breeding-record', async (_, recordId) => {
  try {
    console.log('Main process: delete-breeding-record called with ID:', recordId);
    await breedingRecordModel.deleteBreedingRecord(recordId);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting breeding record ${recordId}:`, error);
    let errorMessage = 'Üreme/gebelik kaydı silinirken bir hata oluştu.';
    if (error.userMessage) {
      errorMessage = error.userMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('get-breeding-stats', async (_, profileId, options) => {
  try {
    const stats = await breedingRecordModel.getBreedingStats(profileId, options);
    return stats;
  } catch (error) {
    console.error(`Error getting breeding stats for profile ${profileId}:`, error);
    return null;
  }
});

ipcMain.handle('get-upcoming-births', async (_, profileId, daysThreshold) => {
  try {
    const upcomingBirths = await breedingRecordModel.getUpcomingBirths(profileId, daysThreshold);
    return upcomingBirths;
  } catch (error) {
    console.error(`Error getting upcoming births for profile ${profileId}:`, error);
    return [];
  }
}); 