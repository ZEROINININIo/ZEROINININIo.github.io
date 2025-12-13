
import React, { useState, useEffect, useMemo } from 'react';
import { Terminal, RefreshCw, BookOpen, GitBranch, ArrowRight, Lock, Database, Wifi } from 'lucide-react';
import { Language } from '../types';
import Reveal from '../components/Reveal';
import { introQuotes } from '../data/introQuotes';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, language, setLanguage }) => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Initialize random quote index
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * introQuotes.length));

  const handleReroute = () => {
    setQuoteIndex(prev => {
        let next = Math.floor(Math.random() * introQuotes.length);
        if (next === prev && introQuotes.length > 1) {
             next = Math.floor(Math.random() * introQuotes.length);
        }
        return next;
    });
  };

  // Construct the intro content
  const introContent = useMemo(() => {
    const quote = introQuotes[quoteIndex];
    const text = quote.text[language];
    
    if (language === 'zh-CN') {
        return `> 正在建立加密连接...\n> 发送者: ${quote.speaker}\n\n“${text}”\n\n> 讯号待机中。`;
    } else if (language === 'zh-TW') {
        return `> 正在建立加密連接...\n> 發送者: ${quote.speaker}\n\n「${text}」\n\n> 訊號待機中。`;
    } else {
        return `> ESTABLISHING ENCRYPTED CONNECTION...\n> SENDER: ${quote.speaker}\n\n"${text}"\n\n> SIGNAL STANDBY.`;
    }
  }, [language, quoteIndex]);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const speed = 30; 
    setTypedText('');
    
    const interval = setInterval(() => {
      if (index < introContent.length) {
        setTypedText((prev) => prev + introContent.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [language, introContent]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const t = {
    'zh-CN': {
      main_archive: '主线档案',
      main_desc: '进入核心故事线，访问已解密的记忆节点。',
      side_archive: '支线扇区',
      side_desc: '访问碎片化数据，探索未知的时间分支。',
      enter: '执行协议',
      access: '访问扇区',
      status: '状态：正常'
    },
    'zh-TW': {
      main_archive: '主線檔案',
      main_desc: '進入核心故事線，訪問已解密的記憶節點。',
      side_archive: '支線扇區',
      side_desc: '訪問碎片化數據，探索未知的時間分支。',
      enter: '執行協議',
      access: '訪問扇區',
      status: '狀態：正常'
    },
    'en': {
      main_archive: 'MAIN_ARCHIVE',
      main_desc: 'Access core storyline. View decrypted memory nodes.',
      side_archive: 'MEMORY_SECTOR',
      side_desc: 'Access fragmented data. Explore unknown time branches.',
      enter: 'EXECUTE',
      access: 'ACCESS',
      status: 'STATUS: OK'
    }
  }[language];

  return (
    <div className="flex flex-col min-h-full bg-halftone text-ash-light font-mono relative">
      
      {/* Scrollable Content Container with Padding */}
      <div className="flex-1 flex flex-col p-4 md:p-8 pb-32 lg:pb-12">
          
          {/* Top Section: Console only */}
          <div className="w-full max-w-7xl mx-auto mb-6 shrink-0">
            <Reveal className="w-full bg-ash-black border-2 border-ash-gray p-4 md:p-6 shadow-hard relative min-h-[160px] md:min-h-[180px] flex flex-col">
                <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                        onClick={handleReroute}
                        className="flex items-center gap-1 text-[10px] font-bold bg-ash-gray/20 text-ash-gray border border-ash-gray/50 px-2 hover:bg-ash-light hover:text-ash-black hover:border-ash-light transition-all group"
                    >
                        <RefreshCw size={10} className="group-hover:animate-spin" />
                        REROUTE
                    </button>
                </div>
                
                <h2 className="text-xs font-bold text-ash-gray mb-4 flex items-center gap-2 uppercase border-b border-dashed border-ash-gray/30 pb-2">
                    <Terminal size={14} /> ROOT_CONSOLE // TL.1.14-Y
                </h2>
                
                <div className="flex-1 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-ash-gray">
                    {typedText}
                    {showCursor && <span className="inline-block w-2 h-4 bg-ash-light ml-1 align-middle"></span>}
                </div>
            </Reveal>
          </div>

          {/* Middle Section: Dual Entry Modules */}
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Module 1: Main Story (Enhanced Emerald/Green Theme with Animations) */}
                <Reveal delay={200} className="flex-1">
                    <button 
                        onClick={() => onNavigate('reader')}
                        className="w-full h-full min-h-[240px] bg-ash-black border-2 border-ash-gray hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-500 group relative flex flex-col overflow-hidden text-left"
                    >
                        {/* Animated Background Grid - Emerald Tint on Hover */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)]"></div>

                        {/* Header */}
                        <div className="w-full p-4 border-b-2 border-ash-gray bg-ash-dark/30 flex justify-between items-center group-hover:bg-emerald-950/30 group-hover:border-emerald-900/50 transition-colors duration-300 z-20 relative">
                            <div className="flex items-center gap-2 font-bold font-mono group-hover:text-emerald-400 transition-colors">
                                <BookOpen size={18} />
                                <span>ARCHIVE_CORE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                <div className="w-2 h-2 bg-ash-gray/50 rounded-full group-hover:bg-emerald-900/50 transition-colors"></div>
                            </div>
                        </div>

                        {/* Scanning Beam */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[200%] w-full -translate-y-1/2 group-hover:animate-scanline opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>

                        {/* Body */}
                        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center relative z-10">
                            <h3 className="text-3xl md:text-5xl font-black uppercase text-ash-light mb-4 group-hover:text-emerald-50 transition-colors duration-300 group-hover:translate-x-1" style={{ textShadow: '0 0 0 rgba(0,0,0,0)' }}>
                                <span className="relative inline-block">
                                    {t.main_archive}
                                    <span className="absolute top-0 left-0 -ml-0.5 text-emerald-500 opacity-0 group-hover:opacity-50 group-hover:animate-glitch pointer-events-none mix-blend-screen">{t.main_archive}</span>
                                    <span className="absolute top-0 left-0 ml-0.5 text-blue-500 opacity-0 group-hover:opacity-50 group-hover:animate-glitch pointer-events-none mix-blend-screen" style={{ animationDirection: 'reverse' }}>{t.main_archive}</span>
                                </span>
                            </h3>
                            <p className="text-ash-gray text-xs md:text-sm max-w-sm mb-8 font-mono leading-relaxed group-hover:text-emerald-200/60 transition-colors">
                                {t.main_desc}
                            </p>
                            
                            <div className="mt-auto flex items-center gap-2 text-ash-light font-bold text-sm uppercase group-hover:text-emerald-400 transition-colors group-hover:gap-4">
                                {t.enter} <ArrowRight size={16} />
                            </div>
                        </div>

                        {/* Background Decor - Lock */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-10deg] text-ash-light group-hover:text-emerald-500">
                            <Lock size={180} strokeWidth={0.5} />
                        </div>
                        
                        {/* Particle/Noise Overlay */}
                        <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                    </button>
                </Reveal>

                {/* Module 2: Side Story (Blue/Cyan Theme) */}
                <Reveal delay={300} className="flex-1">
                    <button 
                        onClick={() => onNavigate('sidestories')}
                        className="w-full h-full min-h-[240px] bg-slate-950 border-2 border-slate-700 hover:border-cyan-400 hover:shadow-[4px_4px_0_theme(colors.cyan.400)] transition-all duration-300 group relative flex flex-col overflow-hidden text-left"
                    >
                        {/* Header */}
                        <div className="w-full p-4 border-b-2 border-slate-700 bg-slate-900/50 flex justify-between items-center group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                            <div className="flex items-center gap-2 font-bold font-mono text-cyan-500 group-hover:text-black">
                                <GitBranch size={18} />
                                <span>MEMORY_FRAGS</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center relative z-10">
                            <h3 className="text-3xl md:text-5xl font-black uppercase text-cyan-100 mb-4 group-hover:text-cyan-300 group-hover:scale-105 transition-transform origin-left drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                                {t.side_archive}
                            </h3>
                            <p className="text-slate-400 text-xs md:text-sm max-w-sm mb-8 font-mono leading-relaxed group-hover:text-cyan-200/80">
                                {t.side_desc}
                            </p>
                            
                            <div className="mt-auto flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase group-hover:text-cyan-300 group-hover:translate-x-2 transition-transform">
                                {t.access} <ArrowRight size={16} />
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity text-cyan-500">
                            <Database size={200} strokeWidth={0.5} />
                        </div>
                        {/* Digital Rain Effect Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_20%,rgba(6,182,212,0.05)_50%,transparent_80%)] bg-[length:100%_4px] animate-scanline pointer-events-none opacity-30"></div>
                    </button>
                </Reveal>
          </div>
      </div>

      {/* Bottom Status Footer - Adjusted for Mobile to sit above nav bar */}
      <div className="absolute bottom-20 lg:bottom-0 left-0 right-0 bg-ash-black border-t-2 border-ash-gray p-2 text-[10px] text-ash-gray font-mono flex justify-between items-center select-none z-20">
          <div className="flex items-center gap-2 md:gap-4 px-2 overflow-hidden shrink-0">
               <div className="flex items-center gap-1 shrink-0">
                   <Wifi size={10} /> 
                   <span className="hidden md:inline">CONNECTION:</span> 
                   <span className="text-ash-light">SECURE</span>
               </div>
               <div className="h-3 w-px bg-ash-gray/30 shrink-0"></div>
               <div className="truncate">ID: VOID-XPSDVN</div>
               <div className="h-3 w-px bg-ash-gray/30 hidden md:block shrink-0"></div>
               <div className="hidden md:block shrink-0">LOC: SECTOR_0</div>
          </div>

          <div className="flex items-center gap-2 px-2 shrink-0">
                <span className="uppercase text-ash-gray/50 hidden md:inline">Input_Lang:</span>
                <div className="flex gap-1 font-bold">
                    {(['zh-CN', 'zh-TW', 'en'] as Language[]).map(lang => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-1.5 py-0.5 border transition-colors ${
                                language === lang 
                                ? 'bg-ash-light text-ash-black border-ash-light' 
                                : 'bg-transparent text-ash-gray border-ash-gray/50 hover:text-ash-light'
                            }`}
                        >
                            {lang === 'en' ? 'EN' : lang === 'zh-CN' ? 'CN' : 'TW'}
                        </button>
                    ))}
                </div>
          </div>
      </div>

    </div>
  );
};

export default HomePage;
