/**
 * Milk Record Model - Sağım kayıtları ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Belirli bir hayvana ait tüm sağım kayıtlarını getirir
 * @param {number} animalId - Hayvan ID
 * @returns {Promise<Array>} - Sağım kayıtları listesi
 */
async function getMilkRecordsByAnimal(animalId) {
  try {
    // Girdi doğrulama
    if (!animalId || isNaN(parseInt(animalId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçersiz hayvan ID'
      };
    }
    
    return await db.all(`
      SELECT * FROM milk_records
      WHERE animal_id = ?
      ORDER BY milk_date DESC, milk_time DESC
    `, [animalId]);
  } catch (error) {
    console.error(`Sağım kayıtları (Hayvan ID: ${animalId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre sağım kaydı getirir
 * @param {number} id - Sağım kaydı ID
 * @returns {Promise<Object>} - Sağım kaydı bilgileri
 */
async function getMilkRecordById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağım kaydı ID',
        userMessage: 'Geçersiz sağım kaydı ID'
      };
    }
    
    const record = await db.get(`
      SELECT mr.*, a.name as animal_name, a.tag_id
      FROM milk_records mr
      JOIN animals a ON mr.animal_id = a.id
      WHERE mr.id = ?
    `, [id]);
    
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağım kaydı bulunamadı`,
        userMessage: 'Sağım kaydı bulunamadı'
      };
    }
    
    return record;
  } catch (error) {
    console.error(`Sağım kaydı (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni sağım kaydı oluşturur
 * @param {Object} recordData - Sağım kaydı bilgileri
 * @returns {Promise<number>} - Oluşturulan kaydın ID'si
 */
async function createMilkRecord(recordData) {
  try {
    // Girdi doğrulama
    const { animal_id, milk_date, milk_time, amount, quality, note } = recordData;
    
    if (!animal_id || isNaN(parseInt(animal_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçerli bir hayvan seçmelisiniz'
      };
    }
    
    if (!milk_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Sağım tarihi gereklidir',
        userMessage: 'Lütfen bir sağım tarihi girin'
      };
    }
    
    if (!milk_time) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Sağım saati gereklidir',
        userMessage: 'Lütfen bir sağım saati girin'
      };
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçerli bir miktar girilmelidir',
        userMessage: 'Lütfen geçerli bir sağım miktarı girin'
      };
    }
    
    // Hayvan varlığını kontrol et
    const animalExists = await db.get("SELECT id, status FROM animals WHERE id = ?", [animal_id]);
    if (!animalExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${animal_id} olan hayvan bulunamadı`,
        userMessage: 'Seçilen hayvan bulunamadı'
      };
    }
    
    // Hayvanın sağılabilir durumda olup olmadığını kontrol et
    if (animalExists.status === 'Kuruda') {
      throw {
        code: 'INVALID_OPERATION',
        message: `Hayvan kuruda durumunda ve sağılamaz`,
        userMessage: 'Bu hayvan kuruda durumunda olduğu için sağım kaydı eklenemez'
      };
    }
    
    // Hayvanın Sağmal veya Gebe olup olmadığını kontrol et
    if (animalExists.status !== 'Sağmal' && animalExists.status !== 'Gebe') {
      throw {
        code: 'INVALID_OPERATION',
        message: `Hayvan sağılabilir durumda değil (durum: ${animalExists.status})`,
        userMessage: `Bu hayvan için sağım kaydı eklenemez, çünkü sağılabilir durumda değil (mevcut durum: ${animalExists.status})`
      };
    }
    
    const result = await db.run(
      `INSERT INTO milk_records (
        animal_id, milk_date, milk_time, amount, quality, note
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        animal_id,
        milk_date,
        milk_time,
        parseFloat(amount),
        quality || 'B',
        note || null
      ]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Sağım kaydı oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Sağım kaydını günceller
 * @param {Object} recordData - Sağım kaydı bilgileri (id içermeli)
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateMilkRecord(recordData) {
  try {
    // Girdi doğrulama
    const { id, milk_date, milk_time, amount, quality, note } = recordData;
    
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağım kaydı ID',
        userMessage: 'Geçersiz sağım kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const recordExists = await db.get("SELECT id FROM milk_records WHERE id = ?", [id]);
    if (!recordExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağım kaydı bulunamadı`,
        userMessage: 'Güncellenecek sağım kaydı bulunamadı'
      };
    }
    
    if (!milk_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Sağım tarihi gereklidir',
        userMessage: 'Lütfen bir sağım tarihi girin'
      };
    }
    
    if (!milk_time) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Sağım saati gereklidir',
        userMessage: 'Lütfen bir sağım saati girin'
      };
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçerli bir miktar girilmelidir',
        userMessage: 'Lütfen geçerli bir sağım miktarı girin'
      };
    }
    
    const result = await db.run(
      `UPDATE milk_records SET 
        milk_date = ?, milk_time = ?, amount = ?, quality = ?, note = ?
      WHERE id = ?`,
      [
        milk_date,
        milk_time,
        parseFloat(amount),
        quality || 'B',
        note || null,
        id
      ]
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Sağım kaydı (ID: ${id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Sağım kaydını siler
 * @param {number} id - Sağım kaydı ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteMilkRecord(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağım kaydı ID',
        userMessage: 'Geçersiz sağım kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const record = await db.get("SELECT * FROM milk_records WHERE id = ?", [id]);
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağım kaydı bulunamadı`,
        userMessage: 'Silinecek sağım kaydı bulunamadı'
      };
    }
    
    const result = await db.run("DELETE FROM milk_records WHERE id = ?", [id]);
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Sağım kaydı (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm sağım kayıtlarını getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - Filtreleme seçenekleri
 * @returns {Promise<Array>} - Sağım kayıtları listesi
 */
async function getMilkRecordsByProfile(profileId, options = {}) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    let query = `
      SELECT mr.*, a.name as animal_name, a.tag_id
      FROM milk_records mr
      JOIN animals a ON mr.animal_id = a.id
      WHERE a.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND mr.milk_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND mr.milk_date <= ?";
      params.push(options.endDate);
    }
    
    // Hayvana göre filtreleme
    if (options.animalId) {
      query += " AND mr.animal_id = ?";
      params.push(options.animalId);
    }
    
    // Kaliteye göre filtreleme
    if (options.quality) {
      query += " AND mr.quality = ?";
      params.push(options.quality);
    }
    
    // Sıralama
    query += " ORDER BY mr.milk_date DESC, mr.milk_time DESC";
    
    // Kayıtları al
    const records = await db.all(query, params);
    
    return records;
  } catch (error) {
    console.error(`Sağım kayıtları (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait sağım istatistiklerini getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - İstatistik seçenekleri
 * @returns {Promise<Object>} - Sağım istatistikleri
 */
async function getMilkStats(profileId, options = {}) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    let query = `
      SELECT 
        COUNT(*) as total_records,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount,
        MAX(amount) as max_amount,
        MIN(amount) as min_amount,
        COUNT(DISTINCT animal_id) as animal_count
      FROM milk_records mr
      JOIN animals a ON mr.animal_id = a.id
      WHERE a.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND mr.milk_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND mr.milk_date <= ?";
      params.push(options.endDate);
    }
    
    // Hayvana göre filtreleme
    if (options.animalId) {
      query += " AND mr.animal_id = ?";
      params.push(options.animalId);
    }
    
    return await db.get(query, params);
  } catch (error) {
    console.error(`Sağım istatistikleri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getMilkRecordsByAnimal,
  getMilkRecordById,
  createMilkRecord,
  updateMilkRecord,
  deleteMilkRecord,
  getMilkRecordsByProfile,
  getMilkStats
}; 