import { useState } from "react";
import { Volume, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/audio";

export default function AudioControl() {
  const { volume, setVolume, muted, toggleMute } = useAudio();
  const [local, setLocal] = useState(volume);

  return (
    <div className="flex items-center gap-3">
      <button onClick={toggleMute} className="p-2 rounded-md hover:bg-white/5">
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume className="w-4 h-4" />}
      </button>
      <input
        aria-label="volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={local}
        onChange={(e) => { const v = Number(e.target.value); setLocal(v); setVolume(v); }}
        className="w-24"
      />
    </div>
  );
}
