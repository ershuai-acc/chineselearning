import { PrismaClient } from '@prisma/client';
import { INITIAL_GROUPS, FINAL_GROUPS, TONE_GROUPS } from '../lib/config/pinyinData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pinyin lessons...');

  // Seed Initials lessons
  for (const group of INITIAL_GROUPS) {
    const lessonId = `pinyin-initial-${group.key}`;
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {
        title: `声母 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'initial', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-initials',
      },
      create: {
        id: lessonId,
        title: `声母 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'initial', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-initials',
      },
    });
  }
  console.log(`  Seeded ${INITIAL_GROUPS.length} initial lessons`);

  // Seed Finals lessons
  for (const group of FINAL_GROUPS) {
    const lessonId = `pinyin-final-${group.key}`;
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {
        title: `韵母 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'final', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-finals',
      },
      create: {
        id: lessonId,
        title: `韵母 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'final', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-finals',
      },
    });
  }
  console.log(`  Seeded ${FINAL_GROUPS.length} final lessons`);

  // Seed Tone lessons
  for (const group of TONE_GROUPS) {
    const lessonId = `pinyin-tone-${group.key}`;
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {
        title: `音调 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'tone', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-tones',
      },
      create: {
        id: lessonId,
        title: `音调 ${group.label}`,
        content: JSON.stringify({ type: 'pinyin', groupType: 'tone', key: group.key, label: group.label, words: group.words }),
        language: 'zh',
        albumId: 'pinyin-tones',
      },
    });
  }
  console.log(`  Seeded ${TONE_GROUPS.length} tone lessons`);

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
