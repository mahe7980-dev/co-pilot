import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userInfo: { phone: string; name: string }) => void;
  theme?: 'dark' | 'light';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
}) => {
  const [phone, setPhone] = useState('13800138000');
  const [code, setCode] = useState('8866');
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 验证码倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!phone || phone.length < 11) {
      setErrorMsg('请输入正确的11位手机号码');
      return;
    }
    setErrorMsg('');
    setCountdown(60);
    setCode('8866');
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 11) {
      setErrorMsg('请输入正确的11位手机号码');
      return;
    }
    if (!code) {
      setErrorMsg('请输入短信验证码');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        phone: phone.trim(),
        name: 'Co-Pilot 招聘顾问',
      });
    }, 350);
  };

  return (
    <div className="w-full max-w-[440px] rounded-[22px] bg-[#f7f8fa]/95 backdrop-blur-2xl border border-white/80 ring-1 ring-slate-900/10 shadow-[0_28px_80px_rgba(15,23,42,0.22)] text-slate-800 select-none overflow-hidden flex flex-col justify-between p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
      {/* 顶部：macOS 原生小窗口红黄灰控制点 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 group">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block" />
          <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-300/80 inline-block" />
        </div>
      </div>

      {/* 中上部：品牌标识与精简标语 */}
      <div className="pt-5 pb-4 text-center space-y-2.5">
        <div className="inline-flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#0d53e2] flex items-center justify-center text-white text-[11px] font-black shadow-xs">
            AI
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Co-Pilot
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
            WORKSTATION
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            欢迎登录智能招聘工作站
          </h1>
          <p className="text-xs text-slate-500">
            真实岗位 · 智能匹配 · 快速上岗
          </p>
        </div>
      </div>

      {/* 中部：轻量登录表单 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-[0_6px_24px_rgba(15,23,42,0.04)] space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          {/* 手机号 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">手机号</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition overflow-hidden">
              <span className="pl-3.5 pr-2.5 py-2.5 text-xs font-medium text-slate-500 border-r border-slate-200/80 select-none">
                +86
              </span>
              <input
                type="tel"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="请输入手机号"
                className="w-full px-3 py-2.5 outline-none text-xs text-slate-800 bg-transparent font-mono"
              />
            </div>
          </div>

          {/* 短信验证码 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">短信验证码</label>
            <div className="relative flex items-center">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="w-full pl-3.5 pr-28 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs text-slate-800 font-mono transition"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-blue-600 disabled:text-slate-400 disabled:bg-slate-50 transition cursor-pointer"
              >
                {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs tracking-wider shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>登 录</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 底部标语 */}
      <div className="pt-5 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400 tracking-widest">
        <span className="w-5 h-px bg-slate-200" />
        <span>让链接更有价值</span>
        <span className="w-5 h-px bg-slate-200" />
      </div>
    </div>
  );
};
