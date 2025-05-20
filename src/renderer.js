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

// Hayvan form elementi referansları
const modalAddAnimalForm = document.getElementById('modalAddAnimalForm');
const modalAnimalType = document.getElementById('modalAnimalType');
const modalAnimalTagId = document.getElementById('modalAnimalTagId');
const modalAnimalName = document.getElementById('modalAnimalName');
const modalAnimalGender = document.getElementById('modalAnimalGender');
const modalAnimalBirthDate = document.getElementById('modalAnimalBirthDate');
const modalAnimalAcquisitionDate = document.getElementById('modalAnimalAcquisitionDate');
const modalAnimalAcquisitionCost = document.getElementById('modalAnimalAcquisitionCost');
const modalAnimalStatus = document.getElementById('modalAnimalStatus');
const modalAnimalNotes = document.getElementById('modalAnimalNotes');
const modalSaveAnimalBtn = document.getElementById('modalSaveAnimalBtn');
const inlineTypeName = document.getElementById('inlineTypeName');
const inlineAddTypeBtn = document.getElementById('inlineAddTypeBtn');

// Sağlık kayıtları için DOM referansları
const healthTableBody = document.getElementById('healthTableBody');
const healthSearchInput = document.getElementById('healthSearchInput');
const healthAnimalFilter = document.getElementById('healthAnimalFilter');
const healthTypeFilter = document.getElementById('healthTypeFilter');
const healthCount = document.getElementById('healthCount');
const healthPageSizeSelect = document.getElementById('healthPageSizeSelect');
const healthPagination = document.getElementById('healthPagination');
const addHealthForm = document.getElementById('addHealthForm');
const healthAnimalSelect = document.getElementById('healthAnimalSelect');
const healthTypeSelect = document.getElementById('healthTypeSelect');
const healthDate = document.getElementById('healthDate');
const healthNote = document.getElementById('healthNote');
const saveHealthBtn = document.getElementById('saveHealthBtn');
const exportHealthCsvBtn = document.getElementById('exportHealthCsvBtn');
const refreshHealthListBtn = document.getElementById('refreshHealthListBtn');
const printHealthListBtn = document.getElementById('printHealthListBtn');

// Sağım kayıtları için DOM referansları
const milkTableBody = document.getElementById('milkTableBody');
const milkSearchInput = document.getElementById('milkSearchInput');
const milkAnimalFilter = document.getElementById('milkAnimalFilter');
const milkDateStart = document.getElementById('milkDateStart');
const milkDateEnd = document.getElementById('milkDateEnd');
const milkCount = document.getElementById('milkCount');
const milkTotalLiters = document.getElementById('milkTotalLiters');
const milkPageSizeSelect = document.getElementById('milkPageSizeSelect');
const milkPagination = document.getElementById('milkPagination');
const addMilkForm = document.getElementById('addMilkForm');
const milkAnimalSelect = document.getElementById('milkAnimalSelect');
const milkDate = document.getElementById('milkDate');
const milkTime = document.getElementById('milkTime');
const milkAmount = document.getElementById('milkAmount');
const milkQuality = document.getElementById('milkQuality');
const milkNote = document.getElementById('milkNote');
const saveMilkBtn = document.getElementById('saveMilkBtn');
const exportMilkCsvBtn = document.getElementById('exportMilkCsvBtn');
const refreshMilkListBtn = document.getElementById('refreshMilkListBtn');
const printMilkListBtn = document.getElementById('printMilkListBtn');

// Gebelik/Üreme kayıtları için DOM referansları
const breedingTableBody = document.getElementById('breedingTableBody');
const breedingSearchInput = document.getElementById('breedingSearchInput');
const breedingAnimalFilter = document.getElementById('breedingAnimalFilter');
const breedingDateStart = document.getElementById('breedingDateStart');
const breedingDateEnd = document.getElementById('breedingDateEnd');
const breedingStatusFilter = document.getElementById('breedingStatusFilter');
const breedingCount = document.getElementById('breedingCount');
const breedingPageSizeSelect = document.getElementById('breedingPageSizeSelect');
const breedingPagination = document.getElementById('breedingPagination');
const addBreedingForm = document.getElementById('addBreedingForm');
const breedingAnimalSelect = document.getElementById('breedingAnimalSelect');
const breedingPartnerSelect = document.getElementById('breedingPartnerSelect');
const breedingDate = document.getElementById('breedingDate');
const breedingExpectedDate = document.getElementById('breedingExpectedDate');
const breedingActualDate = document.getElementById('breedingActualDate');
const breedingOffspringCount = document.getElementById('breedingOffspringCount');
const breedingNote = document.getElementById('breedingNote');
const saveBreedingBtn = document.getElementById('saveBreedingBtn');
const exportBreedingCsvBtn = document.getElementById('exportBreedingCsvBtn');
const refreshBreedingListBtn = document.getElementById('refreshBreedingListBtn');
const printBreedingListBtn = document.getElementById('printBreedingListBtn');
const upcomingBirthsList = document.getElementById('upcomingBirthsList');

// Edit modal referansları
const editHealthModal = document.getElementById('editHealthModal');
const editHealthForm = document.getElementById('editHealthForm');
const editHealthId = document.getElementById('editHealthId');
const editHealthAnimalSelect = document.getElementById('editHealthAnimalSelect');
const editHealthTypeSelect = document.getElementById('editHealthTypeSelect');
const editHealthDate = document.getElementById('editHealthDate');
const editHealthNote = document.getElementById('editHealthNote');
const updateHealthBtn = document.getElementById('updateHealthBtn');

let editHealthModalInstance;
if (editHealthModal) {
  editHealthModalInstance = new bootstrap.Modal(editHealthModal);
}

// Sağlık kayıtları verisi
let allHealthRecords = [];
let filteredHealthRecords = [];
let healthCurrentPage = 1;
let healthPageSize = 25;

// Sağım kayıtları verisi
let allMilkRecords = [];
let filteredMilkRecords = [];
let milkCurrentPage = 1;
let milkPageSize = 25;

// Sağım kayıtları verisi
let allBreedingRecords = [];
let filteredBreedingRecords = [];
let breedingCurrentPage = 1;
let breedingPageSize = 25;

// Fonksiyon referansları - Kapsam dışı erişilebilmeleri için
let loadBreedingRecords;
let loadBreedingAnimals;
let loadUpcomingBirths;

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
  
  // Aktif profili ayarla ve profile ID'yi bekle
  const profileId = await setInitialActiveProfile();
  console.log('DOM loaded with active profile ID:', profileId);
  
  // Profile bilgisinin yüklenmesini bekle - kısa bir gecikme
  setTimeout(async () => {
    // Mevcut hash'e göre içeriği yükle
    const currentHash = location.hash || '#dashboard';
    console.log('Current hash on page load (after delay):', currentHash);
    console.log('Active Profile ID (after delay):', activeProfileId);
    
    // Hash'e göre view göster
    showView(currentHash);
    
    // Eğer hash health-records ise, sağlık kayıtlarını yükle
    if (currentHash === '#health-records') {
      console.log('Health records hash detected, loading data...');
      await loadHealthAnimals();
      await loadHealthRecords();
    }
    // Eğer hash animal-list ise, hayvanları yükle
    else if (currentHash === '#animal-list') {
      await loadAnimalTypes(animalTypeFilter);
      await loadAnimals();
    }
    // Hash dashboard ise istatistikleri güncelle
    else if (currentHash === '#dashboard') {
      await updateDashboardStats();
    }
  }, 500); // 500ms gecikme
});

// Event listener'ları ekle
function setupEventListeners() {
  // Dashboard yenileme butonu
  const refreshDashboardBtn = document.getElementById('refreshDashboardBtn');
  if (refreshDashboardBtn) {
    refreshDashboardBtn.addEventListener('click', async () => {
      await updateDashboardStats();
    });
  }

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
        try {
          console.log('Sidebar: Hayvan listesi sayfasına tıklandı, veriler yükleniyor...');
          
          // Yenile butonuna dönüş animasyonu ekle
          if (refreshAnimalListBtn) {
            const icon = refreshAnimalListBtn.querySelector('i');
            if (icon) {
              icon.classList.add('fa-spin');
              setTimeout(() => {
                icon.classList.remove('fa-spin');
              }, 1000);
            }
          }
          
          // Hayvan türlerini ve hayvanları yükle
        loadAnimalTypes(animalTypeFilter);
        loadAnimals();
        } catch (error) {
          console.error('Sidebar: Hayvan listesi yüklenirken hata:', error);
        }
      }
      
      // Sağlık bilgileri sayfasına geldiğimizde hayvanları ve sağlık kayıtlarını yükle
      if (href === '#health-records') {
        try {
          console.log('Sidebar: Sağlık bilgileri sayfasına tıklandı, veriler yükleniyor...');
          
          // Yenile butonuna dönüş animasyonu ekle
          if (refreshHealthListBtn) {
            const icon = refreshHealthListBtn.querySelector('i');
            if (icon) {
              icon.classList.add('fa-spin');
              setTimeout(() => {
                icon.classList.remove('fa-spin');
              }, 1000);
            }
          }
          
          // Hayvanları ve sağlık kayıtlarını yükle
          loadHealthAnimals();
          loadHealthRecords();
        } catch (error) {
          console.error('Sidebar: Sağlık bilgileri yüklenirken hata:', error);
        }
      }
      
      // Gebelik durumu sayfasına geldiğimizde havanları ve üreme/gebelik kayıtlarını yükle
      if (href === '#pregnancy') {
        try {
          console.log('Sidebar: Gebelik durumu sayfasına tıklandı, veriler yükleniyor...');
          
          // Yenile butonuna dönüş animasyonu ekle
          if (refreshBreedingListBtn) {
            const icon = refreshBreedingListBtn.querySelector('i');
            if (icon) {
              icon.classList.add('fa-spin');
              setTimeout(() => {
                icon.classList.remove('fa-spin');
              }, 1000);
            }
          }
          
          // Hayvanları ve üreme/gebelik kayıtlarını yükle
          loadBreedingAnimals();
          loadBreedingRecords();
        } catch (error) {
          console.error('Sidebar: Gebelik durumu yüklenirken hata:', error);
        }
      }
      
      // Sağım verileri sayfasına geldiğimizde hayvanları ve sağım kayıtlarını yükle
      if (href === '#milk-records') {
        try {
          console.log('Sidebar: Sağım verileri sayfasına tıklandı, veriler yükleniyor...');
          
          // Yenile butonuna dönüş animasyonu ekle
          if (refreshMilkListBtn) {
            const icon = refreshMilkListBtn.querySelector('i');
            if (icon) {
              icon.classList.add('fa-spin');
              setTimeout(() => {
                icon.classList.remove('fa-spin');
              }, 1000);
            }
          }
          
          // Hayvanları ve sağım kayıtlarını yükle
          loadMilkAnimals();
          loadMilkRecords();
        } catch (error) {
          console.error('Sidebar: Sağım verileri yüklenirken hata:', error);
        }
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
  
  // Tür ekleme modalı kapatıldığında hayvan türlerini güncelle
  document.getElementById('addTypeModal').addEventListener('hidden.bs.modal', async () => {
    await loadAnimalTypes(modalAnimalType);
  });

  // Modal hayvan formu submit
  modalAddAnimalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
    
    try {
      const result = await window.lsmAPI.animals.create({
          profile_id: activeProfileId,
        tag_id: modalAnimalTagId.value.trim(),
        type_id: modalAnimalType.value,
        name: modalAnimalName.value.trim(),
        gender: modalAnimalGender.value,
        birth_date: modalAnimalBirthDate.value || null,
        acquisition_date: modalAnimalAcquisitionDate.value,
        acquisition_cost: modalAnimalAcquisitionCost.value ? parseFloat(modalAnimalAcquisitionCost.value) : null,
        status: modalAnimalStatus.value,
        notes: modalAnimalNotes.value.trim()
      });
        
        if (result.success) {
        // Modalı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAnimalModal'));
        modal.hide();
        
          // Formu temizle
        modalAddAnimalForm.reset();
        
        // Hayvan listesini güncelle
        await loadAnimals();
        
        // Başarı mesajını göster
        const successMessage = document.getElementById('animalSuccessMessage');
        successMessage.classList.remove('d-none');
          setTimeout(() => {
          successMessage.classList.add('d-none');
        }, 3000);
        } else {
          alert('Hayvan eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Hayvan eklenirken hata:', error);
        alert('Hayvan eklenirken bir hata oluştu!');
      }
    });
  
  // Hayvan ekleme modalı açıldığında türleri yükle
  document.getElementById('addAnimalModal').addEventListener('show.bs.modal', async () => {
    await loadAnimalTypes(modalAnimalType);
  });
  
  // Hayvan listesi ile ilgili event listener'lar
  if (refreshAnimalListBtn) {
    refreshAnimalListBtn.addEventListener('click', async () => {
      try {
        // Yenile butonuna dönüş animasyonu ekle
        const icon = refreshAnimalListBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        
        // Hayvanları yeniden yükle
        await loadAnimals();
        
        // Animasyonu durdur
        if (icon) {
          setTimeout(() => {
            icon.classList.remove('fa-spin');
          }, 500);
        }
      } catch (error) {
        console.error('Hayvan listesi yenilenirken hata:', error);
      }
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

  // İnline tür ekleme butonu
  if (inlineAddTypeBtn) {
    inlineAddTypeBtn.addEventListener('click', async () => {
      if (!inlineTypeName.value.trim()) {
        alert('Lütfen bir tür adı girin!');
        return;
      }

      if (!activeProfileId) {
        alert('Aktif profil bulunamadı!');
        return;
      }

      try {
        const result = await window.lsmAPI.animals.types.create({
          profile_id: activeProfileId,
          name: inlineTypeName.value.trim(),
          description: '' // İnline formda açıklama alanı yok
        });

        if (result.success) {
          // Tür listesini güncelle
          await loadAnimalTypes(modalAnimalType);
          
          // Yeni eklenen türü seç
          modalAnimalType.value = result.id;
          
          // Input alanını temizle
          inlineTypeName.value = '';
          
          // Başarı mesajını göster
          const successMessage = document.getElementById('typeSuccessMessage');
          successMessage.classList.remove('d-none');
          setTimeout(() => {
            successMessage.classList.add('d-none');
          }, 3000);
        } else {
          alert('Tür eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Tür eklenirken hata:', error);
        alert('Tür eklenirken bir hata oluştu!');
      }
    });
  }

  // Enter tuşu ile tür ekleme
  if (inlineTypeName) {
    inlineTypeName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inlineAddTypeBtn.click();
      }
    });
  }

  // Sağlık kayıtları görünümü açıldığında otomatik yükle (hash değişiminde)
  window.addEventListener('hashchange', async () => {
    if (location.hash === '#health-records') {
      try {
        console.log('Sağlık bilgileri sayfası açıldı, veriler yükleniyor...');
        
        // Yenile butonuna dönüş animasyonu ekle (eğer buton varsa)
        if (refreshHealthListBtn) {
          const icon = refreshHealthListBtn.querySelector('i');
          if (icon) icon.classList.add('fa-spin');
          
          // Animasyonu belirli bir süre sonra durdur
          setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
          }, 1000);
        }
        
        // Hayvanları ve sağlık kayıtlarını yükle
        await loadHealthAnimals();
        await loadHealthRecords();
      } catch (error) {
        console.error('Sağlık bilgileri yüklenirken hata:', error);
      }
    }
    
    // Sağım kayıtları görünümü açıldığında otomatik yükle
    if (location.hash === '#milk-records') {
      try {
        console.log('Sağım verileri sayfası açıldı, veriler yükleniyor...');
        
        // Yenile butonuna dönüş animasyonu ekle (eğer buton varsa)
        if (refreshMilkListBtn) {
          const icon = refreshMilkListBtn.querySelector('i');
          if (icon) icon.classList.add('fa-spin');
          
          // Animasyonu belirli bir süre sonra durdur
          setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
          }, 1000);
        }
        
        // Sağmal hayvanları yükle
        await loadMilkAnimals();
        await loadMilkRecords();
      } catch (error) {
        console.error('Sağım verileri yüklenirken hata:', error);
      }
    }
    
    // Üreme/gebelik kayıtları görünümü açıldığında otomatik yükle
    if (location.hash === '#breeding-records' || location.hash === '#pregnancy') {
      try {
        console.log('DEBUG: Üreme/gebelik sayfası açıldı, hash:', location.hash);
        console.log('DEBUG: Active profile ID:', activeProfileId);
        console.log('DEBUG: DOM Elementleri var mı?', {
          refreshBreedingListBtn: !!refreshBreedingListBtn,
          breedingAnimalSelect: !!breedingAnimalSelect,
          breedingTableBody: !!breedingTableBody,
          upcomingBirthsList: !!upcomingBirthsList
        });
        
        console.log('Üreme/gebelik verileri sayfası açıldı, veriler yükleniyor...');
        
        // Yenile butonuna dönüş animasyonu ekle (eğer buton varsa)
        if (refreshBreedingListBtn) {
          const icon = refreshBreedingListBtn.querySelector('i');
          if (icon) icon.classList.add('fa-spin');
          
          // Animasyonu belirli bir süre sonra durdur
          setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
          }, 1000);
        }
        
        // Hayvanları ve üreme kayıtlarını yükle
        await loadBreedingAnimals();
        await loadBreedingRecords();
      } catch (error) {
        console.error('Üreme/gebelik verileri yüklenirken hata:', error);
      }
    }
  });

  // Modal açıldığında hayvanları yükle (her zaman güncel olsun)
  if (document.getElementById('addHealthModal')) {
    document.getElementById('addHealthModal').addEventListener('show.bs.modal', async () => {
      await loadHealthAnimals();
      // Eğer hiç hayvan yoksa select'e 'Kayıt bulunamadı' ekle
      if (healthAnimalSelect && healthAnimalSelect.options.length <= 1) {
        healthAnimalSelect.innerHTML = '<option value="" disabled selected>Kayıt bulunamadı</option>';
      }
    });
  }

  // Sağım kaydı modalı açıldığında sağmal hayvanları yükle
  if (document.getElementById('addMilkModal')) {
    document.getElementById('addMilkModal').addEventListener('show.bs.modal', async () => {
      await loadMilkAnimals();
      
      // Eğer hiç sağmal hayvan yoksa select'e uyarı mesajı ekle
      if (milkAnimalSelect && milkAnimalSelect.options.length <= 1) {
        milkAnimalSelect.innerHTML = '<option value="" disabled selected>Sağmal hayvan bulunamadı</option>';
      }
      
      // Günün tarihini ve saatini otomatik olarak doldur
      const now = new Date();
      
      // Tarih formatını yyyy-mm-dd şeklinde ayarla
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Saat formatını hh:mm şeklinde ayarla
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      
      if (milkDate) milkDate.value = formattedDate;
      if (milkTime) milkTime.value = formattedTime;
    });
  }

  // Üreme/gebelik kaydı modalı açıldığında dişi ve erkek hayvanları yükle
  if (document.getElementById('addBreedingModal')) {
    document.getElementById('addBreedingModal').addEventListener('show.bs.modal', async () => {
      await loadBreedingAnimals();
      
      // Günün tarihini otomatik olarak doldur
      const now = new Date();
      
      // Tarih formatını yyyy-mm-dd şeklinde ayarla
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      if (breedingDate) breedingDate.value = formattedDate;
      
      // Tahmini doğum tarihi için varsayılan değer (9 ay / 285 gün sonrası)
      const expected = new Date(now);
      expected.setDate(expected.getDate() + 285); // Yaklaşık 9.5 ay (inek için gebelik süresi)
      
      const expectedYear = expected.getFullYear();
      const expectedMonth = String(expected.getMonth() + 1).padStart(2, '0');
      const expectedDay = String(expected.getDate()).padStart(2, '0');
      const expectedDate = `${expectedYear}-${expectedMonth}-${expectedDay}`;
      
      if (breedingExpectedDate) breedingExpectedDate.value = expectedDate;
    });
  }

  // Filtre ve arama eventleri
  if (healthSearchInput) healthSearchInput.addEventListener('input', () => { healthCurrentPage = 1; filterHealthRecords(); });
  if (healthAnimalFilter) healthAnimalFilter.addEventListener('change', () => { healthCurrentPage = 1; filterHealthRecords(); });
  if (healthTypeFilter) healthTypeFilter.addEventListener('change', () => { healthCurrentPage = 1; filterHealthRecords(); });
  if (healthPageSizeSelect) healthPageSizeSelect.addEventListener('change', () => { healthPageSize = parseInt(healthPageSizeSelect.value); healthCurrentPage = 1; filterHealthRecords(); });

  // Sağım arama ve filtreleme eventleri
  if (milkSearchInput) milkSearchInput.addEventListener('input', () => { milkCurrentPage = 1; filterMilkRecords(); });
  if (milkAnimalFilter) milkAnimalFilter.addEventListener('change', () => { milkCurrentPage = 1; filterMilkRecords(); });
  if (milkDateStart) milkDateStart.addEventListener('change', () => { milkCurrentPage = 1; filterMilkRecords(); });
  if (milkDateEnd) milkDateEnd.addEventListener('change', () => { milkCurrentPage = 1; filterMilkRecords(); });
  if (milkPageSizeSelect) milkPageSizeSelect.addEventListener('change', () => { milkPageSize = parseInt(milkPageSizeSelect.value); milkCurrentPage = 1; filterMilkRecords(); });

  // Üreme/gebelik arama ve filtreleme eventleri
  if (breedingSearchInput) breedingSearchInput.addEventListener('input', () => { breedingCurrentPage = 1; filterBreedingRecords(); });
  if (breedingAnimalFilter) breedingAnimalFilter.addEventListener('change', () => { breedingCurrentPage = 1; filterBreedingRecords(); });
  if (breedingDateStart) breedingDateStart.addEventListener('change', () => { breedingCurrentPage = 1; filterBreedingRecords(); });
  if (breedingDateEnd) breedingDateEnd.addEventListener('change', () => { breedingCurrentPage = 1; filterBreedingRecords(); });
  if (breedingStatusFilter) breedingStatusFilter.addEventListener('change', () => { breedingCurrentPage = 1; filterBreedingRecords(); });
  if (breedingPageSizeSelect) breedingPageSizeSelect.addEventListener('change', () => { breedingPageSize = parseInt(breedingPageSizeSelect.value); breedingCurrentPage = 1; filterBreedingRecords(); });

  // Sağım kayıtlarını yenileme butonu
  if (refreshHealthListBtn) {
    refreshHealthListBtn.addEventListener('click', async () => {
      try {
        // Yenile butonuna dönüş animasyonu ekle
        const icon = refreshHealthListBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        
        // Sağlık kayıtlarını yeniden yükle
        await loadHealthAnimals();
        await loadHealthRecords();
        
        // Animasyonu durdur
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
        }, 500);
      } catch (error) {
        console.error('Sağlık kayıtları yenilenirken hata:', error);
      }
    });
  }

  // Yazdırma butonu
  if (printHealthListBtn) {
    printHealthListBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  // Sağlık kaydı ekleme formu submit
  if (addHealthForm) {
    addHealthForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!activeProfileId) {
        alert('Aktif profil bulunamadı!');
        return;
      }
      
      if (!healthAnimalSelect.value) {
        alert('Lütfen bir hayvan seçin!');
        return;
      }
      
      if (!healthTypeSelect.value) {
        alert('Lütfen bir sağlık işlem türü seçin!');
        return;
      }
      
      if (!healthDate.value) {
        alert('Lütfen bir tarih girin!');
        return;
      }
      
      try {
        console.log('Sağlık kaydı gönderiliyor:', {
          animal_id: healthAnimalSelect.value,
          treatment_type: healthTypeSelect.value,
          record_date: healthDate.value,
          description: healthNote.value.trim()
        });
        
        const result = await window.lsmAPI.health.create({
          animal_id: healthAnimalSelect.value,
          treatment_type: healthTypeSelect.value, // Changing type to treatment_type
          record_date: healthDate.value, // Changing date to record_date
          description: healthNote.value.trim() // Changing note to description
        });
        
        if (result.success) {
          // Modalı kapat
          const modal = bootstrap.Modal.getInstance(document.getElementById('addHealthModal'));
          if (modal) modal.hide();
          
          // Formu temizle
          addHealthForm.reset();
          
          // Tabloyu güncelle
          await loadHealthRecords();
          
          // Başarı mesajı göster
          alert('Sağlık kaydı başarıyla eklendi!');
        } else {
          alert('Sağlık kaydı eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Sağlık kaydı eklenirken hata:', error);
        alert('Sağlık kaydı eklenirken bir hata oluştu!');
      }
    });
  }
  
  // Sağım kaydı ekleme formu submit
  if (addMilkForm) {
    addMilkForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!activeProfileId) {
        alert('Aktif profil bulunamadı!');
        return;
      }
      
      if (!milkAnimalSelect.value) {
        alert('Lütfen bir hayvan seçin!');
        return;
      }
      
      if (!milkAmount.value || parseFloat(milkAmount.value) <= 0) {
        alert('Lütfen geçerli bir sağım miktarı girin!');
        return;
      }
      
      try {
        const result = await window.lsmAPI.milk.create({
          animal_id: milkAnimalSelect.value,
          milk_date: milkDate.value,
          milk_time: milkTime.value,
          amount: parseFloat(milkAmount.value),
          quality: milkQuality.value || 'B',
          note: milkNote.value.trim()
        });
        
        if (result.success) {
          // Modalı kapat
          const modal = bootstrap.Modal.getInstance(document.getElementById('addMilkModal'));
          if (modal) modal.hide();
          
          // Formu temizle
          addMilkForm.reset();
          
          // Tabloyu güncelle
          await loadMilkRecords();
          
          // Başarı mesajı göster
          alert('Sağım kaydı başarıyla eklendi!');
        } else {
          alert('Sağım kaydı eklenirken bir hata oluştu: ' + result.error);
        }
      } catch (error) {
        console.error('Sağım kaydı eklenirken hata:', error);
        alert('Sağım kaydı eklenirken bir hata oluştu!');
      }
    });
  }

  // Sağım verilerini yenileme butonu
  if (refreshMilkListBtn) {
    refreshMilkListBtn.addEventListener('click', async () => {
      try {
        // Yenile butonuna dönüş animasyonu ekle
        const icon = refreshMilkListBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        
        // Sağım verilerini yeniden yükle
        await loadMilkAnimals();
        await loadMilkRecords();
        
        // Animasyonu durdur
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
        }, 500);
      } catch (error) {
        console.error('Sağım verileri yenilenirken hata:', error);
      }
    });
  }

  /**
   * Üreme/gebelik kayıtlarını yükle
   */
  loadBreedingRecords = async function() {
    console.log('DEBUG: loadBreedingRecords çağrıldı');
    console.log('DEBUG: activeProfileId:', activeProfileId);
    console.log('DEBUG: breedingTableBody var mı?', !!breedingTableBody);
    
    if (!activeProfileId || !breedingTableBody) {
      console.log('loadBreedingRecords: Missing activeProfileId or breedingTableBody', { 
        activeProfileId, 
        breedingTableBody: !!breedingTableBody 
      });
      return;
    }
    
    try {
      // Yükleniyor göstergesini göster
      breedingTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <span class="ms-2">Üreme/gebelik kayıtları yükleniyor...</span>
          </td>
        </tr>
      `;
      
      console.log('loadBreedingRecords: Calling API with profileId:', activeProfileId);
      
      // Üreme/gebelik kayıtlarını getir
      let options = {};
      if (breedingDateStart && breedingDateStart.value) {
        options.startDate = breedingDateStart.value;
      }
      if (breedingDateEnd && breedingDateEnd.value) {
        options.endDate = breedingDateEnd.value;
      }
      if (breedingStatusFilter && breedingStatusFilter.value) {
        options.birthStatus = breedingStatusFilter.value;
      }
      
      // Üreme/gebelik kayıtlarını API'den al
      const records = await window.lsmAPI.breeding.getAll(activeProfileId, options);
      console.log('DEBUG: API yanıtı:', records);
      console.log('loadBreedingRecords: API response, records count:', records.length);
      
      // Gebeliğin son 2 ayına giren hayvanları kontrol et ve durumlarını güncelle
      await checkDryPeriodStatus(records);
      
      // Üreme/gebelik kayıtlarını filtrele ve göster
      allBreedingRecords = records;
      filterBreedingRecords();
      
      // Doğumu yaklaşan hayvanları yükle
      await loadUpcomingBirths();
      
    } catch (error) {
      console.error('Üreme/gebelik kayıtları yüklenirken hata:', error);
      breedingTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Üreme/gebelik kayıtları yüklenirken bir hata oluştu!
          </td>
        </tr>
      `;
    }
  };

  /**
   * Üreme/gebelik kayıtlarını filtrele ve göster
   */
  function filterBreedingRecords() {
    if (!breedingTableBody) return;
    
    // Arama ve filtreleme
    const searchTerm = breedingSearchInput ? breedingSearchInput.value.toLowerCase() : '';
    const animalFilter = breedingAnimalFilter ? breedingAnimalFilter.value : '';
    
    // Kayıtları filtrele
    filteredBreedingRecords = allBreedingRecords.filter(rec => {
      const matchesSearch =
        !searchTerm ||
        (rec.animal_name && rec.animal_name.toLowerCase().includes(searchTerm)) ||
        (rec.animal_tag_id && rec.animal_tag_id.toLowerCase().includes(searchTerm)) ||
        (rec.partner_name && rec.partner_name.toLowerCase().includes(searchTerm)) ||
        (rec.partner_tag_id && rec.partner_tag_id.toLowerCase().includes(searchTerm)) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchTerm));
      
      const matchesAnimal = !animalFilter || rec.animal_id == animalFilter;
      
      return matchesSearch && matchesAnimal;
    });
    
    // Sayfalama
    const totalItems = filteredBreedingRecords.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / breedingPageSize));
    
    if (breedingCurrentPage > totalPages) breedingCurrentPage = totalPages;
    const startIndex = breedingPageSize > 0 ? (breedingCurrentPage - 1) * breedingPageSize : 0;
    const endIndex = breedingPageSize > 0 ? Math.min(startIndex + breedingPageSize, totalItems) : totalItems;
    const paginated = breedingPageSize > 0 ? filteredBreedingRecords.slice(startIndex, endIndex) : filteredBreedingRecords;
    
    // Toplam sayı göstergesini güncelle
    if (breedingCount) breedingCount.textContent = totalItems;
    
    // Tabloyu oluştur
    renderBreedingTable(paginated);
    
    // Sayfalama göster
    renderBreedingPagination(totalPages);
  }

  /**
   * Üreme/gebelik tablosunu oluştur
   */
  function renderBreedingTable(records) {
    if (!breedingTableBody) return;
    
    // Her durumda önce tabloyu temizle
    breedingTableBody.innerHTML = '';
    
    if (records.length === 0) {
      breedingTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Kayıt bulunamadı</td></tr>`;
      return;
    }
    
    let html = '';
    records.forEach(rec => {
      const breedingDate = rec.breeding_date ? formatDate(rec.breeding_date) : '-';
      const expectedDate = rec.expected_birth_date ? formatDate(rec.expected_birth_date) : '-';
      const actualDate = rec.actual_birth_date ? formatDate(rec.actual_birth_date) : '-';
      
      // Durum için sınıf belirle
      let statusClass = '';
      let statusText = '';
      
      if (rec.actual_birth_date) {
        statusClass = 'badge bg-success';
        statusText = 'Tamamlandı';
      } else if (rec.expected_birth_date) {
        const today = new Date();
        const expected = new Date(rec.expected_birth_date);
        
        if (expected < today) {
          statusClass = 'badge bg-danger';
          statusText = 'Gecikmiş';
        } else {
          const diffTime = Math.abs(expected - today);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7) {
            statusClass = 'badge bg-warning text-dark';
            statusText = `${diffDays} gün kaldı`;
          } else {
            statusClass = 'badge bg-info text-dark';
            statusText = `${diffDays} gün kaldı`;
          }
        }
      } else {
        statusClass = 'badge bg-secondary';
        statusText = 'Belirsiz';
      }
      
      html += `<tr>
        <td>${rec.animal_name || '-'} ${rec.animal_tag_id ? `(${rec.animal_tag_id})` : ''}</td>
        <td>${rec.partner_name || '-'} ${rec.partner_tag_id ? `(${rec.partner_tag_id})` : ''}</td>
        <td>${breedingDate}</td>
        <td>${expectedDate}</td>
        <td>${actualDate}</td>
        <td>${rec.offspring_count || '-'}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary btn-sm edit-breeding" data-id="${rec.id}" title="Düzenle"><i class="fas fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm delete-breeding" data-id="${rec.id}" title="Sil"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    });
    
    breedingTableBody.innerHTML = html;
    
    // Silme ve düzenleme butonları için event ekle
    document.querySelectorAll('.delete-breeding').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        deleteBreedingRecord(id);
      });
    });
    
    document.querySelectorAll('.edit-breeding').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openEditBreedingModal(id);
      });
    });
  }

  /**
   * Üreme/gebelik sayfalama oluştur
   */
  function renderBreedingPagination(totalPages) {
    if (!breedingPagination) return;
    
    if (totalPages <= 1) { 
      breedingPagination.innerHTML = ''; 
      return; 
    }
    
    let html = '';
    html += `<li class="page-item ${breedingCurrentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${breedingCurrentPage - 1}">&laquo;</a></li>`;
    
    for (let i = 1; i <= totalPages; i++) {
      html += `<li class="page-item ${i === breedingCurrentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
    
    html += `<li class="page-item ${breedingCurrentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${breedingCurrentPage + 1}">&raquo;</a></li>`;
    
    breedingPagination.innerHTML = html;
    
    document.querySelectorAll('#breedingPagination .page-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(link.dataset.page);
        if (page >= 1 && page <= totalPages) {
          breedingCurrentPage = page;
          filterBreedingRecords();
        }
      });
    });
  }

  /**
   * Üreme/gebelik kaydını sil
   */
  async function deleteBreedingRecord(id) {
    if (!confirm('Bu üreme/gebelik kaydını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const result = await window.lsmAPI.breeding.delete(id);
      
      if (result.success) {
        // Kayıtları yeniden yükle
        await loadBreedingRecords();
        alert('Üreme/gebelik kaydı başarıyla silindi!');
      } else {
        alert('Üreme/gebelik kaydı silinirken bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error(`Üreme/gebelik kaydı silinirken hata (ID: ${id}):`, error);
      alert('Üreme/gebelik kaydı silinirken bir hata oluştu!');
    }
  }

  /**
   * Düzenleme modalını aç
   */
  function openEditBreedingModal(id) {
    alert(`Üreme/gebelik kaydı düzenleme henüz eklenmedi! Kayıt ID: ${id}`);
    // TODO: Düzenleme modalı kodunu ekle
  }

  /**
   * Dişi ve erkek hayvanları üreme modalı için yükle
   */
  loadBreedingAnimals = async function() {
    if (!activeProfileId) return;
    try {
      const animals = await window.lsmAPI.animals.getAll(activeProfileId);
      
      // Ana hayvan select (sadece dişiler)
      if (breedingAnimalSelect) {
        breedingAnimalSelect.innerHTML = '<option value="" selected disabled>Hayvan seçin</option>';
        
        const femaleAnimals = animals.filter(animal => animal.gender === 'Dişi');
        
        if (femaleAnimals.length === 0) {
          const opt = document.createElement('option');
          opt.value = "";
          opt.disabled = true;
          opt.textContent = "Dişi hayvan bulunamadı";
          breedingAnimalSelect.appendChild(opt);
        } else {
          femaleAnimals.forEach(animal => {
            const opt = document.createElement('option');
            opt.value = animal.id;
            opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'})`;
            breedingAnimalSelect.appendChild(opt);
          });
        }
      }
      
      // Eş hayvan select (sadece erkekler)
      if (breedingPartnerSelect) {
        breedingPartnerSelect.innerHTML = '<option value="" selected>Eş seçin (opsiyonel)</option>';
        
        const maleAnimals = animals.filter(animal => animal.gender === 'Erkek');
        
        if (maleAnimals.length === 0) {
          const opt = document.createElement('option');
          opt.value = "";
          opt.disabled = true;
          opt.textContent = "Erkek hayvan bulunamadı";
          breedingPartnerSelect.appendChild(opt);
        } else {
          maleAnimals.forEach(animal => {
            const opt = document.createElement('option');
            opt.value = animal.id;
            opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'})`;
            breedingPartnerSelect.appendChild(opt);
          });
        }
      }
      
      // Filtre select (tüm hayvanlar)
      if (breedingAnimalFilter) {
        breedingAnimalFilter.innerHTML = '<option value="" selected>Tüm Hayvanlar</option>';
        animals.forEach(animal => {
          const opt = document.createElement('option');
          opt.value = animal.id;
          opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'})`;
          breedingAnimalFilter.appendChild(opt);
        });
      }
    } catch (error) {
      console.error('Üreme için hayvanlar yüklenirken hata:', error);
    }
  };

  /**
   * Doğumu yaklaşan hayvanları yükle
   */
  loadUpcomingBirths = async function() {
    if (!activeProfileId || !upcomingBirthsList) return;
    
    try {
      // 30 gün içinde doğumu beklenenleri getir
      const upcomingBirths = await window.lsmAPI.breeding.getUpcomingBirths(activeProfileId, 30);
      
      if (upcomingBirths.length === 0) {
        upcomingBirthsList.innerHTML = `
          <li class="list-group-item text-center">
            <i class="fas fa-info-circle me-2"></i> 30 gün içinde beklenen doğum bulunmuyor
          </li>
        `;
        return;
      }
      
      let html = '';
      upcomingBirths.forEach(birth => {
        const daysRemaining = Math.round(birth.days_remaining);
        
        // Kalan süreye göre renk belirle
        let badgeClass = 'bg-info';
        if (daysRemaining <= 7) badgeClass = 'bg-warning text-dark';
        if (daysRemaining <= 3) badgeClass = 'bg-danger';
        
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${birth.animal_name || '-'}</strong> (${birth.animal_tag_id || '-'})
              <br>
              <small>Beklenen doğum: ${formatDate(birth.expected_birth_date)}</small>
            </div>
            <span class="badge ${badgeClass}">${daysRemaining} gün kaldı</span>
          </li>
        `;
      });
      
      upcomingBirthsList.innerHTML = html;
    } catch (error) {
      console.error('Doğumu yaklaşan hayvanlar yüklenirken hata:', error);
      upcomingBirthsList.innerHTML = `
        <li class="list-group-item text-center text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i> Yükleme hatası!
        </li>
      `;
    }
  };
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
    
    // Dashboard görünümü ise istatistikleri güncelle
    if (viewId === 'dashboard-view' && activeProfileId) {
      // Biraz gecikme ekleyerek DOM'un güncellenmesine izin ver
      setTimeout(() => {
        updateDashboardStats();
      }, 100);
    }
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
        console.log('setInitialActiveProfile: Active profile set to:', activeProfileId);
        return profile.id; // Profile ID'yi döndür
      }
    }
    return null;
  } catch (error) {
    console.error('Aktif profil ayarlanırken hata:', error);
    return null;
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
      case 'Sağmal': statusClass = 'badge bg-success'; break;
      case 'Gebe': statusClass = 'badge bg-info text-dark'; break;
      case 'Kuruda': statusClass = 'badge bg-warning'; break;
      case 'Yeni Doğum': statusClass = 'badge bg-primary'; break;
      case 'Buzağı': statusClass = 'badge bg-warning text-dark'; break;
      case 'Düve': statusClass = 'badge bg-secondary'; break;
      case 'Boşta': statusClass = 'badge bg-light text-dark'; break;
      case 'Hasta': statusClass = 'badge bg-danger'; break;
      case 'Öldü': statusClass = 'badge bg-dark'; break;
      case 'Satıldı': statusClass = 'badge bg-purple'; break;
      default: statusClass = 'badge bg-light text-dark';
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
  if (!activeProfileId) return;

  try {
    // Refresh butonu animasyonu
    const refreshDashboardBtn = document.getElementById('refreshDashboardBtn');
    if (refreshDashboardBtn) {
      const icon = refreshDashboardBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      
      // Animasyonu belirli süre sonra durdur
      setTimeout(() => {
        if (icon) icon.classList.remove('fa-spin');
      }, 1000);
    }
    
    // 1. Toplam hayvan sayısı
  const totalAnimalsElement = document.getElementById('totalAnimals');
    if (totalAnimalsElement) {
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
    
    // 2. Hayvan durumu dağılımı grafiği
    await updateAnimalStatusChart();
    
    // 3. Süt üretimi grafiği ve toplam değer
    await updateMilkProductionStats();
    
    // 4. Yaklaşan doğumlar listesi ve sayısı
    await updateUpcomingBirthsStats();
    
    // 5. Son sağlık kayıtları ve toplam sayı
    await updateHealthRecordsStats();
    
  } catch (error) {
    console.error('Dashboard istatistikleri güncellenirken hata:', error);
  }
}

// Hayvan durumu dağılımı grafiği oluştur
async function updateAnimalStatusChart() {
  const chartCanvas = document.getElementById('animalStatusChart');
  if (!chartCanvas || !activeProfileId) return;

  try {
    // Hayvanları getir
    const animals = await window.lsmAPI.animals.getAll(activeProfileId);
    
    // Durum bazında grupla
    const statusCounts = {};
    animals.forEach(animal => {
      const status = animal.status || 'Belirtilmemiş';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Grafik verisini hazırla
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    
    // Renkler
    const colors = [
      '#4e73df', // Birincil (primary)
      '#1cc88a', // Başarılı (success)
      '#36b9cc', // Bilgi (info)
      '#f6c23e', // Uyarı (warning)
      '#e74a3b', // Tehlike (danger)
      '#858796', // İkincil (secondary)
      '#5a5c69', // Karanlık (dark)
      '#f8f9fc', // Açık (light)
      '#6f42c1', // Mor (purple)
      '#fd7e14'  // Turuncu (orange)
    ];
    
    // Grafik nesnesini oluştur veya güncelle
    if (window.animalStatusChart) {
      window.animalStatusChart.data.labels = labels;
      window.animalStatusChart.data.datasets[0].data = data;
      window.animalStatusChart.update();
    } else {
      window.animalStatusChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            hoverBackgroundColor: colors.slice(0, labels.length),
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Hayvan durumu grafiği oluşturulurken hata:', error);
  }
}

// Süt üretimi grafiği ve toplam değeri güncelle
async function updateMilkProductionStats() {
  const chartCanvas = document.getElementById('milkProductionChart');
  const totalMilkElement = document.getElementById('totalMilkProduction');
  if (!activeProfileId) return;

  try {
    // Son 30 gün için tarih aralığı hesapla
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Tarih formatını YYYY-MM-DD olarak biçimlendir
    const formatDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Süt kayıtlarını getir
    const options = {
      startDate: formatDateStr(startDate),
      endDate: formatDateStr(endDate)
    };
    
    // Süt istatistiklerini getir
    const stats = await window.lsmAPI.milk.getStats(activeProfileId, options);
    const records = await window.lsmAPI.milk.getAll(activeProfileId, options);
    
    // Toplam süt miktarını güncelle
    if (totalMilkElement && stats) {
      const totalLiters = stats.total_amount || 0;
      totalMilkElement.textContent = `${totalLiters.toFixed(1)} L`;
    }
    
    // Grafiği güncelle
    if (chartCanvas && records) {
      // Günlere göre süt miktarlarını hesapla
      const dailyData = {};
      const dayLabels = [];
      
      // Son 30 günü oluştur
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDateStr(date);
        dailyData[dateStr] = 0;
      }
      
      // Verileri günlere göre topla
      records.forEach(record => {
        const date = record.milk_date;
        if (date && dailyData[date] !== undefined) {
          dailyData[date] += parseFloat(record.amount) || 0;
        }
      });
      
      // Sıralı tarihler ve veriler oluştur
      const sortedDates = Object.keys(dailyData).sort();
      const sortedAmounts = sortedDates.map(date => dailyData[date]);
      
      // Okunabilir tarih formatlarını oluştur
      const formattedDates = sortedDates.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      });
      
      // Grafik nesnesini oluştur veya güncelle
      if (window.milkProductionChart) {
        window.milkProductionChart.data.labels = formattedDates;
        window.milkProductionChart.data.datasets[0].data = sortedAmounts;
        window.milkProductionChart.update();
      } else {
        window.milkProductionChart = new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: formattedDates,
            datasets: [{
              label: 'Günlük Süt Üretimi (L)',
              data: sortedAmounts,
              lineTension: 0.3,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              fill: true
            }]
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Üretim (L)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Tarih (Gün/Ay)'
                }
              }
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Süt üretimi istatistikleri güncellenirken hata:', error);
    if (totalMilkElement) totalMilkElement.textContent = '? L';
  }
}

// Yaklaşan doğumlar listesi ve sayısı güncelle
async function updateUpcomingBirthsStats() {
  const birthsListElement = document.getElementById('dashboardUpcomingBirths');
  const birthsCountElement = document.getElementById('upcomingBirthCount');
  if (!activeProfileId) return;

  try {
    // 30 gün içinde beklenen doğumları getir
    const upcomingBirths = await window.lsmAPI.breeding.getUpcomingBirths(activeProfileId, 30);
    
    // Yaklaşan doğum sayısını güncelle
    if (birthsCountElement) {
      birthsCountElement.textContent = upcomingBirths.length || 0;
    }
    
    // Listede göster
    if (birthsListElement) {
      if (upcomingBirths.length === 0) {
        birthsListElement.innerHTML = `
          <li class="list-group-item text-center">
            <i class="fas fa-info-circle me-2"></i> 30 gün içinde beklenen doğum bulunmuyor
          </li>
        `;
        return;
      }
      
      // En fazla 5 doğum göster
      const displayBirths = upcomingBirths.slice(0, 5);
      let html = '';
      
      displayBirths.forEach(birth => {
        const daysRemaining = Math.round(birth.days_remaining);
        
        // Kalan süreye göre renk belirle
        let badgeClass = 'bg-info';
        if (daysRemaining <= 7) badgeClass = 'bg-warning text-dark';
        if (daysRemaining <= 3) badgeClass = 'bg-danger';
        
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${birth.animal_name || '-'}</strong> (${birth.animal_tag_id || '-'})
              <br>
              <small>Beklenen: ${formatDate(birth.expected_birth_date)}</small>
            </div>
            <span class="badge ${badgeClass}">${daysRemaining} gün</span>
          </li>
        `;
      });
      
      birthsListElement.innerHTML = html;
    }
  } catch (error) {
    console.error('Yaklaşan doğumlar güncellenirken hata:', error);
    if (birthsCountElement) birthsCountElement.textContent = '?';
    if (birthsListElement) {
      birthsListElement.innerHTML = `
        <li class="list-group-item text-center text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i> Yükleme hatası!
        </li>
      `;
    }
  }
}

// Son sağlık kayıtları ve toplam sayı güncelle
async function updateHealthRecordsStats() {
  const healthTableBody = document.getElementById('dashboardHealthRecords');
  const healthCountElement = document.getElementById('recentHealthCount');
  if (!activeProfileId) return;

  try {
    // Son 30 günün tarihini hesapla
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Tarih formatını YYYY-MM-DD olarak biçimlendir
    const formatDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Sağlık kayıtlarını getir
    const options = {
      startDate: formatDateStr(startDate),
      endDate: formatDateStr(endDate)
    };
    
    // Tüm sağlık kayıtlarını getir
    const allRecords = await window.lsmAPI.health.getAll(activeProfileId);
    
    // Son 30 gündeki kayıtları filtrele
    const recentRecords = allRecords.filter(rec => {
      const recordDate = rec.record_date || rec.date;
      if (!recordDate) return false;
      
      const date = new Date(recordDate);
      return date >= startDate && date <= endDate;
    });
    
    // Toplam sayıyı güncelle
    if (healthCountElement) {
      healthCountElement.textContent = recentRecords.length || 0;
    }
    
    // Sağlık kayıtları listesini güncelle
    if (healthTableBody) {
      if (recentRecords.length === 0) {
        healthTableBody.innerHTML = `
          <tr>
            <td colspan="3" class="text-center">
              <i class="fas fa-info-circle me-2"></i> Son 30 günde sağlık kaydı bulunmuyor
            </td>
          </tr>
        `;
        return;
      }
      
      // Kayıtları tarihe göre sırala (en yeni en üstte)
      const sortedRecords = recentRecords.sort((a, b) => {
        const dateA = new Date(a.record_date || a.date || 0);
        const dateB = new Date(b.record_date || b.date || 0);
        return dateB - dateA;
      });
      
      // En fazla 5 kayıt göster
      const displayRecords = sortedRecords.slice(0, 5);
      
      let html = '';
      displayRecords.forEach(rec => {
        const date = rec.record_date || rec.date ? formatDate(rec.record_date || rec.date) : '-';
        html += `
          <tr>
            <td>${rec.animal_name || '-'}</td>
            <td>${date}</td>
            <td>${rec.treatment_type || rec.type || '-'}</td>
          </tr>
        `;
      });
      
      healthTableBody.innerHTML = html;
    }
  } catch (error) {
    console.error('Sağlık kayıtları güncellenirken hata:', error);
    if (healthCountElement) healthCountElement.textContent = '?';
    if (healthTableBody) {
      healthTableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">
            <i class="fas fa-exclamation-triangle me-2"></i> Yükleme hatası!
          </td>
        </tr>
      `;
    }
  }
}

// Hayvanları sağlık modalı için yükle
async function loadHealthAnimals() {
  if (!activeProfileId) return;
  try {
    const animals = await window.lsmAPI.animals.getAll(activeProfileId);
    // Modal select
    if (healthAnimalSelect) {
      healthAnimalSelect.innerHTML = '<option value="" selected disabled>Hayvan seçin</option>';
      animals.forEach(animal => {
        const opt = document.createElement('option');
        opt.value = animal.id;
        opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'})`;
        healthAnimalSelect.appendChild(opt);
      });
    }
    // Filtre select
    if (healthAnimalFilter) {
      healthAnimalFilter.innerHTML = '<option value="" selected>Tüm Hayvanlar</option>';
      animals.forEach(animal => {
        const opt = document.createElement('option');
        opt.value = animal.id;
        opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'})`;
        healthAnimalFilter.appendChild(opt);
      });
    }
  } catch (error) {
    console.error('Hayvanlar yüklenirken hata:', error);
  }
}

// Hayvanları sağım modalı için yükle (Sağmal hayvanlar ve gebeliğin son 2 ayına girmemiş inekler)
async function loadMilkAnimals() {
  if (!activeProfileId) return;
  try {
    const animals = await window.lsmAPI.animals.getAll(activeProfileId);
    
    // Sağmal ve Gebe durumundaki dişi hayvanları filtrele, "Kuruda" olanları hariç tut
    const milkingAnimals = animals.filter(animal => 
      animal.gender === 'Dişi' && 
      (animal.status === 'Sağmal' || animal.status === 'Gebe') && 
      animal.status !== 'Kuruda'
    );
    
    // Modal select
    if (milkAnimalSelect) {
      milkAnimalSelect.innerHTML = '<option value="" selected disabled>Hayvan seçin</option>';
      
      if (milkingAnimals.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.disabled = true;
        opt.textContent = "Sağılabilir hayvan bulunamadı";
        milkAnimalSelect.appendChild(opt);
      } else {
        milkingAnimals.forEach(animal => {
          const opt = document.createElement('option');
          opt.value = animal.id;
          opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'}) - ${animal.status}`;
          milkAnimalSelect.appendChild(opt);
        });
      }
    }
    
    // Filtre select
    if (milkAnimalFilter) {
      milkAnimalFilter.innerHTML = '<option value="" selected>Tüm Hayvanlar</option>';
      milkingAnimals.forEach(animal => {
        const opt = document.createElement('option');
        opt.value = animal.id;
        opt.textContent = `${animal.name || '-'} (${animal.tag_id || '-'}) - ${animal.status}`;
        milkAnimalFilter.appendChild(opt);
      });
    }
  } catch (error) {
    console.error('Sağılabilir hayvanlar yüklenirken hata:', error);
  }
}

// Sağlık kayıtlarını yükle
async function loadHealthRecords() {
  if (!activeProfileId || !healthTableBody) {
    console.log('loadHealthRecords: Missing activeProfileId or healthTableBody', { 
      activeProfileId, 
      healthTableBody: !!healthTableBody 
    });
    return;
  }
  try {
    // Yükleniyor göstergesini göster
    healthTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
          <span class="ms-2">Sağlık kayıtları yükleniyor...</span>
        </td>
      </tr>
    `;
    
    console.log('loadHealthRecords: Calling API with profileId:', activeProfileId);
    // Sağlık kayıtlarını getir
    allHealthRecords = await window.lsmAPI.health.getAll(activeProfileId);
    console.log('loadHealthRecords: API response:', allHealthRecords);
    filterHealthRecords();
  } catch (error) {
    console.error('Sağlık kayıtları yüklenirken hata:', error);
    healthTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Sağlık kayıtları yüklenirken bir hata oluştu!</td></tr>`;
  }
}

// Sağlık kayıtlarını filtrele ve göster
function filterHealthRecords() {
  if (!healthTableBody) return;
  const searchTerm = healthSearchInput ? healthSearchInput.value.toLowerCase() : '';
  const animalFilter = healthAnimalFilter ? healthAnimalFilter.value : '';
  const typeFilter = healthTypeFilter ? healthTypeFilter.value : '';
  filteredHealthRecords = allHealthRecords.filter(rec => {
    const matchesSearch =
      !searchTerm ||
      (rec.animal_name && rec.animal_name.toLowerCase().includes(searchTerm)) ||
      (rec.tag_id && rec.tag_id.toLowerCase().includes(searchTerm)) ||
      (rec.type && rec.type.toLowerCase().includes(searchTerm)) ||
      (rec.treatment_type && rec.treatment_type.toLowerCase().includes(searchTerm)) ||
      (rec.description && rec.description.toLowerCase().includes(searchTerm)) ||
      (rec.note && rec.note.toLowerCase().includes(searchTerm));
    const matchesAnimal = !animalFilter || rec.animal_id == animalFilter;
    const matchesType = !typeFilter || 
                       (rec.type && rec.type == typeFilter) || 
                       (rec.treatment_type && rec.treatment_type == typeFilter);
    return matchesSearch && matchesAnimal && matchesType;
  });
  
  // Sayfalama
  const totalItems = filteredHealthRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / healthPageSize));
  
  if (healthCurrentPage > totalPages) healthCurrentPage = totalPages;
  const startIndex = healthPageSize > 0 ? (healthCurrentPage - 1) * healthPageSize : 0;
  const endIndex = healthPageSize > 0 ? Math.min(startIndex + healthPageSize, totalItems) : totalItems;
  const paginated = healthPageSize > 0 ? filteredHealthRecords.slice(startIndex, endIndex) : filteredHealthRecords;
  
  if (healthCount) healthCount.textContent = totalItems;
  renderHealthTable(paginated);
  renderHealthPagination(totalPages);
}

// Sağlık tablosunu oluştur (güncel)
function renderHealthTable(records) {
  if (!healthTableBody) return;
  // Her durumda önce tabloyu temizle
  healthTableBody.innerHTML = '';
  if (records.length === 0) {
    healthTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Kayıt bulunamadı</td></tr>`;
    return;
  }
  let html = '';
  records.forEach(rec => {
    const date = rec.date ? formatDate(rec.date) : (rec.record_date ? formatDate(rec.record_date) : '-');
    html += `<tr>
      <td>${rec.animal_name || '-'}</td>
      <td>${rec.tag_id || '-'}</td>
      <td>${rec.type || rec.treatment_type || '-'}</td>
      <td>${date}</td>
      <td>${rec.note || rec.description || '-'}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary btn-sm edit-health" data-id="${rec.id}" title="Düzenle"><i class="fas fa-edit"></i></button>
          <button class="btn btn-outline-danger btn-sm delete-health" data-id="${rec.id}" title="Sil"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  });
  healthTableBody.innerHTML = html;
  // Silme ve düzenleme butonları için event ekle
  document.querySelectorAll('.delete-health').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      deleteHealthRecord(id);
    });
  });
  document.querySelectorAll('.edit-health').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openEditHealthModal(id);
    });
  });
}

// Sağlık sayfalama oluştur
function renderHealthPagination(totalPages) {
  if (!healthPagination) return;
  if (totalPages <= 1) { healthPagination.innerHTML = ''; return; }
  let html = '';
  html += `<li class="page-item ${healthCurrentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${healthCurrentPage - 1}">&laquo;</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === healthCurrentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  html += `<li class="page-item ${healthCurrentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${healthCurrentPage + 1}">&raquo;</a></li>`;
  healthPagination.innerHTML = html;
  document.querySelectorAll('#healthPagination .page-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (page >= 1 && page <= totalPages) {
        healthCurrentPage = page;
        filterHealthRecords();
      }
    });
  });
}

/**
 * Sağım kayıtlarını yükle
 */
async function loadMilkRecords() {
  if (!activeProfileId || !milkTableBody) {
    console.log('loadMilkRecords: Missing activeProfileId or milkTableBody', { 
      activeProfileId, 
      milkTableBody: !!milkTableBody 
    });
    return;
  }
  
  try {
    // Yükleniyor göstergesini göster
    milkTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
          <span class="ms-2">Sağım kayıtları yükleniyor...</span>
        </td>
      </tr>
    `;
    
    console.log('loadMilkRecords: Calling API with profileId:', activeProfileId);
    
    // Sağım kayıtlarını getir
    let options = {};
    if (milkDateStart && milkDateStart.value) {
      options.startDate = milkDateStart.value;
    }
    if (milkDateEnd && milkDateEnd.value) {
      options.endDate = milkDateEnd.value;
    }
    
    // Sağım kayıtlarını API'den al
    const records = await window.lsmAPI.milk.getAll(activeProfileId, options);
    console.log('loadMilkRecords: API response, records count:', records.length);
    
    // Sağım kayıtlarını filtrele ve göster
    allMilkRecords = records;
    filterMilkRecords();
    
    // Toplam sağım miktarını göster
    updateMilkTotalAmount();
    
  } catch (error) {
    console.error('Sağım kayıtları yüklenirken hata:', error);
    milkTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Sağım kayıtları yüklenirken bir hata oluştu!
        </td>
      </tr>
    `;
  }
}

/**
 * Sağım kayıtlarını filtrele ve göster
 */
function filterMilkRecords() {
  if (!milkTableBody) return;
  
  // Arama ve filtreleme
  const searchTerm = milkSearchInput ? milkSearchInput.value.toLowerCase() : '';
  const animalFilter = milkAnimalFilter ? milkAnimalFilter.value : '';
  
  // Kayıtları filtrele
  filteredMilkRecords = allMilkRecords.filter(rec => {
    const matchesSearch =
      !searchTerm ||
      (rec.animal_name && rec.animal_name.toLowerCase().includes(searchTerm)) ||
      (rec.tag_id && rec.tag_id.toLowerCase().includes(searchTerm)) ||
      (rec.note && rec.note.toLowerCase().includes(searchTerm));
    
    const matchesAnimal = !animalFilter || rec.animal_id == animalFilter;
    
    return matchesSearch && matchesAnimal;
  });
  
  // Sayfalama
  const totalItems = filteredMilkRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / milkPageSize));
  
  if (milkCurrentPage > totalPages) milkCurrentPage = totalPages;
  const startIndex = milkPageSize > 0 ? (milkCurrentPage - 1) * milkPageSize : 0;
  const endIndex = milkPageSize > 0 ? Math.min(startIndex + milkPageSize, totalItems) : totalItems;
  const paginated = milkPageSize > 0 ? filteredMilkRecords.slice(startIndex, endIndex) : filteredMilkRecords;
  
  // Toplam sayı göstergesini güncelle
  if (milkCount) milkCount.textContent = totalItems;
  
  // Tabloyu oluştur
  renderMilkTable(paginated);
  
  // Sayfalama göster
  renderMilkPagination(totalPages);
  
  // Toplam sağım miktarını güncelle
  updateMilkTotalAmount();
}

/**
 * Sağım tablosunu oluştur
 */
function renderMilkTable(records) {
  if (!milkTableBody) return;
  
  // Her durumda önce tabloyu temizle
  milkTableBody.innerHTML = '';
  
  if (records.length === 0) {
    milkTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Kayıt bulunamadı</td></tr>`;
    return;
  }
  
  let html = '';
  records.forEach(rec => {
    const date = rec.milk_date ? formatDate(rec.milk_date) : '-';
    
    // Kalite için sınıf belirle
    let qualityClass = '';
    switch (rec.quality) {
      case 'A': qualityClass = 'badge bg-success'; break;
      case 'B': qualityClass = 'badge bg-info'; break;
      case 'C': qualityClass = 'badge bg-warning text-dark'; break;
      case 'D': qualityClass = 'badge bg-danger'; break;
      default: qualityClass = 'badge bg-secondary';
    }
    
    html += `<tr>
      <td>${rec.animal_name || '-'}</td>
      <td>${rec.tag_id || '-'}</td>
      <td>${date}</td>
      <td>${rec.milk_time || '-'}</td>
      <td>${parseFloat(rec.amount).toFixed(1)} L</td>
      <td><span class="${qualityClass}">${rec.quality || '-'}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary btn-sm edit-milk" data-id="${rec.id}" title="Düzenle"><i class="fas fa-edit"></i></button>
          <button class="btn btn-outline-danger btn-sm delete-milk" data-id="${rec.id}" title="Sil"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  });
  
  milkTableBody.innerHTML = html;
  
  // Silme ve düzenleme butonları için event ekle
  document.querySelectorAll('.delete-milk').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      deleteMilkRecord(id);
    });
  });
  
  document.querySelectorAll('.edit-milk').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openEditMilkModal(id);
    });
  });
}

/**
 * Sağım sayfalama oluştur
 */
function renderMilkPagination(totalPages) {
  if (!milkPagination) return;
  
  if (totalPages <= 1) { 
    milkPagination.innerHTML = ''; 
    return; 
  }
  
  let html = '';
  html += `<li class="page-item ${milkCurrentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${milkCurrentPage - 1}">&laquo;</a></li>`;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === milkCurrentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  
  html += `<li class="page-item ${milkCurrentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${milkCurrentPage + 1}">&raquo;</a></li>`;
  
  milkPagination.innerHTML = html;
  
  document.querySelectorAll('#milkPagination .page-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (page >= 1 && page <= totalPages) {
        milkCurrentPage = page;
        filterMilkRecords();
      }
    });
  });
}

/**
 * Toplam sağım miktarını güncelle
 */
function updateMilkTotalAmount() {
  if (!milkTotalLiters) return;
  
  // Filtrelenmiş kayıtların toplam miktarını hesapla
  const total = filteredMilkRecords.reduce((sum, rec) => sum + parseFloat(rec.amount || 0), 0);
  milkTotalLiters.textContent = total.toFixed(1) + ' L';
}

/**
 * Sağım kayıtlarını sil
 */
async function deleteMilkRecord(id) {
  if (!confirm('Bu sağım kaydını silmek istediğinizden emin misiniz?')) {
    return;
  }
  
  try {
    const result = await window.lsmAPI.milk.delete(id);
    
    if (result.success) {
      // Kayıtları yeniden yükle
      await loadMilkRecords();
      alert('Sağım kaydı başarıyla silindi!');
    } else {
      alert('Sağım kaydı silinirken bir hata oluştu: ' + result.error);
    }
  } catch (error) {
    console.error(`Sağım kaydı silinirken hata (ID: ${id}):`, error);
    alert('Sağım kaydı silinirken bir hata oluştu!');
  }
}

/**
 * Düzenleme modalını aç
 */
function openEditMilkModal(id) {
  alert(`Sağım kaydı düzenleme henüz eklenmedi! Kayıt ID: ${id}`);
  // TODO: Düzenleme modalı kodunu ekle
}

// Üreme/gebelik kayıtları için form submit
if (addBreedingForm) {
  addBreedingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!activeProfileId) {
      alert('Aktif profil bulunamadı!');
      return;
    }
    
    if (!breedingAnimalSelect.value) {
      alert('Lütfen bir hayvan seçin!');
      return;
    }
    
    if (!breedingDate.value) {
      alert('Lütfen çiftleşme tarihini girin!');
      return;
    }
    
    try {
      // Debug için form verilerini yazdır
      console.log('Üreme kaydı eklenecek veri:', {
        animalId: breedingAnimalSelect.value,
        partnerId: breedingPartnerSelect.value || null,
        breedingDate: breedingDate.value,
        expectedDate: breedingExpectedDate.value || null,
        actualDate: breedingActualDate.value || null,
        offspringCount: breedingOffspringCount.value ? parseInt(breedingOffspringCount.value) : null,
        notes: breedingNote.value.trim()
      });
      
      const recordData = {
        animal_id: parseInt(breedingAnimalSelect.value),
        partner_id: breedingPartnerSelect.value ? parseInt(breedingPartnerSelect.value) : null,
        breeding_date: breedingDate.value,
        expected_birth_date: breedingExpectedDate.value || null,
        actual_birth_date: breedingActualDate.value || null,
        offspring_count: breedingOffspringCount.value ? parseInt(breedingOffspringCount.value) : null,
        notes: breedingNote.value.trim()
      };
      
      console.log('API çağrısı yapılıyor: window.lsmAPI.breeding.create');
      const result = await window.lsmAPI.breeding.create(recordData);
      console.log('API yanıtı:', result);
      
      if (result.success) {
        // Modalı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBreedingModal'));
        if (modal) modal.hide();
        
        // Formu temizle
        addBreedingForm.reset();
        
        // Hayvan durumunu güncelle
        if (recordData.expected_birth_date) {
          // Hayvanın güncel durumunu kontrol et
          const animalData = await window.lsmAPI.animals.getById(recordData.animal_id);
          
          if (animalData) {
            // Beklenen doğum tarihi ile bugün arasındaki farkı hesapla
            const expectedBirthDate = new Date(recordData.expected_birth_date);
            const today = new Date();
            const timeUntilBirth = expectedBirthDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeUntilBirth / (24 * 60 * 60 * 1000));
            
            let newStatus = animalData.status;
            
            // Eğer hayvan Boşta ise veya durumu belirtilmemişse, Gebe olarak işaretle
            if (animalData.status === 'Boşta' || !animalData.status) {
              newStatus = 'Gebe';
            }
            
            // Eğer doğuma 60 günden az kaldıysa, Kuruda olarak işaretle
            if (daysRemaining <= 60) {
              newStatus = 'Kuruda';
            }
            
            // Durum değiştiyse hayvanı güncelle
            if (newStatus !== animalData.status) {
              const updateResult = await window.lsmAPI.animals.update({
                id: recordData.animal_id,
                status: newStatus
              });
              
              if (updateResult.success) {
                console.log(`Hayvan durumu '${newStatus}' olarak güncellendi. Doğuma ${daysRemaining} gün kaldı.`);
              }
            }
          }
        }
        
        // Tabloyu güncelle
        await loadBreedingRecords();
        
        // Başarı mesajı göster
        alert('Üreme/gebelik kaydı başarıyla eklendi!');
    } else {
        console.error('Üreme kaydı eklenemedi:', result.error);
        alert('Üreme/gebelik kaydı eklenirken bir hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error('Üreme/gebelik kaydı eklenirken hata:', error);
      
      // Hata detaylarını göster
      let errorMessage = 'Üreme/gebelik kaydı eklenirken bir hata oluştu!';
      if (error.message) {
        errorMessage += '\n\nHata detayı: ' + error.message;
      }
      
      alert(errorMessage);
    }
  });
}

// Üreme/gebelik verilerini yenileme butonu
if (refreshBreedingListBtn) {
  refreshBreedingListBtn.addEventListener('click', async () => {
    try {
      // Yenile butonuna dönüş animasyonu ekle
      const icon = refreshBreedingListBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      
      // Üreme verilerini yeniden yükle
      await loadBreedingAnimals();
      await loadBreedingRecords();
      
      // Animasyonu durdur
      setTimeout(() => {
        if (icon) icon.classList.remove('fa-spin');
      }, 500);
    } catch (error) {
      console.error('Üreme/gebelik verileri yenilenirken hata:', error);
    }
  });
}

// Yazdırma butonu
if (printBreedingListBtn) {
  printBreedingListBtn.addEventListener('click', () => {
    window.print();
  });
}

/**
 * Gebeliğin son 2 ayına giren hayvanların durumunu kontrol et
 * @param {Array} records - Üreme kayıtları
 */
async function checkDryPeriodStatus(records) {
  if (!records || !records.length) return;
  
  try {
    // Gebe hayvanları bul
    const pregnantAnimals = records.filter(rec => 
      // Doğum yapmamış ve tahmini doğum tarihi olan kayıtlar
      !rec.actual_birth_date && rec.expected_birth_date
    );
    
    if (!pregnantAnimals.length) return;
    
    const today = new Date();
    const twoMonthsInMs = 60 * 24 * 60 * 60 * 1000; // 60 gün
    const animalsToUpdate = [];
    
    // Son 2 ayına giren hayvanları belirle
    pregnantAnimals.forEach(rec => {
      const expectedBirthDate = new Date(rec.expected_birth_date);
      const timeUntilBirth = expectedBirthDate.getTime() - today.getTime();
      
      // Eğer 2 aydan az kalmışsa ve hayvanın durumu "Gebe" ise
      if (timeUntilBirth <= twoMonthsInMs) {
        animalsToUpdate.push({
          animalId: rec.animal_id,
          animalName: rec.animal_name || 'Hayvan',
          tag_id: rec.animal_tag_id || '',
          daysRemaining: Math.ceil(timeUntilBirth / (24 * 60 * 60 * 1000))
        });
      }
    });
    
    // Hayvanların durumlarını güncelle
    if (animalsToUpdate.length > 0) {
      console.log(`${animalsToUpdate.length} hayvan kuruya alınacak:`, animalsToUpdate);
      
      for (const animal of animalsToUpdate) {
        // Hayvanın mevcut durumunu kontrol et
        const animalData = await window.lsmAPI.animals.getById(animal.animalId);
        
        // Eğer hayvan hala Gebe statüsündeyse, Kuruda olarak değiştir
        if (animalData && animalData.status === 'Gebe') {
          const updateResult = await window.lsmAPI.animals.update({
            id: animal.animalId,
            status: 'Kuruda'
          });
          
          if (updateResult.success) {
            console.log(`${animal.tag_id} - ${animal.animalName} hayvanı kuruda durumuna güncellendi. Doğuma ${animal.daysRemaining} gün kaldı.`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Kuru dönem kontrolü sırasında hata:', error);
  }
} 