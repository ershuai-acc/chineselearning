'use client';

import { Volume2 } from 'lucide-react';

interface PinyinLine {
  text: string;
  pinyin: string;
}

const INTRO_LINES: PinyinLine[] = [
  {
    text: '你好，我的朋友',
    pinyin: 'Nǐ hǎo, wǒ de péngyou',
  },
  {
    text: '我们是树袋熊工作室，一群来自五湖四海的朋友。',
    pinyin: 'Wǒmen shì Shùdàixióng Gōngzuòshì, yì qún lái zì wǔhúsìhǎi de péngyou.',
  },
  {
    text: '不论你因为什么原因想学点普通话，都希望能在这个小小的网站里发现点有趣的东西。',
    pinyin: 'Bùlùn nǐ yīnwèi shénme yuányīn xiǎng xué diǎn pǔtōnghuà, dōu xīwàng néng zài zhège xiǎoxiǎo de wǎngzhàn lǐ fāxiàn diǎn yǒuqù de dōngxi.',
  },
  {
    text: '比如中国古代的鬼故事？',
    pinyin: 'Bǐrú Zhōngguó gǔdài de guǐ gùshi?',
  },
  {
    text: '比如"恭喜发财红包拿来"？',
    pinyin: 'Bǐrú "gōngxǐ fācái hóngbāo ná lái"?',
  },
  {
    text: '还有骂人的话？（仅供了解，请文明用语）',
    pinyin: 'Háiyǒu mà rén de huà? (Jǐn gōng liǎojiě, qǐng wénmíng yòngyǔ)',
  },
  {
    text: '我们希望能让大家用最简单的法子听懂普通话，会说普通话，从而达到 HSK3 的水平。',
    pinyin: "Wǒmen xīwàng néng ràng dàjiā yòng zuì jiǎndān de fǎzi tīng dǒng pǔtōnghuà, huì shuō pǔtōnghuà, cóng'ér dádào HSK3 de shuǐpíng.",
  },
  {
    text: '如果你有什么好的建议，加入我们的 Discord 小组。',
    pinyin: 'Rúguǒ nǐ yǒu shénme hǎo de jiànyì, jiārù wǒmen de Discord xiǎozǔ.',
  },
  {
    text: '树袋熊工作室',
    pinyin: 'Shùdàixióng Gōngzuòshì',
  },
];

const ENGLISH_TEXT = `Hello, my friend.

We are Koala Studio — a group of friends from all over the world.

No matter why you want to learn some Mandarin, we hope you can find something fun on this little website. Like ancient Chinese ghost stories? Like "Congratulations, now give me a red envelope"? Or even swear words? (For cultural reference only — please be civil!)

We hope to help everyone understand and speak Mandarin in the simplest way possible — reaching HSK 3 level.

If you have any suggestions, join our Discord group.

— Koala Studio`;

function playText(text: string) {
  if (typeof window === 'undefined') return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

function playAll() {
  if (typeof window === 'undefined') return;
  const fullText = INTRO_LINES.map(l => l.text).join('');
  const u = new SpeechSynthesisUtterance(fullText);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

export default function GuidePage() {
  return (
    <div className="min-h-[100dvh] bg-duo-snow">
      <div className="max-w-2xl mx-auto w-full px-5 py-12 md:py-16 space-y-8">

        {/* Part 1: Chinese + Pinyin + Play */}
        <section className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-duo-hare uppercase tracking-wider">Chinese</h2>
            <button
              onClick={playAll}
              className="flex items-center gap-1.5 text-sm font-bold text-duo-macaw hover:text-duo-macaw-dark transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Play all
            </button>
          </div>

          <div className="space-y-5">
            {INTRO_LINES.map((line, i) => (
              <div key={i} className="group">
                <p className="text-xs text-duo-macaw font-medium mb-0.5 leading-relaxed">{line.pinyin}</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg md:text-xl font-bold text-duo-eel leading-relaxed flex-1">{line.text}</p>
                  <button
                    onClick={() => playText(line.text)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-duo-hare hover:text-duo-macaw hover:bg-duo-macaw/10 active:scale-90 transition-all shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Play this line"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Part 2: English translation */}
        <section className="bg-white rounded-2xl border-2 border-b-4 border-duo-swan p-6 md:p-10">
          <h2 className="text-sm font-bold text-duo-hare uppercase tracking-wider mb-6">English</h2>
          <div className="text-base md:text-lg text-duo-wolf leading-relaxed whitespace-pre-line font-medium">
            {ENGLISH_TEXT}
          </div>
        </section>

        {/* Part 3: Discord Join */}
        <section className="text-center py-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#5865F2] text-white font-bold text-lg rounded-2xl hover:bg-[#4752C4] active:scale-95 transition-all shadow-lg"
          >
            💬 Join our Discord
          </a>
          <p className="text-sm text-duo-hare mt-3 font-medium">Share feedback, ask questions, meet other learners</p>
        </section>

      </div>
    </div>
  );
}
