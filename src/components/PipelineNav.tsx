import React from 'react';
import { FileSearch, UserCheck, MessageSquareHeart, MessagesSquare, Award, Check } from 'lucide-react';

export interface StageStatus {
  p1Done: boolean;
  p3Done: boolean;
  p6Done: boolean;
  p7Done: boolean;
  p9Done: boolean;
}

interface PipelineNavProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  status: StageStatus;
}

export const PipelineNav: React.FC<PipelineNavProps> = ({
  currentStage,
  onSelectStage,
  status
}) => {
  const stages = [
    {
      num: 1,
      code: 'P1',
      title: '岗位标准解析',
      desc: 'JD拆解与合规拦截',
      icon: FileSearch,
      done: status.p1Done,
      agent: '招聘匹配专家'
    },
    {
      num: 2,
      code: 'P3',
      title: '在线简历初筛',
      desc: '逐条证据核验与评级',
      icon: UserCheck,
      done: status.p3Done,
      agent: '招聘匹配专家'
    },
    {
      num: 3,
      code: 'P6',
      title: '个性化打招呼',
      desc: '融入亮点与低门槛破冰',
      icon: MessageSquareHeart,
      done: status.p6Done,
      agent: '候选人对话Agent'
    },
    {
      num: 4,
      code: 'P7',
      title: '拟真对话与转化',
      desc: '意图识别与要联系方式',
      icon: MessagesSquare,
      done: status.p7Done,
      agent: '候选人对话Agent'
    },
    {
      num: 5,
      code: 'P9',
      title: 'HR推荐与交付',
      desc: '结构化总结与一句话汇报',
      icon: Award,
      done: status.p9Done,
      agent: '招聘匹配专家'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.num;
            const isDone = stage.done;

            return (
              <button
                key={stage.num}
                onClick={() => onSelectStage(stage.num)}
                className={`relative flex items-center p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-1 ring-blue-600'
                    : isDone
                    ? 'bg-slate-50 hover:bg-slate-100/80 border-emerald-300 text-slate-800'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-2.5 font-bold text-xs transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDone && !isActive ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span className="font-mono text-xs">{stage.code}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-blue-900' : 'text-slate-900'
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{stage.desc}</p>
                </div>

                {/* Subtag for Agent */}
                <div className="absolute top-1.5 right-1.5">
                  <span
                    className={`text-[9px] px-1 rounded font-medium ${
                      stage.agent === '招聘匹配专家'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {stage.code}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
