import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceDeskSlide } from './components/slides/ServiceDeskSlide';
import { RuleGeneratorSlide } from './components/slides/RuleGeneratorSlide';
import { BankChatbotSlide } from './components/slides/BankChatbotSlide';
import { InternalChatbotSlide } from './components/slides/InternalChatbotSlide';
import { DemoVideoSlide } from './components/slides/DemoVideoSlide';
import { DemoCategoryKey } from './config/demoVideos';

interface CategoryMeta {
  index: number;
  navLabel: string;
  firstSlideIdx: number;
}

interface SlideMeta {
  id: number;
  categoryIdx: number;
  title: string;
  maxSteps: number;
  kind: 'content' | 'demo';
  demoKey?: DemoCategoryKey;
}

const CATEGORIES: CategoryMeta[] = [
  { index: 0, navLabel: '1. Service Desk', firstSlideIdx: 0 },
  { index: 1, navLabel: '2. Генератор на правила', firstSlideIdx: 2 },
  { index: 2, navLabel: '3. Бот за банки', firstSlideIdx: 4 },
  { index: 3, navLabel: '4. Бот за интерни', firstSlideIdx: 6 },
];

const SLIDES: SlideMeta[] = [
  {
    id: 0,
    categoryIdx: 0,
    title: 'Service Desk',
    maxSteps: 5,
    kind: 'content',
  },
  {
    id: 1,
    categoryIdx: 0,
    title: 'Service Desk — DEMO',
    maxSteps: 1,
    kind: 'demo',
    demoKey: 'service-desk',
  },
  {
    id: 2,
    categoryIdx: 1,
    title: 'ISIDORA Генератор на правила',
    maxSteps: 4,
    kind: 'content',
  },
  {
    id: 3,
    categoryIdx: 1,
    title: 'ISIDORA Генератор на правила — DEMO',
    maxSteps: 1,
    kind: 'demo',
    demoKey: 'rule-generator',
  },
  {
    id: 4,
    categoryIdx: 2,
    title: 'ISIDORA Chatbot за клиенти банки',
    maxSteps: 2,
    kind: 'content',
  },
  {
    id: 5,
    categoryIdx: 2,
    title: 'ISIDORA Chatbot за клиенти банки — DEMO',
    maxSteps: 1,
    kind: 'demo',
    demoKey: 'bank-chatbot',
  },
  {
    id: 6,
    categoryIdx: 3,
    title: 'ISIDORA Chatbot за интерни корисници',
    maxSteps: 2,
    kind: 'content',
  },
  {
    id: 7,
    categoryIdx: 3,
    title: 'ISIDORA Chatbot за интерни корисници — DEMO',
    maxSteps: 1,
    kind: 'demo',
    demoKey: 'internal-chatbot',
  },
];

export default function App() {
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [visibleStep, setVisibleStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const slideContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
  const prevSlideRef = useRef<number>(0);
  const prevStepRef = useRef<number>(1);
  const lastHeightRef = useRef<number>(0);

  const currentSlide = SLIDES[activeSlideIdx];

  const jumpToSlide = useCallback(
    (targetSlideIdx: number) => {
      if (targetSlideIdx < 0 || targetSlideIdx >= SLIDES.length) return;
      setDirection(targetSlideIdx >= activeSlideIdx ? 1 : -1);
      setActiveSlideIdx(targetSlideIdx);
      setVisibleStep(1);
    },
    [activeSlideIdx]
  );

  const handleNext = useCallback(() => {
    if (visibleStep < currentSlide.maxSteps) {
      setVisibleStep((s) => s + 1);
    } else if (activeSlideIdx < SLIDES.length - 1) {
      setDirection(1);
      setActiveSlideIdx((idx) => idx + 1);
      setVisibleStep(1);
    }
  }, [visibleStep, currentSlide.maxSteps, activeSlideIdx]);

  const handleBack = useCallback(() => {
    if (visibleStep > 1) {
      setVisibleStep((s) => s - 1);
    } else if (activeSlideIdx > 0) {
      const prevIdx = activeSlideIdx - 1;
      setDirection(-1);
      setActiveSlideIdx(prevIdx);
      setVisibleStep(SLIDES[prevIdx].maxSteps);
    }
  }, [visibleStep, activeSlideIdx]);

  // Auto-scroll when new vertical content appears or when switching slides
  useEffect(() => {
    const slideChanged = prevSlideRef.current !== activeSlideIdx;
    const stepIncreased = visibleStep > prevStepRef.current;
    const stepDecreased = visibleStep < prevStepRef.current;

    prevSlideRef.current = activeSlideIdx;
    prevStepRef.current = visibleStep;

    if (slideChanged) {
      lastHeightRef.current = 0;
      if (visibleStep === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const timer = setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }, 340);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (stepIncreased) {
      const t1 = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
      const t2 = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 420);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (stepDecreased) {
      const timer = setTimeout(() => {
        bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 140);
      return () => clearTimeout(timer);
    }
  }, [activeSlideIdx, visibleStep]);

  // Watch slide height changes so any animated vertical expansion smoothly scrolls into view
  useEffect(() => {
    const el = slideContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (lastHeightRef.current > 0 && newHeight > lastHeightRef.current + 12) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
        lastHeightRef.current = newHeight;
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeSlideIdx]);

  // Pure PowerPoint Keyboard Controls: SPACE (Next) & BACKSPACE (Previous)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handleBack();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const targetCategory = Number(e.key) - 1;
        const targetSlide = CATEGORIES[targetCategory]?.firstSlideIdx ?? 0;
        jumpToSlide(targetSlide);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, jumpToSlide]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F4F6FA] text-slate-900 select-none"
      onClick={() => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        handleNext();
      }}
    >
      {/* Clean PowerPoint Slide Header Strip */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/90">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-8">
          <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            ISIDORA &amp; Service Desk
          </span>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
            {CATEGORIES.map((category) => {
              const isActive = category.index === currentSlide.categoryIdx;
              return (
                <button
                  key={category.index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToSlide(category.firstSlideIdx);
                  }}
                  className={`relative py-4 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive ? 'text-blue-700' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {category.navLabel}
                  {isActive && (
                    <motion.span
                      layoutId="pptActiveSlideBar"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-700"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <span className="text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap shrink-0">
            Слајд {activeSlideIdx + 1} / {SLIDES.length}
            {currentSlide.kind === 'demo' ? ' · DEMO' : ''}
          </span>
        </div>
      </header>

      {/* PowerPoint Slide Canvas */}
      <main
        ref={slideContainerRef}
        className="flex-1 flex flex-col justify-center max-w-[1320px] w-full mx-auto px-6 lg:px-10 py-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlideIdx}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {activeSlideIdx === 0 && <ServiceDeskSlide visibleStep={visibleStep} />}
            {activeSlideIdx === 2 && <RuleGeneratorSlide visibleStep={visibleStep} />}
            {activeSlideIdx === 4 && <BankChatbotSlide visibleStep={visibleStep} />}
            {activeSlideIdx === 6 && <InternalChatbotSlide visibleStep={visibleStep} />}
            {currentSlide.kind === 'demo' && currentSlide.demoKey && (
              <DemoVideoSlide categoryKey={currentSlide.demoKey} />
            )}
          </motion.div>
        </AnimatePresence>
        <div ref={bottomAnchorRef} className="h-1" aria-hidden="true" />
      </main>

      {/* Quiet PowerPoint Slide Footer (Progress bar & keyboard hint) */}
      <footer className="bg-white/80 border-t border-slate-200/80">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">{currentSlide.title}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {currentSlide.kind === 'demo'
                ? 'DEMO видео · Автоматска репродукција'
                : `Анимација ${visibleStep} / ${currentSlide.maxSteps}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: currentSlide.maxSteps }).map((_, i) => {
              const active = i + 1 <= visibleStep;
              return (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    active ? 'w-6 bg-blue-700' : 'w-2 bg-slate-300'
                  }`}
                />
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-4 font-medium text-slate-500">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[11px]">
                SPACE
              </kbd>{' '}
              Следно
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[11px]">
                BACKSPACE
              </kbd>{' '}
              Назад
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
