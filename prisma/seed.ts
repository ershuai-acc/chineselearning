import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create albums for Chinese courses
  const albums = [
    { id: 'pinyin-initials', name: '声母学习', nameEn: 'Initials', icon: '🔤', language: 'zh', sortOrder: 1 },
    { id: 'pinyin-finals', name: '韵母学习', nameEn: 'Finals', icon: '🗣️', language: 'zh', sortOrder: 2 },
    { id: 'pinyin-tones', name: '音调学习', nameEn: 'Tones', icon: '🎵', language: 'zh', sortOrder: 3 },
    { id: 'basics-greetings', name: '日常问候', nameEn: 'Greetings', icon: '👋', language: 'zh', sortOrder: 4 },
    { id: 'basics-numbers', name: '数字与量词', nameEn: 'Numbers', icon: '🔢', language: 'zh', sortOrder: 5 },
    { id: 'basics-food', name: '吃饭点餐', nameEn: 'Food & Dining', icon: '🍜', language: 'zh', sortOrder: 6 },
    { id: 'culture-festivals', name: '传统节日', nameEn: 'Festivals', icon: '🏮', language: 'zh', sortOrder: 7 },
    { id: 'culture-idioms', name: '成语故事', nameEn: 'Idioms', icon: '📚', language: 'zh', sortOrder: 8 },
  ];

  for (const album of albums) {
    await prisma.album.upsert({
      where: { id: album.id },
      update: album,
      create: album,
    });
  }

  console.log(`Seeded ${albums.length} albums`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
