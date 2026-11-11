import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  data
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Code className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制 JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-emerald-400 leading-relaxed">
          <pre>{jsonStr}</pre>
        </div>

        <div className="bg-slate-900 px-6 py-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
          <span>严格遵循系统规定的纯 JSON 协议（严禁修饰词）</span>
          <span>字符数: {jsonStr.length}</span>
        </div>
      </div>
    </div>
  );
};
