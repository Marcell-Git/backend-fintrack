const prisma = require("../../config/database");

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { user_id: req.user.id },
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, emoji, color } = req.body;
    const userId = req.user.id;

    const trimmed = (name || "").toString().trim();
    const emojiStr = (emoji || "").toString().trim();

    if (!trimmed) {
      return res.status(400).json({ error: "Nama kategori wajib diisi" });
    }
    if (trimmed.length > 100) {
      return res.status(400).json({ error: "Nama kategori terlalu panjang" });
    }
    if (!emojiStr) {
      return res.status(400).json({ error: "Emoji wajib diisi" });
    }
    if (emojiStr.length > 10) {
      return res.status(400).json({ error: "Emoji terlalu panjang" });
    }
    if (!color || typeof color !== "string" || !HEX_REGEX.test(color)) {
      return res.status(400).json({ error: "Warna harus format hex #RRGGBB" });
    }

    const category = await prisma.category.create({
      data: {
        user_id: userId,
        name: trimmed,
        emoji: emojiStr,
        color,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Nama kategori sudah digunakan" });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, emoji, color } = req.body;

    const category = await prisma.category.findFirst({
      where: { id: parseInt(id), user_id: userId },
    });

    if (!category) {
      return res.status(404).json({
        error: "Kategori tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    const trimmed = name === undefined ? category.name : (name || "").toString().trim();
    const emojiStr = emoji === undefined ? category.emoji : (emoji || "").toString().trim();
    const colorStr = color === undefined ? category.color : color;

    if (!trimmed || trimmed.length > 100) {
      return res.status(400).json({ error: "Nama kategori tidak valid" });
    }
    if (!emojiStr || emojiStr.length > 10) {
      return res.status(400).json({ error: "Emoji tidak valid" });
    }
    if (!colorStr || typeof colorStr !== "string" || !HEX_REGEX.test(colorStr)) {
      return res.status(400).json({ error: "Warna harus format hex #RRGGBB" });
    }

    const updated = await prisma.category.update({
      where: { id: category.id },
      data: {
        name: trimmed,
        emoji: emojiStr,
        color: colorStr,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Nama kategori sudah digunakan" });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await prisma.category.findFirst({
      where: { id: parseInt(id), user_id: userId },
    });

    if (!category) {
      return res.status(404).json({
        error: "Kategori tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    await prisma.category.delete({
      where: { id: category.id },
    });

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
