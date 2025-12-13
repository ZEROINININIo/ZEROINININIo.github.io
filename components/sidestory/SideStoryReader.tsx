
import React, { useState, useRef, useEffect } from 'react';
import { SideStoryVolume, Language, ChapterTranslation } from '../../types';
import { ArrowLeft, List, ShieldAlert, FileText, ChevronLeft, ChevronRight, Activity, Image as ImageIcon, AlertTriangle, Loader2, Eye } from 'lucide-react';
import Reveal from '../Reveal';
import MaskedText from '../MaskedText';
import { ReaderFont, getFontClass } from '../fonts/fontConfig';

// --- Internal Reader Logic (Shared with ReaderPage) ---
const VoidLog: React.FC<{ lines: string[] }> = ({ lines }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Reveal>
      <div className="my-10 border-l-4 border-fuchsia-600 bg-fuchsia-950/10 font-mono text-xs md:text-sm shadow-[0_0_15px_-3px_rgba(192,38,211,0.2)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 md:p-4 bg-fuchsia-950/20 hover:bg-fuchsia-900/30 text-fuchsia-300 font-bold flex items-center gap-3 transition-all group border-b border-fuchsia-500/20"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
             <AlertTriangle size={16} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
             <span className="animate-pulse tracking-widest text-fuchsia-400">&gt;&gt;&gt; SYSTEM_INTERCEPT // VOID_SIDE</span>
             <span className="text-[10px] bg-fuchsia-900/50 px-1 border border-fuchsia-500/30 text-fuchsia-200/70">
                SOURCE: UNKNOWN
             </span>
          </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 md:p-6 text-fuchsia-100/90 space-y-2 leading-relaxed tracking-wide font-medium bg-black/20 backdrop-blur-sm">
              {lines.map((line, i) => (
                    <p key={i} className="border-l border-fuchsia-500/20 pl-3 hover:border-fuchsia-500 hover:bg-fuchsia-500/5 transition-colors duration-300">
                        {line.replace(/0000\.2Void>>|【插入结束】|【插入結束】|\[INSERTION_END\]/g, '')}
                    </p>
              ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

// Updated Helper to parse inline tags like [[MASK::...]] and [[GLITCH_GREEN::...]]
const parseRichText = (text: string) => {
  const parts = text.split(/(\[\[(?:MASK|GLITCH_GREEN)::.*?\]\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[[MASK::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return <MaskedText key={index}>{content}</MaskedText>;
    } else if (part.startsWith('[[GLITCH_GREEN::') && part.endsWith(']]')) {
      const content = part.slice(16, -2);
      return (
        <span key={index} className="text-emerald-400 font-black tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] inline-block animate-pulse relative px-1">
            <span className="absolute inset-0 animate-ping opacity-30 blur-sm bg-emerald-500/20 rounded-full"></span>
            <span className="relative z-10">{content}</span>
        </span>
      );
    }
    return part;
  });
};

interface SideStoryReaderProps {
  volume: SideStoryVolume;
  initialChapterIndex: number;
  onBack: () => void;
  language: Language;
  isLightTheme: boolean;
  readerFont: ReaderFont;
}

const SideStoryReader: React.FC<SideStoryReaderProps> = ({ volume, initialChapterIndex, onBack, language, isLightTheme, readerFont }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Responsive sidebar check
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  // Scroll reset
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [currentChapterIndex]);

  const currentChapter = volume.chapters[currentChapterIndex];
  const translation: ChapterTranslation = currentChapter.translations[language] || currentChapter.translations['zh-CN'];
  const isLegacy = currentChapter.id === 'special-legacy-dusk';

  // Content Renderer
  const renderContent = (text: string) => {
    // Helper to join lines smartly (CJK vs Latin)
    const smartJoin = (lines: string[]) => {
      if (lines.length === 0) return '';
      return lines.reduce((acc, curr, idx) => {
        if (idx === 0) return curr;
        const prev = lines[idx - 1];
        const prevChar = prev[prev.length - 1];
        const currChar = curr[0];
        
        // Regex to detect CJK characters and fullwidth punctuation
        const cjkRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
        const isPrevCJK = cjkRegex.test(prevChar);
        const isCurrCJK = cjkRegex.test(currChar);

        if (isPrevCJK || isCurrCJK) {
            return acc + curr;
        }
        return acc + ' ' + curr;
      }, '');
    };

    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let textBuffer: string[] = [];
    let inVoidBlock = false;
    let voidBuffer: string[] = [];

    const flushTextBuffer = () => {
        if (textBuffer.length > 0) {
            const joinedText = smartJoin(textBuffer);
            
            // Default Styling Logic
            let className = `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-ash-light transition-colors ${getFontClass(readerFont)}`;
            
            // Legacy Overwrite: Force specific style for legacy chapter text
            if (isLegacy) {
                className = isLightTheme
                    ? "mb-6 md:mb-8 text-justify indent-8 md:indent-12 font-mono text-sm md:text-base leading-relaxed text-blue-900 legacy-text"
                    : "mb-6 md:mb-8 text-justify indent-8 md:indent-12 font-mono text-sm md:text-base leading-relaxed text-blue-200 legacy-text";
            } else {
                // Standard Logic for other chapters
                if (joinedText.startsWith('零点') || joinedText.startsWith('Point') || joinedText.startsWith('零點')) {
                    className = isLightTheme
                        ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-zinc-600 font-bold ${getFontClass(readerFont)}`
                        : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] ${getFontClass(readerFont)}`;
                } else if (joinedText.startsWith('芷漓') || joinedText.startsWith('Zeri')) {
                    className = isLightTheme
                        ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-pink-600 ${getFontClass(readerFont)}`
                        : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-pink-400 drop-shadow-[0_0_2px_rgba(244,114,182,0.4)] ${getFontClass(readerFont)}`;
                } else if (joinedText.startsWith('泽洛') || joinedText.startsWith('Zelo') || joinedText.startsWith('澤洛')) {
                    className = isLightTheme
                        ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-600 ${getFontClass(readerFont)}`
                        : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-400 drop-shadow-[0_0_2px_rgba(96,165,250,0.4)] ${getFontClass(readerFont)}`;
                } else if (joinedText.startsWith('???') || joinedText.startsWith('Void') || joinedText.includes('void') || joinedText.includes('Void')) {
                    className = isLightTheme
                        ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-zinc-900 font-bold ${getFontClass(readerFont)}`
                        : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] ${getFontClass(readerFont)}`;
                } else if (joinedText.startsWith('终端') || joinedText.startsWith('TERMINAL') || joinedText.startsWith('終端')) {
                    className = isLightTheme
                        ? "mb-6 md:mb-8 text-justify indent-8 md:indent-12 font-mono text-sm md:text-base leading-relaxed text-emerald-700 font-bold"
                        : "mb-6 md:mb-8 text-justify indent-8 md:indent-12 font-mono text-sm md:text-base leading-relaxed text-emerald-500 font-bold";
                }
            }

            nodes.push(
                <Reveal key={`p-${nodes.length}`}>
                    <p className={className}>
                        {parseRichText(joinedText)}
                    </p>
                </Reveal>
            );
            textBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Check for Void Block
        const isVoidStart = trimmed.includes('0000.2Void>>');
        const isVoidEnd = trimmed.includes('【插入结束】') || trimmed.includes('【插入結束】') || trimmed.includes('[INSERTION_END]');

        if (isVoidStart) {
            flushTextBuffer(); // Flush any preceding text
            inVoidBlock = true;
            voidBuffer = []; // Start new buffer
            voidBuffer.push(line);
            
            if (isVoidEnd) {
                inVoidBlock = false;
                nodes.push(<VoidLog key={`void-${i}`} lines={[...voidBuffer]} />);
                voidBuffer = [];
            }
            continue;
        }

        if (inVoidBlock) {
            voidBuffer.push(line);
            if (isVoidEnd) {
                inVoidBlock = false;
                nodes.push(<VoidLog key={`void-${i}`} lines={[...voidBuffer]} />);
                voidBuffer = [];
            }
            continue;
        }

        // 2. Special Elements
        const blueMatch = trimmed.match(/^\[\[BLUE::(.*?)\]\]$/);
        const dangerMatch = trimmed.match(/^\[\[DANGER::(.*?)\]\]$/);
        const voidVisionMatch = trimmed.match(/^\[\[VOID_VISION::(.*?)\]\]$/);
        const isDivider = trimmed === '[[DIVIDER]]';
        const isImage = /\[\[IMAGE::(.*?)::(.*?)\]\]/.test(trimmed);
        const isEmpty = !trimmed;

        if (blueMatch || dangerMatch || voidVisionMatch || isDivider || isImage || isEmpty) {
            flushTextBuffer(); 
            
            if (blueMatch) {
                 const blueClass = isLightTheme 
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-600 font-bold ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-400 font-bold ${getFontClass(readerFont)}`;
                nodes.push(
                    <Reveal key={`blue-${i}`}>
                        <p className={blueClass}>
                            {parseRichText(blueMatch[1])}
                        </p>
                    </Reveal>
                );
            } else if (dangerMatch) {
                const dangerClass = isLightTheme
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-red-600 font-black animate-crash origin-left ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-red-500 font-black animate-crash origin-left ${getFontClass(readerFont)}`;
                nodes.push(
                    <Reveal key={`danger-${i}`}>
                        <p className={dangerClass}>
                            {parseRichText(dangerMatch[1])}
                        </p>
                    </Reveal>
                );
            } else if (voidVisionMatch) {
                const content = voidVisionMatch[1];
                const isRedacted = content.includes('█');
                
                // New Void Vision Effect
                nodes.push(
                    <Reveal key={`void-vis-${i}`} className="my-8 w-full max-w-2xl mx-auto">
                        <div className="relative border-y border-fuchsia-900/50 bg-black/80 p-6 backdrop-blur-sm overflow-hidden group select-none shadow-[0_0_30px_-10px_rgba(192,38,211,0.3)]">
                             {/* Background Glitch Elements */}
                             <div className="absolute inset-0 bg-fuchsia-900/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                             <div className="absolute top-0 left-0 w-0.5 h-full bg-fuchsia-500/50 box-shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
                             <div className="absolute top-0 right-0 w-0.5 h-full bg-fuchsia-500/50 box-shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
                             
                             {/* Label Header */}
                             <div className="flex items-center justify-between mb-4 border-b border-fuchsia-900/30 pb-2">
                                <div className="text-[10px] font-mono text-fuchsia-600 tracking-[0.2em] flex items-center gap-2">
                                     <Eye size={12} className="animate-pulse" /> RETINAL_PROJECTION
                                </div>
                                <div className="text-[10px] font-black font-mono bg-fuchsia-100 text-fuchsia-950 px-2 py-0.5 tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse">
                                    SOURCE: VOID
                                </div>
                             </div>
                             
                             {/* Content - Conditional Styling */}
                             <div className="relative z-10">
                                 <div 
                                    className={`
                                        text-center leading-relaxed tracking-wide
                                        ${isRedacted 
                                            ? 'text-fuchsia-500 font-mono text-sm md:text-base break-all animate-shake-violent opacity-70 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]' 
                                            : 'text-white font-serif italic text-lg md:text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                                        }
                                    `}
                                 >
                                     "{content}"
                                 </div>
                             </div>

                             {/* Decorative Scanline - White for brightness */}
                             <div className="absolute top-0 left-0 w-full h-[2px] bg-white/30 shadow-[0_0_15px_rgba(255,255,255,1)] animate-scanline pointer-events-none mix-blend-overlay"></div>
                        </div>
                    </Reveal>
                );
            } else if (isDivider) {
                nodes.push(
                    <Reveal key={`div-${i}`}>
                        <div className="my-12 flex items-center justify-center gap-4 opacity-50 select-none">
                        <div className="h-px bg-ash-light flex-1 bg-gradient-to-r from-transparent via-ash-light to-transparent" />
                        <Activity size={16} className="text-ash-light animate-pulse" />
                        <div className="h-px bg-ash-light flex-1 bg-gradient-to-r from-transparent via-ash-light to-transparent" />
                        </div>
                    </Reveal>
                );
            } else if (isImage) {
                const imageMatch = trimmed.match(/\[\[IMAGE::(.*?)::(.*?)\]\]/);
                if (imageMatch) {
                    const [_, src, caption] = imageMatch;
                    nodes.push(
                        <Reveal key={`img-${i}`} className="my-12 flex flex-col items-center w-full">
                            <div className="relative border-4 border-ash-light p-2 bg-ash-dark max-w-full shadow-hard">
                                <img src={src} alt={caption} className="relative max-h-[600px] w-auto object-cover block grayscale-[20%] hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
                                <div className="absolute bottom-4 right-4 bg-ash-light text-ash-black px-3 py-1 text-[10px] font-mono font-bold border-2 border-ash-black flex items-center gap-2 uppercase">
                                <ImageIcon size={12} /> {caption}
                                </div>
                            </div>
                        </Reveal>
                    );
                }
            }
            continue;
        }

        textBuffer.push(trimmed);
    }
    flushTextBuffer();
    return nodes;
  };

  return (
    <div className="flex h-full relative overflow-hidden bg-retro-paper text-zinc-950">
        {/* Mobile Backdrop for Sidebar */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-10 md:hidden animate-fade-in"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <aside 
            className={`absolute md:relative z-20 h-full bg-ash-black border-r-4 border-ash-dark transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${
            isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:-translate-x-0 overflow-hidden'
            }`}
        >
            <div className={`p-4 border-b-2 border-ash-gray bg-ash-black text-ash-light flex justify-between items-center shrink-0 ${isLegacy ? 'border-dashed' : ''}`}>
                 <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-mono hover:text-ash-gray transition-colors"
                 >
                    <ArrowLeft size={14} /> {language === 'en' ? 'FILE_LIST' : '文件列表'}
                 </button>
                 <div className="text-[10px] font-mono opacity-50 truncate max-w-[100px]">
                    {language === 'en' ? volume.titleEn : volume.title}
                 </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-0">
                {volume.chapters.map((chapter, index) => {
                    const chapTitle = chapter.translations[language]?.title || chapter.translations['zh-CN'].title;
                    const isLocked = chapter.status === 'locked';
                    return (
                        <button
                            key={chapter.id}
                            onClick={() => {
                                if(!isLocked) {
                                    setCurrentChapterIndex(index);
                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }
                            }}
                            disabled={isLocked}
                            className={`w-full text-left p-4 text-xs font-mono border-b border-ash-dark transition-none group relative overflow-hidden ${
                                index === currentChapterIndex
                                    ? (isLegacy ? 'bg-blue-950/50 text-blue-200 border-blue-500/50' : 'bg-ash-light text-ash-black')
                                    : isLocked ? 'bg-ash-dark/10 text-ash-gray cursor-not-allowed' : 'text-ash-gray hover:bg-ash-dark hover:text-ash-white'
                            }`}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <span className={`font-bold truncate uppercase max-w-[85%] ${isLegacy && index === currentChapterIndex ? 'legacy-text' : ''}`}>
                                        {index === currentChapterIndex && <span className="mr-2">&gt;</span>}{chapTitle}
                                    </span>
                                    {isLocked && <ShieldAlert size={12} className="opacity-70" />}
                                </div>
                            </div>
                            {isLocked && (
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] pointer-events-none z-0"></div>
                            )}
                        </button>
                    )
                })}
            </div>
        </aside>

        {/* Sidebar Toggle */}
        {!isSidebarOpen && (
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-4 left-4 z-10 p-2 bg-ash-black text-ash-light border-2 border-ash-light hover:bg-ash-light hover:text-ash-black shadow-hard"
            >
                <List size={20} />
            </button>
        )}

        {/* Main Reader Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth relative bg-ash-black">
             <div 
                key={currentChapter.id} 
                className={`max-w-4xl mx-auto min-h-full bg-ash-black border-l-0 md:border-l-2 md:border-r-2 border-ash-dark/50 shadow-2xl relative animate-slide-in ${isLegacy ? 'border-dashed border-blue-900/30' : ''}`}
             >
                 {currentChapter.status === 'locked' ? (
                     <div className="h-[80vh] flex flex-col items-center justify-center text-ash-gray p-8 text-center">
                         <div className="mb-6 p-6 border-4 border-dashed border-red-900/50 rounded-none bg-red-950/10 w-full max-w-md">
                            <Activity size={64} className="text-red-800 mb-4 mx-auto animate-pulse" />
                            <h2 className="text-2xl font-black uppercase text-red-700 tracking-widest mb-2">
                                {language === 'en' ? 'DATA_CORRUPTED' : '数据损坏'}
                            </h2>
                            <p className="font-mono text-sm text-red-900/70 mb-6">ERR_READ_SECTOR // UNRECOVERABLE</p>
                            
                            <div className="border-t border-red-900/30 pt-4 w-full">
                                <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-xs animate-pulse">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>
                                        {language === 'en' ? 'REPAIRING...' : 
                                         language === 'zh-TW' ? '正在修復中...' : '正在修复中...'}
                                    </span>
                                </div>
                                <div className="w-full bg-red-950/50 h-1 mt-2 overflow-hidden">
                                    <div className="h-full bg-red-800/60 w-1/3 animate-[pulse_1s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
                                </div>
                            </div>
                        </div>
                     </div>
                 ) : (
                    <>
                        {/* Header */}
                        <div className={`px-8 py-12 lg:px-16 border-b-4 border-double border-ash-gray bg-ash-black text-ash-light mt-12 ${isLegacy ? 'border-dashed border-blue-900/50' : ''}`}>
                            <Reveal>
                                <div className={`flex justify-between items-start mb-6 font-mono text-[10px] text-ash-gray uppercase tracking-widest ${isLegacy ? 'text-blue-500/70' : ''}`}>
                                    <span>SIDE_ARCHIVE // {currentChapter.id}</span>
                                    <span>FILE_INDEX: {currentChapterIndex + 1}</span>
                                </div>
                                <h1 className={`text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-tight ${isLegacy ? 'legacy-text text-blue-200' : ''}`}>
                                    {translation.title}
                                </h1>
                                <div className={`flex items-center gap-2 text-xs font-mono text-ash-gray bg-ash-dark inline-block px-3 py-1 border border-ash-gray ${isLegacy ? 'border-blue-900/50 bg-blue-950/20 text-blue-400' : ''}`}>
                                    {isLegacy ? <AlertTriangle size={12} className="animate-pulse" /> : <FileText size={12} />}
                                    <span>{currentChapter.date}</span>
                                </div>
                            </Reveal>
                        </div>
                        
                        {/* Body */}
                        <article className={`px-8 py-12 lg:px-16 max-w-none text-ash-light font-serif leading-loose tracking-wide ${isLegacy ? 'font-mono' : getFontClass(readerFont)}`}>
                            {renderContent(translation.content)}
                        </article>

                        {/* Footer Nav */}
                        <div className={`p-8 md:p-16 border-t-4 border-double border-ash-gray bg-ash-dark ${isLegacy ? 'border-dashed border-blue-900/30 bg-blue-950/10' : ''}`}>
                             <div className="flex justify-between items-center gap-4">
                                <button
                                    onClick={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentChapterIndex === 0}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono"
                                >
                                    <ChevronLeft size={16} /> PREV
                                </button>
                                <button
                                    onClick={() => setCurrentChapterIndex(prev => Math.min(volume.chapters.length - 1, prev + 1))}
                                    disabled={currentChapterIndex === volume.chapters.length - 1}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono"
                                >
                                    NEXT <ChevronRight size={16} />
                                </button>
                             </div>
                        </div>
                    </>
                 )}
             </div>
        </main>
    </div>
  );
};

export default SideStoryReader;
