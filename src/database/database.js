const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * Veritabanı sınıfı - Singleton pattern
 * @class Database
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    // Veritabanı dosyasının bulunacağı dizin
    this.userDataPath = path.join(process.env.APPDATA || 
                            (process.platform === 'darwin' ? 
                             path.join(process.env.HOME, 'Library', 'Application Support') : 
                             path.join(process.env.HOME, '.config')), 
                            'lsm');

    // Dizin yoksa oluştur
    if (!fs.existsSync(this.userDataPath)) {
      fs.mkdirSync(this.userDataPath, { recursive: true });
    }

    this.dbPath = path.join(this.userDataPath, 'lsm.db');
    this.db = new sqlite3.Database(this.dbPath);
    
    Database.instance = this;
  }

  /**
   * Veritabanında bir sorgu çalıştırır
   * @param {string} sql - SQL sorgusu
   * @param {Array} params - Sorgu parametreleri
   * @returns {Promise} - Sorgu sonucu
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject({
            code: err.code,
            message: err.message,
            userMessage: 'Veritabanı işlemi sırasında bir hata oluştu'
          });
        } else {
          resolve({ 
            lastID: this.lastID, 
            changes: this.changes 
          });
        }
      });
    });
  }

  /**
   * Veritabanından tek bir satır getirir
   * @param {string} sql - SQL sorgusu
   * @param {Array} params - Sorgu parametreleri
   * @returns {Promise} - Sorgu sonucu
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject({
            code: err.code,
            message: err.message,
            userMessage: 'Veri alınırken bir hata oluştu'
          });
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Veritabanından birden fazla satır getirir
   * @param {string} sql - SQL sorgusu
   * @param {Array} params - Sorgu parametreleri
   * @returns {Promise} - Sorgu sonucu
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject({
            code: err.code,
            message: err.message,
            userMessage: 'Veriler alınırken bir hata oluştu'
          });
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Transaction başlatır
   * @returns {Promise}
   */
  beginTransaction() {
    return this.run('BEGIN TRANSACTION');
  }

  /**
   * Transaction'ı onaylar
   * @returns {Promise}
   */
  commit() {
    return this.run('COMMIT');
  }

  /**
   * Transaction'ı geri alır
   * @returns {Promise}
   */
  rollback() {
    return this.run('ROLLBACK');
  }

  /**
   * Bir işlemi transaction içinde çalıştırır
   * @param {Function} callback - Transaction içinde çalıştırılacak fonksiyon
   * @returns {Promise} - İşlem sonucu
   */
  async executeTransaction(callback) {
    try {
      await this.beginTransaction();
      const result = await callback();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Veritabanı bağlantısını kapatır
   * @returns {Promise}
   */
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject({
            code: err.code,
            message: err.message,
            userMessage: 'Veritabanı kapatılırken bir hata oluştu'
          });
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Veritabanını başlatır
   * @returns {Promise}
   */
  async initDatabase() {
    try {
      // Profiller Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      )`);

      // Hayvan Türleri Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS animal_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Hayvanlar Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        type_id INTEGER,
        tag_id TEXT,
        name TEXT,
        gender TEXT,
        birth_date DATE,
        entry_date DATE,
        status TEXT,
        breed TEXT,
        weight REAL,
        color TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        mother_id INTEGER,
        father_id INTEGER,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (type_id) REFERENCES animal_types(id) ON DELETE SET NULL,
        FOREIGN KEY (mother_id) REFERENCES animals(id) ON DELETE SET NULL,
        FOREIGN KEY (father_id) REFERENCES animals(id) ON DELETE SET NULL
      )`);

      // Sağlık Kayıtları Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS health_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        record_date DATE,
        record_type TEXT,
        description TEXT,
        treatment TEXT,
        cost REAL,
        performed_by TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      )`);

      // Sağım Kayıtları Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS milk_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        milk_date DATE,
        milk_time TIME,
        amount REAL,
        quality TEXT,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      )`);

      // Üreme Kayıtları Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS breeding_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        breeding_date DATE,
        semen_source TEXT,
        bull_id INTEGER,
        pregnant BOOLEAN DEFAULT 0,
        pregnancy_check_date DATE,
        expected_birth_date DATE,
        birth_date DATE,
        birth_result TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
        FOREIGN KEY (bull_id) REFERENCES animals(id) ON DELETE SET NULL
      )`);

      // Gelir Kategorileri Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS income_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Gider Kategorileri Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS expense_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Mali İşlemler Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        date DATE,
        type TEXT,  -- 'income' veya 'expense'
        amount REAL,
        description TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Rasyon Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS rations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        animal_group TEXT NOT NULL,
        status TEXT DEFAULT 'Aktif',
        description TEXT,
        total_weight REAL,
        total_cost REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Rasyon Bileşenleri Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS ration_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ration_id INTEGER,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        cost REAL,
        protein REAL,
        energy REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (ration_id) REFERENCES rations(id) ON DELETE CASCADE
      )`);

      // Yem Malzemesi Türleri Tablosu
      await this.run(`CREATE TABLE IF NOT EXISTS feed_ingredient_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        default_cost REAL,
        default_protein REAL,
        default_energy REAL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        UNIQUE (profile_id, name),
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Performans için indeksler ekle
      await this.run('CREATE INDEX IF NOT EXISTS idx_animals_profile_id ON animals(profile_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_animals_type_id ON animals(type_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_milk_records_animal_id ON milk_records(animal_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_breeding_records_animal_id ON breeding_records(animal_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON transactions(profile_id)');

      // Varsayılan profil oluştur
      const row = await this.get("SELECT COUNT(*) as count FROM profiles");
      if (row.count === 0) {
        await this.run(
          "INSERT INTO profiles (name, description) VALUES (?, ?)",
          ["Varsayılan Profil", "Otomatik oluşturulan varsayılan profil"]
        );
      }
      
      return true;
    } catch (error) {
      console.error("Veritabanı başlatılırken hata:", error);
      throw error;
    }
  }

  /**
   * Veritabanını yedekler
   * @param {string} backupPath - Yedek dosyasının yolu
   * @returns {Promise}
   */
  backup(backupPath) {
    return new Promise((resolve, reject) => {
      const backup = fs.createWriteStream(backupPath);
      const source = fs.createReadStream(this.dbPath);
      
      source.on('error', err => {
        reject({
          code: 'BACKUP_ERROR',
          message: err.message,
          userMessage: 'Veritabanı yedeklenirken bir hata oluştu'
        });
      });
      
      backup.on('error', err => {
        reject({
          code: 'BACKUP_ERROR',
          message: err.message,
          userMessage: 'Veritabanı yedeklenirken bir hata oluştu'
        });
      });
      
      backup.on('finish', () => {
        resolve(true);
      });
      
      source.pipe(backup);
    });
  }

  /**
   * Veritabanını geri yükler
   * @param {string} backupPath - Yedek dosyasının yolu
   * @returns {Promise}
   */
  restore(backupPath) {
    return new Promise((resolve, reject) => {
      // Önce veritabanını kapat
      this.db.close(async (err) => {
        if (err) {
          reject({
            code: 'RESTORE_ERROR',
            message: err.message,
            userMessage: 'Veritabanı geri yüklenirken bir hata oluştu'
          });
          return;
        }
        
        try {
          // Yedek dosyasını kopyala
          fs.copyFileSync(backupPath, this.dbPath);
          
          // Veritabanını yeniden aç
          this.db = new sqlite3.Database(this.dbPath);
          resolve(true);
        } catch (error) {
          reject({
            code: 'RESTORE_ERROR',
            message: error.message,
            userMessage: 'Veritabanı geri yüklenirken bir hata oluştu'
          });
        }
      });
    });
  }
}

// Veritabanı örneği oluştur
const dbInstance = new Database();

module.exports = dbInstance; 