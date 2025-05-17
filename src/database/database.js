const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Veritabanı dosyasının bulunacağı dizin
const userDataPath = path.join(process.env.APPDATA || 
                              (process.platform === 'darwin' ? 
                               path.join(process.env.HOME, 'Library', 'Application Support') : 
                               path.join(process.env.HOME, '.config')), 
                              'lsm');

// Dizin yoksa oluştur
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

const dbPath = path.join(userDataPath, 'lsm.db');
const db = new sqlite3.Database(dbPath);

// Veritabanı tablolarını oluştur
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Profiller Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Hayvan Türleri Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS animal_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Hayvanlar Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        type_id INTEGER,
        tag_id TEXT,
        name TEXT,
        gender TEXT,
        birth_date DATE,
        acquisition_date DATE,
        acquisition_cost REAL,
        status TEXT,
        notes TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (type_id) REFERENCES animal_types(id) ON DELETE SET NULL
      )`);

      // Sağlık Kayıtları Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS health_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        record_date DATE,
        treatment_type TEXT,
        description TEXT,
        cost REAL,
        performed_by TEXT,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      )`);

      // Üreme Kayıtları Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS breeding_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER,
        partner_id INTEGER,
        breeding_date DATE,
        expected_birth_date DATE,
        actual_birth_date DATE,
        offspring_count INTEGER,
        notes TEXT,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
        FOREIGN KEY (partner_id) REFERENCES animals(id) ON DELETE SET NULL
      )`);

      // Gelir Kategorileri Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS income_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Gider Kategorileri Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS expense_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )`);

      // Mali İşlemler Tablosu
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        transaction_date DATE,
        type TEXT,  -- 'income' veya 'expense'
        category_id INTEGER,
        amount REAL,
        description TEXT,
        related_animal_id INTEGER,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (related_animal_id) REFERENCES animals(id) ON DELETE SET NULL
      )`);

      // Varsayılan profil oluştur
      db.get("SELECT COUNT(*) as count FROM profiles", (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count === 0) {
          db.run(`INSERT INTO profiles (name, description) VALUES (?, ?)`, 
            ["Varsayılan Profil", "Otomatik oluşturulan varsayılan profil"],
            (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
        } else {
          resolve();
        }
      });
    });
  });
}

// Profiller
const profileMethods = {
  getAllProfiles: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM profiles ORDER BY name", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  getProfileById: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM profiles WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  createProfile: (name, description) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO profiles (name, description) VALUES (?, ?)",
        [name, description],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },
  
  updateProfile: (id, name, description) => {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE profiles SET name = ?, description = ? WHERE id = ?",
        [name, description, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },
  
  deleteProfile: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM profiles WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
};

// Diğer veritabanı fonksiyonları (hayvanlar, sağlık kayıtları, vb.) burada tanımlanabilir

module.exports = {
  initDatabase,
  db,
  ...profileMethods
}; 