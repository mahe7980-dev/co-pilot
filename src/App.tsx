import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Briefcase,
  Users,
  BarChart2,
  LogOut,
  CheckCircle2,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { OrbitSidebar } from './components/OrbitSidebar';
import { YupaoBrowser } from './components/YupaoBrowser';
import { AutomationTaskPanel } from './components/AutomationTaskPanel';
import { JobManagementView } from './components/views/JobManagementView';
import { JobDetailView } from './components/views/JobDetailView';
import { CandidatePoolView } from './components/views/CandidatePoolView';
import { TaskLogsView } from './components/views/TaskLogsView';
import { RecruitmentAnalyticsView } from './components/views/RecruitmentAnalyticsView';
import { NewJobModal } from './components/NewJobModal';
import { RulesModal } from './components/RulesModal';
import { DevRedundancyModal } from './components/DevRedundancyModal';
import { MacMenuBar } from './components/MacMenuBar';
import { LoginPage } from './components/auth/LoginPage';
import { JobSyncModal } from './components/sync/JobSyncModal';
import { LoopOfflineModal } from './components/LoopOfflineModal';
import { ORBIT_JOBS, YUPAO_CANDIDATES } from './data/orbitJobs';
import { AutomationStep, OrbitChatMessage, OrbitJob, YupaoCandidate, DevConfig, DevTraceLog, LoopOfflineConfig } from './types/orbit';

export default function App() {
  // Theme State: 浅色模式（默认且唯一）
  const theme = 'light' as const;

  // Window State
  const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(false);

  // User Dropdown Menu State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. 顶部登录计时器 (实时记录登录时长 小时+分钟)
  const [loginSeconds, setLoginSeconds] = useState<number>(1 * 3600 + 48 * 60 + 20);
  useEffect(() => {
    const timer = setInterval(() => {
      setLoginSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loginHours = Math.floor(loginSeconds / 3600);
  const loginMinutes = Math.floor((loginSeconds % 3600) / 60);

  // 2. 招聘实时数据统计指标 (大字展示: 搜索牛人数量、沟通数量、获取联系方式数量)
  const [recruitmentMetrics, setRecruitmentMetrics] = useState({
    searchedCount: 168,
    communicatedCount: 42,
    contactsCapturedCount: 19,
  });

  // Developer Redundancy Slot Configuration (非标系统扩展插槽)
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);
  const [devConfig, setDevConfig] = useState<DevConfig>({
    typingSpeedJitter: true,
    typingDelayMs: 65,
    smoothScroll: true,
    mouseBezierCurve: true,
    captchaStrategy: 'manual_switch',
    customDomSelectors: {
      searchInput: 'input[placeholder*="搜索你想要的牛人"]',
      greetButton: 'button:has-text("打招呼")',
      chatWindow: '.yupao-chat-drawer',
      contactBadge: '.contact-extracted-tag',
    },
    hookBeforeScreen: true,
    hookAfterGreeting: true,
    hookOnContactCaptured: true,
    webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/f382a9-custom-crm',
    webhookFormat: 'feishu',
    enableWebhookPush: true,
    temperature: 0.2,
    customPromptPatch: '遇到候选人询问食宿时，统一说明由公司提供标准四人间，水电全免；语气质朴诚恳。',
    knowledgeBaseOverride: '保洁岗位试用期统一为1个月，薪资按90%发放并缴纳商业意外险。',
    enableLiveDomTrace: true,
  });

  // Developer Action Trace Logs (核心需求 6: 日志绑定岗位)
  const [traceLogs, setTraceLogs] = useState<DevTraceLog[]>([
    {
      id: 't_1',
      timestamp: '14:20:01.102',
      type: 'DOM',
      message: 'Mount Yupao sandbox frame -> /beijing/search',
      detail: 'selector: iframe#yupao_sandbox_frame',
      jobId: 'cleaner',
      jobTitle: '保洁员',
    },
    {
      id: 't_2',
      timestamp: '14:20:01.320',
      type: 'HOOK',
      message: 'Trigger hook: beforeScreen -> Pass filter check',
      detail: 'Candidate not in blacklist table',
      jobId: 'cleaner',
      jobTitle: '保洁员',
    },
    {
      id: 't_3',
      timestamp: '14:20:02.045',
      type: 'AI',
      message: 'P3 Stage prompt executed -> Status: met, confidence: 0.94',
      detail: 'Captured quote: 会开三轮车，有过两年医院保洁工',
      jobId: 'cleaner',
      jobTitle: '保洁员',
    },
    {
      id: 't_4',
      timestamp: '14:21:15.220',
      type: 'AI',
      message: '核验候选人特种作业证照 -> 熔化焊接与热切割作业证有效',
      detail: '应急管理部全国查询接口已核验，在有效期内',
      jobId: 'welder',
      jobTitle: '电焊工',
    },
    {
      id: 't_5',
      timestamp: '14:22:30.810',
      type: 'NET',
      message: '顺义大仓两班倒自动化轮询 -> 匹配 32 位活跃分拣工人',
      detail: '命中 3年内仓储手持PDA扫码经验',
      jobId: 'sorter',
      jobTitle: '仓库分拣员',
    },
  ]);

  // Jobs List State
  const [jobs, setJobs] = useState<OrbitJob[]>(ORBIT_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('cleaner');
  const [drawerJob, setDrawerJob] = useState<OrbitJob | null>(null);
  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Automation Running State (默认展示自动执行)
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // 3. 顶部的执行 loop 下线与定时下线设置 (核心需求 3)
  const [loopOfflineConfig, setLoopOfflineConfig] = useState<LoopOfflineConfig>({
    isOffline: false,
    scheduledOfflineEnabled: true,
    offlineType: 'duration',
    durationMinutes: 30,
    scheduledTime: '18:00',
    quotaContacts: 10,
    targetTimestamp: Date.now() + 30 * 60 * 1000,
  });
  const [isLoopOfflineModalOpen, setIsLoopOfflineModalOpen] = useState(false);
  const [offlineNoticeToast, setOfflineNoticeToast] = useState<string | null>(null);
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>('30m');

  const handleImmediateOffline = () => {
    setIsRunning(false);
    setLoopOfflineConfig((prev) => ({ ...prev, isOffline: true }));
    setOfflineNoticeToast('Loop 已手动立即下线。');
    setTraceLogs((prev) => [
      {
        id: `t_off_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        type: 'SYS',
        message: `[手动下线] 操作员手动触发立即下线，主自动化队列已离线`,
        detail: `岗位: ${currentJob.title}`,
        jobId: currentJob.id,
        jobTitle: currentJob.title,
      },
      ...prev,
    ]);
  };

  const handleImmediateOnline = () => {
    setLoopOfflineConfig((prev) => ({
      ...prev,
      isOffline: false,
      targetTimestamp: Date.now() + prev.durationMinutes * 60 * 1000,
    }));
    setIsRunning(true);
    setOfflineNoticeToast('Loop 已重新上线并恢复自动执行！');
    setTraceLogs((prev) => [
      {
        id: `t_on_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        type: 'SYS',
        message: `[重新上线] Loop 已恢复在线并恢复主自动化执行`,
        detail: `岗位: ${currentJob.title}`,
        jobId: currentJob.id,
        jobTitle: currentJob.title,
      },
      ...prev,
    ]);
  };

  // 定时下线与满额下线倒计时监控
  useEffect(() => {
    if (!loopOfflineConfig.scheduledOfflineEnabled || loopOfflineConfig.isOffline) {
      setRemainingTimeStr('');
      return;
    }

    const interval = setInterval(() => {
      if (loopOfflineConfig.offlineType === 'duration' && loopOfflineConfig.targetTimestamp) {
        const diff = loopOfflineConfig.targetTimestamp - Date.now();
        if (diff <= 0) {
          setIsRunning(false);
          setLoopOfflineConfig((prev) => ({ ...prev, isOffline: true }));
          setOfflineNoticeToast(`【定时下线】已到达设定的 ${loopOfflineConfig.durationMinutes} 分钟执行时长，Loop 已自动安全下线保护账号。`);
          setTraceLogs((prev) => [
            {
              id: `t_off_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
              type: 'SYS',
              message: `[定时下线] 到达预定时长，Loop 自动化执行已自动停止并下线`,
              detail: `岗位: ${currentJob.title} · 已达成沟通指标`,
              jobId: currentJob.id,
              jobTitle: currentJob.title,
            },
            ...prev,
          ]);
          setRemainingTimeStr('已到期');
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setRemainingTimeStr(`${m}m${s}s`);
        }
      } else if (loopOfflineConfig.offlineType === 'time') {
        const now = new Date();
        const curTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (curTime >= loopOfflineConfig.scheduledTime) {
          setIsRunning(false);
          setLoopOfflineConfig((prev) => ({ ...prev, isOffline: true }));
          setOfflineNoticeToast(`【定时下线】已到达今日指定时刻 (${loopOfflineConfig.scheduledTime})，Loop 已自动下线。`);
        }
        setRemainingTimeStr(`至${loopOfflineConfig.scheduledTime}`);
      } else if (loopOfflineConfig.offlineType === 'quota') {
        if (recruitmentMetrics.contactsCapturedCount >= loopOfflineConfig.quotaContacts) {
          setIsRunning(false);
          setLoopOfflineConfig((prev) => ({ ...prev, isOffline: true }));
          setOfflineNoticeToast(`【满额下线】今日已成功获取 ${recruitmentMetrics.contactsCapturedCount} 位联系方式，达成预设指标，Loop 已自动下线。`);
        }
        setRemainingTimeStr(`满${loopOfflineConfig.quotaContacts}人`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loopOfflineConfig, isRunning, recruitmentMetrics.contactsCapturedCount, currentJob]);

  // 更新职位详情与RAG知识库
  const handleUpdateJob = (updatedJob: OrbitJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setTraceLogs((prev) => [
      {
        id: `t_upd_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        type: 'RULE',
        message: `[项目单更新] 成功保存岗位【${updatedJob.title}】详情与知识库`,
        detail: `已更新岗位配置`,
        jobId: updatedJob.id,
        jobTitle: updatedJob.title,
      },
      ...prev,
    ]);
  };

  // 按岗位独立切换 Loop 启动/暂停状态
  const handleToggleJobLoop = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;
    const nextRunning = !targetJob.loopRunning;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, loopRunning: nextRunning } : j))
    );
    if (drawerJob && drawerJob.id === jobId) {
      setDrawerJob((prev) => (prev ? { ...prev, loopRunning: nextRunning } : null));
    }

    setIsRunning(nextRunning);
    setTraceLogs((prev) => [
      {
        id: `t_loop_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        type: 'SYS',
        message: nextRunning
          ? `[岗位Loop启动] 已启动【${targetJob.title}】自动化 Loop 队列`
          : `[岗位Loop暂停] 已暂停【${targetJob.title}】自动化 Loop 队列`,
        detail: `岗位ID: ${targetJob.id}`,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
      },
      ...prev,
    ]);
  };

  // 打开某个岗位的专属 Loop 定时与下线设置
  const handleOpenLoopSettings = (job: OrbitJob) => {
    setSelectedJobId(job.id);
    setIsLoopOfflineModalOpen(true);
  };

  // Candidates for selected job
  const jobCandidates = YUPAO_CANDIDATES[selectedJobId] || YUPAO_CANDIDATES.cleaner;
  const [activeCandidate, setActiveCandidate] = useState<YupaoCandidate>(jobCandidates[0]);

  // 顶部导航页面状态：'recruit' (招聘) | 'jobs' (岗位) | 'candidates' (候选人) | 'analytics' (数据)
  const [activeView, setActiveView] = useState<'recruit' | 'jobs' | 'candidates' | 'analytics'>('recruit');
  const [isNewJobOpen, setIsNewJobOpen] = useState<boolean>(false);

  // Browser States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isInspectingResume, setIsInspectingResume] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<OrbitChatMessage[]>([]);

  // User Authentication & Session State (增加登录与退出登录功能)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('isLoggedIn');
    return saved === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ phone: string; name: string }>(() => {
    const savedPhone = sessionStorage.getItem('userPhone');
    return {
      phone: savedPhone || '13800138000',
      name: 'Co-Pilot 招聘顾问',
    };
  });

  // 岗位同步弹窗 (大流程如图3: 阶段一 登录与岗位同步 -> 阶段二 展示岗位与开启Loop)
  const [isJobSyncModalOpen, setIsJobSyncModalOpen] = useState<boolean>(false);

  const handleLoginSuccess = (user: { phone: string; name: string }) => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userPhone', user.phone);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    setIsHoveringAuto(false);
  };

  const handleSyncCompleted = (newJobs: OrbitJob[], startLoop: boolean) => {
    if (newJobs.length > 0) {
      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j.id));
        const toAdd = newJobs.filter((j) => !existingIds.has(j.id));
        return [...prev, ...toAdd];
      });
      setSelectedJobId(newJobs[0].id);
    }
    if (startLoop) {
      setIsRunning(true);
      setTraceLogs((prev) => [
        {
          id: `t_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          type: 'NET',
          message: `[阶段二 · 开启Loop] 岗位已同步并加入主 Loop 队列，AI 自动化运转已启动！`,
          detail: `已同步在招岗位数: ${newJobs.length}，AI 已从 JD 中提取核心特征`,
        },
        ...prev,
      ]);
    }
  };

  // Automation Steps
  const initialSteps: AutomationStep[] = [
    {
      id: 1,
      title: `打开鱼泡网 / 筛选【${currentJob.title}】候选人`,
      code: 'P1',
      status: 'completed',
      log: '已进入鱼泡直聘大厅，按岗位要求筛选活跃工人',
    },
    {
      id: 2,
      title: '读取候选人简历 (P3 客观初筛与原文证据)',
      code: 'P3',
      status: 'running',
      log: '正在逐条提取健康证、从业年限与技能原文证据',
    },
    {
      id: 3,
      title: '生成个性化破冰打招呼 (P6 融入履历亮点)',
      code: 'P6',
      status: 'pending',
      log: '根据候选人高分优势点撰写 40~90 字得体打招呼',
    },
    {
      id: 4,
      title: '鱼泡微聊意图识别与要联系方式 (P7 对话转化)',
      code: 'P7',
      status: 'pending',
      log: '基于知识库边界问答，索要电话/微信号',
    },
    {
      id: 5,
      title: '生成 HR 极速交付总结卡 (P9 汇报简报)',
      code: 'P9',
      status: 'pending',
      log: '结构化导出已核实信息与一句话推荐理由',
    },
  ];

  const [steps, setSteps] = useState<AutomationStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);

  // Hover Popover State for "自动执行"
  const [isHoveringAuto, setIsHoveringAuto] = useState<boolean>(false);
  const autoButtonRef = useRef<HTMLDivElement>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number }>({ top: 56, left: 240 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterAuto = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (autoButtonRef.current) {
      const rect = autoButtonRef.current.getBoundingClientRect();
      const idealLeft = rect.left;
      // Ensure it stays on screen
      const maxLeft = Math.max(16, window.innerWidth - 880);
      setPopoverCoords({
        top: rect.bottom + 8,
        left: Math.min(idealLeft, maxLeft),
      });
    }
    setIsHoveringAuto(true);
  };

  const handleMouseLeaveAuto = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringAuto(false);
    }, 320);
  };

  // Autonomous Background Runner ("内部自动运转")
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      advanceStep();
    }, 4500);
    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, activeCandidate, steps.length]);

  // When job changes, reset candidate & steps
  useEffect(() => {
    const cands = YUPAO_CANDIDATES[selectedJobId] || YUPAO_CANDIDATES.cleaner;
    const firstCand = cands[0];
    setActiveCandidate(firstCand);
    setIsChatOpen(false);
    setIsInspectingResume(false);
    setChatMessages([]);
    setCurrentStepIndex(1);
    setSteps([
      {
        id: 1,
        title: `打开鱼泡网 / 筛选【${currentJob.title}】候选人`,
        code: 'P1',
        status: 'completed',
        log: '已进入鱼泡直聘大厅，完成岗位检索',
      },
      {
        id: 2,
        title: '读取候选人简历 (P3 客观初筛与原文证据)',
        code: 'P3',
        status: 'running',
        log: `读取候选人 ${firstCand.name} 的简历`,
      },
      {
        id: 3,
        title: '生成个性化破冰打招呼 (P6 融入履历亮点)',
        code: 'P6',
        status: 'pending',
        log: '准备个性化招呼语',
      },
      {
        id: 4,
        title: '鱼泡微聊意图识别与要联系方式 (P7 对话转化)',
        code: 'P7',
        status: 'pending',
        log: '准备微聊转化',
      },
      {
        id: 5,
        title: '生成 HR 极速交付总结卡 (P9 汇报简报)',
        code: 'P9',
        status: 'pending',
        log: '准备交付简报',
      },
    ]);
  }, [selectedJobId]);

  // Execute Step transition logic
  const advanceStep = () => {
    const nextIdx = currentStepIndex + 1;
    const nowStr = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);

    if (nextIdx < steps.length) {
      setCurrentStepIndex(nextIdx);

      // Trigger realistic visual actions corresponding to step
      if (nextIdx === 1) {
        setIsInspectingResume(true);
        setIsChatOpen(false);
        setTraceLogs((prev) => [
          {
            id: `t_${Date.now()}`,
            timestamp: nowStr,
            type: 'DOM',
            message: `Click candidate card -> ${activeCandidate.name} (ID: ${activeCandidate.id})`,
            detail: `selector: .candidate-card[data-id="${activeCandidate.id}"]`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          {
            id: `t_${Date.now() + 1}`,
            timestamp: nowStr,
            type: 'AI',
            message: `P3 Objective Screening verified 2 criteria`,
            detail: `Quotes: ${activeCandidate.resumeDetails.highlights.join('; ')}`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          ...prev.slice(0, 30),
        ]);
      } else if (nextIdx === 2) {
        setIsInspectingResume(false);
        setIsChatOpen(true);
        const highlight = activeCandidate.tags[0] || '岗位要求';
        const greetingText = `${activeCandidate.name}老师您好！关注到您在【${highlight}】方面有多年的扎实经验，做事细心耐心，非常契合我们正在招聘的【${currentJob.title}】岗位。请问您目前看新机会吗？方便先简单交流下吗？`;
        setChatMessages([
          {
            id: 'msg_greet',
            sender: 'agent',
            text: greetingText,
            time: '刚刚',
          },
        ]);
        setRecruitmentMetrics((prev) => ({
          ...prev,
          communicatedCount: prev.communicatedCount + 1,
        }));
        setTraceLogs((prev) => [
          {
            id: `t_${Date.now()}`,
            timestamp: nowStr,
            type: 'HOOK',
            message: `Trigger hook: beforeGreeting -> Built personalized greeting`,
            detail: `Candidate: ${activeCandidate.name}, highlight: ${highlight}`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          {
            id: `t_${Date.now() + 1}`,
            timestamp: nowStr,
            type: 'DOM',
            message: `Type greeting into .chat-input with ${devConfig.typingDelayMs}ms jitter`,
            detail: `Payload: 68 chars`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          ...prev.slice(0, 30),
        ]);
      } else if (nextIdx === 3) {
        setIsChatOpen(true);
        const phone = activeCandidate.phone || '13810239988';
        const candReply = `您好！我目前在看机会的，随时可以到岗。我的电话是 ${phone}，微信号也是这个，麻烦加下我发下工作地址！`;
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_cand',
            sender: 'candidate',
            text: candReply,
            time: '刚刚',
            contactExtracted: phone,
          },
          {
            id: 'msg_agent_ack',
            sender: 'agent',
            text: `已收到您的联系电话 ${phone}！我们已为您登记并安排用工主管进一步沟通，稍后同步详细班次与体检流程！`,
            time: '刚刚',
          },
        ]);
        setRecruitmentMetrics((prev) => ({
          ...prev,
          contactsCapturedCount: prev.contactsCapturedCount + 1,
        }));
        setTraceLogs((prev) => [
          {
            id: `t_${Date.now()}`,
            timestamp: nowStr,
            type: 'HOOK',
            message: `Trigger hook: onContactCaptured -> Phone parsed: ${phone}`,
            detail: `Regex pattern: /(?:(?:\\+|00)86)?1[3-9]\\d{9}/ matched`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          {
            id: `t_${Date.now() + 1}`,
            timestamp: nowStr,
            type: 'NET',
            message: `Queue webhook payload -> ${devConfig.webhookFormat} to ${devConfig.webhookUrl}`,
            detail: `Status: 200 OK (Simulation)`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          ...prev.slice(0, 30),
        ]);
      } else if (nextIdx === 4) {
        setTraceLogs((prev) => [
          {
            id: `t_${Date.now()}`,
            timestamp: nowStr,
            type: 'RULE',
            message: `P9 Delivery Brief synthesized for ${activeCandidate.name}`,
            detail: `Exported to recruiter dashboard`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
          },
          ...prev.slice(0, 30),
        ]);
      }
    } else {
      // 完成当前候选人5步自动化 -> 自动轮转至下一位候选人继续运转
      const candIdx = jobCandidates.findIndex((c) => c.id === activeCandidate.id);
      const nextCand = jobCandidates[(candIdx + 1) % jobCandidates.length];
      setActiveCandidate(nextCand);
      setIsChatOpen(false);
      setIsInspectingResume(false);
      setChatMessages([]);
      setCurrentStepIndex(0);
      setTraceLogs((prev) => [
        {
          id: `t_${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100),
          type: 'AI',
          message: `自动流转至下一位候选人 -> ${nextCand.name} (${nextCand.tags.join(', ')})`,
          detail: 'Auto-pipeline looping to next candidate',
          jobId: currentJob.id,
          jobTitle: currentJob.title,
        },
        ...prev.slice(0, 30),
      ]);
    }
  };

  // Keyboard shortcut ⌘K for new job
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsNewJobOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddJob = (newJob: OrbitJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
  };

  const handleSendMessage = (text: string) => {
    const newMsg: OrbitChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setRecruitmentMetrics((prev) => ({
      ...prev,
      communicatedCount: prev.communicatedCount + 1,
    }));

    setTimeout(() => {
      const replyMsg: OrbitChatMessage = {
        id: `m_rep_${Date.now()}`,
        sender: 'candidate',
        text: '好的收到！请问这个岗位有工作餐和住宿吗？我随时都能到岗。',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 800);
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none relative transition-colors duration-300 ${
        isLight ? 'text-slate-800' : 'text-slate-200'
      }`}
    >
      {/* 1. macOS Top Menu Bar */}
      <MacMenuBar theme={theme} />

      {/* 2. Virtual Desktop Workspace (macOS Wallpaper Background) */}
      <div
        className={`flex-1 relative flex flex-col overflow-hidden transition-all duration-300 ${
          isWindowMaximized ? 'p-0' : 'p-2 sm:p-4'
        }`}
      >
        {/* macOS Wallpaper Elements based on Theme */}
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#dbeafe] via-[#ede9fe] to-[#fce7f3] pointer-events-none -z-10" />
            <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-sky-300/30 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-300/25 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-amber-200/25 blur-3xl pointer-events-none -z-10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#05070d] via-[#090f1e] to-[#12172b] pointer-events-none -z-10" />
            <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none -z-10" />
          </>
        )}

        {/* 3. 登录前：居中紧凑小窗口；登录后：完整大工作台窗口 */}
        {!isLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              theme={theme}
            />
          </div>
        ) : (
          <div
            className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
              isWindowMaximized
                ? 'rounded-none border-0 shadow-none'
                : isLight
                ? 'rounded-2xl border border-slate-300/80 ring-1 ring-black/10 shadow-[0_25px_70px_rgba(0,0,0,0.22)] bg-white'
                : 'rounded-2xl border border-white/15 ring-1 ring-black/60 shadow-[0_30px_90px_rgba(0,0,0,0.85)] bg-[#0a0d14]'
            }`}
          >
            {/* Window Chrome Title Bar */}
            <header
              className={`h-11 sm:h-12 border-b px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-xs transition-colors duration-200 relative z-30 ${
                isLight
                  ? 'bg-[#eaedf4] border-[#d4d8e4] text-slate-800'
                  : 'bg-[#12151d] border-[#1f2535] text-slate-200'
              }`}
            >
              {/* Left: macOS Traffic Lights, Title & Left-aligned Top Navigation */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2 group mr-1">
                  <button
                    onClick={() => setIsWindowMaximized(false)}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-90 flex items-center justify-center transition cursor-pointer"
                    title="关闭"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-[#700000] font-black">×</span>
                  </button>
                  <button
                    className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-90 flex items-center justify-center transition cursor-pointer"
                    title="最小化"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-[#704800] font-black">-</span>
                  </button>
                  <button
                    onClick={() => setIsWindowMaximized(!isWindowMaximized)}
                    className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-90 flex items-center justify-center transition cursor-pointer"
                    title={isWindowMaximized ? '退出全屏 (还原窗口)' : '全屏 (最大化)'}
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[6px] leading-none text-[#004f0d] font-black">+</span>
                  </button>
                </div>

                <div className={`h-4 w-px mx-0.5 sm:mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700/60'}`}></div>

                {/* Window Title */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#008aff] flex items-center justify-center text-white text-[9px] font-bold shadow-xs">
                    AI
                  </div>
                  <span className={`font-semibold text-xs tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    Co-Pilot
                  </span>
                </div>

                {/* Left-aligned Top Navigation Tabs (招聘 / 岗位 / 候选人 / 数据) */}
                <div className={`h-4 w-px mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700/60'}`} />
                <nav className="flex items-center gap-1 bg-slate-200/75 p-1 rounded-xl border border-slate-300/70">
                  <button
                    onClick={() => setActiveView('recruit')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'recruit'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>招聘</span>
                  </button>

                  <button
                    onClick={() => setActiveView('jobs')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'jobs'
                        ? 'bg-white text-purple-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>岗位</span>
                  </button>

                  <button
                    onClick={() => setActiveView('candidates')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'candidates'
                        ? 'bg-white text-sky-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>候选人</span>
                  </button>

                  <button
                    onClick={() => setActiveView('analytics')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'analytics'
                        ? 'bg-white text-emerald-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>数据</span>
                  </button>
                </nav>
              </div>

              {/* Right Window Controls */}
              <div className="flex items-center gap-2">
                {/* 人物名称下拉展开 (保留右上角下拉里的下线设置和退出登录) */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition cursor-pointer select-none border ${
                      isUserMenuOpen
                        ? 'bg-slate-200/90 border-slate-300 text-slate-900 shadow-xs'
                        : 'hover:bg-slate-200/60 border-transparent text-slate-700'
                    }`}
                    title="点击展开操作菜单"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                      {currentUser.name.slice(0, 1)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-[11px] font-semibold leading-none text-slate-800">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {currentUser.phone}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {/* 下拉展开菜单 */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                      {/* 登录人物基本信息 */}
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200 shrink-0">
                          {currentUser.name.slice(0, 1)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800 truncate">{currentUser.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="在线中" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{currentUser.phone}</span>
                        </div>
                      </div>

                      {/* 下拉选项 1: 下线设置 */}
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLoopOfflineModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium">下线设置</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                              loopOfflineConfig.isOffline
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : loopOfflineConfig.scheduledOfflineEnabled
                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {loopOfflineConfig.isOffline
                              ? '已下线'
                              : loopOfflineConfig.scheduledOfflineEnabled
                              ? '已设定时'
                              : '未开启'}
                          </span>
                        </button>
                      </div>

                      <div className="h-px bg-slate-100 my-1 mx-2" />

                      {/* 下拉选项 2: 退出登录 */}
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span className="font-medium">退出登录</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Window Body: 4 Top-Nav Pages */}
            <div className="flex-1 flex overflow-hidden">
              {/* 页面 1：「招聘」—— 展示左侧岗位列表和右侧独立网页模拟内容 */}
              {activeView === 'recruit' && (
                <>
                  <OrbitSidebar
                    jobs={jobs}
                    selectedJobId={selectedJobId}
                    onSelectJob={(id) => setSelectedJobId(id)}
                    onOpenJobDetail={(job) => setDrawerJob(job)}
                    onOpenNewJob={() => setIsNewJobOpen(true)}
                    onOpenSyncJob={() => setIsJobSyncModalOpen(true)}
                    theme={theme}
                  />
                  <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                    <YupaoBrowser
                      currentJob={currentJob}
                      candidates={jobCandidates}
                      activeCandidate={activeCandidate}
                      onSelectCandidate={setActiveCandidate}
                      isChatOpen={isChatOpen}
                      onToggleChat={setIsChatOpen}
                      chatMessages={chatMessages}
                      onSendMessage={handleSendMessage}
                      isInspectingResume={isInspectingResume}
                      onToggleResume={setIsInspectingResume}
                      automationStepId={steps[currentStepIndex]?.id || 1}
                      theme={theme}
                    />
                  </div>
                </>
              )}

              {/* 页面 2：「岗位」 */}
              {activeView === 'jobs' && (
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                  <JobManagementView
                    jobs={jobs}
                    selectedJobId={selectedJobId}
                    onSelectJob={setSelectedJobId}
                    onOpenNewJob={() => setIsNewJobOpen(true)}
                    onOpenSyncJob={() => setIsJobSyncModalOpen(true)}
                    onUpdateJob={handleUpdateJob}
                    onToggleJobLoop={handleToggleJobLoop}
                    onOpenLoopSettings={handleOpenLoopSettings}
                    logs={traceLogs}
                    onClearLogs={() => setTraceLogs([])}
                    theme={theme}
                  />
                </div>
              )}

              {/* 页面 3：「候选人」 */}
              {activeView === 'candidates' && (
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                  <CandidatePoolView
                    jobs={jobs}
                    selectedJobId={selectedJobId}
                    onSelectJob={setSelectedJobId}
                    currentJob={currentJob}
                    candidates={jobCandidates}
                    activeCandidate={activeCandidate}
                    onSelectCandidate={setActiveCandidate}
                    onSwitchToBrowser={() => setActiveView('recruit')}
                    theme={theme}
                  />
                </div>
              )}

              {/* 页面 4：「数据」 */}
              {activeView === 'analytics' && (
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                  <RecruitmentAnalyticsView
                    jobs={jobs}
                    searchedCount={recruitmentMetrics.searchedCount}
                    communicatedCount={recruitmentMetrics.communicatedCount}
                    contactsCapturedCount={recruitmentMetrics.contactsCapturedCount}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* New Job Modal (⌘ K) */}
      <NewJobModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        onAddJob={handleAddJob}
      />

      {/* Dev Redundancy Slot Modal (非标开发冗余插槽与调试) */}
      <DevRedundancyModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        config={devConfig}
        onUpdateConfig={setDevConfig}
        traceLogs={traceLogs}
        onClearLogs={() => setTraceLogs([])}
        theme={theme}
      />

      {/* Job Sync Flow Modal */}
      <JobSyncModal
        isOpen={isJobSyncModalOpen}
        onClose={() => setIsJobSyncModalOpen(false)}
        onSyncCompleted={handleSyncCompleted}
        theme={theme}
      />

      {/* Loop 执行与下线/定时下线设置弹窗 */}
      <LoopOfflineModal
        isOpen={isLoopOfflineModalOpen}
        onClose={() => setIsLoopOfflineModalOpen(false)}
        config={loopOfflineConfig}
        onUpdateConfig={setLoopOfflineConfig}
        isRunning={Boolean(currentJob.loopRunning)}
        onTogglePlayPause={() => handleToggleJobLoop(currentJob.id)}
        onImmediateOffline={handleImmediateOffline}
        onImmediateOnline={handleImmediateOnline}
        currentJobTitle={currentJob.title}
        theme={theme}
      />

      {/* 职位详情抽屉 / 弹窗 (右侧滑出展示职位详情、岗位知识库与任务日志) */}
      {drawerJob && (
        <div
          className="fixed inset-0 z-[99999] flex justify-end bg-slate-900/35 backdrop-blur-xs animate-in fade-in"
          onClick={() => setDrawerJob(null)}
        >
          <div
            className="w-full max-w-5xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <JobDetailView
              key={drawerJob.id}
              job={drawerJob}
              isDrawer={true}
              allJobs={jobs}
              onSelectJob={(newId) => {
                setSelectedJobId(newId);
                const target = jobs.find((j) => j.id === newId);
                if (target) setDrawerJob(target);
              }}
              onBack={() => setDrawerJob(null)}
              onSaveJob={(updated) => {
                handleUpdateJob(updated);
                setDrawerJob(updated);
              }}
              logs={traceLogs}
              onClearLogs={() => setTraceLogs([])}
              onToggleJobLoop={handleToggleJobLoop}
              onOpenLoopSettings={handleOpenLoopSettings}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* 定时下线全局通知 Toast */}
      {offlineNoticeToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[99999999] px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white shadow-2xl backdrop-blur-md border border-white/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{offlineNoticeToast}</span>
          <button
            onClick={() => setOfflineNoticeToast(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
