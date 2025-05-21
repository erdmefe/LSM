/**
 * Ration Model - Rasyon kayıtları ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Profil ID'ye göre tüm rasyonları getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Rasyon listesi
 */
async function getRationsByProfile(profileId) {
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
      SELECT * FROM rations
      WHERE profile_id = ?
      ORDER BY created_at DESC
    `, [profileId]);
  } catch (error) {
    console.error(`Rasyonlar (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre rasyon getirir
 * @param {number} id - Rasyon ID
 * @returns {Promise<Object>} - Rasyon bilgileri
 */
async function getRationById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz rasyon ID',
        userMessage: 'Geçersiz rasyon ID'
      };
    }
    
    // Rasyonu getir
    const ration = await db.get(`
      SELECT * FROM rations WHERE id = ?
    `, [id]);
    
    if (!ration) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan rasyon bulunamadı`,
        userMessage: 'Rasyon bulunamadı'
      };
    }
    
    // Rasyon bileşenlerini getir
    const ingredients = await db.all(`
      SELECT * FROM ration_ingredients WHERE ration_id = ?
    `, [id]);
    
    // Rasyon ve bileşenleri birleştir
    return {
      ...ration,
      ingredients: ingredients || []
    };
  } catch (error) {
    console.error(`Rasyon (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni rasyon oluşturur
 * @param {Object} rationData - Rasyon bilgileri
 * @returns {Promise<number>} - Oluşturulan rasyonun ID'si
 */
async function createRation(rationData) {
  try {
    // Girdi doğrulama
    const { profile_id, name, animal_group, status, description, total_weight, total_cost, ingredients } = rationData;
    
    if (!profile_id || isNaN(parseInt(profile_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçerli bir profil seçmelisiniz'
      };
    }
    
    if (!name || name.trim().length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Rasyon adı gereklidir',
        userMessage: 'Lütfen bir rasyon adı girin'
      };
    }
    
    if (!animal_group || animal_group.trim().length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Hayvan grubu gereklidir',
        userMessage: 'Lütfen bir hayvan grubu seçin'
      };
    }
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'En az bir rasyon bileşeni gereklidir',
        userMessage: 'Lütfen en az bir rasyon bileşeni ekleyin'
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
    
    // Transaction başlat
    return await db.executeTransaction(async () => {
      // Rasyon ekle
      const rationResult = await db.run(
        `INSERT INTO rations (
          profile_id, name, animal_group, status, description, total_weight, 
          total_cost, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          profile_id,
          name,
          animal_group,
          status || 'Aktif',
          description || '',
          parseFloat(total_weight || 0),
          parseFloat(total_cost || 0)
        ]
      );
      
      const rationId = rationResult.lastID;
      
      // Rasyon bileşenlerini ekle
      for (const ingredient of ingredients) {
        await db.run(
          `INSERT INTO ration_ingredients (
            ration_id, name, amount, cost, protein, energy
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            rationId,
            ingredient.name,
            parseFloat(ingredient.amount || 0),
            parseFloat(ingredient.cost || 0),
            parseFloat(ingredient.protein || 0),
            parseFloat(ingredient.energy || 0)
          ]
        );
      }
      
      return rationId;
    });
  } catch (error) {
    console.error("Rasyon oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Rasyonu günceller
 * @param {Object} rationData - Rasyon bilgileri (id içermeli)
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateRation(rationData) {
  try {
    // Girdi doğrulama
    const { id, name, animal_group, status, description, total_weight, total_cost, ingredients } = rationData;
    
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz rasyon ID',
        userMessage: 'Geçersiz rasyon ID'
      };
    }
    
    // Kaydın varlığını kontrol et
    const rationExists = await db.get("SELECT id FROM rations WHERE id = ?", [id]);
    if (!rationExists) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan rasyon bulunamadı`,
        userMessage: 'Güncellenecek rasyon bulunamadı'
      };
    }
    
    if (!name || name.trim().length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Rasyon adı gereklidir',
        userMessage: 'Lütfen bir rasyon adı girin'
      };
    }
    
    if (!animal_group || animal_group.trim().length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Hayvan grubu gereklidir',
        userMessage: 'Lütfen bir hayvan grubu seçin'
      };
    }
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'En az bir rasyon bileşeni gereklidir',
        userMessage: 'Lütfen en az bir rasyon bileşeni ekleyin'
      };
    }
    
    // Transaction başlat
    return await db.executeTransaction(async () => {
      // Rasyonu güncelle
      const result = await db.run(
        `UPDATE rations SET 
          name = ?, animal_group = ?, status = ?, description = ?, 
          total_weight = ?, total_cost = ?, updated_at = datetime('now')
        WHERE id = ?`,
        [
          name,
          animal_group,
          status || 'Aktif',
          description || '',
          parseFloat(total_weight || 0),
          parseFloat(total_cost || 0),
          id
        ]
      );
      
      // Eski bileşenleri sil
      await db.run("DELETE FROM ration_ingredients WHERE ration_id = ?", [id]);
      
      // Yeni bileşenleri ekle
      for (const ingredient of ingredients) {
        await db.run(
          `INSERT INTO ration_ingredients (
            ration_id, name, amount, cost, protein, energy
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            ingredient.name,
            parseFloat(ingredient.amount || 0),
            parseFloat(ingredient.cost || 0),
            parseFloat(ingredient.protein || 0),
            parseFloat(ingredient.energy || 0)
          ]
        );
      }
      
      return result.changes > 0;
    });
  } catch (error) {
    console.error(`Rasyon (ID: ${rationData.id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * Rasyonu siler
 * @param {number} id - Rasyon ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteRation(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz rasyon ID',
        userMessage: 'Geçersiz rasyon ID'
      };
    }
    
    return await db.executeTransaction(async () => {
      // Önce bileşenleri sil
      await db.run("DELETE FROM ration_ingredients WHERE ration_id = ?", [id]);
      
      // Rasyonu sil
      const result = await db.run("DELETE FROM rations WHERE id = ?", [id]);
      
      if (result.changes === 0) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${id} olan rasyon bulunamadı`,
          userMessage: 'Silinecek rasyon bulunamadı'
        };
      }
      
      return true;
    });
  } catch (error) {
    console.error(`Rasyon (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Rasyon istatistiklerini getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Object>} - Rasyon istatistikleri
 */
async function getRationStats(profileId) {
  try {
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    // Toplam rasyon sayısı
    const totalCount = await db.get(
      "SELECT COUNT(*) as count FROM rations WHERE profile_id = ?", 
      [profileId]
    );
    
    // Aktif rasyon sayısı 
    const activeCount = await db.get(
      "SELECT COUNT(*) as count FROM rations WHERE profile_id = ? AND status = 'Aktif'", 
      [profileId]
    );
    
    // Hayvan grubu dağılımı
    const animalGroupDistribution = await db.all(
      `SELECT animal_group, COUNT(*) as count 
      FROM rations 
      WHERE profile_id = ? AND status = 'Aktif'
      GROUP BY animal_group
      ORDER BY count DESC`,
      [profileId]
    );
    
    return {
      totalCount: totalCount.count,
      activeCount: activeCount.count,
      animalGroupDistribution
    };
  } catch (error) {
    console.error(`Rasyon istatistikleri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getRationsByProfile,
  getRationById,
  createRation,
  updateRation,
  deleteRation,
  getRationStats
}; 