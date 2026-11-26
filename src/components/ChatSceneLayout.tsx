import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export interface ChatStepItem {
  id: string;
  sender: 'user' | 'agent';
  senderLabel: string;
  icon: React.ReactNode;
  iconTone: 'blue' | 'indigo' | 'emerald' | 'slate' | 'amber';
  bubbleContent: React.ReactNode;
  commentTitle: string;
  commentText: string;
}

interface ChatSceneLayoutProps {
  steps: ChatStepItem[];
  visibleStepCount: number;
  sceneTitle: string;
}

const iconToneClasses: Record<ChatStepItem['iconTone'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-300',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const ChatSceneLayout: React.FC<ChatSceneLayoutProps> = ({
  steps,
  visibleStepCount,
  sceneTitle,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Subtle Window Header */}
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-sm font-semibold text-slate-800">{sceneTitle}</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-500">
          <span>Дијалог во живо</span>
          <span aria-hidden="true">·</span>
          <span>Бизнис објаснување</span>
        </div>
      </div>

      {/* Chat Rows + Side Arrow Callouts */}
      <div className="p-6 md:p-8 space-y-6">
        {steps.map((step, index) => {
          const isVisible = index < visibleStepCount;
          if (!isVisible) return null;

          const isUser = step.sender === 'user';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_76px_minmax(0,0.95fr)] items-center gap-4 lg:gap-0"
            >
              {/* Left Column: Chat Bubble with Large Icon */}
              <div
                className={`flex items-start gap-4 ${
                  isUser ? 'justify-start' : 'justify-start'
                }`}
              >
                {/* Large Actor Icon */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center shadow-xs ${iconToneClasses[step.iconTone]}`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 text-center max-w-[84px] leading-tight">
                    {step.senderLabel}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex-1 rounded-2xl px-5 py-4 border ${
                    isUser
                      ? 'bg-blue-50/60 border-blue-200/80 text-slate-900'
                      : 'bg-slate-50/90 border-slate-200 text-slate-900'
                  }`}
                >
                  {step.bubbleContent}
                </div>
              </div>

              {/* Center Column: Animated Arrow Pointing Left (<---) */}
              <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex items-center justify-center px-2"
                aria-hidden="true"
              >
                <svg
                  width="68"
                  height="24"
                  viewBox="0 0 68 24"
                  fill="none"
                  className="text-blue-600"
                >
                  <motion.line
                    x1="64"
                    y1="12"
                    x2="8"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                  />
                  <motion.path
                    d="M15 5L7 12L15 19"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.35 }}
                  />
                </svg>
              </motion.div>

              {/* Right Column: Business Comment Card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.42, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl bg-amber-50/75 border border-amber-200/90 px-4 py-3.5 flex items-start gap-3"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 lg:hidden" />
                <div>
                  <p className="text-xs font-bold text-amber-900 mb-1">
                    {step.commentTitle}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {step.commentText}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
