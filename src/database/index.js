/**
 * Database Module Index
 * Tüm veritabanı işlemlerini tek bir yerden dışa aktarır
 */
const db = require('./database');
const profileModel = require('./profileModel');
const animalModel = require('./animalModel');
const healthRecordModel = require('./healthRecordModel');
const transactionModel = require('./transactionModel');

/**
 * Veritabanını başlatır
 * @returns {Promise<boolean>}
 */
async function initialize() {
  try {
    await db.initDatabase();
    return true;
  } catch (error) {
    console.error('Veritabanı başlatılırken hata:', error);
    throw error;
  }
}

/**
 * Veritabanı bağlantısını kapatır
 * @returns {Promise<void>}
 */
async function close() {
  try {
    await db.close();
  } catch (error) {
    console.error('Veritabanı kapatılırken hata:', error);
    throw error;
  }
}

/**
 * Veritabanını yedekler
 * @param {string} backupPath - Yedek dosyasının yolu
 * @returns {Promise<boolean>}
 */
async function backup(backupPath) {
  try {
    return await db.backup(backupPath);
  } catch (error) {
    console.error('Veritabanı yedeklenirken hata:', error);
    throw error;
  }
}

/**
 * Veritabanını geri yükler
 * @param {string} backupPath - Yedek dosyasının yolu
 * @returns {Promise<boolean>}
 */
async function restore(backupPath) {
  try {
    return await db.restore(backupPath);
  } catch (error) {
    console.error('Veritabanı geri yüklenirken hata:', error);
    throw error;
  }
}

module.exports = {
  // Veritabanı yönetimi
  initialize,
  close,
  backup,
  restore,
  
  // Profil işlemleri
  profiles: {
    getAll: profileModel.getAllProfiles,
    getById: profileModel.getProfileById,
    create: profileModel.createProfile,
    update: profileModel.updateProfile,
    delete: profileModel.deleteProfile,
    getCount: profileModel.getProfileCount
  },
  
  // Hayvan işlemleri
  animals: {
    getByProfile: animalModel.getAnimalsByProfile,
    getById: animalModel.getAnimalById,
    create: animalModel.createAnimal,
    update: animalModel.updateAnimal,
    delete: animalModel.deleteAnimal,
  },
  
  // Hayvan türü işlemleri
  animalTypes: {
    getByProfile: animalModel.getAnimalTypesByProfile,
    create: animalModel.createAnimalType
  },
  
  // Sağlık kaydı işlemleri
  healthRecords: {
    getByAnimal: healthRecordModel.getHealthRecordsByAnimal,
    getById: healthRecordModel.getHealthRecordById,
    getByProfile: healthRecordModel.getHealthRecordsByProfile,
    create: healthRecordModel.createHealthRecord,
    update: healthRecordModel.updateHealthRecord,
    delete: healthRecordModel.deleteHealthRecord
  },
  
  // Mali işlemler
  transactions: {
    getByProfile: transactionModel.getTransactionsByProfile,
    getById: transactionModel.getTransactionById,
    create: transactionModel.createTransaction,
    update: transactionModel.updateTransaction,
    delete: transactionModel.deleteTransaction,
    getFinancialSummary: transactionModel.getFinancialSummary
  },
  
  // Kategori işlemleri
  categories: {
    income: {
      getByProfile: transactionModel.getIncomeCategoriesByProfile,
      create: transactionModel.createIncomeCategory
    },
    expense: {
      getByProfile: transactionModel.getExpenseCategoriesByProfile,
      create: transactionModel.createExpenseCategory
    }
  }
}; 