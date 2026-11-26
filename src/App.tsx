import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceDeskSlide } from './components/slides/ServiceDeskSlide';
import { RuleGeneratorSlide } from './components/slides/RuleGeneratorSlide';
import { BankChatbotSlide } from './components/slides/BankChatbotSlide';
import { InternalChatbotSlide } from './components/slides/InternalChatbotSlide';

interface SlideMeta {
  id: number;
  navLabel: string;
  title: string;
  maxSteps: number;
}

const SLIDES: SlideMeta[] = [
  {
    id: 0,
    navLabel: '1. Service Desk',
    title: 'Service Desk',
    maxSteps: 5,
  },
  {
    id: 1,
    navLabel: '2. Генератор на правила',
    title: 'ISIDORA Генератор на правила',
    maxSteps: 4,
  },
  {
    id: 2,
    navLabel: '3. Бот за банки',
    title: 'ISIDORA Chatbot за клиенти банки',
    maxSteps: 2,
  },
  {
    id: 3,
    navLabel: '4. Бот за интерни',
    title: 'ISIDORA Chatbot за интерни корисници',
    maxSteps: 2,
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
        const target = Number(e.key) - 1;
        setDirection(target >= activeSlideIdx ? 1 : -1);
        setActiveSlideIdx(target);
        setVisibleStep(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, activeSlideIdx]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F4F6FA] text-slate-900 select-none"
      onClick={() => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        handleNext();
      }}
    >
      {/* Clean PowerPoint Slide Header Strip (No buttons) */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/90">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-8">
          <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            ISIDORA &amp; Service Desk
          </span>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIdx;
              return (
                <span
                  key={slide.id}
                  className={`relative py-4 whitespace-nowrap transition-colors ${
                    isActive ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  {slide.navLabel}
                  {isActive && (
                    <motion.span
                      layoutId="pptActiveSlideBar"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-700"
                    />
                  )}
                </span>
              );
            })}
          </div>

          <span className="text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap shrink-0">
            Слајд {activeSlideIdx + 1} / {SLIDES.length}
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
            {activeSlideIdx === 1 && <RuleGeneratorSlide visibleStep={visibleStep} />}
            {activeSlideIdx === 2 && <BankChatbotSlide visibleStep={visibleStep} />}
            {activeSlideIdx === 3 && <InternalChatbotSlide visibleStep={visibleStep} />}
          </motion.div>
        </AnimatePresence>
        <div ref={bottomAnchorRef} className="h-1" aria-hidden="true" />
      </main>

      {/* Quiet PowerPoint Slide Footer (Progress bar & keyboard hint, zero buttons) */}
      <footer className="bg-white/80 border-t border-slate-200/80">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">{currentSlide.title}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              Анимација {visibleStep} / {currentSlide.maxSteps}
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
