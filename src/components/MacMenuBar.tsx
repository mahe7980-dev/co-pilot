import React, { useState, useEffect } from 'react';

interface MacMenuBarProps {
  theme?: 'dark' | 'light';
}

export const MacMenuBar: React.FC<MacMenuBarProps> = ({
  theme = 'light',
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const day = days[now.getDay()];
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${day} ${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isLight = theme === 'light';

  return (
    <div
      className={`h-7 backdrop-blur-xl border-b text-[12px] font-medium px-4 flex items-center justify-between select-none shrink-0 z-50 transition-colors duration-200 ${
        isLight
          ? 'bg-white/80 border-black/10 text-slate-800'
          : 'bg-[#0b0e14]/80 border-white/10 text-slate-200'
      }`}
    >
      {/* Left System Menus */}
      <div className="flex items-center gap-4">
        {/* Apple Logo */}
        <span
          className={`text-sm leading-none cursor-pointer hover:opacity-75 transition ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          
        </span>

        {/* Active Application Name */}
        <span
          className={`font-bold tracking-tight cursor-pointer transition ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Co-Pilot
        </span>

        {/* Standard Clean macOS Menus */}
        <div className={`hidden sm:flex items-center gap-3.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          <span className={`cursor-pointer transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>
            文件
          </span>
          <span className={`cursor-pointer transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>
            编辑
          </span>
          <span className={`cursor-pointer transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>
            视图
          </span>
          <span className={`cursor-pointer transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>
            窗口
          </span>
          <span className={`cursor-pointer transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>
            帮助
          </span>
        </div>
      </div>

      {/* Right System Clock */}
      <div className="flex items-center gap-3 text-[11px]">
        <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {timeStr || '周五 22:30'}
        </span>
      </div>
    </div>
  );
};
