const pengeluaranModel = require('./pengeluaranModel');

const createPengeluaran = async (req, res) => {
  try {
    const newPengeluaran = await pengeluaranModel.createPengeluaran(req.body);
    res.status(201).json(newPengeluaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPengeluaranByUser = async (req, res) => {
  try {
    const pengeluaran = await pengeluaranModel.getPengeluaranByUserId(req.params.userId);
    res.json(pengeluaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPengeluaranUserByMonth = async (req, res) => {
  try {
    const pengeluaran = await pengeluaranModel.getPengeluaranUserByMonth(req.params.userId, req.params.month);
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
