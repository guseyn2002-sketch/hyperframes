import numpy as np, wave
SR = 48000
class Audio:
    def __init__(self, T=12.0, seed=7):
        self.T = T; self.N = int(SR * T); self.out = np.zeros(self.N); self.rng = np.random.default_rng(seed)
    def add(self, sig, start):
        i = int(round(start * SR)); idx = (np.arange(len(sig)) + i) % self.N; np.add.at(self.out, idx, sig)
    @staticmethod
    def mid(m): return 440 * 2 ** ((m - 69) / 12)
    def marimba(self, t0, m, dur=1.6, amp=.1):
        f = self.mid(m); t = np.arange(int(dur * SR)) / SR
        env = np.exp(-t * 3.2) * (1 - np.exp(-t * 600))
        self.add(amp * env * (np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*4*f*t)*np.exp(-t*14) + .1*np.sin(2*np.pi*9.2*f*t)*np.exp(-t*30)), t0)
    def pluck(self, t0, m, dur=.35, amp=.12):
        f = self.mid(m); t = np.arange(int(dur * SR)) / SR
        env = np.exp(-t * 16) * (1 - np.exp(-t * 900))
        self.add(amp * env * ((2/np.pi) * np.arcsin(np.sin(2*np.pi*f*t)) + .3*np.sin(2*np.pi*2*f*t)), t0)
    def noise(self, t0, dur=.08, amp=.15, lp=.3):
        n = self.rng.standard_normal(int(dur * SR)); y = np.zeros_like(n); a = 0
        for i in range(len(n)): a += lp * (n[i] - a); y[i] = a
        t = np.arange(len(n)) / SR
        self.add(amp * y * np.exp(-t * (6 / dur)) * (1 - np.exp(-t * 2000)), t0)
    def sweep(self, t0, f0, f1, dur, amp=.06, trem=0):
        t = np.arange(int(dur * SR)) / SR; p = t / dur
        f = f0 * (f1 / f0) ** p; ph = 2*np.pi*np.cumsum(f)/SR
        self.add(amp * np.sin(np.pi*p)**1.5 * np.sin(ph) * (1 + trem*np.sin(2*np.pi*9*t)), t0)
    def chime(self, t0, notes, gap=.07, amp=.09):
        for i, m in enumerate(notes): self.marimba(t0 + i*gap, m, 1.8, amp)
    def bed(self, melody=None, bass=(48, 45, 43, 41), amp=.05):
        B = self.T / 19.2   # 24 beats of .5s-ish scaled to T
        mel = melody or [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74]
        for i, m in enumerate(mel): self.marimba(i * self.T / len(mel), m, 2.2, amp)
        for i, m in enumerate(bass): self.marimba(i * self.T / len(bass), m, 3.5, amp * 1.2)
        t = np.arange(self.N) / SR
        for m, a in [(60, .02), (64, .014), (67, .016)]:
            f = round(self.mid(m) * self.T) / self.T
            self.out += a * np.sin(2*np.pi*f*t) * (.8 + .2*np.sin(2*np.pi*t/self.T*2))
    def save(self, path):
        o = self.out
        for dl, g in [(.19, .25), (.37, .16), (.61, .1)]: o = o + g * np.roll(o, int(dl * SR))
        o = o / (np.max(np.abs(o)) / .72)
        st = np.stack([o, np.roll(o, int(.011 * SR))], 1)
        with wave.open(path, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
