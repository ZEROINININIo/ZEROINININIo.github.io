
import React, { useState, useEffect, Suspense } from 'react';
import Navigation from './components/Navigation';
// Lazy load pages for performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CharactersPage = React.lazy(() => import('./pages/CharactersPage'));
const DatabasePage = React.lazy(() => import('./pages/DatabasePage'));
const ReaderPage = React.lazy(() => import('./pages/ReaderPage'));
const SideStoriesPage = React.lazy(() => import('./pages/SideStoriesPage'));

import BootSequence from './components/BootSequence';
import InitialSetup from './components/InitialSetup';
import CustomCursor from './components/CustomCursor';
import StoryEntryAnimation from './components/StoryEntryAnimation';
import LoadingOverlay from './components/LoadingOverlay';
import { Language } from './types';
import { ReaderFont } from './components/fonts/fontConfig';
import { unlockGlobalAudio } from './components/BackgroundMusic';

// BGM Configuration - HTTPS Sources
const BGM_MAIN = "https://zerox.ccccocccc.cc/bgm/main.mp3";
const BGM_DAILY = "https://zerox.ccccocccc.cc/bgm/daily.mp3";
const BGM_RAIN = "https://zerox.ccccocccc.cc/bgm/x.mp3";

const STORAGE_KEY = 'nova_labs_config_v6';

interface AppConfig {
  language: Language;
  crtEnabled: boolean;
  isLightTheme: boolean;
  setupCompleted: boolean;
  bgmPlaying: boolean;
  bgmVolume: number;
  readerFont: ReaderFont;
}

const defaultConfig: AppConfig = {
  language: 'zh-CN',
  crtEnabled: true,
  isLightTheme: false,
  setupCompleted: false,
  bgmPlaying: true, 
  bgmVolume: 0.15,
  readerFont: 'custom-02'
};

const App: React.FC = () => {
  // 1. Load config from localStorage immediately to determine initial state
  const loadConfig = (): AppConfig => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Failed to load config", e);
    }
    return defaultConfig;
  };

  const initialConfig = loadConfig();

  // App State: 'BOOT' -> 'SETUP' -> 'READY'
  const [appState, setAppState] = useState<'BOOT' | 'SETUP' | 'READY'>('BOOT');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  
  // BGM Context State
  const [activeSideStoryVolumeId, setActiveSideStoryVolumeId] = useState<string | null>(null);
  
  // Transition State
  const [isEnteringStory, setIsEnteringStory] = useState(false);

  // Global Preference State (Initialized from storage)
  const [language, setLanguage] = useState<Language>(initialConfig.language);
  const [crtEnabled, setCrtEnabled] = useState(initialConfig.crtEnabled);
  const [isLightTheme, setIsLightTheme] = useState(initialConfig.isLightTheme);
  const [setupCompleted, setSetupCompleted] = useState(initialConfig.setupCompleted);
  const [readerFont, setReaderFont] = useState<ReaderFont>(initialConfig.readerFont);
  
  // BGM State (Lifted)
  const [bgmPlaying, setBgmPlaying] = useState(initialConfig.bgmPlaying);
  const [bgmVolume, setBgmVolume] = useState(initialConfig.bgmVolume);

  // 2. Persist settings whenever they change
  useEffect(() => {
    const config: AppConfig = {
      language,
      crtEnabled,
      isLightTheme,
      setupCompleted,
      bgmPlaying,
      bgmVolume,
      readerFont
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [language, crtEnabled, isLightTheme, setupCompleted, bgmPlaying, bgmVolume, readerFont]);

  const handleBootComplete = () => {
    // Unlock audio context immediately after user interaction (Boot click)
    unlockGlobalAudio();

    if (setupCompleted) {
      setAppState('READY');
    } else {
      setAppState('SETUP');
    }
  };

  const handleSetupComplete = () => {
    setSetupCompleted(true);
    setAppState('READY');
  };

  // Logic to intercept navigation for animation triggers
  const handleNavigationChange = (tab: string) => {
      setActiveTab(tab);
      // Reset side story context when leaving tab
      if (tab !== 'sidestories') {
          setActiveSideStoryVolumeId(null);
      }
  };

  // Triggered from HomePage button
  const startStorySequence = () => {
    setIsEnteringStory(true);
  };

  // Called when MAIN story animation finishes
  const handleStoryEntryComplete = () => {
    setActiveTab('reader');
    setIsEnteringStory(false);
  };

  const handleHomeNavigate = (tab: string) => {
    if (tab === 'reader') {
        startStorySequence();
    } else {
        setActiveTab(tab);
    }
  };

  // --- Dynamic Audio Logic ---
  const getAudioConfig = () => {
    if (activeTab === 'sidestories') {
        // Only switch BGM if inside a specific volume
        if (activeSideStoryVolumeId === 'VOL_DAILY') {
            return { src: BGM_DAILY, title: "TIMELINE DAILY", composer: "NOVA_OST" };
        }
        if (activeSideStoryVolumeId === 'VOL_MEMORIES') {
            return { src: BGM_RAIN, title: "FRAGMENTED RAIN", composer: "NOVA_OST" };
        }
        // If just in the menu (activeSideStoryVolumeId is null) or unknown volume, fall back to MAIN
        return { src: BGM_MAIN, title: "TIMELINE MAIN", composer: "NOVA_OST" };
    }
    // Default / Home / Reader
    return { src: BGM_MAIN, title: "TIMELINE MAIN", composer: "NOVA_OST" };
  };

  const audioConfig = getAudioConfig();

  return (
    <>
      {/* Global Cursor - Always rendered on top */}
      <CustomCursor />

      {/* Render Boot Sequence */}
      {appState === 'BOOT' && (
        <BootSequence 
          onComplete={handleBootComplete} 
          isNormalBoot={setupCompleted} 
          language={language}
        />
      )}

      {/* Render Initial Setup */}
      {appState === 'SETUP' && (
        <InitialSetup 
            onComplete={handleSetupComplete}
            language={language}
            setLanguage={setLanguage}
            crtEnabled={crtEnabled}
            setCrtEnabled={setCrtEnabled}
            isLightTheme={isLightTheme}
            setIsLightTheme={setIsLightTheme}
            bgmPlaying={bgmPlaying}
            setBgmPlaying={setBgmPlaying}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
        />
      )}

      {/* Main Story Transition Animation */}
      {isEnteringStory && (
        <StoryEntryAnimation 
            onComplete={handleStoryEntryComplete}
            language={language}
        />
      )}

      {/* Render Main App */}
      {appState === 'READY' && (
        <div className="flex flex-col lg:flex-row h-screen supports-[height:100dvh]:h-[100dvh] bg-ash-black text-ash-light overflow-hidden font-mono selection:bg-ash-light selection:text-ash-black cursor-none">
          
          {/* Global Texture Overlays */}
          <div className="noise-overlay"></div>
          
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 bg-grid-hard pointer-events-none opacity-50"></div>

          {/* Main Layout */}
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={handleNavigationChange} 
            language={language}
            setLanguage={setLanguage}
            crtEnabled={crtEnabled}
            setCrtEnabled={setCrtEnabled}
            isLightTheme={isLightTheme}
            setIsLightTheme={setIsLightTheme}
            bgmPlaying={bgmPlaying}
            setBgmPlaying={setBgmPlaying}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
            // Audio Props
            audioSrc={audioConfig.src}
            trackTitle={audioConfig.title}
            trackComposer={audioConfig.composer}
          />
          
          <main className="flex-1 h-full overflow-hidden relative z-10 border-l-2 border-ash-dark">
            <Suspense fallback={<LoadingOverlay />}>
                <div 
                  key={activeTab}
                  className="h-full overflow-y-auto pb-20 lg:pb-0 bg-ash-black/90 animate-slide-in"
                >
                  {activeTab === 'home' && (
                    <HomePage 
                      onNavigate={handleHomeNavigate}
                      language={language}
                      setLanguage={setLanguage}
                    />
                  )}
                  {activeTab === 'characters' && <CharactersPage language={language} />}
                  {activeTab === 'database' && <DatabasePage language={language} />}
                  {activeTab === 'reader' && (
                    <ReaderPage 
                      currentIndex={currentChapterIndex} 
                      onChapterChange={setCurrentChapterIndex} 
                      language={language}
                      isLightTheme={isLightTheme}
                      readerFont={readerFont}
                    />
                  )}
                  {activeTab === 'sidestories' && (
                    <SideStoriesPage 
                      language={language} 
                      isLightTheme={isLightTheme}
                      onVolumeChange={setActiveSideStoryVolumeId}
                      readerFont={readerFont}
                    />
                  )}
                </div>
            </Suspense>
          </main>
        </div>
      )}
    </>
  );
};

export default App;
