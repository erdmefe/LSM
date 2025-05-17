/**
 * Animal Model - Hayvanlar ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Belirli bir profile ait tüm hayvanları getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Hayvan listesi
 */
async function getAnimalsByProfile(profileId) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    return await db.all(`
      SELECT a.*, t.name as type_name 
      FROM animals a
      LEFT JOIN animal_types t ON a.type_id = t.id
      WHERE a.profile_id = ?
      ORDER BY a.name
    `, [profileId]);
  } catch (error) {
    console.error(`Hayvanlar (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre hayvan getirir
 * @param {number} id - Hayvan ID
 * @returns {Promise<Object>} - Hayvan bilgileri
 */
async function getAnimalById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçersiz hayvan ID'
      };
    }
    
    const animal = await db.get(`
      SELECT a.*, t.name as type_name 
      FROM animals a
      LEFT JOIN animal_types t ON a.type_id = t.id
      WHERE a.id = ?
    `, [id]);
    
    if (!animal) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan hayvan bulunamadı`,
        userMessage: 'Hayvan bulunamadı'
      };
    }
    
    return animal;
  } catch (error) {
    console.error(`Hayvan (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni hayvan oluşturur
 * @param {Object} animalData - Hayvan bilgileri
 * @returns {Promise<number>} - Oluşturulan hayvanın ID'si
 */
async function createAnimal(animalData) {
  try {
    // Girdi doğrulama
    const { profile_id, type_id, tag_id, name, gender, birth_date, acquisition_date, acquisition_cost, status, notes } = animalData;
    
    if (!profile_id || isNaN(parseInt(profile_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçerli bir profil seçmelisiniz'
      };
    }
    
    // Profil varlığını kontrol et
    const profileExists = await db.get("SELECT id FROM profiles WHERE id = ?", [profile_id]);
    if (!profileExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${profile_id} olan profil bulunamadı`,
        userMessage: 'Seçilen profil bulunamadı'
      };
    }
    
    // Tür ID varsa kontrol et
    if (type_id) {
      const typeExists = await db.get("SELECT id FROM animal_types WHERE id = ?", [type_id]);
      if (!typeExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${type_id} olan hayvan türü bulunamadı`,
          userMessage: 'Seçilen hayvan türü bulunamadı'
        };
      }
    }
    
    const result = await db.run(
      `INSERT INTO animals (
        profile_id, type_id, tag_id, name, gender, 
        birth_date, acquisition_date, acquisition_cost, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile_id, 
        type_id || null, 
        tag_id || null, 
        name || null, 
        gender || null,
        birth_date || null, 
        acquisition_date || null, 
        acquisition_cost || null, 
        status || 'active', 
        notes || null
      ]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Hayvan oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Hayvan günceller
 * @param {number} id - Hayvan ID
 * @param {Object} animalData - Hayvan bilgileri
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateAnimal(id, animalData) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçersiz hayvan ID'
      };
    }
    
    // Hayvan varlığını kontrol et
    const animalExists = await db.get("SELECT id FROM animals WHERE id = ?", [id]);
    if (!animalExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan hayvan bulunamadı`,
        userMessage: 'Güncellenecek hayvan bulunamadı'
      };
    }
    
    const { type_id, tag_id, name, gender, birth_date, acquisition_date, acquisition_cost, status, notes } = animalData;
    
    // Tür ID varsa kontrol et
    if (type_id) {
      const typeExists = await db.get("SELECT id FROM animal_types WHERE id = ?", [type_id]);
      if (!typeExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${type_id} olan hayvan türü bulunamadı`,
          userMessage: 'Seçilen hayvan türü bulunamadı'
        };
      }
    }
    
    const result = await db.run(
      `UPDATE animals SET 
        type_id = ?, tag_id = ?, name = ?, gender = ?, 
        birth_date = ?, acquisition_date = ?, 
        acquisition_cost = ?, status = ?, notes = ?
      WHERE id = ?`,
      [
        type_id || null, 
        tag_id || null, 
        name || null, 
        gender || null,
        birth_date || null, 
        acquisition_date || null, 
        acquisition_cost || null, 
        status || 'active', 
        notes || null,
        id
      ]
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Hayvan (ID: ${id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Hayvan siler
 * @param {number} id - Hayvan ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteAnimal(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçersiz hayvan ID'
      };
    }
    
    // İşlemi transaction içinde gerçekleştir
    return await db.executeTransaction(async () => {
      // Önce hayvan varlığını kontrol et
      const animal = await db.get("SELECT * FROM animals WHERE id = ?", [id]);
      if (!animal) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${id} olan hayvan bulunamadı`,
          userMessage: 'Silinecek hayvan bulunamadı'
        };
      }
      
      // Veritabanı CASCADE ayarı ile ilişkili kayıtları otomatik silecek
      const result = await db.run("DELETE FROM animals WHERE id = ?", [id]);
      
      return result.changes > 0;
    });
  } catch (error) {
    console.error(`Hayvan (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Hayvan türü oluşturur
 * @param {number} profileId - Profil ID
 * @param {string} name - Tür adı
 * @param {string} description - Tür açıklaması
 * @returns {Promise<number>} - Oluşturulan türün ID'si
 */
async function createAnimalType(profileId, name, description = "") {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçerli bir profil seçmelisiniz'
      };
    }
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw {
        code: 'INVALID_INPUT',
        message: 'Tür adı gereklidir',
        userMessage: 'Lütfen geçerli bir tür adı girin'
      };
    }
    
    // Profil varlığını kontrol et
    const profileExists = await db.get("SELECT id FROM profiles WHERE id = ?", [profileId]);
    if (!profileExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${profileId} olan profil bulunamadı`,
        userMessage: 'Seçilen profil bulunamadı'
      };
    }
    
    const result = await db.run(
      "INSERT INTO animal_types (profile_id, name, description) VALUES (?, ?, ?)",
      [profileId, name.trim(), description ? description.trim() : ""]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Hayvan türü oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm hayvan türlerini getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Hayvan türleri listesi
 */
async function getAnimalTypesByProfile(profileId) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    return await db.all(
      "SELECT * FROM animal_types WHERE profile_id = ? ORDER BY name",
      [profileId]
    );
  } catch (error) {
    console.error(`Hayvan türleri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getAnimalsByProfile,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createAnimalType,
  getAnimalTypesByProfile
}; 