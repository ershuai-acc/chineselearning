/**
 * Pinyin learning data - Initials, Finals, Tones
 * Each group has words with characters, pinyin, english translations
 */

export interface PinyinChar {
  char: string;
  pinyin: string;
}

export interface PinyinWord {
  chinese: string;
  chars: PinyinChar[];
  english: string;
  tone: number;
}

export interface PinyinGroup {
  type: 'initial' | 'final' | 'tone';
  key: string;
  label: string;
  words: PinyinWord[];
}

export const TONE_GROUPS: PinyinGroup[] = [
  {
    type: 'tone', key: 'tone1', label: '1st ˉ',
    words: [
      { chinese: '咖啡', chars: [{ char: '咖', pinyin: 'kā' }, { char: '啡', pinyin: 'fēi' }], english: 'coffee', tone: 1 },
      { chinese: '飞机', chars: [{ char: '飞', pinyin: 'fēi' }, { char: '机', pinyin: 'jī' }], english: 'airplane', tone: 1 },
      { chinese: '天空', chars: [{ char: '天', pinyin: 'tiān' }, { char: '空', pinyin: 'kōng' }], english: 'sky', tone: 1 },
      { chinese: '中国', chars: [{ char: '中', pinyin: 'zhōng' }, { char: '国', pinyin: 'guó' }], english: 'China', tone: 1 },
    ],
  },
  {
    type: 'tone', key: 'tone2', label: '2nd ˊ',
    words: [
      { chinese: '朋友', chars: [{ char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'yǒu' }], english: 'friend', tone: 2 },
      { chinese: '银行', chars: [{ char: '银', pinyin: 'yín' }, { char: '行', pinyin: 'háng' }], english: 'bank', tone: 2 },
      { chinese: '人民', chars: [{ char: '人', pinyin: 'rén' }, { char: '民', pinyin: 'mín' }], english: 'people', tone: 2 },
      { chinese: '学习', chars: [{ char: '学', pinyin: 'xué' }, { char: '习', pinyin: 'xí' }], english: 'study', tone: 2 },
    ],
  },
  {
    type: 'tone', key: 'tone3', label: '3rd ˇ',
    words: [
      { chinese: '你好', chars: [{ char: '你', pinyin: 'nǐ' }, { char: '好', pinyin: 'hǎo' }], english: 'hello', tone: 3 },
      { chinese: '水果', chars: [{ char: '水', pinyin: 'shuǐ' }, { char: '果', pinyin: 'guǒ' }], english: 'fruit', tone: 3 },
      { chinese: '旅行', chars: [{ char: '旅', pinyin: 'lǚ' }, { char: '行', pinyin: 'xíng' }], english: 'travel', tone: 3 },
      { chinese: '老板', chars: [{ char: '老', pinyin: 'lǎo' }, { char: '板', pinyin: 'bǎn' }], english: 'boss', tone: 3 },
    ],
  },
  {
    type: 'tone', key: 'tone4', label: '4th ˋ',
    words: [
      { chinese: '电话', chars: [{ char: '电', pinyin: 'diàn' }, { char: '话', pinyin: 'huà' }], english: 'phone', tone: 4 },
      { chinese: '再见', chars: [{ char: '再', pinyin: 'zài' }, { char: '见', pinyin: 'jiàn' }], english: 'goodbye', tone: 4 },
      { chinese: '快乐', chars: [{ char: '快', pinyin: 'kuài' }, { char: '乐', pinyin: 'lè' }], english: 'happy', tone: 4 },
      { chinese: '大概', chars: [{ char: '大', pinyin: 'dà' }, { char: '概', pinyin: 'gài' }], english: 'probably', tone: 4 },
    ],
  },
  {
    type: 'tone', key: 'tone0', label: '· 轻声',
    words: [
      { chinese: '妈妈', chars: [{ char: '妈', pinyin: 'mā' }, { char: '妈', pinyin: 'ma' }], english: 'mom', tone: 0 },
      { chinese: '爸爸', chars: [{ char: '爸', pinyin: 'bà' }, { char: '爸', pinyin: 'ba' }], english: 'dad', tone: 0 },
      { chinese: '东西', chars: [{ char: '东', pinyin: 'dōng' }, { char: '西', pinyin: 'xi' }], english: 'thing', tone: 0 },
      { chinese: '朋友', chars: [{ char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'you' }], english: 'friend', tone: 0 },
    ],
  },
];

export const INITIAL_GROUPS: PinyinGroup[] = [
  { type: 'initial', key: 'b', label: 'b', words: [
    { chinese: '爸爸', chars: [{ char: '爸', pinyin: 'bà' }, { char: '爸', pinyin: 'ba' }], english: 'dad', tone: 4 },
    { chinese: '北京', chars: [{ char: '北', pinyin: 'běi' }, { char: '京', pinyin: 'jīng' }], english: 'Beijing', tone: 3 },
    { chinese: '帮忙', chars: [{ char: '帮', pinyin: 'bāng' }, { char: '忙', pinyin: 'máng' }], english: 'help', tone: 1 },
  ]},
  { type: 'initial', key: 'p', label: 'p', words: [
    { chinese: '朋友', chars: [{ char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'yǒu' }], english: 'friend', tone: 2 },
    { chinese: '苹果', chars: [{ char: '苹', pinyin: 'píng' }, { char: '果', pinyin: 'guǒ' }], english: 'apple', tone: 2 },
    { chinese: '跑步', chars: [{ char: '跑', pinyin: 'pǎo' }, { char: '步', pinyin: 'bù' }], english: 'run', tone: 3 },
  ]},
  { type: 'initial', key: 'm', label: 'm', words: [
    { chinese: '妈妈', chars: [{ char: '妈', pinyin: 'mā' }, { char: '妈', pinyin: 'ma' }], english: 'mom', tone: 1 },
    { chinese: '美国', chars: [{ char: '美', pinyin: 'měi' }, { char: '国', pinyin: 'guó' }], english: 'USA', tone: 3 },
    { chinese: '猫咪', chars: [{ char: '猫', pinyin: 'māo' }, { char: '咪', pinyin: 'mī' }], english: 'cat', tone: 1 },
  ]},
  { type: 'initial', key: 'f', label: 'f', words: [
    { chinese: '飞机', chars: [{ char: '飞', pinyin: 'fēi' }, { char: '机', pinyin: 'jī' }], english: 'airplane', tone: 1 },
    { chinese: '方便', chars: [{ char: '方', pinyin: 'fāng' }, { char: '便', pinyin: 'biàn' }], english: 'convenient', tone: 1 },
    { chinese: '饭店', chars: [{ char: '饭', pinyin: 'fàn' }, { char: '店', pinyin: 'diàn' }], english: 'restaurant', tone: 4 },
  ]},
  { type: 'initial', key: 'd', label: 'd', words: [
    { chinese: '电话', chars: [{ char: '电', pinyin: 'diàn' }, { char: '话', pinyin: 'huà' }], english: 'telephone', tone: 4 },
    { chinese: '大家', chars: [{ char: '大', pinyin: 'dà' }, { char: '家', pinyin: 'jiā' }], english: 'everyone', tone: 4 },
    { chinese: '东西', chars: [{ char: '东', pinyin: 'dōng' }, { char: '西', pinyin: 'xī' }], english: 'thing', tone: 1 },
  ]},
  { type: 'initial', key: 't', label: 't', words: [
    { chinese: '天气', chars: [{ char: '天', pinyin: 'tiān' }, { char: '气', pinyin: 'qì' }], english: 'weather', tone: 1 },
    { chinese: '同学', chars: [{ char: '同', pinyin: 'tóng' }, { char: '学', pinyin: 'xué' }], english: 'classmate', tone: 2 },
    { chinese: '太阳', chars: [{ char: '太', pinyin: 'tài' }, { char: '阳', pinyin: 'yáng' }], english: 'sun', tone: 4 },
  ]},
  { type: 'initial', key: 'n', label: 'n', words: [
    { chinese: '你好', chars: [{ char: '你', pinyin: 'nǐ' }, { char: '好', pinyin: 'hǎo' }], english: 'hello', tone: 3 },
    { chinese: '女孩', chars: [{ char: '女', pinyin: 'nǚ' }, { char: '孩', pinyin: 'hái' }], english: 'girl', tone: 3 },
    { chinese: '牛奶', chars: [{ char: '牛', pinyin: 'niú' }, { char: '奶', pinyin: 'nǎi' }], english: 'milk', tone: 2 },
  ]},
  { type: 'initial', key: 'l', label: 'l', words: [
    { chinese: '老师', chars: [{ char: '老', pinyin: 'lǎo' }, { char: '师', pinyin: 'shī' }], english: 'teacher', tone: 3 },
    { chinese: '旅行', chars: [{ char: '旅', pinyin: 'lǚ' }, { char: '行', pinyin: 'xíng' }], english: 'travel', tone: 3 },
    { chinese: '冷水', chars: [{ char: '冷', pinyin: 'lěng' }, { char: '水', pinyin: 'shuǐ' }], english: 'cold water', tone: 3 },
  ]},
  { type: 'initial', key: 'g', label: 'g', words: [
    { chinese: '工作', chars: [{ char: '工', pinyin: 'gōng' }, { char: '作', pinyin: 'zuò' }], english: 'work', tone: 1 },
    { chinese: '国家', chars: [{ char: '国', pinyin: 'guó' }, { char: '家', pinyin: 'jiā' }], english: 'country', tone: 2 },
    { chinese: '高兴', chars: [{ char: '高', pinyin: 'gāo' }, { char: '兴', pinyin: 'xìng' }], english: 'happy', tone: 1 },
  ]},
  { type: 'initial', key: 'k', label: 'k', words: [
    { chinese: '开始', chars: [{ char: '开', pinyin: 'kāi' }, { char: '始', pinyin: 'shǐ' }], english: 'start', tone: 1 },
    { chinese: '快乐', chars: [{ char: '快', pinyin: 'kuài' }, { char: '乐', pinyin: 'lè' }], english: 'happy', tone: 4 },
    { chinese: '咖啡', chars: [{ char: '咖', pinyin: 'kā' }, { char: '啡', pinyin: 'fēi' }], english: 'coffee', tone: 1 },
  ]},
  { type: 'initial', key: 'h', label: 'h', words: [
    { chinese: '好的', chars: [{ char: '好', pinyin: 'hǎo' }, { char: '的', pinyin: 'de' }], english: 'okay', tone: 3 },
    { chinese: '火车', chars: [{ char: '火', pinyin: 'huǒ' }, { char: '车', pinyin: 'chē' }], english: 'train', tone: 3 },
    { chinese: '花园', chars: [{ char: '花', pinyin: 'huā' }, { char: '园', pinyin: 'yuán' }], english: 'garden', tone: 1 },
  ]},
  { type: 'initial', key: 'j', label: 'j', words: [
    { chinese: '今天', chars: [{ char: '今', pinyin: 'jīn' }, { char: '天', pinyin: 'tiān' }], english: 'today', tone: 1 },
    { chinese: '家人', chars: [{ char: '家', pinyin: 'jiā' }, { char: '人', pinyin: 'rén' }], english: 'family', tone: 1 },
    { chinese: '机场', chars: [{ char: '机', pinyin: 'jī' }, { char: '场', pinyin: 'chǎng' }], english: 'airport', tone: 1 },
  ]},
  { type: 'initial', key: 'q', label: 'q', words: [
    { chinese: '请问', chars: [{ char: '请', pinyin: 'qǐng' }, { char: '问', pinyin: 'wèn' }], english: 'excuse me', tone: 3 },
    { chinese: '钱包', chars: [{ char: '钱', pinyin: 'qián' }, { char: '包', pinyin: 'bāo' }], english: 'wallet', tone: 2 },
    { chinese: '前面', chars: [{ char: '前', pinyin: 'qián' }, { char: '面', pinyin: 'miàn' }], english: 'front', tone: 2 },
  ]},
  { type: 'initial', key: 'x', label: 'x', words: [
    { chinese: '学校', chars: [{ char: '学', pinyin: 'xué' }, { char: '校', pinyin: 'xiào' }], english: 'school', tone: 2 },
    { chinese: '小心', chars: [{ char: '小', pinyin: 'xiǎo' }, { char: '心', pinyin: 'xīn' }], english: 'careful', tone: 3 },
    { chinese: '谢谢', chars: [{ char: '谢', pinyin: 'xiè' }, { char: '谢', pinyin: 'xie' }], english: 'thanks', tone: 4 },
  ]},
  { type: 'initial', key: 'zh', label: 'zh', words: [
    { chinese: '中国', chars: [{ char: '中', pinyin: 'zhōng' }, { char: '国', pinyin: 'guó' }], english: 'China', tone: 1 },
    { chinese: '知道', chars: [{ char: '知', pinyin: 'zhī' }, { char: '道', pinyin: 'dào' }], english: 'know', tone: 1 },
    { chinese: '准备', chars: [{ char: '准', pinyin: 'zhǔn' }, { char: '备', pinyin: 'bèi' }], english: 'prepare', tone: 3 },
  ]},
  { type: 'initial', key: 'ch', label: 'ch', words: [
    { chinese: '吃饭', chars: [{ char: '吃', pinyin: 'chī' }, { char: '饭', pinyin: 'fàn' }], english: 'eat', tone: 1 },
    { chinese: '出去', chars: [{ char: '出', pinyin: 'chū' }, { char: '去', pinyin: 'qù' }], english: 'go out', tone: 1 },
    { chinese: '车站', chars: [{ char: '车', pinyin: 'chē' }, { char: '站', pinyin: 'zhàn' }], english: 'station', tone: 1 },
  ]},
  { type: 'initial', key: 'sh', label: 'sh', words: [
    { chinese: '什么', chars: [{ char: '什', pinyin: 'shén' }, { char: '么', pinyin: 'me' }], english: 'what', tone: 2 },
    { chinese: '水果', chars: [{ char: '水', pinyin: 'shuǐ' }, { char: '果', pinyin: 'guǒ' }], english: 'fruit', tone: 3 },
    { chinese: '上班', chars: [{ char: '上', pinyin: 'shàng' }, { char: '班', pinyin: 'bān' }], english: 'go to work', tone: 4 },
  ]},
  { type: 'initial', key: 'r', label: 'r', words: [
    { chinese: '热水', chars: [{ char: '热', pinyin: 'rè' }, { char: '水', pinyin: 'shuǐ' }], english: 'hot water', tone: 4 },
    { chinese: '认识', chars: [{ char: '认', pinyin: 'rèn' }, { char: '识', pinyin: 'shi' }], english: 'know', tone: 4 },
    { chinese: '日本', chars: [{ char: '日', pinyin: 'rì' }, { char: '本', pinyin: 'běn' }], english: 'Japan', tone: 4 },
  ]},
  { type: 'initial', key: 'z', label: 'z', words: [
    { chinese: '早上', chars: [{ char: '早', pinyin: 'zǎo' }, { char: '上', pinyin: 'shàng' }], english: 'morning', tone: 3 },
    { chinese: '走路', chars: [{ char: '走', pinyin: 'zǒu' }, { char: '路', pinyin: 'lù' }], english: 'walk', tone: 3 },
    { chinese: '做饭', chars: [{ char: '做', pinyin: 'zuò' }, { char: '饭', pinyin: 'fàn' }], english: 'cook', tone: 4 },
  ]},
  { type: 'initial', key: 'c', label: 'c', words: [
    { chinese: '厕所', chars: [{ char: '厕', pinyin: 'cè' }, { char: '所', pinyin: 'suǒ' }], english: 'toilet', tone: 4 },
    { chinese: '菜单', chars: [{ char: '菜', pinyin: 'cài' }, { char: '单', pinyin: 'dān' }], english: 'menu', tone: 4 },
    { chinese: '参加', chars: [{ char: '参', pinyin: 'cān' }, { char: '加', pinyin: 'jiā' }], english: 'participate', tone: 1 },
  ]},
  { type: 'initial', key: 's', label: 's', words: [
    { chinese: '三个', chars: [{ char: '三', pinyin: 'sān' }, { char: '个', pinyin: 'gè' }], english: 'three', tone: 1 },
    { chinese: '送给', chars: [{ char: '送', pinyin: 'sòng' }, { char: '给', pinyin: 'gěi' }], english: 'give to', tone: 4 },
    { chinese: '睡觉', chars: [{ char: '睡', pinyin: 'shuì' }, { char: '觉', pinyin: 'jiào' }], english: 'sleep', tone: 4 },
  ]},
  { type: 'initial', key: 'y', label: 'y', words: [
    { chinese: '一起', chars: [{ char: '一', pinyin: 'yī' }, { char: '起', pinyin: 'qǐ' }], english: 'together', tone: 1 },
    { chinese: '医院', chars: [{ char: '医', pinyin: 'yī' }, { char: '院', pinyin: 'yuàn' }], english: 'hospital', tone: 1 },
    { chinese: '银行', chars: [{ char: '银', pinyin: 'yín' }, { char: '行', pinyin: 'háng' }], english: 'bank', tone: 2 },
  ]},
  { type: 'initial', key: 'w', label: 'w', words: [
    { chinese: '我们', chars: [{ char: '我', pinyin: 'wǒ' }, { char: '们', pinyin: 'men' }], english: 'we', tone: 3 },
    { chinese: '问题', chars: [{ char: '问', pinyin: 'wèn' }, { char: '题', pinyin: 'tí' }], english: 'question', tone: 4 },
    { chinese: '晚上', chars: [{ char: '晚', pinyin: 'wǎn' }, { char: '上', pinyin: 'shàng' }], english: 'evening', tone: 3 },
  ]},
];

export const FINAL_GROUPS: PinyinGroup[] = [
  { type: 'final', key: 'a', label: 'a', words: [
    { chinese: '大家', chars: [{ char: '大', pinyin: 'dà' }, { char: '家', pinyin: 'jiā' }], english: 'everyone', tone: 4 },
    { chinese: '妈妈', chars: [{ char: '妈', pinyin: 'mā' }, { char: '妈', pinyin: 'ma' }], english: 'mom', tone: 1 },
    { chinese: '爸爸', chars: [{ char: '爸', pinyin: 'bà' }, { char: '爸', pinyin: 'ba' }], english: 'dad', tone: 4 },
  ]},
  { type: 'final', key: 'o', label: 'o', words: [
    { chinese: '哥哥', chars: [{ char: '哥', pinyin: 'gē' }, { char: '哥', pinyin: 'ge' }], english: 'brother', tone: 1 },
    { chinese: '国歌', chars: [{ char: '国', pinyin: 'guó' }, { char: '歌', pinyin: 'gē' }], english: 'national anthem', tone: 2 },
    { chinese: '河流', chars: [{ char: '河', pinyin: 'hé' }, { char: '流', pinyin: 'liú' }], english: 'river', tone: 2 },
  ]},
  { type: 'final', key: 'e', label: 'e', words: [
    { chinese: '可以', chars: [{ char: '可', pinyin: 'kě' }, { char: '以', pinyin: 'yǐ' }], english: 'can', tone: 3 },
    { chinese: '饿了', chars: [{ char: '饿', pinyin: 'è' }, { char: '了', pinyin: 'le' }], english: 'hungry', tone: 4 },
    { chinese: '喝水', chars: [{ char: '喝', pinyin: 'hē' }, { char: '水', pinyin: 'shuǐ' }], english: 'drink water', tone: 1 },
  ]},
  { type: 'final', key: 'i', label: 'i', words: [
    { chinese: '一起', chars: [{ char: '一', pinyin: 'yī' }, { char: '起', pinyin: 'qǐ' }], english: 'together', tone: 1 },
    { chinese: '日记', chars: [{ char: '日', pinyin: 'rì' }, { char: '记', pinyin: 'jì' }], english: 'diary', tone: 4 },
    { chinese: '第一', chars: [{ char: '第', pinyin: 'dì' }, { char: '一', pinyin: 'yī' }], english: 'first', tone: 4 },
  ]},
  { type: 'final', key: 'u', label: 'u', words: [
    { chinese: '读书', chars: [{ char: '读', pinyin: 'dú' }, { char: '书', pinyin: 'shū' }], english: 'read', tone: 2 },
    { chinese: '出去', chars: [{ char: '出', pinyin: 'chū' }, { char: '去', pinyin: 'qù' }], english: 'go out', tone: 1 },
    { chinese: '服务', chars: [{ char: '服', pinyin: 'fú' }, { char: '务', pinyin: 'wù' }], english: 'service', tone: 2 },
  ]},
  { type: 'final', key: 'ü', label: 'ü', words: [
    { chinese: '旅行', chars: [{ char: '旅', pinyin: 'lǚ' }, { char: '行', pinyin: 'xíng' }], english: 'travel', tone: 3 },
    { chinese: '女生', chars: [{ char: '女', pinyin: 'nǚ' }, { char: '生', pinyin: 'shēng' }], english: 'girl', tone: 3 },
    { chinese: '下雨', chars: [{ char: '下', pinyin: 'xià' }, { char: '雨', pinyin: 'yǔ' }], english: 'rain', tone: 4 },
  ]},
  { type: 'final', key: 'ai', label: 'ai', words: [
    { chinese: '爱好', chars: [{ char: '爱', pinyin: 'ài' }, { char: '好', pinyin: 'hào' }], english: 'hobby', tone: 4 },
    { chinese: '明白', chars: [{ char: '明', pinyin: 'míng' }, { char: '白', pinyin: 'bai' }], english: 'understand', tone: 2 },
    { chinese: '买卖', chars: [{ char: '买', pinyin: 'mǎi' }, { char: '卖', pinyin: 'mài' }], english: 'buy and sell', tone: 3 },
  ]},
  { type: 'final', key: 'ei', label: 'ei', words: [
    { chinese: '美丽', chars: [{ char: '美', pinyin: 'měi' }, { char: '丽', pinyin: 'lì' }], english: 'beautiful', tone: 3 },
    { chinese: '给你', chars: [{ char: '给', pinyin: 'gěi' }, { char: '你', pinyin: 'nǐ' }], english: 'give you', tone: 3 },
    { chinese: '没有', chars: [{ char: '没', pinyin: 'méi' }, { char: '有', pinyin: 'yǒu' }], english: 'do not have', tone: 2 },
  ]},
  { type: 'final', key: 'ao', label: 'ao', words: [
    { chinese: '好人', chars: [{ char: '好', pinyin: 'hǎo' }, { char: '人', pinyin: 'rén' }], english: 'good person', tone: 3 },
    { chinese: '早上', chars: [{ char: '早', pinyin: 'zǎo' }, { char: '上', pinyin: 'shàng' }], english: 'morning', tone: 3 },
    { chinese: '跑步', chars: [{ char: '跑', pinyin: 'pǎo' }, { char: '步', pinyin: 'bù' }], english: 'run', tone: 3 },
  ]},
  { type: 'final', key: 'ou', label: 'ou', words: [
    { chinese: '朋友', chars: [{ char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'yǒu' }], english: 'friend', tone: 2 },
    { chinese: '走路', chars: [{ char: '走', pinyin: 'zǒu' }, { char: '路', pinyin: 'lù' }], english: 'walk', tone: 3 },
    { chinese: '后面', chars: [{ char: '后', pinyin: 'hòu' }, { char: '面', pinyin: 'miàn' }], english: 'behind', tone: 4 },
  ]},
  { type: 'final', key: 'an', label: 'an', words: [
    { chinese: '简单', chars: [{ char: '简', pinyin: 'jiǎn' }, { char: '单', pinyin: 'dān' }], english: 'simple', tone: 3 },
    { chinese: '安全', chars: [{ char: '安', pinyin: 'ān' }, { char: '全', pinyin: 'quán' }], english: 'safe', tone: 1 },
    { chinese: '晚安', chars: [{ char: '晚', pinyin: 'wǎn' }, { char: '安', pinyin: 'ān' }], english: 'good night', tone: 3 },
  ]},
  { type: 'final', key: 'en', label: 'en', words: [
    { chinese: '很好', chars: [{ char: '很', pinyin: 'hěn' }, { char: '好', pinyin: 'hǎo' }], english: 'very good', tone: 3 },
    { chinese: '人们', chars: [{ char: '人', pinyin: 'rén' }, { char: '们', pinyin: 'men' }], english: 'people', tone: 2 },
    { chinese: '什么', chars: [{ char: '什', pinyin: 'shén' }, { char: '么', pinyin: 'me' }], english: 'what', tone: 2 },
  ]},
  { type: 'final', key: 'ang', label: 'ang', words: [
    { chinese: '帮忙', chars: [{ char: '帮', pinyin: 'bāng' }, { char: '忙', pinyin: 'máng' }], english: 'help', tone: 1 },
    { chinese: '商店', chars: [{ char: '商', pinyin: 'shāng' }, { char: '店', pinyin: 'diàn' }], english: 'shop', tone: 1 },
    { chinese: '漂亮', chars: [{ char: '漂', pinyin: 'piào' }, { char: '亮', pinyin: 'liang' }], english: 'pretty', tone: 4 },
  ]},
  { type: 'final', key: 'eng', label: 'eng', words: [
    { chinese: '风景', chars: [{ char: '风', pinyin: 'fēng' }, { char: '景', pinyin: 'jǐng' }], english: 'scenery', tone: 1 },
    { chinese: '朋友', chars: [{ char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'yǒu' }], english: 'friend', tone: 2 },
    { chinese: '能力', chars: [{ char: '能', pinyin: 'néng' }, { char: '力', pinyin: 'lì' }], english: 'ability', tone: 2 },
  ]},
  { type: 'final', key: 'ong', label: 'ong', words: [
    { chinese: '中国', chars: [{ char: '中', pinyin: 'zhōng' }, { char: '国', pinyin: 'guó' }], english: 'China', tone: 1 },
    { chinese: '红色', chars: [{ char: '红', pinyin: 'hóng' }, { char: '色', pinyin: 'sè' }], english: 'red', tone: 2 },
    { chinese: '空气', chars: [{ char: '空', pinyin: 'kōng' }, { char: '气', pinyin: 'qì' }], english: 'air', tone: 1 },
  ]},
];

/** Get all pinyin groups for a specific album */
export function getPinyinGroupsByAlbum(albumId: string): PinyinGroup[] {
  switch (albumId) {
    case 'pinyin-initials': return INITIAL_GROUPS;
    case 'pinyin-finals': return FINAL_GROUPS;
    case 'pinyin-tones': return TONE_GROUPS;
    default: return [];
  }
}
