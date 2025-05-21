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

// Yem Rasyon DOM referansları
const refreshRationListBtn = document.getElementById('refreshRationListBtn');
const rationSearchInput = document.getElementById('rationSearchInput');
const rationAnimalTypeFilter = document.getElementById('rationAnimalTypeFilter');
const rationStatusFilter = document.getElementById('rationStatusFilter');
const rationTableBody = document.getElementById('rationTableBody');
const rationCount = document.getElementById('rationCount');
const rationPageSizeSelect = document.getElementById('rationPageSizeSelect');
const rationPagination = document.getElementById('rationPagination');
const exportRationCsvBtn = document.getElementById('exportRationCsvBtn');
const printRationListBtn = document.getElementById('printRationListBtn');



// Rasyon kategori sayaçları
const dairyRationCount = document.getElementById('dairyRationCount');
const dryRationCount = document.getElementById('dryRationCount');
const calfRationCount = document.getElementById('calfRationCount');
const otherRationCount = document.getElementById('otherRationCount');

// Rasyon form alanları
const rationName = document.getElementById('rationName');
const animalGroup = document.getElementById('animalGroup');
const rationStatus = document.getElementById('rationStatus');
const rationDescription = document.getElementById('rationDescription');
const addRationForm = document.getElementById('addRationForm');
const saveRationBtn = document.getElementById('saveRationBtn');

// Rasyon bileşen form alanları
const ingredientName = document.getElementById('ingredientName');
const ingredientAmount = document.getElementById('ingredientAmount');
const ingredientCost = document.getElementById('ingredientCost');
const ingredientProtein = document.getElementById('ingredientProtein');
const ingredientEnergy = document.getElementById('ingredientEnergy');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientsTableBody = document.getElementById('ingredientsTableBody');

// Rasyon toplam değerleri
const totalWeight = document.getElementById('totalWeight');
const totalCost = document.getElementById('totalCost');
const totalProtein = document.getElementById('totalProtein');
const totalEnergy = document.getElementById('totalEnergy');

// Yeni bileşen ekleme formu
const newIngredientName = document.getElementById('newIngredientName');
const newIngredientCost = document.getElementById('newIngredientCost');
const newIngredientProtein = document.getElementById('newIngredientProtein');
const newIngredientEnergy = document.getElementById('newIngredientEnergy');
const newIngredientNotes = document.getElementById('newIngredientNotes');
const saveIngredientBtn = document.getElementById('saveIngredientBtn');

// Canlı toplam gösterge alanları (HTML'de eklendiğini varsayıyoruz)
const liveTotalProteinEl = document.getElementById('liveTotalProtein');
const liveTotalEnergyEl = document.getElementById('liveTotalEnergy');

// Modal nesneleri
let addRationModal;
let addIngredientModal;

// Rasyon verileri
let allRations = [];
let filteredRations = [];
let rationCurrentPage = 1;
let rationPageSize = 25;

// Geçerli rasyon bileşenleri
let currentIngredients = [];
let feedIngredientTypesCache = []; // Yem malzemesi türleri için önbellek

// Ingredient sınıfı (Bileşen)
class Ingredient {
  constructor(name, amount, cost, protein, energy, dryMatter = 100) {
    this.name = name;
    this.amount = parseFloat(amount) || 0;
    this.cost = parseFloat(cost) || 0;
    this.protein = parseFloat(protein) || 0;
    this.energy = parseFloat(energy) || 0;
    this.dryMatter = parseFloat(dryMatter) || 100;  // Kuru madde oranı (%) - varsayılan 100%
  }

  getTotalCost() {
    return this.amount * this.cost;
  }
  
  // Protein miktarı (kg)
  getProteinAmount() {
    return this.amount * (this.protein / 100);
  }
  
  // Enerji miktarı (MJ)
  getTotalEnergy() {
    return this.amount * this.energy;
  }
  
  // Kuru madde miktarı (kg)
  getDryMatterAmount() {
    return this.amount * (this.dryMatter / 100);
  }
}

// Bu global event listener'ı kaldırdık çünkü setupEventListeners fonksiyonunda 
// zaten addIngredientBtn için bir event listener eklenmiş durumda
// ve çift event listener hata mesajlarının iki kez gösterilmesine neden oluyordu

// DOM yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');
  
  // Kritik elementlerin tam olarak yüklenip yüklenmediğini kontrol et
  console.log("addIngredientModal element mevcut mu:", !!document.getElementById('addIngredientModal'));
  console.log("profileDropdown element mevcut mu:", !!document.getElementById('profileDropdown'));
  console.log("profileList element mevcut mu:", !!document.getElementById('profileList'));
  console.log("addProfileBtn element mevcut mu:", !!document.getElementById('addProfileBtn'));
  console.log("deleteProfileBtn element mevcut mu:", !!document.getElementById('deleteProfileBtn'));
  console.log("selectedProfileName element mevcut mu:", !!document.getElementById('selectedProfileName'));
  
  // Bootstrap modalları başlat
  try {
    // Her modal için ayrı try-catch bloğu kullanılacak
    try {
      addProfileModal = new bootstrap.Modal(document.getElementById('addProfileModal'));
      console.log("addProfileModal başarıyla başlatıldı");
    } catch (error) {
      console.error("addProfileModal başlatılamadı:", error);
    }
    
    try {
      deleteProfileModal = new bootstrap.Modal(document.getElementById('deleteProfileModal'));
      console.log("deleteProfileModal başarıyla başlatıldı");
    } catch (error) {
      console.error("deleteProfileModal başlatılamadı:", error);
    }
    
    try {
      addTypeModal = new bootstrap.Modal(document.getElementById('addTypeModal'));
      animalDetailModal = new bootstrap.Modal(document.getElementById('animalDetailModal'));
      deleteAnimalModal = new bootstrap.Modal(document.getElementById('deleteAnimalModal'));
      addRationModal = new bootstrap.Modal(document.getElementById('addRationModal'));
      addIngredientModal = new bootstrap.Modal(document.getElementById('addIngredientModal'));
      console.log("Diğer modallar başarıyla başlatıldı");
    } catch (error) {
      console.error("Bazı modallar başlatılamadı:", error);
    }
  } catch (error) {
    console.error("Modal başlatmada genel hata:", error);
  }
  
  // Event listener'ları ekle
  try {
    console.log("Event listener'lar ekleniyor...");
    setupEventListeners();
    console.log("Event listener'lar başarıyla eklendi");
  } catch (error) {
    console.error("Event listener'lar eklenirken hata:", error);
  }
  
  // Profilleri yükle
  try {
    console.log("Profil yükleme başladı");
    await loadProfiles();
    console.log("Profil yükleme tamamlandı");
  } catch (error) {
    console.error("Profil yükleme hatası:", error);
  }
  
  // Aktif profili ayarla ve profile ID'yi bekle
  try {
    console.log("Aktif profil ayarlama başladı");
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
  } catch (error) {
    console.error("Aktif profil ayarlama hatası:", error);
  }
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
  
  // Sidebar Alt menü linkleri (dropdown içindekiler)
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
      
      // Dropdown menüyü aktif yap
      if (livestockDropdown) {
        livestockDropdown.classList.add('active');
      }
      
      // Görünüm değiştir
      const href = link.getAttribute('href');
      showView(href);
      
      // Hayvan listesi görünümü için hayvanları yükle
      if (href === '#animal-list') {
        loadAnimalTypes(animalTypeFilter);
        loadAnimals();
      }
      // Sağlık kayıtları görünümü için sağlık kayıtlarını yükle
      else if (href === '#health-records') {
        loadHealthAnimals();
        loadHealthRecords();
      }
      // Gebelik durumu görünümü için üreme kayıtlarını yükle
      else if (href === '#pregnancy') {
        loadBreedingRecords();
      }
      // Sağım verileri görünümü için sağım kayıtlarını yükle
      else if (href === '#milk-records') {
        loadMilkAnimals();
        loadMilkRecords();
      }
      // Yem Rasyon görünümü için rasyonları yükle
      else if (href === '#feed-ration') {
        loadRations();
      }
    });
  });
  
  // Rasyon sayfası için event listener'lar
  // Rasyon yenileme butonu
  const refreshRationListBtn = document.getElementById('refreshRationListBtn');
  if (refreshRationListBtn) {
    refreshRationListBtn.addEventListener('click', () => {
      loadRations();
    });
  }
  
  // Rasyon filtre değişikliklerini dinle
  const rationSearchInput = document.getElementById('rationSearchInput');
  const rationAnimalTypeFilter = document.getElementById('rationAnimalTypeFilter');
  const rationStatusFilter = document.getElementById('rationStatusFilter');
  const rationPageSizeSelect = document.getElementById('rationPageSizeSelect');
  
  if (rationSearchInput) {
    rationSearchInput.addEventListener('input', filterRations);
  }
  
  if (rationAnimalTypeFilter) {
    rationAnimalTypeFilter.addEventListener('change', filterRations);
  }
  
  if (rationStatusFilter) {
    rationStatusFilter.addEventListener('change', filterRations);
  }
  
  if (rationPageSizeSelect) {
    rationPageSizeSelect.addEventListener('change', (e) => {
      rationPageSize = parseInt(e.target.value);
      rationCurrentPage = 1;
      filterRations();
    });
  }

  // Rasyon Ekle modalındaki "Yem Malzemesi Ekle" butonu
  const addIngredientBtn = document.getElementById('addIngredientBtn');
  if (addIngredientBtn) {
    addIngredientBtn.addEventListener('click', addIngredientToRation);
  }
  
  // Rasyon Ekle modalındaki "Kaydet" butonu
  const saveRationBtn = document.getElementById('saveRationBtn');
  if (saveRationBtn) {
    saveRationBtn.addEventListener('click', saveRation);
  }
  
  // Yeni Malzeme Ekleme modalındaki "Kaydet" butonu
  const saveIngredientBtn = document.getElementById('saveIngredientBtn');
  if (saveIngredientBtn) {
    saveIngredientBtn.addEventListener('click', saveNewIngredient);
  }
  
  // Malzeme türü seçildiğinde varsayılan değerleri doldur
  const ingredientName = document.getElementById('ingredientName');
  if (ingredientName) {
    ingredientName.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      
      // "Yeni Malzeme..." seçeneği
      if (selectedValue === "Yeni Malzeme...") {
        // Yeni malzeme ekleme modalını aç
        const addIngredientModal = new bootstrap.Modal(document.getElementById('addIngredientModal'));
        addIngredientModal.show();
      } else if (selectedValue) {
        // Seçilen malzeme türünün varsayılan değerlerini doldur
        fillIngredientDefaults(selectedValue);
      }
    });
  }
  
  // Rasyon dışa aktarma butonu
  const exportRationCsvBtn = document.getElementById('exportRationCsvBtn');
  if (exportRationCsvBtn) {
    exportRationCsvBtn.addEventListener('click', exportRationsToCsv);
  }
  
  // Rasyon yazdırma butonu
  const printRationListBtn = document.getElementById('printRationListBtn');
  if (printRationListBtn) {
    printRationListBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  // Rasyon modalı kapatıldığında formu sıfırla
  const addRationModal = document.getElementById('addRationModal');
  if (addRationModal) {
    addRationModal.addEventListener('hidden.bs.modal', resetRationForm);
  }
  
  // Hayvan listesi yenileme butonu
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

  // Rasyon sayfasındaki yenileme butonu
  if (refreshRationListBtn) {
    refreshRationListBtn.addEventListener('click', async () => {
      try {
        // Yenile butonuna dönüş animasyonu ekle
        const icon = refreshRationListBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        
        // Rasyonları yeniden yükle
        await loadRations();
        
        // Animasyonu durdur
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
        }, 500);
      } catch (error) {
        console.error('Rasyon listesi yenilenirken hata:', error);
      }
    });
  }
  
  // Rasyon filtreleme ve arama eventleri
  if (rationSearchInput) rationSearchInput.addEventListener('input', () => { rationCurrentPage = 1; filterRations(); });
  if (rationAnimalTypeFilter) rationAnimalTypeFilter.addEventListener('change', () => { rationCurrentPage = 1; filterRations(); });
  if (rationStatusFilter) rationStatusFilter.addEventListener('change', () => { rationCurrentPage = 1; filterRations(); });
  if (rationPageSizeSelect) rationPageSizeSelect.addEventListener('change', () => { rationPageSize = parseInt(rationPageSizeSelect.value); rationCurrentPage = 1; filterRations(); });
  
  // Rasyon yazdırma ve CSV butonları
  if (printRationListBtn) {
    printRationListBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  if (exportRationCsvBtn) {
    exportRationCsvBtn.addEventListener('click', () => {
      exportRationsToCsv();
    });
  }
  
  // Yem malzemesi ekleme butonu
  // Not: Bu listener başka bir yerde zaten tanımlandı
  
  // Yem malzemesi seçimi değiştiğinde
  if (ingredientName) {
    // Önce önceki event listener'ları kaldıralım (multiple listener sorunu)
    const newIngredientName = ingredientName.cloneNode(true);
    ingredientName.parentNode.replaceChild(newIngredientName, ingredientName);
    
    // Yeni elemana event listener ekleyelim
    newIngredientName.addEventListener('change', (e) => {
      console.log("Malzeme seçimi değişti:", newIngredientName.value);
      if (newIngredientName.value === "Yeni Malzeme...") {
        // "Yeni Malzeme" seçildiğinde modalı göster
        console.log("Yeni malzeme modalı açılıyor...");
        addIngredientModal.show();
        // Select'i sıfırla
        setTimeout(() => {
          newIngredientName.selectedIndex = 0;
        }, 100);
      } else if (newIngredientName.value) {
        // Seçilen malzemenin varsayılan değerlerini doldur
        console.log("Varsayılan değerler dolduruluyor...");
        fillIngredientDefaults(newIngredientName.value);
      }
    });
    
    // Global değişkeni güncelle
    ingredientName = newIngredientName;
  }
  
  // Yeni malzeme kaydetme butonu
  if (saveIngredientBtn) {
    console.log("saveIngredientBtn event listener ekleniyor");
    // Önce önceki event listener'ları temizleyelim
    const newSaveIngredientBtn = saveIngredientBtn.cloneNode(true);
    saveIngredientBtn.parentNode.replaceChild(newSaveIngredientBtn, saveIngredientBtn);
    
    // Yeni event listener ekleyelim
    newSaveIngredientBtn.addEventListener('click', function(e) {
      console.log("Malzeme kaydet butonuna tıklandı");
      e.preventDefault();
      saveNewIngredient();
    });
    
    // Global değişkeni güncelle
    saveIngredientBtn = newSaveIngredientBtn;
  } else {
    console.error("saveIngredientBtn bulunamadı!");
  }
  
  // Rasyon kaydetme butonu
  if (saveRationBtn) {
    saveRationBtn.addEventListener('click', async () => {
      saveRation();
    });
  }
  
  // Rasyon modalı açıldığında sadece formu sıfırla
  document.getElementById('addRationModal')?.addEventListener('show.bs.modal', async () => {
    console.log("Rasyon modalı açılıyor, form sıfırlanıyor...");
    resetRationForm(); // Bu resetIngredientForm'u da çağırır, canlı alanlar sıfırlanır
    await loadFeedIngredientTypes(); // Yem malzemesi türlerini yükle
    
    // Artık butona listener eklemiyoruz, global listener kullanıyoruz
    const addIngBtn = document.getElementById('addIngredientBtn');
    if (addIngBtn) {
      console.log("+ butonu bulundu");
    } else {
      console.error("+ butonu bulunamadı!");
    }
  });
  
  // Canlı yem bileşeni toplamlarını hesaplamak için inputlara event listener ekle
  const ingAmountEl = document.getElementById('ingredientAmount');
  const ingProteinEl = document.getElementById('ingredientProtein');
  const ingEnergyEl = document.getElementById('ingredientEnergy');

  if (ingAmountEl) ingAmountEl.addEventListener('input', updateLiveIngredientTotals);
  if (ingProteinEl) ingProteinEl.addEventListener('input', updateLiveIngredientTotals);
  if (ingEnergyEl) ingEnergyEl.addEventListener('input', updateLiveIngredientTotals);

  // Sidebar menüden yem rasyon sekmesine tıklanınca verileri yükle
  document.querySelectorAll('.sub-menu .nav-link[href="#feed-ration"]').forEach(link => {
    link.addEventListener('click', () => {
      loadRations();
    });
  });
}

// Rasyonları yükle
async function loadRations() {
  try {
    if (!activeProfileId) {
      console.warn('loadRations: No active profile');
      return;
    }
    
    // Yükleniyor göstergesi ekle
    const rationListContainer = document.getElementById('rationListContainer');
    if (rationListContainer) {
      rationListContainer.innerHTML = '<div class="text-center my-5"><div class="spinner-border" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p class="mt-2">Rasyonlar yükleniyor...</p></div>';
    }
    
    // Rasyonları getir
    allRations = await window.lsmAPI.rations.getAll(activeProfileId);
    console.log(`Loaded ${allRations.length} rations for profile ${activeProfileId}`);
    
    // Rasyonları filtrele ve göster
    filterRations();
    
    // Kategori sayaçlarını güncelle
    updateRationCategoryCounts();
  } catch (error) {
    console.error('Error loading rations:', error);
    
    const rationListContainer = document.getElementById('rationListContainer');
    if (rationListContainer) {
      rationListContainer.innerHTML = '<div class="alert alert-danger">Rasyonlar yüklenirken bir hata oluştu.</div>';
    }
  }
}

// Rasyonları filtrele
function filterRations() {
  if (!rationTableBody) return;
  
  // Arama ve filtreleme
  const searchTerm = rationSearchInput ? rationSearchInput.value.toLowerCase() : '';
  const animalGroupFilter = rationAnimalTypeFilter ? rationAnimalTypeFilter.value : '';
  const statusFilter = rationStatusFilter ? rationStatusFilter.value : '';
  
  // Rasyonları filtrele
  filteredRations = allRations.filter(ration => {
    const matchesSearch =
      !searchTerm ||
      (ration.name && ration.name.toLowerCase().includes(searchTerm)) ||
      (ration.animal_group && ration.animal_group.toLowerCase().includes(searchTerm)) ||
      (ration.description && ration.description.toLowerCase().includes(searchTerm));
    
    const matchesAnimalGroup = !animalGroupFilter || ration.animal_group === animalGroupFilter;
    const matchesStatus = !statusFilter || ration.status === statusFilter;
    
    return matchesSearch && matchesAnimalGroup && matchesStatus;
  });
  
  // Sayfalama
  const totalItems = filteredRations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rationPageSize));
  
  if (rationCurrentPage > totalPages) rationCurrentPage = totalPages;
  const startIndex = rationPageSize > 0 ? (rationCurrentPage - 1) * rationPageSize : 0;
  const endIndex = rationPageSize > 0 ? Math.min(startIndex + rationPageSize, totalItems) : totalItems;
  const paginated = rationPageSize > 0 ? filteredRations.slice(startIndex, endIndex) : filteredRations;
  
  // Toplam sayı göstergesini güncelle
  if (rationCount) {
    rationCount.textContent = totalItems;
  }
  
  // Tabloyu oluştur
  renderRationTable(paginated);
  
  // Sayfalama göster
  renderRationPagination(totalPages);
}

// Rasyon tablosunu oluştur
function renderRationTable(rations) {
  if (!rationTableBody) return;
  
  // Her durumda önce tabloyu temizle
  rationTableBody.innerHTML = '';
  
  if (rations.length === 0) {
    rationTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Kayıt bulunamadı</td></tr>`;
    return;
  }
  
  let html = '';
  rations.forEach(ration => {
    const date = ration.created_at ? formatDate(ration.created_at) : '-';
    
    // Durum için sınıf belirle
    let statusClass = ration.status === 'Aktif' ? 'badge bg-success' : 'badge bg-secondary';
    
    html += `<tr>
      <td>${ration.name || '-'}</td>
      <td>${ration.animal_group || '-'}</td>
      <td>${date}</td>
      <td>${ration.total_cost ? ration.total_cost.toFixed(2) + ' ₺' : '-'}</td>
      <td>${ration.total_weight ? ration.total_weight + ' kg' : '-'}</td>
      <td><span class="${statusClass}">${ration.status || '-'}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-info btn-sm view-ration" data-id="${ration.id}" title="Detay"><i class="fas fa-eye"></i></button>
          <button class="btn btn-outline-primary btn-sm edit-ration" data-id="${ration.id}" title="Düzenle"><i class="fas fa-edit"></i></button>
          <button class="btn btn-outline-danger btn-sm delete-ration" data-id="${ration.id}" title="Sil"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  });
  
  rationTableBody.innerHTML = html;
  
  // Butonlara event listener'ları ekle
  document.querySelectorAll('.view-ration').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      viewRationDetails(id);
    });
  });
  
  document.querySelectorAll('.edit-ration').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      editRation(id);
    });
  });
  
  document.querySelectorAll('.delete-ration').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      deleteRation(id);
    });
  });
}

// Sayfalama oluştur
function renderRationPagination(totalPages) {
  if (!rationPagination) return;
  
  if (totalPages <= 1) { 
    rationPagination.innerHTML = ''; 
    return; 
  }
  
  let html = '';
  html += `<li class="page-item ${rationCurrentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${rationCurrentPage - 1}">&laquo;</a></li>`;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === rationCurrentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  
  html += `<li class="page-item ${rationCurrentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${rationCurrentPage + 1}">&raquo;</a></li>`;
  
  rationPagination.innerHTML = html;
  
  document.querySelectorAll('#rationPagination .page-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (page >= 1 && page <= totalPages) {
        rationCurrentPage = page;
        filterRations();
      }
    });
  });
}

// Rasyon kategori sayaçlarını güncelle
function updateRationCategoryCounts() {
  // Kart öğeleri kaldırıldı, bu fonksiyon artık bir şey yapmıyor
}

// Rasyonları CSV'e aktar
function exportRationsToCsv() {
  if (filteredRations.length === 0) {
    alert('Dışa aktarılacak rasyon bulunamadı!');
    return;
  }
  
  // CSV başlıkları
  const headers = [
    'Rasyon Adı',
    'Hayvan Grubu',
    'Oluşturma Tarihi',
    'Toplam Maliyet (₺)',
    'Toplam Ağırlık (kg)',
    'Durum',
    'Açıklama'
  ];
  
  // CSV verisi
  let csvContent = headers.join(',') + '\n';
  
  filteredRations.forEach(ration => {
    const row = [
      escapeCsvValue(ration.name || ''),
      escapeCsvValue(ration.animal_group || ''),
      ration.created_at ? formatDate(ration.created_at) : '',
      ration.total_cost || '0',
      ration.total_weight || '0',
      escapeCsvValue(ration.status || ''),
      escapeCsvValue(ration.description || '')
    ];
    
    csvContent += row.join(',') + '\n';
  });
  
  // CSV dosyasını indir
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Dosya adı oluştur
  const date = new Date();
  const fileName = `rasyon_listesi_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.csv`;
  
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

// Rasyon detaylarını görüntüle
function viewRationDetails(id) {
  alert(`Rasyon detayları henüz eklenmedi! Rasyon ID: ${id}`);
  // TODO: Detay görüntüleme
}

// Rasyon düzenle
function editRation(id) {
  alert(`Rasyon düzenleme henüz eklenmedi! Rasyon ID: ${id}`);
  // TODO: Düzenleme
}

// Rasyon sil
async function deleteRation(id) {
  if (!confirm('Bu rasyonu silmek istediğinizden emin misiniz?')) {
    return;
  }
  
  try {
    // API çağrısı eklenmeli
    // const result = await window.lsmAPI.rations.delete(id);
    
    // Şimdilik yerel array'den sil
    allRations = allRations.filter(r => r.id !== id);
    
    // Listeyi güncelle
    filterRations();
    updateRationCategoryCounts();
    
    alert('Rasyon başarıyla silindi!');
  } catch (error) {
    console.error(`Rasyon silinirken hata (ID: ${id}):`, error);
    alert('Rasyon silinirken bir hata oluştu!');
  }
}

// Yeni bileşen ekle
function addIngredientToRation() {
  console.log("addIngredientToRation fonksiyonu çalıştı");
  
  // Her çağrıda DOM elementlerini yeniden seç
  const ingredientNameEl = document.getElementById('ingredientName');
  const ingredientAmountEl = document.getElementById('ingredientAmount');
  const ingredientDryMatterEl = document.getElementById('ingredientDryMatter');
  const ingredientCostEl = document.getElementById('ingredientCost');
  const ingredientProteinEl = document.getElementById('ingredientProtein');
  const ingredientEnergyEl = document.getElementById('ingredientEnergy');
  
  if (!ingredientNameEl) {
    console.error("ingredientName elementi bulunamadı!");
    return;
  }
  
  console.log("Seçilen malzeme değeri:", ingredientNameEl.value);
  console.log("Seçilen index:", ingredientNameEl.selectedIndex);
  
  // Seçilen option'ın ne olduğunu kontrol et
  const selectedOption = ingredientNameEl.options[ingredientNameEl.selectedIndex];
  console.log("Seçilen option:", selectedOption ? selectedOption.text : "Yok");
  
  // Eğer seçim yok veya varsayılan "Malzeme seçin" seçeneği seçiliyse
  if (!selectedOption || selectedOption.disabled) {
    console.log("UYARI: Geçerli bir malzeme seçilmedi! (Seçim yok veya disabled)");
    alert('Lütfen bir yem malzemesi seçin!');
    return;
  }
  
  // Eğer "Yeni Malzeme Ekle..." seçeneği seçiliyse, yeni malzeme ekleme modalını göster
  if (ingredientNameEl.value === "Yeni Malzeme...") {
    console.log("Yeni malzeme ekle seçeneği seçildi, modal açılacak");
    const addIngredientModalInstance = bootstrap.Modal.getInstance(document.getElementById('addIngredientModal'));
    if (addIngredientModalInstance) {
      addIngredientModalInstance.show();
    } else {
      const addIngredientModal = new bootstrap.Modal(document.getElementById('addIngredientModal'));
      if (addIngredientModal) {
        addIngredientModal.show();
      }
    }
    return;
  }
  
  console.log("Malzeme kabul edildi, ekleniyor...");
  
  
  if (!ingredientAmountEl.value || parseFloat(ingredientAmountEl.value) <= 0) {
    alert('Lütfen geçerli bir miktar girin!');
    return;
  }
  
  if (!ingredientCostEl.value || parseFloat(ingredientCostEl.value) < 0) {
    alert('Lütfen geçerli bir birim maliyet girin!');
    return;
  }
  
  console.log("Yem malzemesi ekleniyor:", ingredientNameEl.value, ingredientAmountEl.value, ingredientDryMatterEl.value, ingredientCostEl.value);
  
  const newIngredient = new Ingredient(
    ingredientNameEl.value,
    parseFloat(ingredientAmountEl.value),
    parseFloat(ingredientCostEl.value),
    parseFloat(ingredientProteinEl.value || 0),
    parseFloat(ingredientEnergyEl.value || 0),
    parseFloat(ingredientDryMatterEl.value || 100) // Kuru madde oranı değerini ekle
  );
  
  // Bileşeni listeye ekle
  currentIngredients.push(newIngredient);
  
  // Tabloyu ve toplamları güncelle
  console.log("Malzeme listeye eklendi, tablo güncelleniyor...", currentIngredients.length);
  updateIngredientsTable();
  calculateTotals();
  console.log("Toplam malzeme sayısı:", currentIngredients.length);
  
  // Form alanlarını temizle
  ingredientNameEl.selectedIndex = 0;
  ingredientAmountEl.value = '';
  ingredientDryMatterEl.value = '100';  // Varsayılan değer 100%
  ingredientCostEl.value = '';
  ingredientProteinEl.value = '';
  ingredientEnergyEl.value = '';
}

// Bileşenler tablosunu güncelle
function updateIngredientsTable() {
  // Her seferinde elementi yeniden seçelim
  const ingredientsTableBodyElement = document.getElementById('ingredientsTableBody');
  console.log("updateIngredientsTable çağrıldı, ingredientsTableBody mevcut mu:", !!ingredientsTableBodyElement);
  
  if (!ingredientsTableBodyElement) {
    console.error("ingredientsTableBody elementi bulunamadı!");
    return;
  }
  
  console.log("Güncellenecek bileşen sayısı:", currentIngredients.length);
  if (currentIngredients.length === 0) {
    ingredientsTableBodyElement.innerHTML = `<tr><td colspan="11" class="text-center">Henüz yem bileşeni eklenmedi.</td></tr>`;
    return;
  }
  
  let html = '';
  currentIngredients.forEach((ingredient, index) => {
    const totalCost = ingredient.getTotalCost().toFixed(2);
    const totalProteinGrams = (ingredient.getProteinAmount() * 1000).toFixed(1); // kg'dan grama çevir
    const totalEnergyMJ = ingredient.getTotalEnergy().toFixed(1);
    const dryMatterKg = ingredient.getDryMatterAmount().toFixed(1); // Kuru madde kg cinsinden
    
    html += `<tr>
      <td>${ingredient.name}</td>
      <td>${ingredient.amount.toFixed(1)} kg</td>
      <td>${ingredient.dryMatter.toFixed(1)} %</td>
      <td>${dryMatterKg} kg</td>
      <td>${ingredient.cost.toFixed(2)} ₺</td>
      <td>${totalCost} ₺</td>
      <td>${ingredient.protein.toFixed(1)} %</td>
      <td>${totalProteinGrams} g</td>
      <td>${ingredient.energy.toFixed(1)} MJ/kg</td>
      <td>${totalEnergyMJ} MJ</td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger remove-ingredient" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>`;
  });
  
  ingredientsTableBodyElement.innerHTML = html;
  
  // Silme butonlarına event listener'lar ekle
  console.log("Silme butonlarına event listener'lar ekleniyor...");
  document.querySelectorAll('.remove-ingredient').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log("Silme butonuna tıklandı, index:", btn.dataset.index);
      const index = parseInt(btn.dataset.index);
      removeIngredient(index);
    });
  });
}

// Bileşeni sil
function removeIngredient(index) {
  if (index >= 0 && index < currentIngredients.length) {
    currentIngredients.splice(index, 1);
    updateIngredientsTable();
    calculateTotals();
  }
}

// Toplam değerleri hesapla
function calculateTotals() {
  // Her çağrıda elementleri yeniden seç
  const totalWeight = document.getElementById('totalWeight');
  const totalDryMatter = document.getElementById('totalDryMatter');
  const totalCost = document.getElementById('totalCost');
  const totalProteinAmount = document.getElementById('totalProteinAmount');
  const totalEnergyAmount = document.getElementById('totalEnergyAmount');
  
  if (!totalWeight || !totalDryMatter || !totalCost || !totalProteinAmount || !totalEnergyAmount) {
    console.error("Toplam değer gösterge elementleri bulunamadı!");
    return;
  }
  
  console.log("Toplam değerler hesaplanıyor, malzeme sayısı:", currentIngredients.length);
  
  if (currentIngredients.length === 0) {
    totalWeight.textContent = '0 kg';
    totalDryMatter.textContent = '0 kg';
    totalCost.textContent = '0 ₺';
    totalProteinAmount.textContent = '0 g';
    totalEnergyAmount.textContent = '0 MJ';
    return;
  }
  
  // Toplam ağırlık
  const weightSum = currentIngredients.reduce((sum, ing) => sum + ing.amount, 0);
  
  // Toplam kuru madde
  const dryMatterSum = currentIngredients.reduce((sum, ing) => sum + ing.getDryMatterAmount(), 0);
  
  // Toplam maliyet
  const costSum = currentIngredients.reduce((sum, ing) => sum + ing.getTotalCost(), 0);
  
  // Toplam protein miktarı (kg) ve gram cinsinden
  const proteinAmountKg = currentIngredients.reduce((sum, ing) => sum + ing.getProteinAmount(), 0);
  const proteinAmountGram = proteinAmountKg * 1000; // kg'dan gram'a çevir
  
  // Toplam enerji değeri (MJ)
  const totalEnergyValue = currentIngredients.reduce((sum, ing) => sum + ing.getTotalEnergy(), 0);
  
  // Değerleri göster
  totalWeight.textContent = `${weightSum.toFixed(1)} kg`;
  totalDryMatter.textContent = `${dryMatterSum.toFixed(1)} kg`;
  totalCost.textContent = `${costSum.toFixed(2)} ₺`;
  totalProteinAmount.textContent = `${proteinAmountGram.toFixed(1)} g`;
  totalEnergyAmount.textContent = `${totalEnergyValue.toFixed(1)} MJ`;
  
  console.log("Toplam değerler güncellendi:", 
    weightSum.toFixed(1) + " kg",
    dryMatterSum.toFixed(1) + " kg KM",
    costSum.toFixed(2) + " ₺", 
    proteinAmountGram.toFixed(1) + " g", 
    totalEnergyValue.toFixed(1) + " MJ");
}

// Yeni malzeme kaydet
async function saveNewIngredient() {
  console.log("saveNewIngredient fonksiyonu çağrıldı");
  
  const newIngredientNameEl = document.getElementById('newIngredientName');
  const newIngredientCostEl = document.getElementById('newIngredientCost'); 
  const newIngredientProteinEl = document.getElementById('newIngredientProtein');
  const newIngredientEnergyEl = document.getElementById('newIngredientEnergy');
  const newIngredientDryMatterEl = document.getElementById('newIngredientDryMatter');
  const newIngredientNotesEl = document.getElementById('newIngredientNotes');
  
  if (!newIngredientNameEl || !newIngredientNameEl.value || newIngredientNameEl.value.trim() === "") {
    alert('Lütfen malzeme adı girin!');
    return;
  }
  if (!activeProfileId) {
    alert('Aktif profil bulunamadı! Malzeme türü kaydedilemiyor.');
    return;
  }

  const ingredientTypeData = {
    profile_id: activeProfileId,
    name: newIngredientNameEl.value.trim(),
    default_cost: parseFloat(newIngredientCostEl.value || 0),
    default_protein: parseFloat(newIngredientProteinEl.value || 0),
    default_energy: parseFloat(newIngredientEnergyEl.value || 0),
    default_dry_matter: parseFloat(newIngredientDryMatterEl.value || 100),
    notes: newIngredientNotesEl.value.trim() || ''
  };

  try {
    const result = await window.lsmAPI.feedIngredientTypes.create(ingredientTypeData);
    if (result.success) {
      alert('Yeni yem malzemesi türü başarıyla kaydedildi!');
      
      // Formu temizle
      newIngredientNameEl.value = '';
      if (newIngredientCostEl) newIngredientCostEl.value = '';
      if (newIngredientProteinEl) newIngredientProteinEl.value = '';
      if (newIngredientEnergyEl) newIngredientEnergyEl.value = '';
      if (newIngredientDryMatterEl) newIngredientDryMatterEl.value = '100';
      if (newIngredientNotesEl) newIngredientNotesEl.value = '';
      
      // Modalı kapat
      const modal = bootstrap.Modal.getInstance(document.getElementById('addIngredientModal'));
      if (modal) {
        modal.hide();
      }

      // Malzeme listesini güncelle ve yeni ekleneni seç
      await loadFeedIngredientTypes(); // Bu fonksiyonu oluşturacağız
      const selectElement = document.getElementById('ingredientName');
      if (selectElement) {
        selectElement.value = ingredientTypeData.name; // Yeni eklenen adı seç
        fillIngredientDefaults(ingredientTypeData.name); // Değerlerini doldur
      }

    } else {
      alert('Yem malzemesi türü kaydedilirken hata: ' + (result.error || 'Bilinmeyen hata'));
    }
  } catch (error) {
    console.error('Yem malzemesi türü kaydedilirken hata:', error);
    alert('Yem malzemesi türü kaydedilirken bir istisna oluştu: ' + (error.userMessage || error.message || 'Bilinmeyen hata'));
  }
}

// Bileşen formunu sıfırla
function resetIngredientForm() {
  ingredientName.selectedIndex = 0;
  ingredientAmount.value = '';
  ingredientDryMatter.value = '100';  // Kuru madde varsayılan değer
  ingredientCost.value = '';
  ingredientProtein.value = '';
  ingredientEnergy.value = '';
  // Canlı toplamları da sıfırla
  if (liveTotalProteinEl) liveTotalProteinEl.value = '';
  if (liveTotalEnergyEl) liveTotalEnergyEl.value = '';
}

// Rasyon formunu sıfırla
function resetRationForm() {
  const formElement = document.getElementById('addRationForm');
  if (formElement) {
    formElement.reset();
  } else {
    console.error("addRationForm elementi bulunamadı!");
  }
  currentIngredients = [];
  updateIngredientsTable();
  calculateTotals();
}

// Seçilen malzemenin varsayılan değerlerini doldur
function fillIngredientDefaults(ingredientNameValue) {
  const costEl = document.getElementById('ingredientCost');
  const proteinEl = document.getElementById('ingredientProtein');
  const energyEl = document.getElementById('ingredientEnergy');
  const dryMatterEl = document.getElementById('ingredientDryMatter');

  if (!costEl || !proteinEl || !energyEl || !dryMatterEl) {
    console.error("Form alanları bulunamadı!");
    return;
  }

  // Önce cache'den (veritabanından gelen) değerleri ara
  const cachedType = feedIngredientTypesCache.find(type => type.name === ingredientNameValue);

  if (cachedType) {
    costEl.value = cachedType.default_cost || 0;
    proteinEl.value = cachedType.default_protein || 0;
    energyEl.value = cachedType.default_energy || 0;
    dryMatterEl.value = cachedType.default_dry_matter || 100;
    return;
  }

  // Cache'de yoksa, hardcoded değerlere bak (fallback)
  const hardcodedValues = {
    'Kuru Ot': { cost: 2.5, protein: 12.5, energy: 8.0, dryMatter: 90.0 },
    'Silaj': { cost: 1.2, protein: 8.0, energy: 10.5, dryMatter: 35.0 },
    'Arpa': { cost: 5.5, protein: 11.5, energy: 13.0, dryMatter: 88.0 },
    'Yonca': { cost: 3.0, protein: 18.0, energy: 9.5, dryMatter: 88.0 },
    'Mısır': { cost: 7.0, protein: 9.0, energy: 14.0, dryMatter: 88.0 },
    'Soya Küspesi': { cost: 12.0, protein: 48.0, energy: 13.5, dryMatter: 89.0 },
    'Pamuk Tohumu': { cost: 8.0, protein: 21.0, energy: 20.0, dryMatter: 92.0 },
    'Vitamin Premiks': { cost: 30.0, protein: 0.0, energy: 0.0, dryMatter: 98.0 },
    'Mineral Premiks': { cost: 25.0, protein: 0.0, energy: 0.0, dryMatter: 98.0 }
    // Diğer hardcoded malzemeler buraya eklenebilir
  };
  
  const values = hardcodedValues[ingredientNameValue] || { cost: 0, protein: 0, energy: 0, dryMatter: 100 };
  
  costEl.value = values.cost;
  proteinEl.value = values.protein;
  energyEl.value = values.energy;
  dryMatterEl.value = values.dryMatter;

  updateLiveIngredientTotals(); // Varsayılanlar dolunca canlı toplamları güncelle
}

// Rasyonu kaydet
async function saveRation() {
  try {
    // DOM elementlerini her seferinde seçelim
    const rationName = document.getElementById('rationName');
    const animalGroup = document.getElementById('animalGroup');
    const rationStatus = document.getElementById('rationStatus');
    const rationDescription = document.getElementById('rationDescription');
    const totalWeight = document.getElementById('totalWeight');
    const totalDryMatter = document.getElementById('totalDryMatter');
    const totalCost = document.getElementById('totalCost');
    
    if (!rationName || !rationName.value) {
      alert('Lütfen rasyon adı girin!');
      return;
    }
    
    if (!animalGroup || !animalGroup.value) {
      alert('Lütfen hayvan grubunu seçin!');
      return;
    }
    
    if (currentIngredients.length === 0) {
      alert('En az bir yem malzemesi eklemelisiniz!');
      return;
    }
    
    // Toplam değerleri - texContent'ten sayısal değer çıkarıyoruz
    const totalWeightValue = parseFloat(totalWeight.textContent.replace(/[^\d.-]/g, ''));
    const totalDryMatterValue = parseFloat(totalDryMatter.textContent.replace(/[^\d.-]/g, ''));
    const totalCostValue = parseFloat(totalCost.textContent.replace(/[^\d.-]/g, ''));
    
    // Bileşenleri uygun formata dönüştür
    const ingredients = currentIngredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      dry_matter: ing.dryMatter,
      cost: ing.cost,
      protein: ing.protein,
      energy: ing.energy
    }));
    
    // Rasyon verilerini hazırla
    const rationData = {
      profile_id: activeProfileId,
      name: rationName.value,
      animal_group: animalGroup.value,
      status: rationStatus.value,
      description: rationDescription.value || '',
      total_weight: totalWeightValue,
      total_dry_matter: totalDryMatterValue,
      total_cost: totalCostValue,
      ingredients
    };
    
    console.log('Kaydedilecek rasyon verileri:', rationData);
    
    // Veritabanına kaydet
    const result = await window.lsmAPI.rations.create(rationData);
    
    if (!result.success) {
      throw new Error(result.error || 'Rasyon kaydedilirken bir hata oluştu');
    }
    
    // Form verilerini ve yem bileşenlerini sıfırla (modalı kapatmadan önce)
    resetRationForm();
    
    // Modalı kapat
    const addRationModalInstance = bootstrap.Modal.getInstance(document.getElementById('addRationModal'));
    if (addRationModalInstance) {
      addRationModalInstance.hide();
    }
    
    // Rasyonları yeniden yükle
    await loadRations();
    
    alert('Rasyon başarıyla kaydedildi!');
  } catch (error) {
    console.error('Rasyon kaydedilirken hata:', error);
    alert(error.message || 'Rasyon kaydedilirken bir hata oluştu!');
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
    console.log("loadProfiles fonksiyonu başladı");
    
    // DOM elementlerini kontrol et
    const profileListElement = document.getElementById('profileList');
    const selectedProfileNameElement = document.getElementById('selectedProfileName');
    const deleteProfileBtnElement = document.getElementById('deleteProfileBtn');
    
    if (!profileListElement) {
      console.error("'profileList' elementi bulunamadı!");
      return;
    }
    
    if (!selectedProfileNameElement) {
      console.error("'selectedProfileName' elementi bulunamadı!");
      return;
    }
    
    if (!deleteProfileBtnElement) {
      console.error("'deleteProfileBtn' elementi bulunamadı!");
      return;
    }
    
    // Profilleri API'den al
    const profiles = await window.lsmAPI.profiles.getAll();
    console.log("Alınan profil sayısı:", profiles ? profiles.length : 0);
    
    // Profil listesini temizle
    profileListElement.innerHTML = '';
    
    if (!profiles || profiles.length === 0) {
      console.log("Profil bulunamadı");
      const li = document.createElement('li');
      li.classList.add('dropdown-item', 'text-muted');
      li.textContent = 'Profil bulunamadı';
      profileListElement.appendChild(li);
      
      // Aktif profil ID'sini sıfırla
      activeProfileId = null;
      selectedProfileNameElement.textContent = 'Profil Seçin';
      
      // Profil silme butonunu devre dışı bırak
      deleteProfileBtnElement.disabled = true;
    } else {
      console.log("Profiller bulundu, listeye ekleniyor");
      // Profil silme butonunu etkinleştir
      deleteProfileBtnElement.disabled = false;
      
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
        profileListElement.appendChild(li);
      });
      
      // Aktif profil yoksa ilk profili aktif olarak ayarla
      if (!activeProfileId && profiles.length > 0) {
        activeProfileId = profiles[0].id;
        selectedProfileNameElement.textContent = profiles[0].name;
      }
    }
    
    console.log("loadProfiles fonksiyonu tamamlandı");
  } catch (error) {
    console.error('Profiller yüklenirken hata:', error);
    alert('Profiller yüklenirken bir hata oluştu!');
  }
}

// İlk aktif profili ayarla
async function setInitialActiveProfile() {
  try {
    console.log("setInitialActiveProfile fonksiyonu başladı");
    
    // DOM elementlerini kontrol et
    const selectedProfileNameElement = document.getElementById('selectedProfileName');
    
    if (!selectedProfileNameElement) {
      console.error("'selectedProfileName' elementi bulunamadı!");
      return null;
    }
    
    // Önce localStorage'da kaydedilmiş profil ID'sini kontrol et
    let activeId;
    try {
      activeId = localStorage.getItem('lastActiveProfileId');
      console.log("localStorage'dan alınan profil ID:", activeId);
    } catch (storageError) {
      console.warn("localStorage'dan profil ID alınamadı:", storageError);
    }
    
    // Eğer localStorage'da yoksa, ana süreçten almayı dene
    if (!activeId) {
      console.log("Ana süreçten aktif profil ID'si alınıyor...");
      activeId = await window.lsmAPI.profiles.getActive();
      console.log("API'den alınan aktif profil ID:", activeId);
    }
    
    if (activeId) {
      // Profil bilgilerini al
      console.log("Profil bilgileri alınıyor. ID:", activeId);
      const profile = await window.lsmAPI.profiles.getProfile(activeId);
      console.log("Profil bilgileri:", profile);
      
      if (profile) {
        activeProfileId = profile.id;
        selectedProfileNameElement.textContent = profile.name;
        
        // API'ye doğru kaydedildiğinden emin olmak için
        await window.lsmAPI.profiles.setActive(profile.id);
        
        console.log('setInitialActiveProfile: Active profile set to:', activeProfileId);
        return profile.id; // Profile ID'yi döndür
      } else {
        console.log("Profil bilgileri alınamadı veya geçersiz");
      }
    } else {
      console.log("Aktif profil ID'si bulunamadı");
    }
    
    console.log("setInitialActiveProfile fonksiyonu null döndürecek");
    return null;
  } catch (error) {
    console.error('Aktif profil ayarlanırken hata:', error);
    return null;
  }
}

// Aktif profili ayarla
async function setActiveProfile(id) {
  try {
    console.log("setActiveProfile fonksiyonu başladı. ID:", id);
    
    // DOM elementlerini kontrol et
    const selectedProfileNameElement = document.getElementById('selectedProfileName');
    
    if (!selectedProfileNameElement) {
      console.error("'selectedProfileName' elementi bulunamadı!");
      return;
    }
    
    // Profil bilgilerini al
    console.log("Profil bilgileri alınıyor. ID:", id);
    const profile = await window.lsmAPI.profiles.getProfile(id);
    console.log("Profil bilgileri:", profile);
    
    if (profile) {
      // Ana sürece bildir
      console.log("Ana sürece aktif profil bildiriliyor. ID:", id);
      try {
        const result = await window.lsmAPI.profiles.setActive(id);
        console.log("Aktif profil kaydı sonucu:", result);
        
        // Kayıt sonucunu kontrol et
        if (!result || !result.success) {
          console.warn("Aktif profil kaydı başarısız olabilir:", result);
        }
      } catch (error) {
        console.error("Ana sürece aktif profil bildirme hatası:", error);
      }
      
      // Yerel değişkeni güncelle
      activeProfileId = profile.id;
      
      // Profil adını güncelle
      selectedProfileNameElement.textContent = profile.name;
      
      console.log("Aktif profil başarıyla güncellendi. ID:", profile.id, "Ad:", profile.name);

      // Aktif profil değişimini hemen kaydetmek için doğrudan localStorage'a da yazalım
      try {
        localStorage.setItem('lastActiveProfileId', profile.id);
        console.log("Aktif profil localStorage'a kaydedildi:", profile.id);
      } catch (storageError) {
        console.warn("localStorage'a profil kaydedilemedi:", storageError);
      }
    } else {
      console.error("Profil bilgileri alınamadı veya geçersiz");
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

// Yem malzemesi türlerini yükle ve dropdown'u doldur
async function loadFeedIngredientTypes() {
  const selectElement = document.getElementById('ingredientName');
  if (!selectElement) {
    console.error("ingredientName select elementi bulunamadı!");
    return;
  }

  if (!activeProfileId) {
    console.warn("Aktif profil ID bulunamadığı için yem malzemesi türleri yüklenemiyor.");
    selectElement.innerHTML = '<option value="" selected disabled>Profil seçilmedi</option>';
    feedIngredientTypesCache = [];
    return;
  }

  try {
    const types = await window.lsmAPI.feedIngredientTypes.getAllByProfile(activeProfileId);
    
    feedIngredientTypesCache = Array.isArray(types) ? types : []; // API'den dönen `data` değil, doğrudan array olmalı
    if (types && types.success === false) { // Hata durumu kontrolü
        console.error("Yem malzemesi türleri API'den alınırken hata:", types.error);
        feedIngredientTypesCache = [];
    }

    selectElement.innerHTML = ''; // Önce temizle

    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Malzeme seçin";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    const addNewOption = document.createElement('option');
    addNewOption.value = "Yeni Malzeme...";
    addNewOption.textContent = "+ Yeni Malzeme Ekle...";
    selectElement.appendChild(addNewOption);

    // Önceden tanımlı (hardcoded) malzemeler - artık cache'den gelenler öncelikli olacak
    const hardcodedIngredients = [
      { name: 'Kuru Ot', default_cost: 2.5, default_protein: 12.5, default_energy: 8.0 },
      { name: 'Silaj', default_cost: 1.2, default_protein: 8.0, default_energy: 10.5 },
      { name: 'Arpa', default_cost: 5.5, default_protein: 11.5, default_energy: 13.0 },
      // Diğer hardcoded malzemeler buraya eklenebilir
    ];

    // Önce cache'deki (veritabanından gelen) türleri ekle
    feedIngredientTypesCache.forEach(type => {
      const option = document.createElement('option');
      option.value = type.name;
      option.textContent = type.name;
      selectElement.appendChild(option);
    });

    // Sonra, cache'de olmayan hardcoded malzemeleri ekle (isteğe bağlı)
    hardcodedIngredients.forEach(hcIng => {
      if (!feedIngredientTypesCache.find(cachedType => cachedType.name === hcIng.name)) {
        const option = document.createElement('option');
        option.value = hcIng.name;
        option.textContent = hcIng.name;
        selectElement.appendChild(option);
      }
    });

  } catch (error) {
    console.error('Yem malzemesi türleri yüklenirken hata:', error);
    selectElement.innerHTML = '<option value="" selected disabled>Türler yüklenemedi</option>';
    feedIngredientTypesCache = [];
  }
} 

// Anlık girilen yem malzemesi için toplam protein ve enerjiyi hesapla ve göster
function updateLiveIngredientTotals() {
  const amountEl = document.getElementById('ingredientAmount');
  const proteinPercentEl = document.getElementById('ingredientProtein');
  const energyPerKgEl = document.getElementById('ingredientEnergy');
  const liveTotalProteinDisplayEl = document.getElementById('liveTotalProtein'); // HTML'e eklendiğini varsayıyoruz
  const liveTotalEnergyDisplayEl = document.getElementById('liveTotalEnergy'); // HTML'e eklendiğini varsayıyoruz

  if (!amountEl || !proteinPercentEl || !energyPerKgEl || !liveTotalProteinDisplayEl || !liveTotalEnergyDisplayEl) {
    // console.warn("Canlı toplam hesaplama için gerekli elementlerden biri veya birkaçı eksik.");
    return;
  }

  const amount = parseFloat(amountEl.value) || 0;
  const proteinPercent = parseFloat(proteinPercentEl.value) || 0;
  const energyPerKg = parseFloat(energyPerKgEl.value) || 0;

  if (amount <= 0) {
    liveTotalProteinDisplayEl.value = '0 g';
    liveTotalEnergyDisplayEl.value = '0 MJ';
    return;
  }

  // Toplam protein (g) = Miktar (kg) * (Protein (%) / 100) * 1000 (g/kg)
  const totalProteinGrams = amount * (proteinPercent / 100) * 1000;
  // Toplam enerji (MJ) = Miktar (kg) * Enerji (MJ/kg)
  const totalEnergyMJ = amount * energyPerKg;

  liveTotalProteinDisplayEl.value = totalProteinGrams.toFixed(1) + ' g';
  liveTotalEnergyDisplayEl.value = totalEnergyMJ.toFixed(1) + ' MJ';
}

// Sayfa kapatılmadan önce profil durumunu kaydet
window.addEventListener('beforeunload', async (event) => {
  console.log('Sayfa kapatılıyor, aktif profil kaydediliyor:', activeProfileId);
  if (activeProfileId) {
    try {
      // Son aktif profili API'ye kaydet
      await window.lsmAPI.profiles.setActive(activeProfileId);
      console.log('Aktif profil başarıyla kaydedildi:', activeProfileId);
    } catch (error) {
      console.error('Aktif profil kaydedilirken hata:', error);
    }
  }
});