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
        id: 'basics-greetings',
        name: '日常问候',
        nameEn: 'Greetings',
        icon: '👋',
        description: '学习基本的问候和打招呼',
      },
      {
        id: 'basics-numbers',
        name: '数字与量词',
        nameEn: 'Numbers',
        icon: '🔢',
        description: '学习数字和常用量词',
      },
      {
        id: 'basics-food',
        name: '吃饭点餐',
        nameEn: 'Food & Dining',
        icon: '🍜',
        description: '餐厅点餐实用句型',
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
];
