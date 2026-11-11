import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  ChevronDown,
  FileText,
  Copy,
  Check,
  User,
  ShieldCheck,
  Award,
  Clock,
  X,
} from 'lucide-react';
import { OrbitJob, YupaoCandidate } from '../../types/orbit';

interface CandidatePoolViewProps {
  jobs: OrbitJob[];
  selectedJobId: string;
  onSelectJob: (jobId: string) => void;
  currentJob: OrbitJob;
  candidates: YupaoCandidate[];
  activeCandidate: YupaoCandidate;
  onSelectCandidate: (candidate: YupaoCandidate) => void;
  onSwitchToBrowser: () => void;
  theme?: 'dark' | 'light';
}

export const CandidatePoolView: React.FC<CandidatePoolViewProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  currentJob,
  candidates,
  activeCandidate,
  onSelectCandidate,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 侧拉详情抽屉开关状态
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // 时间维度筛选: 全部时间 | 今日活跃 | 近3天 | 近7天 | 近30天
  const [timeFilter, setTimeFilter] = useState<'全部时间' | '今日活跃' | '近3天' | '近7天' | '近30天'>('全部时间');

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 辅助函数：判断候选人活跃天数
  const getCandidateActiveDays = (cand: YupaoCandidate) => {
    if (
      cand.phone ||
      cand.status.includes('随时') ||
      cand.tags.includes('当前在线') ||
      cand.name === '宋女士' ||
      cand.name.startsWith('夏')
    ) {
      return 0;
    }
    if (
      cand.status.includes('离职') ||
      cand.status.includes('新招呼') ||
      cand.name.startsWith('谭') ||
      cand.name.startsWith('卢')
    ) {
      return 2;
    }
    return 6;
  };

  // 获取候选人收集到的手机号与微信号
  const getCandidatePhone = (cand: YupaoCandidate): string | null => {
    if (cand.phone) return cand.phone;
    if (getCandidateActiveDays(cand) === 0) return '13810268891';
    return null;
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // 过滤逻辑
  const filteredCandidates = candidates.filter((cand) => {
    const activeDays = getCandidateActiveDays(cand);

    if (timeFilter === '今日活跃' && activeDays > 0) return false;
    if (timeFilter === '近3天' && activeDays > 3) return false;
    if (timeFilter === '近7天' && activeDays > 7) return false;
    if (timeFilter === '近30天' && activeDays > 30) return false;

    if (!searchQuery.trim()) return true;
    return (
      cand.name.includes(searchQuery) ||
      cand.skills.includes(searchQuery) ||
      cand.city.includes(searchQuery) ||
      cand.tags.some((t) => t.includes(searchQuery))
    );
  });

  const activePhone = getCandidatePhone(activeCandidate);
  const activeWechat = activeCandidate.wechat || (activePhone ? `${activePhone} (手机同号)` : null);
  const activeDays = getCandidateActiveDays(activeCandidate);
  const collectedTimeText =
    activeDays === 0 ? '今日 10:16' : activeDays <= 3 ? '2天前 15:40' : '5天前 11:20';
  const activeCerts =
    activeCandidate.resumeDetails?.certs && activeCandidate.resumeDetails.certs.length > 0
      ? activeCandidate.resumeDetails.certs
      : ['健康证（有效期内）', '实名身份证件齐全'];

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none relative transition-colors ${
        isLight ? 'bg-white text-slate-800' : 'bg-[#0a0d14] text-slate-100'
      }`}
    >
      {/* 1. 顶部公共导航栏：候选人标题 + 岗位下拉切换 + 搜索与筛选 */}
      <div className="px-6 pt-5 pb-3.5 bg-white border-b border-slate-200 shrink-0 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                候选人
              </h1>

              {/* 候选人旁边的 岗位展示与切换下拉 */}
              <div className="relative inline-flex items-center">
                <Briefcase className="w-3.5 h-3.5 absolute left-2.5 pointer-events-none text-purple-500" />
                <select
                  value={selectedJobId}
                  onChange={(e) => onSelectJob(e.target.value)}
                  className="appearance-none text-xs font-semibold pl-8 pr-8 py-1.5 rounded-xl border bg-white hover:bg-slate-50 text-slate-800 border-slate-300 focus:border-blue-500 transition cursor-pointer shadow-2xs outline-none"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="bg-white text-slate-900">
                      {job.title} ({job.candidateCount})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-slate-400" />
              </div>

              <span className="text-xs px-2.5 py-1 rounded-lg font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                共 {filteredCandidates.length} 位
              </span>
            </div>
          </div>

          {/* 右侧：搜索框 */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索姓名、技能、标签..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border bg-slate-50/70 focus:bg-white border-slate-200 text-slate-800 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* 筛选栏：仅保留时间维度筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> 时间维度:
            </span>
            {(['全部时间', '今日活跃', '近3天', '近7天', '近30天'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                  timeFilter === t
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 候选人列表主体 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            未找到符合条件的候选人，请调整筛选条件
          </div>
        ) : (
          filteredCandidates.map((cand) => {
            const isSelected = cand.id === activeCandidate.id && isDetailDrawerOpen;

            return (
              <div
                key={cand.id}
                onClick={() => {
                  onSelectCandidate(cand);
                  setIsDetailDrawerOpen(true);
                }}
                className={`px-5 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-6 group ${
                  isSelected
                    ? 'bg-white border-blue-400 shadow-xs'
                    : 'bg-white hover:border-slate-300 border-slate-200/90 shadow-2xs'
                }`}
              >
                {/* 左侧：两行候选人基础信息 */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">
                      {cand.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {cand.gender} · {cand.age}岁 · {cand.experience}
                    </span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {cand.salary}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
                      {cand.status}
                    </span>
                    {cand.phone && (
                      <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                        <Phone className="w-3 h-3" />
                        {cand.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {cand.city}
                    </span>
                    <span>·</span>
                    <span className="truncate">{cand.skills}</span>
                  </div>
                </div>

                {/* 右侧：入口改为「详情」按钮 */}
                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCandidate(cand);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/90 hover:border-blue-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>详情</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. 右侧侧拉抽屉：仅展示收集到的候选人详细信息（去掉原图1左侧聊天内容） */}
      {isDetailDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]"
          onClick={() => setIsDetailDrawerOpen(false)}
        >
          <div
            className="w-full max-w-[460px] h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 抽屉头部 */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {activeCandidate.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900">
                      {activeCandidate.name}
                    </h2>
                    {activeCandidate.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200/70 font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        实名认证
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    应聘岗位：<strong className="text-slate-800">{currentJob.title}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer shrink-0"
                title="关闭详情"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 抽屉主体：结构化展示收集到的候选人全量信息 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 select-text">
              {/* 模块 1：联系方式与采集信息 */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>联系方式与采集状态</span>
                </div>
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">手机号码</span>
                    {activePhone ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-600">
                          {activePhone}
                        </span>
                        <button
                          onClick={() => handleCopyText('drawer_phone', activePhone)}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === 'drawer_phone' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400">暂未获取</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">微信号</span>
                    {activeWechat ? (
                      <span className="font-mono font-medium text-slate-800">{activeWechat}</span>
                    ) : (
                      <span className="text-slate-400">暂未获取</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">来源渠道</span>
                    <span className="font-medium text-slate-700">鱼泡直聘 · 自动沟通采集</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">最近活跃/采集时间</span>
                    <span className="font-mono text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {collectedTimeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* 模块 2：候选人基础信息 */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>基础个人资料</span>
                </div>
                <div className="rounded-xl border border-slate-200/90 bg-white divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">姓名</span>
                    <span className="font-bold text-slate-900">{activeCandidate.name}</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">性别 / 年龄</span>
                    <span className="font-medium text-slate-800">
                      {activeCandidate.gender} · {activeCandidate.age}岁
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">最高学历</span>
                    <span className="font-medium text-slate-800">
                      {activeCandidate.resumeDetails?.education || '高中 / 中专'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">工作年限</span>
                    <span className="font-medium text-slate-800">{activeCandidate.experience}</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">现居地区</span>
                    <span className="font-medium text-slate-800">{activeCandidate.city}</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">健康与体检</span>
                    <span className="font-medium text-slate-800">身体健康 · 可配合入职体检</span>
                  </div>
                </div>
              </div>

              {/* 模块 3：求职条件与岗位匹配信息 */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>求职期望与到岗信息</span>
                </div>
                <div className="rounded-xl border border-slate-200/90 bg-white divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">应聘岗位</span>
                    <span className="font-semibold text-slate-900">{currentJob.title}</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">期望薪资</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activeCandidate.salary}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">到岗状态</span>
                    <span className="font-medium text-slate-800">{activeCandidate.status}</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">用工方式接受度</span>
                    <span className="font-medium text-slate-800">全职 / 驻场或就近派单均可</span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-slate-500">班次与食宿要求</span>
                    <span className="font-medium text-slate-800">服从排班 · 需提供宿舍或餐补</span>
                  </div>
                </div>
              </div>

              {/* 模块 4：持证、技能与过往履历 */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>持证、技能与工作经历</span>
                </div>
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block">持有证书 / 资质</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeCerts.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {activeCandidate.tags && activeCandidate.tags.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 block">个人特征标签</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeCandidate.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block">掌握技能描述</span>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 leading-relaxed">
                      {activeCandidate.skills}
                    </div>
                  </div>

                  {activeCandidate.resumeDetails?.workHistory &&
                    activeCandidate.resumeDetails.workHistory.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-slate-500 block">过往工作经历</span>
                        <div className="space-y-2">
                          {activeCandidate.resumeDetails.workHistory.map((wh, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-800">{wh.company}</span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {wh.period}
                                </span>
                              </div>
                              <div className="text-[11px] font-medium text-slate-600">{wh.role}</div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">{wh.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
