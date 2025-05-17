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
const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
const viewDivs = document.querySelectorAll('.view');
const livestockDropdown = document.getElementById('livestockDropdown');
const livestockSubmenu = document.getElementById('livestockSubmenu');

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
  
  // Ana navigasyon linkleri
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Tıklanan link dropdown içinde değilse ana menü öğelerini pasif yap
      if (!link.closest('.collapse')) {
        // Aktif sınıfını tüm ana menü linklerinden kaldır
        document.querySelectorAll('.nav > .nav-item > .nav-link').forEach(l => {
          l.classList.remove('active');
        });
        
        // Dropdown menüyü kapat ve pasif yap
        if (livestockDropdown) {
          livestockDropdown.classList.remove('active');
          
          // Bootstrap kollapsa erişip, gerekirse kapat
          const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('livestockSubmenu'));
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
        
        // Alt menülerdeki tüm aktif sınıflarını kaldır
        document.querySelectorAll('.sub-menu .nav-link').forEach(l => {
          l.classList.remove('active');
        });
        
        // Tıklanan linke aktif sınıfını ekle
        link.classList.add('active');
      }
      
      // Görünüm değiştir
      showView(link.getAttribute('href'));
    });
  });
  
  // Alt menü linkleri (dropdown içindekiler)
  document.querySelectorAll('.sub-menu .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Alt menü içindeki tüm linklerden aktif sınıfını kaldır
      document.querySelectorAll('.sub-menu .nav-link').forEach(l => {
        l.classList.remove('active');
      });
      
      // Tıklanan alt menü linkine aktif sınıfını ekle
      link.classList.add('active');
      
      // Diğer ana menü öğelerini pasif yap
      document.querySelectorAll('.nav > .nav-item > .nav-link:not(.dropdown-toggle)').forEach(l => {
        l.classList.remove('active');
      });
      
      // Üst dropdown menüsünün aktif olduğunu belirt
      if (livestockDropdown) {
        livestockDropdown.classList.add('active');
      }
      
      // Görünüm değiştir
      showView(link.getAttribute('href'));
    });
  });
  
  // Dropdown menü kontrolü
  if (livestockDropdown) {
    livestockDropdown.addEventListener('click', (e) => {
      // Sadece dropdown'ı açıp kapatma işlemi yapılır, alt menü seçilmez
      const bsCollapse = bootstrap.Collapse.getInstance(livestockSubmenu) || 
                          new bootstrap.Collapse(livestockSubmenu, { toggle: false });
      
      // Dropdown toggle işlemi
      if (livestockSubmenu.classList.contains('show')) {
        bsCollapse.hide();
      } else {
        bsCollapse.show();
        
        // Dropdown açılınca diğer menülerin active durumunu temizle
        // Ama alt menü seçimini yapma
        document.querySelectorAll('.nav > .nav-item > .nav-link:not(.dropdown-toggle)').forEach(l => {
          l.classList.remove('active');
        });
        
        // Dropdown'ı active yap
        livestockDropdown.classList.add('active');
      }
    });
    
    // Dropdown kapandığında
    livestockSubmenu.addEventListener('hidden.bs.collapse', () => {
      // Eğer alt menüde hala aktif bir öğe varsa, dropdown'ı aktif tut
      if (!document.querySelector('.sub-menu .nav-link.active')) {
        livestockDropdown.classList.remove('active');
      }
    });
  }
}

// Belirtilen görünümü göster
function showView(hash) {
  // # işaretini kaldır
  const viewId = hash.substring(1) + '-view';
  
  // Tüm görünümleri gizle
  viewDivs.forEach(div => {
    div.classList.remove('active-view');
  });
  
  // İstenen görünümü göster
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active-view');
  } else {
    console.warn(`"${viewId}" ID'li görünüm bulunamadı`);
  }
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