import React, { useState } from 'react';
import { X, Plus, Sparkles, Briefcase } from 'lucide-react';
import { OrbitJob } from '../types/orbit';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: OrbitJob) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [salaryExpect, setSalaryExpect] = useState('5000-7000元/月');
  const [category, setCategory] = useState('综合蓝领/生活服务');
  const [reqsText, setReqsText] = useState('具备相关工种证书或1年以上实操经验\n无不良信用记录\n吃苦耐劳服从排班');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob: OrbitJob = {
      id: `job_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `搜索${title.trim()}求职人员与薪资`,
      category,
      salaryExpect,
      yupaoSearchKeyword: title.trim(),
      requirements: reqsText.split('\n').filter((l) => l.trim()),
      candidateCount: Math.floor(Math.random() * 20) + 10,
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-[#121520] border border-[#23293a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
        <div className="px-5 py-4 border-b border-[#1f2538] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">新建招聘管理岗位</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:text-white rounded hover:bg-[#1c2234] text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              岗位名称 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：保安队长 / 叉车司机 / 普工"
              className="w-full px-3 py-2 bg-[#0c0e15] border border-[#242b3e] rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              副标题描述
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="例如：筛选附近保洁岗位与薪资"
              className="w-full px-3 py-2 bg-[#0c0e15] border border-[#242b3e] rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">薪资范围</label>
              <input
                type="text"
                value={salaryExpect}
                onChange={(e) => setSalaryExpect(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0e15] border border-[#242b3e] rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">岗位分类</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c0e15] border border-[#242b3e] rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              核心任职要求 (每行一条，用于 P1 与 P3 初筛)
            </label>
            <textarea
              rows={3}
              value={reqsText}
              onChange={(e) => setReqsText(e.target.value)}
              className="w-full p-2.5 bg-[#0c0e15] border border-[#242b3e] rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#171b28] hover:bg-[#202638] text-slate-400 text-xs cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
            >
              创建并开启自动化
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
