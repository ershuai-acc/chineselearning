/**
 * Shadow Reading (影子跟读) - Core Types
 * Designed for Chinese learners (English native speakers learning Mandarin)
 */

/** A single word/token in a sentence */
export interface ShadowWord {
  id: string;
  hanzi: string;       // Chinese characters (e.g. "很久")
  pinyin: string;      // Pinyin with tone marks (e.g. "hěn jiǔ")
  meaning?: string;    // English meaning (e.g. "long ago")
}

/** A sentence in the shadow reading lesson */
export interface ShadowSentence {
  id: string;
  text: string;            // Full sentence text
  words: ShadowWord[];     // Tokenized words
  pinyin: string;          // Full sentence pinyin
  translation: string;     // English translation
  audioUrl?: string;       // TTS audio file URL
}

/** Level types for progressive difficulty within each sentence */
export type ShadowLevelType = 
  | 'listen'           // Listen only (full text visible)
  | 'visible'          // Shadow read with full text + pinyin
  | 'pinyin-only'      // Shadow read with only pinyin (no hanzi)
  | 'hidden';          // Shadow read with no text

/** A lesson (one story) */
export interface ShadowLesson {
  id: string;
  title: string;           // Chinese title
  titleEn: string;         // English title
  description: string;     // English description
  source: string;          // Original source (e.g. "搜神记")
  sourceEn: string;        // English source name
  difficulty: string;      // e.g. "HSK 3"
  sentences: ShadowSentence[]; // Each sentence = one chapter for shadow reading
}

/** An album (collection of lessons from one book) */
export interface ShadowAlbum {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  lessons: ShadowLesson[];
}
