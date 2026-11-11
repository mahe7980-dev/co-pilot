import React, { useState } from 'react';
import { Sparkles, ShieldAlert, ShieldCheck, Plus, Trash2, ArrowRight, Code, BookOpen, Layers } from 'lucide-react';
import { Criterion, JobParsed } from '../types';

interface Stage1JobParserProps {
  jobTitle: string;
  onJobTitleChange: (title: string) => void;
  rawJd: string;
  onRawJdChange: (jd: string) => void;
  parsedJob: JobParsed | null;
  onParsedJobChange: (parsed: JobParsed) => void;
  onNext: () => void;
  onViewJson: (title: string, data: any) => void;
  isLoading: boolean;
  onParse: () => Promise<void>;
}

export const Stage1JobParser: React.FC<Stage1JobParserProps> = ({
  jobTitle,
  onJobTitleChange,
  rawJd,
  onRawJdChange,
  parsedJob,
  onParsedJobChange,
  onNext,
  onViewJson,
  isLoading,
  onParse,
}) => {
  const [newCriterionDesc, setNewCriterionDesc] = useState('');
  const [newCriterionPriority, setNewCriterionPriority] = useState<'must' | 'exclude' | 'plus'>('must');
  const [newCriterionField, setNewCriterionField] = useState('技能');

  const handleAddCriterion = () => {
    if (!newCriterionDesc.trim() || !parsedJob) return;
    const updatedCriteria: Criterion[] = [
      ...parsedJob.criteria,
      {
        id: `c_${Date.now()}`,
        priority: newCriterionPriority,
        description: newCriterionDesc.trim(),
        field: newCriterionField,
      },
    ];
    onParsedJobChange({ ...parsedJob, criteria: updatedCriteria });
    setNewCriterionDesc('');
  };

  const handleRemoveCriterion = (id: string) => {
    if (!parsedJob) return;
    const updated = parsedJob.criteria.filter((c) => c.id !== id);
    onParsedJobChange({ ...parsedJob, criteria: updated });
  };

  const handleFaqChange = (key: keyof JobParsed['faq_extract'], value: string) => {
    if (!parsedJob) return;
    onParsedJobChange({
      ...parsedJob,
      faq_extract: {
        ...parsedJob.faq_extract,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Stage Header Info Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold font-mono">
              P1 核心任务
            </span>
            <h2 className="text-base font-bold text-slate-900">岗位标准结构化解析 & 合规拦截引擎</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            由【招聘匹配专家】执行：自动区分 <span className="font-semibold text-rose-700">must (必须项)</span>、
            <span className="font-semibold text-purple-700">exclude (排他项)</span>、
            <span className="font-semibold text-emerald-700">plus (加分项)</span>，自动剔除歧视性条款，提炼岗位知识库。
          </p>
        </div>
        {parsedJob && (
          <button
            onClick={() => onViewJson('P1 岗位标准解析 JSON 格式', parsedJob)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-xs transition shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <span>查看输出 JSON</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw JD Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              原始岗位需求录入
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                岗位名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => onJobTitleChange(e.target.value)}
                placeholder="例如：高级压力容器特种焊接技师"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  原始 JD 文本 <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">支持包含合规测试条款</span>
              </div>
              <textarea
                rows={14}
                value={rawJd}
                onChange={(e) => onRawJdChange(e.target.value)}
                placeholder="粘贴包含职责与任职资格的完整 JD..."
                className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={onParse}
              disabled={isLoading || !jobTitle.trim() || !rawJd.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'AI 专家正在解析标准与扫描合规...' : '启动 P1 结构化解析'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Parsed Criteria, Compliance, and Knowledge Base */}
        <div className="lg:col-span-7 space-y-5">
          {!parsedJob ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">尚未执行解析</p>
              <p className="text-xs mt-1">点击左侧“启动 P1 结构化解析”按钮，AI 招聘匹配专家将自动拆解标准清单</p>
            </div>
          ) : (
            <>
              {/* Compliance Audit Banner */}
              {parsedJob.compliance_audit && (
                <div
                  className={`p-4 rounded-2xl border ${
                    parsedJob.compliance_audit.has_discriminatory_terms
                      ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                      : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {parsedJob.compliance_audit.has_discriminatory_terms ? (
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">
                          {parsedJob.compliance_audit.has_discriminatory_terms
                            ? '合规拦截中心：检测并拦截潜在歧视性条款'
                            : '合规审计结果：未发现歧视性限制'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-white/80 border border-slate-200">
                          宪法铁律：禁止非能力歧视
                        </span>
                      </div>
                      <p className="text-slate-700">{parsedJob.compliance_audit.action_note}</p>
                      {parsedJob.compliance_audit.intercepted_terms?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-amber-900">已自动屏蔽/降权条款:</span>
                          {parsedJob.compliance_audit.intercepted_terms.map((term, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded font-mono text-[11px] line-through"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Criteria List Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      结构化匹配标准清单 ({parsedJob.criteria.length} 项)
                    </h3>
                    <p className="text-xs text-slate-500">具体、客观、可从简历原文直接判定的核验项</p>
                  </div>
                </div>

                {/* Criteria Items Table */}
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {parsedJob.criteria.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white hover:bg-slate-50/80 transition flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="font-mono text-slate-400 text-[11px] mt-0.5">{item.id}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                item.priority === 'must'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : item.priority === 'exclude'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {item.priority === 'must'
                                ? 'must 必须项'
                                : item.priority === 'exclude'
                                ? 'exclude 排他项'
                                : 'plus 加分项'}
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                              {item.field}
                            </span>
                          </div>
                          <p className="text-slate-800 leading-snug">{item.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveCriterion(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="删除该标准"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Criterion Bar */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-700 block">补充自定义核验标准:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={newCriterionPriority}
                      onChange={(e) => setNewCriterionPriority(e.target.value as any)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                    >
                      <option value="must">must (必须项)</option>
                      <option value="plus">plus (加分项)</option>
                      <option value="exclude">exclude (排他项)</option>
                    </select>
                    <select
                      value={newCriterionField}
                      onChange={(e) => setNewCriterionField(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none"
                    >
                      <option value="证书">证书</option>
                      <option value="经验">经验</option>
                      <option value="技能">技能</option>
                      <option value="年限">年限</option>
                    </select>
                    <input
                      type="text"
                      placeholder="标准描述，如：具备高空作业证..."
                      value={newCriterionDesc}
                      onChange={(e) => setNewCriterionDesc(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddCriterion}
                      disabled={!newCriterionDesc.trim()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Extracted FAQ & Knowledge Base Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    岗位知识库基准 (供对话 Agent 严格回答使用)
                  </h3>
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    严禁超限承诺
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1 font-medium">💰 薪资范围</span>
                    <input
                      type="text"
                      value={parsedJob.faq_extract.salary_range}
                      onChange={(e) => handleFaqChange('salary_range', e.target.value)}
                      className="w-full bg-white px-2 py-1 border border-slate-300 rounded font-medium text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1 font-medium">📍 工作地点</span>
                    <input
                      type="text"
                      value={parsedJob.faq_extract.work_location}
                      onChange={(e) => handleFaqChange('work_location', e.target.value)}
                      className="w-full bg-white px-2 py-1 border border-slate-300 rounded font-medium text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1 font-medium">🎁 福利待遇</span>
                    <input
                      type="text"
                      value={parsedJob.faq_extract.benefits || '五险一金、带薪年假'}
                      onChange={(e) => handleFaqChange('benefits', e.target.value)}
                      className="w-full bg-white px-2 py-1 border border-slate-300 rounded font-medium text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1 font-medium">⏰ 工时班次</span>
                    <input
                      type="text"
                      value={parsedJob.faq_extract.work_hours || '标准工时制'}
                      onChange={(e) => handleFaqChange('work_hours', e.target.value)}
                      className="w-full bg-white px-2 py-1 border border-slate-300 rounded font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button to Next Step */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>确认标准，进入阶段二：在线简历初筛 (P3)</span>
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
