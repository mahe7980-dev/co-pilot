import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Phone,
  Calendar,
  DollarSign,
  AlertTriangle,
  Copy,
  Check,
  Code,
  Share2,
  User,
  ShieldCheck,
  RefreshCw,
  Printer
} from 'lucide-react';
import { DeliverySummary, ExtractedInfo, ScreenResult } from '../types';

interface Stage5DeliverySummaryProps {
  jobTitle: string;
  candidateName: string;
  screeningResult: ScreenResult | null;
  extractedInfo: ExtractedInfo;
  deliverySummary: DeliverySummary | null;
  onGenerateSummary: () => Promise<void>;
  isLoading: boolean;
  onViewJson: (title: string, data: any) => void;
  onRestart: () => void;
}

export const Stage5DeliverySummary: React.FC<Stage5DeliverySummaryProps> = ({
  jobTitle,
  candidateName,
  screeningResult,
  extractedInfo,
  deliverySummary,
  onGenerateSummary,
  isLoading,
  onViewJson,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    if (!deliverySummary) return;
    const md = `### 📋【RecruitAgent 候选人交付推荐卡】
**候选人**: ${candidateName}
**应聘岗位**: ${jobTitle}
**初筛评级**: ${screeningResult?.level || 'A'} 级 (${screeningResult?.summary || ''})
**沟通态度**: ${deliverySummary.candidate_attitude}

#### ⚡ HR 一句话汇报:
> ${deliverySummary.hr_one_liner}

#### 🎯 核心推荐理由:
${deliverySummary.recommend_reason}

#### ✅ 已确认关键项:
- 期望薪资: ${deliverySummary.confirmed_items['期望薪资'] || extractedInfo.salary_expect || '已核实'}
- 到岗时间: ${deliverySummary.confirmed_items['到岗时间'] || extractedInfo.start_date || '随时到岗'}
- 联系方式: ${deliverySummary.confirmed_items['联系方式'] || extractedInfo.contact_info || '已留存'}

#### ⚠️ 潜在风险与人工面谈建议:
${deliverySummary.potential_risks}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold font-mono">
              P9 核心任务
            </span>
            <h2 className="text-base font-bold text-slate-900">推荐理由与 HR 极速交付总结卡</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            由【招聘匹配专家】最终把关：拿完联系方式与核心要素后，生成结构化推荐摘要与一句话汇报，可直接发给业务主管或 HRBP。
          </p>
        </div>
        {deliverySummary && (
          <button
            onClick={() => onViewJson('P9 交付总结 JSON 格式', deliverySummary)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-xs transition shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            <span>查看输出 JSON</span>
          </button>
        )}
      </div>

      {!deliverySummary ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-4">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <p className="text-base font-bold text-slate-700">尚未生成最终交付卡</p>
            <p className="text-xs text-slate-500 mt-1">
              点击下方按钮，AI 专家将综合阶段二核验证据与阶段四沟通记录，自动提炼结构化交付卡
            </p>
          </div>
          <button
            onClick={onGenerateSummary}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? '正在提炼交付报告...' : '一键生成 P9 交付推荐卡'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Delivery Card (Printable) */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase">
              RecruitAgent Verified
            </div>

            {/* Card Header Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {candidateName?.slice(0, 1) || '候'}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-slate-900">{candidateName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      初筛 {screeningResult?.level || 'A'} 级
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      沟通态度: {deliverySummary.candidate_attitude}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    应聘岗位：<span className="font-semibold text-slate-700">{jobTitle}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '已复制 Markdown' : '复制交付简报'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="打印交付单"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Prominent HR One-Liner Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-500/30">
              <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase block mb-1">
                ⚡ HR / 招聘主管 一句话极速汇报 (hr_one_liner)
              </span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                “{deliverySummary.hr_one_liner}”
              </p>
            </div>

            {/* Core Recommendation Reason */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                核心推荐理由 (基于技能匹配度与亮点)
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                {deliverySummary.recommend_reason}
              </div>
            </div>

            {/* Confirmed Details 3-Grid */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                已核实关键项 (confirmed_items)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>期望薪资</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">
                    {deliverySummary.confirmed_items['期望薪资'] || extractedInfo.salary_expect || '已核实'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>预计到岗时间</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900">
                    {deliverySummary.confirmed_items['到岗时间'] || extractedInfo.start_date || '随时可到岗'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>联系方式 (电话/微信)</span>
                  </div>
                  <p className="font-mono font-bold text-sm text-emerald-950">
                    {deliverySummary.confirmed_items['联系方式'] || extractedInfo.contact_info || '已取得'}
                  </p>
                </div>
              </div>
            </div>

            {/* Potential Risks & Interview Follow-ups */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                潜在风险点与人工面试建议
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                {deliverySummary.potential_risks}
              </div>
            </div>

            {/* Card Footer Signature */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>交付生成时间: {new Date().toLocaleString('zh-CN')}</span>
              <span>严谨招聘匹配引擎 · 遵循客观原文依据与合规审查</span>
            </div>
          </div>

          {/* Bottom Action Restart */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onRestart}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新开始或评估新候选人</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              复制交付简报给用人部门
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
