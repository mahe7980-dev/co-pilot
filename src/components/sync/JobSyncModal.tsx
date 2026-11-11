import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Play,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Globe,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';
import { OrbitJob } from '../../types/orbit';

interface JobSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncCompleted: (newJobs: OrbitJob[], startLoop: boolean) => void;
  theme?: 'dark' | 'light';
}

// 模拟从鱼泡平台实时拉取的在线在招岗位候选池
const REMOTE_YUPAO_JOBS = [
  {
    id: 'cleaner',
    title: '保洁员',
    subtitle: '在招 200 人 · 8k-11k/月 · 南京京东金鱼嘴职场',
    category: '家政/日常保洁',
    candidateCount: 200,
    location: '南京京东金鱼嘴职场',
    employer: '京东南京家政服务有限公司',
    salary: '8,000 - 11,000 元/月',
    rawJd: '接受平台系统派单，按指定时间上门提供家庭日常保洁服务；居家就近7公里以内派单。',
  },
  {
    id: 'waiter',
    title: '服务员',
    subtitle: '在招 24 人 · 4k-5.5k/月 · 朝阳合生汇商圈',
    category: '餐饮零售',
    candidateCount: 24,
    location: '朝阳区合生汇商圈',
    employer: '望湘园餐饮管理',
    salary: '4,000 - 5,500 元/月',
    rawJd: '负责前厅迎宾点餐与传菜翻台；持健康证，服务意识好。',
  },
  {
    id: 'sorter',
    title: '仓库分拣员',
    subtitle: '在招 32 人 · 5k-7k/月 · 顺义现代物流基地',
    category: '仓储物流',
    candidateCount: 32,
    location: '顺义现代物流基地',
    employer: '顺捷通供应链管理',
    salary: '5,000 - 7,000 元/月',
    rawJd: '负责电商小件出入库分拣、扫码贴标；手持PDA操作。',
  },
  {
    id: 'welder',
    title: '电焊工',
    subtitle: '在招 29 人 · 8k-12k/月 · 亦庄新能源装备基地',
    category: '建筑工业',
    candidateCount: 29,
    location: '亦庄新能源装备基地',
    employer: '中科重工智能装备',
    salary: '8,000 - 12,000 元/月',
    rawJd: '负责构件气保焊与氩弧焊；持特种作业焊工证，3年以上经验。',
  },
];

export const JobSyncModal: React.FC<JobSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncCompleted,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 完整流程状态 (对应图3大流程):
  // 1. 'ask_sync': 同步新岗位？(否: 退出进入已有列表 / 是: 下一步)
  // 2. 'select_platform': 选择招聘平台 (鱼泡直聘 · 已授权)
  // 3. 'select_jobs': 勾选要同步的岗位 (可多选，拉岗位列表)
  // 4. 'show_info_loop': 展示岗位信息 & 开启 Loop？(否: 保持未开启 / 是: 开启并加入队列)
  const [step, setStep] = useState<
    'ask_sync' | 'select_platform' | 'select_jobs' | 'show_info_loop'
  >('ask_sync');

  // 用户勾选要同步的岗位 ID 集合
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([
    'cleaner',
    'sorter',
    'welder',
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string>('yupao');

  if (!isOpen) return null;

  // 切换勾选岗位
  const toggleJobSelect = (id: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 全选或取消全选
  const toggleSelectAll = () => {
    if (selectedJobIds.length === REMOTE_YUPAO_JOBS.length) {
      setSelectedJobIds([]);
    } else {
      setSelectedJobIds(REMOTE_YUPAO_JOBS.map((j) => j.id));
    }
  };

  // 确认完成同步并按需开启 Loop
  const handleComplete = (startLoop: boolean) => {
    const syncedJobs: OrbitJob[] = REMOTE_YUPAO_JOBS.filter((j) =>
      selectedJobIds.includes(j.id)
    ).map((j) => ({
      id: j.id,
      title: j.title,
      subtitle: j.subtitle,
      category: j.category,
      salaryExpect: j.salary,
      requirements: [
        `具备${j.title}相关资格或从业经历`,
        '无重大失信与安全违规记录',
        '认可薪资结构与工作地点',
      ],
      yupaoSearchKeyword: j.title,
      candidateCount: j.candidateCount,
      vacancyCount: j.candidateCount,
      address: j.location,
      employer: j.employer,
    }));

    onSyncCompleted(syncedJobs, startLoop);
    onClose();
    setTimeout(() => setStep('ask_sync'), 300);
  };

  // 退出并重置
  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('ask_sync'), 300);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-all duration-200 animate-in zoom-in-95 ${
          isLight
            ? 'bg-white text-slate-800 border-slate-200'
            : 'bg-[#121624] text-slate-100 border-[#222a3e]'
        }`}
      >
        {/* 顶部简明 Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isLight
              ? 'bg-slate-50/80 border-slate-100'
              : 'bg-[#151b2e] border-[#222a3e]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {step === 'ask_sync' && '同步新岗位？'}
                {step === 'select_platform' && '选择招聘平台'}
                {step === 'select_jobs' && '同步在招岗位'}
                {step === 'show_info_loop' && '岗位信息与 Loop 开启'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                {step === 'ask_sync' && '第 1/4 步'}
                {step === 'select_platform' && '第 2/4 步'}
                {step === 'select_jobs' && '第 3/4 步'}
                {step === 'show_info_loop' && '第 4/4 步'}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className={`p-1 rounded-lg transition text-slate-400 hover:text-slate-600 ${
              isLight ? 'hover:bg-slate-200/50' : 'hover:bg-[#1f263a]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 弹窗内容主体 */}
        <div className="p-5">
          {/* ================= 步骤 1: 询问「同步新岗位？」 ================= */}
          {step === 'ask_sync' && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 mx-auto flex items-center justify-center shadow-xs">
                <Globe className="w-7 h-7 text-blue-500" />
              </div>

              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  检测到已登录，是否同步新岗位？
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  可通过关联的招聘平台一键导入在招职位与 JD 规则库，快速建立 AI 初筛标准与候选人流转。
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleClose}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-[#181f30] hover:bg-[#222a42] text-slate-300 border-slate-700'
                  }`}
                >
                  否 · 进入已有岗位列表
                </button>
                <button
                  onClick={() => setStep('select_platform')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>是 · 立即同步新岗位</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 步骤 2: 选择招聘平台 ================= */}
          {step === 'select_platform' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  请选择需要对接拉取在招职位的招聘平台：
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* 平台 1: 鱼泡直聘 (默认已授权) */}
                <div
                  onClick={() => setSelectedPlatform('yupao')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedPlatform === 'yupao'
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161c2d]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#008aff] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      鱼泡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          鱼泡网 / 鱼泡直聘
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                          已授权
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        企业端账号：北京易聘数字科技 · 授权 Copilot 代操作
                      </p>
                    </div>
                  </div>

                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* 平台 2: 预留拓展平台 (置灰示意) */}
                <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#141824] flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold text-xs">
                      更多
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-600 dark:text-slate-400">
                        其他招聘平台 (BOSS直聘 / 智联等)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        平台代操作接口扩展预留中
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                    敬请期待
                  </span>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setStep('ask_sync')}
                  className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                    isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>上一步</span>
                </button>

                <button
                  onClick={() => setStep('select_jobs')}
                  className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>拉取岗位列表</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 步骤 3: 勾选要同步的岗位 (对应用户截图样式) ================= */}
          {step === 'select_jobs' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  鱼泡直聘已连接，请勾选需要同步的在招职位：
                </span>
                <button
                  onClick={toggleSelectAll}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  {selectedJobIds.length === REMOTE_YUPAO_JOBS.length
                    ? '取消全选'
                    : '全选'}
                </button>
              </div>

              {/* 紧凑职位列表 */}
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
                {REMOTE_YUPAO_JOBS.map((job) => {
                  const isChecked = selectedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => toggleJobSelect(job.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? isLight
                            ? 'bg-blue-50/60 border-blue-400 shadow-2xs'
                            : 'bg-blue-950/25 border-blue-500/60 shadow-2xs'
                          : isLight
                          ? 'bg-white hover:bg-slate-50 border-slate-200'
                          : 'bg-[#161c2d] hover:bg-[#1a2238] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {job.title}
                            </span>
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                              {job.salary}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {job.location} · {job.rawJd}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 font-medium">
                        在招 {job.candidateCount} 人
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 底部按钮栏 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('select_platform')}
                    className={`transition font-medium flex items-center gap-1 ${
                      isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>平台</span>
                  </button>
                  <span className="text-slate-400">
                    已选择 <strong className="text-blue-600 font-bold">{selectedJobIds.length}</strong> 项
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClose}
                    className={`px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
                      isLight
                        ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    暂不同步
                  </button>
                  <button
                    onClick={() => setStep('show_info_loop')}
                    disabled={selectedJobIds.length === 0}
                    className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>立即同步</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 步骤 4: 展示岗位信息 & 开启 Loop？ ================= */}
          {step === 'show_info_loop' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <strong>岗位同步成功！</strong> 已从鱼泡成功拉取 {selectedJobIds.length} 个在招职位信息。
                </span>
              </div>

              {/* 展示已同步岗位信息卡片 */}
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-0.5">
                {REMOTE_YUPAO_JOBS.filter((j) => selectedJobIds.includes(j.id)).map((job) => (
                  <div
                    key={job.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161c2d] text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {job.title}
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          {job.salary}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {job.employer} · {job.location} · {job.rawJd}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 font-medium">
                      已提取JD
                    </span>
                  </div>
                ))}
              </div>

              {/* 决策询问：开启 Loop？ */}
              <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300">
                    是否立即开启自动化 Loop？
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  开启后系统将自动从 JD 中抽取特征并加入主 Loop 队列，开始自动轮转打招呼与意向初筛。
                </p>
              </div>

              {/* 底部决策按钮 */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setStep('select_jobs')}
                  className={`transition font-medium flex items-center gap-1 ${
                    isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>重选岗位</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleComplete(false)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-[#181f30] hover:bg-[#222a42] text-slate-300 border-slate-700'
                    }`}
                  >
                    否 · 岗位保持未开启
                  </button>
                  <button
                    onClick={() => handleComplete(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>是 · 开启 Loop</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
