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
  autoPlay = true,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const progressRailRef = useRef(null);
  const hideControlsTimerRef = useRef(null);

  const isScrubbingRef = useRef(false);
  const durationRef = useRef(0);
  const currentTimeRef = useRef(0);
  const onEndedRef = useRef(onEnded);
  const isPlayingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [centerAnimation, setCenterAnimation] = useState(null); // 'play' | 'pause'
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null); // { percent, time }

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

  // Synchronize dynamic refs
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

  // HTML5 Video DOM Event Listeners & State Synchronization
  useEffect(() => {
    if (isYouTube) return;
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (!isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        durationRef.current = video.duration;
      }
    };

    const handleDurationChange = () => {
      if (!isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        durationRef.current = video.duration;
      }
    };

    const handleTimeUpdate = () => {
      if (!isScrubbingRef.current) {
        setCurrentTime(video.currentTime);
        currentTimeRef.current = video.currentTime;
      }
    };

    const handlePlay = () => {
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

    const handleCanPlay = () => {
      if (!isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        durationRef.current = video.duration;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    // Initial sync if video is already ready
    if (video.readyState >= 1 && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
      durationRef.current = video.duration;
    }

    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch(() => {
            // If browser blocks unmuted autoplay, mute and play
            video.muted = true;
            setIsMuted(true);
            video.play()
              .then(() => {
                setIsPlaying(true);
                isPlayingRef.current = true;
              })
              .catch(() => {
                setIsPlaying(false);
                isPlayingRef.current = false;
              });
          });
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [resolvedVideoUrl, isYouTube, autoPlay]);

  // Send raw API commands to YouTube iframe as fallback
  const sendYouTubeCommand = useCallback((func, args) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args: args !== undefined ? args : '',
          }),
          '*'
        );
        if (args === undefined) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func,
              args: [],
            }),
            '*'
          );
        }
      } catch (e) {}
    }
  }, []);

  // Universal Play Function
  const executePlay = useCallback(() => {
    if (isYouTube) {
      setIsPlaying(true);
      isPlayingRef.current = true;
      setCenterAnimation('play');
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.playVideo();
        } catch (e) {}
      }
      sendYouTubeCommand('playVideo');
      setTimeout(() => setCenterAnimation(null), 600);
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
            setIsPlaying(true);
            isPlayingRef.current = true;
            setCenterAnimation('play');
            setTimeout(() => setCenterAnimation(null), 600);
          })
          .catch((err) => {
            console.warn('Playback blocked by browser policy, trying muted:', err);
            v.muted = true;
            setIsMuted(true);
            v.play()
              .then(() => {
                setIsPlaying(true);
                isPlayingRef.current = true;
                setCenterAnimation('play');
                setTimeout(() => setCenterAnimation(null), 600);
              })
              .catch((err2) => {
                console.error('Play failed completely:', err2);
                setIsPlaying(false);
                isPlayingRef.current = false;
              });
          });
      }
    }
  }, [isYouTube, sendYouTubeCommand]);

  // Universal Pause Function
  const executePause = useCallback(() => {
    if (isYouTube) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCenterAnimation('pause');
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (e) {}
      }
      sendYouTubeCommand('pauseVideo');
      setTimeout(() => setCenterAnimation(null), 600);
    } else if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCenterAnimation('pause');
      setTimeout(() => setCenterAnimation(null), 600);
    }
  }, [isYouTube, sendYouTubeCommand]);

  // Universal Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (isYouTube) {
      let currentlyPlaying = isPlayingRef.current;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
        try {
          const state = ytPlayerRef.current.getPlayerState();
          if (state === 1) currentlyPlaying = true;
          else if (state === 2 || state === 0 || state === -1) currentlyPlaying = false;
        } catch (e) {}
      }
      if (currentlyPlaying) {
        executePause();
      } else {
        executePlay();
      }
    } else if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        executePlay();
      } else {
        executePause();
      }
    }
  }, [isYouTube, executePlay, executePause]);

  // Universal Commit Seek Handler (Seeks accurately and continues active playback)
  const commitSeek = useCallback(
    (targetTime) => {
      const effectiveDur = durationRef.current > 0 ? durationRef.current : (currentTimeRef.current > 0 ? currentTimeRef.current + 60 : 0);
      const clampedTime = Math.max(0, effectiveDur > 0 ? Math.min(effectiveDur, targetTime) : targetTime);
      
      setCurrentTime(clampedTime);
      currentTimeRef.current = clampedTime;

      if (isYouTube) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
          try {
            ytPlayerRef.current.seekTo(clampedTime, true);
          } catch (err) {}
        }
        sendYouTubeCommand('seekTo', [clampedTime, true]);
        executePlay();
      } else if (videoRef.current) {
        try {
          videoRef.current.currentTime = clampedTime;
          if (isPlayingRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } catch (err) {}
      }
    },
    [isYouTube, sendYouTubeCommand, executePlay]
  );

  // Calculate seek time from clientX coordinate
  const calculateSeekTime = useCallback(
    (clientX) => {
      if (!progressRailRef.current) return { pos: 0, time: 0 };
      const rect = progressRailRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const effectiveDuration = durationRef.current > 0 ? durationRef.current : (currentTimeRef.current > 0 ? currentTimeRef.current + 60 : 100);
      return { pos, time: pos * effectiveDuration };
    },
    []
  );

  // 1. YouTube IFrame API initialization & persistent synchronization
  useEffect(() => {
    if (!isYouTube || !youtubeId) return;

    let isSubscribed = true;

    // Inject YouTube IFrame API script tag once
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

    // Bind YouTube Player to iframe element
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
                if (autoPlay) {
                  event.target.playVideo();
                  setIsPlaying(true);
                  isPlayingRef.current = true;
                }
              } catch (e) {}
            },
            onStateChange: (event) => {
              if (!isSubscribed) return;
              if (event.data === 1) {
                // PLAYING
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
                // PAUSED
                setIsPlaying(false);
                isPlayingRef.current = false;
              } else if (event.data === 0) {
                // ENDED
                setIsPlaying(false);
                isPlayingRef.current = false;
                if (onEndedRef.current) onEndedRef.current();
              }
            },
          },
        });
      } catch (err) {
        console.warn('YT Player binding attempt:', err);
      }
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

    // Active polling interval to query duration, currentTime & playback state
    const syncTicker = setInterval(() => {
      if (!isSubscribed) return;
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
      } else {
        sendYouTubeCommand('getDuration');
      }
    }, 250);

    return () => {
      isSubscribed = false;
      clearInterval(syncTicker);
      ytPlayerRef.current = null;
    };
  }, [isYouTube, youtubeId, autoPlay, sendYouTubeCommand]);

  // 2. PostMessage Fallback Listener for YouTube
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

    const handshake = setInterval(() => {
      sendYouTubeCommand('listening');
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(handshake);
    };
  }, [isYouTube, sendYouTubeCommand]);

  // Fullscreen change listener
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

  // Controls auto-hide timer on mouse inactivity
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

  // Skip Rewind (-10s)
  const skipBackward = (e) => {
    e?.stopPropagation();
    const newTime = Math.max(0, currentTimeRef.current - 10);
    commitSeek(newTime);
  };

  // Skip Forward (+10s)
  const skipForward = (e) => {
    e?.stopPropagation();
    const effectiveDur = durationRef.current > 0 ? durationRef.current : currentTimeRef.current + 60;
    const newTime = Math.min(effectiveDur, currentTimeRef.current + 10);
    commitSeek(newTime);
  };

  // Synchronous Direct Progress Scrubber Handler (Click & Drag for Mouse)
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

  // Synchronous Direct Progress Scrubber Handler (Touch Drag for Mobile)
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

  // Direct Click Safeguard for Progress Bar
  const handleDirectClick = (e) => {
    e.stopPropagation();
    const clicked = calculateSeekTime(e.clientX);
    commitSeek(clicked.time);
  };

  // Timeline Hover Tooltip
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

  // Volume Change
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

  // Toggle Mute
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

  // Speed Select
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

  // Fullscreen Toggle
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

  const effectiveDuration = duration > 0 ? duration : (currentTime > 0 ? currentTime : 0);
  const progressPercent = effectiveDuration > 0 ? Math.min(100, (currentTime / effectiveDuration) * 100) : 0;
  const originParam = typeof window !== 'undefined' && window.location?.origin ? `&origin=${window.location.origin}` : '';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800 select-none group"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* -------------------------------------------------------------
          1. VIDEO ENGINE (YouTube Iframe or HTML5 <video>)
          ------------------------------------------------------------- */}
      {isYouTube ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black">
          <iframe
            id={`yt-iframe-${youtubeId}`}
            ref={iframeRef}
            key={youtubeId}
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1${originParam}`}
            title={title}
            className="absolute -top-[14%] -left-[2%] w-[104%] h-[128%] border-0 pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={resolvedVideoUrl}
          autoPlay={autoPlay}
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (!isNaN(d) && isFinite(d) && d > 0) {
              setDuration(d);
              durationRef.current = d;
            }
          }}
          onDurationChange={(e) => {
            const d = e.currentTarget.duration;
            if (!isNaN(d) && isFinite(d) && d > 0) {
              setDuration(d);
              durationRef.current = d;
            }
          }}
          onTimeUpdate={(e) => {
            if (!isScrubbingRef.current) {
              const t = e.currentTarget.currentTime;
              setCurrentTime(t);
              currentTimeRef.current = t;
            }
          }}
          onPlay={() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
          }}
          onPause={() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
          }}
          onEnded={() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            if (onEndedRef.current) onEndedRef.current();
          }}
          className="absolute inset-0 w-full h-full object-contain bg-black pointer-events-none select-none"
        />
      )}

      {/* -------------------------------------------------------------
          2. INVISIBLE CLICK AREA (Click to Play/Pause, Double Click Fullscreen)
          ------------------------------------------------------------- */}
      <div
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Toggle Play/Pause"
      />

      {/* Center Play Button Overlay when Paused */}
      {!isPlaying && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            executePlay();
          }}
          className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer pointer-events-auto bg-black/40 hover:bg-black/30 transition-all group/centerplay"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#900606] hover:bg-[#a50808] text-white flex items-center justify-center shadow-[0_0_35px_rgba(144,6,6,0.8)] group-hover/centerplay:scale-110 active:scale-95 transition-all duration-300">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          3. CENTER PLAY/PAUSE ANIMATION RIPPLE
          ------------------------------------------------------------- */}
      {centerAnimation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center animate-ping duration-500">
          <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
            {centerAnimation === 'play' ? (
              <Play className="w-10 h-10 fill-white translate-x-0.5" />
            ) : (
              <Pause className="w-10 h-10 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. TOP BAR OVERLAY (Lesson Title & Masterclass Badge)
          ------------------------------------------------------------- */}
      <div
        className={`absolute top-0 inset-x-0 z-20 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#900606] text-white shadow-md">
            <Sparkles className="w-3 h-3" />
            {courseBadge}
          </span>
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-md truncate max-w-[260px] sm:max-w-md">
            {title}
          </h3>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase bg-black/40 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
          HD 1080p
        </span>
      </div>

      {/* -------------------------------------------------------------
          5. BOTTOM CUSTOM CONTROL BAR OVERLAY
          ------------------------------------------------------------- */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 p-2 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying || isScrubbing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-full bg-black/85 backdrop-blur-xl rounded-2xl border border-white/15 p-2 sm:p-3 shadow-2xl flex flex-col gap-1.5 sm:gap-2">
          {/* A. CUSTOM INTERACTIVE PROGRESS SCRUBBER (Clickable & Draggable) */}
          <div
            ref={progressRailRef}
            onClick={handleDirectClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleTimelineHover}
            onMouseLeave={handleTimelineLeave}
            className="group/seek relative w-full h-4 flex items-center cursor-pointer select-none py-1 touch-none"
          >
            {/* Background Rail */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/seek:h-2.5 transition-all">
              {/* Played Progress Bar */}
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#900606] rounded-full relative transition-[width] duration-75"
              />
            </div>

            {/* Hover Tooltip Timestamp */}
            {hoverPosition && (
              <div
                style={{ left: `${hoverPosition.percent}%` }}
                className="absolute -top-7 -translate-x-1/2 bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 shadow-lg pointer-events-none z-30"
              >
                {formatTime(hoverPosition.time)}
              </div>
            )}

            {/* Scrubber Thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-[#900606] opacity-0 group-hover/seek:opacity-100 group-hover/seek:scale-125 transition-all pointer-events-none"
            />
          </div>

          {/* B. MAIN CONTROL BUTTONS ROW */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 text-white">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume, Time */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink min-w-0">
              {/* Play / Pause Button */}
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

              {/* Rewind 10 Seconds */}
              <button
                type="button"
                onClick={skipBackward}
                className="p-1 sm:p-2 shrink-0 rounded-lg hover:bg-white/10 active:scale-90 text-neutral-300 hover:text-white transition-all cursor-pointer relative group/btn"
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black/80 px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  -10s
                </span>
              </button>

              {/* Forward 10 Seconds */}
              <button
                type="button"
                onClick={skipForward}
                className="p-1 sm:p-2 shrink-0 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all cursor-pointer relative group/btn"
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black/80 px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  +10s
                </span>
              </button>

              {/* Volume & Mute Controls */}
              <div className="flex items-center gap-1 group/vol pl-0.5 shrink-0">
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

                {/* Smooth Volume Slider: Hidden on mobile to keep controls perfectly fitted */}
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

              {/* Time Display */}
              <div className="text-[10px] sm:text-xs font-mono font-medium text-neutral-300 pl-0.5 select-none whitespace-nowrap shrink-0">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-0.5 sm:mx-1">/</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            {/* Right Controls: Playback Speed & Fullscreen */}
            <div className="flex items-center gap-1 sm:gap-2 relative shrink-0">
              {/* Playback Speed Controller Menu */}
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

              {/* Fullscreen Button */}
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
