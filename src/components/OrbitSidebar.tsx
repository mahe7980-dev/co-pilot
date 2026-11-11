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
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  return (
    <aside
      className={`w-64 sm:w-72 flex flex-col select-none shrink-0 h-full transition-colors duration-200 border-r ${
        isLight
          ? 'bg-[#f3f4f8] text-slate-700 border-[#dce0ea]'
          : 'bg-[#0e1118] text-slate-300 border-[#1e2333]'
      }`}
    >
      {/* Main Content Area: 仅展示岗位列表（视图切换已移至顶部导航） */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-slate-400">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              岗位列表 ({jobs.length})
            </span>
            <button
              onClick={onOpenNewJob}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition cursor-pointer border ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-transparent hover:border-slate-300'
                  : 'text-slate-400 hover:text-white hover:bg-[#1f2537] border-transparent hover:border-[#272e44]'
              }`}
              title="新建岗位 (⌘ K)"
            >
              <Plus className="w-3 h-3 text-purple-500" />
              <span>新建</span>
            </button>
          </div>

          <div className="space-y-1">
            {jobs.map((job) => {
              const isActive = job.id === selectedJobId;
              const isLoopRunning = Boolean(job.loopRunning);
              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job.id)}
                  className={`w-full px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? isLight
                        ? 'bg-white border border-purple-400/60 text-slate-900 shadow-xs'
                        : 'bg-[#1b2030] border border-purple-500/40 text-white shadow-xs'
                      : isLight
                      ? 'hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 border border-transparent'
                      : 'hover:bg-[#141824] text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {/* 左侧：点击切换当前岗位内容 */}
                  <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-1.5">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isLoopRunning
                          ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.75)]'
                          : isActive
                          ? 'bg-purple-500'
                          : 'bg-slate-300 group-hover:bg-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isActive
                              ? isLight
                                ? 'text-slate-900'
                                : 'text-white'
                              : isLight
                              ? 'text-slate-700'
                              : 'text-slate-300'
                          }`}
                        >
                          {job.title}
                        </span>

                        {isLoopRunning && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                            运行中
                          </span>
                        )}

                        <span className="text-[10px] font-mono px-1 py-0.2 rounded font-medium shrink-0 bg-slate-200/60 text-slate-500">
                          缺口 {job.vacancyCount || job.candidateCount}人
                        </span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
                        ? 'text-blue-600 bg-blue-50/80 border-blue-200/70 hover:bg-blue-100 hover:border-blue-300 opacity-100'
                        : 'text-slate-500 border-transparent hover:text-blue-600 hover:bg-white hover:border-slate-200 opacity-75 group-hover:opacity-100'
                    }`}
                    title={`查看【${job.title}】职位详情、知识库与日志`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
