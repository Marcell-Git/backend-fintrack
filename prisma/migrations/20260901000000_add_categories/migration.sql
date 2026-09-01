-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "emoji" VARCHAR(10) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed 8 default categories for every existing user
INSERT INTO "categories" ("user_id", "name", "emoji", "color")
SELECT u."id", d.name, d.emoji, d.color
FROM "users" u
CROSS JOIN (
    VALUES
        ('makanan', '🍜', '#FF3B30'),
        ('ngopi', '☕', '#A2845E'),
        ('kebutuhan', '📦', '#34C759'),
        ('transportasi', '🚌', '#5856D6'),
        ('langganan', '📅', '#007AFF'),
        ('belanja', '🛍️', '#FF9500'),
        ('hiburan', '🎮', '#AF52DE'),
        ('lainnya', '➕', '#8E8E93')
) AS d(name, emoji, color)
ON CONFLICT ("user_id", "name") DO NOTHING;
