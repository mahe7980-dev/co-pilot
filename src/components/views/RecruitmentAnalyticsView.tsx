import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  MapPin,
  Building2,
  ChevronDown
} from 'lucide-react';
import { OrbitJob } from '../../types/orbit';

interface RecruitmentAnalyticsViewProps {
  jobs: OrbitJob[];
  searchedCount: number;
  communicatedCount: number;
  contactsCapturedCount: number;
  theme?: 'dark' | 'light';
}

export const RecruitmentAnalyticsView: React.FC<RecruitmentAnalyticsViewProps> = ({
  jobs,
  searchedCount,
  communicatedCount,
  contactsCapturedCount,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 当前选中的职位 (挂钩在职位)
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  // 时间维度筛选
  const [timeRange, setTimeRange] = useState<'today' | '3days' | '7days' | '30days'>('today');

  const activeJob = jobs.find((j) => j.id === selectedJobId);

  // 计算所选岗位的动态数据比例
  const multiplier = timeRange === 'today' ? 1 : timeRange === '3days' ? 2.6 : timeRange === '7days' ? 5.8 : 22.4;

  const jobVacancy = activeJob?.vacancyCount || activeJob?.candidateCount || 20;

  // 岗位挂钩数据生成
  const getJobMetrics = () => {
    if (selectedJobId === 'all') {
      return {
        searched: Math.round(searchedCount * multiplier),
        screened: Math.round(searchedCount * 0.72 * multiplier),
        greeted: Math.round(searchedCount * 0.48 * multiplier),
        communicated: Math.round(communicatedCount * multiplier),
        contacts: Math.round(contactsCapturedCount * multiplier),
        onboarded: Math.round(contactsCapturedCount * 0.42 * multiplier),
        highIntent: 62,
        midIntent: 28,
        lowIntent: 10,
      };
    }

    // 单岗位根据岗位特点差异化分布
    const baseScale = (activeJob?.candidateCount || 20) / 10;
    return {
      searched: Math.round(28 * baseScale * multiplier),
      screened: Math.round(20 * baseScale * multiplier),
      greeted: Math.round(14 * baseScale * multiplier),
      communicated: Math.round(8 * baseScale * multiplier),
      contacts: Math.round(4 * baseScale * multiplier),
      onboarded: Math.round(2 * baseScale * multiplier),
      highIntent: activeJob?.id === 'welder' ? 70 : activeJob?.id === 'cleaner' ? 65 : 55,
      midIntent: 30,
      lowIntent: 15,
    };
  };

  const metrics = getJobMetrics();

  // 6 级精准漏斗数据 (挂钩所选职位)
  const funnelStages = [
    {
      label: '1. 鱼泡牛人曝光与检索',
      count: metrics.searched,
      rate: '100%',
      desc: '按岗位特征与技能要求精准定向拉取',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: '2. P3 简历客观初筛达标',
      count: metrics.screened,
      rate: `${((metrics.screened / metrics.searched) * 100).toFixed(1)}%`,
      desc: '特种证件/健康证/年龄从业经验原文证据核验',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      label: '3. P6 个性化破冰发送打招呼',
      count: metrics.greeted,
      rate: `${((metrics.greeted / metrics.screened) * 100).toFixed(1)}%`,
      desc: '融入候选人履历亮点撰写 40~90 字高转化打招呼',
      color: 'from-indigo-600 to-violet-600',
    },
    {
      label: '4. P7 微聊会话建立与意向解析',
      count: metrics.communicated,
      rate: `${((metrics.communicated / metrics.greeted) * 100).toFixed(1)}%`,
      desc: '基于知识库 RAG 解答食宿薪资并确认求职意向',
      color: 'from-violet-600 to-purple-600',
    },
    {
      label: '5. 获取联系方式 (手机/微信)',
      count: metrics.contacts,
      rate: `${((metrics.contacts / metrics.communicated) * 100).toFixed(1)}%`,
      desc: '自动提取并无缝写入内部人才库与交付名单',
      color: 'from-purple-600 to-emerald-600',
    },
    {
      label: '6. 面试邀约与现场试岗达成',
      count: metrics.onboarded,
      rate: `${((metrics.onboarded / metrics.contacts) * 100).toFixed(1)}%`,
      desc: '生成交付总结卡，用工主管完成试工录用',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const completionRate = Math.min(100, Math.round((metrics.contacts / jobVacancy) * 100));

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-y-auto p-6 select-none transition-colors ${
        isLight ? 'bg-white text-slate-800' : 'bg-[#0a0d14] text-slate-100'
      }`}
    >
      {/* 头部标题与时间筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">招聘数据大盘</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
                isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              职位挂钩分析 · 漏斗转化
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            按职位多维度深度透视全链路招聘转化漏斗、意向分布与缺口达成率
          </p>
        </div>

        {/* 时间维度切换 */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121624] text-xs font-semibold">
          {[
            { id: 'today', label: '今日' },
            { id: '3days', label: '近3天' },
            { id: '7days', label: '近7天' },
            { id: '30days', label: '近30天' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeRange === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 核心需求 4: 招聘数据挂钩在职位 (职位选择 Tab 栏) */}
      <div className="pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>挂钩职位：</span>
          </span>

          <button
            onClick={() => setSelectedJobId('all')}
            className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 font-semibold ${
              selectedJobId === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-[#141a2a] hover:bg-[#1c243a] border-slate-800 text-slate-300'
            }`}
          >
            全部职位 (全景汇总)
          </button>

          {jobs.map((job) => {
            const isCur = selectedJobId === job.id;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isCur
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                    : isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-[#141a2a] hover:bg-[#1c243a] border-slate-800 text-slate-300'
                }`}
              >
                <span>{job.title}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  isCur ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  缺口{job.vacancyCount || job.candidateCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 当前职位专属横幅 (若选中具体岗位) */}
      {activeJob && (
        <div className="mb-4 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              【{activeJob.title}】
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              {activeJob.salaryExpect}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {activeJob.address || '北京产业基地'} · {activeJob.employer || '中科智聘'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-slate-500">
              招聘缺口: <strong className="text-slate-900 dark:text-white font-mono">{activeJob.vacancyCount || activeJob.candidateCount}</strong> 人
            </div>
            <div className="text-slate-500">
              已获联系方式: <strong className="text-emerald-600 font-mono">{metrics.contacts}</strong> 人
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">达成进度:</span>
              <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="font-mono text-emerald-600 font-bold">{completionRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 大核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>浏览/搜索曝光量</span>
            <span className="text-emerald-500 flex items-center text-[11px] font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
          </div>
          <div className="text-2xl font-black font-mono mt-2 text-slate-900 dark:text-white">
            {metrics.searched}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {selectedJobId === 'all' ? '全部岗位汇总池' : `${activeJob?.title} 专属筛选`}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>在线沟通与微聊</span>
            <span className="text-blue-500 flex items-center text-[11px] font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +26.0%
            </span>
          </div>
          <div className="text-2xl font-black font-mono mt-2 text-[#008aff]">
            {metrics.communicated}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">知识库 RAG 辅助问答转化</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>获取联系方式 (手机/微信)</span>
            <span className="text-emerald-500 flex items-center text-[11px] font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +35.2%
            </span>
          </div>
          <div className="text-2xl font-black font-mono mt-2 text-emerald-500">
            {metrics.contacts}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">自动核实且意向明确</div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>试岗达成 / 交付率</span>
            <span className="text-purple-500 text-[11px] font-bold font-mono">
              {completionRate}%
            </span>
          </div>
          <div className="text-2xl font-black font-mono mt-2 text-purple-500">
            {metrics.onboarded} 人
          </div>
          <div className="text-[11px] text-slate-400 mt-1">已下发工单录用安排</div>
        </div>
      </div>

      {/* 核心需求 4: 职位专属全链路招聘漏斗数据 (Funnel Data) */}
      <div
        className={`mt-6 p-6 rounded-2xl border shadow-xs ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>【{selectedJobId === 'all' ? '全部职位' : activeJob?.title}】全链路招聘转化漏斗</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md font-mono">
                漏斗层级 6 步
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              监控从曝光、初筛、打招呼、微聊问答到联系方式留存各阶段留存率
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            总转化率: <strong className="text-emerald-600">{((metrics.contacts / metrics.searched) * 100).toFixed(1)}%</strong>
          </div>
        </div>

        {/* 漏斗各层级展示 */}
        <div className="space-y-4">
          {funnelStages.map((stage, idx) => {
            const widthPct = Math.max(16, 100 - idx * 15);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {stage.label}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      ({stage.desc})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[11px]">阶段转化: <strong className="text-slate-700 dark:text-slate-300">{stage.rate}</strong></span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs">
                      {stage.count} 人
                    </span>
                  </div>
                </div>

                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${stage.color} transition-all duration-500 shadow-xs`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 意向分布高中低占比 (与候选人意向高中低标识精准呼应) */}
      <div
        className={`mt-4 p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#10141f] border-slate-800'
        }`}
      >
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
          候选人求职意向分布 (高中低意向)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold">
              <span>高意向 (随时到岗)</span>
              <span className="font-mono text-sm font-bold">{metrics.highIntent}%</span>
            </div>
            <p className="text-[11px] text-emerald-600/80 mt-1">证书齐备、薪资与距离高度认可</p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
            <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 font-semibold">
              <span>中意向 (核实食宿中)</span>
              <span className="font-mono text-sm font-bold">{metrics.midIntent}%</span>
            </div>
            <p className="text-[11px] text-blue-600/80 mt-1">看新机会，对排班和宿舍提出具体询问</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
              <span>低意向 (暂缓入职)</span>
              <span className="font-mono text-sm font-bold">{metrics.lowIntent}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">已在职或期望薪资超出工单预算</p>
          </div>
        </div>
      </div>
    </div>
  );
};
