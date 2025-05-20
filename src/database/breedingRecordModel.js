/**
 * Breeding Record Model - Üreme/gebelik kayıtları ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Belirli bir hayvana ait tüm üreme kayıtlarını getirir
 * @param {number} animalId - Hayvan ID
 * @returns {Promise<Array>} - Üreme kayıtları listesi
 */
async function getBreedingRecordsByAnimal(animalId) {
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
      SELECT 
        br.*, 
        a.name as animal_name, 
        a.tag_id as animal_tag_id,
        p.name as partner_name,
        p.tag_id as partner_tag_id
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      LEFT JOIN animals p ON br.partner_id = p.id
      WHERE br.animal_id = ?
      ORDER BY br.breeding_date DESC
    `, [animalId]);
  } catch (error) {
    console.error(`Üreme kayıtları (Hayvan ID: ${animalId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre üreme kaydı getirir
 * @param {number} id - Üreme kaydı ID
 * @returns {Promise<Object>} - Üreme kaydı bilgileri
 */
async function getBreedingRecordById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz üreme kaydı ID',
        userMessage: 'Geçersiz üreme kaydı ID'
      };
    }
    
    const record = await db.get(`
      SELECT 
        br.*, 
        a.name as animal_name, 
        a.tag_id as animal_tag_id,
        p.name as partner_name,
        p.tag_id as partner_tag_id
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      LEFT JOIN animals p ON br.partner_id = p.id
      WHERE br.id = ?
    `, [id]);
    
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan üreme kaydı bulunamadı`,
        userMessage: 'Üreme kaydı bulunamadı'
      };
    }
    
    return record;
  } catch (error) {
    console.error(`Üreme kaydı (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni üreme kaydı oluşturur
 * @param {Object} recordData - Üreme kaydı bilgileri
 * @returns {Promise<number>} - Oluşturulan kaydın ID'si
 */
async function createBreedingRecord(recordData) {
  try {
    // Girdi doğrulama
    const { 
      animal_id, partner_id, breeding_date, 
      expected_birth_date, actual_birth_date, 
      offspring_count, notes 
    } = recordData;
    
    if (!animal_id || isNaN(parseInt(animal_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz hayvan ID',
        userMessage: 'Geçerli bir hayvan seçmelisiniz'
      };
    }
    
    if (!breeding_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Çiftleşme tarihi gereklidir',
        userMessage: 'Lütfen bir çiftleşme tarihi girin'
      };
    }
    
    // Hayvan varlığını kontrol et
    const animalExists = await db.get("SELECT id, gender, status FROM animals WHERE id = ?", [animal_id]);
    if (!animalExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${animal_id} olan hayvan bulunamadı`,
        userMessage: 'Seçilen hayvan bulunamadı'
      };
    }
    
    // Eş hayvan seçildiyse varlığını kontrol et
    if (partner_id && partner_id > 0) {
      const partnerExists = await db.get("SELECT id, gender FROM animals WHERE id = ?", [partner_id]);
      if (!partnerExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${partner_id} olan eş hayvan bulunamadı`,
          userMessage: 'Seçilen eş hayvan bulunamadı'
        };
      }
      
      // Ana hayvan ve eş hayvanın cinsiyeti farklı olmalı
      if (animalExists.gender === partnerExists.gender) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Ana hayvan ve eş hayvan aynı cinsiyette olamaz',
          userMessage: 'Ana hayvan ve eş hayvanın cinsiyeti farklı olmalıdır'
        };
      }
    }
    
    // Tahmini doğum tarihi kontrolü
    if (expected_birth_date && breeding_date) {
      const breedingDateObj = new Date(breeding_date);
      const expectedBirthDateObj = new Date(expected_birth_date);
      
      if (expectedBirthDateObj <= breedingDateObj) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Tahmini doğum tarihi çiftleşme tarihinden sonra olmalıdır',
          userMessage: 'Tahmini doğum tarihi çiftleşme tarihinden sonra olmalıdır'
        };
      }
    }
    
    // Gerçek doğum tarihi kontrolü
    if (actual_birth_date && breeding_date) {
      const breedingDateObj = new Date(breeding_date);
      const actualBirthDateObj = new Date(actual_birth_date);
      
      if (actualBirthDateObj <= breedingDateObj) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Gerçek doğum tarihi çiftleşme tarihinden sonra olmalıdır',
          userMessage: 'Gerçek doğum tarihi çiftleşme tarihinden sonra olmalıdır'
        };
      }
    }
    
    const result = await db.run(
      `INSERT INTO breeding_records (
        animal_id, partner_id, breeding_date, expected_birth_date,
        actual_birth_date, offspring_count, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        animal_id,
        partner_id || null,
        breeding_date,
        expected_birth_date || null,
        actual_birth_date || null,
        offspring_count > 0 ? offspring_count : null,
        notes || null
      ]
    );
    
    // Gebe hayvanın durumunu güncelle
    if (animalExists.gender === 'Dişi') {
      await db.run(
        "UPDATE animals SET status = 'Gebe' WHERE id = ?",
        [animal_id]
      );
    }
    
    return result.lastID;
  } catch (error) {
    console.error("Üreme kaydı oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Üreme kaydını günceller
 * @param {Object} recordData - Üreme kaydı bilgileri
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateBreedingRecord(recordData) {
  try {
    // Girdi doğrulama
    const { 
      id, animal_id, partner_id, breeding_date, 
      expected_birth_date, actual_birth_date, 
      offspring_count, notes 
    } = recordData;
    
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz üreme kaydı ID',
        userMessage: 'Geçersiz üreme kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const recordExists = await db.get(`
      SELECT br.*, a.gender as animal_gender
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      WHERE br.id = ?
    `, [id]);
    
    if (!recordExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan üreme kaydı bulunamadı`,
        userMessage: 'Güncellenecek üreme kaydı bulunamadı'
      };
    }
    
    if (!breeding_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Çiftleşme tarihi gereklidir',
        userMessage: 'Lütfen bir çiftleşme tarihi girin'
      };
    }
    
    // Eş hayvan seçildiyse varlığını kontrol et
    if (partner_id && partner_id > 0) {
      const partnerExists = await db.get("SELECT id, gender FROM animals WHERE id = ?", [partner_id]);
      if (!partnerExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${partner_id} olan eş hayvan bulunamadı`,
          userMessage: 'Seçilen eş hayvan bulunamadı'
        };
      }
      
      // Hayvan bilgilerini al
      const animalExists = await db.get("SELECT id, gender FROM animals WHERE id = ?", [animal_id || recordExists.animal_id]);
      if (!animalExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${animal_id || recordExists.animal_id} olan hayvan bulunamadı`,
          userMessage: 'Seçilen hayvan bulunamadı'
        };
      }
      
      // Ana hayvan ve eş hayvanın cinsiyeti farklı olmalı
      if (animalExists.gender === partnerExists.gender) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Ana hayvan ve eş hayvan aynı cinsiyette olamaz',
          userMessage: 'Ana hayvan ve eş hayvanın cinsiyeti farklı olmalıdır'
        };
      }
    }
    
    // Tarihler kontrolü
    if (expected_birth_date && breeding_date) {
      const breedingDateObj = new Date(breeding_date);
      const expectedBirthDateObj = new Date(expected_birth_date);
      
      if (expectedBirthDateObj <= breedingDateObj) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Tahmini doğum tarihi çiftleşme tarihinden sonra olmalıdır',
          userMessage: 'Tahmini doğum tarihi çiftleşme tarihinden sonra olmalıdır'
        };
      }
    }
    
    if (actual_birth_date && breeding_date) {
      const breedingDateObj = new Date(breeding_date);
      const actualBirthDateObj = new Date(actual_birth_date);
      
      if (actualBirthDateObj <= breedingDateObj) {
        throw {
          code: 'INVALID_INPUT',
          message: 'Gerçek doğum tarihi çiftleşme tarihinden sonra olmalıdır',
          userMessage: 'Gerçek doğum tarihi çiftleşme tarihinden sonra olmalıdır'
        };
      }
    }
    
    // Kaydı güncelle
    const result = await db.run(
      `UPDATE breeding_records SET 
        partner_id = ?,
        breeding_date = ?,
        expected_birth_date = ?,
        actual_birth_date = ?,
        offspring_count = ?,
        notes = ?
      WHERE id = ?`,
      [
        partner_id || null,
        breeding_date,
        expected_birth_date || null,
        actual_birth_date || null,
        offspring_count > 0 ? offspring_count : null,
        notes || null,
        id
      ]
    );
    
    // Doğum gerçekleştiyse hayvanın durumunu güncelle
    if (actual_birth_date && recordExists.animal_gender === 'Dişi') {
      await db.run(
        "UPDATE animals SET status = 'Yeni Doğum' WHERE id = ?",
        [recordExists.animal_id]
      );
    }
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Üreme kaydı (ID: ${recordData.id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Üreme kaydını siler
 * @param {number} id - Üreme kaydı ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteBreedingRecord(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz üreme kaydı ID',
        userMessage: 'Geçersiz üreme kaydı ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const record = await db.get(`
      SELECT br.*, a.gender as animal_gender, a.status as animal_status
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      WHERE br.id = ?
    `, [id]);
    
    if (!record) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan üreme kaydı bulunamadı`,
        userMessage: 'Silinecek üreme kaydı bulunamadı'
      };
    }
    
    const result = await db.run("DELETE FROM breeding_records WHERE id = ?", [id]);
    
    // Hayvanın durumunu güncelle (eğer hala gebeyse)
    if (record.animal_gender === 'Dişi' && record.animal_status === 'Gebe') {
      // Hayvanın başka aktif gebelik kaydı var mı kontrol et
      const activeBreedingRecord = await db.get(`
        SELECT * 
        FROM breeding_records 
        WHERE animal_id = ? AND actual_birth_date IS NULL AND id != ?
        ORDER BY breeding_date DESC
        LIMIT 1
      `, [record.animal_id, id]);
      
      if (!activeBreedingRecord) {
        // Başka aktif gebelik kaydı yoksa durumu güncelle
        await db.run(
          "UPDATE animals SET status = 'Boşta' WHERE id = ?",
          [record.animal_id]
        );
      }
    }
    
    return result.changes > 0;
  } catch (error) {
    console.error(`Üreme kaydı (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm üreme kayıtlarını getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - Filtreleme seçenekleri
 * @returns {Promise<Array>} - Üreme kayıtları listesi
 */
async function getBreedingRecordsByProfile(profileId, options = {}) {
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
        br.*,
        a.name as animal_name,
        a.tag_id as animal_tag_id,
        a.gender as animal_gender, 
        p.name as partner_name,
        p.tag_id as partner_tag_id
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      LEFT JOIN animals p ON br.partner_id = p.id
      WHERE a.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND br.breeding_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND br.breeding_date <= ?";
      params.push(options.endDate);
    }
    
    // Hayvana göre filtreleme
    if (options.animalId) {
      query += " AND br.animal_id = ?";
      params.push(options.animalId);
    }
    
    // Doğum durumuna göre filtreleme
    if (options.birthStatus) {
      if (options.birthStatus === 'pending') {
        query += " AND br.actual_birth_date IS NULL";
      } else if (options.birthStatus === 'completed') {
        query += " AND br.actual_birth_date IS NOT NULL";
      }
    }
    
    // Sıralama
    query += " ORDER BY br.breeding_date DESC";
    
    // Kayıtları al
    const records = await db.all(query, params);
    
    return records;
  } catch (error) {
    console.error(`Üreme kayıtları (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait üreme istatistiklerini getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - İstatistik seçenekleri
 * @returns {Promise<Object>} - Üreme istatistikleri
 */
async function getBreedingStats(profileId, options = {}) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    // Toplam kayıt sayısı
    let query = `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN br.actual_birth_date IS NOT NULL THEN 1 ELSE 0 END) as completed_births,
        SUM(CASE WHEN br.actual_birth_date IS NULL THEN 1 ELSE 0 END) as pending_births,
        COUNT(DISTINCT br.animal_id) as animal_count,
        SUM(COALESCE(br.offspring_count, 0)) as total_offspring
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      WHERE a.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND br.breeding_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND br.breeding_date <= ?";
      params.push(options.endDate);
    }
    
    // Hayvana göre filtreleme
    if (options.animalId) {
      query += " AND br.animal_id = ?";
      params.push(options.animalId);
    }
    
    const stats = await db.get(query, params);
    
    // Başarılı doğum oranı
    if (stats.total_records > 0) {
      stats.success_rate = (stats.completed_births / stats.total_records) * 100;
    } else {
      stats.success_rate = 0;
    }
    
    // Ortalama yavru sayısı
    if (stats.completed_births > 0) {
      stats.average_offspring = stats.total_offspring / stats.completed_births;
    } else {
      stats.average_offspring = 0;
    }
    
    return stats;
  } catch (error) {
    console.error(`Üreme istatistikleri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Doğumu yaklaşan hayvanları getirir
 * @param {number} profileId - Profil ID
 * @param {number} daysThreshold - Kaç gün içinde doğum yapacak hayvanları getir
 * @returns {Promise<Array>} - Doğumu yaklaşan hayvanlar listesi
 */
async function getUpcomingBirths(profileId, daysThreshold = 30) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const query = `
      SELECT 
        br.*,
        a.name as animal_name,
        a.tag_id as animal_tag_id,
        a.gender as animal_gender,
        p.name as partner_name,
        p.tag_id as partner_tag_id,
        julianday(br.expected_birth_date) - julianday(?) as days_remaining
      FROM breeding_records br
      JOIN animals a ON br.animal_id = a.id
      LEFT JOIN animals p ON br.partner_id = p.id
      WHERE 
        a.profile_id = ? AND
        br.actual_birth_date IS NULL AND
        br.expected_birth_date >= ? AND
        br.expected_birth_date <= ?
      ORDER BY br.expected_birth_date ASC
    `;
    
    return await db.all(query, [today, profileId, today, futureDateStr]);
  } catch (error) {
    console.error(`Doğumu yaklaşan hayvanlar (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getBreedingRecordsByAnimal,
  getBreedingRecordById,
  createBreedingRecord,
  updateBreedingRecord,
  deleteBreedingRecord,
  getBreedingRecordsByProfile,
  getBreedingStats,
  getUpcomingBirths
}; 