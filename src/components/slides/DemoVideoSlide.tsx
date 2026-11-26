import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Upload,
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
  const bundledSrc = DEMO_VIDEO_SOURCES[categoryKey];

  const [localOverrideUrl, setLocalOverrideUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeVideoSrc = localOverrideUrl ?? bundledSrc;

  // Cleanup object URL on unmount or replacement
  useEffect(() => {
    return () => {
      if (localOverrideUrl) {
        URL.revokeObjectURL(localOverrideUrl);
      }
    };
  }, [localOverrideUrl]);

  // Ensure autoplay starts whenever the slide or video source mounts/changes
  useEffect(() => {
    setHasLoadError(false);
    const videoEl = videoRef.current;
    if (!videoEl || !activeVideoSrc) {
      setIsPlaying(false);
      return;
    }

    videoEl.currentTime = 0;
    videoEl.muted = isMuted;

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Fallback to muted autoplay if unmuted autoplay was blocked by browser policy
          videoEl.muted = true;
          setIsMuted(true);
          videoEl
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
    }
  }, [activeVideoSrc, categoryKey]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
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

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localOverrideUrl) {
      URL.revokeObjectURL(localOverrideUrl);
    }
    const url = URL.createObjectURL(file);
    setLocalOverrideUrl(url);
    setLocalFileName(file.name);
    setHasLoadError(false);
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

          {/* Player Controls */}
          <div
            className="flex flex-wrap items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {activeVideoSrc && !hasLoadError && (
              <>
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
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleLocalFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* 16:9 Autoplay Video Player Stage */}
      <div
        className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {activeVideoSrc && !hasLoadError ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-video max-h-[64vh] mx-auto rounded-xl overflow-hidden bg-slate-950">
              <video
                ref={videoRef}
                key={activeVideoSrc}
                src={activeVideoSrc}
                autoPlay
                muted={isMuted}
                playsInline
                controls
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setHasLoadError(true)}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  {localFileName ?? config.title}
                </span>
                <span aria-hidden="true">·</span>
                <span>Автоматска репродукција</span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Замени со локално видео
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video max-h-[60vh] mx-auto rounded-xl bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-blue-400">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              DEMO видеото чека да биде додадено
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
              За да се вчита автоматски, поставете го видеото во папката{' '}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-xs">
                src/assets/{config.expectedFilenameHint}
              </code>{' '}
              или изберете видео датотека директно од вашиот уред.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Избери видео од компјутер</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
