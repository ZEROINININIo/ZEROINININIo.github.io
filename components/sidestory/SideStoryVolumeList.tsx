
import React from 'react';
import { SideStoryVolume, Language } from '../../types';
import { Folder, Lock, AlertTriangle, HardDrive, VenetianMask, Star, Sparkles, CloudRain } from 'lucide-react';
import Reveal from '../Reveal';

interface SideStoryVolumeListProps {
  volumes: SideStoryVolume[];
  onSelectVolume: (volume: SideStoryVolume) => void;
  onOpenCharModal: () => void;
  language: Language;
  isLightTheme: boolean;
}

const SideStoryVolumeList: React.FC<SideStoryVolumeListProps> = ({ volumes, onSelectVolume, onOpenCharModal, language, isLightTheme }) => {
  return (
        <div className="h-full bg-halftone overflow-y-auto p-4 md:p-12 relative flex flex-col items-center">
            {/* Background Tech Lines */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-0 w-full h-px bg-ash-gray/50"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-ash-gray/50"></div>
                <div className="absolute top-0 left-1/4 h-full w-px bg-ash-gray/50"></div>
                <div className="absolute top-0 right-1/4 h-full w-px bg-ash-gray/50"></div>
            </div>

            {/* Floating Char Modal Button */}
            <button 
                onClick={onOpenCharModal}
                className="fixed bottom-24 right-4 md:absolute md:top-4 md:right-4 z-50 bg-ash-black border border-ash-gray p-3 text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light transition-all shadow-hard group"
                title="Personnel Archive"
            >
                <VenetianMask size={20} />
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-ash-dark text-ash-light text-[10px] font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-ash-gray hidden md:block">
                    PERSONNEL_DB
                </span>
            </button>

            <header className="relative z-10 mb-16 text-center w-full max-w-2xl mx-auto mt-8 md:mt-4">
                <div className="flex flex-col items-center gap-3">
                    <HardDrive size={40} className="text-ash-light" strokeWidth={1} />
                    <h1 className="text-3xl md:text-5xl font-black text-ash-light uppercase tracking-tighter glitch-text-heavy" data-text={language === 'en' ? 'SIDE_ARCHIVES' : '支线档案库'}>
                        {language === 'en' ? 'SIDE_ARCHIVES' : '支线档案库'}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-ash-gray border border-ash-gray/50 px-2 py-1 bg-ash-black/80">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                         STATUS: MOUNTED
                         <span className="mx-1">|</span>
                         /VAR/LIB/MEMORIES/SIDE_STORIES
                    </div>
                </div>
            </header>

            <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-4 pb-20">
                {volumes.map((volume, index) => {
                    const isLocked = volume.status === 'locked';
                    const isCorrupted = volume.status === 'corrupted';
                    const isSpecial = volume.id === 'VOL_MEMORIES';

                    // Light theme specific styles for states
                    const corruptedClass = isLightTheme 
                        ? 'bg-red-50 border-red-300 text-red-700' 
                        : 'bg-red-950/20 border-red-900 text-red-500';
                    
                    const lockedClass = isLightTheme
                        ? 'bg-zinc-200 border-zinc-300 text-zinc-500'
                        : 'bg-ash-dark/20 border-ash-dark text-ash-gray';

                    const normalClass = isLightTheme
                        ? 'bg-white border-zinc-300 text-zinc-800 hover:border-zinc-500 hover:shadow-lg'
                        : 'bg-ash-black/90 border-ash-gray text-ash-light group-hover:border-ash-light group-hover:bg-ash-dark/80 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]';

                    // Special Highlight Style (Cyan/Blue Theme)
                    const specialClass = isLightTheme
                        ? 'bg-sky-50 border-cyan-500 text-sky-900 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-2'
                        : 'bg-cyan-950/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-900/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-2';

                    return (
                        <Reveal key={volume.id} delay={index * 150} className={`w-full h-full ${isSpecial ? 'md:col-span-1' : ''}`}> 
                            <button
                                onClick={() => {
                                    if (!isLocked && !isCorrupted) {
                                        onSelectVolume(volume);
                                    }
                                }}
                                disabled={isLocked || isCorrupted}
                                className={`
                                    w-full h-64 relative group transition-all duration-300 transform
                                    flex flex-col text-left overflow-hidden
                                    ${isCorrupted 
                                        ? 'opacity-80' 
                                        : isLocked
                                            ? 'opacity-60'
                                            : 'cursor-pointer'
                                    }
                                `}
                            >
                                {/* Card Body (Skewed container with ClipPath) */}
                                <div 
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)' }}
                                    className={`
                                        absolute inset-0 border-2 transition-colors duration-300
                                        ${isCorrupted 
                                            ? corruptedClass 
                                            : isLocked
                                                ? lockedClass
                                                : isSpecial
                                                    ? specialClass
                                                    : normalClass
                                        }
                                    `}
                                >
                                    {/* Scanline Effect - Subtle in light mode */}
                                    <div className={`absolute inset-0 bg-transparent bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none ${isLightTheme ? 'opacity-5' : 'opacity-20'}`}></div>
                                    
                                    {/* Special Highlight Background Glow & Rain Effect */}
                                    {isSpecial && (
                                        <>
                                            {!isLightTheme && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none"></div>}
                                            
                                            {/* Local Rain Effect */}
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                                                {Array.from({ length: 12 }).map((_, i) => (
                                                    <div 
                                                        key={i}
                                                        className={`absolute w-[1.5px] bg-gradient-to-b from-transparent ${isLightTheme ? 'via-cyan-600' : 'via-cyan-300'} to-transparent`}
                                                        style={{
                                                            height: `${20 + Math.random() * 40}%`,
                                                            left: `${Math.random() * 100}%`,
                                                            top: '-20%',
                                                            // Using dataRainCard to prevent full viewport traversal on mobile
                                                            animation: `dataRainCard ${1.5 + Math.random() * 1.5}s linear infinite`,
                                                            animationDelay: `${Math.random() * 2}s`,
                                                            willChange: 'transform' // GPU acceleration for mobile
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Special Label */}
                                    {isSpecial && (
                                        <div className={`absolute top-0 right-0 z-30 px-3 py-1 text-[10px] font-bold font-mono border-b-2 border-l-2 flex items-center gap-1 ${isLightTheme ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : 'bg-cyan-950 text-cyan-400 border-cyan-500/50'}`}>
                                            <Sparkles size={10} className="animate-pulse" />
                                            FEATURED
                                        </div>
                                    )}
                                    
                                    {/* Content */}
                                    <div className="p-6 h-full flex flex-col relative z-20">
                                        <div className="flex justify-between items-start mb-auto">
                                            {isSpecial ? (
                                                <div className="relative">
                                                    <CloudRain size={32} strokeWidth={1} className="text-cyan-500 relative z-10" />
                                                    <Star size={16} className="text-cyan-300 absolute -top-1 -right-1 animate-spin-slow" />
                                                </div>
                                            ) : (
                                                <Folder size={32} strokeWidth={1} className={isCorrupted ? 'animate-pulse' : ''} />
                                            )}
                                            
                                            <div className="text-[10px] font-mono border border-current px-1 opacity-70">
                                                VOL_0{index + 1}
                                            </div>
                                        </div>

                                        <div className="space-y-1 mt-4">
                                            <h3 className={`font-black text-xl md:text-2xl font-mono uppercase tracking-tight leading-none ${isCorrupted ? 'blur-[1px]' : ''} ${isSpecial ? (isLightTheme ? 'text-cyan-700' : 'text-cyan-100 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]') : ''}`}>
                                                {language === 'en' ? volume.titleEn : volume.title}
                                            </h3>
                                            <div className={`text-[10px] font-mono uppercase tracking-widest ${isSpecial ? 'opacity-80' : 'opacity-50'}`}>
                                                {volume.titleEn}
                                            </div>
                                        </div>

                                        {/* Footer Metadata */}
                                        <div className="mt-6 pt-4 border-t border-dashed border-current/30 flex justify-between items-end text-[10px] font-mono">
                                            <div className="flex flex-col gap-1">
                                                <span>SIZE: {volume.chapters.length * 128}KB</span>
                                                <span className="flex items-center gap-1">
                                                    STATUS: 
                                                    {isCorrupted ? 'ERR' : isLocked ? 'LCK' : 'RDY'}
                                                </span>
                                            </div>
                                            {isCorrupted ? <AlertTriangle size={16} /> : isLocked ? <Lock size={16} /> : <div className="w-16 h-2 bg-current opacity-20 relative"><div className="absolute left-0 top-0 h-full bg-current w-1/2"></div></div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Corners (Visual Flair) - Standard border colors */}
                                {!isLocked && !isCorrupted && (
                                    <>
                                        <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSpecial ? 'border-cyan-400' : (isLightTheme ? 'border-zinc-800' : 'border-ash-light')}`}></div>
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSpecial ? 'border-cyan-400' : (isLightTheme ? 'border-zinc-800' : 'border-ash-light')}`}></div>
                                    </>
                                )}
                            </button>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
};

export default SideStoryVolumeList;
