/**
 * Generate anonymous user code names and IDs
 * Stored in localStorage, persists across sessions
 */

const CODE_PREFIXES = [
  '勇敢的', '可爱的', '聪明的', '快乐的', '神秘的', '酷酷的',
  '温柔的', '活泼的', '安静的', '好奇的',
];

const CODE_ANIMALS = [
  '熊猫', '小猫', '老虎', '兔子', '海豚', '企鹅',
  '狮子', '狐狸', '大象', '小鹿', '鲸鱼', '考拉',
];

function generateCodeName(): string {
  const prefix = CODE_PREFIXES[Math.floor(Math.random() * CODE_PREFIXES.length)];
  const animal = CODE_ANIMALS[Math.floor(Math.random() * CODE_ANIMALS.length)];
  return `${prefix}${animal}`;
}

function generateUserId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAnonymousUser(): { userId: string; codeName: string } {
  if (typeof window === 'undefined') {
    return { userId: 'server', codeName: 'Server' };
  }

  let userId = localStorage.getItem('piebox-user-id');
  let codeName = localStorage.getItem('piebox-code-name');

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('piebox-user-id', userId);
  }

  if (!codeName) {
    codeName = generateCodeName();
    localStorage.setItem('piebox-code-name', codeName);
  }

  return { userId, codeName };
}
