/**
 * Feed Ingredient Types Model - Yem malzemesi türleri ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Yeni bir yem malzemesi türü oluşturur
 * @param {Object} ingredientTypeData - Malzeme türü bilgileri
 * @returns {Promise<Object>} - Oluşturulan malzeme türünün ID'si ve başarı durumu
 */
async function createFeedIngredientType(ingredientTypeData) {
  try {
    const { profile_id, name, default_cost, default_protein, default_energy, notes } = ingredientTypeData;

    if (!profile_id || isNaN(parseInt(profile_id))) {
      throw { userMessage: 'Geçerli bir profil seçmelisiniz.' };
    }
    if (!name || name.trim().length === 0) {
      throw { userMessage: 'Lütfen bir malzeme adı girin.' };
    }

    const result = await db.run(
      `INSERT INTO feed_ingredient_types (profile_id, name, default_cost, default_protein, default_energy, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        profile_id,
        name.trim(),
        parseFloat(default_cost || 0),
        parseFloat(default_protein || 0),
        parseFloat(default_energy || 0),
        notes || ''
      ]
    );
    return { success: true, id: result.lastID };
  } catch (error) {
    console.error('Yem malzemesi türü oluşturulurken hata:', error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: feed_ingredient_types.profile_id, feed_ingredient_types.name')) {
      throw { userMessage: 'Bu isimde bir yem malzemesi türü zaten mevcut.' };
    }
    throw { userMessage: error.userMessage || 'Yem malzemesi türü oluşturulurken bir hata oluştu.' };
  }
}

/**
 * Profil ID'ye göre tüm yem malzemesi türlerini getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Yem malzemesi türleri listesi
 */
async function getFeedIngredientTypesByProfile(profileId) {
  try {
    if (!profileId || isNaN(parseInt(profileId))) {
      throw { userMessage: 'Geçersiz profil ID.' };
    }
    return await db.all(
      'SELECT * FROM feed_ingredient_types WHERE profile_id = ? ORDER BY name ASC',
      [profileId]
    );
  } catch (error) {
    console.error(`Yem malzemesi türleri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw { userMessage: error.userMessage || 'Yem malzemesi türleri alınırken bir hata oluştu.' };
  }
}

/**
 * ID'ye göre yem malzemesi türünü getirir
 * @param {number} id - Malzeme türü ID
 * @returns {Promise<Object>} - Malzeme türü bilgisi
 */
async function getFeedIngredientTypeById(id) {
  try {
    if (!id || isNaN(parseInt(id))) {
      throw { userMessage: 'Geçersiz malzeme türü ID.' };
    }
    const type = await db.get('SELECT * FROM feed_ingredient_types WHERE id = ?', [id]);
    if (!type) {
      throw { userMessage: 'Yem malzemesi türü bulunamadı.' };
    }
    return type;
  } catch (error) {
    console.error(`Yem malzemesi türü (ID: ${id}) alınırken hata:`, error);
    throw { userMessage: error.userMessage || 'Yem malzemesi türü alınırken bir hata oluştu.' };
  }
}

/**
 * Yem malzemesi türünü günceller
 * @param {Object} ingredientTypeData - Güncellenecek malzeme türü bilgileri (id içermeli)
 * @returns {Promise<Object>} - Başarı durumu
 */
async function updateFeedIngredientType(ingredientTypeData) {
  try {
    const { id, name, default_cost, default_protein, default_energy, notes } = ingredientTypeData;

    if (!id || isNaN(parseInt(id))) {
      throw { userMessage: 'Geçersiz malzeme türü ID.' };
    }
    if (!name || name.trim().length === 0) {
      throw { userMessage: 'Lütfen bir malzeme adı girin.' };
    }

    const result = await db.run(
      `UPDATE feed_ingredient_types 
       SET name = ?, default_cost = ?, default_protein = ?, default_energy = ?, notes = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        name.trim(),
        parseFloat(default_cost || 0),
        parseFloat(default_protein || 0),
        parseFloat(default_energy || 0),
        notes || '',
        id
      ]
    );
    if (result.changes === 0) {
      throw { userMessage: 'Güncellenecek yem malzemesi türü bulunamadı veya veri değişmedi.' };
    }
    return { success: true };
  } catch (error) {
    console.error('Yem malzemesi türü güncellenirken hata:', error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: feed_ingredient_types.profile_id, feed_ingredient_types.name')) {
      // Bu hatayı yakalamak için profile_id'ye de ihtiyacımız var, şimdilik genel bir mesaj veriyoruz.
      // Daha iyi bir çözüm için, güncelleme sırasında mevcut profile_id'yi alıp kontrol etmek gerekebilir.
      throw { userMessage: 'Bu isimde başka bir yem malzemesi türü zaten mevcut olabilir.' };
    }
    throw { userMessage: error.userMessage || 'Yem malzemesi türü güncellenirken bir hata oluştu.' };
  }
}

/**
 * Yem malzemesi türünü siler
 * @param {number} id - Silinecek malzeme türü ID
 * @returns {Promise<Object>} - Başarı durumu
 */
async function deleteFeedIngredientType(id) {
  try {
    if (!id || isNaN(parseInt(id))) {
      throw { userMessage: 'Geçersiz malzeme türü ID.' };
    }
    const result = await db.run('DELETE FROM feed_ingredient_types WHERE id = ?', [id]);
    if (result.changes === 0) {
      throw { userMessage: 'Silinecek yem malzemesi türü bulunamadı.' };
    }
    return { success: true };
  } catch (error) {
    console.error(`Yem malzemesi türü (ID: ${id}) silinirken hata:`, error);
    throw { userMessage: error.userMessage || 'Yem malzemesi türü silinirken bir hata oluştu.' };
  }
}

module.exports = {
  createFeedIngredientType,
  getFeedIngredientTypesByProfile,
  getFeedIngredientTypeById,
  updateFeedIngredientType,
  deleteFeedIngredientType,
}; 