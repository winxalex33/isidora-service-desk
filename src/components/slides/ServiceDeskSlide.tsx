import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Bot,
  Table2,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Lock,
  Code2,
  AlertTriangle,
} from 'lucide-react';
import { ChatSceneLayout, ChatStepItem } from '../ChatSceneLayout';

interface ServiceDeskSlideProps {
  visibleStep: number;
}

const projectRows = [
  {
    project: 'Модернизација на платен систем',
    period: 'Окт – Дек (Q4)',
    hours: 142,
    share: '33.6%',
  },
  {
    project: 'ISIDORA Регулаторно известување',
    period: 'Окт – Дек (Q4)',
    hours: 196,
    share: '46.5%',
  },
  {
    project: 'Интеграција со НБРСМ портал',
    period: 'Ное – Дек (Q4)',
    hours: 84,
    share: '19.9%',
  },
];

const chartData = [
  { date: '10.10', hours: 7.5, extreme: false },
  { date: '24.10', hours: 8.0, extreme: false },
  { date: '04.11', hours: 7.0, extreme: false },
  { date: '14.11', hours: 13.5, extreme: true },
  { date: '28.11', hours: 8.0, extreme: false },
  { date: '09.12', hours: 7.5, extreme: false },
  { date: '19.12', hours: 14.0, extreme: true },
  { date: '26.12', hours: 6.5, extreme: false },
];

export const ServiceDeskSlide: React.FC<ServiceDeskSlideProps> = ({ visibleStep }) => {
  const chatSteps: ChatStepItem[] = [
    {
      id: 'sd-q1',
      sender: 'user',
      senderLabel: 'Корисник',
      icon: <User className="w-8 h-8" />,
      iconTone: 'blue',
      bubbleContent: (
        <p className="text-base md:text-lg font-medium text-slate-900 leading-relaxed">
          „Дај ми за <span className="font-bold text-blue-800">Петар Петровски</span> на кои проекти работел и колку саати потрошил по проектот во{' '}
          <span className="font-bold text-blue-800">четвртиот квартал</span>.“
        </p>
      ),
      commentTitle: 'Природен македонски јазик',
      commentText:
        'Прашањето се поставува на македонски јазик и може да содржи имиња, проекти, временски периоди и посебни филтри без познавање на бази.',
    },
    {
      id: 'sd-a1',
      sender: 'agent',
      senderLabel: 'Агент',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'indigo',
      bubbleContent: (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Table2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Извештај од база · Петар Петровски (Q4)
                </h4>
                <p className="text-xs text-slate-500">
                  Директно извлечени податоци од Service Desk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Експорт Excel</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-red-700">
                <FileText className="w-4 h-4" />
                <span>Експорт PDF</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-2 px-3.5">Проект</th>
                  <th className="py-2 px-3.5">Период</th>
                  <th className="py-2 px-3.5 text-right">Саати</th>
                  <th className="py-2 px-3.5 text-right">Удел</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {projectRows.map((row) => (
                  <tr key={row.project}>
                    <td className="py-2 px-3.5 font-medium text-slate-800">{row.project}</td>
                    <td className="py-2 px-3.5 text-slate-500 text-xs">{row.period}</td>
                    <td className="py-2 px-3.5 text-right font-semibold text-slate-900 tabular-nums">
                      {row.hours} ч.
                    </td>
                    <td className="py-2 px-3.5 text-right text-slate-600 tabular-nums">
                      {row.share}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50/50 font-bold text-slate-900">
                  <td className="py-2 px-3.5" colSpan={2}>
                    Вкупно во Q4
                  </td>
                  <td className="py-2 px-3.5 text-right tabular-nums text-blue-800">422 ч.</td>
                  <td className="py-2 px-3.5 text-right tabular-nums">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      commentTitle: 'Табела и експорт во PDF / Excel',
      commentText:
        'Приказ на извлечените податоци од базата и можност за моментален експорт во PDF или Excel.',
    },
    {
      id: 'sd-a2',
      sender: 'agent',
      senderLabel: 'Агент',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'indigo',
      bubbleContent: (
        <div className="space-y-2.5">
          <p className="text-base font-medium text-slate-900 leading-relaxed">
            „Ги анализирав податоците и посебно сакам да ги потенцирам следните датуми за кои се забележани{' '}
            <span className="font-bold text-red-700">екстремни вредности</span>:“
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div className="text-sm">
                <span className="font-bold text-red-900 tabular-nums">14.11.2026</span>
                <span className="text-red-700 block text-xs tabular-nums">
                  13.5 ч. (+68% над просек)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div className="text-sm">
                <span className="font-bold text-red-900 tabular-nums">19.12.2026</span>
                <span className="text-red-700 block text-xs tabular-nums">
                  14.0 ч. (+75% над просек)
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      commentTitle: 'Интелигентна анализа по преференци',
      commentText:
        'Агентот ги анализира податоците и извлекува важни заклучоци во зависност од преференците на корисникот.',
    },
    {
      id: 'sd-a3',
      sender: 'agent',
      senderLabel: 'Агент',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'indigo',
      bubbleContent: (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Дијаграм на потрошени саати по датуми (Q4)
              </h4>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                Нормално
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Екстремна вредност
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 pt-5">
            <div className="grid grid-cols-8 gap-2 sm:gap-3 items-end h-36">
              {chartData.map((bar, idx) => {
                const heightPct = Math.round((bar.hours / 15) * 100);
                return (
                  <div key={bar.date} className="flex flex-col items-center h-full justify-end gap-1">
                    <span
                      className={`text-[11px] font-bold tabular-nums ${
                        bar.extreme ? 'text-red-700' : 'text-slate-600'
                      }`}
                    >
                      {bar.extreme ? `▲ ${bar.hours}` : bar.hours}
                    </span>
                    <div className="w-full flex-1 flex items-end justify-center">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: `${heightPct}%`, transformOrigin: 'bottom' }}
                        className={`w-full max-w-[34px] rounded-t-md ${
                          bar.extreme ? 'bg-red-600 ring-2 ring-red-200' : 'bg-blue-600/85'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] tabular-nums ${
                        bar.extreme ? 'font-bold text-red-700' : 'text-slate-500'
                      }`}
                    >
                      {bar.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
      commentTitle: 'Визуелен дијаграм',
      commentText:
        'Графички приказ на трендовите и екстремните датуми — подготвено за состанок без чекање на девелопер.',
    },
  ];

  // visibleStep 1 = context cards only; steps 2..5 reveal chatSteps[0..3]
  const chatVisibleCount = Math.max(0, visibleStep - 1);

  return (
    <div className="space-y-5">
      {/* Slide Title & 3 Core Business Challenges */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-blue-700 mb-1">
              Дел 01 · Service Desk Известување
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Service Desk: Од рачни извештаи до паметен асистент
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Моментални одговори, табели и графици на македонски јазик без ангажман на програмери.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Извештаи од Service Desk
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Корисниците користат извештаи од Service Desk за секојдневно следење.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ограничен број рачно направени извештаи
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Постојат само фиксни шаблони кои не можат да одговорат на нови прашања.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Секоја измена бара ангажман на девелопер
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Секој нов филтер или промена значи чекање на ИТ тимот.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Scenario (revealed step-by-step on SPACE) */}
      {chatVisibleCount > 0 && (
        <ChatSceneLayout
          sceneTitle="Service Desk AI Асистент"
          steps={chatSteps}
          visibleStepCount={chatVisibleCount}
        />
      )}
    </div>
  );
};
