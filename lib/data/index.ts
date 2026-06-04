/**
 * Shadow Reading content - Albums and Lessons
 * Data is inlined to avoid JSON import issues with ESM
 */

import type { ShadowAlbum } from '@/lib/types/shadow';

// Ancient Stories
const songDingbo = require('./lessons/soushenji-song-dingbo.json');
const wangLantian = require('./lessons/shishuoxinyu-wang-lantian.json');
const yiChongZhiChong = require('./lessons/mengxibitan-yi-chong-zhi-chong.json');

// Blessings
const blessingNewYear = require('./lessons/blessing-new-year.json');
const blessingWedding = require('./lessons/blessing-wedding.json');
const blessingBirthday = require('./lessons/blessing-birthday.json');

// Love
const loveFlirting = require('./lessons/love-flirting.json');
const loveSweetTalk = require('./lessons/love-sweet-talk.json');
const loveFightMakeup = require('./lessons/love-fight-makeup.json');
const loveCare = require('./lessons/love-care.json');

// Swear Words
const swearMild = require('./lessons/swear-mild.json');
const swearAngry = require('./lessons/swear-angry.json');
const swearHardcore = require('./lessons/swear-hardcore.json');

export const SHADOW_ALBUMS: ShadowAlbum[] = [
  // Ancient Stories
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
  // Blessings
  {
    id: 'basics-blessing',
    name: '祝福的话',
    nameEn: 'Blessings',
    icon: '🎉',
    description: '节日祝福、婚礼贺词、生日快乐',
    descriptionEn: 'Festival greetings, wedding toasts, birthday wishes',
    lessons: [blessingNewYear, blessingWedding, blessingBirthday],
  },
  // Love
  {
    id: 'basics-love',
    name: '恋人的话',
    nameEn: "Lover's Words",
    icon: '💕',
    description: '搭讪表白、热恋撒娇、吵架和好',
    descriptionEn: 'Flirting, sweet talk, fighting and making up',
    lessons: [loveFlirting, loveSweetTalk, loveCare, loveFightMakeup],
  },
  // Swear Words
  {
    id: 'basics-swear',
    name: '骂人的话',
    nameEn: 'Swear Words',
    icon: '🤬',
    description: '日常吐槽、真的生气、国骂经典',
    descriptionEn: 'Mild roasts, real anger, classic Chinese profanity',
    lessons: [swearMild, swearAngry, swearHardcore],
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
