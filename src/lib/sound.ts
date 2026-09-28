/**
 * Web Audio API synthesizer for mechanical typewriter / keyboard clicks.
 * Zero external network dependencies, zero latency, works offline.
 */

class SoundController {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialized lazily on first user interaction
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playKeyClick() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Mechanical switch click simulation
      const now = this.audioCtx.currentTime;
      osc.type = 'triangle';
      
      // Slight random frequency jitter for realistic mechanical feel
      const baseFreq = 800 + Math.random() * 200;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio failure
    }
  }
}

export const soundController = new SoundController();
