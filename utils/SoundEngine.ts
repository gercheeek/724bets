class SoundEngine {
    private ctx: AudioContext | null = null;
    private engineOsc: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;
    private initialized = false;
    private isMuted = false;

    init() {
        if (this.initialized) return;
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
            this.ctx = new AudioContextClass();
            this.initialized = true;
        } catch (e) {
            console.error("Audio API not supported", e);
        }
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
        if (muted) this.stopEngineSound();
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1, slideToFreq?: number) {
        if (this.isMuted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (slideToFreq) {
            osc.frequency.exponentialRampToValueAtTime(slideToFreq, this.ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    playBetSound() {
        this.playTone(600, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.15, 0.1), 100);
    }

    playCashoutSound() {
        this.playTone(900, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.4, 0.1), 100);
    }

    playCrashSound() {
        if (this.isMuted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // A harsh descending sound
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.5);
    }

    
    playPopSound() {
        this.playTone(500, 'sine', 0.05, 0.1);
    }

    playSuccessSound() {
        this.playTone(880, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(1760, 'sine', 0.2, 0.1), 100);
    }

    startEngineSound() {
        if (this.isMuted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.stopEngineSound();

        this.engineOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();

        this.engineOsc.type = 'triangle';
        this.engineOsc.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);

        // Low hum starting point
        this.engineOsc.frequency.setValueAtTime(60, this.ctx.currentTime);
        this.engineGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

        this.engineOsc.start(this.ctx.currentTime);
    }

    updateEnginePitch(multiplier: number) {
        if (!this.engineOsc || !this.ctx) return;
        // Map multiplier 1.0 -> 10.0+ to frequency 60Hz -> 400Hz+
        const freq = Math.min(60 + (multiplier - 1) * 30, 800);
        this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }

    stopEngineSound() {
        if (this.engineOsc && this.engineGain && this.ctx) {
            this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            const osc = this.engineOsc;
            setTimeout(() => {
                try { osc.stop(); } catch(e){}
            }, 200);
        }
        this.engineOsc = null;
        this.engineGain = null;
    }
}

export const soundEngine = new SoundEngine();
