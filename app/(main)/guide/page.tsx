'use client';

import { Volume2 } from 'lucide-react';

interface PinyinLine {
  text: string;
  pinyin: string;
  translation: string;
}

const INTRO_LINES: PinyinLine[] = [
  {
    text: '你好，我的朋友',
    pinyin: 'Nǐ hǎo, wǒ de péngyou',
    translation: 'Hello, my friend',
  },
  {
    text: '我们是树袋熊工作室，一群来自五湖四海的朋友。',
    pinyin: 'Wǒmen shì Shùdàixióng Gōngzuòshì, yì qún lái zì wǔhúsìhǎi de péngyou.',
    translation: 'We are Koala Studio — a group of friends from all over the world.',
  },
  {
    text: '不论你因为什么原因想学点普通话，都希望能在这个小小的网站里发现点有趣的东西。',
    pinyin: 'Bùlùn nǐ yīnwèi shénme yuányīn xiǎng xué diǎn pǔtōnghuà, dōu xīwàng néng zài zhège xiǎoxiǎo de wǎngzhàn lǐ fāxiàn diǎn yǒuqù de dōngxi.',
    translation: 'No matter why you want to learn some Mandarin, we hope you can find something fun on this little website.',
  },
  {
    text: '比如中国古代的鬼故事？',
    pinyin: 'Bǐrú Zhōngguó gǔdài de guǐ gùshi?',
    translation: 'Like ancient Chinese ghost stories?',
  },
  {
    text: '比如"恭喜发财红包拿来"？',
    pinyin: 'Bǐrú "gōngxǐ fācái hóngbāo ná lái"?',
    translation: 'Like "Congratulations, now give me a red envelope"?',
  },
  {
    text: '还有骂人的话？（仅供了解，请文明用语）',
    pinyin: 'Háiyǒu mà rén de huà? (Jǐn gōng liǎojiě, qǐng wénmíng yòngyǔ)',
    translation: 'Or even swear words? (For cultural reference only — please be civil!)',
  },
  {
    text: '我们希望能让大家用最简单的法子听懂普通话，会说普通话，从而达到 HSK3 的水平。',
    pinyin: "Wǒmen xīwàng néng ràng dàjiā yòng zuì jiǎndān de fǎzi tīng dǒng pǔtōnghuà, huì shuō pǔtōnghuà, cóng'ér dádào HSK3 de shuǐpíng.",
    translation: 'We hope to help everyone understand and speak Mandarin in the simplest way possible — reaching HSK 3 level.',
  },
  {
    text: '如果你有什么好的建议，加入我们的 Discord 小组。',
    pinyin: 'Rúguǒ nǐ yǒu shénme hǎo de jiànyì, jiārù wǒmen de Discord xiǎozǔ.',
    translation: 'If you have any suggestions, join our Discord group.',
  },
  {
    text: '树袋熊工作室',
    pinyin: 'Shùdàixióng Gōngzuòshì',
    translation: 'Koala Studio',
  },
];

function playText(text: string) {
  if (typeof window === 'undefined') return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

function PinyinTextBlock({ line }: { line: PinyinLine }) {
  return (
    <div className="group mb-6">
      {/* Pinyin */}
      <p className="text-sm text-duo-macaw font-medium mb-0.5 leading-relaxed">{line.pinyin}</p>
      {/* Chinese text + play button */}
      <div className="flex items-start gap-2">
        <p className="text-xl md:text-2xl font-bold text-duo-eel leading-relaxed flex-1">{line.text}</p>
        <button
          onClick={() => playText(line.text)}
          className="mt-1 w-8 h-8 rounded-full flex items-center justify-center text-duo-macaw hover:bg-duo-macaw/10 active:scale-90 transition-all shrink-0"
          aria-label="Play audio"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      {/* English translation */}
      <p className="text-sm text-duo-wolf mt-1 leading-relaxed">{line.translation}</p>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-[100dvh] bg-duo-snow">
      <div className="max-w-2xl mx-auto w-full px-5 py-12 md:py-16">
        <div className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 md:p-10">
          {INTRO_LINES.map((line, i) => (
            <PinyinTextBlock key={i} line={line} />
          ))}
        </div>

        {/* Discord CTA */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-bold rounded-xl hover:bg-[#4752C4] transition-colors"
          >
            💬 Join our Discord
          </a>
        </div>
      </div>
    </div>
  );
}
