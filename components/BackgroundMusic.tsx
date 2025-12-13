
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Volume1, Activity, Music, Disc, AlertCircle, Loader2 } from 'lucide-react';

interface BackgroundMusicProps {
    isSetupMode?: boolean;
    isPlaying: boolean;
    onToggle: () => void;
    volume: number;
    onVolumeChange: (val: number) => void;
    audioSrc?: string | null;
    trackTitle?: string;
    trackComposer?: string;
    className?: string;
}

const FADE_OUT_DURATION = 1500; // ms to fade out old track
const FADE_IN_DURATION = 2000;  // ms to fade in new track
const TOGGLE_FADE_DURATION = 800; // ms for pause/play toggle

// Global singleton to persist audio across component unmounts
let globalAudio: HTMLAudioElement | null = null;

const getGlobalAudio = () => {
    if (!globalAudio) {
        globalAudio = new Audio();
        globalAudio.loop = true;
        globalAudio.preload = 'auto'; 
    }
    return globalAudio;
};

// Helper to unlock audio context on user interaction
export const unlockGlobalAudio = () => {
    const audio = getGlobalAudio();
    if (audio.paused) {
        // Try to play silence or empty promise to unlock the audio engine on mobile/browsers
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.pause(); 
            }).catch(e => {
                console.log("Audio unlock attempt:", e);
            });
        }
    }
};

// Helper to reliably get absolute URL for comparison
const getAbsoluteUrl = (url: string): string => {
    try {
        if (/^https?:\/\//i.test(url) || /^\/\//.test(url)) return url;
        if (typeof window !== 'undefined' && window.location) {
            return new URL(url, window.location.href).href;
        }
        return url;
    } catch (e) {
        return url;
    }
};

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ 
    isSetupMode = false,
    isPlaying,
    onToggle,
    volume,
    onVolumeChange,
    audioSrc = null,
    trackTitle = "UNKNOWN",
    trackComposer = "UNKNOWN",
    className = ""
}) => {
  const fadeIntervalRef = useRef<number | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Advanced Volume Fader (Returns Promise)
  const performFade = (targetVol: number, duration: number): Promise<void> => {
      return new Promise((resolve) => {
          const audio = getGlobalAudio();
          if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);

          const startVol = audio.volume;
          const diff = targetVol - startVol;
          
          // Optimization: If difference is negligible, snap to target
          if (Math.abs(diff) < 0.01) {
              audio.volume = targetVol;
              resolve();
              return;
          }

          const startTime = Date.now();
          fadeIntervalRef.current = window.setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Linear Fade
              audio.volume = Math.max(0, Math.min(1, startVol + (diff * progress)));

              if (progress >= 1) {
                  if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
                  audio.volume = targetVol;
                  resolve();
              }
          }, 50);
      });
  };

  // 1. Initialize Listeners
  useEffect(() => {
    const audio = getGlobalAudio();

    const handleCanPlay = () => {
        setIsLoading(false);
        setError(false);
        // Play is handled in the source transition logic or toggle logic
    };

    const handleError = (e: Event) => {
        console.warn("Audio Error:", e);
        setError(true);
        setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
        setIsLoading(false);
        setError(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // 2. Handle Source Switching with Fade Out -> Switch -> Fade In
  useEffect(() => {
    const audio = getGlobalAudio();
    const newAbsSrc = audioSrc ? getAbsoluteUrl(audioSrc) : null;
    const currentAbsSrc = currentSrcRef.current ? getAbsoluteUrl(currentSrcRef.current) : null;

    // Prevent re-running if URL hasn't effectively changed
    if (newAbsSrc === currentAbsSrc) return;
    
    currentSrcRef.current = audioSrc;

    const switchTrack = async () => {
        setIsLoading(true);
        setError(false);

        // Step 1: Fade Out existing track if playing
        if (!audio.paused && audio.volume > 0) {
            await performFade(0, FADE_OUT_DURATION);
            audio.pause();
        } else {
            audio.volume = 0; // Ensure we start at 0 for the new track
        }

        // Step 2: Switch Source
        if (newAbsSrc) {
            audio.src = newAbsSrc;
            audio.load();
            
            // Step 3: Play and Fade In (if global playing state is true)
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            performFade(volume, FADE_IN_DURATION);
                        })
                        .catch(e => {
                            console.warn("Auto-play blocked or load error", e);
                            setIsLoading(false);
                        });
                }
            }
        } else {
            audio.removeAttribute('src');
            setIsLoading(false);
        }
    };

    switchTrack();

  }, [audioSrc]);

  // 3. Handle Play/Pause Toggle with Fades
  useEffect(() => {
      const audio = getGlobalAudio();
      
      // If we are currently loading/switching sources, the source effect handles the play state.
      // This effect is mainly for manual toggles or initial mount.
      
      if (!audio.src) return;

      if (isPlaying) {
          if (audio.paused) {
              // Fade In
              audio.volume = 0; // Start from silence
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                  playPromise
                    .then(() => performFade(volume, TOGGLE_FADE_DURATION))
                    .catch(e => console.warn("Toggle play failed", e));
              }
          } else {
              // Already playing, just ensure volume matches (e.g. after a fade in finished)
              // But don't interrupt a fade in progress unless volume changed drastically
              if (Math.abs(audio.volume - volume) > 0.1) {
                  performFade(volume, 500);
              }
          }
      } else {
          if (!audio.paused) {
              // Fade Out then Pause
              performFade(0, TOGGLE_FADE_DURATION).then(() => {
                  if (!isPlaying) audio.pause(); // Double check state hasn't flipped back
              });
          }
      }
  }, [isPlaying]);

  // 4. Handle Volume Slider Drag
  // We don't want to trigger a long fade when dragging the slider, but a quick smooth adjustment is nice.
  useEffect(() => {
      const audio = getGlobalAudio();
      if (isPlaying && !audio.paused && !isLoading) {
          // Quick adjustment
          performFade(volume, 200); 
      }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(parseFloat(e.target.value));
  };

  const isDisabled = !audioSrc || error;

  if (isSetupMode) {
    return (
       <div className={`flex flex-col gap-1 w-full ${className}`}>
           <button 
               onClick={onToggle}
               className={`w-full flex items-center justify-between p-3 border font-mono text-xs transition-colors ${
                   isPlaying 
                   ? 'border-amber-500 bg-amber-500/20 text-amber-400' 
                   : 'border-amber-800/50 text-amber-800 hover:border-amber-600 hover:text-amber-600'
               }`}
           >
               <span className="flex items-center gap-2"><Music size={14} /> AUDIO_SYSTEM</span>
               {isPlaying ? <Activity size={14} className="animate-pulse" /> : <span>OFF</span>}
           </button>
       </div>
    );
 }

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
        <button 
        onClick={onToggle}
        disabled={isDisabled && !isPlaying} 
        className={`flex items-center justify-between w-full px-3 py-3 border-2 transition-all duration-300 shadow-hard group
            ${isDisabled 
                ? 'bg-ash-black text-ash-gray border-ash-gray/30 cursor-not-allowed opacity-70'
                : isPlaying 
                    ? 'bg-ash-light text-ash-black border-ash-light' 
                    : 'bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    {isLoading ? <Loader2 size={16} className="animate-spin text-ash-gray" /> :
                     error ? <AlertCircle size={16} className="text-red-500" /> : 
                     isPlaying && !isDisabled ? <Disc size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase truncate max-w-[80px] md:max-w-none">
                    {isLoading ? 'BUFFER...' : 'BGM'}
                </span>
            </div>
            
            <div className="flex items-center gap-2">
                {error ? (
                    <span className="text-[10px] font-mono font-bold text-red-500 animate-pulse">ERR</span>
                ) : isPlaying && !isDisabled ? (
                    <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-current animate-[bounce_1s_infinite] h-2"></div>
                        <div className="w-0.5 bg-current animate-[bounce_1.2s_infinite] h-3"></div>
                        <div className="w-0.5 bg-current animate-[bounce_0.8s_infinite] h-1"></div>
                    </div>
                ) : (
                    <span className="text-[10px] font-mono font-bold">
                        {isDisabled ? 'N/A' : 'OFF'}
                    </span>
                )}
            </div>
        </button>
        
        {isPlaying && !isDisabled && (
            <div className="flex flex-col gap-2 px-3 py-2 border-l-2 border-ash-light bg-ash-dark/80 backdrop-blur-sm animate-fade-in shadow-hard-sm">
                <div className="flex justify-between items-center text-[9px] font-mono text-ash-gray">
                    <span className="truncate max-w-[60%]">{trackTitle}</span>
                    <span className="opacity-50 truncate max-w-[35%] text-right">{trackComposer}</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <Volume1 size={10} className="text-ash-gray" />
                    <input 
                       type="range" 
                       min="0" 
                       max="1" 
                       step="0.01" 
                       value={volume}
                       onChange={handleVolumeChange}
                       className="flex-1 h-1 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-ash-light [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ash-black hover:[&::-webkit-slider-thumb]:bg-ash-white transition-all"
                    />
                </div>
            </div>
        )}
    </div>
  );
};

export default BackgroundMusic;
