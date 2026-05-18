import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Category = "Cosmic" | "Horror" | "Fantasy" | "Sci-Fi" | "Abstract" | "Mythological";

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

const categoryMap: Record<Category, string[]> = {
  Cosmic: ["/assets/sounds/cosmic/ambient-loop.mp3"],
  Horror: ["/assets/sounds/horror/ambient-loop.mp3"],
  Fantasy: ["/assets/sounds/fantasy/ambient-loop.mp3"],
  "Sci-Fi": ["/assets/sounds/scifi/ambient-loop.mp3"],
  Abstract: ["/assets/sounds/abstract/ambient-loop.mp3"],
  Mythological: ["/assets/sounds/mythological/ambient-loop.mp3"],
};

const sfxMap: Record<string, string> = {
  click: "/assets/sounds/ui/click.mp3",
  hover: "/assets/sounds/ui/hover.mp3",
  transition: "/assets/sounds/ui/transition.mp3",
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState<number>(0.6);
  const [muted, setMuted] = useState<boolean>(false);

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
    if (masterGainRef.current) masterGainRef.current.gain.linearRampToValueAtTime(v, audioCtxRef.current!.currentTime + 0.1);
  };

  const connectAudioElement = (el: HTMLAudioElement) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    try {
      const src = audioCtxRef.current.createMediaElementSource(el);
      src.connect(masterGainRef.current);
    } catch (e) {
      // creating multiple sources may throw; ignore
    }
  };

  const playCategory = async (cat: Category) => {
    stopCategory();

    const urls = categoryMap[cat];
    if (!urls || urls.length === 0) return;

    const el = new Audio(urls[0]);
    el.loop = true;
    el.crossOrigin = "anonymous";
    currentSourceRef.current = el;

    connectAudioElement(el);

    try {
      // resume context if suspended (user gesture may be required)
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      await el.play();
      if (masterGainRef.current) masterGainRef.current.gain.setValueAtTime(muted ? 0 : volume, audioCtxRef.current!.currentTime);
    } catch (e) {
      console.warn("Autoplay prevented or audio play failed", e);
    }
  };

  const stopCategory = () => {
    const el = currentSourceRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch (e) {}
    currentSourceRef.current = null;
  };

  const playSfx = (name: string) => {
    const url = sfxMap[name];
    if (!url) return;
    const el = new Audio(url);
    el.crossOrigin = "anonymous";
    connectAudioElement(el);
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
