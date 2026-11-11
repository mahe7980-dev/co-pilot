import React from 'react';
import { Bot, MessageSquare, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { CasePreset } from '../types';

interface HeaderProps {
  presets: CasePreset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenRules: () => void;
  apiKeyPresent: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onOpenRules,
  apiKeyPresent
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Agent Personas */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  RecruitAgent
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
                    严谨智能招聘系统
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                原文依据严格初筛 · 知识库边界拟真沟通 · 自动索要简历交付HR
              </p>
            </div>
          </div>

          {/* Dual Agent Badges & Presets Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Agent 1 Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">招聘匹配专家:</span>
              <span className="text-emerald-300">严守原文依据/零主观臆断</span>
            </div>

            {/* Agent 2 Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-slate-300 font-medium">候选人沟通Agent:</span>
              <span className="text-blue-300">严格知识库边界/红线转人工</span>
            </div>

            {/* Preset Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium">用例:</label>
              <select
                id="preset-select"
                aria-label="切换行业实战用例"
                value={selectedPresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.industry} - {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Rules Modal Button */}
            <button
              onClick={onOpenRules}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>查看Agent规矩与Prompt</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
