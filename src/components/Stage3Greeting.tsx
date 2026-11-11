import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquareHeart,
  Copy,
  Check,
  ArrowRight,
  Code,
  ShieldCheck,
  RefreshCw,
  Send,
  User,
  Tag,
  AlertCircle
} from 'lucide-react';

interface Stage3GreetingProps {
  jobTitle: string;
  candidateName: string;
  highlights: string[];
  toConfirm: string[];
  greetingText: string;
  onGreetingChange: (text: string) => void;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  onNext: () => void;
  onViewJson: (title: string, data: any) => void;
}

export const Stage3Greeting: React.FC<Stage3GreetingProps> = ({
  jobTitle,
  candidateName,
  highlights,
  toConfirm,
  greetingText,
  onGreetingChange,
  onGenerate,
  isLoading,
  onNext,
  onViewJson,
}) => {
  const [copied, setCopied] = useState(false);

  const wordCount = greetingText.trim().length;
  const isLengthValid = wordCount >= 30 && wordCount <= 120;
  const isIdealLength = wordCount >= 40 && wordCount <= 90;

  const handleCopy = () => {
    navigator.clipboard.writeText(greetingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-xs font-bold font-mono">
              P6 核心任务
            </span>
            <h2 className="text-base font-bold text-slate-900">个性化打招呼语智能生成</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            由【候选人对话 Agent】执行：字数控制在 <span className="font-semibold text-sky-700">40~90 字</span>，
            自然融入履历亮点，抛出低门槛互动问题，坚决杜绝群发感与任何评级泄露。
          </p>
        </div>
        {greetingText && (
          <button
            onClick={() => onViewJson('P6 打招呼 JSON 格式', { greeting: greetingText })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-xs transition shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-sky-600" />
            <span>查看输出 JSON</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              打招呼上下文输入源
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 font-medium block">目标岗位</span>
              <span className="font-semibold text-slate-900">{jobTitle || '未设置'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 font-medium block">候选人称呼</span>
              <span className="font-semibold text-slate-900">{candidateName || '候选人'}</span>
            </div>

            {/* Highlights passed from P3 */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>初筛抽取的真实履历亮点 (自动融入):</span>
              </span>
              <div className="space-y-1">
                {highlights.length > 0 ? (
                  highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs"
                    >
                      ✓ {h}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">尚未提取到亮点，建议返回阶段二初筛</p>
                )}
              </div>
            </div>

            {/* To-confirm questions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>后续待确认事项参考:</span>
              </span>
              <div className="space-y-1">
                {toConfirm.map((tc, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]"
                  >
                    • {tc}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Agent 正在创作非模板招呼语...' : '生成/重新生成个性化打招呼语'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Greeting preview and edit */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareHeart className="w-4 h-4 text-sky-600" />
                  打招呼语句预览与编辑
                </h3>
                <p className="text-xs text-slate-500">模拟 BOSS 直聘 / 微信对话气泡呈现</p>
              </div>

              {/* Word Count Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    isIdealLength
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isLengthValid
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  字数: {wordCount} 字 {isIdealLength ? '(40~90字标准达成)' : '(建议40~90字)'}
                </span>
              </div>
            </div>

            {/* Chat Bubble Presentation */}
            <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                  HR
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">AI 招聘助理（代表公司）</span>
                    <span>刚刚</span>
                  </div>
                  <textarea
                    rows={4}
                    value={greetingText}
                    onChange={(e) => onGreetingChange(e.target.value)}
                    placeholder="点击左侧生成个性化打招呼语句..."
                    className="w-full p-3.5 bg-white border border-blue-200 rounded-xl rounded-tl-none text-xs text-slate-800 leading-relaxed shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Compliance Verification Checklist */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                P6 规则遵从性自检清单
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>已融入真实履历优势点</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>抛出低门槛互动问题</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>坚决杜绝生硬模板与群发腔</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>严禁泄露初筛评分与评级标签</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopy}
                disabled={!greetingText.trim()}
                className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制文本' : '复制打招呼话术'}</span>
              </button>

              <button
                onClick={onNext}
                disabled={!greetingText.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>推送到 Stage 4 拟真对话室并开始沟通 (P7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
