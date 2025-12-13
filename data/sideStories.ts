
import { SideStoryVolume, Chapter } from '../types';
import { chapterS001 } from './side_story_files/S001';
import { chapterS002 } from './side_story_files/S002';
import { chapterS003 } from './side_story_files/S003';
import { chapterS004 } from './side_story_files/S004';
import { chapterX001 } from './side_story_files/X001';
import { chapterX002 } from './side_story_files/X002';
import { chapterX003 } from './side_story_files/X003';
import { chapterSLegacy } from './side_story_files/S_Legacy';

// Helper to create garbled chapters
const createGarbledChapter = (id: string, dateLabel: string): Chapter => ({
  id: id,
  date: dateLabel,
  status: 'locked',
  translations: {
    'zh-CN': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" },
    'zh-TW': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" },
    'en': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" }
  }
});

export const sideStoryVolumes: SideStoryVolume[] = [
  {
    id: "VOL_MEMORIES",
    title: "那场仍未结束的零碎之雨",
    titleEn: "The Fragmented Rain That Never Ended",
    status: 'unlocked',
    chapters: [
      chapterS001,
      chapterS002,
      chapterS003,
      chapterS004,
      chapterSLegacy // Added Legacy chapter here
    ]
  },
  {
    id: "VOL_DAILY",
    title: "时域日常", 
    titleEn: "Time Line Daily",
    status: 'unlocked',
    chapters: [
        chapterX001,
        chapterX002,
        chapterX003,
        // Garbled Chapters
        createGarbledChapter("ERR_004", "档案记录: X-004"),
    ]
  },
  {
    id: "VOL_UNKNOWN",
    title: "▓▓▓▓▓▓",
    titleEn: "UNKNOWN_SECTOR",
    status: 'corrupted',
    chapters: []
  }
];
