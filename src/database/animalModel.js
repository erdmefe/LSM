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

/**
 * Hayvan türleri için veritabanı işlemleri
 */
const animalTypes = {
  /**
   * Profil için tüm hayvan türlerini getirir
   * @param {number} profileId - Profil ID
   * @returns {Promise<Array>} Hayvan türleri listesi
   */
  async getAll(profileId) {
    try {
      return await db.all(
        'SELECT * FROM animal_types WHERE profile_id = ? ORDER BY name ASC',
        [profileId]
      );
    } catch (error) {
      console.error('Hayvan türleri getirilirken hata:', error);
      throw {
        code: 'TYPES_GET_ERROR',
        message: error.message,
        userMessage: 'Hayvan türleri yüklenirken bir hata oluştu'
      };
    }
  },

  /**
   * Yeni bir hayvan türü ekler
   * @param {Object} typeData - Tür verileri
   * @returns {Promise<Object>} Ekleme sonucu
   */
  async create(typeData) {
    try {
      // Gerekli alanları kontrol et
      if (!typeData.name || !typeData.profile_id) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Tür adı ve profil ID zorunludur',
          userMessage: 'Lütfen tür adını girdiğinizden emin olun'
        };
      }

      // Aynı isimde tür var mı kontrol et
      const existingType = await db.get(
        'SELECT id FROM animal_types WHERE profile_id = ? AND name = ?',
        [typeData.profile_id, typeData.name]
      );

      if (existingType) {
        throw {
          code: 'DUPLICATE_TYPE',
          message: 'Bu isimde bir tür zaten mevcut',
          userMessage: 'Bu isimde bir hayvan türü zaten kayıtlı'
        };
      }

      const result = await db.run(
        'INSERT INTO animal_types (profile_id, name, description) VALUES (?, ?, ?)',
        [typeData.profile_id, typeData.name, typeData.description || '']
      );

      return {
        success: true,
        id: result.lastID
      };
    } catch (error) {
      console.error('Hayvan türü eklenirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan türü eklenirken bir hata oluştu'
      };
    }
  },

  /**
   * Bir hayvan türünü günceller
   * @param {Object} typeData - Tür verileri
   * @returns {Promise<Object>} Güncelleme sonucu
   */
  async update(typeData) {
    try {
      // Gerekli alanları kontrol et
      if (!typeData.id || !typeData.name) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Tür ID ve adı zorunludur',
          userMessage: 'Lütfen tür adını girdiğinizden emin olun'
        };
      }

      await db.run(
        'UPDATE animal_types SET name = ?, description = ? WHERE id = ?',
        [typeData.name, typeData.description || '', typeData.id]
      );

      return { success: true };
    } catch (error) {
      console.error('Hayvan türü güncellenirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan türü güncellenirken bir hata oluştu'
      };
    }
  },

  /**
   * Bir hayvan türünü siler
   * @param {number} typeId - Tür ID
   * @returns {Promise<Object>} Silme sonucu
   */
  async delete(typeId) {
    try {
      // Bu türe ait hayvan var mı kontrol et
      const animalCount = await db.get(
        'SELECT COUNT(*) as count FROM animals WHERE type_id = ?',
        [typeId]
      );

      if (animalCount.count > 0) {
        throw {
          code: 'TYPE_IN_USE',
          message: 'Bu tür kullanımda olduğu için silinemez',
          userMessage: 'Bu türe ait hayvanlar olduğu için silinemez'
        };
      }

      await db.run('DELETE FROM animal_types WHERE id = ?', [typeId]);
      return { success: true };
    } catch (error) {
      console.error('Hayvan türü silinirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan türü silinirken bir hata oluştu'
      };
    }
  }
};

/**
 * Hayvanlar için veritabanı işlemleri
 */
const animals = {
  /**
   * Profil için tüm hayvanları getirir
   * @param {number} profileId - Profil ID
   * @returns {Promise<Array>} Hayvanlar listesi
   */
  async getAll(profileId) {
    try {
      return await db.all(
        `SELECT a.*, t.name as type_name 
         FROM animals a
         LEFT JOIN animal_types t ON a.type_id = t.id
         WHERE a.profile_id = ?
         ORDER BY a.name ASC`,
        [profileId]
      );
    } catch (error) {
      console.error('Hayvanlar getirilirken hata:', error);
      throw {
        code: 'ANIMALS_GET_ERROR',
        message: error.message,
        userMessage: 'Hayvanlar yüklenirken bir hata oluştu'
      };
    }
  },

  /**
   * Belirli bir hayvanı ID'ye göre getirir
   * @param {number} animalId - Hayvan ID
   * @returns {Promise<Object>} Hayvan bilgileri
   */
  async getById(animalId) {
    try {
      return await db.get(
        `SELECT a.*, t.name as type_name 
         FROM animals a
         LEFT JOIN animal_types t ON a.type_id = t.id
         WHERE a.id = ?`,
        [animalId]
      );
    } catch (error) {
      console.error('Hayvan bilgisi getirilirken hata:', error);
      throw {
        code: 'ANIMAL_GET_ERROR',
        message: error.message,
        userMessage: 'Hayvan bilgisi yüklenirken bir hata oluştu'
      };
    }
  },

  /**
   * Yeni bir hayvan ekler
   * @param {Object} animalData - Hayvan verileri
   * @returns {Promise<Object>} Ekleme sonucu
   */
  async create(animalData) {
    try {
      // Veri doğrulama
      if (!animalData.profile_id) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Profil ID zorunludur',
          userMessage: 'Profil seçilmeden hayvan eklenemez'
        };
      }

      if (!animalData.tag_id) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Küpe/Tanımlayıcı No zorunludur',
          userMessage: 'Lütfen küpe numarası veya benzersiz tanımlayıcı girin'
        };
      }

      // Aynı küpe no var mı kontrol et
      const existingAnimal = await db.get(
        'SELECT id FROM animals WHERE profile_id = ? AND tag_id = ?',
        [animalData.profile_id, animalData.tag_id]
      );

      if (existingAnimal) {
        throw {
          code: 'DUPLICATE_TAG',
          message: 'Bu küpe/tanımlayıcı numarası zaten kullanımda',
          userMessage: 'Bu küpe/tanımlayıcı numarası başka bir hayvan için kullanılıyor'
        };
      }

      const result = await db.run(
        `INSERT INTO animals 
         (profile_id, type_id, tag_id, name, gender, birth_date, 
          acquisition_date, acquisition_cost, status, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          animalData.profile_id,
          animalData.type_id,
          animalData.tag_id,
          animalData.name || null,
          animalData.gender,
          animalData.birth_date || null,
          animalData.acquisition_date,
          animalData.acquisition_cost || 0,
          animalData.status || 'Aktif',
          animalData.notes || ''
        ]
      );

      // Eğer alım maliyeti varsa mali işlem olarak da ekleyelim
      if (animalData.acquisition_cost && animalData.acquisition_cost > 0) {
        await db.run(
          `INSERT INTO transactions 
           (profile_id, transaction_date, type, category_id, amount, description, related_animal_id) 
           VALUES (?, ?, 'expense', NULL, ?, ?, ?)`,
          [
            animalData.profile_id,
            animalData.acquisition_date,
            animalData.acquisition_cost,
            `${animalData.tag_id} küpeli hayvan alımı`,
            result.lastID
          ]
        );
      }

      return {
        success: true,
        id: result.lastID
      };
    } catch (error) {
      console.error('Hayvan eklenirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan eklenirken bir hata oluştu'
      };
    }
  },

  /**
   * Bir hayvanı günceller
   * @param {Object} animalData - Hayvan verileri
   * @returns {Promise<Object>} Güncelleme sonucu
   */
  async update(animalData) {
    try {
      // Veri doğrulama
      if (!animalData.id) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Hayvan ID zorunludur',
          userMessage: 'Güncellenecek hayvan bulunamadı'
        };
      }

      if (!animalData.tag_id) {
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Küpe/Tanımlayıcı No zorunludur',
          userMessage: 'Lütfen küpe numarası veya benzersiz tanımlayıcı girin'
        };
      }

      // Aynı küpe no başka hayvanda var mı kontrol et
      const existingAnimal = await db.get(
        'SELECT id FROM animals WHERE profile_id = ? AND tag_id = ? AND id != ?',
        [animalData.profile_id, animalData.tag_id, animalData.id]
      );

      if (existingAnimal) {
        throw {
          code: 'DUPLICATE_TAG',
          message: 'Bu küpe/tanımlayıcı numarası zaten kullanımda',
          userMessage: 'Bu küpe/tanımlayıcı numarası başka bir hayvan için kullanılıyor'
        };
      }

      await db.run(
        `UPDATE animals SET 
         type_id = ?, tag_id = ?, name = ?, gender = ?, birth_date = ?,
         acquisition_date = ?, acquisition_cost = ?, status = ?, notes = ?
         WHERE id = ?`,
        [
          animalData.type_id,
          animalData.tag_id,
          animalData.name || null,
          animalData.gender,
          animalData.birth_date || null,
          animalData.acquisition_date,
          animalData.acquisition_cost || 0,
          animalData.status || 'Aktif',
          animalData.notes || '',
          animalData.id
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Hayvan güncellenirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan güncellenirken bir hata oluştu'
      };
    }
  },

  /**
   * Bir hayvanı siler
   * @param {number} animalId - Hayvan ID
   * @returns {Promise<Object>} Silme sonucu
   */
  async delete(animalId) {
    try {
      // Transaction ile ilişkili tüm verileri silelim
      await db.executeTransaction(async () => {
        // İlişkili sağlık kayıtlarını sil
        await db.run('DELETE FROM health_records WHERE animal_id = ?', [animalId]);
        
        // İlişkili üreme kayıtlarını sil
        await db.run('DELETE FROM breeding_records WHERE animal_id = ? OR partner_id = ?', [animalId, animalId]);
        
        // Hayvanı sil
        await db.run('DELETE FROM animals WHERE id = ?', [animalId]);
      });

      return { success: true };
    } catch (error) {
      console.error('Hayvan silinirken hata:', error);
      return {
        success: false,
        error: error.userMessage || 'Hayvan silinirken bir hata oluştu'
      };
    }
  },

  /**
   * Profil için hayvan istatistiklerini getirir
   * @param {number} profileId - Profil ID
   * @returns {Promise<Object>} İstatistikler
   */
  async getStats(profileId) {
    try {
      // Toplam hayvan sayısı
      const totalCount = await db.get(
        'SELECT COUNT(*) as count FROM animals WHERE profile_id = ?',
        [profileId]
      );

      // Durum bazında sayılar
      const statusCounts = await db.all(
        'SELECT status, COUNT(*) as count FROM animals WHERE profile_id = ? GROUP BY status',
        [profileId]
      );

      // Tür bazında sayılar
      const typeCounts = await db.all(
        `SELECT t.name, COUNT(*) as count 
         FROM animals a
         LEFT JOIN animal_types t ON a.type_id = t.id
         WHERE a.profile_id = ?
         GROUP BY a.type_id`,
        [profileId]
      );

      // Cinsiyet bazında sayılar
      const genderCounts = await db.all(
        'SELECT gender, COUNT(*) as count FROM animals WHERE profile_id = ? GROUP BY gender',
        [profileId]
      );

      return {
        total: totalCount.count,
        byStatus: statusCounts,
        byType: typeCounts,
        byGender: genderCounts
      };
    } catch (error) {
      console.error('Hayvan istatistikleri alınırken hata:', error);
      throw {
        code: 'STATS_ERROR',
        message: error.message,
        userMessage: 'İstatistikler alınırken bir hata oluştu'
      };
    }
  }
};

module.exports = {
  getAnimalsByProfile,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createAnimalType,
  getAnimalTypesByProfile,
  types: animalTypes,
  animals
}; 