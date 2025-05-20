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

// Hayvan form elementi referansları
const addAnimalForm = document.getElementById('addAnimalForm');
const animalType = document.getElementById('animalType');
const animalTagId = document.getElementById('animalTagId');
const animalName = document.getElementById('animalName');
const animalGender = document.getElementById('animalGender');
const animalBirthDate = document.getElementById('animalBirthDate');
const animalAcquisitionDate = document.getElementById('animalAcquisitionDate');
const animalAcquisitionCost = document.getElementById('animalAcquisitionCost');
const animalStatus = document.getElementById('animalStatus');
const animalNotes = document.getElementById('animalNotes');
const saveAnimalBtn = document.getElementById('saveAnimalBtn');
const addTypeBtn = document.getElementById('addTypeBtn');

// Hayvan listesi elementi referansları
const animalSearchInput = document.getElementById('animalSearchInput');
const animalTypeFilter = document.getElementById('animalTypeFilter');
const animalStatusFilter = document.getElementById('animalStatusFilter');
const animalGenderFilter = document.getElementById('animalGenderFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const animalTableBody = document.getElementById('animalTableBody');
const animalCount = document.getElementById('animalCount');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const pagination = document.getElementById('pagination');
const refreshAnimalListBtn = document.getElementById('refreshAnimalListBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const printListBtn = document.getElementById('printListBtn');
const sortableHeaders = document.querySelectorAll('.sortable');

// Hayvan detay modalı referansları
const detailTagId = document.getElementById('detailTagId');
const detailName = document.getElementById('detailName');
const detailType = document.getElementById('detailType');
const detailGender = document.getElementById('detailGender');
const detailBirthDate = document.getElementById('detailBirthDate');
const detailAcquisitionDate = document.getElementById('detailAcquisitionDate');
const detailAcquisitionCost = document.getElementById('detailAcquisitionCost');
const detailStatus = document.getElementById('detailStatus');
const detailNotes = document.getElementById('detailNotes');
const editAnimalBtn = document.getElementById('editAnimalBtn');

// Hayvan silme modalı referansları
const deleteAnimalName = document.getElementById('deleteAnimalName');
const confirmDeleteAnimalBtn = document.getElementById('confirmDeleteAnimalBtn');

// Hayvan türü modalı
const typeName = document.getElementById('typeName');
const typeDescription = document.getElementById('typeDescription');
const saveTypeBtn = document.getElementById('saveTypeBtn');

// Bootstrap Modal nesneleri
let addProfileModal;
let deleteProfileModal;
let addTypeModal;
let animalDetailModal;
let deleteAnimalModal;

// Aktif profil ID'si
let activeProfileId = null;

// Hayvan listesi durumu
let allAnimals = [];         // Tüm hayvanlar
let filteredAnimals = [];    // Filtrelenmiş hayvanlar
let currentPage = 1;         // Mevcut sayfa
let pageSize = 25;           // Sayfa başına hayvan sayısı
let sortField = 'tag_id';    // Sıralama alanı
let sortDirection = 'asc';   // Sıralama yönü
let selectedAnimalId = null; // Seçili hayvan ID'si

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');
  
  // Bootstrap modalları başlat
  addProfileModal = new bootstrap.Modal(document.getElementById('addProfileModal'));
  deleteProfileModal = new bootstrap.Modal(document.getElementById('deleteProfileModal'));
  addTypeModal = new bootstrap.Modal(document.getElementById('addTypeModal'));
  animalDetailModal = new bootstrap.Modal(document.getElementById('animalDetailModal'));
  deleteAnimalModal = new bootstrap.Modal(document.getElementById('deleteAnimalModal'));
  
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
        
        // Görünüm değiştir
        const href = link.getAttribute('href');
        showView(href);
        
        // Dashboard görünümü için hayvan istatistiklerini güncelle
        if (href === '#dashboard') {
          updateDashboardStats();
        }
      }
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
      const href = link.getAttribute('href');
      showView(href);
      
      // Hayvan ekle sayfasına geldiğimizde hayvan türlerini yükle
      if (href === '#add-animal') {
        loadAnimalTypes();
      }
      
      // Hayvan listesi sayfasına geldiğimizde hayvanları ve türleri yükle
      if (href === '#animal-list') {
        loadAnimalTypes(animalTypeFilter);
        loadAnimals();
      }
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
  
  // Hayvan türü ekleme butonu
  if (addTypeBtn) {
    addTypeBtn.addEventListener('click', () => {
      // Form alanlarını temizle
      typeName.value = '';
      typeDescription.value = '';
      // Modalı göster
      addTypeModal.show();
    });
  }
  
  // Hayvan türü kaydetme butonu
  if (saveTypeBtn) {
    saveTypeBtn.addEventListener('click', async () => {
      if (typeName.value.trim() === '') {
        alert('Tür adı boş olamaz!');
        return;
      }
      
      if (!activeProfileId) {
        alert('Aktif profil bulunamadı!');
        return;
      }
      
      try {
        const result = await window.lsmAPI.animals.types.create({
          profile_id: activeProfileId,
          name: typeName.value.trim(),
          description: typeDescription.value.trim()
        });
        
        if (result.success) {
          addTypeModal.hide();
          await loadAnimalTypes();
        } else {
          alert('Hayvan türü eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Hayvan türü eklenirken hata:', error);
        alert('Hayvan türü eklenirken bir hata oluştu!');
      }
    });
  }
  
  // Hayvan ekleme formu
  if (addAnimalForm) {
    addAnimalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!activeProfileId) {
        alert('Lütfen önce bir profil seçin!');
        return;
      }
      
      // Form doğrulama
      if (!animalTagId.value.trim()) {
        alert('Küpe No / Tanımlayıcı alanı zorunludur!');
        animalTagId.focus();
        return;
      }
      
      if (!animalType.value) {
        alert('Lütfen bir hayvan türü seçin!');
        animalType.focus();
        return;
      }
      
      if (!animalGender.value) {
        alert('Lütfen cinsiyet seçin!');
        animalGender.focus();
        return;
      }
      
      if (!animalAcquisitionDate.value) {
        alert('Alım tarihi zorunludur!');
        animalAcquisitionDate.focus();
        return;
      }
      
      try {
        const animalData = {
          profile_id: activeProfileId,
          type_id: parseInt(animalType.value),
          tag_id: animalTagId.value.trim(),
          name: animalName.value.trim() || null,
          gender: animalGender.value,
          birth_date: animalBirthDate.value || null,
          acquisition_date: animalAcquisitionDate.value,
          acquisition_cost: animalAcquisitionCost.value ? parseFloat(animalAcquisitionCost.value) : 0,
          status: animalStatus.value,
          notes: animalNotes.value.trim()
        };
        
        const result = await window.lsmAPI.animals.create(animalData);
        
        if (result.success) {
          const successMsg = document.getElementById('animalSuccessMessage');
          if (successMsg) {
            successMsg.classList.remove('d-none');
            setTimeout(() => {
              successMsg.classList.add('d-none');
            }, 3000);
          } else {
            // Alternatif olarak alert kullan ama focus sorunu olmasın diye setTimeout ile
            setTimeout(() => {
              alert('Hayvan başarıyla eklendi!');
            }, 0);
          }
        
          // Formu temizle
          addAnimalForm.reset();
        
          // Görünüm değiştir ve odakla
          document.querySelector('.nav-link[href="#add-animal"]').click();
        
          // Giriş alanlarına focus ver (örnek olarak hayvan arama kutusu)
          setTimeout(() => {
            if (animalTagId) {
              animalTagId.focus();
            }
          }, 100);
        } else {
          alert('Hayvan eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Hayvan eklenirken hata:', error);
        alert('Hayvan eklenirken bir hata oluştu!');
      }
    });
  }
  
  // Hayvan listesi ile ilgili event listener'lar
  if (refreshAnimalListBtn) {
    refreshAnimalListBtn.addEventListener('click', () => {
      loadAnimals();
    });
  }
  
  if (animalSearchInput) {
    animalSearchInput.addEventListener('input', () => {
      currentPage = 1; // Arama yapıldığında ilk sayfaya dön
      filterAnimals();
    });
  }
  
  if (animalTypeFilter) {
    animalTypeFilter.addEventListener('change', () => {
      currentPage = 1;
      filterAnimals();
    });
  }
  
  if (animalStatusFilter) {
    animalStatusFilter.addEventListener('change', () => {
      currentPage = 1;
      filterAnimals();
    });
  }
  
  if (animalGenderFilter) {
    animalGenderFilter.addEventListener('change', () => {
      currentPage = 1;
      filterAnimals();
    });
  }
  
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      // Filtreleri sıfırla
      if (animalSearchInput) animalSearchInput.value = '';
      if (animalTypeFilter) animalTypeFilter.value = '';
      if (animalStatusFilter) animalStatusFilter.value = '';
      if (animalGenderFilter) animalGenderFilter.value = '';
      
      currentPage = 1;
      filterAnimals();
    });
  }
  
  if (sortableHeaders) {
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const field = header.dataset.sort;
        
        // Aynı alana tıklandığında sıralama yönünü değiştir
        if (sortField === field) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDirection = 'asc';
        }
        
        // Görsel geri bildirim için sort ikonlarını güncelle
        updateSortIcons();
        
        // Hayvanları yeniden sırala ve göster
        filterAnimals();
      });
    });
  }
  
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', () => {
      pageSize = parseInt(pageSizeSelect.value);
      currentPage = 1; // Sayfa boyutu değiştiğinde ilk sayfaya dön
      filterAnimals();
    });
  }
  
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportToCSV();
    });
  }
  
  if (printListBtn) {
    printListBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  if (confirmDeleteAnimalBtn) {
    confirmDeleteAnimalBtn.addEventListener('click', async () => {
      if (selectedAnimalId) {
        await deleteAnimal(selectedAnimalId);
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

// Hayvan türlerini yükle
async function loadAnimalTypes(selectElement = animalType) {
  if (!selectElement) return;
  
  try {
    if (!activeProfileId) {
      console.warn('Hayvan türleri yüklenirken aktif profil bulunamadı');
      return;
    }
    
    const types = await window.lsmAPI.animals.types.getAll(activeProfileId);
    
    // Hayvan türü seçimini temizle, sadece ilk seçeneği (placeholder) tut
    while (selectElement.options.length > 1) {
      selectElement.remove(1);
    }
    
    if (types.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.text = 'Hiç hayvan türü bulunamadı';
      selectElement.add(option);
    } else {
      // Türleri seçim kutusuna ekle
      types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.text = type.name;
        selectElement.add(option);
      });
    }
  } catch (error) {
    console.error('Hayvan türleri yüklenirken hata:', error);
    alert('Hayvan türleri yüklenirken bir hata oluştu!');
  }
}

// Hayvanları yükle
async function loadAnimals() {
  if (!animalTableBody) return;
  
  try {
    if (!activeProfileId) {
      console.warn('Hayvanlar yüklenirken aktif profil bulunamadı');
      return;
    }
    
    // Yükleniyor göstergesini göster
    animalTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
          <span class="ms-2">Hayvanlar yükleniyor...</span>
        </td>
      </tr>
    `;
    
    // Hayvanları getir
    allAnimals = await window.lsmAPI.animals.getAll(activeProfileId);
    
    // Filtreleri uygula ve göster
    filterAnimals();
  } catch (error) {
    console.error('Hayvanlar yüklenirken hata:', error);
    animalTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Hayvanlar yüklenirken bir hata oluştu!
        </td>
      </tr>
    `;
  }
}

// Hayvanları filtrele, sırala ve göster
function filterAnimals() {
  if (!animalTableBody) return;
  
  // Arama ve filtreleme
  const searchTerm = animalSearchInput ? animalSearchInput.value.toLowerCase() : '';
  const typeFilter = animalTypeFilter ? animalTypeFilter.value : '';
  const statusFilter = animalStatusFilter ? animalStatusFilter.value : '';
  const genderFilter = animalGenderFilter ? animalGenderFilter.value : '';
  
  filteredAnimals = allAnimals.filter(animal => {
    // Arama
    const matchesSearch = 
      !searchTerm ||
      (animal.tag_id && animal.tag_id.toLowerCase().includes(searchTerm)) ||
      (animal.name && animal.name.toLowerCase().includes(searchTerm)) ||
      (animal.type_name && animal.type_name.toLowerCase().includes(searchTerm));
    
    // Tür filtresi
    const matchesType = !typeFilter || animal.type_id === parseInt(typeFilter);
    
    // Durum filtresi
    const matchesStatus = !statusFilter || animal.status === statusFilter;
    
    // Cinsiyet filtresi
    const matchesGender = !genderFilter || animal.gender === genderFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesGender;
  });
  
  // Sıralama
  filteredAnimals.sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    
    // Tarih alanları için
    if (sortField === 'birth_date' || sortField === 'acquisition_date') {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    }
    
    // Karşılaştırma
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Sayfalama
  const totalItems = filteredAnimals.length;
  const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
  
  // Geçerli sayfa kontrolü
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  
  // Sayfa için hayvanları al
  const startIndex = pageSize > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex = pageSize > 0 ? Math.min(startIndex + pageSize, totalItems) : totalItems;
  const paginatedAnimals = pageSize > 0 ? filteredAnimals.slice(startIndex, endIndex) : filteredAnimals;
  
  // Toplam sayı göstergesini güncelle
  if (animalCount) {
    animalCount.textContent = totalItems;
  }
  
  // Tabloyu oluştur
  renderAnimalTable(paginatedAnimals);
  
  // Sayfalama göster
  renderPagination(totalPages);
}

// Hayvan tablosunu oluştur
function renderAnimalTable(animals) {
  if (!animalTableBody) return;
  
  if (animals.length === 0) {
    animalTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">
          <i class="fas fa-search me-2"></i>
          Hayvan bulunamadı
        </td>
      </tr>
    `;
    return;
  }
  
  let html = '';
  
  animals.forEach(animal => {
    const birthDate = animal.birth_date ? formatDate(animal.birth_date) : '-';
    const acquisitionDate = animal.acquisition_date ? formatDate(animal.acquisition_date) : '-';
    
    // Durum için renk class'ı
    let statusClass = '';
    switch (animal.status) {
      case 'Aktif': statusClass = 'badge bg-success'; break;
      case 'Satıldı': statusClass = 'badge bg-primary'; break;
      case 'Öldü': statusClass = 'badge bg-danger'; break;
      case 'Karantina': statusClass = 'badge bg-warning text-dark'; break;
      default: statusClass = 'badge bg-secondary';
    }
    
    html += `
      <tr>
        <td>${animal.tag_id || '-'}</td>
        <td>${animal.name || '-'}</td>
        <td>${animal.type_name || '-'}</td>
        <td>${animal.gender || '-'}</td>
        <td>${birthDate}</td>
        <td>${acquisitionDate}</td>
        <td><span class="${statusClass}">${animal.status || '-'}</span></td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary btn-sm view-animal" data-id="${animal.id}" title="Detaylar">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-outline-success btn-sm edit-animal" data-id="${animal.id}" title="Düzenle">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm delete-animal" data-id="${animal.id}" title="Sil">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  animalTableBody.innerHTML = html;
  
  // İşlem butonlarına event listener'lar ekle
  document.querySelectorAll('.view-animal').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = parseInt(btn.dataset.id);
      viewAnimalDetails(animalId);
    });
  });
  
  document.querySelectorAll('.edit-animal').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = parseInt(btn.dataset.id);
      editAnimal(animalId);
    });
  });
  
  document.querySelectorAll('.delete-animal').forEach(btn => {
    btn.addEventListener('click', () => {
      const animalId = parseInt(btn.dataset.id);
      showDeleteConfirmation(animalId);
    });
  });
}

// Sayfalama oluştur
function renderPagination(totalPages) {
  if (!pagination) return;
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Önceki butonu
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Önceki">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  
  // Sayfa numaraları
  const visiblePages = 5; // Görünür sayfa sayısı
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);
  
  // Başta çok sayfa varsa "..." göster
  if (startPage > 1) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="1">1</a>
      </li>
    `;
    
    if (startPage > 2) {
      html += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
  }
  
  // Sayfa numaralarını göster
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }
  
  // Sonda çok sayfa varsa "..." göster
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
    
    html += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
      </li>
    `;
  }
  
  // Sonraki butonu
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Sonraki">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
  
  pagination.innerHTML = html;
  
  // Sayfa numaralarına tıklama event'ları ekle
  document.querySelectorAll('.page-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        filterAnimals();
      }
    });
  });
}

// Hayvan detaylarını görüntüle
async function viewAnimalDetails(animalId) {
  try {
    const animal = await window.lsmAPI.animals.getById(animalId);
    
    if (!animal) {
      alert('Hayvan bilgisi bulunamadı!');
      return;
    }
    
    // Detay modalını doldur
    detailTagId.textContent = animal.tag_id || '-';
    detailName.textContent = animal.name || '-';
    detailType.textContent = animal.type_name || '-';
    detailGender.textContent = animal.gender || '-';
    detailBirthDate.textContent = animal.birth_date ? formatDate(animal.birth_date) : '-';
    detailAcquisitionDate.textContent = animal.acquisition_date ? formatDate(animal.acquisition_date) : '-';
    detailAcquisitionCost.textContent = animal.acquisition_cost ? `₺${animal.acquisition_cost}` : '-';
    detailStatus.textContent = animal.status || '-';
    detailNotes.textContent = animal.notes || '-';
    
    // Düzenleme butonuna hayvan ID'sini ekle
    if (editAnimalBtn) {
      editAnimalBtn.dataset.id = animal.id;
      editAnimalBtn.addEventListener('click', () => {
        animalDetailModal.hide();
        editAnimal(animal.id);
      }, { once: true });
    }
    
    // Modalı göster
    animalDetailModal.show();
  } catch (error) {
    console.error('Hayvan detayları görüntülenirken hata:', error);
    alert('Hayvan detayları görüntülenirken bir hata oluştu!');
  }
}

// Hayvan düzenleme sayfasına git
function editAnimal(animalId) {
  // Önce hayvan listesi görünümünü kapat
  // Hayvan düzenleme görünümüne geçiş için gerekli kod burada olacak
  
  // Şimdilik basit bir uyarı göster (düzenleme fonksiyonu henüz eklenmediği için)
  alert(`Hayvan düzenleme fonksiyonu henüz eklenmedi. Hayvan ID: ${animalId}`);
}

// Hayvan silme onay modalını göster
async function showDeleteConfirmation(animalId) {
  try {
    const animal = await window.lsmAPI.animals.getById(animalId);
    
    if (!animal) {
      alert('Hayvan bilgisi bulunamadı!');
      return;
    }
    
    // Hayvan adını veya küpe numarasını göster
    const displayName = animal.name || animal.tag_id || `#${animal.id}`;
    deleteAnimalName.textContent = displayName;
    
    // Silme işlemi için hayvan ID'sini sakla
    selectedAnimalId = animal.id;
    
    // Modalı göster
    deleteAnimalModal.show();
  } catch (error) {
    console.error('Hayvan silme modalı gösterilirken hata:', error);
    alert('Hayvan silme işlemi sırasında bir hata oluştu!');
  }
}

// Hayvan sil
async function deleteAnimal(animalId) {
  try {
    const result = await window.lsmAPI.animals.delete(animalId);
    
    if (result.success) {
      // Modalı kapat
      deleteAnimalModal.hide();
      
      // Hayvan listesini yenile
      await loadAnimals();
      
      // Başarılı mesajı göster
      alert('Hayvan başarıyla silindi!');
    } else {
      alert(`Hayvan silinirken bir hata oluştu: ${result.error}`);
    }
  } catch (error) {
    console.error('Hayvan silinirken hata:', error);
    alert('Hayvan silinirken bir hata oluştu!');
  }
}

// Sıralama ikonlarını güncelle
function updateSortIcons() {
  if (!sortableHeaders) return;
  
  sortableHeaders.forEach(header => {
    // Tüm sıralama ikonlarını temizle
    const icon = header.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-sort';
    }
    
    // Aktif sıralama sütununu güncelle
    if (header.dataset.sort === sortField) {
      const icon = header.querySelector('i');
      if (icon) {
        icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      }
    }
  });
}

// Hayvan listesini CSV olarak dışa aktar
function exportToCSV() {
  if (filteredAnimals.length === 0) {
    alert('Dışa aktarılacak hayvan bulunamadı!');
    return;
  }
  
  // CSV başlıkları
  const headers = [
    'Küpe No',
    'İsim',
    'Tür',
    'Cinsiyet',
    'Doğum Tarihi',
    'Alım Tarihi',
    'Alım Maliyeti',
    'Durum',
    'Notlar'
  ];
  
  // CSV verisi
  let csvContent = headers.join(',') + '\n';
  
  filteredAnimals.forEach(animal => {
    const row = [
      escapeCsvValue(animal.tag_id || ''),
      escapeCsvValue(animal.name || ''),
      escapeCsvValue(animal.type_name || ''),
      escapeCsvValue(animal.gender || ''),
      animal.birth_date ? formatDate(animal.birth_date) : '',
      animal.acquisition_date ? formatDate(animal.acquisition_date) : '',
      animal.acquisition_cost || '0',
      escapeCsvValue(animal.status || ''),
      escapeCsvValue(animal.notes || '')
    ];
    
    csvContent += row.join(',') + '\n';
  });
  
  // CSV dosyasını indir
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Dosya adı oluştur
  const date = new Date();
  const fileName = `hayvan_listesi_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.csv`;
  
  // İndirme işlemi
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}

// Tarihi formatla
function formatDate(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString('tr-TR');
}

// CSV için değerleri kaçış karakterleriyle işle
function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // Virgül, çift tırnak veya yeni satır içeriyorsa, çift tırnak içine al
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Çift tırnakları iki çift tırnak yaparak kaçır
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
  
  return stringValue;
}

// Dashboard istatistiklerini güncelle
async function updateDashboardStats() {
  // Toplam hayvan sayısı
  const totalAnimalsElement = document.getElementById('totalAnimals');
  if (totalAnimalsElement && activeProfileId) {
    try {
      const stats = await window.lsmAPI.animals.getStats(activeProfileId);
      if (stats) {
        totalAnimalsElement.textContent = stats.total || 0;
      }
    } catch (error) {
      console.error('Hayvan istatistikleri alınırken hata:', error);
      totalAnimalsElement.textContent = '?';
    }
  }
  
  // Gelir gider bilgileri de benzer şekilde eklenebilir
  // Şimdilik boş bırakıyoruz
} 