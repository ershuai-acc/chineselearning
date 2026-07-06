/**
 * TTS (Text-to-Speech) utility for PandaMandarin
 *
 * Dual-path approach:
 *   Path A — Capacitor native plugin (AVSpeechSynthesizer on iOS)
 *   Path B — Web Speech API (speechSynthesis, built into WKWebView)
 *
 * On iOS, the first path that produces audio wins.
 */

export interface TtsOptions {
  text: string;
  lang?: string;
  rate?: number;
}

// ── Diagnostic state (readable from DevTools console) ──
export const ttsDiag = {
  lastCall: '' as string,
  lastResult: '' as string,
  pathUsed: '' as string,
  platform: '' as string,
  supportedLanguages: [] as string[],
  voices: [] as string[],
  calls: 0,
  errors: 0,
  nativeAvailable: false,
  webAvailable: false,
  lastError: '' as string,
};

let _ttsPlugin: any = null;
let _capacitor: any = null;

declare global {
  interface Window {
    __ttsDiag?: typeof ttsDiag;
  }
}

function publishDiag() {
  if (typeof window !== 'undefined') {
    window.__ttsDiag = ttsDiag;
  }
}

function logDiag(message: string, extra?: Record<string, unknown>) {
  publishDiag();
  if (typeof console !== 'undefined') {
    console.info('[TTS]', message, JSON.stringify({ ...ttsDiag, ...extra }));
  }
}

function isNativeRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return Boolean(
    win.Capacitor?.isNativePlatform?.() ||
    win.androidBridge ||
    win.webkit?.messageHandlers?.bridge
  );
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function getCapacitor() {
  if (_capacitor != null) return _capacitor;
  if (typeof window === 'undefined') return null;

  try {
    ttsDiag.lastResult = 'loading-capacitor';
    publishDiag();
    const mod = await withTimeout(import('@capacitor/core'), 2500, 'Capacitor import');
    _capacitor = mod.Capacitor;
    ttsDiag.platform = _capacitor.getPlatform?.() ?? 'web';
    return _capacitor;
  } catch (e) {
    ttsDiag.lastError = errorMessage(e);
    return null;
  }
}

async function getNativePlugin() {
  if (_ttsPlugin != null) return _ttsPlugin;
  if (typeof window === 'undefined') return null;

  const capacitor = await getCapacitor();
  if (!capacitor?.isNativePlatform?.()) {
    ttsDiag.nativeAvailable = false;
    return null;
  }

  const globalPlugin = (window as any).Capacitor?.Plugins?.TextToSpeech;
  if (globalPlugin) {
    _ttsPlugin = globalPlugin;
    ttsDiag.nativeAvailable = true;
    return _ttsPlugin;
  }

  try {
    ttsDiag.lastResult = 'loading-native-plugin';
    publishDiag();
    const mod = await withTimeout(import('@capacitor-community/text-to-speech'), 2500, 'TTS plugin import');
    _ttsPlugin = mod.TextToSpeech;
    ttsDiag.nativeAvailable = true;
    return _ttsPlugin;
  } catch (e) {
    ttsDiag.lastError = errorMessage(e);
    _ttsPlugin = null; // don't cache failure, keep trying
    return null;
  }
}

function getVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices();
}

function webSpeak(text: string, lang: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      ttsDiag.lastResult = 'web-speech-unavailable';
      logDiag('Web Speech API unavailable');
      resolve();
      return;
    }
    ttsDiag.webAvailable = true;
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.volume = 1;

    // Try attaching a zh voice, but still speak if voices have not loaded yet.
    const voices = getVoices();
    ttsDiag.voices = voices.map(v => `${v.name} (${v.lang})`);
    const zhVoice = voices.find(v => v.lang === lang) ?? voices.find(v => v.lang.startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    let resolved = false;
    const done = (result: string) => {
      if (resolved) return;
      resolved = true;
      ttsDiag.lastResult = result;
      if (result === 'ok') ttsDiag.pathUsed = 'web-speech';
      resolve();
    };

    utterance.onstart = () => {
      ttsDiag.lastResult = 'speaking';
      ttsDiag.pathUsed = 'web-speech';
    };
    utterance.onend = () => done('ok');
    utterance.onerror = (event) => {
      ttsDiag.errors++;
      ttsDiag.lastError = event.error || 'web speech error';
      logDiag('Web Speech error', { error: ttsDiag.lastError });
      done('error');
    };

    speechSynthesis.speak(utterance);
    logDiag('Web Speech speak() called', { text, lang, rate });

    // Some WKWebView/iOS versions fail to fire onend/onerror. Do not leave callers hanging.
    window.setTimeout(() => done('web-speech-timeout'), Math.max(2500, text.length * 250));
  });
}

export async function speak({ text, lang = 'zh-CN', rate = 0.8 }: TtsOptions): Promise<void> {
  ttsDiag.calls++;
  ttsDiag.lastCall = text.substring(0, 40);
  ttsDiag.lastResult = 'calling';
  ttsDiag.pathUsed = '';
  ttsDiag.lastError = '';
  publishDiag();

  if (typeof window === 'undefined' || !text) {
    ttsDiag.lastResult = 'skipped';
    publishDiag();
    return;
  }

  const native = isNativeRuntime();
  ttsDiag.lastResult = native ? 'native-detected' : 'web-detected';
  publishDiag();
  logDiag('speak() called', { text, lang, rate, native });
  if (!native) {
    await webSpeak(text, lang, rate);
    return;
  }

  // ── Try native Capacitor plugin first ──
  ttsDiag.lastResult = 'before-native-plugin';
  publishDiag();
  const plugin = await getNativePlugin();
  ttsDiag.lastResult = plugin ? 'after-native-plugin' : 'no-native-plugin';
  publishDiag();
  if (plugin) {
    ttsDiag.lastResult = 'native-trying';
    try {
      const languages = await plugin.getSupportedLanguages?.();
      ttsDiag.supportedLanguages = languages?.languages ?? [];
      await withTimeout(
        plugin.speak({ text, lang, rate, pitch: 1.0, volume: 1.0, category: 'playback', queueStrategy: 0 }),
        Math.max(5000, text.length * 350),
        'native TTS',
      );
      ttsDiag.lastResult = 'ok';
      ttsDiag.pathUsed = 'native';
      logDiag('Native TTS completed');
      return;
    } catch (e) {
      ttsDiag.errors++;
      ttsDiag.lastResult = 'native-failed';
      ttsDiag.lastError = errorMessage(e);
      logDiag('Native TTS failed', { error: ttsDiag.lastError });
      // fall through to web
    }
  } else {
    ttsDiag.lastResult = 'no-native-plugin';
    logDiag('Native TTS plugin unavailable');
  }

  // ── Fallback: Web Speech API ──
  await withTimeout(webSpeak(text, lang, rate), Math.max(3000, text.length * 300), 'web speech');
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

/** Pre-warm the speech engine. Call on first user tap. */
export function initTtsOnInteraction(): void {
  if (typeof window === 'undefined') return;
  // Load voices now (user gesture context)
  if ('speechSynthesis' in window) {
    ttsDiag.webAvailable = true;
    ttsDiag.voices = getVoices().map(v => `${v.name} (${v.lang})`);
    publishDiag();
  }
  // Also pre-load native plugin
  getNativePlugin();
}
