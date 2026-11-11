import React, { useState } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  RotateCw,
  Circle,
  Terminal,
  ChevronDown,
  ChevronUp,
  Code2,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Cpu,
  UserCheck,
} from 'lucide-react';
import { AutomationStep, YupaoCandidate, DevConfig } from '../types/orbit';

interface AutomationTaskPanelProps {
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AutomationTaskPanel: React.FC<AutomationTaskPanelProps> = ({
  steps,
  currentStepIndex,
  isRunning,
  onTogglePlayPause,
  onNextStep,
  onReset,
  activeCandidate,
  onOpenDevModal,
  devConfig,
  theme = 'light',
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
}) => {
  const isLight = theme === 'light';
  // Allow internal or controlled collapse state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;
  const toggleCollapse = externalOnToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const currentStep = steps[currentStepIndex] || steps[0];

  // Dynamic candidate-targeted communication strategy summary
  const getCommunicationDesignGoal = () => {
    if (currentStepIndex === 0) {
      return `正在定向检索【${activeCandidate.city} · ${activeCandidate.experience}】最活跃的真实求职者`;
    }
    if (currentStepIndex === 1) {
      return `正在核验【${activeCandidate.name}】的真实履历（${activeCandidate.resumeDetails.highlights.join('、')}），排查必须项与健康证原文证据`;
    }
    if (currentStepIndex === 2) {
      return `正在对【${activeCandidate.name}】生成定制破冰话术：依托其「${activeCandidate.tags[0] || '从业经验'}」设计 50~80 字亲切问询，消除戒备心`;
    }
    if (currentStepIndex === 3) {
      return `正在与【${activeCandidate.name}】进行微聊意图推进：确认到岗时间，并在第 2 轮自然索要手机号与微信号`;
    }
    return `已成功与【${activeCandidate.name}】沟通并索取联系方式（${activeCandidate.phone || '138****9988'}），正在生成 HR 极速交付总结卡`;
  };

  return (
    <div
      className={`select-none transition-all duration-300 relative ${
        isLight
          ? 'bg-[#f8fafc] text-slate-800'
          : 'bg-[#10131e] text-slate-200'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. COLLAPSED VIEW (极简收起栏)                             */}
      {/* ========================================================= */}
      {isCollapsed ? (
        <div className="px-5 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Live status dot & Candidate mini badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                {isRunning ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isRunning ? '自动化运行中' : '执行已暂停'}
              </span>
            </div>

            <div className={`h-3.5 w-px ${isLight ? 'bg-slate-300' : 'bg-slate-700/60'}`} />

            {/* Target Candidate Pill */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs truncate border ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                {activeCandidate.name.slice(0, 1)}
              </span>
              <span className="font-semibold">{activeCandidate.name}</span>
              <span className="text-[11px] opacity-75">
                ({activeCandidate.age}岁 · {activeCandidate.status})
              </span>
              <span className="text-[11px] hidden md:inline opacity-60">|</span>
              <span className="text-[11px] hidden md:inline truncate max-w-[260px] opacity-90">
                {getCommunicationDesignGoal()}
              </span>
            </div>

            {/* Step Mini Badge */}
            <span
              className={`text-[11px] px-2 py-0.5 rounded font-mono hidden sm:inline shrink-0 ${
                isLight ? 'bg-slate-200 text-slate-700' : 'bg-[#181d2c] text-slate-300'
              }`}
            >
              步骤 {currentStepIndex + 1}/{steps.length}: {currentStep.code}
            </span>
          </div>

          {/* Right: Quick actions & Expand Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTogglePlayPause}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-[#191d2c] hover:bg-[#22283c] border-[#29324a] text-slate-200'
              }`}
            >
              {isRunning ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
              <span>{isRunning ? '暂停' : '继续'}</span>
            </button>

            <button
              onClick={onNextStep}
              disabled={currentStepIndex >= steps.length - 1}
              className={`px-2 py-1 rounded-md text-xs border transition cursor-pointer disabled:opacity-40 hidden sm:inline ${
                isLight ? 'bg-white border-slate-300' : 'bg-[#191d2c] border-[#29324a]'
              }`}
            >
              单步
            </button>

            <button
              onClick={onOpenDevModal}
              className={`px-2 py-1 rounded-md text-xs border flex items-center gap-1 transition cursor-pointer ${
                isLight
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
              }`}
              title="开发者冗余与扩展插槽配置"
            >
              <Code2 className="w-3 h-3" />
              <span className="hidden md:inline">开发预留</span>
            </button>

            <button
              onClick={toggleCollapse}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-[#1f2538] hover:bg-[#28314a] text-slate-200'
              }`}
              title="展开完整操作与候选人沟通设计"
            >
              <span>展开</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. EXPANDED VIEW (完整展开 · 简洁清晰 + 候选人沟通设计)   */
        /* ========================================================= */
        <div className="p-4 sm:p-5 max-w-7xl mx-auto space-y-3.5">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isLight
                    ? 'bg-purple-100 border border-purple-300 text-purple-700'
                    : 'bg-[#251c40] border border-purple-500/30 text-purple-300'
                }`}
              >
                <Terminal className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    自动化网页操作与沟通执行引擎
                  </h3>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    步骤 {currentStepIndex + 1}/{steps.length} · 进度 {progressPercent}%
                  </span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  基于双 Agent 招聘专家准则，自动在鱼泡直聘执行筛选、客观初筛、微聊沟通与电话交换
                </p>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Developer Redundancy Slot Button */}
              <button
                onClick={onOpenDevModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer shadow-2xs ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/40 text-indigo-300'
                }`}
                title="非标产品预留：DOM选择器热更新、Hooks钩子、反爬拟真与Webhook对接"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">开发者冗余插槽</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>

              <button
                onClick={onTogglePlayPause}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-[#181d2c] hover:bg-[#23293c] border-[#293248] text-slate-200'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-500" />
                    <span>暂停</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    <span>继续执行</span>
                  </>
                )}
              </button>

              <button
                onClick={onNextStep}
                disabled={currentStepIndex >= steps.length - 1}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer disabled:opacity-40 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-[#181d2c] hover:bg-[#23293c] border-[#293248] text-slate-300'
                }`}
                title="单步推进调试"
              >
                单步
              </button>

              <button
                onClick={onReset}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-500'
                    : 'bg-[#181d2c] hover:bg-[#23293c] border-[#293248] text-slate-400'
                }`}
                title="重置步骤"
              >
                重置
              </button>

              <button
                onClick={toggleCollapse}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800'
                    : 'bg-[#1c2234] hover:bg-[#252c42] border-[#2b354e] text-slate-200'
                }`}
                title="收起操作面板以最大化网页浏览区域"
              >
                <span>收起</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Target Candidate & Communication Design (重点展示沟通设计) */}
          {/* ======================================================== */}
          <div
            className={`rounded-xl border p-3 sm:p-3.5 transition-colors ${
              isLight
                ? 'bg-white border-blue-200 shadow-2xs'
                : 'bg-[#141828] border-blue-500/30 shadow-2xs'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Candidate Bio */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                    activeCandidate.gender === '女' ? 'bg-pink-500' : 'bg-blue-600'
                  }`}
                >
                  {activeCandidate.name.slice(0, 1)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeCandidate.name}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-500/15 font-medium opacity-80">
                      {activeCandidate.age}岁 · {activeCandidate.gender}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 font-medium">
                      {activeCandidate.status}
                    </span>
                    <span className="text-[11px] font-mono text-blue-500 font-semibold">
                      期望薪资: {activeCandidate.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] opacity-70 flex-wrap">
                    <span>履历亮点:</span>
                    {activeCandidate.resumeDetails.highlights.map((h, i) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.2 rounded text-[10px] ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#1e2538] text-slate-300'
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communication Design Strategy Box */}
              <div
                className={`md:max-w-md p-2 rounded-lg border text-xs space-y-1 ${
                  isLight
                    ? 'bg-blue-50/70 border-blue-100 text-blue-950'
                    : 'bg-[#172036] border-blue-500/20 text-blue-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[11px]">
                  <span className="flex items-center gap-1 text-blue-500">
                    <Sparkles className="w-3 h-3" />
                    当前沟通设计策略 (Prompt Stage: {currentStep.code})
                  </span>
                  <span className="text-[10px] opacity-70 font-mono">
                    {currentStepIndex >= 3 ? '✅ 已建立微聊' : '⏳ 阶段流转中'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2">
                  {getCommunicationDesignGoal()}
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Streamlined Horizontal Step Progress Pipeline             */}
          {/* ======================================================== */}
          <div className="space-y-1.5">
            {/* Slim Progress Bar */}
            <div
              className={`w-full h-1 rounded-full overflow-hidden ${
                isLight ? 'bg-slate-200' : 'bg-[#191e2e]'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps Row (Streamlined) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
              {steps.map((st, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={st.id}
                    className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between gap-1.5 transition-all ${
                      isCurrent
                        ? isLight
                          ? 'bg-white border-purple-400 text-purple-950 shadow-xs'
                          : 'bg-[#1a2034] border-purple-500/60 text-white shadow-2xs'
                        : isCompleted
                        ? isLight
                          ? 'bg-slate-100/70 border-slate-200 text-slate-600'
                          : 'bg-[#121622] border-[#1d2334] text-slate-400'
                        : isLight
                        ? 'bg-white/40 border-slate-100 text-slate-400'
                        : 'bg-[#0e111a] border-transparent text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 opacity-30 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-[11px] truncate flex items-center gap-1">
                          <span className="font-mono text-[9px] opacity-75">{st.code}</span>
                          <span>{st.title.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono shrink-0 px-1 py-0.2 rounded font-medium ${
                        isCompleted
                          ? 'text-emerald-500 bg-emerald-500/10'
                          : isCurrent
                          ? 'text-purple-400 bg-purple-500/15'
                          : 'opacity-40'
                      }`}
                    >
                      {isCompleted ? 'OK' : isCurrent ? 'RUN' : 'WAIT'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Developer Redundancy Status Ribbon */}
          <div
            className={`px-3 py-1.5 rounded-lg border text-[11px] flex flex-wrap items-center justify-between gap-2 opacity-80 ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#121624] border-[#1c2236]'
            }`}
          >
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className="flex items-center gap-1 text-indigo-400">
                <Code2 className="w-3 h-3" /> 非标开发插槽:
              </span>
              <span className="text-slate-400">
                Hooks: {devConfig?.hookBeforeScreen ? 'beforeScreen✓' : ''} {devConfig?.hookAfterGreeting ? 'afterGreet✓' : ''} {devConfig?.hookOnContactCaptured ? 'onCaptured✓' : ''}
              </span>
              <span className="text-slate-400 hidden sm:inline">
                DOM 仿真: {devConfig?.typingDelayMs || 60}ms 键盘抖动 · 贝塞尔曲线
              </span>
              <span className="text-slate-400 hidden md:inline">
                Webhook: {devConfig?.webhookFormat || 'feishu'} 飞书多维表格推送
              </span>
            </div>

            <button
              onClick={onOpenDevModal}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer"
            >
              配置开发冗余参数 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
