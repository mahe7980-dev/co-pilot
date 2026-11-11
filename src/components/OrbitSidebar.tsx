import React from 'react';
import {
  Plus,
  FileText,
} from 'lucide-react';
import { OrbitJob } from '../types/orbit';

interface OrbitSidebarProps {
  jobs: OrbitJob[];
  selectedJobId: string;
  onSelectJob: (jobId: string) => void;
  onOpenJobDetail?: (job: OrbitJob) => void;
  onOpenNewJob: () => void;
  onOpenSyncJob?: () => void;
  theme?: 'dark' | 'light';
}

export const OrbitSidebar: React.FC<OrbitSidebarProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  onOpenJobDetail,
  onOpenNewJob,
}) => {
  return (
    <aside className="w-64 sm:w-72 flex flex-col select-none shrink-0 h-full bg-white rounded-lg shadow-[0_1px_6px_rgba(15,23,42,0.03)] border border-white/90 overflow-hidden">
      {/* 顶部标题栏（仿飞书会话列表头部） */}
      <div className="px-3.5 pt-3 pb-2 flex items-center justify-between shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            岗位列表
          </span>
          <span className="text-xs font-mono text-slate-400">
            ({jobs.length})
          </span>
        </div>

        <button
          onClick={onOpenNewJob}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
          title="新建岗位 (⌘ K)"
        >
          <Plus className="w-3.5 h-3.5 text-purple-600" />
          <span>新建</span>
        </button>
      </div>

      {/* 岗位列表主体 */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-1">
        {jobs.map((job) => {
          const isActive = job.id === selectedJobId;
          const isLoopRunning = Boolean(job.loopRunning);
          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className={`w-full px-2.5 py-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between group ${
                isActive
                  ? 'bg-[#e8f0fe]/90 text-slate-900'
                  : 'hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              {/* 左侧：点击切换当前岗位内容 */}
              <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-1.5">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors ${
                    isLoopRunning
                      ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.75)]'
                      : isActive
                      ? 'bg-blue-600'
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-slate-900' : 'text-slate-800'
                      }`}
                    >
                      {job.title}
                    </span>

                    {isLoopRunning && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                        运行中
                      </span>
                    )}

                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-medium shrink-0 bg-slate-200/60 text-slate-500">
                      缺口 {job.vacancyCount || job.candidateCount}人
                    </span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5 text-slate-500">
                    {job.address || '北京'} · {job.employer || '用工单位'}
                  </p>
                </div>
              </div>

              {/* 右侧：详情图标按钮，点击打开职位详情抽屉 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenJobDetail?.(job);
                }}
                className={`p-1.5 rounded-lg shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'text-blue-600 bg-white border-blue-200/70 hover:bg-blue-50 opacity-100 shadow-2xs'
                    : 'text-slate-400 border-transparent hover:text-blue-600 hover:bg-white hover:border-slate-200 opacity-75 group-hover:opacity-100'
                }`}
                title={`查看【${job.title}】职位详情、知识库与日志`}
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
