const db = require('../../config/database');

const createPengeluaran = async (data) => {
  const { user_id, jumlah, kategori, deskripsi, tanggal } = data;
  const result = await db.query(
    'INSERT INTO pengeluaran (user_id, jumlah, kategori, deskripsi, tanggal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, jumlah, kategori, deskripsi, tanggal]
  );
  return result.rows[0];
};

const getPengeluaranByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM pengeluaran WHERE user_id = $1', [userId]);
  return result.rows;
};

const getPengeluaranUserByMonth = async (userId, month) => {
  const result = await db.query('SELECT * FROM pengeluaran WHERE user_id = $1 AND EXTRACT(MONTH FROM created_at) = $2', [userId, month]);
  return result.rows;
};

module.exports = {
  createPengeluaran,
  getPengeluaranByUserId,
  getPengeluaranUserByMonth,
};
