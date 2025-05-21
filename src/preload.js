// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer, contextBridge } = require('electron');

// API'yi window'a expose et
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
});

// API'leri global olarak tanımlıyoruz
window.lsmAPI = {
  // Profil İşlemleri
  profiles: {
    getAll: () => ipcRenderer.invoke('get-all-profiles'),
    getProfile: (id) => ipcRenderer.invoke('get-profile', id),
    create: (profileData) => ipcRenderer.invoke('create-profile', profileData),
    update: (profileData) => ipcRenderer.invoke('update-profile', profileData),
    delete: (id) => ipcRenderer.invoke('delete-profile', id),
    setActive: (id) => ipcRenderer.invoke('set-active-profile', id),
    getActive: () => ipcRenderer.invoke('get-active-profile')
  },
  
  // Hayvan İşlemleri
  animals: {
    getAll: (profileId) => ipcRenderer.invoke('get-all-animals', profileId),
    getById: (animalId) => ipcRenderer.invoke('get-animal', animalId),
    create: (animalData) => ipcRenderer.invoke('create-animal', animalData),
    update: (animalData) => ipcRenderer.invoke('update-animal', animalData),
    delete: (animalId) => ipcRenderer.invoke('delete-animal', animalId),
    getStats: (profileId) => ipcRenderer.invoke('get-animal-stats', profileId),
    
    // Hayvan Türleri
    types: {
      getAll: (profileId) => ipcRenderer.invoke('get-animal-types', profileId),
      create: (typeData) => ipcRenderer.invoke('create-animal-type', typeData),
      update: (typeData) => ipcRenderer.invoke('update-animal-type', typeData),
      delete: (typeId) => ipcRenderer.invoke('delete-animal-type', typeId)
    }
  },
  
  // Rasyon İşlemleri
  rations: {
    getAll: (profileId) => ipcRenderer.invoke('get-all-rations', profileId),
    getById: (rationId) => ipcRenderer.invoke('get-ration', rationId),
    create: (rationData) => ipcRenderer.invoke('create-ration', rationData),
    update: (rationData) => ipcRenderer.invoke('update-ration', rationData),
    delete: (rationId) => ipcRenderer.invoke('delete-ration', rationId),
    getStats: (profileId) => ipcRenderer.invoke('get-ration-stats', profileId)
  },
  feedIngredientTypes: {
    create: (data) => ipcRenderer.invoke('create-feed-ingredient-type', data),
    getAllByProfile: (profileId) => ipcRenderer.invoke('get-feed-ingredient-types-by-profile', profileId)
  },
  
  // Sağlık Kayıtları İşlemleri
  health: {
    getAll: (profileId) => ipcRenderer.invoke('get-all-health-records', profileId),
    create: (recordData) => ipcRenderer.invoke('create-health-record', recordData),
    update: (recordData) => ipcRenderer.invoke('update-health-record', recordData),
    delete: (recordId) => ipcRenderer.invoke('delete-health-record', recordId)
  },
  
  // Sağım Kayıtları İşlemleri
  milk: {
    getAll: (profileId, options) => ipcRenderer.invoke('get-all-milk-records', profileId, options),
    create: (recordData) => ipcRenderer.invoke('create-milk-record', recordData),
    update: (recordData) => ipcRenderer.invoke('update-milk-record', recordData),
    delete: (recordId) => ipcRenderer.invoke('delete-milk-record', recordId),
    getStats: (profileId, options) => ipcRenderer.invoke('get-milk-stats', profileId, options)
  },
  
  // Üreme/Gebelik Kayıtları İşlemleri
  breeding: {
    getAll: (profileId, options) => ipcRenderer.invoke('get-all-breeding-records', profileId, options),
    create: (recordData) => ipcRenderer.invoke('create-breeding-record', recordData),
    update: (recordData) => ipcRenderer.invoke('update-breeding-record', recordData),
    delete: (recordId) => ipcRenderer.invoke('delete-breeding-record', recordId),
    getStats: (profileId, options) => ipcRenderer.invoke('get-breeding-stats', profileId, options),
    getUpcomingBirths: (profileId, daysThreshold) => ipcRenderer.invoke('get-upcoming-births', profileId, daysThreshold)
  }
}; 