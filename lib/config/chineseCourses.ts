/**
 * Chinese course configuration
 * Three main sections: Pinyin, Mandarin Basics, Chinese Culture
 * Pinyin has 3 albums: Initials, Finals, Tones
 */

export interface ChineseAlbum {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  coverImage?: string;
  description?: string;
}

export interface ChineseCourseGroup {
  id: string;
  title: string;
  titleEn: string;
  albums: ChineseAlbum[];
}

export const CHINESE_COURSE_GROUPS: ChineseCourseGroup[] = [
  {
    id: 'pinyin',
    title: '拼音',
    titleEn: 'Pinyin',
    albums: [
      {
        id: 'pinyin-initials',
        name: '声母学习',
        nameEn: 'Initials',
        icon: '🔤',
        description: '学习 23 个声母的发音',
      },
      {
        id: 'pinyin-finals',
        name: '韵母学习',
        nameEn: 'Finals',
        icon: '🗣️',
        description: '学习 24 个韵母的发音',
      },
      {
        id: 'pinyin-tones',
        name: '音调学习',
        nameEn: 'Tones',
        icon: '🎵',
        description: '掌握四声和轻声',
      },
    ],
  },
  {
    id: 'mandarin-basics',
    title: '普通话入门',
    titleEn: 'Mandarin Basics',
    albums: [
      {
        id: 'basics-blessing',
        name: '祝福的话',
        nameEn: 'Blessings',
        icon: '🎉',
        coverImage: '/album-covers/v2/basics-blessing.png',
        description: '节日祝福、婚礼贺词、生日快乐',
      },
      {
        id: 'basics-love',
        name: '恋人的话',
        nameEn: "Lover's Words",
        icon: '💕',
        coverImage: '/album-covers/v2/basics-love.png',
        description: '搭讪表白、热恋撒娇、吵架和好',
      },
      {
        id: 'basics-swear',
        name: '骂人的话',
        nameEn: 'Swear Words',
        icon: '🤬',
        coverImage: '/album-covers/v2/basics-swear.png',
        description: '日常吐槽、真的生气、国骂经典',
      },
    ],
  },
  {
    id: 'chinese-culture',
    title: '汉语文化',
    titleEn: 'Chinese Culture',
    albums: [
      {
        id: 'culture-festivals',
        name: '传统节日',
        nameEn: 'Festivals',
        icon: '🏮',
        description: '了解中国传统节日',
      },
      {
        id: 'culture-idioms',
        name: '成语故事',
        nameEn: 'Idioms',
        icon: '📚',
        description: '学习常用成语及其典故',
      },
    ],
  },
  {
    id: 'ancient-stories',
    title: '古代故事',
    titleEn: 'Ancient Stories',
    albums: [
      {
        id: 'ancient-soushenji',
        name: '搜神记',
        nameEn: 'In Search of the Supernatural',
        icon: '👻',
        coverImage: '/album-covers/v2/ancient-soushenji.png',
        description: '东晋志怪小说 · 影子跟读',
      },
      {
        id: 'ancient-shishuoxinyu',
        name: '世说新语',
        nameEn: 'Tales of the World',
        icon: '😂',
        coverImage: '/album-covers/v2/ancient-shishuoxinyu.png',
        description: '南朝名人轶事 · 影子跟读',
      },
      {
        id: 'ancient-mengxibitan',
        name: '梦溪笔谈',
        nameEn: 'Dream Pool Essays',
        icon: '🔬',
        coverImage: '/album-covers/v2/ancient-mengxibitan.png',
        description: '北宋科学笔记 · 影子跟读',
      },
    ],
  },
];
