import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
} from 'lucide-react';
import {
  DEMO_SLIDE_CONFIGS,
  DEMO_VIDEO_SOURCES,
  DemoCategoryKey,
} from '../../config/demoVideos';

interface DemoVideoSlideProps {
  categoryKey: DemoCategoryKey;
}

export const DemoVideoSlide: React.FC<DemoVideoSlideProps> = ({ categoryKey }) => {
  const config = DEMO_SLIDE_CONFIGS[categoryKey];
  const primarySrc = DEMO_VIDEO_SOURCES[categoryKey];

  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);

  const videoSrc =
    useFallback && config.githubFallbackUrl ? config.githubFallbackUrl : primarySrc;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasAutoStartedRef = useRef<boolean>(false);

  const startPlayback = () => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoSrc) return;

    videoEl.defaultMuted = true;
    videoEl.muted = true;
    setIsMuted(true);

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasAutoStartedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  // Reset source state when switching DEMO slides
  useEffect(() => {
    setUseFallback(false);
    hasAutoStartedRef.current = false;
    setHasLoadError(false);
  }, [categoryKey]);

  // Start playing automatically from the beginning whenever this DEMO slide or src changes
  useEffect(() => {
    hasAutoStartedRef.current = false;
    setHasLoadError(false);
    const videoEl = videoRef.current;
    if (!videoEl || !videoSrc) {
      setIsPlaying(false);
      return;
    }

    videoEl.currentTime = 0;
    startPlayback();
  }, [videoSrc, categoryKey]);

  const handleVideoError = () => {
    if (!useFallback && config.githubFallbackUrl && primarySrc !== config.githubFallbackUrl) {
      setUseFallback(true);
      setHasLoadError(false);
      return;
    }
    setHasLoadError(true);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      hasAutoStartedRef.current = true;
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      hasAutoStartedRef.current = true;
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.currentTime = 0;
    videoEl
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const nextMuted = !isMuted;
    videoEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="space-y-5">
      {/* Slide Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-700 mb-1">
              {config.partLabel}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              {config.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
              {config.subtitle}
            </p>
          </div>

          {videoSrc && !hasLoadError && (
            <div
              className="flex flex-wrap items-center gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Пауза</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Пушти</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Пушти од почеток"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Од почеток</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Вклучи звук</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Исклучи звук</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleFullscreen}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Цел екран"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Цел екран</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 16:9 Autoplay Video Player Stage */}
      <div
        className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {videoSrc && !hasLoadError ? (
          <div className="relative w-full aspect-video max-h-[66vh] mx-auto rounded-xl overflow-hidden bg-slate-950">
            <video
              ref={videoRef}
              key={videoSrc}
              src={videoSrc}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              controls
              loop
              onCanPlay={() => {
                if (!hasAutoStartedRef.current && videoRef.current?.paused) {
                  startPlayback();
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={handleVideoError}
              className="w-full h-full object-contain"
            />
          </div>
        ) : hasLoadError ? (
          <div className="w-full aspect-video max-h-[62vh] mx-auto rounded-xl bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-amber-400">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Грешка при вчитување на видеото
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
              Видеото од{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-xs">
                {videoSrc}
              </code>{' '}
              не можеше да се репродуцира во прелистувачот.
            </p>
            <button
              type="button"
              onClick={() => {
                setHasLoadError(false);
                setTimeout(startPlayback, 50);
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Обиди се повторно</span>
            </button>
          </div>
        ) : (
          <div className="w-full aspect-video max-h-[62vh] mx-auto rounded-xl bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-blue-400">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Се чека четвртото DEMO видео
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
              За деловите 2, 3 и 4 видеата од{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-xs">
                src/assets
              </code>{' '}
              се поврзани. За оваа категорија додајте го четвртото видео во{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-xs">
                src/assets/{config.expectedFilenameHint}
              </code>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
