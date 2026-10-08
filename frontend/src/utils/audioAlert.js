/**
 * JalRakshak AI — Municipal Emergency Sound & Voice Synthesizer
 * Uses Web Audio API for authentic emergency siren tones and Web Speech API for multilingual voice alerts.
 */

class EmergencyAudioSystem {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentOsc = null;
    this.currentTimeout = null;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Plays a 2.5-second realistic municipal two-tone emergency siren
   */
  playEmergencySiren() {
    return new Promise((resolve) => {
      try {
        this.initAudioContext();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        this.currentOsc = osc;

        osc.type = 'sawtooth';
        
        // Two-tone rising and falling municipal wail: 650Hz to 950Hz
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.6);
        osc.frequency.exponentialRampToValueAtTime(650, now + 1.2);
        osc.frequency.exponentialRampToValueAtTime(950, now + 1.8);
        osc.frequency.exponentialRampToValueAtTime(650, now + 2.4);

        // Volume envelope
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
        gain.gain.setValueAtTime(0.25, now + 2.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);

        this.currentTimeout = setTimeout(() => {
          this.currentOsc = null;
          this.currentTimeout = null;
          resolve();
        }, 2500);
      } catch (err) {
        console.warn('Web Audio error:', err);
        resolve();
      }
    });
  }

  /**
   * Alias method for siren / alarm trigger
   */
  playAlarm() {
    return this.playEmergencySiren();
  }

  /**
   * Speaks public emergency broadcast in English or Hindi using browser SpeechSynthesis
   */
  speakBroadcast(text, lang = 'hi-IN') {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Complete Disaster Broadcast: Siren tone + Voice Announcement
   */
  async playFullDisasterBroadcast(englishAlert, hindiAlert, onPlayingStateChange) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (onPlayingStateChange) onPlayingStateChange(true);

    try {
      // 1. Play siren tone
      await this.playEmergencySiren();

      // Ensure stopAll wasn't called during siren
      if (!this.isPlaying) return;

      // 2. Play speech in Hindi (or English)
      const speechText = hindiAlert || englishAlert;
      const lang = hindiAlert ? 'hi-IN' : 'en-US';
      await this.speakBroadcast(speechText, lang);
    } finally {
      this.isPlaying = false;
      if (onPlayingStateChange) onPlayingStateChange(false);
    }
  }

  stopAll() {
    this.isPlaying = false;
    if (this.currentOsc) {
      try {
        this.currentOsc.stop();
        this.currentOsc.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      this.currentOsc = null;
    }
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const emergencyAudio = new EmergencyAudioSystem();
