import React, { useState } from 'react';
import {
  Power,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  Pause,
  Timer,
  Check,
  Target
} from 'lucide-react';
import { LoopOfflineConfig } from '../types/orbit';

interface LoopOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoopOfflineConfig;
  onUpdateConfig: (newConfig: LoopOfflineConfig) => void;
  isRunning: boolean;
  onTogglePlayPause: () => void;
  onImmediateOffline: () => void;
  onImmediateOnline: () => void;
  currentJobTitle: string;
  theme?: 'dark' | 'light';
}

export const LoopOfflineModal: React.FC<LoopOfflineModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  isRunning,
  onTogglePlayPause,
  onImmediateOffline,
  onImmediateOnline,
  currentJobTitle,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 本地配置暂存
  const [localConfig, setLocalConfig] = useState<LoopOfflineConfig>(config);

  if (!isOpen) return null;

  const handleSave = () => {
    // 如果启用了定时且为时长模式，重新校准 targetTimestamp
    let updated = { ...localConfig };
    if (updated.scheduledOfflineEnabled) {
      if (updated.offlineType === 'duration') {
        updated.targetTimestamp = Date.now() + updated.durationMinutes * 60 * 1000;
      }
    }
    onUpdateConfig(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-all duration-200 animate-in zoom-in-95 ${
          isLight
            ? 'bg-white text-slate-800 border-slate-200'
            : 'bg-[#121624] text-slate-100 border-[#222a3e]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isLight ? 'bg-slate-50/80 border-slate-100' : 'bg-[#151b2e] border-[#222a3e]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Loop 执行与下线设置
            </h3>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition text-slate-400 hover:text-slate-600 ${
              isLight ? 'hover:bg-slate-200/50' : 'hover:bg-[#1f263a]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* 1. 当前 Loop 状态卡片 */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              config.isOffline
                ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700'
                : isRunning
                ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  config.isOffline
                    ? 'bg-slate-400'
                    : isRunning
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {config.isOffline ? 'Loop 当前已下线 (OFFLINE)' : isRunning ? 'Loop 自动化执行中 (ONLINE)' : 'Loop 已暂停'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  当前绑定岗位：【{currentJobTitle}】
                </p>
              </div>
            </div>

            {config.isOffline ? (
              <button
                onClick={() => {
                  onImmediateOnline();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>立即上线</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onImmediateOffline();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Power className="w-3 h-3" />
                <span>立即下线</span>
              </button>
            )}
          </div>

          {/* 2. 定时下线开关 */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  开启定时下线功能
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  设定目标时长、到达指定时刻或配额达成后，Loop 自动安全下线并停止打招呼
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.scheduledOfflineEnabled}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      scheduledOfflineEnabled: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* 定时下线模式配置 */}
            {localConfig.scheduledOfflineEnabled && (
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in">
                {/* 选项模式切换 */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'duration', label: '倒计时下线', icon: Timer },
                    { id: 'time', label: '指定时刻', icon: Clock },
                    { id: 'quota', label: '满量下线', icon: Target },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = localConfig.offlineType === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            offlineType: m.id as any,
                          }))
                        }
                        className={`p-2 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          isSel
                            ? 'bg-white dark:bg-[#1a2236] border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                            : 'border-transparent text-slate-500 hover:bg-white/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 模式 1: 倒计时下线 */}
                {localConfig.offlineType === 'duration' && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      选择下线倒计时：
                    </span>
                    <div className="flex gap-2">
                      {[15, 30, 60, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() =>
                            setLocalConfig((prev) => ({
                              ...prev,
                              durationMinutes: mins,
                            }))
                          }
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold transition cursor-pointer ${
                            localConfig.durationMinutes === mins
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {mins >= 60 ? `${mins / 60}小时` : `${mins}分钟`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 模式 2: 指定时刻下线 */}
                {localConfig.offlineType === 'time' && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      选择今日定时下线时刻：
                    </span>
                    <div className="flex gap-2">
                      {['18:00', '19:30', '21:00', '22:30'].map((timeStr) => (
                        <button
                          key={timeStr}
                          type="button"
                          onClick={() =>
                            setLocalConfig((prev) => ({
                              ...prev,
                              scheduledTime: timeStr,
                            }))
                          }
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold transition cursor-pointer ${
                            localConfig.scheduledTime === timeStr
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {timeStr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 模式 3: 达到目标量满量下线 */}
                {localConfig.offlineType === 'quota' && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      今日达成联系方式数量后自动下线：
                    </span>
                    <div className="flex gap-2">
                      {[5, 10, 20, 30].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setLocalConfig((prev) => ({
                              ...prev,
                              quotaContacts: num,
                            }))
                          }
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold transition cursor-pointer ${
                            localConfig.quotaContacts === num
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          满 {num} 人
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};
