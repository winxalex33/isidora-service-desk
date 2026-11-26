import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Bot,
  Cpu,
  FileText,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  Send,
} from 'lucide-react';
import { ChatSceneLayout, ChatStepItem } from '../ChatSceneLayout';

interface RuleGeneratorSlideProps {
  visibleStep: number;
}

interface ShelfRule {
  id: string;
  code: string;
  title: string;
  isNew?: boolean;
}

const existingRulesBefore: ShelfRule[] = [
  { id: 'r2', code: 'Правило 2', title: 'Проверка на ЕМБС / Даночен број' },
  { id: 'r3', code: 'Правило 3', title: 'Валиден датум на трансакција' },
  { id: 'r4', code: 'Правило 4', title: 'Задолжителна валута (ISO код)' },
  { id: 'r5', code: 'Правило 5', title: 'Конзистентност на износ > 0' },
];

export const RuleGeneratorSlide: React.FC<RuleGeneratorSlideProps> = ({ visibleStep }) => {
  const [validationPhase, setValidationPhase] = useState<
    'idle' | 'sending' | 'scanning' | 'done'
  >('idle');
  const [activeRuleScanIdx, setActiveRuleScanIdx] = useState<number>(-1);

  const showShelfAnimation = visibleStep >= 3;
  const showValidationFlow = visibleStep >= 4;

  const shelfRules: ShelfRule[] = [
    existingRulesBefore[0],
    existingRulesBefore[1],
    {
      id: 'r1',
      code: 'Правило 1 (Ново)',
      title: 'Задолжителна адреса за DgrStrTip IN (NL, NS)',
      isNew: true,
    },
    existingRulesBefore[2],
    existingRulesBefore[3],
  ];

  // When Step 4 is triggered by SPACE, animate the document flowing through the machine
  useEffect(() => {
    if (!showValidationFlow) {
      setValidationPhase('idle');
      setActiveRuleScanIdx(-1);
      return;
    }

    setValidationPhase('sending');
    setActiveRuleScanIdx(-1);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setValidationPhase('scanning');
        setActiveRuleScanIdx(0);
      }, 650)
    );

    [1, 2, 3, 4].forEach((idx) => {
      timers.push(
        setTimeout(() => {
          setActiveRuleScanIdx(idx);
        }, 650 + idx * 360)
      );
    });

    timers.push(
      setTimeout(() => {
        setValidationPhase('done');
      }, 650 + 5 * 360 + 180)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [showValidationFlow]);

  const chatSteps: ChatStepItem[] = [
    {
      id: 'rg-q1',
      sender: 'user',
      senderLabel: 'Бизнис корисник',
      icon: <User className="w-8 h-8" />,
      iconTone: 'blue',
      bubbleContent: (
        <div>
          <p className="text-xs font-semibold text-blue-700 mb-1">
            Опис на деловно правило
          </p>
          <p className="text-base font-medium text-slate-900 leading-relaxed">
            „<span className="font-bold">Правило 1:</span> Условно се известува за нерезиденти правни лица и самостојни вршители за дејност{' '}
            <code className="px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-900 text-sm font-mono">
              DgrStrTip IN ('NL', 'NS')
            </code>
            “
          </p>
        </div>
      ),
      commentTitle: 'Правило со обичен текст',
      commentText:
        'Бизнис корисникот го опишува условот на природен јазик без познавање на програмирање.',
    },
    {
      id: 'rg-a1',
      sender: 'agent',
      senderLabel: 'ISIDORA Агент',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'indigo',
      bubbleContent: (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-700">
            Оптимизирано машинско правило
          </p>
          <div className="rounded-xl bg-slate-900 text-slate-100 p-3.5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            !RuleHelpers.IsIn(RuleHelpers.GetCode(row, &quot;DgrStrTip&quot;), &quot;NL&quot;, &quot;NS&quot;) || RuleHelpers.IsFilled(row, &quot;DgrStrAdresa&quot;)
          </div>
        </div>
      ),
      commentTitle: 'Претворање во машинско правило',
      commentText:
        'Го оптимизира и го претвора во машинско читливо правило спремно за системот.',
    },
  ];

  const getRuleStatus = (idx: number, rule: ShelfRule) => {
    if (!showValidationFlow || validationPhase === 'idle' || validationPhase === 'sending') {
      return 'neutral';
    }
    const reached = validationPhase === 'done' || activeRuleScanIdx >= idx;
    if (!reached) return 'neutral';
    if (rule.isNew) {
      return 'fail';
    }
    return 'pass';
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-700 mb-1">
              Дел 02 · ISIDORA Автоматска контрола
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              ISIDORA Генератор на правила за контрола на поднесените извештаи
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Од бизнис текст до активно правило на полицата и автоматска проверка на секој поднесен извештај.
          </p>
        </div>
      </div>

      {/* Chat Dialog (Steps 1 & 2) */}
      <ChatSceneLayout
        sceneTitle="Генерирање на правило преку разговор"
        steps={chatSteps}
        visibleStepCount={Math.min(visibleStep, 2)}
      />

      {/* Animated Rule Shelf & Validation Machine (Steps 3 & 4) */}
      {showShelfAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 rounded-2xl p-6 md:p-7 space-y-5"
        >
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {visibleStep === 3
                  ? 'Вметнување на правилото на полицата во Машината за правила'
                  : 'Контрола на поднесен извештај низ Машината за правила'}
              </h3>
              <p className="text-sm text-slate-600">
                {visibleStep === 3
                  ? 'Новото правило како правоаголник се сместува на полицата заедно со другите правила.'
                  : 'Корисник од левата страна праќа извештај · правилата светат зелено/црвено · извештајот излегува црвен (одбиен).'}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {visibleStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700"
              >
                <Layers className="w-4 h-4" />
                <span>Новото правило се движи и влегува на полицата ↓</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3-Column Stage: [Left User + Report] ---> [Center Rule Machine] ---> [Right Red Rejected Report] */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-6 items-center">
            {/* LEFT: User sending document */}
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[220px] justify-center">
              {showValidationFlow ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center"
                  >
                    <User className="w-9 h-9" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Корисник</p>
                    <p className="text-xs text-slate-500 mt-0.5">Праќа извештај</p>
                  </div>

                  <motion.div
                    initial={{ x: -16, opacity: 0, scale: 0.9 }}
                    animate={
                      validationPhase === 'sending'
                        ? { x: [0, 42], opacity: [1, 0.9], scale: 1 }
                        : { x: 0, opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-300 shadow-xs text-xs font-semibold text-slate-800"
                  >
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Извештај.xml</span>
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                  </motion.div>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <User className="w-12 h-12 opacity-35" />
                  <p className="text-xs font-medium">
                    Поднесување извештај
                  </p>
                </div>
              )}
            </div>

            {/* CENTER: Big Rectangle "Машина за правила" with Shelf */}
            <div className="relative rounded-2xl border-2 border-slate-800 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-6 h-6 text-slate-800" />
                  <span className="text-base font-bold text-slate-900">
                    Машина за правила
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500 tabular-nums">
                  Полица · {shelfRules.length} правила
                </span>
              </div>

              <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-3">
                {shelfRules.map((rule, idx) => {
                  const status = getRuleStatus(idx, rule);

                  const cardStyle =
                    status === 'fail'
                      ? 'bg-red-50 border-red-400 text-red-950 ring-2 ring-red-200'
                      : status === 'pass'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-100'
                      : rule.isNew
                      ? 'bg-blue-50 border-blue-400 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800';

                  return (
                    <motion.div
                      key={rule.id}
                      initial={
                        rule.isNew
                          ? { opacity: 0, y: -48, scale: 0.92 }
                          : { opacity: 1, y: 0 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={
                        rule.isNew
                          ? { duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                          : { duration: 0.2 }
                      }
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-colors duration-200 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${
                            status === 'fail'
                              ? 'bg-red-600 text-white'
                              : status === 'pass'
                              ? 'bg-emerald-600 text-white'
                              : rule.isNew
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {rule.code}
                        </span>
                        <span className="text-sm font-semibold truncate">{rule.title}</span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold">
                        {status === 'pass' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Зелено</span>
                          </span>
                        )}
                        {status === 'fail' && (
                          <span className="inline-flex items-center gap-1 text-red-700">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span>Црвено · Грешка</span>
                          </span>
                        )}
                        {status === 'neutral' && rule.isNew && (
                          <span className="text-blue-700 font-semibold">Ново на полица</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {showValidationFlow && (
                <>
                  <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-700 text-white items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 text-white items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT: Rejected Red Report Output */}
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[220px] justify-center">
              {showValidationFlow && validationPhase === 'done' ? (
                <motion.div
                  initial={{ opacity: 0, x: -24, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 border-2 border-red-400 flex items-center justify-center">
                    <FileText className="w-9 h-9 text-red-600" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>ОДБИЕН ИЗВЕШТАЈ</span>
                  </div>
                  <p className="text-xs text-red-800 font-medium leading-relaxed">
                    Записот за нерезидент <span className="font-mono font-bold">&apos;NL&apos;</span> нема пополнета адреса (Правило 1).
                  </p>
                </motion.div>
              ) : showValidationFlow ? (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Cpu className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-xs font-semibold text-slate-700">
                    Машината проверува...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <FileText className="w-12 h-12 opacity-35" />
                  <p className="text-xs font-medium">
                    Резултат од контрола
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
