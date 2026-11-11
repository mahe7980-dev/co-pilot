export interface JobKnowledgeItem {
  id: string;
  category: '薪酬结算' | '食宿条件' | '工时班次' | '证件与体检' | '日常规章' | '其他';
  question: string;
  answer: string;
  tags: string[];
  updatedTime: string;
}

export interface JobProjectDetails {
  // 1. 基本信息
  reqName: string; // 需求名称
  manager: string; // 项目经理
  managerContact: string; // 项目经理联系方式

  // 2. 项目信息
  projectName: string; // 项目名称
  clientName: string; // 甲方名称
  needCount: number; // 需求人数/缺口
  netCount: number; // 净招人数
  cyclePeriod: string; // 工单运用周期
  recruitPeriod: string; // 招聘周期
  deadlineDate: string; // 最晚启动日期
  bizType: string; // 业务性质 (e.g. 岗位外包)
  workType: string; // 用工性质 (e.g. 全职/灵活用工)
  hasSubsidy: boolean; // 是否有补贴
  subsidyAmount?: string; // 补贴金额
  subsidyCondition?: string; // 补贴条件
  returnFeeMode?: string; // 返费模式 (标准返费/特珠返费)
  returnFeeType?: string; // 返费方式 (按在职时长返费/按出勤时长返费)
  returnFeePeriod?: string; // 返费时长 (e.g. 3个月)
  returnFeeAmount?: string; // 返费金额 (e.g. 450元/月)

  // 3. 职位信息
  jobDesc: string; // 职位描述
  duties: string; // 招聘职责
  workFormat: string; // 作业形式 (全网/驻场)
  empType: string; // 用工类型
  highlights: string[]; // 项目亮点
  education: string; // 学历要求 (不限/初中/高中/大专)
  experience: string; // 经验要求 (不限/1年/3年以上)
  interviewTime: string; // 面试时间
  city: string; // 工作城市
  address: string; // 工作地址
  workHours: string; // 工作时间 (e.g. 上五休二)
  shiftType: string; // 工作时间说明 (朝九晚五/两班倒)
  salaryRange: string; // 薪资范围 (e.g. 4500 - 6000 元/月)
  settleType: string; // 结算方式 (月结/日结/完工结)
  isPublished: boolean; // 是否发布职位

  // 4. 面试及入职流程
  interviewAddress: string; // 面试地址
  onboardTime: string; // 入职时间
  interviewProcess: string; // 面试流程
  materials: string[]; // 入职材料 (健康证、身份证原件、银行卡等)
  examFee: string; // 体检费用说明
  resignNotice: string; // 离职说明 (提前7天申请等)

  // 5. 薪资福利
  payDay: string; // 发薪日 (e.g. 每月15日)
  payNote: string; // 薪资情况说明
  calcType: string; // 计薪方式 (综合工时制/标准工时制)
  bankReq: string; // 银行卡要求 (各大国有银行/不限)
  contractNote: string; // 合同说明
  insurance: string; // 保险说明 (五险/商业雇主险)
  dorm: string; // 住宿环境 (标准4人间/提供夫妻房/独立卫浴)
  meal: string; // 餐饮说明 (包三餐/餐补30元/天)
  otherWelfare?: string; // 其他补贴

  // 6. 特殊说明
  gender: string; // 性别要求
  nation: string; // 民族要求
  ageRange: string; // 年龄要求
  certs: string[]; // 技能证书要求
  locationNote: string; // 地域说明
  healthExam: string; // 体检说明
  uniform: boolean; // 是否需要穿工服
  workEnv: string; // 工作环境

  // 7. 常见问题
  postSubsidy: string; // 岗位补贴
  forbiddenIntro: string; // 禁止对接录入介绍内容
  forbiddenCrowd: string[]; // 禁入特殊人群
  allowedCrowd: string[]; // 可入特殊人群
  sameProjectRecommend: string; // 不匹配候选人推荐同类项目
  others?: string; // 其他说明
}

export interface OrbitJob {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  salaryExpect: string;
  requirements: string[];
  yupaoSearchKeyword: string;
  candidateCount: number;

  // 扩展需求字段
  loopRunning?: boolean; // 该岗位是否已启动 Loop
  hasParsedRequirementTable?: boolean; // 是否已上传并解析招聘需求表截图
  vacancyCount?: number; // 缺口人数
  address?: string; // 工作地址/产业园
  employer?: string; // 招聘方/用工单位
  projectDetails?: JobProjectDetails; // 详细项目交付配置
  knowledgeBase?: JobKnowledgeItem[]; // 岗位知识库 RAG
}

export interface YupaoCandidate {
  id: string;
  name: string;
  gender: string;
  age: number;
  experience: string;
  salary: string;
  city: string;
  status: string; // e.g. "离职-随时到岗"
  tags: string[];
  skills: string;
  avatarBg: string;
  verified: boolean;
  resumeDetails: {
    education: string;
    certs: string[];
    workHistory: {
      period: string;
      company: string;
      role: string;
      desc: string;
    }[];
    highlights: string[];
    toConfirm: string[];
  };
  phone?: string;
  wechat?: string;
}

export interface AutomationStep {
  id: number;
  title: string;
  code: string;
  status: 'pending' | 'running' | 'completed' | 'paused';
  log: string;
  evidence?: string;
}

export interface OrbitChatMessage {
  id: string;
  sender: 'agent' | 'candidate' | 'system';
  text: string;
  time: string;
  intent?: string;
  contactExtracted?: string;
}

export interface DevConfig {
  // DOM & RPA Simulation Redundancy
  typingSpeedJitter: boolean;
  typingDelayMs: number;
  smoothScroll: boolean;
  mouseBezierCurve: boolean;
  captchaStrategy: 'pause_and_alert' | 'webhook_notify' | 'manual_switch';
  customDomSelectors: {
    searchInput: string;
    greetButton: string;
    chatWindow: string;
    contactBadge: string;
  };

  // Lifecycle Hooks Redundancy
  hookBeforeScreen: boolean;
  hookAfterGreeting: boolean;
  hookOnContactCaptured: boolean;

  // External Integration / Webhook Redundancy
  webhookUrl: string;
  webhookFormat: 'feishu' | 'wecom' | 'custom_json';
  enableWebhookPush: boolean;

  // Model & Prompt Redundancy
  temperature: number;
  customPromptPatch: string;
  knowledgeBaseOverride: string;

  // Trace & Log Redundancy
  enableLiveDomTrace: boolean;
}

export interface DevTraceLog {
  id: string;
  timestamp: string;
  type: 'DOM' | 'AI' | 'HOOK' | 'NET' | 'RULE' | 'SYS';
  message: string;
  detail?: string;
  jobId?: string; // 关联的职位 ID
  jobTitle?: string; // 关联的职位名称
}

export interface LoopOfflineConfig {
  isOffline: boolean; // 是否已下线 (OFFLINE)
  scheduledOfflineEnabled: boolean; // 是否开启定时下线
  offlineType: 'duration' | 'time' | 'quota'; // 倒计时 / 具体时刻 / 达到联系人配额
  durationMinutes: number; // 例如 30分钟
  scheduledTime: string; // 例如 18:00
  quotaContacts: number; // 例如 10 个联系方式
  targetTimestamp?: number; // 目标下线时间戳 (毫秒)
}
