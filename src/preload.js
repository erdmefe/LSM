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
  }
}; 