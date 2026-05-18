import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Category = "Cosmic" | "Horror" | "Fantasy" | "Sci-Fi" | "Abstract" | "Mythological";

type AudioMode = "ambient" | "transition" | "ui";

type CategoryPreset = {
  baseFreq: number;
  layerFreqs: number[];
  harmonyFreqs: number[];
  waveform: OscillatorType;
  gain: number;
  detune: number;
  color: string;
};

type AudioContextValue = {
  playCategory: (cat: Category) => Promise<void>;
  stopCategory: () => void;
  playSfx: (name: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

const categoryMap: Record<Category, CategoryPreset> = {
  Cosmic: { baseFreq: 72, layerFreqs: [36, 54, 96], harmonyFreqs: [144, 216], waveform: "sine", gain: 0.12, detune: 8, color: "rgba(128,89,255,0.5)" },
  Horror: { baseFreq: 48, layerFreqs: [24, 31, 62], harmonyFreqs: [111, 166], waveform: "sawtooth", gain: 0.08, detune: 18, color: "rgba(130,20,20,0.45)" },
  Fantasy: { baseFreq: 196, layerFreqs: [98, 147, 294], harmonyFreqs: [392, 588], waveform: "triangle", gain: 0.1, detune: 4, color: "rgba(46,204,113,0.42)" },
  "Sci-Fi": { baseFreq: 110, layerFreqs: [55, 82.5, 220], harmonyFreqs: [330, 440], waveform: "square", gain: 0.085, detune: 12, color: "rgba(58,175,255,0.42)" },
  Abstract: { baseFreq: 130, layerFreqs: [65, 130, 260], harmonyFreqs: [195, 390], waveform: "triangle", gain: 0.075, detune: 22, color: "rgba(214,120,255,0.4)" },
  Mythological: { baseFreq: 146, layerFreqs: [73, 109.5, 219], harmonyFreqs: [292, 438], waveform: "sine", gain: 0.11, detune: 6, color: "rgba(255,200,72,0.45)" },
};

const sfxMap: Record<string, string> = {
  click: "/assets/sounds/ui/click.mp3",
  hover: "/assets/sounds/ui/hover.mp3",
  transition: "/assets/sounds/ui/transition.mp3",
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const currentSourceRef = useRef<{ stop?: () => void } | null>(null);
  const [volume, setVolumeState] = useState<number>(0.6);
  const [muted, setMuted] = useState<boolean>(false);
  const uiAudioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      masterGainRef.current = gain;
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }

    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = muted ? 0 : volume;
  }, [volume, muted]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(muted ? 0 : v, audioCtxRef.current.currentTime + 0.15);
    }
  };

  const createSynth = (preset: CategoryPreset, mode: AudioMode) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return null;

    const output = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = mode === "ui" ? "highpass" : "lowpass";
    filter.frequency.value = mode === "ui" ? 500 : 1200;
    filter.Q.value = mode === "transition" ? 0.8 : 0.3;
    output.connect(filter);
    filter.connect(master);

    const oscillators = [...preset.layerFreqs, preset.baseFreq, ...preset.harmonyFreqs].map((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = preset.waveform;
      osc.frequency.value = frequency;
      osc.detune.value = (index % 2 === 0 ? -1 : 1) * preset.detune * (index + 1);
      gain.gain.value = mode === "transition" ? 0.03 : index === 0 ? preset.gain : preset.gain * 0.45;
      osc.connect(gain);
      gain.connect(output);
      osc.start();
      return { osc, gain };
    });

    let raf = 0;
    const animate = () => {
      if (!ctx || !output) return;
      const t = ctx.currentTime;
      const pulse = 0.5 + Math.sin(t * 0.9) * 0.5;
      output.gain.value = muted ? 0 : volume * (mode === "ui" ? 0.4 : 1) * (mode === "transition" ? 0.7 : 1) * (0.85 + pulse * 0.15);
      raf = window.setTimeout(animate, 120) as unknown as number;
    };
    animate();

    return {
      stop: () => {
        if (raf) window.clearTimeout(raf);
        for (const item of oscillators) {
          try {
            item.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
            item.osc.stop(ctx.currentTime + 0.22);
          } catch {}
        }
        try { output.disconnect(); filter.disconnect(); } catch {}
      },
    };
  };

  const playCategory = async (cat: Category) => {
    stopCategory();

    try {
      const preset = categoryMap[cat];
      if (!preset) return;
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") await audioCtxRef.current.resume();
      currentSourceRef.current = createSynth(preset, "ambient");
    } catch (e) {
      console.warn("Autoplay prevented or audio play failed", e);
    }
  };

  const stopCategory = () => {
    const source = currentSourceRef.current;
    if (!source) return;
    try {
      source.stop?.();
    } catch (e) {}
    currentSourceRef.current = null;
  };

  const playSfx = (name: string) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterGainRef.current) return;

    if (name === "hover" || name === "click" || name === "transition") {
      const preset = name === "transition" ? categoryMap["Sci-Fi"] : name === "hover" ? categoryMap["Fantasy"] : categoryMap["Cosmic"];
      const mode: AudioMode = name === "transition" ? "transition" : "ui";
      const source = createSynth(preset, mode);
      if (!source) return;
      currentSourceRef.current = source;
      window.setTimeout(() => source.stop?.(), name === "transition" ? 900 : 180);
      return;
    }

    const url = sfxMap[name];
    if (!url) return;
    const el = new Audio(url);
    el.crossOrigin = "anonymous";
    el.volume = Math.min(1, Math.max(0, volume));
    el.play().catch(() => {});
  };

  const toggleMute = () => setMuted((m) => !m);

  const value: AudioContextValue = {
    playCategory: playCategory as any,
    stopCategory,
    playSfx,
    volume,
    setVolume,
    muted,
    toggleMute,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
};

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export type { Category };
