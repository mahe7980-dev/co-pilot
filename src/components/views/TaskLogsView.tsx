import React, { useState } from 'react';
import {
  FileText,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  Filter,
  Code2,
  Briefcase
} from 'lucide-react';
import { DevTraceLog, OrbitJob } from '../../types/orbit';

interface TaskLogsViewProps {
  logs: DevTraceLog[];
  jobs?: OrbitJob[];
  onClearLogs?: () => void;
  onOpenDevModal?: () => void;
  theme?: 'dark' | 'light';
}

export const TaskLogsView: React.FC<TaskLogsViewProps> = ({
  logs,
  jobs = [],
  onClearLogs,
  onOpenDevModal,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const [filterType, setFilterType] = useState<string>('ALL');
  // 核心需求 6: 执行日志跟岗位绑定
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');

  // 双重过滤：类型 + 岗位
  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesJob =
      selectedJobId === 'ALL' ||
      log.jobId === selectedJobId ||
      (log.jobTitle && jobs.find((j) => j.id === selectedJobId)?.title === log.jobTitle);
    return matchesType && matchesJob;
  });

  const handleExport = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.type}] [岗位: ${l.jobTitle || '全局'}] ${l.message} | ${l.detail || ''}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_recruitment_trace_${selectedJobId}_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden p-6 select-none transition-colors ${
        isLight ? 'bg-[#f4f6fa] text-slate-800' : 'bg-[#0a0d14] text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">任务运行日志</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
                isLight ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300'
              }`}
            >
              {filteredLogs.length} 条记录 (岗位绑定)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            实时捕获各岗位 RPA DOM 交互、P3标准初筛、个性化破冰打招呼与意向微聊跟进流水
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          {(['ALL', 'DOM', 'AI', 'HOOK', 'RULE', 'NET'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  : 'bg-[#141926] text-slate-400 hover:bg-[#1c2234] border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={handleExport}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-[#181d2a] hover:bg-[#22293b] border-[#293246] text-slate-300'
            }`}
            title="导出当前筛选日志"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onOpenDevModal && (
            <button
              onClick={onOpenDevModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer shadow-xs transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>开发插槽配置</span>
            </button>
          )}
        </div>
      </div>

      {/* 核心需求 6: 岗位绑定筛选栏 */}
      <div className="py-2.5 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>绑定岗位：</span>
          </span>

          <button
            onClick={() => setSelectedJobId('ALL')}
            className={`px-2.5 py-1 rounded-lg border transition cursor-pointer shrink-0 font-medium ${
              selectedJobId === 'ALL'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                : isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-[#151a28] hover:bg-[#1e253a] border-slate-800 text-slate-300'
            }`}
          >
            全部岗位日志
          </button>

          {jobs.map((job) => {
            const isCur = selectedJobId === job.id;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer shrink-0 flex items-center gap-1 ${
                  isCur
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                    : isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                    : 'bg-[#151a28] hover:bg-[#1e253a] border-slate-800 text-slate-300'
                }`}
              >
                <span>{job.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Log Console */}
      <div
        className={`flex-1 overflow-y-auto mt-1 rounded-2xl border p-4 font-mono text-xs space-y-2 transition-colors ${
          isLight
            ? 'bg-slate-900 text-slate-200 border-slate-800'
            : 'bg-[#06080e] text-slate-300 border-[#1a1f2e]'
        }`}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            暂无匹配岗位与类型的日志记录
          </div>
        ) : (
          filteredLogs.map((log) => {
            const badgeColor =
              log.type === 'DOM'
                ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800'
                : log.type === 'AI'
                ? 'text-purple-400 bg-purple-950/60 border-purple-800'
                : log.type === 'HOOK'
                ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                : log.type === 'NET'
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                : 'text-blue-400 bg-blue-950/60 border-blue-800';

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition"
              >
                <span className="text-slate-500 shrink-0 select-none">
                  {log.timestamp}
                </span>

                <span
                  className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${badgeColor}`}
                >
                  {log.type}
                </span>

                {/* 岗位绑定标签 */}
                {log.jobTitle && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 shrink-0">
                    {log.jobTitle}
                  </span>
                )}

                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="text-slate-200 leading-relaxed break-all">
                    {log.message}
                  </div>
                  {log.detail && (
                    <div className="text-[11px] text-slate-400 opacity-80 leading-snug break-all">
                      ↳ {log.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
