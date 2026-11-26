import React from 'react';
import {
  Landmark,
  Bot,
  BookOpenCheck,
  MousePointerClick,
  UploadCloud,
  Send,
  Clock,
} from 'lucide-react';
import { ChatSceneLayout, ChatStepItem } from '../ChatSceneLayout';

interface BankChatbotSlideProps {
  visibleStep: number;
}

export const BankChatbotSlide: React.FC<BankChatbotSlideProps> = ({ visibleStep }) => {
  const chatSteps: ChatStepItem[] = [
    {
      id: 'bank-q1',
      sender: 'user',
      senderLabel: 'Клиент · Банка',
      icon: <Landmark className="w-8 h-8" />,
      iconTone: 'blue',
      bubbleContent: (
        <div>
          <p className="text-xs font-semibold text-blue-700 mb-1">
            Прашање од клиент банка
          </p>
          <p className="text-base md:text-lg font-medium text-slate-900 leading-relaxed">
            „Како да испратам извештај?“
          </p>
        </div>
      ),
      commentTitle: 'Без барање низ долги PDF документи',
      commentText:
        'Корисникот од банката поставува прашање на македонски јазик наместо да пребарува низ обемни упатства или да повикува поддршка.',
    },
    {
      id: 'bank-a1',
      sender: 'agent',
      senderLabel: 'ISIDORA Четбот',
      icon: <Bot className="w-8 h-8" />,
      iconTone: 'emerald',
      bubbleContent: (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-700">
              Упатство чекор-по-чекор
            </span>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Официјално упатство за банки</span>
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  1. Кликнете на „Поднесување извештаи“ → „Нов поднесок“
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Опцијата се наоѓа во главното мени веднаш по најавата на порталот.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  2. Кликнете „Прикачи документ“ и изберете го фајлот
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Прикачете ја подготвената XML или Excel датотека од вашиот компјутер.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  3. Внесете „Извештаен период“ и „Шифра на банка“, па кликнете „Испрати“
                </p>
                <p className="text-sm text-slate-600 mt-0.5">
                  Системот веднаш ќе изврши проверка и ќе ви прикаже потврда за прием.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            Извор: Упатство за клиенти банки · Поглавје 3.2
          </p>
        </div>
      ),
      commentTitle: 'Моментален одговор со точни чекори',
      commentText:
        'Агентот дава јасно упатство („кликни овде, внеси ова“) директно од упатството за банки — достапно 24/7 без чекање поддршка.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Landmark className="w-9 h-9" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 mb-1">
                Дел 03 · Поддршка за надворешни клиенти
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
                ISIDORA Chatbot за одговори од упатство за клиенти банки
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">Достапен 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-800">Точни одговори</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Scene with Large Icons & Side Arrows */}
      <ChatSceneLayout
        sceneTitle="ISIDORA Портал за банки — Разговор со асистент"
        steps={chatSteps}
        visibleStepCount={visibleStep}
      />
    </div>
  );
};
