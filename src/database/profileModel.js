/**
 * Profile Model - Profil ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Veritabanından tüm profilleri getirir
 * @returns {Promise<Array>} - Profil listesi
 */
async function getAllProfiles() {
  try {
    return await db.all("SELECT * FROM profiles ORDER BY name");
  } catch (error) {
    console.error("Profiller alınırken hata:", error);
    throw error;
  }
}

/**
 * ID'ye göre profil getirir
 * @param {number} id - Profil ID
 * @returns {Promise<Object>} - Profil bilgileri
 */
async function getProfileById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    const profile = await db.get("SELECT * FROM profiles WHERE id = ?", [id]);
    if (!profile) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan profil bulunamadı`,
        userMessage: 'Profil bulunamadı'
      };
    }
    
    return profile;
  } catch (error) {
    console.error(`Profil (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni profil oluşturur
 * @param {string} name - Profil adı
 * @param {string} description - Profil açıklaması
 * @returns {Promise<number>} - Oluşturulan profilin ID'si
 */
async function createProfile(name, description = "") {
  try {
    // Girdi doğrulama
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw {
        code: 'INVALID_INPUT',
        message: 'Profil adı gereklidir',
        userMessage: 'Lütfen geçerli bir profil adı girin'
      };
    }
    
    const result = await db.run(
      "INSERT INTO profiles (name, description) VALUES (?, ?)",
      [name.trim(), description ? description.trim() : ""]
    );
    
    return result.lastID;
  } catch (error) {
    // SQLite'e özgü UNIQUE constraint hatasını kontrol et
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw {
        code: 'DUPLICATE_NAME',
        message: `"${name}" adında bir profil zaten var`,
        userMessage: 'Bu isimde bir profil zaten mevcut'
      };
    }
    
    console.error("Profil oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Profil günceller
 * @param {number} id - Profil ID
 * @param {string} name - Profil adı
 * @param {string} description - Profil açıklaması
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateProfile(id, name, description = "") {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw {
        code: 'INVALID_INPUT',
        message: 'Profil adı gereklidir',
        userMessage: 'Lütfen geçerli bir profil adı girin'
      };
    }
    
    const result = await db.run(
      "UPDATE profiles SET name = ?, description = ? WHERE id = ?",
      [name.trim(), description ? description.trim() : "", id]
    );
    
    if (result.changes === 0) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan profil bulunamadı`,
        userMessage: 'Güncellenecek profil bulunamadı'
      };
    }
    
    return true;
  } catch (error) {
    // SQLite'e özgü UNIQUE constraint hatasını kontrol et
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw {
        code: 'DUPLICATE_NAME',
        message: `"${name}" adında bir profil zaten var`,
        userMessage: 'Bu isimde bir profil zaten mevcut'
      };
    }
    
    console.error(`Profil (ID: ${id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Profil siler
 * @param {number} id - Profil ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteProfile(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    // İşlemi transaction içinde gerçekleştir
    return await db.executeTransaction(async () => {
      // Önce profil varlığını kontrol et
      const profile = await db.get("SELECT * FROM profiles WHERE id = ?", [id]);
      if (!profile) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${id} olan profil bulunamadı`,
          userMessage: 'Silinecek profil bulunamadı'
        };
      }
      
      // Veritabanı CASCADE ayarı ile ilişkili kayıtları otomatik silecek
      const result = await db.run("DELETE FROM profiles WHERE id = ?", [id]);
      
      return result.changes > 0;
    });
  } catch (error) {
    console.error(`Profil (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Profil sayısını getirir
 * @returns {Promise<number>} - Profil sayısı
 */
async function getProfileCount() {
  try {
    const result = await db.get("SELECT COUNT(*) as count FROM profiles");
    return result.count;
  } catch (error) {
    console.error("Profil sayısı alınırken hata:", error);
    throw error;
  }
}

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileCount
}; 