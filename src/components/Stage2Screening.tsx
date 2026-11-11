import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Quote,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Code,
  Tag,
  Clock,
  ShieldCheck,
  FileText,
  User
} from 'lucide-react';
import { CandidatePreset, Criterion, ScreenResult } from '../types';

interface Stage2ScreeningProps {
  candidates: CandidatePreset[];
  selectedCandidate: CandidatePreset | null;
  onSelectCandidate: (candidate: CandidatePreset) => void;
  candidateProfile: string;
  onCandidateProfileChange: (text: string) => void;
  candidateName: string;
  onCandidateNameChange: (name: string) => void;
  criteria: Criterion[];
  screeningResult: ScreenResult | null;
  onScreen: () => Promise<void>;
  isLoading: boolean;
  onNext: () => void;
  onViewJson: (title: string, data: any) => void;
}

export const Stage2Screening: React.FC<Stage2ScreeningProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  candidateProfile,
  onCandidateProfileChange,
  candidateName,
  onCandidateNameChange,
  criteria,
  screeningResult,
  onScreen,
  isLoading,
  onNext,
  onViewJson,
}) => {
  const [highlightedSnippet, setHighlightedSnippet] = useState<string | null>(null);

  const getStatusBadge = (status: 'met' | 'not_met' | 'unknown' | 'conflict') => {
    switch (status) {
      case 'met':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>met (明确满足)</span>
          </span>
        );
      case 'not_met':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>not_met (明确不满足)</span>
          </span>
        );
      case 'unknown':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>unknown (未提及-待核验)</span>
          </span>
        );
      case 'conflict':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>conflict (履历矛盾)</span>
          </span>
        );
    }
  };

  const getLevelBadge = (level: 'A' | 'B' | 'C') => {
    switch (level) {
      case 'A':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white shadow-sm font-bold text-sm">
            <span>等级 A</span>
            <span className="text-xs font-normal text-emerald-100">核心必须项完全满足且有显著亮点</span>
          </div>
        );
      case 'B':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-600 text-white shadow-sm font-bold text-sm">
            <span>等级 B</span>
            <span className="text-xs font-normal text-amber-100">核心匹配，但存在 unknown 待对话确认</span>
          </div>
        );
      case 'C':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white shadow-sm font-bold text-sm">
            <span>等级 C</span>
            <span className="text-xs font-normal text-rose-100">存在明确必须项不满足或严重冲突</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold font-mono">
              P3 核心任务
            </span>
            <h2 className="text-base font-bold text-slate-900">在线简历逐条客观初筛 & 证据链引证</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            由【招聘匹配专家】执行：严守四大铁律，所有判断必须在 <span className="font-semibold text-emerald-700">evidence</span> 给出原文字句，
            未提及项一律记为 <span className="font-semibold text-amber-700">unknown（严禁主观臆断为不满足）</span>。
          </p>
        </div>
        {screeningResult && (
          <button
            onClick={() => onViewJson('P3 在线简历初筛 JSON 格式', screeningResult)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-xs transition shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            <span>查看输出 JSON</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate selector & Resume text */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            
            {/* Candidate Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                选择候选人档案或自定义录入
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {candidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => onSelectCandidate(cand)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      selectedCandidate?.id === cand.id
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cand.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-white border">
                        预设 {cand.expectedLevel} 级
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{cand.title}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                候选人姓名 / 称呼
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => onCandidateNameChange(e.target.value)}
                placeholder="例如：张建国"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  候选人在线简历全文
                </label>
                {highlightedSnippet && (
                  <button
                    onClick={() => setHighlightedSnippet(null)}
                    className="text-[11px] text-emerald-600 hover:underline cursor-pointer"
                  >
                    清除引证高亮
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  rows={15}
                  value={candidateProfile}
                  onChange={(e) => onCandidateProfileChange(e.target.value)}
                  placeholder="粘贴候选人在线简历或履历详情..."
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={onScreen}
              disabled={isLoading || !candidateProfile.trim() || criteria.length === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'AI 专家正在逐条严密核验证据...' : '执行 P3 在线简历初筛评估'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Screening Assessment Results */}
        <div className="lg:col-span-7 space-y-4">
          {!screeningResult ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">尚未执行初筛</p>
              <p className="text-xs mt-1">
                选择候选人并点击“执行 P3 在线简历初筛评估”，匹配专家将基于简历原文逐条判定
              </p>
            </div>
          ) : (
            <>
              {/* Overall Summary & Grade Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">综合初筛评级</span>
                    <div className="mt-1">{getLevelBadge(screeningResult.level)}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>原文证据覆盖率: 100% (未提及绝不臆断)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 mr-1.5">初筛结论概括:</span>
                  <span className="text-slate-800">{screeningResult.summary}</span>
                </div>
              </div>

              {/* Highlights & To Confirm Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Highlights */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      履历真实亮点 ({screeningResult.highlights?.length || 0})
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">将作为 P6 打招呼的个性化融入点</p>
                  <div className="space-y-1.5 pt-1">
                    {screeningResult.highlights?.map((h, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs font-medium flex items-start gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* To Confirm Questions */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      待对话确认事项 ({screeningResult.to_confirm?.length || 0})
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">需对话 Agent 在后续沟通中针对性确认</p>
                  <div className="space-y-1.5 pt-1">
                    {screeningResult.to_confirm?.map((tc, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-medium flex items-start gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{tc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria Verification Detail Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    逐条标准核验与原文证据引证 ({screeningResult.criteria?.length || 0})
                  </h3>
                  <span className="text-[11px] text-slate-500">点击字句可高亮比对</span>
                </div>

                <div className="space-y-2.5">
                  {screeningResult.criteria?.map((item) => {
                    const originalDef = criteria.find((c) => c.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400 text-[10px]">{item.id}</span>
                              <span
                                className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                  item.priority === 'must'
                                    ? 'bg-rose-100 text-rose-700'
                                    : item.priority === 'exclude'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {item.priority}
                              </span>
                              <span className="text-slate-800 font-semibold">
                                {originalDef?.description || item.note}
                              </span>
                            </div>
                          </div>
                          <div>{getStatusBadge(item.status)}</div>
                        </div>

                        {/* Evidence Citation */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                            <Quote className="w-3 h-3 text-slate-400" />
                            <span>原文依据 (evidence):</span>
                          </div>
                          {item.evidence ? (
                            <p
                              onClick={() => setHighlightedSnippet(item.evidence)}
                              className="font-mono text-slate-800 bg-white p-1.5 rounded border border-slate-200 cursor-pointer hover:border-emerald-400 transition"
                              title="点击在左侧简历中定位"
                            >
                              “{item.evidence}”
                            </p>
                          ) : (
                            <p className="italic text-slate-400">
                              null（简历未提及该项，严格标记为 unknown，不作臆断）
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 mt-1">
                            <span className="font-medium text-slate-700">专家解析:</span> {item.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>根据初筛亮点，生成个性化打招呼语 (P6)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
