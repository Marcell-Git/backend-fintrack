const prisma = require("../../config/database");

const createPengeluaran = async (data) => {
  const { user_id, jumlah, kategori, deskripsi, tanggal } = data;
  return await prisma.pengeluaran.create({
    data: {
      user_id: parseInt(user_id),
      jumlah: parseFloat(jumlah),
      kategori,
      deskripsi,
      tanggal: new Date(tanggal),
    },
  });
};

const getPengeluaranByUserId = async (userId) => {
  return await prisma.pengeluaran.findMany({
    where: {
      user_id: parseInt(userId),
    },
  });
};

const getPengeluaranUserByMonth = async (userId, month) => {
  // Using queryRaw to maintain exact behavior of EXTRACT(MONTH FROM created_at)
  // Primsma uses tagged template literals for safe parameter replacement
  const result = await prisma.$queryRaw`
    SELECT * FROM pengeluaran 
    WHERE user_id = ${parseInt(userId)} 
    AND EXTRACT(MONTH FROM created_at) = ${parseInt(month)}
  `;
  return result;
};

module.exports = {
  createPengeluaran,
  getPengeluaranByUserId,
  getPengeluaranUserByMonth,
};
