"use client";

import { useState, useEffect, Suspense, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { getImageUrl } from '@/lib/imagekit';
import useEmblaCarousel from 'embla-carousel-react';
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
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Volume2, 
  Maximize
} from 'lucide-react';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

/* =========================================================================
   1. MASTERCLASS / LEARNING PORTAL TAB COMPONENT
   ========================================================================= */
function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase().split('?')[0];
  return (
    clean.endsWith('.webp') ||
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    clean.endsWith('.png') ||
    clean.endsWith('.gif') ||
    clean.endsWith('.svg') ||
    clean.endsWith('.avif')
  );
}

function getEmbedUrl(rawUrl) {
  if (!rawUrl) return '';
  const url = rawUrl.trim();
  const ytParams = 'autoplay=1&controls=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1';

  if (url.includes('youtube.com/watch')) {
    try {
      const u = new URL(url);
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}?${ytParams}` : url.replace('watch?v=', 'embed/') + `?${ytParams}`;
    } catch (e) {
      return url.replace('watch?v=', 'embed/').split('&')[0] + `?${ytParams}`;
    }
  }
  if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    return id ? `https://www.youtube.com/embed/${id}?${ytParams}` : url;
  }
  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?${ytParams}`;
  }
  if (url.includes('vimeo.com/')) {
    const parts = url.split('vimeo.com/');
    const id = parts[1]?.split('?')[0]?.replace('video/', '');
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0` : url;
  }
  return '';
}

const DEFAULT_BUNDLE_MASTERCLASSES = [
  {
    id: 'instagram-mastery',
    title: 'Instagram Mastery',
    description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
    badge: '100% Free Included',
    image: '/video 2.webp',
    duration: '2h 15m',
    progress: 0,
    videoUrl: '/videos/instagram-masterclass.mp4',
    videoLink: '/videos/instagram-masterclass.mp4',
    totalLessons: 4,
    modules: [
      {
        moduleTitle: 'Module 1: High-Growth Foundations & Reels Secrets',
        lessons: [
          { id: 'ig-1', title: 'Profile Architecture & High-Converting Bio', duration: '08:24', videoUrl: '/videos/instagram-masterclass.mp4', videoLink: '/videos/instagram-masterclass.mp4', locked: false, completed: false, overview: 'Learn to craft an irresistible bio and visual profile architecture that converts visitors into followers.' },
          { id: 'ig-2', title: 'Defining Your Creator Niche & Target Audience', duration: '11:05', videoUrl: '/videos/instagram-masterclass.mp4', videoLink: '/videos/instagram-masterclass.mp4', locked: false, completed: false, overview: 'Find your content moat and zero in on high-engagement demographics.' },
          { id: 'ig-3', title: '2026 Instagram Algorithm & Reach Multipliers', duration: '14:32', videoUrl: '/videos/instagram-masterclass.mp4', videoLink: '/videos/instagram-masterclass.mp4', locked: false, completed: false, overview: 'Deep dive into save/share ratios and algorithmic ranking triggers.' },
          { id: 'ig-4', title: 'The 3-Second Visual Hook Formula for Viral Reels', duration: '12:40', videoUrl: '/videos/instagram-masterclass.mp4', videoLink: '/videos/instagram-masterclass.mp4', locked: false, completed: false, overview: 'Hook viewers in under 3 seconds using audio and motion contrast.' }
        ]
      }
    ]
  },
  {
    id: 'youtube-mastery',
    title: 'YouTube Mastery',
    description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
    badge: '100% Free Included',
    image: '/video 1.webp',
    duration: '3h 10m',
    progress: 0,
    videoUrl: '/videos/youtube-masterclass.mp4',
    videoLink: '/videos/youtube-masterclass.mp4',
    totalLessons: 3,
    modules: [
      {
        moduleTitle: 'Module 1: Channel Architecture & Monetization',
        lessons: [
          { id: 'yt-1', title: 'Channel Branding, High-CTR Thumbnail Design & SEO', duration: '12:20', videoUrl: '/videos/youtube-masterclass.mp4', videoLink: '/videos/youtube-masterclass.mp4', locked: false, completed: false, overview: 'Setting up your YouTube channel with proper metadata, tags, and click-worthy thumbnails.' },
          { id: 'yt-2', title: 'Scripting for Maximum Watch Time & Retention', duration: '16:30', videoUrl: '/videos/youtube-masterclass.mp4', videoLink: '/videos/youtube-masterclass.mp4', locked: false, completed: false, overview: 'Storyboarding and pacing secrets that keep audiences glued to the end.' },
          { id: 'yt-3', title: 'Lighting & Studio Mic Setup for Crisp Audio/Video', duration: '14:15', videoUrl: '/videos/youtube-masterclass.mp4', videoLink: '/videos/youtube-masterclass.mp4', locked: false, completed: false, overview: 'How to use your Creators Kit ring light and microphone for studio-grade production.' }
        ]
      }
    ]
  },
  {
    id: 'filmora-mastery',
    title: 'Filmora Mastery',
    description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
    badge: '100% Free Included',
    image: '/video.webp',
    duration: '2h 45m',
    progress: 0,
    videoUrl: '/videos/filmora-masterclass.mp4',
    videoLink: '/videos/filmora-masterclass.mp4',
    totalLessons: 3,
    modules: [
      {
        moduleTitle: 'Module 1: Professional Video Editing with Filmora',
        lessons: [
          { id: 'fl-1', title: 'Interface Setup & Timeline Speed Shortcuts', duration: '10:50', videoUrl: '/videos/filmora-masterclass.mp4', videoLink: '/videos/filmora-masterclass.mp4', locked: false, completed: false, overview: 'Essential hotkeys and project configuration for seamless editing.' },
          { id: 'fl-2', title: 'Smart Cuts, J-Cuts, L-Cuts & Speed Ramping', duration: '14:40', videoUrl: '/videos/filmora-masterclass.mp4', videoLink: '/videos/filmora-masterclass.mp4', locked: false, completed: false, overview: 'Seamless audio-visual transitions used by top creators.' },
          { id: 'fl-3', title: 'Cinematic Color Grading, LUT Presets & Export', duration: '17:15', videoUrl: '/videos/filmora-masterclass.mp4', videoLink: '/videos/filmora-masterclass.mp4', locked: false, completed: false, overview: 'Color correct footage, apply cinematic tones, and export in 4K.' }
        ]
      }
    ]
  }
];

function LockedCoursesView() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 text-center shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="w-18 h-18 rounded-3xl bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/60">
        <Lock className="w-8 h-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#900606]/10 text-[#900606] text-xs font-black uppercase tracking-wider mb-3">
        🔒 Bundle Exclusive Masterclasses
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mb-3">
        Masterclasses Locked
      </h2>

      <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
        Access to <strong className="text-neutral-800 dark:text-neutral-200">Instagram Mastery</strong>, <strong className="text-neutral-800 dark:text-neutral-200">YouTube Mastery</strong>, and <strong className="text-neutral-800 dark:text-neutral-200">Filmora Mastery</strong> is exclusively unlocked when you purchase any Creators Kit studio bundle.
      </p>

      {/* 3 Locked Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        {[
          { title: 'Instagram Mastery', image: '/video 2.webp', tag: 'Reels Algorithm & Growth' },
          { title: 'YouTube Mastery', image: '/video 1.webp', tag: 'Thumbnails, SEO & Monetization' },
          { title: 'Filmora Mastery', image: '/video.webp', tag: 'Cinematic Video Editing' },
        ].map((course, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 p-3.5 flex flex-col items-center text-center overflow-hidden group"
          >
            <div className="w-full h-28 rounded-xl overflow-hidden relative mb-2.5 flex items-center justify-center bg-black/5 dark:bg-black/30">
              <Image
                src={course.image}
                alt={course.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 250px"
                className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-black/75 backdrop-blur-md text-amber-300 flex items-center justify-center shadow-md">
                  <Lock className="w-4 h-4" />
                </span>
              </div>
            </div>
            <h4 className="font-bold text-xs sm:text-[13px] text-neutral-800 dark:text-neutral-200 mb-0.5">
              {course.title}
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium line-clamp-1">{course.tag}</span>
          </div>
        ))}
      </div>

      <Link
        href="/product"
        className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#900606] hover:bg-[#7a0505] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(144,6,6,0.35)] hover:shadow-[0_6px_20px_rgba(144,6,6,0.45)] transition-all flex items-center justify-center gap-2"
      >
        <span>Explore Studio Bundles & Unlock Free</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function AccountMasterclassTab({
  hasAccess = true,
  isMobileVideoFocused = false,
  setIsMobileVideoFocused = () => {}
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState('');
  const [activeLessonId, setActiveLessonId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('creatorskit_completed_lessons');
        if (saved) return new Set(JSON.parse(saved));
      } catch (e) {}
    }
    return new Set(['ig-1', 'ig-2', 'ig-3', 'yt-1', 'fl-1']);
  });

  const fetchMasterclasses = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      const res = await fetch(`/api/homepage-masterclasses?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Filter out courses set to hidden (active === false)
        const visibleCourses = json.data.filter((c) => c.active !== false);
        const mapped = visibleCourses.map((c) => {
          let directVideo = c.videoLink || c.videoUrl || '';
          if (!directVideo || directVideo.includes('w3schools.com') || directVideo.includes('mov_bbb')) {
            const titleLower = (c.title || '').toLowerCase();
            const idLower = (c._id ? c._id.toString() : c.id || '').toLowerCase();
            if (titleLower.includes('instagram') || idLower.includes('instagram')) {
              directVideo = '/videos/instagram-masterclass.mp4';
            } else if (titleLower.includes('youtube') || idLower.includes('youtube')) {
              directVideo = '/videos/youtube-masterclass.mp4';
            } else if (titleLower.includes('filmora') || idLower.includes('filmora')) {
              directVideo = '/videos/filmora-masterclass.mp4';
            } else {
              directVideo = '/videos/masterclass-sample.mp4';
            }
          }

          const rawModules = c.modules && Array.isArray(c.modules) && c.modules.length > 0 ? c.modules : null;
          const courseModules = rawModules
            ? rawModules.map((m) => ({
                ...m,
                lessons: (m.lessons || []).map((l) => ({
                  ...l,
                  videoUrl:
                    !l.videoUrl || l.videoUrl.includes('w3schools.com') || l.videoUrl.includes('mov_bbb')
                      ? directVideo
                      : l.videoUrl,
                  videoLink:
                    !l.videoLink || l.videoLink.includes('w3schools.com') || l.videoLink.includes('mov_bbb')
                      ? directVideo
                      : l.videoLink,
                })),
              }))
            : [
                {
                  moduleTitle: 'Module 1: Complete Masterclass',
                  lessons: [
                    {
                      id: `${c._id || c.id}-lesson-1`,
                      title: c.title,
                      duration: 'Full Masterclass',
                      videoUrl: directVideo,
                      videoLink: directVideo,
                      locked: false,
                      completed: false,
                    },
                  ],
                },
              ];

          return {
            ...c,
            id: c._id ? c._id.toString() : c.id,
            duration: c.duration || 'Full Masterclass',
            progress: typeof c.progress === 'number' ? c.progress : 0,
            badge: c.badge || '100% Free',
            image: c.image || '/banner 5.png',
            videoUrl: directVideo,
            videoLink: directVideo,
            totalLessons:
              courseModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1,
            modules: courseModules,
          };
        });

        // If no custom courses are present, default to the 3 guaranteed bundle masterclasses
        const finalCourses = mapped.length > 0 ? mapped : DEFAULT_BUNDLE_MASTERCLASSES;
        setCourses(finalCourses);

        // Auto-select course if activeCourseId is not set or not in current list
        setActiveCourseId((prevId) => {
          const exists = finalCourses.some((c) => c.id === prevId || (c._id && c._id === prevId));
          if (exists) return prevId;
          const firstCourse = finalCourses[0];
          const firstLesson = (firstCourse?.modules || []).flatMap((m) => m.lessons || [])[0];
          if (firstLesson) setActiveLessonId(firstLesson.id);
          return firstCourse ? firstCourse.id : '';
        });
      } else {
        setCourses(DEFAULT_BUNDLE_MASTERCLASSES);
      }
    } catch (err) {
      console.error('Failed to sync masterclasses from MongoDB', err);
      setCourses(DEFAULT_BUNDLE_MASTERCLASSES);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  // Initial load and live synchronization listeners
  useEffect(() => {
    fetchMasterclasses();

    const handleSync = () => fetchMasterclasses();
    const handleStorage = (e) => {
      if (e.key === 'creatorskit_masterclasses_updated') {
        fetchMasterclasses();
      }
    };

    let bc = null;
    try {
      bc = new BroadcastChannel('creatorskit_masterclasses_channel');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'updated') {
          fetchMasterclasses();
        }
      };
    } catch (e) {}

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchMasterclasses();
      }
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('masterclasses-updated', handleSync);
    window.addEventListener('storage', handleStorage);

    // Background polling fallback for live admin reflection (active tab only, every 30s)
    const pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchMasterclasses();
      }
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('masterclasses-updated', handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchMasterclasses]);

  const activeCourse = useMemo(() => {
    return (
      courses.find((c) => c.id === activeCourseId || (c._id && c._id === activeCourseId)) ||
      courses[0] || { modules: [] }
    );
  }, [courses, activeCourseId]);

  // Keep activeLesson valid if modules or courses change
  useEffect(() => {
    if (activeCourse?.modules?.length > 0) {
      const flat = activeCourse.modules.flatMap((m) => m.lessons || []);
      if (!flat.some((l) => l.id === activeLessonId) && flat[0]) {
        setActiveLessonId(flat[0].id);
      }
    }
  }, [activeCourse, activeLessonId]);

  // Find active lesson object
  const activeLesson = useMemo(() => {
    if (!activeCourse?.modules) return null;
    for (const mod of activeCourse.modules) {
      const found = (mod.lessons || []).find((l) => l.id === activeLessonId);
      if (found) return found;
    }
    return activeCourse.modules[0]?.lessons?.[0] || null;
  }, [activeCourse, activeLessonId]);

  // Calculate course stats
  const activeCourseLessons = useMemo(() => {
    return (activeCourse?.modules || []).flatMap((m) => m.lessons || []);
  }, [activeCourse]);

  const activeCourseTotalLessons = activeCourseLessons.length;
  const activeCourseCompletedCount = activeCourseLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const activeCoursePct = activeCourseTotalLessons > 0 ? Math.round((activeCourseCompletedCount / activeCourseTotalLessons) * 100) : 0;

  // Display all courses synchronized directly from MongoDB
  const displayCourses = useMemo(() => {
    return courses || [];
  }, [courses]);

  // Guaranteed 3 enrolled masterclasses (Instagram Mastery, YouTube Mastery, Filmora Mastery)
  const coursesToDisplay = useMemo(() => {
    return displayCourses.slice(0, 3);
  }, [displayCourses]);

  // Mobile Carousel (Embla) State for 3 Enrolled Masterclasses
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const onSelectSlide = useCallback(() => {
    if (!mobileEmblaApi) return;
    setSelectedSlideIndex(mobileEmblaApi.selectedScrollSnap());
  }, [mobileEmblaApi]);

  useEffect(() => {
    if (!mobileEmblaApi) return;
    onSelectSlide();
    mobileEmblaApi.on('select', onSelectSlide);
    mobileEmblaApi.on('reInit', onSelectSlide);
    return () => {
      mobileEmblaApi.off('select', onSelectSlide);
      mobileEmblaApi.off('reInit', onSelectSlide);
    };
  }, [mobileEmblaApi, onSelectSlide]);

  const scrollToSlide = useCallback(
    (index) => {
      if (mobileEmblaApi) mobileEmblaApi.scrollTo(index);
    },
    [mobileEmblaApi]
  );

  const prevActiveCourseIdRef = useRef(activeCourseId);

  // Sync mobile slider position ONLY if activeCourseId actually changes
  useEffect(() => {
    if (!mobileEmblaApi || coursesToDisplay.length === 0) return;
    if (prevActiveCourseIdRef.current !== activeCourseId) {
      prevActiveCourseIdRef.current = activeCourseId;
      const activeIdx = coursesToDisplay.findIndex(
        (c) => (c._id ? c._id.toString() : c.id) === activeCourseId || c.id === activeCourseId
      );
      if (activeIdx >= 0) {
        mobileEmblaApi.scrollTo(activeIdx);
      }
    }
  }, [activeCourseId, coursesToDisplay, mobileEmblaApi]);

  // Direct Click-to-Play Course Action
  const handlePlayCourse = (course, e) => {
    if (e) e.stopPropagation();
    const courseId = course._id ? course._id.toString() : course.id;
    setActiveCourseId(courseId);
    prevActiveCourseIdRef.current = courseId;

    const flatLessons = (course.modules || []).flatMap((m) => m.lessons || []);
    const firstPlayable = flatLessons.find((l) => !l.locked) || flatLessons[0];
    if (firstPlayable) {
      setActiveLessonId(firstPlayable.id);
    }
    setIsPlaying(true);

    // If on mobile viewport (< 768px), switch to focused mobile video view
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (setIsMobileVideoFocused) {
        setIsMobileVideoFocused(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Smoothly scroll down to the video player workspace directly below on desktop
      setTimeout(() => {
        const el = document.getElementById('masterclass-player-workspace');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    }
  };

  const handleBackToCourses = () => {
    if (setIsMobileVideoFocused) {
      setIsMobileVideoFocused(false);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle lesson completed
  const toggleLessonCompleted = (lessonId) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('creatorskit_completed_lessons', JSON.stringify([...next]));
        } catch (e) {}
      }
      return next;
    });
  };

  // Find next lesson or next masterclass course
  const handleNextLesson = () => {
    const currentIndex = activeCourseLessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex >= 0 && currentIndex < activeCourseLessons.length - 1) {
      const next = activeCourseLessons[currentIndex + 1];
      if (!next.locked) {
        setActiveLessonId(next.id);
        setIsPlaying(true);
        return;
      }
    }

    // When at the end of current course lessons (or course has 1 masterclass lesson), switch to the next course in playlist!
    const currentCourseIdx = coursesToDisplay.findIndex(
      (c) => (c._id ? c._id.toString() : c.id) === activeCourseId || c.id === activeCourseId
    );
    if (currentCourseIdx >= 0 && coursesToDisplay.length > 1) {
      const nextCourseIdx = (currentCourseIdx + 1) % coursesToDisplay.length;
      handlePlayCourse(coursesToDisplay[nextCourseIdx]);
    }
  };

  // Find previous lesson or previous masterclass course
  const handlePrevLesson = () => {
    const currentIndex = activeCourseLessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex > 0) {
      const prev = activeCourseLessons[currentIndex - 1];
      setActiveLessonId(prev.id);
      setIsPlaying(true);
      return;
    }

    // When at the first lesson, switch to the previous course in playlist!
    const currentCourseIdx = coursesToDisplay.findIndex(
      (c) => (c._id ? c._id.toString() : c.id) === activeCourseId || c.id === activeCourseId
    );
    if (currentCourseIdx > 0 && coursesToDisplay.length > 1) {
      handlePlayCourse(coursesToDisplay[currentCourseIdx - 1]);
    } else if (currentCourseIdx === 0 && coursesToDisplay.length > 1) {
      handlePlayCourse(coursesToDisplay[coursesToDisplay.length - 1]);
    }
  };

  const playableVideoUrl = useMemo(() => {
    const candidates = [
      activeLesson?.videoLink,
      activeLesson?.videoUrl,
      activeCourse?.videoLink,
      activeCourse?.videoUrl,
    ];

    for (const raw of candidates) {
      if (
        raw &&
        typeof raw === 'string' &&
        raw.trim() !== '' &&
        !isImageUrl(raw) &&
        !raw.includes('w3schools.com') &&
        !raw.includes('mov_bbb')
      ) {
        return raw.trim();
      }
    }

    const titleLower = (activeCourse?.title || '').toLowerCase();
    const idLower = (activeCourse?.id || '').toLowerCase();
    if (titleLower.includes('instagram') || idLower.includes('instagram')) {
      return '/videos/instagram-masterclass.mp4';
    }
    if (titleLower.includes('youtube') || idLower.includes('youtube')) {
      return '/videos/youtube-masterclass.mp4';
    }
    if (titleLower.includes('filmora') || idLower.includes('filmora')) {
      return '/videos/filmora-masterclass.mp4';
    }
    return '/videos/masterclass-sample.mp4';
  }, [activeLesson, activeCourse]);

  if (hasAccess === false) {
    return <LockedCoursesView />;
  }

  return (
    <div className="w-full space-y-6">
      
      {/* =========================================================================
         MOBILE VIEW (block md:hidden): EITHER FOCUSED VIDEO VIEW OR 3-CARD SLIDER
         ========================================================================= */}
      <div className="block md:hidden w-full">
        {isMobileVideoFocused ? (
          /* 1. DEDICATED FOCUSED MOBILE VIDEO VIEW (AT TOP, NO SCROLLING NEEDED) */
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            {/* Top Bar with Back Button & Course Details */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleBackToCourses}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#900606]" />
                <span>Back to Courses</span>
              </button>
              <div className="text-right min-w-0">
                <span className="text-xs font-black text-[#900606] truncate block">
                  {activeCourse?.title || 'Masterclass'}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  {activeLesson?.duration || '10:00'} • HD 1080p
                </span>
              </div>
            </div>

            {/* Video Player */}
            <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-neutral-800 bg-black">
              <CustomVideoPlayer
                key={`mobile-focus-${activeCourseId}-${activeLesson?.id}`}
                videoUrl={playableVideoUrl}
                title={activeLesson?.title || activeCourse?.title || 'Lesson Video'}
                courseBadge={activeCourse?.badge || '100% Free Included'}
                onEnded={handleNextLesson}
                autoPlay={true}
              />
            </div>

            {/* Current Lesson Info & Controls */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#900606] block">
                  Current Lesson
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white mt-0.5">
                  {activeLesson?.title || 'Course Lesson'}
                </h3>
                {activeLesson?.overview && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {activeLesson.overview}
                  </p>
                )}
              </div>

              {/* Lesson Switcher Dropdown */}
              {activeCourseLessons.length > 1 && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <label className="text-[11px] font-bold text-neutral-500 mb-1.5 block">
                    Select Lesson:
                  </label>
                  <select
                    value={activeLessonId}
                    onChange={(e) => {
                      setActiveLessonId(e.target.value);
                      setIsPlaying(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606] cursor-pointer"
                  >
                    {(activeCourse?.modules || []).map((mod, mIdx) => (
                      <optgroup key={mIdx} label={mod.moduleTitle}>
                        {(mod.lessons || []).map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.title} ({lesson.duration})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              {/* Prev / Complete / Next Controls */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={handlePrevLesson}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  title="Previous Lesson"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => activeLesson && toggleLessonCompleted(activeLesson.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeLesson && completedLessonIds.has(activeLesson.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-[#900606] hover:text-white text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{activeLesson && completedLessonIds.has(activeLesson.id) ? 'Completed' : 'Mark Done'}</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#900606] hover:bg-[#7a0505] text-white shadow-md transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Masterclasses Playlist (Quick Switch) */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                  Masterclasses in Bundle ({coursesToDisplay.length})
                </span>
                <span className="text-[10px] font-bold text-neutral-400">
                  Tap to play
                </span>
              </div>

              <div className="space-y-2">
                {coursesToDisplay.map((course, cIdx) => {
                  const courseId = course._id ? course._id.toString() : course.id;
                  const isCurrent = courseId === activeCourseId || course.id === activeCourseId;

                  return (
                    <button
                      key={`focus-playlist-${courseId || cIdx}`}
                      type="button"
                      onClick={(e) => handlePlayCourse(course, e)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#900606] bg-red-50/60 dark:bg-[#900606]/15 ring-1 ring-[#900606]'
                          : 'border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-neutral-200/50 dark:border-neutral-700">
                        <Image
                          src={getImageUrl(course.image || '/banner 5.png')}
                          alt={course.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#900606]/50 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {course.title}
                          </span>
                          {isCurrent && (
                            <span className="shrink-0 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#900606] text-white">
                              Playing
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium block">
                          {course.duration || 'Full Masterclass'}
                        </span>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-[#900606]' : 'text-neutral-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* 2. COURSE SLIDER LIST VIEW WITH PAGINATION DOTS */
          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Enrolled Masterclasses
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Click on any course card below to instantly stream its lessons.
              </p>
            </div>

            {/* Embla 3-Card Slider */}
            <div className="overflow-hidden w-full" ref={mobileEmblaRef}>
              <div className="flex">
                {coursesToDisplay.map((course, idx) => {
                  const courseId = course._id ? course._id.toString() : course.id;
                  const isSelected = courseId === activeCourseId || course.id === activeCourseId;

                  return (
                    <div
                      key={`m-course-slide-${courseId || idx}`}
                      className="flex-[0_0_100%] min-w-0 px-1 shrink-0"
                    >
                      <div
                        onClick={(e) => handlePlayCourse(course, e)}
                        className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border flex flex-col justify-between h-full ${
                          isSelected 
                            ? 'border-[#900606] shadow-xl ring-2 ring-[#900606]/30 bg-rose-50/20 dark:bg-[#900606]/10' 
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
                            <Image
                              src={getImageUrl(course.image || '/banner 5.png')}
                              alt={course.title}
                              fill
                              sizes="95vw"
                              className="object-cover"
                            />
                            {course.badge && (
                              <span className="absolute top-2.5 left-2.5 bg-[#900606] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                                {course.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-4 sm:p-5 pb-3">
                            <h4 className="font-extrabold text-neutral-900 dark:text-white text-base group-hover:text-[#900606] transition-colors line-clamp-1 mb-1">
                              {course.title}
                            </h4>
                            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed line-clamp-2">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 pt-0">
                          <button
                            type="button"
                            onClick={(e) => handlePlayCourse(course, e)}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#900606] text-white shadow-md hover:bg-[#7a0505]'
                                : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-[#900606] hover:text-white hover:border-[#900606]'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isSelected && isPlaying ? 'Currently Playing • Watch Now' : 'Start Watching'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
              {coursesToDisplay.map((_, idx) => (
                <button
                  key={`course-dot-${idx}`}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  className="p-2 cursor-pointer focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all duration-300 ${
                      selectedSlideIndex === idx
                        ? 'w-7 bg-[#900606]'
                        : 'w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
         DESKTOP VIEW (hidden md:block): 3 COLUMNS GRID + INLINE VIDEO PLAYER
         ========================================================================= */}
      <div className="hidden md:block space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              Enrolled Masterclasses
            </h2>
            <p className="text-sm text-neutral-500 font-medium mt-1">
              Click on any course card below to instantly stream its lessons directly underneath.
            </p>
          </div>
        </div>

        {/* Desktop 3 Columns Grid */}
        <div className="grid grid-cols-3 gap-6">
          {coursesToDisplay.map((course) => {
            const courseId = course._id ? course._id.toString() : course.id;
            const isSelected = courseId === activeCourseId || course.id === activeCourseId;

            return (
              <div
                key={courseId}
                onClick={(e) => handlePlayCourse(course, e)}
                className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#900606] shadow-xl ring-2 ring-[#900606]/30 bg-rose-50/20 dark:bg-[#900606]/10 scale-[1.01]' 
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
                    <Image
                      src={getImageUrl(course.image || '/banner 5.png')}
                      alt={course.title}
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {course.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#900606] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                        {course.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 pb-4">
                    <h4 className="font-extrabold text-neutral-900 dark:text-white text-base sm:text-lg group-hover:text-[#900606] transition-colors line-clamp-1 mb-1">
                      {course.title}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={(e) => handlePlayCourse(course, e)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#900606] text-white shadow-md hover:bg-[#7a0505]'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-[#900606] hover:text-white hover:border-[#900606]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSelected && isPlaying ? 'Currently Playing • Watch Now' : 'Start Watching'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Player Workspace for Desktop */}
        <div
          id="masterclass-player-workspace"
          className="pt-2 select-none"
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="w-full space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {isPlaying ? (
                <CustomVideoPlayer
                  key={`desktop-${activeCourseId}-${activeLesson?.id}`}
                  videoUrl={playableVideoUrl}
                  title={activeLesson?.title || activeCourse?.title || 'Lesson Video'}
                  courseBadge={activeCourse?.badge || '100% Free Included'}
                  onEnded={handleNextLesson}
                  autoPlay={true}
                />
              ) : (
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800 flex items-center justify-center group select-none"
                >
                  <div className="absolute inset-0 z-0 select-none" onContextMenu={(e) => e.preventDefault()}>
                    <Image
                      src={getImageUrl(activeCourse.image || '/video 2.webp')}
                      alt={activeLesson?.title || 'Lesson Video'}
                      fill
                      sizes="1200px"
                      className="object-cover opacity-60 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75"></div>
                  </div>
                  <div className="relative z-10 text-center px-4 select-none">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-20 h-20 rounded-full bg-[#900606] hover:bg-[#a60808] text-white flex items-center justify-center shadow-[0_0_35px_rgba(144,6,6,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer mx-auto"
                    >
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#900606] mb-1 block">
                    {activeCourse?.title} • Current Lesson
                  </span>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white truncate">
                    {activeLesson?.title || 'Course Lesson'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: {activeLesson?.duration || '10:00'}</span>
                    <span>•</span>
                    <span>Full HD 1080p Stream</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {activeCourseLessons.length > 1 && (
                    <select
                      value={activeLessonId}
                      onChange={(e) => {
                        setActiveLessonId(e.target.value);
                        setIsPlaying(true);
                      }}
                      className="px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606] cursor-pointer"
                    >
                      {(activeCourse?.modules || []).map((mod, mIdx) => (
                        <optgroup key={mIdx} label={mod.moduleTitle}>
                          {(mod.lessons || []).map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.title} ({lesson.duration})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={handlePrevLesson}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                    title="Previous Lesson"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeLesson && toggleLessonCompleted(activeLesson.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                      activeLesson && completedLessonIds.has(activeLesson.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-[#900606] hover:text-white text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{activeLesson && completedLessonIds.has(activeLesson.id) ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#900606] hover:bg-[#7a0505] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

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
    <div className="bg-white dark:bg-[#131C2E] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
      
      {/* Profile Header section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={formData.profileImage ? getImageUrl(formData.profileImage) : "/profile.svg"} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Edit camera badge */}
          <label className="absolute bottom-1 right-1 bg-[#900606] text-white p-2.5 rounded-full shadow-md hover:bg-[#700505] transition-all hover:scale-105 border-2 border-white dark:border-neutral-800 cursor-pointer">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <h2 className="font-bold text-2xl sm:text-3xl text-[#111827] dark:text-white tracking-tight">
          {formData.name || 'Creator'}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 font-normal text-sm mt-1">
          {formData.email || ''}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 text-xs font-bold border border-red-200/60 dark:border-red-900/40">
          <Sparkles className="w-3.5 h-3.5 text-[#900606] dark:text-red-400" />
          <span>Verified Creator Member</span>
        </span>
      </div>

      <div className="border-t border-neutral-200/80 dark:border-neutral-800 mb-8"></div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Form Grid */}
      <form className="space-y-6 sm:space-y-8" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#111827] dark:text-neutral-200">
              Full Name
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/30 focus:border-[#900606] bg-neutral-50/60 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base shadow-2xs" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#111827] dark:text-neutral-200">
              Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/30 focus:border-[#900606] bg-neutral-50/60 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base shadow-2xs" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#111827] dark:text-neutral-200">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210" 
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/30 focus:border-[#900606] bg-neutral-50/60 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base shadow-2xs" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#111827] dark:text-neutral-200">
              Location / City
            </label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. New Delhi, India" 
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/30 focus:border-[#900606] bg-neutral-50/60 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base shadow-2xs" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#111827] dark:text-neutral-200">
              Postal Code
            </label>
            <input 
              type="text" 
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              placeholder="e.g. 110001" 
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#900606]/30 focus:border-[#900606] bg-neutral-50/60 hover:bg-neutral-50 dark:bg-neutral-800/50 transition-colors font-medium text-neutral-800 dark:text-white text-sm sm:text-base shadow-2xs" 
            />
          </div>
          
        </div>
        
        <div className="pt-4 flex justify-end md:justify-start">
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-[#900606] hover:bg-[#780505] text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
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
      <div className="bg-white dark:bg-[#131C2E] rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xs border border-neutral-200/90 dark:border-neutral-800 flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-[#131C2E] rounded-2xl md:rounded-3xl p-10 sm:p-14 text-center shadow-xs border border-neutral-200/90 dark:border-neutral-800 flex flex-col items-center">
        <span className="text-6xl mb-6">🛍️</span>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#111827] dark:text-white tracking-tight">
          No orders <span className="text-[#900606]">placed yet</span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Looks like you haven&apos;t bought anything from us yet. Explore our gear bundles and unlock the free masterclasses!
        </p>
        <Link 
          href="/product" 
          className="px-8 py-3 bg-[#900606] hover:bg-[#780505] text-white rounded-xl font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Explore Bundles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#131C2E] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-white tracking-tight flex items-center gap-2.5">
          <span className="w-2 h-6 rounded-full bg-[#900606]"></span>
          <span>My <span className="text-[#900606]">Orders</span></span>
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
        </span>
      </div>

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
            <div key={order._id} className="border border-neutral-200/90 dark:border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xs transition-shadow">
              <div className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200/80 dark:border-neutral-800 px-5 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-0.5">Order Placed</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-0.5">Total</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-0.5">Order #</p>
                    <p className="font-mono font-bold text-[#900606]">{order._id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusClass} flex-1 sm:flex-none text-center`}>
                    {order.status}
                  </span>
                  <Link 
                    href={`/order-success?orderId=${order._id}`}
                    className="px-4 py-2 bg-[#900606] hover:bg-[#780505] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center flex-1 sm:flex-none text-center cursor-pointer active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200/60 dark:border-neutral-700/60">
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
    <div className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-sm border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-0 sm:min-h-[500px] flex flex-col justify-center">
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
                <button 
                  type="submit" 
                  className="relative flex-1 py-2.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    Update
                  </span>
                </button>
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
          <button 
            onClick={() => setShowPasswordModal(true)} 
            className="relative px-6 py-3 bg-white text-[#111827] border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm inline-flex items-center justify-center cursor-pointer"
          >
            <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
              Change Password
            </span>
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
      desc: 'Check your profile and start learning your first video lesson in the Courses tab.',
      unread: false,
      createdAt: '2026-10-21T10:00:00.000Z'
    }
  ];

  const displayNotifs = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-sm border border-neutral-200/90 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden min-h-0 sm:min-h-[500px] flex flex-col justify-center">
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
    'user': 'user',
    'my-orders': 'orders',
    'orders': 'orders',
    'masterclass': 'courses',
    'course': 'courses',
    'courses': 'courses',
  };
  const activeTab = tabAliases[rawTab] || (rawTab === 'orders' || rawTab === 'courses' ? rawTab : 'user');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    postalCode: '',
    profileImage: ''
  });

  // Redirect unauthenticated visitors to login
  useEffect(() => {
    const rawUser = localStorage.getItem('creatorsKitUserInfo');
    const sessionEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');

    if (!rawUser && !sessionEmail) {
      router.replace('/login?redirect=/account');
      return;
    }
  }, [router]);

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

  const [hasBundleAccess, setHasBundleAccess] = useState(null);
  const [isMobileVideoFocused, setIsMobileVideoFocused] = useState(false);

  // Verify user's bundle purchase access from database
  useEffect(() => {
    const userEmail = formData.email || sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    if (!userEmail) return;

    let isMounted = true;
    async function verifyCourseAccess() {
      try {
        const res = await fetch(`/api/user/access?email=${encodeURIComponent(userEmail)}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.hasBundleAccess) {
            setHasBundleAccess(true);
          } else {
            setHasBundleAccess(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setHasBundleAccess(false);
        }
      }
    }

    verifyCourseAccess();
    return () => { isMounted = false; };
  }, [formData.email]);

  // Update tab in URL without page reload
  const handleTabChange = (tabId) => {
    setIsMobileVideoFocused(false);
    router.replace(`${pathname}?tab=${tabId}`, { scroll: false });
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('account-tab-content');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
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

  const handleLogout = async () => {
    let activeEmail =
      sessionStorage.getItem('userEmail') ||
      localStorage.getItem('userEmail') ||
      '';

    if (!activeEmail) {
      try {
        const u = JSON.parse(sessionStorage.getItem('creatorsKitUserInfo') || localStorage.getItem('creatorsKitUserInfo') || '{}');
        if (u.email) activeEmail = u.email;
      } catch (e) {}
    }

    try {
      sessionStorage.setItem('creatorskit_logged_out', '1');
      localStorage.setItem('creatorskit_logged_out', '1');
    } catch (e) {}

    ['creatorsKitUserInfo', 'userName', 'userEmail', 'userRole', 'token', 'adminToken', 'admin_role'].forEach((k) => {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });

    if (activeEmail) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: activeEmail }),
        });
      } catch (e) {}
    }

    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
    } catch (e) {}

    window.location.href = '/';
  };

  // Exact 3 tabs as specified: User, My Orders, Courses
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
      id: 'courses',
      label: 'Courses',
      icon: <GraduationCap className="w-5 h-5" />,
      isLocked: hasBundleAccess === false,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <AccountOrdersTab email={formData.email} />;
      case 'courses':
      case 'masterclass':
      case 'course':
        if (hasBundleAccess === false) {
          return <LockedCoursesView />;
        }
        if (hasBundleAccess === null) {
          return (
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl md:rounded-3xl p-12 flex justify-center items-center min-h-[400px] border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
              <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
            </div>
          );
        }
        return (
          <AccountMasterclassTab
            hasAccess={hasBundleAccess}
            isMobileVideoFocused={isMobileVideoFocused}
            setIsMobileVideoFocused={setIsMobileVideoFocused}
          />
        );
      case 'user':
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
    <div className={`min-h-[100svh] bg-[#FBFBF7] dark:bg-[#0B0F19] text-[#111827] dark:text-neutral-100 font-sans transition-colors duration-300 w-full overflow-hidden ${isMobileVideoFocused ? 'pt-20 sm:pt-24 pb-8 sm:pb-12' : 'pt-28 sm:pt-32 md:pt-36 pb-12 md:pb-20'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
          
          <div className={`w-full lg:w-72 xl:w-80 shrink-0 ${isMobileVideoFocused ? 'hidden lg:block' : 'block'}`}>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200/60 dark:border-red-900/40 mb-3 shadow-2xs">
                <User className="w-3 h-3 text-[#900606] dark:text-red-400" />
                <span>Creator Dashboard</span>
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
                Account <span className="text-[#900606] whitespace-nowrap">Details</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal mt-1 leading-relaxed">
                Manage profile, track orders & view masterclasses
              </p>
            </div>

            <div className="flex flex-col gap-1.5 bg-white dark:bg-[#131C2E] p-2.5 sm:p-3 rounded-2xl md:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`relative flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm transition-all text-left duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-[#900606] text-white shadow-xs' 
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.isLocked ? (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 border border-red-200 dark:border-red-900/60'
                      }`}>
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </button>
                );
              })}
              
              <div className="my-2 border-t border-neutral-200/80 dark:border-neutral-800 mx-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 sm:px-5 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm transition-all text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer group"
              >
                <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div id="account-tab-content" className="w-full lg:flex-1 min-w-0">
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
