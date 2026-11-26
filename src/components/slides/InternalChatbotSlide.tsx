import React from 'react';
import {
  UserCog,
  Bot,
  BookMarked,
  FolderOpen,
  PlusSquare,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { ChatSceneLayout, ChatStepItem } from '../ChatSceneLayout';

interface InternalChatbotSlideProps {
  visibleStep: number;
}

export const InternalChatbotSlide: React.FC<InternalChatbotSlideProps> = ({
  visibleStep,
}) => {
  const chatSteps: ChatStepItem[] = [
    {
      id: 'int-q1',
      sender: 'user',
      senderLabel: 'Интерен корисник',
      icon: <UserCog className="w-8 h-8" />,
      iconTone: 'amber',
      bubbleContent: (
        <div>
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Прашање од интерен вработен
          </p>
          <p className="text-base md:text-lg font-medium text-slate-900 leading-relaxed">
            „Како да внесам нов шифрарник?“
          </p>
        </div>
      ),
      commentTitle: 'Без чекање на колега или ИТ',
      commentText:
        'Интерниот корисник прашува за постапката на природен јазик без да бара помош од колеги или да отвора интерни тикети.',
    },
    {
      id: 'int-a1',
      sender: 'agent',
      senderLabel: 'ISIDORA Четбот',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'indigo',
      bubbleContent: (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-indigo-700">
              Процедура од интерното упатство
            </span>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
              <span>Интерно упатство</span>
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  1. Отворете „Администрација“ → „Шифрарници“
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Во главното мени изберете го административниот модул за управување со шифрарници.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <PlusSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  2. Кликнете на копчето „Нов шифрарник (+)“
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Копчето се наоѓа во горниот десен агол и ја отвора формата за внес.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  3. Внесете „Код“, „Назив“ и „Датум на важност“, па кликнете „Зачувај“
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Поставете статус „Активен“ — шифрарникот веднаш е достапен низ целиот систем.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            Извор: Интерно упатство за корисници · Дел 4.1
          </p>
        </div>
      ),
      commentTitle: 'Брзо воведување и работа без грешки',
      commentText:
        'Агентот дава точно упатство со конкретни менија и полиња („кликни овде, внеси ова“), за секој вработен да работи самостојно.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <UserCog className="w-9 h-9" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 mb-1">
                Дел 04 · Поддршка за вработени
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
                ISIDORA Chatbot за одговори од упатство за интерни корисници
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-slate-800">Стандардни процедури</span>
            </div>
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-slate-800">Одговор за секунди</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Scene with Large Icons & Side Arrows */}
      <ChatSceneLayout
        sceneTitle="ISIDORA Интерен Портал — Разговор со асистент"
        steps={chatSteps}
        visibleStepCount={visibleStep}
      />
    </div>
  );
};
