// This file is required by the index.html file and will
// be executed in the renderer process for that window.
console.log('Renderer process is running');

// DOM elementi referansları
const profileDropdown = document.getElementById('profileDropdown');
const selectedProfileName = document.getElementById('selectedProfileName');
const profileList = document.getElementById('profileList');
const addProfileBtn = document.getElementById('addProfileBtn');
const deleteProfileBtn = document.getElementById('deleteProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const confirmDeleteProfileBtn = document.getElementById('confirmDeleteProfileBtn');
const profileName = document.getElementById('profileName');
const profileDescription = document.getElementById('profileDescription');
const navLinks = document.querySelectorAll('.nav-link');
const viewDivs = document.querySelectorAll('.view');

// Bootstrap Modal nesneleri
let addProfileModal;
let deleteProfileModal;

// Aktif profil ID'si
let activeProfileId = null;

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');
  
  // Bootstrap modalları başlat
  addProfileModal = new bootstrap.Modal(document.getElementById('addProfileModal'));
  deleteProfileModal = new bootstrap.Modal(document.getElementById('deleteProfileModal'));
  
  // Event listener'ları ekle
  setupEventListeners();
  
  // Profilleri yükle
  await loadProfiles();
  
  // Aktif profili ayarla
  await setInitialActiveProfile();
});

// Event listener'ları ekle
function setupEventListeners() {
  // Profil ekleme butonu
  addProfileBtn.addEventListener('click', () => {
    // Form alanlarını temizle
    profileName.value = '';
    profileDescription.value = '';
    // Modalı göster
    addProfileModal.show();
  });
  
  // Profil silme butonu
  deleteProfileBtn.addEventListener('click', () => {
    if (activeProfileId) {
      deleteProfileModal.show();
    } else {
      alert('Lütfen önce bir profil seçin!');
    }
  });
  
  // Profil kaydetme butonu
  saveProfileBtn.addEventListener('click', async () => {
    if (profileName.value.trim() === '') {
      alert('Profil adı boş olamaz!');
      return;
    }
    
    try {
      const result = await window.lsmAPI.profiles.create({
        name: profileName.value.trim(),
        description: profileDescription.value.trim()
      });
      
      if (result.success) {
        addProfileModal.hide();
        await loadProfiles();
        
        // Yeni profili aktif profil olarak ayarla
        await setActiveProfile(result.id);
      } else {
        alert('Profil eklenirken bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error('Profil eklenirken hata:', error);
      alert('Profil eklenirken bir hata oluştu!');
    }
  });
  
  // Profil silme onay butonu
  confirmDeleteProfileBtn.addEventListener('click', async () => {
    if (!activeProfileId) {
      deleteProfileModal.hide();
      return;
    }
    
    try {
      const result = await window.lsmAPI.profiles.delete(activeProfileId);
      
      if (result.success) {
        deleteProfileModal.hide();
        await loadProfiles();
      } else {
        alert('Profil silinirken bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error('Profil silinirken hata:', error);
      alert('Profil silinirken bir hata oluştu!');
    }
  });
  
  // Navigasyon linkleri
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Aktif sınıfını tüm linklerden kaldır
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Tıklanan linke aktif sınıfını ekle
      link.classList.add('active');
      
      // İlgili görünümü göster
      const targetId = link.getAttribute('href').substring(1) + '-view';
      viewDivs.forEach(div => {
        div.classList.remove('active-view');
        if (div.id === targetId) {
          div.classList.add('active-view');
        }
      });
    });
  });
}

// Profilleri yükle
async function loadProfiles() {
  try {
    const profiles = await window.lsmAPI.profiles.getAll();
    
    // Profil listesini temizle
    profileList.innerHTML = '';
    
    if (profiles.length === 0) {
      const li = document.createElement('li');
      li.classList.add('dropdown-item', 'text-muted');
      li.textContent = 'Profil bulunamadı';
      profileList.appendChild(li);
      
      // Aktif profil ID'sini sıfırla
      activeProfileId = null;
      selectedProfileName.textContent = 'Profil Seçin';
      
      // Profil silme butonunu devre dışı bırak
      deleteProfileBtn.disabled = true;
    } else {
      // Profil silme butonunu etkinleştir
      deleteProfileBtn.disabled = false;
      
      // Profilleri listeye ekle
      profiles.forEach(profile => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = '#';
        a.textContent = profile.name;
        a.dataset.id = profile.id;
        
        a.addEventListener('click', async (e) => {
          e.preventDefault();
          await setActiveProfile(profile.id);
        });
        
        li.appendChild(a);
        profileList.appendChild(li);
      });
      
      // Aktif profil yoksa ilk profili aktif olarak ayarla
      if (!activeProfileId && profiles.length > 0) {
        activeProfileId = profiles[0].id;
        selectedProfileName.textContent = profiles[0].name;
      }
    }
  } catch (error) {
    console.error('Profiller yüklenirken hata:', error);
    alert('Profiller yüklenirken bir hata oluştu!');
  }
}

// İlk aktif profili ayarla
async function setInitialActiveProfile() {
  try {
    // Ana süreçten aktif profil ID'sini al
    const activeId = await window.lsmAPI.profiles.getActive();
    
    if (activeId) {
      // Profil bilgilerini al
      const profile = await window.lsmAPI.profiles.getProfile(activeId);
      
      if (profile) {
        activeProfileId = profile.id;
        selectedProfileName.textContent = profile.name;
      }
    }
  } catch (error) {
    console.error('Aktif profil ayarlanırken hata:', error);
  }
}

// Aktif profili ayarla
async function setActiveProfile(id) {
  try {
    // Profil bilgilerini al
    const profile = await window.lsmAPI.profiles.getProfile(id);
    
    if (profile) {
      // Ana sürece bildir
      await window.lsmAPI.profiles.setActive(id);
      
      // Yerel değişkeni güncelle
      activeProfileId = profile.id;
      
      // Profil adını güncelle
      selectedProfileName.textContent = profile.name;
    }
  } catch (error) {
    console.error('Aktif profil ayarlanırken hata:', error);
    alert('Aktif profil ayarlanırken bir hata oluştu!');
  }
} 