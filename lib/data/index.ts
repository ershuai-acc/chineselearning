/**
 * Ancient Stories Albums - Shadow Reading content
 * Data is inlined to avoid JSON import issues with ESM
 */

import type { ShadowAlbum } from '@/lib/types/shadow';

// Import lesson data - use require for JSON compat
const songDingbo = require('./lessons/soushenji-song-dingbo.json');
const wangLantian = require('./lessons/shishuoxinyu-wang-lantian.json');
const yiChongZhiChong = require('./lessons/mengxibitan-yi-chong-zhi-chong.json');

export const SHADOW_ALBUMS: ShadowAlbum[] = [
  {
    id: 'ancient-soushenji',
    name: '搜神记',
    nameEn: 'In Search of the Supernatural',
    icon: '👻',
    description: '东晋·干宝著，中国古代志怪小说集',
    descriptionEn: 'Supernatural tales from the 4th century',
    lessons: [songDingbo],
  },
  {
    id: 'ancient-shishuoxinyu',
    name: '世说新语',
    nameEn: 'Tales of the World',
    icon: '😂',
    description: '南朝·刘义庆编，名人轶事集',
    descriptionEn: 'Amusing anecdotes of famous figures from the 5th century',
    lessons: [wangLantian],
  },
  {
    id: 'ancient-mengxibitan',
    name: '梦溪笔谈',
    nameEn: 'Dream Pool Essays',
    icon: '🔬',
    description: '北宋·沈括著，中国古代科学笔记',
    descriptionEn: 'Science notes from the 11th century',
    lessons: [yiChongZhiChong],
  },
];

export function getAlbumById(albumId: string): ShadowAlbum | undefined {
  return SHADOW_ALBUMS.find(a => a.id === albumId);
}

export function getLessonById(lessonId: string) {
  for (const album of SHADOW_ALBUMS) {
    const lesson = album.lessons.find((l: any) => l.id === lessonId);
    if (lesson) return { lesson, album };
  }
  return undefined;
}
