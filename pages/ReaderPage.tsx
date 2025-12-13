
import React, { useState, useEffect, useRef } from 'react';
import { novelData } from '../data/novelData';
import { BookOpen, List, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, Activity, AlertTriangle, Terminal, Grid, Folder, Lock, ArrowLeft, MousePointer2, Eye } from 'lucide-react';
import { ChapterTranslation, Language } from '../types';
import Reveal from '../components/Reveal';
import StoryEntryAnimation from '../components/StoryEntryAnimation';
import MaskedText from '../components/MaskedText';
import { ReaderFont, getFontClass } from '../components/fonts/fontConfig';

interface ReaderPageProps {
  currentIndex: number;
  onChapterChange: (index: number) => void;
  language: Language;
  isLightTheme: boolean;
  readerFont: ReaderFont;
}

// Special collapsible component for Void logs
const VoidLog: React.FC<{ lines: string[] }> = ({ lines }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Reveal>
      <div className="my-10 border-l-4 border-fuchsia-600 bg-fuchsia-950/10 font-mono text-xs md:text-sm shadow-[0_0_15px_-3px_rgba(192,38,211,0.2)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 md:p-4 bg-fuchsia-950/20 hover:bg-fuchsia-900/30 text-fuchsia-300 font-bold flex items-center gap-3 transition-all group border-b border-fuchsia-500/20 focus:outline-none focus:bg-fuchsia-900/40"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
             <AlertTriangle size={16} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
             <span className="animate-pulse tracking-widest text-fuchsia-400">&gt;&gt;&gt; SYSTEM_INTERCEPT // 0000.2_VOID</span>
             <span className="text-[10px] bg-fuchsia-900/50 px-1 border border-fuchsia-500/30 text-fuchsia-200/70">
                ENCRYPTION: UNSTABLE
             </span>
          </div>
          <span className="ml-auto opacity-50 text-[10px] group-hover:opacity-100 transition-opacity">[CLICK_TO_DECODE]</span>
        </button>
        
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 md:p-6 text-fuchsia-100/90 space-y-2 leading-relaxed tracking-wide font-medium bg-black/20 backdrop-blur-sm">
              {lines.map((line, i) => {
                  // Clean up the markers for display
                  const cleanLine = line
                    .replace(/0000\.2Void>>/, '')
                    .replace(/【插入结束】|【插入結束】|\[INSERTION_END\]/, '');
                    
                  if (!cleanLine.trim()) return <br key={i}/>;
                  
                  return (
                    <p key={i} className="border-l border-fuchsia-500/20 pl-3 hover:border-fuchsia-500 hover:bg-fuchsia-500/5 transition-colors duration-300">
                        {cleanLine}
                    </p>
                  );
              })}
              <div className="mt-4 pt-2 border-t border-dashed border-fuchsia-500/30 text-[10px] text-fuchsia-500 text-right">
                  // LOG_END // CONNECTION_TERMINATED
              </div>
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

const ReaderPage: React.FC<ReaderPageProps> = ({ currentIndex, onChapterChange, language, isLightTheme, readerFont }) => {
  // viewMode state: 'directory' shows the grid of chapters, 'reader' shows the text content
  const [viewMode, setViewMode] = useState<'directory' | 'reader'>('directory');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  
  // Local transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingChapterIndex, setPendingChapterIndex] = useState(0);

  const currentChapter = novelData.chapters[currentIndex];
  // Safe access to translation, fallback to CN if missing (though data ensures it's there)
  const translation: ChapterTranslation = currentChapter.translations[language] || currentChapter.translations['zh-CN'];

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Reset scroll on chapter change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentIndex, viewMode]);

  const handleChapterSelect = (index: number) => {
      setPendingChapterIndex(index);
      setIsTransitioning(true);
  };
  
  const handleTransitionComplete = () => {
      setIsTransitioning(false);
      onChapterChange(pendingChapterIndex);
      setViewMode('reader');
  };

  const handleNext = () => {
    if (currentIndex < novelData.chapters.length - 1) {
      onChapterChange(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onChapterChange(currentIndex - 1);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Only allow keyboard navigation in reader mode
        if (viewMode !== 'reader') return;
        
        // Prevent interference with form inputs
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowLeft') {
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex]);

  // Custom content renderer to handle special blocks like Void Logs and merge paragraphs
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
        // range includes: CJK Unified Ideographs, Hiragana, Katakana, Fullwidth Forms, CJK Symbols
        const cjkRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
        const isPrevCJK = cjkRegex.test(prevChar);
        const isCurrCJK = cjkRegex.test(currChar);

        // If either side is CJK, likely no space needed (except maybe simple English-CJK boundary, but standard is no space in these mixed contexts)
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
            
            // Auto-color logic based on speaker
            // Default styling
            let className = `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-ash-light transition-colors ${getFontClass(readerFont)}`;
            
            if (joinedText.startsWith('零点') || joinedText.startsWith('Point') || joinedText.startsWith('零點')) {
                // Point: Special white with glow in Dark Mode, Dark Grey in Light Mode
                className = isLightTheme
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-zinc-600 font-bold ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] ${getFontClass(readerFont)}`;
            } else if (joinedText.startsWith('芷漓') || joinedText.startsWith('Zeri')) {
                // Zeri: Pink with glow in Dark Mode
                className = isLightTheme
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-pink-600 ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-pink-400 drop-shadow-[0_0_2px_rgba(244,114,182,0.4)] ${getFontClass(readerFont)}`;
            } else if (joinedText.startsWith('泽洛') || joinedText.startsWith('Zelo') || joinedText.startsWith('澤洛')) {
                // Zelo: Blue with glow in Dark Mode
                className = isLightTheme
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-600 ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-blue-400 drop-shadow-[0_0_2px_rgba(96,165,250,0.4)] ${getFontClass(readerFont)}`;
            } else if (joinedText.startsWith('???') || joinedText.startsWith('Void') || joinedText.includes('void') || joinedText.includes('Void')) {
                 // Void
                 className = isLightTheme
                    ? `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-zinc-900 font-bold ${getFontClass(readerFont)}`
                    : `mb-6 md:mb-8 text-justify indent-8 md:indent-12 text-sm md:text-base leading-relaxed text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] ${getFontClass(readerFont)}`;
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
            
            // Handle single-line void block
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

        // 2. Check for Custom Tags
        const blueMatch = trimmed.match(/^\[\[BLUE::(.*?)\]\]$/);
        const dangerMatch = trimmed.match(/^\[\[DANGER::(.*?)\]\]$/);
        const voidVisionMatch = trimmed.match(/^\[\[VOID_VISION::(.*?)\]\]$/);
        const isDivider = trimmed === '[[DIVIDER]]';
        const isImage = /\[\[IMAGE::(.*?)::(.*?)\]\]/.test(trimmed);
        const isEmpty = !trimmed;

        if (blueMatch || dangerMatch || voidVisionMatch || isDivider || isImage || isEmpty) {
            flushTextBuffer(); // These elements break the paragraph
            
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
                        <div className="flex flex-col items-center gap-1">
                            <Activity size={16} className="text-ash-light animate-pulse" />
                            <div className="text-[10px] font-mono tracking-[0.3em] text-ash-light">DATA_SEGMENT</div>
                        </div>
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
                            <div className="relative border-4 border-ash-light p-2 bg-ash-dark max-w-full shadow-hard group">
                                    {/* Decorative Corner Screws */}
                                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                                    
                                    <div className="relative overflow-hidden bg-ash-black">
                                    <img 
                                        src={src} 
                                        alt={caption}
                                        className="relative max-h-[600px] w-auto object-cover block grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    {/* Scanline/Texture Overlay */}
                                    <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
                                    </div>

                                    {/* Caption Label */}
                                    <div className="absolute bottom-4 right-4 z-20">
                                        <div className="bg-ash-light text-ash-black px-3 py-1 text-[10px] font-mono font-bold border-2 border-ash-black shadow-hard-sm flex items-center gap-2 uppercase">
                                        <ImageIcon size={12} strokeWidth={3} />
                                        {caption}
                                        </div>
                                    </div>
                            </div>
                        </Reveal>
                    );
                }
            }
            continue;
        }

        // 3. Normal Text Line - add to buffer
        textBuffer.push(trimmed);
    }
    
    // Flush remaining buffer
    flushTextBuffer();

    return nodes;
  };

  // --- Directory View ---
  if (viewMode === 'directory') {
    return (
        <div className="h-full bg-halftone overflow-y-auto p-4 md:p-12 relative flex flex-col items-center">
             {/* Local Transition Animation */}
             {isTransitioning && (
                 <StoryEntryAnimation 
                    onComplete={handleTransitionComplete}
                    language={language}
                    mode="fast"
                 />
             )}

             {/* Background Decorative Line */}
             <div className="absolute top-0 bottom-0 left-1/2 w-px bg-ash-dark -translate-x-1/2 z-0 border-l border-dashed border-ash-gray/30"></div>

             <header className="relative z-10 mb-12 text-center bg-ash-black p-6 border border-ash-gray shadow-hard max-w-lg w-full mt-8 md:mt-0">
                <div className="flex flex-col items-center gap-2">
                    <BookOpen size={32} className="text-ash-light" />
                    <h1 className="text-2xl font-black text-ash-light uppercase tracking-tighter">
                        {language === 'en' ? 'MAIN_ARCHIVE_DIR' : '主线档案目录'}
                    </h1>
                    <p className="text-[10px] font-mono text-ash-gray border-t border-dashed border-ash-gray/50 pt-2 w-full text-center">
                        /VAR/LIB/NOVA/MAIN_STORY
                    </p>
                </div>
            </header>

            <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {novelData.chapters.map((chapter, index) => {
                    const t = chapter.translations[language] || chapter.translations['zh-CN'];
                    const isLocked = chapter.status === 'locked';
                    
                    return (
                        <Reveal key={chapter.id} delay={index * 50} className="h-full">
                            <button
                                onClick={() => !isLocked && handleChapterSelect(index)}
                                disabled={isLocked}
                                className={`
                                    w-full h-full flex flex-col text-left border-2 transition-all duration-300 relative group overflow-hidden
                                    ${isLocked 
                                        ? 'bg-ash-black/50 border-ash-dark text-ash-gray cursor-not-allowed opacity-70' 
                                        : 'bg-ash-black border-ash-gray text-ash-light hover:border-ash-light hover:shadow-hard hover:-translate-y-1'
                                    }
                                `}
                            >
                                {/* Header of Card */}
                                <div className={`p-3 border-b border-dashed ${isLocked ? 'border-ash-dark bg-ash-dark/30' : 'border-ash-gray/30 bg-ash-dark/50'} flex justify-between items-center`}>
                                    <span className="text-[10px] font-mono font-bold">
                                        {chapter.id.split('-').pop()?.toUpperCase() || `CH_${index}`}
                                    </span>
                                    {isLocked ? <Lock size={12} /> : <div className="w-2 h-2 bg-ash-light rounded-full" />}
                                </div>

                                {/* Body of Card */}
                                <div className="p-4 flex-1 flex flex-col gap-2">
                                    <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2">
                                        {t.title}
                                    </h3>
                                    
                                    <div className="mt-auto pt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-70">
                                            <FileText size={10} />
                                            {chapter.date}
                                        </div>
                                        {t.summary && (
                                            <p className="text-xs font-mono text-ash-gray line-clamp-2 border-l-2 border-ash-gray/30 pl-2">
                                                {t.summary}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                {!isLocked && (
                                    <div className="absolute inset-0 bg-halftone opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
                                )}
                                
                                {isLocked && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                         <div className="bg-red-950/80 border border-red-800 text-red-500 px-3 py-1 text-xs font-mono font-bold uppercase rotate-12 backdrop-blur-sm">
                                             Access Denied
                                         </div>
                                     </div>
                                )}
                            </button>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
  }

  // --- Reader View ---
  return (
    <div className="flex h-full relative overflow-hidden bg-retro-paper text-zinc-950">
      {/* Chapter Sidebar */}
      <aside 
        className={`absolute md:relative z-20 h-full bg-ash-black border-r-4 border-ash-dark transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl md:shadow-none' : 'w-0 -translate-x-full md:w-0 md:-translate-x-0 overflow-hidden'
        }`}
      >
        {/* Sidebar Header: Back Button */}
        <div className="p-4 border-b-2 border-ash-gray bg-ash-black text-ash-light flex justify-between items-center shrink-0">
          <button 
             onClick={() => setViewMode('directory')}
             className="flex items-center gap-2 text-xs font-mono font-bold hover:text-ash-gray transition-colors group focus:outline-none focus:bg-ash-dark focus:text-ash-white p-1"
          >
             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
             {language === 'en' ? 'DIRECTORY' : '返回目录'}
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-ash-gray hover:text-ash-light focus:outline-none focus:text-ash-light"
            aria-label="Close Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Chapter List */}
        <div className="overflow-y-auto flex-1 p-0">
          {novelData.chapters.map((chapter, index) => {
            const chapTitle = chapter.translations[language]?.title || chapter.translations['zh-CN'].title;
            const isLocked = chapter.status === 'locked';

            return (
              <button
                key={chapter.id}
                onClick={() => {
                   if (!isLocked) {
                      onChapterChange(index);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                   }
                }}
                disabled={isLocked}
                className={`w-full text-left p-4 text-xs font-mono border-b border-ash-dark transition-none group relative overflow-hidden focus:outline-none focus:bg-ash-dark ${
                  index === currentIndex
                    ? 'bg-ash-light text-ash-black'
                    : isLocked ? 'bg-ash-dark/10 text-ash-gray cursor-not-allowed' : 'text-ash-gray hover:bg-ash-dark hover:text-ash-white'
                }`}
              >
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div className="font-bold truncate uppercase mb-1 max-w-[85%]">
                            {index === currentIndex && <span className="mr-2">&gt;</span>}
                            {chapTitle}
                        </div>
                        {isLocked && <div className="text-[10px] border border-current px-1 opacity-70">LOCK</div>}
                    </div>
                    <div className="opacity-60">{chapter.date}</div>
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
          className="absolute top-4 left-4 z-10 p-2 bg-ash-black text-ash-light border-2 border-ash-light hover:bg-ash-light hover:text-ash-black shadow-hard focus:outline-none focus:ring-2 focus:ring-ash-light focus:bg-ash-light focus:text-ash-black transition-colors"
          aria-label={language === 'en' ? "Open Sidebar" : "打开侧边栏"}
        >
          <List size={20} />
        </button>
      )}

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth relative bg-ash-black">
        <div 
          key={currentIndex} 
          className="max-w-4xl mx-auto min-h-full bg-ash-black border-l-0 md:border-l-2 md:border-r-2 border-ash-dark/50 shadow-2xl relative animate-slide-in"
        >
          {currentChapter.status === 'locked' ? (
              <div className="h-[80vh] flex flex-col items-center justify-center text-ash-gray p-8 text-center">
                  <div className="mb-6 p-6 border-4 border-dashed border-red-900/50 rounded-none bg-red-950/10">
                      <Activity size={64} className="text-red-800 mb-4 mx-auto animate-pulse" />
                      <h2 className="text-2xl font-black uppercase text-red-700 tracking-widest mb-2">Access Denied</h2>
                      <p className="font-mono text-sm text-red-900/70">ENCRYPTED_FILE // AUTH_LEVEL_MISSING</p>
                  </div>
              </div>
          ) : (
            <>
                {/* Paper Header */}
                <div className="px-8 py-12 lg:px-16 md:mt-0 border-b-4 border-double border-ash-gray bg-ash-black text-ash-light mt-12">
                    <Reveal>
                    <div className="flex justify-between items-start mb-6 font-mono text-[10px] text-ash-gray uppercase tracking-widest">
                        <span>NOVA_ARCHIVE // {currentChapter.id}</span>
                        <span>PG_INDEX: {currentIndex + 1}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-tight">
                        {translation.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-ash-gray bg-ash-dark inline-block px-3 py-1 border border-ash-gray">
                        <FileText size={12} />
                        <span>{currentChapter.date}</span>
                    </div>
                    </Reveal>
                </div>

                <article className={`px-8 py-12 lg:px-16 max-w-none text-ash-light font-serif leading-loose tracking-wide ${getFontClass(readerFont)}`}>
                    {renderContent(translation.content)}
                </article>

                {/* Footer Nav */}
                <div className="p-8 md:p-16 border-t-4 border-double border-ash-gray bg-ash-dark">
                    <div className="flex justify-between items-center gap-4">
                        <button 
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono focus:outline-none focus:bg-ash-light focus:text-ash-black"
                        >
                        <ChevronLeft size={16} /> PREV_FILE
                        </button>

                        <div className="hidden md:block font-mono text-xs text-ash-gray">
                        - END OF RECORD -
                        </div>

                        <button 
                        onClick={handleNext}
                        disabled={currentIndex === novelData.chapters.length - 1} // Logic checks total length, but navigation handles locks separately or allows browsing up to lock
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono focus:outline-none focus:bg-ash-light focus:text-ash-black"
                        >
                        NEXT_FILE <ChevronRight size={16} />
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

export default ReaderPage;
