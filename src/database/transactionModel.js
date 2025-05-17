/**
 * Transaction Model - Mali işlemler ile ilgili veritabanı işlemleri
 */
const db = require('./database');

/**
 * Belirli bir profile ait tüm işlemleri getirir
 * @param {number} profileId - Profil ID
 * @param {Object} options - Filtreleme seçenekleri
 * @returns {Promise<Array>} - İşlem listesi
 */
async function getTransactionsByProfile(profileId, options = {}) {
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
      SELECT t.*, 
             CASE 
               WHEN t.type = 'income' THEN ic.name 
               WHEN t.type = 'expense' THEN ec.name 
               ELSE NULL 
             END as category_name,
             a.name as animal_name, a.tag_id
      FROM transactions t
      LEFT JOIN income_categories ic ON t.type = 'income' AND t.category_id = ic.id
      LEFT JOIN expense_categories ec ON t.type = 'expense' AND t.category_id = ec.id
      LEFT JOIN animals a ON t.related_animal_id = a.id
      WHERE t.profile_id = ?
    `;
    
    const params = [profileId];
    
    // Tarihe göre filtreleme
    if (options.startDate) {
      query += " AND t.transaction_date >= ?";
      params.push(options.startDate);
    }
    
    if (options.endDate) {
      query += " AND t.transaction_date <= ?";
      params.push(options.endDate);
    }
    
    // İşlem tipine göre filtreleme
    if (options.type) {
      query += " AND t.type = ?";
      params.push(options.type);
    }
    
    // Kategoriye göre filtreleme
    if (options.categoryId) {
      query += " AND t.category_id = ?";
      params.push(options.categoryId);
    }
    
    // Hayvana göre filtreleme
    if (options.animalId) {
      query += " AND t.related_animal_id = ?";
      params.push(options.animalId);
    }
    
    // Sıralama
    query += " ORDER BY t.transaction_date DESC";
    
    return await db.all(query, params);
  } catch (error) {
    console.error(`İşlemler (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * ID'ye göre işlem getirir
 * @param {number} id - İşlem ID
 * @returns {Promise<Object>} - İşlem bilgileri
 */
async function getTransactionById(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz işlem ID',
        userMessage: 'Geçersiz işlem ID'
      };
    }
    
    const transaction = await db.get(`
      SELECT t.*, 
             CASE 
               WHEN t.type = 'income' THEN ic.name 
               WHEN t.type = 'expense' THEN ec.name 
               ELSE NULL 
             END as category_name,
             a.name as animal_name, a.tag_id
      FROM transactions t
      LEFT JOIN income_categories ic ON t.type = 'income' AND t.category_id = ic.id
      LEFT JOIN expense_categories ec ON t.type = 'expense' AND t.category_id = ec.id
      LEFT JOIN animals a ON t.related_animal_id = a.id
      WHERE t.id = ?
    `, [id]);
    
    if (!transaction) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan işlem bulunamadı`,
        userMessage: 'İşlem bulunamadı'
      };
    }
    
    return transaction;
  } catch (error) {
    console.error(`İşlem (ID: ${id}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Yeni işlem oluşturur
 * @param {Object} transactionData - İşlem bilgileri
 * @returns {Promise<number>} - Oluşturulan işlemin ID'si
 */
async function createTransaction(transactionData) {
  try {
    // Girdi doğrulama
    const { profile_id, transaction_date, type, category_id, amount, description, related_animal_id } = transactionData;
    
    if (!profile_id || isNaN(parseInt(profile_id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçerli bir profil seçmelisiniz'
      };
    }
    
    if (!transaction_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'İşlem tarihi gereklidir',
        userMessage: 'Lütfen bir işlem tarihi girin'
      };
    }
    
    if (!type || (type !== 'income' && type !== 'expense')) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz işlem tipi',
        userMessage: 'Geçerli bir işlem tipi seçmelisiniz (gelir veya gider)'
      };
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz tutar',
        userMessage: 'Lütfen geçerli bir tutar girin'
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
    
    // Kategori ID'si varsa kontrol et
    if (category_id) {
      let categoryExists;
      if (type === 'income') {
        categoryExists = await db.get("SELECT id FROM income_categories WHERE id = ?", [category_id]);
      } else {
        categoryExists = await db.get("SELECT id FROM expense_categories WHERE id = ?", [category_id]);
      }
      
      if (!categoryExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${category_id} olan kategori bulunamadı`,
          userMessage: 'Seçilen kategori bulunamadı'
        };
      }
    }
    
    // Hayvan ID'si varsa kontrol et
    if (related_animal_id) {
      const animalExists = await db.get("SELECT id FROM animals WHERE id = ?", [related_animal_id]);
      if (!animalExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${related_animal_id} olan hayvan bulunamadı`,
          userMessage: 'Seçilen hayvan bulunamadı'
        };
      }
    }
    
    const result = await db.run(
      `INSERT INTO transactions (
        profile_id, transaction_date, type, category_id, amount, description, related_animal_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        profile_id,
        transaction_date,
        type,
        category_id || null,
        parseFloat(amount),
        description || null,
        related_animal_id || null
      ]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("İşlem oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * İşlemi günceller
 * @param {number} id - İşlem ID
 * @param {Object} transactionData - İşlem bilgileri
 * @returns {Promise<boolean>} - Güncelleme başarılı mı?
 */
async function updateTransaction(id, transactionData) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz işlem ID',
        userMessage: 'Geçersiz işlem ID'
      };
    }
    
    // İşlem varlığını kontrol et
    const transaction = await db.get("SELECT * FROM transactions WHERE id = ?", [id]);
    if (!transaction) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan işlem bulunamadı`,
        userMessage: 'Güncellenecek işlem bulunamadı'
      };
    }
    
    const { 
      transaction_date, 
      type, 
      category_id, 
      amount, 
      description, 
      related_animal_id 
    } = transactionData;
    
    if (!transaction_date) {
      throw {
        code: 'INVALID_INPUT',
        message: 'İşlem tarihi gereklidir',
        userMessage: 'Lütfen bir işlem tarihi girin'
      };
    }
    
    if (!type || (type !== 'income' && type !== 'expense')) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz işlem tipi',
        userMessage: 'Geçerli bir işlem tipi seçmelisiniz (gelir veya gider)'
      };
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz tutar',
        userMessage: 'Lütfen geçerli bir tutar girin'
      };
    }
    
    // Kategori ID'si varsa kontrol et
    if (category_id) {
      let categoryExists;
      if (type === 'income') {
        categoryExists = await db.get("SELECT id FROM income_categories WHERE id = ?", [category_id]);
      } else {
        categoryExists = await db.get("SELECT id FROM expense_categories WHERE id = ?", [category_id]);
      }
      
      if (!categoryExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${category_id} olan kategori bulunamadı`,
          userMessage: 'Seçilen kategori bulunamadı'
        };
      }
    }
    
    // Hayvan ID'si varsa kontrol et
    if (related_animal_id) {
      const animalExists = await db.get("SELECT id FROM animals WHERE id = ?", [related_animal_id]);
      if (!animalExists) {
        throw {
          code: 'NOT_FOUND',
          message: `ID: ${related_animal_id} olan hayvan bulunamadı`,
          userMessage: 'Seçilen hayvan bulunamadı'
        };
      }
    }
    
    const result = await db.run(
      `UPDATE transactions SET 
        transaction_date = ?, type = ?, category_id = ?, 
        amount = ?, description = ?, related_animal_id = ?
      WHERE id = ?`,
      [
        transaction_date,
        type,
        category_id || null,
        parseFloat(amount),
        description || null,
        related_animal_id || null,
        id
      ]
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error(`İşlem (ID: ${id}) güncellenirken hata:`, error);
    throw error;
  }
}

/**
 * İşlemi siler
 * @param {number} id - İşlem ID
 * @returns {Promise<boolean>} - Silme başarılı mı?
 */
async function deleteTransaction(id) {
  try {
    // Girdi doğrulama
    if (!id || isNaN(parseInt(id))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz işlem ID',
        userMessage: 'Geçersiz işlem ID'
      };
    }
    
    // İşlem varlığını kontrol et
    const transaction = await db.get("SELECT * FROM transactions WHERE id = ?", [id]);
    if (!transaction) {
      throw {
        code: 'NOT_FOUND',
        message: `ID: ${id} olan işlem bulunamadı`,
        userMessage: 'Silinecek işlem bulunamadı'
      };
    }
    
    const result = await db.run("DELETE FROM transactions WHERE id = ?", [id]);
    
    return result.changes > 0;
  } catch (error) {
    console.error(`İşlem (ID: ${id}) silinirken hata:`, error);
    throw error;
  }
}

/**
 * Gelir kategorisi oluşturur
 * @param {number} profileId - Profil ID
 * @param {string} name - Kategori adı
 * @param {string} description - Kategori açıklaması
 * @returns {Promise<number>} - Oluşturulan kategorinin ID'si
 */
async function createIncomeCategory(profileId, name, description = "") {
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
        message: 'Kategori adı gereklidir',
        userMessage: 'Lütfen geçerli bir kategori adı girin'
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
      "INSERT INTO income_categories (profile_id, name, description) VALUES (?, ?, ?)",
      [profileId, name.trim(), description ? description.trim() : ""]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Gelir kategorisi oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Gider kategorisi oluşturur
 * @param {number} profileId - Profil ID
 * @param {string} name - Kategori adı
 * @param {string} description - Kategori açıklaması
 * @returns {Promise<number>} - Oluşturulan kategorinin ID'si
 */
async function createExpenseCategory(profileId, name, description = "") {
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
        message: 'Kategori adı gereklidir',
        userMessage: 'Lütfen geçerli bir kategori adı girin'
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
      "INSERT INTO expense_categories (profile_id, name, description) VALUES (?, ?, ?)",
      [profileId, name.trim(), description ? description.trim() : ""]
    );
    
    return result.lastID;
  } catch (error) {
    console.error("Gider kategorisi oluşturulurken hata:", error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm gelir kategorilerini getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Gelir kategorileri listesi
 */
async function getIncomeCategoriesByProfile(profileId) {
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
      "SELECT * FROM income_categories WHERE profile_id = ? ORDER BY name",
      [profileId]
    );
  } catch (error) {
    console.error(`Gelir kategorileri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Belirli bir profile ait tüm gider kategorilerini getirir
 * @param {number} profileId - Profil ID
 * @returns {Promise<Array>} - Gider kategorileri listesi
 */
async function getExpenseCategoriesByProfile(profileId) {
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
      "SELECT * FROM expense_categories WHERE profile_id = ? ORDER BY name",
      [profileId]
    );
  } catch (error) {
    console.error(`Gider kategorileri (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

/**
 * Mali özet raporu oluşturur
 * @param {number} profileId - Profil ID
 * @param {string} startDate - Başlangıç tarihi (YYYY-MM-DD)
 * @param {string} endDate - Bitiş tarihi (YYYY-MM-DD)
 * @returns {Promise<Object>} - Mali özet raporu
 */
async function getFinancialSummary(profileId, startDate, endDate) {
  try {
    // Girdi doğrulama
    if (!profileId || isNaN(parseInt(profileId))) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Geçersiz profil ID',
        userMessage: 'Geçersiz profil ID'
      };
    }
    
    // Tarihler için filtreleme koşulları
    const dateFilter = startDate && endDate 
      ? "AND transaction_date BETWEEN ? AND ?" 
      : (startDate 
          ? "AND transaction_date >= ?" 
          : (endDate 
              ? "AND transaction_date <= ?" 
              : ""));
    
    // Parametreler
    let incomeParams = [profileId];
    let expenseParams = [profileId];
    
    if (startDate && endDate) {
      incomeParams.push(startDate, endDate);
      expenseParams.push(startDate, endDate);
    } else if (startDate) {
      incomeParams.push(startDate);
      expenseParams.push(startDate);
    } else if (endDate) {
      incomeParams.push(endDate);
      expenseParams.push(endDate);
    }
    
    // Toplam gelir
    const incomeResult = await db.get(`
      SELECT SUM(amount) as total 
      FROM transactions 
      WHERE profile_id = ? AND type = 'income' ${dateFilter}
    `, incomeParams);
    
    // Toplam gider
    const expenseResult = await db.get(`
      SELECT SUM(amount) as total 
      FROM transactions 
      WHERE profile_id = ? AND type = 'expense' ${dateFilter}
    `, expenseParams);
    
    // Kategori bazında gelirler
    const incomeByCategory = await db.all(`
      SELECT c.name as category, SUM(t.amount) as total 
      FROM transactions t
      LEFT JOIN income_categories c ON t.category_id = c.id
      WHERE t.profile_id = ? AND t.type = 'income' ${dateFilter}
      GROUP BY t.category_id
      ORDER BY total DESC
    `, incomeParams);
    
    // Kategori bazında giderler
    const expenseByCategory = await db.all(`
      SELECT c.name as category, SUM(t.amount) as total 
      FROM transactions t
      LEFT JOIN expense_categories c ON t.category_id = c.id
      WHERE t.profile_id = ? AND t.type = 'expense' ${dateFilter}
      GROUP BY t.category_id
      ORDER BY total DESC
    `, expenseParams);
    
    // Hayvan bazında giderler
    const expenseByAnimal = await db.all(`
      SELECT a.name as animal, a.tag_id, SUM(t.amount) as total 
      FROM transactions t
      JOIN animals a ON t.related_animal_id = a.id
      WHERE t.profile_id = ? AND t.type = 'expense' ${dateFilter} AND t.related_animal_id IS NOT NULL
      GROUP BY t.related_animal_id
      ORDER BY total DESC
    `, expenseParams);
    
    return {
      totalIncome: incomeResult.total || 0,
      totalExpense: expenseResult.total || 0,
      balance: (incomeResult.total || 0) - (expenseResult.total || 0),
      incomeByCategory,
      expenseByCategory,
      expenseByAnimal
    };
  } catch (error) {
    console.error(`Mali özet (Profil ID: ${profileId}) alınırken hata:`, error);
    throw error;
  }
}

module.exports = {
  getTransactionsByProfile,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createIncomeCategory,
  createExpenseCategory,
  getIncomeCategoriesByProfile,
  getExpenseCategoriesByProfile,
  getFinancialSummary
}; 