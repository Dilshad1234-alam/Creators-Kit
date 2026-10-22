"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { getImageUrl } from '@/lib/imagekit';
import { 
  User, 
  ShoppingBag, 
  GraduationCap, 
  Settings, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  Lock, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Download, 
  FileText, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Award, 
  Camera, 
  Check, 
  ChevronRight, 
  Volume2, 
  Maximize
} from 'lucide-react';

/* =========================================================================
   1. MASTERCLASS / LEARNING PORTAL TAB COMPONENT
   ========================================================================= */
function AccountMasterclassTab() {
  // Course curriculum data
  const courses = useMemo(() => [
    {
      id: 'instagram',
      title: 'Instagram Mastery',
      badge: 'Worth ₹1,999',
      image: '/banner 5.png',
      duration: '2h 15m',
      totalLessons: 12,
      progress: 75,
      description: 'Master the 2026 Instagram algorithm, viral reel hooks, bio setup and brand collaborations.',
      modules: [
        {
          moduleTitle: 'Module 1: Foundations & High-Growth Setup',
          lessons: [
            { id: 'ig-1', title: 'Profile Architecture & High-Converting Bio', duration: '08:24', completed: true, locked: false },
            { id: 'ig-2', title: 'Defining Your Creator Niche & Target Audience', duration: '11:05', completed: true, locked: false },
            { id: 'ig-3', title: '2026 Instagram Algorithm & Reach Metrics', duration: '14:32', completed: true, locked: false },
          ]
        },
        {
          moduleTitle: 'Module 2: Viral Reels Production & Retention',
          lessons: [
            { id: 'ig-4', title: 'The 3-Second Visual Hook Formula', duration: '12:40', completed: true, locked: false },
            { id: 'ig-5', title: 'Pacing, Micro-Cuts & Audio Sync Mastery', duration: '15:10', completed: true, locked: false },
            { id: 'ig-6', title: 'Trending Audio Selection & Timing Secrets', duration: '09:18', completed: false, locked: false },
            { id: 'ig-7', title: 'Auto-Captions, Kinetic Text & Retention Triggers', duration: '13:50', completed: false, locked: false },
          ]
        },
        {
          moduleTitle: 'Module 3: Audience Monetisation & Brand Deals',
          lessons: [
            { id: 'ig-8', title: 'DM Funnels & Converting Views to Buyers', duration: '16:04', completed: false, locked: false },
            { id: 'ig-9', title: 'Media Kit Creation & Pitching Top Brands', duration: '18:22', completed: false, locked: true },
            { id: 'ig-10', title: 'Negotiating Pricing & Deliverables', duration: '14:15', completed: false, locked: true },
            { id: 'ig-11', title: 'Broadcast Channels & Superfans Community', duration: '10:45', completed: false, locked: true },
            { id: 'ig-12', title: 'Scaling from 10k to 100k Followers Sustainably', duration: '21:10', completed: false, locked: true },
          ]
        }
      ]
    },
    {
      id: 'youtube',
      title: 'YouTube Mastery',
      badge: 'Worth ₹1,999',
      image: '/banner 6.png',
      duration: '3h 40m',
      totalLessons: 14,
      progress: 20,
      description: 'The end-to-end blueprint to launch, optimize, rank, and monetize your YouTube channel.',
      modules: [
        {
          moduleTitle: 'Module 1: Channel Kickstart & Gear Setup',
          lessons: [
            { id: 'yt-1', title: 'YouTube Channel Architecture & Brand Identity', duration: '10:15', completed: true, locked: false },
            { id: 'yt-2', title: 'Budget Gear: Audio, Camera & 3-Point Lighting', duration: '14:20', completed: true, locked: false },
            { id: 'yt-3', title: 'High-CTR Thumbnail Secrets in Photoshop', duration: '18:45', completed: false, locked: false },
          ]
        },
        {
          moduleTitle: 'Module 2: Search SEO & Video Packaging',
          lessons: [
            { id: 'yt-4', title: 'YouTube Search SEO & Tag Strategies', duration: '16:30', completed: false, locked: false },
            { id: 'yt-5', title: 'Video Scripting Framework for High Retention', duration: '22:10', completed: false, locked: true },
            { id: 'yt-6', title: 'Shorts vs Long-Form Growth Symbiosis', duration: '12:05', completed: false, locked: true },
          ]
        },
        {
          moduleTitle: 'Module 3: AdSense, Sponsorships & Affiliate Income',
          lessons: [
            { id: 'yt-7', title: 'Unlocking YPP Monetization Fast Track', duration: '15:40', completed: false, locked: true },
            { id: 'yt-8', title: 'Affiliate Marketing & Dedicated Sponsorships', duration: '19:50', completed: false, locked: true },
          ]
        }
      ]
    },
    {
      id: 'filmora',
      title: 'Filmora Video Editing Mastery',
      badge: 'Worth ₹999',
      image: '/banner 8.png',
      duration: '1h 50m',
      totalLessons: 8,
      progress: 0,
      description: 'Master fast, cinematic video editing with Filmora from initial cuts to 4K color grading.',
      modules: [
        {
          moduleTitle: 'Module 1: Interface & Essential Cuts',
          lessons: [
            { id: 'fl-1', title: 'Filmora Interface Tour & Project Settings', duration: '11:20', completed: false, locked: false },
            { id: 'fl-2', title: 'Smart Cuts, J-Cuts, L-Cuts & Speed Ramping', duration: '14:40', completed: false, locked: false },
            { id: 'fl-3', title: 'Cinematic Color Grading & LUT Presets', duration: '17:15', completed: false, locked: true },
            { id: 'fl-4', title: 'Keyframing, Dynamic Motion & Sound FX', duration: '16:30', completed: false, locked: true },
            { id: 'fl-5', title: 'Export Presets for Crisp 4K Reels & Shorts', duration: '13:55', completed: false, locked: true },
          ]
        }
      ]
    }
  ], []);

  const [activeCourseId, setActiveCourseId] = useState('instagram');
  const [completedLessonIds, setCompletedLessonIds] = useState(
    new Set(['ig-1', 'ig-2', 'ig-3', 'ig-4', 'ig-5', 'yt-1', 'yt-2', 'yt-3', 'fl-1', 'fl-2', 'fl-3', 'fl-4'])
  );
  const [activeLessonId, setActiveLessonId] = useState('ig-6');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [activeResourceTab, setActiveResourceTab] = useState('overview');

  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === activeCourseId) || courses[0];
  }, [courses, activeCourseId]);

  // Find active lesson object
  const activeLesson = useMemo(() => {
    for (const mod of activeCourse.modules) {
      const found = mod.lessons.find(l => l.id === activeLessonId);
      if (found) return found;
    }
    return activeCourse.modules[0]?.lessons[0] || null;
  }, [activeCourse, activeLessonId]);

  // Calculate overall stats across all courses
  const allLessons = useMemo(() => {
    return courses.flatMap(c => c.modules.flatMap(m => m.lessons));
  }, [courses]);

  const totalLessonsCount = allLessons.length;
  const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
  const overallPercentage = Math.round((completedCount / totalLessonsCount) * 100);

  // Toggle lesson completed
  const toggleLessonCompleted = (lessonId) => {
    setCompletedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  // Find next lesson
  const handleNextLesson = () => {
    const flatLessons = activeCourse.modules.flatMap(m => m.lessons);
    const currentIndex = flatLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex >= 0 && currentIndex < flatLessons.length - 1) {
      const next = flatLessons[currentIndex + 1];
      if (!next.locked) {
        setActiveLessonId(next.id);
        setIsPlaying(true);
      }
    }
  };

  // Find previous lesson
  const handlePrevLesson = () => {
    const flatLessons = activeCourse.modules.flatMap(m => m.lessons);
    const currentIndex = flatLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex > 0) {
      const prev = flatLessons[currentIndex - 1];
      setActiveLessonId(prev.id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
      
      {/* 1. HERO LEARNING PORTAL BANNER */}
      <div className="relative w-full bg-[#0c0e14] text-white p-12 sm:p-15 md:p-25 border border-neutral-800 shadow-2xl overflow-hidden">
  
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src={getImageUrl('/about5.png')} 
            alt="Masterclass Portal Banner" 
            fill 
            sizes="100vw" 
            className="object-cover object-center opacity-40" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e14] via-[#0c0e14]/80 to-transparent"></div>
        </div>

        {/* Glow & subtle grid effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#900606]/25 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#e50914]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
      
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Learn. Create. <span className="text-[#900606] drop-shadow-[0_2px_12px_rgba(144,6,6,0.8)]">Grow.</span>
            </h2>
      
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
              Your unlimited lifetime creator bundle access. Learn step-by-step from industry experts, apply templates, and scale your audience.
            </p>
          </div>

        </div>
      </div>

      {/* 2. COURSE PROGRESS SELECTOR CARDS */}
      <div className="max-w-[1750px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Your Enrolled Courses</span>
            <span className="text-xs font-bold bg-[#900606]/10 text-[#900606] px-2.5 py-0.5 rounded-full">
              3 Included
            </span>
          </h3>
          <span className="text-xs font-semibold text-neutral-500">Click a card to switch curriculum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isSelected = course.id === activeCourseId;
            const courseLessons = course.modules.flatMap(m => m.lessons);
            const courseCompleted = courseLessons.filter(l => completedLessonIds.has(l.id)).length;
            const coursePct = Math.round((courseCompleted / courseLessons.length) * 100);

            return (
              <div
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  const firstLesson = course.modules[0]?.lessons[0];
                  if (firstLesson) setActiveLessonId(firstLesson.id);
                }}
                className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border bg-white dark:bg-neutral-900 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#900606] shadow-lg ring-2 ring-[#900606]/20 bg-rose-50/20 dark:bg-[#900606]/5' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Flush Edge-to-Edge Larger Image Container */}
                  <div className="relative w-full h-44 sm:h-48 bg-neutral-100">
                    <Image
                      src={getImageUrl(course.image)}
                      alt={course.title}
                      fill
                      className="object-cover "
                    />
                    <span className="absolute top-3 right-3 bg-[#900606] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                      {course.badge}
                    </span>
                    {isSelected && (
                      <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/20 z-10">
                        <Play className="w-2.5 h-2.5 fill-white" /> Currently Playing
                      </span>
                    )}
                  </div>

                  {/* Content Padding Section */}
                  <div className="p-5 sm:p-6 pb-3">
                    <h4 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg group-hover:text-[#900606] transition-colors mb-1.5">
                      {course.title}
                    </h4>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-5 sm:p-6 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-neutral-500">{courseCompleted} of {course.totalLessons} Lessons</span>
                    <span className="text-[#900606] font-bold">{coursePct}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#900606] rounded-full transition-all duration-300"
                      style={{ width: `${coursePct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE PLAYER & CURRICULUM PLAYLIST WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Video Player & Lesson Notes */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 sm:p-7 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            
            {/* Player Container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-neutral-800 flex items-center justify-center group">
              {/* Video Backdrop Mockup */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={getImageUrl(activeCourse.image)}
                  alt={activeLesson?.title || 'Lesson Video'}
                  fill
                  className={`object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-40 blur-[1px]' : 'opacity-65'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
              </div>

              {/* Watermark / Logo in Video Corner */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/70 text-white font-black text-xs tracking-wider border border-white/20">
                  CREATORS<span className="text-[#900606]">KIT</span>
                </span>
                <span className="text-xs font-medium text-neutral-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                  {activeCourse.title}
                </span>
              </div>

              {/* Center Play/Pause Overlay */}
              <div className="relative z-10 text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#900606] hover:bg-[#a60808] text-white flex items-center justify-center shadow-[0_0_35px_rgba(144,6,6,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 group-hover:shadow-[0_0_45px_rgba(144,6,6,0.9)] cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-white" />
                  ) : (
                    <Play className="w-8 h-8 fill-white ml-1" />
                  )}
                </button>
                <p className="text-white text-xs sm:text-sm font-semibold mt-3 tracking-wide drop-shadow-md">
                  {isPlaying ? 'Video Playing • Click to Pause' : 'Click to Play Lesson'}
                </p>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-5 z-20 space-y-2">
                {/* Scrubber timeline */}
                <div className="w-full h-1.5 hover:h-2.5 bg-white/25 rounded-full cursor-pointer relative transition-all group/scrubber">
                  <div 
                    className="h-full bg-[#900606] rounded-full relative"
                    style={{ width: isPlaying ? '64%' : '38%' }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/scrubber:opacity-100 transition-opacity"></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white text-xs pt-1">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="hover:text-[#ff6b6b] transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button onClick={handlePrevLesson} className="hover:text-[#ff6b6b] transition-colors" title="Previous Lesson">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button onClick={handleNextLesson} className="hover:text-[#ff6b6b] transition-colors" title="Next Lesson">
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-[11px] sm:text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlaying ? '05:42' : '03:15'}</span> / <span>{activeLesson?.duration || '12:00'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIdx]);
                      }}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold font-mono transition-colors"
                    >
                      {playbackSpeed}
                    </button>
                    <button className="hover:text-[#ff6b6b] transition-colors" title="Fullscreen">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Title & Primary Action Controls */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#900606] mb-1 block">
                  {activeCourse.title} • Current Lesson
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {activeLesson?.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {activeLesson?.duration}</span>
                  <span>•</span>
                  <span>Full HD 1080p Stream</span>
                </p>
              </div>

              {/* Complete & Next Navigation */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => activeLesson && toggleLessonCompleted(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    activeLesson && completedLessonIds.has(activeLesson.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-[#900606] hover:text-white text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{activeLesson && completedLessonIds.has(activeLesson.id) ? 'Completed' : 'Mark as Done'}</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#900606] hover:bg-[#7a0505] text-white shadow-md hover:shadow-lg transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Resources & Notes Tabs */}
            <div className="pt-6">
              <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <button
                  onClick={() => setActiveResourceTab('overview')}
                  className={`text-xs sm:text-sm font-bold pb-2 transition-all relative ${
                    activeResourceTab === 'overview'
                      ? 'text-[#900606] border-b-2 border-[#900606]'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  Lesson Overview
                </button>
                <button
                  onClick={() => setActiveResourceTab('resources')}
                  className={`text-xs sm:text-sm font-bold pb-2 transition-all relative flex items-center gap-1.5 ${
                    activeResourceTab === 'resources'
                      ? 'text-[#900606] border-b-2 border-[#900606]'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>Downloads & Resources</span>
                  <span className="text-[10px] bg-[#900606]/10 text-[#900606] px-1.5 py-0.2 rounded-full font-extrabold">3</span>
                </button>
              </div>

              <div className="mt-4">
                {activeResourceTab === 'overview' ? (
                  <div className="space-y-3 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    <p>
                      In this module session, you will learn the exact retention framework used to hook viewers within the first 3 seconds and sustain a 70%+ average percentage viewed on vertical short-form platforms.
                    </p>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                      <h5 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider text-[#900606]">
                        Key Takeaways:
                      </h5>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li>The 3-point visual hook: text contrast, motion anchor, and tonal curiosity.</li>
                        <li>How to analyze the audio waveform to identify high-velocity viral drops.</li>
                        <li>Structuring your call to action without killing the reel retention tail.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-300 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#900606]" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">Viral Hook Blueprint 2026.pdf</p>
                          <p className="text-[11px] text-neutral-500">PDF Document • 1.4 MB</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-[#900606] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-300 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#900606]" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">Filmora & Premiere LUT Pack.zip</p>
                          <p className="text-[11px] text-neutral-500">Archive • 18.2 MB</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-[#900606] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Curriculum Playlist Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            
            <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#900606] uppercase tracking-wider block">Course Playlist</span>
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{activeCourse.title}</h4>
              </div>
              <span className="text-xs font-bold bg-[#900606]/10 text-[#900606] px-2.5 py-1 rounded-full">
                {activeCourse.totalLessons} Lessons
              </span>
            </div>

            {/* Scrollable Lesson Modules */}
            <div className="space-y-5 max-h-[640px] overflow-y-auto pr-1">
              {activeCourse.modules.map((mod, modIdx) => (
                <div key={modIdx} className="space-y-2">
                  <div className="bg-neutral-100 dark:bg-neutral-800/70 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {mod.moduleTitle}
                  </div>

                  <div className="space-y-1.5">
                    {mod.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.has(lesson.id);
                      const isCurrent = lesson.id === activeLessonId;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (!lesson.locked) {
                              setActiveLessonId(lesson.id);
                              setIsPlaying(true);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer select-none ${
                            isCurrent
                              ? 'bg-[#900606] text-white shadow-md font-bold'
                              : lesson.locked
                              ? 'opacity-50 cursor-not-allowed bg-neutral-50/50 dark:bg-neutral-800/20 text-neutral-400'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                              ) : lesson.locked ? (
                                <Lock className="w-4 h-4 text-neutral-400" />
                              ) : (
                                <Play className={`w-3.5 h-3.5 ${isCurrent ? 'fill-white text-white' : 'text-neutral-500'}`} />
                              )}
                            </div>
                            <span className="text-xs truncate leading-snug">
                              {lesson.title}
                            </span>
                          </div>

                          <span className={`text-[11px] font-mono shrink-0 ${isCurrent ? 'text-white/90' : 'text-neutral-400'}`}>
                            {lesson.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

/* =========================================================================
   2. USER PROFILE TAB COMPONENT
   ========================================================================= */
function AccountUserTab({ formData, setFormData, handleSave, handleImageUpload, saveSuccess }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
      
      {/* Profile Header section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[6px] border-white dark:border-neutral-800 shadow-xl bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={formData.profileImage ? getImageUrl(formData.profileImage) : "/profile.svg"} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Edit camera badge */}
          <label className="absolute bottom-1 right-1 bg-[#900606] text-white p-2.5 rounded-full shadow-lg hover:bg-[#700505] transition-all hover:scale-110 border-2 border-white cursor-pointer">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <h2 className="font-black text-2xl sm:text-3xl text-neutral-800 dark:text-neutral-100 tracking-tight">
          {formData.name || 'Rajat'}
        </h2>
        <p className="text-neutral-500 font-medium text-sm mt-1">
          {formData.email || 'rjsrivastava1999@gmail.com'}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#900606]/10 text-[#900606] text-xs font-bold border border-[#900606]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Creator Member</span>
        </span>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 mb-8"></div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Form Grid */}
      <form className="space-y-8" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">
              Full Name
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
              className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/40 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">
              Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/40 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210" 
              className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/40 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">
              Location / City
            </label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. New Delhi, India" 
              className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/40 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">
              Postal Code
            </label>
            <input 
              type="text" 
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              placeholder="e.g. 110001" 
              className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/40 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base" 
            />
          </div>
          
        </div>
        
        <div className="pt-4 flex justify-end md:justify-start">
          <button 
            type="submit" 
            className="px-10 py-4 bg-[#900606] hover:bg-[#7a0505] text-white rounded-full font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(144,6,6,0.35)] hover:shadow-[0_6px_22px_rgba(144,6,6,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================================
   3. MY ORDERS TAB COMPONENT
   ========================================================================= */
function AccountOrdersTab({ email }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.error || 'Failed to load orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [email]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 sm:p-16 text-center shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center">
        <span className="text-6xl mb-6">🛍️</span>
        <h2 className="text-2xl font-bold mb-3 text-[#900606]">No orders placed yet</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Looks like you haven&apos;t bought anything from us yet. Explore our gear bundles and unlock the free masterclasses!
        </p>
        <Link 
          href="/product" 
          className="px-8 py-3.5 bg-[#900606] hover:bg-[#7a0505] text-white rounded-xl font-bold text-sm shadow-[0_4px_16px_rgba(144,6,6,0.35)] transition-all"
        >
          Explore Bundles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusStyles = {
            Confirmed: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            Packed: 'bg-blue-50 text-blue-700 border-blue-200',
            Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            Delivered: 'bg-green-50 text-green-700 border-green-200',
            Cancelled: 'bg-red-50 text-red-700 border-red-200',
          };
          const statusClass = statusStyles[order.status] || 'bg-neutral-50 text-neutral-600 border-neutral-200';

          return (
            <div key={order._id} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Order Placed</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Total</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Order #</p>
                    <p className="font-mono font-bold text-[#900606]">{order._id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusClass} flex-1 sm:flex-none text-center`}>
                    {order.status}
                  </span>
                  <Link 
                    href={`/order-success?orderId=${order._id}`}
                    className="px-4 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-1 sm:flex-none text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#900606] dark:text-red-400 line-clamp-1 text-sm">{item.name}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                        <p className="font-bold text-neutral-800 dark:text-white mt-1 text-sm">₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   4. SETTINGS TAB COMPONENT
   ========================================================================= */
function AccountSettingsTab({ email, theme, toggleTheme }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwData, setPwData] = useState({ current: '', newPw: '' });
  const [pwStatus, setPwStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('creatorsKitEmailNotifs');
    if (saved !== null) setEmailNotifs(saved === 'true');
  }, []);

  const toggleNotifs = () => {
    const newVal = !emailNotifs;
    setEmailNotifs(newVal);
    localStorage.setItem('creatorsKitEmailNotifs', newVal.toString());
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwStatus('Changing...');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword: pwData.current, newPassword: pwData.newPw })
      });
      const data = await res.json();
      if (data.success) {
        setPwStatus('Password updated successfully!');
        setPwData({ current: '', newPw: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPwStatus(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPwStatus('An error occurred');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[1rem] p-8 sm:p-12 md:p-16 shadow-sm border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[550px] flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-white">Settings</h2>
      
      {showPasswordModal && (
        <div className="absolute inset-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm z-20 flex items-center justify-center p-6 rounded-[2.5rem]">
          <form onSubmit={handlePasswordChange} className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4 text-neutral-800 dark:text-white">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Current Password</label>
                <input type="password" required value={pwData.current} onChange={e => setPwData({...pwData, current: e.target.value})} className="w-full px-4 py-2.5 mt-1 rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 focus:outline-none focus:border-[#900606]" />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">New Password</label>
                <input type="password" required value={pwData.newPw} onChange={e => setPwData({...pwData, newPw: e.target.value})} className="w-full px-4 py-2.5 mt-1 rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 focus:outline-none focus:border-[#900606]" />
              </div>
              {pwStatus && <p className={`text-sm font-semibold ${pwStatus.includes('success') ? 'text-green-600' : 'text-[#900606]'}`}>{pwStatus}</p>}
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => { setShowPasswordModal(false); setPwStatus(''); }} className="flex-1 py-2.5 font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 font-bold text-white bg-[#900606] hover:bg-[#700505] rounded-xl transition-colors">Update</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FBFBF7] dark:bg-neutral-800/50">
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-white text-base">Email Notifications</h4>
            <p className="text-sm text-neutral-500 mt-1">Receive course updates, order status and creator tips</p>
          </div>
          <div onClick={toggleNotifs} className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${emailNotifs ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ${emailNotifs ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FBFBF7] dark:bg-neutral-800/50">
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-white text-base">Dark Mode</h4>
            <p className="text-sm text-neutral-500 mt-1">Toggle dashboard appearance theme</p>
          </div>
          <div onClick={toggleTheme} className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
          <h3 className="font-bold text-neutral-800 dark:text-white mb-4 text-lg">Security & Authentication</h3>
          <button onClick={() => setShowPasswordModal(true)} className="px-6 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================================
   5. NOTIFICATIONS TAB COMPONENT
   ========================================================================= */
function AccountNotificationsTab({ email }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`/api/user/notifications?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [email]);

  const defaultNotifications = [
    {
      _id: 'notif-1',
      title: 'Masterclass Access Activated',
      desc: 'You have been granted lifetime access to Instagram Mastery, YouTube Mastery, and Filmora Editing.',
      unread: true,
      createdAt: '2026-10-22T10:00:00.000Z'
    },
    {
      _id: 'notif-2',
      title: 'Welcome to CreatorsKit',
      desc: 'Check your profile and start learning your first video lesson in the Masterclass tab.',
      unread: false,
      createdAt: '2026-10-21T10:00:00.000Z'
    }
  ];

  const displayNotifs = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-sm border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden min-h-[550px] flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-white">Notifications</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayNotifs.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-6 sm:p-7 rounded-2xl border transition-all hover:shadow-sm ${
                notif.unread 
                  ? 'border-[#900606]/30 bg-[#900606]/5 dark:bg-[#900606]/10' 
                  : 'border-neutral-200 dark:border-neutral-800 bg-[#FBFBF7] dark:bg-neutral-800/50'
              } flex gap-5 items-start`}
            >
              <div className="mt-1.5 shrink-0">
                <div className={`w-3.5 h-3.5 rounded-full ${notif.unread ? 'bg-[#900606]' : 'bg-neutral-400'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-base sm:text-lg mb-1 ${notif.unread ? 'text-[#900606] dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {notif.title}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mb-3 leading-relaxed">
                  {notif.desc}
                </p>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Recent
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   6. MAIN ACCOUNT CONTENT WITH TAB ROUTING
   ========================================================================= */
function AccountContent() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Normalize query parameter (?tab=...)
  const rawTab = searchParams.get('tab') || 'user';
  const tabAliases = {
    'user-info': 'user',
    'settings': 'setting',
    'my-orders': 'orders',
  };
  const activeTab = tabAliases[rawTab] || rawTab;

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Rajat',
    email: 'rjsrivastava1999@gmail.com',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    postalCode: '110001',
    profileImage: ''
  });

  // Load existing user details if available
  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    const sessionName = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    const savedUserInfo = localStorage.getItem('creatorsKitUserInfo');

    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          name: parsed.name || sessionName || prev.name,
          email: parsed.email || sessionEmail || prev.email
        }));
      } catch (e) {}
    } else if (sessionEmail || sessionName) {
      setFormData(prev => ({
        ...prev,
        name: sessionName || prev.name,
        email: sessionEmail || prev.email
      }));
    }

    if (sessionEmail) {
      fetch(`/api/user/profile?email=${encodeURIComponent(sessionEmail)}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setFormData(prev => ({
              ...prev,
              name: result.data.name || prev.name,
              phone: result.data.phone || prev.phone,
              location: result.data.location || prev.location,
              postalCode: result.data.postalCode || prev.postalCode,
              profileImage: result.data.profileImage || prev.profileImage
            }));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Update tab in URL without page reload
  const handleTabChange = (tabId) => {
    router.replace(`${pathname}?tab=${tabId}`, { scroll: false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('creatorsKitUserInfo', JSON.stringify(formData));
      sessionStorage.setItem('userEmail', formData.email);
      sessionStorage.setItem('userName', formData.name);

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => {});

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const updated = { ...prev, profileImage: reader.result };
          localStorage.setItem('creatorsKitUserInfo', JSON.stringify(updated));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('creatorsKitUserInfo');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    try {
      import('next-auth/react').then(({ signOut }) => signOut({ redirect: false }));
    } catch (e) {}
    router.push('/login');
  };

  // Exact tabs as specified
  const navItems = [
    { 
      id: 'user', 
      label: 'User', 
      icon: <User className="w-5 h-5" /> 
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      id: 'masterclass',
      label: 'Masterclass',
      icon: <GraduationCap className="w-5 h-5" />
    },
    { 
      id: 'setting', 
      label: 'Setting', 
      icon: <Settings className="w-5 h-5" /> 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-5 h-5" /> 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return (
          <AccountUserTab
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleImageUpload={handleImageUpload}
            saveSuccess={saveSuccess}
          />
        );
      case 'orders':
        return <AccountOrdersTab email={formData.email} />;
      case 'masterclass':
        return <AccountMasterclassTab />;
      case 'setting':
        return <AccountSettingsTab email={formData.email} theme={theme} toggleTheme={toggleTheme} />;
      case 'notifications':
        return <AccountNotificationsTab email={formData.email} />;
      default:
        return (
          <AccountUserTab
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleImageUpload={handleImageUpload}
            saveSuccess={saveSuccess}
          />
        );
    }
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-background pt-24 md:pt-28 pb-8 md:pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-[#900606] dark:text-white tracking-tight">
                Account Details
              </h1>
              <p className="text-xs text-neutral-500 font-medium mt-1">Manage profile, orders & courses</p>
            </div>

            <div className="flex flex-col gap-1.5 bg-white/60 dark:bg-neutral-900/60 p-2.5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all text-left duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-[#900606] text-white shadow-[0_4px_14px_rgba(144,6,6,0.35)] translate-x-1' 
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 hover:text-neutral-900'
                    }`}
                  >
                    <span className={`${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="my-2 border-t border-neutral-200/80 dark:border-neutral-800 mx-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div className="w-full lg:flex-1 min-w-0">
            {renderContent()}
          </div>
          
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   7. ROOT EXPORT WITH SUSPENSE BOUNDARY
   ========================================================================= */
export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] bg-[#FDFBF7] dark:bg-background pt-32 pb-16 md:pb-24 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
