const prisma = require('../../config/database');

const createPengeluaran = async (req, res) => {
  try {
    const { jumlah, kategori, deskripsi, tanggal } = req.body;
    const userId = req.user.id;

    const newPengeluaran = await prisma.pengeluaran.create({
      data: {
        user_id: userId,
        jumlah: parseFloat(jumlah),
        kategori,
        deskripsi,
        tanggal: new Date(tanggal),
      },
    });
    res.status(201).json(newPengeluaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPengeluaranByUser = async (req, res) => {  
  try {
    const userId = req.user.id;
    const pengeluaran = await prisma.pengeluaran.findMany({ 
      where: { 
        user_id: userId 
      },
      orderBy: {
        tanggal: 'desc'
      }
    });
    res.json(pengeluaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPengeluaranUserByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    // Calculate start and end of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const pengeluaran = await prisma.pengeluaran.findMany({
      where: {
        user_id: userId,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        tanggal: 'desc'
      }
    });
    res.json(pengeluaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPengeluaran,
  getPengeluaranByUser,
  getPengeluaranUserByMonth,
};
