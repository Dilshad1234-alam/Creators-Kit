'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Gauge,
  Sparkles,
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds < 0 || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs > 0) {
    return `${hrs}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function parseYouTubeId(url) {
  if (!url) return null;
  const str = String(url).trim();
  if (str.includes('youtube.com/watch')) {
    try {
      const u = new URL(str);
      return u.searchParams.get('v');
    } catch (e) {
      const match = str.match(/[?&]v=([^&]+)/);
      return match ? match[1] : null;
    }
  }
  if (str.includes('youtu.be/')) {
    const parts = str.split('youtu.be/');
    return parts[1]?.split('?')[0]?.split('&')[0] || null;
  }
  if (str.includes('youtube.com/embed/') || str.includes('youtube-nocookie.com/embed/')) {
    const parts = str.split('/embed/');
    return parts[1]?.split('?')[0]?.split('&')[0] || null;
  }
  return null;
}

export default function CustomVideoPlayer({
  videoUrl,
  title = 'Course Lesson',
  courseBadge = 'CreatorsKit Masterclass',
  onEnded,
  autoPlay = false,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const progressRailRef = useRef(null);
  const hideControlsTimerRef = useRef(null);
  const centerAnimTimerRef = useRef(null);
  const pauseEnforcerRef = useRef(null);

  const isScrubbingRef = useRef(false);
  const durationRef = useRef(0);
  const currentTimeRef = useRef(0);
  const onEndedRef = useRef(onEnded);
  const isPlayingRef = useRef(false);
  const pausedByUserRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [centerAnimation, setCenterAnimation] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null);

  const resolvedVideoUrl = useMemo(() => {
    const isImage = (u) => {
      if (!u || typeof u !== 'string') return true;
      const clean = u.trim().toLowerCase().split('?')[0];
      return (
        clean.endsWith('.webp') ||
        clean.endsWith('.jpg') ||
        clean.endsWith('.jpeg') ||
        clean.endsWith('.png') ||
        clean.endsWith('.gif') ||
        clean.endsWith('.svg') ||
        clean.endsWith('.avif')
      );
    };

    if (
      !videoUrl ||
      typeof videoUrl !== 'string' ||
      videoUrl.trim() === '' ||
      isImage(videoUrl) ||
      videoUrl.includes('w3schools.com') ||
      videoUrl.includes('mov_bbb')
    ) {
      const lowerTitle = (title || '').toLowerCase();
      if (lowerTitle.includes('instagram')) return '/videos/instagram-masterclass.mp4';
      if (lowerTitle.includes('youtube')) return '/videos/youtube-masterclass.mp4';
      if (lowerTitle.includes('filmora')) return '/videos/filmora-masterclass.mp4';
      return '/videos/masterclass-sample.mp4';
    }
    return videoUrl.trim();
  }, [videoUrl, title]);

  const youtubeId = parseYouTubeId(resolvedVideoUrl);
  const isYouTube = Boolean(youtubeId);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    pausedByUserRef.current = false;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentTime(0);
    currentTimeRef.current = 0;
  }, [resolvedVideoUrl]);

  const clearPauseEnforcer = useCallback(() => {
    if (pauseEnforcerRef.current) {
      clearInterval(pauseEnforcerRef.current);
      pauseEnforcerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearPauseEnforcer();
  }, [clearPauseEnforcer]);

  const triggerCenterIndicator = useCallback((type) => {
    if (centerAnimTimerRef.current) clearTimeout(centerAnimTimerRef.current);
    setCenterAnimation(type);
    centerAnimTimerRef.current = setTimeout(() => {
      setCenterAnimation(null);
    }, 450);
  }, []);

  const sendYouTubeCommand = useCallback((func, args) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args: args !== undefined ? args : [],
          }),
          '*'
        );
      } catch (e) {}
    }
  }, []);

  const forcePauseUnderlyingPlayer = useCallback(() => {
    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (e) {}
      }
      sendYouTubeCommand('pauseVideo');
    } else if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}
    }
  }, [isYouTube, sendYouTubeCommand]);

  const executePause = useCallback(() => {
    pausedByUserRef.current = true;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setShowControls(true);
    triggerCenterIndicator('pause');
    forcePauseUnderlyingPlayer();

    clearPauseEnforcer();
    let checks = 0;
    pauseEnforcerRef.current = setInterval(() => {
      checks += 1;
      if (!pausedByUserRef.current || checks > 12) {
        clearPauseEnforcer();
        return;
      }
      forcePauseUnderlyingPlayer();
    }, 200);
  }, [forcePauseUnderlyingPlayer, triggerCenterIndicator, clearPauseEnforcer]);

  const executePlay = useCallback(() => {
    pausedByUserRef.current = false;
    clearPauseEnforcer();

    if (isYouTube) {
      setIsPlaying(true);
      isPlayingRef.current = true;
      triggerCenterIndicator('play');
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.playVideo();
        } catch (e) {}
      }
      sendYouTubeCommand('playVideo');
    } else if (videoRef.current) {
      const v = videoRef.current;
      if (v.ended || (v.duration > 0 && v.currentTime >= v.duration)) {
        v.currentTime = 0;
        setCurrentTime(0);
        currentTimeRef.current = 0;
      }
      const promise = v.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            if (!pausedByUserRef.current) {
              setIsPlaying(true);
              isPlayingRef.current = true;
              triggerCenterIndicator('play');
            }
          })
          .catch(() => {
            if (pausedByUserRef.current) return;
            v.muted = true;
            setIsMuted(true);
            v.play().catch(() => {});
          });
      }
    }
  }, [isYouTube, sendYouTubeCommand, triggerCenterIndicator, clearPauseEnforcer]);

  const togglePlay = useCallback(() => {
    if (pausedByUserRef.current || !isPlayingRef.current) {
      executePlay();
    } else {
      executePause();
    }
  }, [executePlay, executePause]);

  useEffect(() => {
    if (isYouTube) return;
    const video = videoRef.current;
    if (!video) return;

    const syncDuration = () => {
      if (!isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        durationRef.current = video.duration;
      }
    };

    const handleTimeUpdate = () => {
      if (pausedByUserRef.current && !video.paused) {
        try {
          video.pause();
        } catch (e) {}
        return;
      }
      if (!isScrubbingRef.current) {
        setCurrentTime(video.currentTime);
        currentTimeRef.current = video.currentTime;
      }
    };

    const handlePlay = () => {
      if (pausedByUserRef.current) {
        try {
          video.pause();
        } catch (e) {}
        return;
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
    };

    const handlePause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    const handleEnded = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (onEndedRef.current) onEndedRef.current();
    };

    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('canplay', syncDuration);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    syncDuration();

    if (autoPlay && !pausedByUserRef.current) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!pausedByUserRef.current) {
              setIsPlaying(true);
              isPlayingRef.current = true;
            }
          })
          .catch(() => {
            if (pausedByUserRef.current) return;
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('canplay', syncDuration);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [resolvedVideoUrl, isYouTube, autoPlay]);

  const commitSeek = useCallback(
    (targetTime) => {
      const effectiveDur =
        durationRef.current > 0
          ? durationRef.current
          : currentTimeRef.current > 0
          ? currentTimeRef.current + 60
          : 0;
      const clampedTime = Math.max(
        0,
        effectiveDur > 0 ? Math.min(effectiveDur, targetTime) : targetTime
      );

      setCurrentTime(clampedTime);
      currentTimeRef.current = clampedTime;

      if (isYouTube) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
          try {
            ytPlayerRef.current.seekTo(clampedTime, true);
          } catch (err) {}
        }
        sendYouTubeCommand('seekTo', [clampedTime, true]);
        if (!pausedByUserRef.current) {
          executePlay();
        }
      } else if (videoRef.current) {
        try {
          videoRef.current.currentTime = clampedTime;
          if (!pausedByUserRef.current && isPlayingRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } catch (err) {}
      }
    },
    [isYouTube, sendYouTubeCommand, executePlay]
  );

  const calculateSeekTime = useCallback((clientX) => {
    if (!progressRailRef.current) return { pos: 0, time: 0 };
    const rect = progressRailRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const effectiveDuration =
      durationRef.current > 0
        ? durationRef.current
        : currentTimeRef.current > 0
        ? currentTimeRef.current + 60
        : 100;
    return { pos, time: pos * effectiveDuration };
  }, []);

  useEffect(() => {
    if (!isYouTube || !youtubeId) return;

    let isSubscribed = true;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript);
      } else {
        document.head.appendChild(tag);
      }
    }

    const bindYTPlayer = () => {
      if (!isSubscribed) return;
      if (!window.YT || !window.YT.Player || !iframeRef.current) {
        setTimeout(bindYTPlayer, 200);
        return;
      }

      try {
        ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event) => {
              if (!isSubscribed) return;
              try {
                const dur = event.target.getDuration();
                if (dur && dur > 0) {
                  setDuration(dur);
                  durationRef.current = dur;
                }
                if (autoPlay && !pausedByUserRef.current) {
                  event.target.playVideo();
                  setIsPlaying(true);
                  isPlayingRef.current = true;
                } else {
                  event.target.pauseVideo();
                  setIsPlaying(false);
                  isPlayingRef.current = false;
                }
              } catch (e) {}
            },
            onStateChange: (event) => {
              if (!isSubscribed) return;
              if (event.data === 1) {
                if (pausedByUserRef.current) {
                  try {
                    event.target.pauseVideo();
                  } catch (e) {}
                  setIsPlaying(false);
                  isPlayingRef.current = false;
                  return;
                }
                setIsPlaying(true);
                isPlayingRef.current = true;
                try {
                  const dur = event.target.getDuration();
                  if (dur && dur > 0) {
                    setDuration(dur);
                    durationRef.current = dur;
                  }
                } catch (e) {}
              } else if (event.data === 2) {
                setIsPlaying(false);
                isPlayingRef.current = false;
              } else if (event.data === 0) {
                setIsPlaying(false);
                isPlayingRef.current = false;
                if (onEndedRef.current) onEndedRef.current();
              }
            },
          },
        });
      } catch (err) {}
    };

    if (window.YT && window.YT.Player) {
      bindYTPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        bindYTPlayer();
      };
      const checkTimer = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkTimer);
          bindYTPlayer();
        }
      }, 250);
    }

    const syncTicker = setInterval(() => {
      if (!isSubscribed) return;
      if (pausedByUserRef.current) {
        forcePauseUnderlyingPlayer();
        return;
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const cur = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (typeof cur === 'number' && !isScrubbingRef.current) {
            setCurrentTime(cur);
            currentTimeRef.current = cur;
          }
          if (typeof dur === 'number' && dur > 0) {
            setDuration(dur);
            durationRef.current = dur;
          }
          if (typeof ytPlayerRef.current.getPlayerState === 'function') {
            const pState = ytPlayerRef.current.getPlayerState();
            if (pState === 1) {
              setIsPlaying(true);
              isPlayingRef.current = true;
            } else if (pState === 2 || pState === 0) {
              setIsPlaying(false);
              isPlayingRef.current = false;
            }
          }
        } catch (e) {}
      }
    }, 350);

    return () => {
      isSubscribed = false;
      clearInterval(syncTicker);
      ytPlayerRef.current = null;
    };
  }, [isYouTube, youtubeId, autoPlay, forcePauseUnderlyingPlayer]);

  useEffect(() => {
    if (!isYouTube) return;

    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'infoDelivery' && data?.info) {
          if (typeof data.info.currentTime === 'number' && !isScrubbingRef.current) {
            setCurrentTime(data.info.currentTime);
            currentTimeRef.current = data.info.currentTime;
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
            durationRef.current = data.info.duration;
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 1) {
              if (pausedByUserRef.current) {
                forcePauseUnderlyingPlayer();
                setIsPlaying(false);
                isPlayingRef.current = false;
                return;
              }
              setIsPlaying(true);
              isPlayingRef.current = true;
            } else if (data.info.playerState === 2) {
              setIsPlaying(false);
              isPlayingRef.current = false;
            } else if (data.info.playerState === 0) {
              setIsPlaying(false);
              isPlayingRef.current = false;
              if (onEndedRef.current) onEndedRef.current();
            }
          }
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isYouTube, forcePauseUnderlyingPlayer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        if (!isScrubbingRef.current) {
          setShowControls(false);
          setShowSpeedMenu(false);
        }
      }, 3500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isScrubbingRef.current) {
      setShowControls(false);
      setShowSpeedMenu(false);
    }
  };

  const skipBackward = (e) => {
    e?.stopPropagation();
    commitSeek(Math.max(0, currentTimeRef.current - 10));
  };

  const skipForward = (e) => {
    e?.stopPropagation();
    const effectiveDur =
      durationRef.current > 0 ? durationRef.current : currentTimeRef.current + 60;
    commitSeek(Math.min(effectiveDur, currentTimeRef.current + 10));
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isScrubbingRef.current = true;
    setIsScrubbing(true);

    const initial = calculateSeekTime(e.clientX);
    setCurrentTime(initial.time);
    currentTimeRef.current = initial.time;
    setHoverPosition({ percent: initial.pos * 100, time: initial.time });

    const handleWindowMouseMove = (moveEvent) => {
      const moved = calculateSeekTime(moveEvent.clientX);
      setCurrentTime(moved.time);
      currentTimeRef.current = moved.time;
      setHoverPosition({ percent: moved.pos * 100, time: moved.time });
    };

    const handleWindowMouseUp = (upEvent) => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      isScrubbingRef.current = false;
      setIsScrubbing(false);
      const finalSeek = calculateSeekTime(upEvent.clientX);
      commitSeek(finalSeek.time);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
  };

  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    e.stopPropagation();
    isScrubbingRef.current = true;
    setIsScrubbing(true);

    const clientX = e.touches[0].clientX;
    const initial = calculateSeekTime(clientX);
    setCurrentTime(initial.time);
    currentTimeRef.current = initial.time;
    setHoverPosition({ percent: initial.pos * 100, time: initial.time });

    const handleWindowTouchMove = (moveEvent) => {
      if (!moveEvent.touches || !moveEvent.touches[0]) return;
      const moved = calculateSeekTime(moveEvent.touches[0].clientX);
      setCurrentTime(moved.time);
      currentTimeRef.current = moved.time;
      setHoverPosition({ percent: moved.pos * 100, time: moved.time });
    };

    const handleWindowTouchEnd = (endEvent) => {
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      isScrubbingRef.current = false;
      setIsScrubbing(false);
      const touch = endEvent.changedTouches?.[0];
      const finalClientX = touch ? touch.clientX : clientX;
      const finalSeek = calculateSeekTime(finalClientX);
      commitSeek(finalSeek.time);
    };

    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('touchend', handleWindowTouchEnd);
  };

  const handleDirectClick = (e) => {
    e.stopPropagation();
    const clicked = calculateSeekTime(e.clientX);
    commitSeek(clicked.time);
  };

  const handleTimelineHover = (e) => {
    if (!progressRailRef.current) return;
    const rect = progressRailRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const effectiveDur = durationRef.current > 0 ? durationRef.current : currentTime;
    setHoverPosition({
      percent: pos * 100,
      time: pos * effectiveDur,
    });
  };

  const handleTimelineLeave = () => {
    if (!isScrubbingRef.current) {
      setHoverPosition(null);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    const muted = val === 0;
    setIsMuted(muted);

    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
        try {
          ytPlayerRef.current.setVolume(val * 100);
          if (muted) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        } catch (err) {}
      }
      sendYouTubeCommand('setVolume', [val * 100]);
      if (muted) sendYouTubeCommand('mute');
      else sendYouTubeCommand('unMute');
    } else if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = muted;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === 'function') {
        try {
          if (nextMuted) ytPlayerRef.current.mute();
          else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume((volume || 0.5) * 100);
          }
        } catch (err) {}
      }
      if (nextMuted) sendYouTubeCommand('mute');
      else {
        sendYouTubeCommand('unMute');
        sendYouTubeCommand('setVolume', [(volume || 0.5) * 100]);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSpeedSelect = (speed, e) => {
    e?.stopPropagation();
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);

    if (isYouTube) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.setPlaybackRate === 'function') {
        try {
          ytPlayerRef.current.setPlaybackRate(speed);
        } catch (err) {}
      }
      sendYouTubeCommand('setPlaybackRate', [speed]);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const effectiveDuration = duration > 0 ? duration : currentTime > 0 ? currentTime : 0;
  const progressPercent =
    effectiveDuration > 0 ? Math.min(100, (currentTime / effectiveDuration) * 100) : 0;
  const originParam =
    typeof window !== 'undefined' && window.location?.origin
      ? `&origin=${window.location.origin}`
      : '';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full min-h-[240px] aspect-video rounded-none md:rounded-2xl overflow-hidden bg-black shadow-2xl border-y md:border border-neutral-800 select-none group"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* 1. VIDEO ENGINE */}
      {isYouTube ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black">
          <iframe
            id={`yt-iframe-${youtubeId}`}
            ref={iframeRef}
            key={youtubeId}
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${
              autoPlay && !pausedByUserRef.current ? 1 : 0
            }&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1${originParam}`}
            title={title}
            className="absolute -top-[14%] -left-[2%] w-[104%] h-[128%] border-0 pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={resolvedVideoUrl}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-contain bg-black pointer-events-none select-none"
        />
      )}

      {/* 2. CLICK AREA FOR PLAY / PAUSE */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          toggleFullscreen(e);
        }}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Toggle Play/Pause"
      />

      {/* CENTER PLAY BUTTON WHEN PAUSED */}
      {!isPlaying && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            executePlay();
          }}
          className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer bg-black/35 transition-colors"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#900606] hover:bg-[#a50808] text-white flex items-center justify-center shadow-[0_0_30px_rgba(144,6,6,0.75)] transition-transform duration-200 active:scale-95">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* 3. CENTER PLAY / PAUSE BRIEF INDICATOR */}
      {centerAnimation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white shadow-2xl transition-opacity duration-200">
            {centerAnimation === 'play' ? (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
            ) : (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* 4. TOP BAR OVERLAY */}
      <div
        className={`absolute top-0 inset-x-0 z-20 p-3 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-md truncate">
            {title}
          </h3>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-white/70 uppercase bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
          HD 1080p
        </span>
      </div>

      {/* 5. BOTTOM CONTROL BAR */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 p-2 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying || isScrubbing
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-full bg-black/85 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/15 p-2 sm:p-3 shadow-2xl flex flex-col gap-1.5 sm:gap-2">
          {/* Progress Scrubber */}
          <div
            ref={progressRailRef}
            onClick={handleDirectClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleTimelineHover}
            onMouseLeave={handleTimelineLeave}
            className="group/seek relative w-full h-4 flex items-center cursor-pointer select-none py-1 touch-none"
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/seek:h-2.5 transition-all">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#900606] rounded-full relative transition-[width] duration-75"
              />
            </div>

            {hoverPosition && (
              <div
                style={{ left: `${hoverPosition.percent}%` }}
                className="absolute -top-7 -translate-x-1/2 bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-lg pointer-events-none z-30"
              >
                {formatTime(hoverPosition.time)}
              </div>
            )}

            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-[#900606] opacity-0 group-hover/seek:opacity-100 group-hover/seek:scale-125 transition-all pointer-events-none"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 text-white">
            <div className="flex items-center gap-1 sm:gap-2.5 shrink min-w-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={skipBackward}
                className="p-1 sm:p-2 shrink-0 rounded-lg hover:bg-white/10 active:scale-90 text-neutral-300 hover:text-white transition-all cursor-pointer"
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={skipForward}
                className="p-1 sm:p-2 shrink-0 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all cursor-pointer"
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-1 pl-0.5 shrink-0">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden md:block w-14 sm:w-20 h-1.5 accent-[#900606] bg-white/20 rounded-lg cursor-pointer"
                  aria-label="Volume Slider"
                />
              </div>

              <div className="text-[10px] sm:text-xs font-mono font-medium text-neutral-300 pl-0.5 select-none whitespace-nowrap shrink-0">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-0.5 sm:mx-1">/</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 relative shrink-0">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedMenu(!showSpeedMenu);
                  }}
                  className="px-2 py-1 sm:px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
                  aria-label="Playback Speed"
                >
                  <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-300" />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 mb-2 py-1 bg-neutral-900 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl z-30 min-w-[90px] flex flex-col"
                  >
                    {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={(e) => handleSpeedSelect(spd, e)}
                        className={`px-3 py-1.5 text-xs font-semibold text-left flex items-center justify-between hover:bg-white/15 cursor-pointer ${
                          playbackSpeed === spd ? 'text-red-400 bg-white/10 font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <span>{spd}x</span>
                        {playbackSpeed === spd && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}