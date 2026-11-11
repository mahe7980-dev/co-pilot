import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Code2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AutomationStep, YupaoCandidate, DevConfig } from '../types/orbit';

interface AutoExecutePopoverProps {
  steps: AutomationStep[];
  currentStepIndex: number;
  isRunning: boolean;
  onTogglePlayPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
  activeCandidate: YupaoCandidate;
  onOpenDevModal: () => void;
  devConfig?: DevConfig;
  theme?: 'dark' | 'light';
}

export const AutoExecutePopover: React.FC<AutoExecutePopoverProps> = ({
  steps,
  currentStepIndex,
  isRunning,
  onTogglePlayPause,
  onNextStep,
  activeCandidate,
  onOpenDevModal,
  devConfig,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div
      className={`w-[620px] rounded-2xl border shadow-2xl p-4 transition-all duration-200 select-none backdrop-blur-xl ${
        isLight
          ? 'bg-white/95 border-slate-300/80 text-slate-800 ring-1 ring-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
          : 'bg-[#10141f]/95 border-white/15 text-slate-100 ring-1 ring-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
      }`}
    >
      {/* 1. Header Bar: Status Badge + Candidate Badge + Step + Action Buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isRunning
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isRunning ? '内部自动运转中' : '执行已暂停'}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {/* Target Candidate Badge (图1 样式) */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border max-w-[220px] truncate ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#008aff] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
              {activeCandidate.name.slice(0, 1)}
            </div>
            <span className="truncate">
              {activeCandidate.name} ({activeCandidate.age}岁 · {activeCandidate.status})
            </span>
          </div>

          {/* Current Step Pill */}
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
              isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
            }`}
          >
            步骤 {currentStepIndex + 1}/5: {currentStep.code}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlayPause}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-2xs ${
              isRunning
                ? isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                : isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>继续</span>
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-[#181d2a] hover:bg-[#22293b] text-slate-300 border-[#2b3348]'
            }`}
            title="手动单步前进一步"
          >
            <SkipForward className="w-3.5 h-3.5 text-blue-500" />
            <span>单步</span>
          </button>

          <button
            onClick={onOpenDevModal}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
              isLight
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}
            title="打开非标系统开发者冗余插槽"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>开发预留</span>
          </button>
        </div>
      </div>

      {/* 2. Middle: Live Running Task & Candidate Highlights */}
      <div className="py-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {currentStep.title}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                ● 自动流转中
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {currentStep.log}
            </p>
          </div>

          {/* Candidate Quick Tag Pill */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-right shrink-0 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#151926] border-[#22283a]'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {activeCandidate.tags[0] || '核心从业经验'}
            </div>
            <div className="text-[10px] text-slate-400">
              期望薪资: {activeCandidate.salary}
            </div>
          </div>
        </div>

        {/* 3. 5-Step Pipeline Progress Bar */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {steps.map((st, idx) => {
            const isDone = idx < currentStepIndex;
            const isCur = idx === currentStepIndex;
            return (
              <div
                key={st.id}
                className={`p-1.5 rounded-lg border text-center transition-all ${
                  isCur
                    ? 'border-[#008aff] bg-[#008aff]/10 text-[#008aff] shadow-2xs ring-1 ring-[#008aff]/40'
                    : isDone
                    ? isLight
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-400'
                    : 'border-slate-800 bg-[#121622] text-slate-500'
                }`}
              >
                <div className="text-[10px] font-bold flex items-center justify-center gap-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : isCur ? (
                    <span className="w-2 h-2 rounded-full bg-[#008aff] animate-ping shrink-0" />
                  ) : null}
                  <span>{st.code}</span>
                </div>
                <div className="text-[10px] truncate mt-0.5">
                  {st.title.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer: Developer Hooks & Auto Loop Hint */}
      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>DOM防检测打字抖动: {devConfig?.typingDelayMs || 65}ms</span>
          <span>·</span>
          <span>Webhook: {devConfig?.webhookFormat || 'feishu'}推送就绪</span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
          4秒自动前行，完成自动循环下一位牛人
        </span>
      </div>
    </div>
  );
};
