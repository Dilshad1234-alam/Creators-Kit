'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  if (isNaN(seconds) || seconds === null || seconds < 0) return '00:00';
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
  const hideControlsTimerRef = useRef(null);

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

  const youtubeId = parseYouTubeId(videoUrl);
  const isYouTube = Boolean(youtubeId);

  // Send API commands to YouTube iframe
  const sendYouTubeCommand = useCallback((func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args,
        }),
        '*'
      );
    }
  }, []);

  // Set up YouTube iframe listener
  useEffect(() => {
    if (!isYouTube) return;

    let localTimer = null;

    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'infoDelivery' && data?.info) {
          if (typeof data.info.currentTime === 'number') {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            // 1: PLAYING, 2: PAUSED, 0: ENDED
            if (data.info.playerState === 1) setIsPlaying(true);
            if (data.info.playerState === 2) setIsPlaying(false);
            if (data.info.playerState === 0) {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }
          }
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);

    // Initial handshake to tell YouTube we're listening
    const handshakeTimer = setInterval(() => {
      sendYouTubeCommand('listening');
    }, 1000);

    // Local smooth ticker for progress bar when playing YouTube video
    localTimer = setInterval(() => {
      setIsPlaying((playing) => {
        if (playing) {
          setCurrentTime((prev) => Math.min(prev + 0.5 * playbackSpeed, duration || prev + 0.5));
        }
        return playing;
      });
    }, 500);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(handshakeTimer);
      clearInterval(localTimer);
    };
  }, [isYouTube, sendYouTubeCommand, onEnded, duration, playbackSpeed]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide timer on mouse inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
      setShowSpeedMenu(false);
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (isYouTube) {
      if (isPlaying) {
        sendYouTubeCommand('pauseVideo');
        setIsPlaying(false);
        setCenterAnimation('pause');
      } else {
        sendYouTubeCommand('playVideo');
        setIsPlaying(true);
        setCenterAnimation('play');
      }
    } else if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setCenterAnimation('play');
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setCenterAnimation('pause');
      }
    }
    setTimeout(() => setCenterAnimation(null), 600);
  };

  // Skip Rewind (-10s)
  const skipBackward = (e) => {
    e?.stopPropagation();
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (isYouTube) {
      sendYouTubeCommand('seekTo', [newTime, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Skip Forward (+10s)
  const skipForward = (e) => {
    e?.stopPropagation();
    const maxTime = duration || currentTime + 30;
    const newTime = Math.min(maxTime, currentTime + 10);
    setCurrentTime(newTime);
    if (isYouTube) {
      sendYouTubeCommand('seekTo', [newTime, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Scrubber Seek
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    setCurrentTime(newTime);
    if (isYouTube) {
      sendYouTubeCommand('seekTo', [newTime, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
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
      if (nextMuted) {
        sendYouTubeCommand('mute');
      } else {
        sendYouTubeCommand('unMute');
        sendYouTubeCommand('setVolume', [(volume || 0.5) * 100]);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  // Speed Change
  const handleSpeedSelect = (speed, e) => {
    e?.stopPropagation();
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);

    if (isYouTube) {
      sendYouTubeCommand('setPlaybackRate', [speed]);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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
          {/* Scaled/Cropped iframe strips out YouTube top title header and all native branding */}
          <iframe
            ref={iframeRef}
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`}
            title={title}
            className="absolute -top-[14%] -left-[2%] w-[104%] h-[128%] border-0 pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={autoPlay}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
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
        className={`absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-full bg-black/80 backdrop-blur-xl rounded-2xl border border-white/15 p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2">
          {/* A. CUSTOM INTERACTIVE PROGRESS SCRUBBER */}
          <div
            onClick={handleSeek}
            className="group/seek relative w-full h-3 flex items-center cursor-pointer select-none py-1"
          >
            {/* Background Rail */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/seek:h-2 transition-all">
              {/* Played Progress Bar */}
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#900606] rounded-full relative"
              />
            </div>

            {/* Scrubber Thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-[#900606] opacity-0 group-hover/seek:opacity-100 group-hover/seek:scale-125 transition-all"
            />
          </div>

          {/* B. MAIN CONTROL BUTTONS ROW */}
          <div className="flex items-center justify-between gap-2 text-white">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume, Time */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Play / Pause Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
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
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all cursor-pointer relative group/btn"
                title="Rewind 10 seconds"
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
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-all cursor-pointer relative group/btn"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black/80 px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  +10s
                </span>
              </button>

              {/* Volume & Mute Controls */}
              <div className="flex items-center gap-1.5 group/vol pl-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
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

                {/* Smooth Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-14 sm:w-20 h-1.5 accent-[#900606] bg-white/20 rounded-lg cursor-pointer"
                  aria-label="Volume Slider"
                />
              </div>

              {/* Time Display */}
              <div className="text-[11px] sm:text-xs font-mono font-medium text-neutral-300 pl-1 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Playback Speed & Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2 relative">
              {/* Playback Speed Controller Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedMenu(!showSpeedMenu);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
                  aria-label="Playback Speed"
                >
                  <Gauge className="w-3.5 h-3.5 text-neutral-300" />
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
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white transition-colors cursor-pointer"
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

