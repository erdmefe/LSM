/**
 * Health Record Model - Sağlık kayıtları ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Belirli bir hayvana ait tüm sağlık kayıtlarını getirir
 * @param {number} animalId - Hayvan ID
 * @returns {Promise<Array>} - Sağlık kayıtları listesi
 */
async function getHealthRecordsByAnimal(animalId) {
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
      SELECT * FROM health_records
      WHERE animal_id = ?
      ORDER BY record_date DESC
    `, [animalId]);
  } catch (error) {
    console.error(`Sağlık kayıtları (Hayvan ID: ${animalId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre sağlık kaydı getirir
 * @param {number} id - Sağlık kaydı ID
 * @returns {Promise<Object>} - Sağlık kaydı bilgileri
 */
async function getHealthRecordById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağlık kaydı ID',
        userMessage: 'Geçersiz sağlık kaydı ID'
      };
    }
    
    const record = await db.get(`
      SELECT hr.*, a.name as animal_name, a.tag_id
      FROM health_records hr
      JOIN animals a ON hr.animal_id = a.id
      WHERE hr.id = ?
    `, [id]);
    
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağlık kaydı bulunamadı`,
        userMessage: 'Sağlık kaydı bulunamadı'
      };
    }
    
    return record;
  } catch (error) {
    console.error(`Sağlık kaydı (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni sağlık kaydı oluşturur
 * @param {Object} recordData - Sağlık kaydı bilgileri
 * @returns {Promise<number>} - Oluşturulan kaydın ID'si
 */
async function createHealthRecord(recordData) {
  try {
    // Girdi doğrulama
    const { animal_id, record_date, treatment_type, description, cost, performed_by } = recordData;
    
    if (!animal_id || isNaN(parseInt(animal_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçerli bir hayvan seçmelisiniz'
      };
    }
    
    if (!record_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Kayıt tarihi gereklidir',
        userMessage: 'Lütfen bir kayıt tarihi girin'
      };
    }
    
    // Hayvan varlığını kontrol et
    const animalExists = await db.get("SELECT id FROM animals WHERE id = ?", [animal_id]);
    if (!animalExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${animal_id} olan hayvan bulunamadı`,
        userMessage: 'Seçilen hayvan bulunamadı'
      };
    }
    
    const result = await db.run(
      `INSERT INTO health_records (
        animal_id, record_date, treatment_type, description, cost, performed_by
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        animal_id,
        record_date,
        treatment_type || null,
        description || null,
        cost || null,
        performed_by || null
      ]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Sağlık kaydı oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Sağlık kaydını günceller
 * @param {number} id - Sağlık kaydı ID
 * @param {Object} recordData - Sağlık kaydı bilgileri
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateHealthRecord(id, recordData) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağlık kaydı ID',
        userMessage: 'Geçersiz sağlık kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const recordExists = await db.get("SELECT id FROM health_records WHERE id = ?", [id]);
    if (!recordExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağlık kaydı bulunamadı`,
        userMessage: 'Güncellenecek sağlık kaydı bulunamadı'
      };
    }
    
    const { record_date, treatment_type, description, cost, performed_by } = recordData;
    
    if (!record_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Kayıt tarihi gereklidir',
        userMessage: 'Lütfen bir kayıt tarihi girin'
      };
    }
    
    const result = await db.run(
      `UPDATE health_records SET 
        record_date = ?, treatment_type = ?, description = ?, cost = ?, performed_by = ?
      WHERE id = ?`,
      [
        record_date,
        treatment_type || null,
        description || null,
        cost || null,
        performed_by || null,
        id
      ]
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Sağlık kaydı (ID: ${id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Sağlık kaydını siler
 * @param {number} id - Sağlık kaydı ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteHealthRecord(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz sağlık kaydı ID',
        userMessage: 'Geçersiz sağlık kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const record = await db.get("SELECT * FROM health_records WHERE id = ?", [id]);
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan sağlık kaydı bulunamadı`,
        userMessage: 'Silinecek sağlık kaydı bulunamadı'
      };
    }
    
    const result = await db.run("DELETE FROM health_records WHERE id = ?", [id]);
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Sağlık kaydı (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm hayvanların sağlık kayıtlarını getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - Filtreleme seçenekleri
 * @returns {Promise<Array>} - Sağlık kayıtları listesi
 */
async function getHealthRecordsByProfile(profileId, options = {}) {
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
      SELECT hr.*, a.name as animal_name, a.tag_id
      FROM health_records hr
      JOIN animals a ON hr.animal_id = a.id
      WHERE a.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND hr.record_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND hr.record_date <= ?";
      params.push(options.endDate);
    }
    
    // Tedavi tipine göre filtreleme
    if (options.treatmentType) {
      query += " AND hr.treatment_type = ?";
      params.push(options.treatmentType);
    }
    
    // Sıralama
    query += " ORDER BY hr.record_date DESC";
    
    return await db.all(query, params);
  } catch (error) {
    console.error(`Sağlık kayıtları (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getHealthRecordsByAnimal,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthRecordsByProfile
}; 