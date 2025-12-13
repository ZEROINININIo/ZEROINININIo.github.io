
import React, { useState } from 'react';
import { Database, Book, Users, Home, GitBranch, Settings, Globe, X } from 'lucide-react';
import BackgroundMusic from './BackgroundMusic';
import CRTToggle from './CRTToggle';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';
import FontSelector from './fonts/FontSelector';
import { Language } from '../types';
import { ReaderFont } from './fonts/fontConfig';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  isLightTheme: boolean;
  setIsLightTheme: (val: boolean) => void;
  bgmPlaying: boolean;
  setBgmPlaying: (val: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (val: number) => void;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
  // Audio Props
  audioSrc: string | null;
  trackTitle: string;
  trackComposer: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
    activeTab, setActiveTab, language, setLanguage,
    crtEnabled, setCrtEnabled, isLightTheme, setIsLightTheme,
    bgmPlaying, setBgmPlaying, bgmVolume, setBgmVolume,
    readerFont, setReaderFont,
    audioSrc, trackTitle, trackComposer
}) => {
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [showDesktopSettings, setShowDesktopSettings] = useState(false);

  const translations = {
    'zh-CN': {
      home: '根控制台',
      characters: '人员档案',
      database: '数据资料',
      reader: '阅读终端',
      sidestories: '支线档案',
      config: '系统设置',
      mobileHome: '主页',
      mobileChars: '人员',
      mobileData: '数据',
      mobileRead: '阅读',
      mobileSide: '支线',
      settingsTitle: '系统配置面板'
    },
    'zh-TW': {
      home: '根控制台',
      characters: '人員檔案',
      database: '數據資料',
      reader: '閱讀終端',
      sidestories: '支線檔案',
      config: '系統設置',
      mobileHome: '主頁',
      mobileChars: '人員',
      mobileData: '數據',
      mobileRead: '閱讀',
      mobileSide: '支線',
      settingsTitle: '系統配置面板'
    },
    'en': {
      home: 'ROOT_MENU',
      characters: 'PERSONNEL',
      database: 'DATA_BANK',
      reader: 'READ_MODE',
      sidestories: 'FRAGMENTS',
      config: 'SYS_CONFIG',
      mobileHome: 'ROOT',
      mobileChars: 'TEAM',
      mobileData: 'DATA',
      mobileRead: 'READ',
      mobileSide: 'SIDE',
      settingsTitle: 'SYSTEM CONFIGURATION'
    }
  };

  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.home, mobileLabel: t.mobileHome, icon: Home },
    { id: 'characters', label: t.characters, mobileLabel: t.mobileChars, icon: Users },
    { id: 'database', label: t.database, mobileLabel: t.mobileData, icon: Database },
    // These two are the "Story" items
    { id: 'reader', label: t.reader, mobileLabel: t.mobileRead, icon: Book },
    { id: 'sidestories', label: t.sidestories, mobileLabel: t.mobileSide, icon: GitBranch },
  ];

  const cycleLanguage = () => {
    if (language === 'zh-CN') setLanguage('zh-TW');
    else if (language === 'zh-TW') setLanguage('en');
    else setLanguage('zh-CN');
  };

  const getLangLabel = () => {
    if (language === 'zh-CN') return '简';
    if (language === 'zh-TW') return '繁';
    return 'EN';
  };

  return (
    <>
      {/* Mobile Floating BGM Widget (Independent) */}
      <div className="fixed top-4 right-4 z-50 lg:hidden w-32 md:w-48 animate-fade-in">
          <BackgroundMusic 
              isPlaying={bgmPlaying} 
              onToggle={() => setBgmPlaying(!bgmPlaying)}
              volume={bgmVolume}
              onVolumeChange={setBgmVolume}
              audioSrc={audioSrc}
              trackTitle={trackTitle}
              trackComposer={trackComposer}
              className="shadow-2xl opacity-90"
          />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 lg:static lg:w-72 lg:h-full bg-ash-black border-t-2 lg:border-t-0 lg:border-r-2 border-ash-light/20 z-50 flex lg:flex-col justify-between p-2 lg:p-6 shadow-2xl transition-colors duration-300 lg:overflow-y-auto no-scrollbar">
        <div className="hidden lg:block mb-8 border-b-2 border-ash-light/20 pb-6 shrink-0">
          <div className="flex items-center gap-4 mb-4">
               {/* Logo Image */}
               <div className="relative w-12 h-12 bg-ash-black border border-ash-gray/50 p-1 shadow-hard group">
                   <img 
                      src="https://free.picui.cn/free/2025/12/08/6936e856897d6.png" 
                      alt="Nova Labs"
                      className="w-full h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                   />
                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-ash-light"></div>
                   <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-ash-light"></div>
              </div>
              <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 bg-ash-light animate-pulse"></div>
                  <div className="w-2 h-2 bg-ash-gray"></div>
              </div>
          </div>
          <h1 className="text-4xl font-black text-ash-light tracking-tighter uppercase mb-1" style={{ textShadow: '2px 2px 0 #333' }}>
            NOVA<br/>LABS
          </h1>
          <div className="text-[10px] text-ash-gray font-mono bg-ash-dark p-1 inline-block border border-ash-gray">
            ARCHIVE_SYS // TL.1.14-Y
          </div>
        </div>

        <div className="flex lg:flex-col justify-between lg:justify-start w-full gap-1 lg:gap-3 lg:mb-auto shrink-0">
          {navItems.map((item, index) => {
            const isStoryItem = item.id === 'reader' || item.id === 'sidestories';
            const addSeparator = index === 3; 

            return (
              <React.Fragment key={item.id}>
                {addSeparator && <div className="hidden lg:block h-px bg-ash-gray/30 w-full my-2"></div>}
                
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileSettings(false);
                  }}
                  className={`flex-1 lg:flex-none flex flex-col lg:flex-row items-center justify-center lg:justify-start py-2 lg:px-4 lg:py-4 border-2 transition-all duration-300 group relative overflow-hidden ${
                    activeTab === item.id
                      ? 'bg-ash-light text-ash-black border-ash-light shadow-hard'
                      : isStoryItem
                        ? 'bg-ash-dark/40 text-ash-light border-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light shadow-sm' // Emphasized inactive state
                        : 'bg-ash-black text-ash-gray border-ash-gray/30 hover:border-ash-light hover:text-ash-light'
                  }`}
                >
                  {/* Active Indicator Pattern */}
                  {activeTab === item.id && (
                      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
                  )}
                  
                  {/* Story Item Decoration (When inactive) */}
                  {isStoryItem && activeTab !== item.id && (
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-ash-gray/50 group-hover:bg-ash-black transition-colors hidden lg:block"></div>
                  )}

                  <item.icon 
                    size={18} 
                    className={`mb-1 lg:mb-0 lg:mr-3 z-10 transition-transform ${isStoryItem && activeTab !== item.id ? 'group-hover:scale-110' : ''}`} 
                    strokeWidth={isStoryItem ? 2.5 : 2.5} 
                  />
                  
                  {/* Desktop Label */}
                  <span className={`hidden lg:inline text-sm font-bold tracking-widest z-10 whitespace-normal text-left ${isStoryItem ? 'text-base uppercase' : ''}`}>
                    {item.label}
                  </span>
                  
                  {/* Mobile Label */}
                  <span className="lg:hidden text-[10px] font-bold tracking-widest z-10 whitespace-nowrap">{item.mobileLabel}</span>
                  
                  {/* Story Item Badge */}
                  {isStoryItem && (
                    <div className="absolute top-1 right-1 lg:top-1/2 lg:-translate-y-1/2 lg:right-2 w-1.5 h-1.5 bg-current opacity-50 rounded-full lg:rounded-none lg:w-1 lg:h-3"></div>
                  )}
                </button>
              </React.Fragment>
            );
          })}
          
          {/* Mobile Settings Toggle */}
          <button
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className={`flex-1 lg:hidden flex flex-col items-center justify-center py-2 border-2 transition-all duration-300 group relative overflow-hidden ${
              showMobileSettings
                ? 'bg-ash-light text-ash-black border-ash-light shadow-hard'
                : 'bg-ash-black text-ash-gray border-ash-gray/30 hover:border-ash-light hover:text-ash-light'
            }`}
          >
            {showMobileSettings && (
                <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
            )}
            <Settings size={18} className="mb-1 z-10" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-widest z-10">CFG</span>
          </button>
        </div>

        {/* Desktop Sidebar: BGM & System Configuration */}
        <div className="hidden lg:flex flex-col gap-4 mt-8 border-t-2 border-dashed border-ash-gray/30 pt-6 shrink-0">
          
          {/* Independent BGM Control in Sidebar */}
          <BackgroundMusic 
              isPlaying={bgmPlaying} 
              onToggle={() => setBgmPlaying(!bgmPlaying)}
              volume={bgmVolume}
              onVolumeChange={setBgmVolume}
              audioSrc={audioSrc}
              trackTitle={trackTitle}
              trackComposer={trackComposer}
          />

          <div>
            <div className="text-[10px] text-ash-gray font-mono mb-1 uppercase px-1">[SYSTEM]</div>
            <button
                onClick={() => setShowDesktopSettings(true)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-all duration-300 group shadow-hard ${
                    showDesktopSettings
                    ? 'bg-ash-light text-ash-black border-ash-light'
                    : 'bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light'
                }`}
            >
                <Settings size={18} className={`transition-transform duration-700 ${showDesktopSettings ? 'rotate-180' : ''}`} />
                <span className="text-sm font-bold tracking-widest uppercase">{t.config}</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:block mt-6 pt-4 border-t-2 border-dashed border-ash-gray/30 text-ash-gray text-[10px] font-mono leading-tight shrink-0">
          <p>&gt; ENCRYPTION: STATIC</p>
          <div className="w-full bg-ash-dark h-2 border border-ash-gray mb-1">
              <div className="bg-ash-light h-full w-[98%] animate-pulse"></div>
          </div>
          <p>&gt; PING: 0.04ms</p>
        </div>
      </nav>

      {/* Mobile Settings Overlay (Without BGM) */}
      {showMobileSettings && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-[2px]" onClick={() => setShowMobileSettings(false)}>
            <div 
                className="absolute bottom-[90px] left-4 right-4 bg-ash-black border-2 border-ash-light p-5 shadow-hard animate-slide-in z-50 max-h-[70vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 border-b-2 border-ash-gray/30 pb-2">
                    <div className="flex items-center gap-2">
                        <Settings size={16} className="text-ash-light" />
                        <span className="text-xs font-bold text-ash-light font-mono uppercase tracking-wider">{t.config}</span>
                    </div>
                    <div className="text-[10px] text-ash-gray font-mono">TL.1.14-Y</div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                      onClick={cycleLanguage}
                      className="flex items-center justify-between w-full px-3 py-3 border-2 transition-all duration-300 shadow-hard bg-ash-black text-ash-gray border-ash-gray/50 active:border-ash-light active:text-ash-light group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={16} />
                        <span className="text-[10px] font-mono font-bold uppercase">Language</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">{getLangLabel()}</span>
                    </button>
                    {/* BGM Removed from here as requested */}
                    <FontSelector value={readerFont} onChange={setReaderFont} language={language} />
                    <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} />
                    <FullscreenToggle language={language} />
                    <ThemeToggle value={isLightTheme} onChange={setIsLightTheme} />
                </div>
                
                <div className="mt-4 pt-2 border-t border-dashed border-ash-gray/30 text-[10px] text-ash-gray font-mono text-center">
                    NOVA_LABS_ARCHIVE // SYSTEM_OVERLAY
                </div>
            </div>
        </div>
      )}

      {/* Desktop Settings Modal (Floating Window) - Without BGM */}
      {showDesktopSettings && (
        <div 
            className="fixed inset-0 z-[100] hidden lg:flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowDesktopSettings(false)}
        >
            <div 
                className="w-[450px] bg-ash-black border-2 border-ash-light p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)] relative animate-zoom-in-fast"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6 border-b-2 border-ash-gray/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-ash-light text-ash-black">
                            <Settings size={20} />
                        </div>
                        <h2 className="text-lg font-black text-ash-light uppercase tracking-widest">{t.settingsTitle}</h2>
                    </div>
                    <button 
                        onClick={() => setShowDesktopSettings(false)} 
                        className="text-ash-gray hover:text-ash-light transition-colors hover:bg-ash-dark p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content Grid */}
                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Language Row */}
                    <button 
                      onClick={cycleLanguage}
                      className="flex items-center justify-between w-full px-4 py-3 border-2 transition-all duration-300 shadow-hard bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} />
                        <span className="text-xs font-mono font-bold uppercase">Language Select</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-ash-dark px-2 py-1 border border-ash-gray/30 group-hover:border-ash-gray">{getLangLabel()}</span>
                    </button>

                    {/* BGM Removed from here */}
                    
                    <FontSelector value={readerFont} onChange={setReaderFont} language={language} />

                    {/* Grid Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} />
                        <ThemeToggle value={isLightTheme} onChange={setIsLightTheme} />
                    </div>
                    
                    <FullscreenToggle language={language} />
                </div>

                {/* Modal Footer */}
                <div className="mt-6 pt-3 border-t border-dashed border-ash-gray/30 flex justify-between items-center text-[10px] text-ash-gray font-mono">
                    <span>SYS_CFG // USER_PREF</span>
                    <span className="opacity-50">NOVA_ARCHIVE_OS</span>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
