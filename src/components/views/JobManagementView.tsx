import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  RefreshCw,
  Play,
  Settings,
  FileText,
  MapPin,
} from 'lucide-react';
import { OrbitJob, DevTraceLog } from '../../types/orbit';
import { JobDetailView } from './JobDetailView';

interface JobManagementViewProps {
  jobs: OrbitJob[];
  selectedJobId: string;
  onSelectJob: (jobId: string) => void;
  onOpenNewJob: () => void;
  onOpenSyncJob?: () => void;
  onUpdateJob?: (job: OrbitJob) => void;
  onToggleJobLoop?: (jobId: string) => void;
  onOpenLoopSettings?: (job: OrbitJob) => void;
  logs?: DevTraceLog[];
  onClearLogs?: () => void;
  theme?: 'dark' | 'light';
}

export const JobManagementView: React.FC<JobManagementViewProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  onOpenNewJob,
  onOpenSyncJob,
  onUpdateJob,
  onToggleJobLoop,
  onOpenLoopSettings,
  logs = [],
  onClearLogs,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  const [detailJobId, setDetailJobId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'detail' | 'rag' | 'logs'>('detail');

  const inspectingJob = jobs.find((j) => j.id === detailJobId);

  if (inspectingJob) {
    return (
      <JobDetailView
        job={inspectingJob}
        initialTab={detailTab}
        onBack={() => setDetailJobId(null)}
        onSaveJob={(updatedJob) => {
          if (onUpdateJob) onUpdateJob(updatedJob);
        }}
        logs={logs}
        onClearLogs={onClearLogs}
        onToggleJobLoop={onToggleJobLoop}
        onOpenLoopSettings={onOpenLoopSettings}
        theme={theme}
      />
    );
  }

  const runningCount = jobs.filter((j) => j.loopRunning).length;

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-y-auto p-6 select-none transition-colors ${
        isLight ? 'bg-[#f4f6fa] text-slate-800' : 'bg-[#0a0d14] text-slate-100'
      }`}
    >
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">岗位</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-slate-200/80 text-slate-700">
            共 {jobs.length} 个
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{runningCount} 个运行中</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenSyncJob && (
            <button
              onClick={onOpenSyncJob}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200/90 text-xs font-semibold rounded-xl shadow-2xs cursor-pointer transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>同步岗位</span>
            </button>
          )}

          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>新建岗位</span>
          </button>
        </div>
      </div>

      {/* 极简岗位卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
        {jobs.map((job) => {
          const isSelected = job.id === selectedJobId;
          const isLoopRunning = Boolean(job.loopRunning);

          return (
            <div
              key={job.id}
              onClick={() => {
                onSelectJob(job.id);
                setDetailTab('detail');
                setDetailJobId(job.id);
              }}
              className={`rounded-2xl border p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between gap-4 bg-white ${
                isSelected
                  ? 'border-purple-400 shadow-sm ring-1 ring-purple-400/25'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* 第一行：岗位名称 + 缺口（无颜色） + 薪资（无颜色） */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">
                      {job.title}
                    </h3>

                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      缺口 {job.vacancyCount || job.candidateCount}人
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-700 font-mono shrink-0">
                    {job.salaryExpect}
                  </span>
                </div>

                {/* 第二行：精简一行展示地点与用工企业 */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {job.address || '北京'} · {job.employer || '用工单位'}
                  </span>
                </div>
              </div>

              {/* 底部单行：左侧职位详情，右侧「运行中 + 启动/停止」合并为一个按钮 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectJob(job.id);
                    setDetailTab('detail');
                    setDetailJobId(job.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>职位详情</span>
                </button>

                <div className="flex items-center gap-2">
                  {/* 运行中状态与启动/停止操作合并为同一个按钮 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJob(job.id);
                      if (onToggleJobLoop) onToggleJobLoop(job.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
                      isLoopRunning
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title={isLoopRunning ? '当前运行中，点击停止' : '当前已停止，点击启动运行'}
                  >
                    {isLoopRunning ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>运行中 · 停止</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-slate-600" />
                        <span>启动运行</span>
                      </>
                    )}
                  </button>

                  {onOpenLoopSettings && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job.id);
                        onOpenLoopSettings(job);
                      }}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                      title={`配置【${job.title}】下线与定时规则`}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
