import React from 'react';
import { Shield } from 'lucide-react';

interface ConfirmationBannerProps {
  onConfirm: () => void;
  onReject: () => void;
  stepDescription: string;
  theme?: 'dark' | 'light';
}

export const ConfirmationBanner: React.FC<ConfirmationBannerProps> = ({
  onConfirm,
  onReject,
  stepDescription,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`border-t px-6 py-3.5 select-none relative transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#10131c] border-[#1e2333] text-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Shield & Prompt text */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isLight
                ? 'bg-purple-100 border border-purple-300 text-purple-700'
                : 'bg-[#261c42] border border-purple-500/30 text-purple-400'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              需要你的确认
            </h4>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {stepDescription || '智能体想要读取当前网页候选人简历内容，用于完成客观匹配与微聊沟通。'}
            </p>
          </div>
        </div>

        {/* Right: Allow / Deny buttons & Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirm}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              允许执行
            </button>
            <button
              onClick={onReject}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-[#161a26] hover:bg-[#20273a] text-slate-400 hover:text-white border-[#262e44]'
              }`}
            >
              拒绝
            </button>
          </div>

          {/* Floating Assistant Avatar Badge */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5 shadow-md shadow-purple-500/20 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Assistant Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
