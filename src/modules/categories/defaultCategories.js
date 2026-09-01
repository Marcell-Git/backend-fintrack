const DEFAULT_CATEGORIES = [
  { name: "makanan", emoji: "🍜", color: "#FF3B30" },
  { name: "ngopi", emoji: "☕", color: "#A2845E" },
  { name: "kebutuhan", emoji: "📦", color: "#34C759" },
  { name: "transportasi", emoji: "🚌", color: "#5856D6" },
  { name: "langganan", emoji: "📅", color: "#007AFF" },
  { name: "belanja", emoji: "🛍️", color: "#FF9500" },
  { name: "hiburan", emoji: "🎮", color: "#AF52DE" },
  { name: "lainnya", emoji: "➕", color: "#8E8E93" },
];

const seedDefaultCategories = async (userId, prisma) => {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ user_id: userId, ...c })),
    skipDuplicates: true,
  });
};

module.exports = { DEFAULT_CATEGORIES, seedDefaultCategories };
