// Speech utility supporting Web Speech API with fallback to server Gemini TTS

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private onStateChange: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setListener(cb: (speaking: boolean) => void) {
    this.onStateChange = cb;
  }

  private notify(state: boolean) {
    this.isSpeaking = state;
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.notify(false);
  }

  public async speak(text: string): Promise<void> {
    this.stop();

    const cleanText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    if (!cleanText) return;

    // First attempt: Web Speech API with Vietnamese voice
    if (this.synth) {
      try {
        const voices = this.synth.getVoices();
        const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN'));

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.92; // Slightly slower, easy to follow
        utterance.pitch = 1.0;
        if (viVoice) {
          utterance.voice = viVoice;
          utterance.lang = viVoice.lang;
        } else {
          utterance.lang = 'vi-VN';
        }

        utterance.onstart = () => this.notify(true);
        utterance.onend = () => this.notify(false);
        utterance.onerror = (e) => {
          console.warn('Web Speech error, falling back to server TTS:', e);
          this.fallbackServerTTS(cleanText);
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
        return;
      } catch (err) {
        console.warn('Web Speech exception, falling back to server TTS:', err);
      }
    }

    // Fallback: server TTS
    await this.fallbackServerTTS(cleanText);
  }

  private async fallbackServerTTS(text: string) {
    try {
      this.notify(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 400) }),
      });

      if (!res.ok) {
        throw new Error('TTS server error');
      }

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:${data.format || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        this.currentAudio = audio;

        audio.onended = () => {
          this.notify(false);
          this.currentAudio = null;
        };
        audio.onerror = () => {
          this.notify(false);
          this.currentAudio = null;
        };

        await audio.play();
      } else {
        this.notify(false);
      }
    } catch (err) {
      console.warn('Fallback server TTS failed:', err);
      this.notify(false);
    }
  }

  public getStatus(): boolean {
    return this.isSpeaking;
  }
}

export const speechManager = new SpeechManager();
