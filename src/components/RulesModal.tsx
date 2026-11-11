import React, { useState } from 'react';
import { X, ShieldCheck, MessageSquare, BookOpen, Copy, Check } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'expert' | 'chat' | 'p1' | 'p3' | 'p6' | 'p7' | 'p9'>('expert');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">招聘 Agent 规矩宪法与核心 Prompt 规范</h2>
              <p className="text-xs text-slate-400">客观严谨 · 证据链锁定 · 知识库安全边界 · 纯结构化交付</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('expert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'expert' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚖️ 招聘匹配专家总规矩
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'chat' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 候选人对话Agent总规矩
          </button>
          <button
            onClick={() => setActiveTab('p1')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'p1' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P1 岗位标准解析
          </button>
          <button
            onClick={() => setActiveTab('p3')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'p3' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P3 在线简历初筛
          </button>
          <button
            onClick={() => setActiveTab('p6')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'p6' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P6 个性化打招呼
          </button>
          <button
            onClick={() => setActiveTab('p7')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'p7' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P7 对话与线索转化
          </button>
          <button
            onClick={() => setActiveTab('p9')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'p9' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P9 推荐理由与交付
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-sm text-slate-700 leading-relaxed space-y-4">
          {activeTab === 'expert' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <h3 className="font-bold text-sm text-emerald-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  招聘匹配专家总规矩 (4大铁律)
                </h3>
                <p className="text-xs text-emerald-800 mb-3">
                  你是一名客观、严谨的招聘匹配专家，负责根据岗位需求对候选人简历进行匹配度评估与信息提炼。在进行任何判断和解析时，你必须严格遵守以下原则：
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-900">1. 原文依据：</span>
                    所有判断必须以候选人简历或本人明确沟通的原文内容为依据，并在输出中提供原文字句（evidence）。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-900">2. 不做主观臆断：</span>
                    简历中未提及的内容一律标记为 "unknown"（未知），严禁擅自假定为“不满足”；“参与过”绝不等于“独立负责过”。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-900">3. 禁止歧视：</span>
                    严禁对候选人的年龄、性别、婚育状态、民族、健康状况等非职业能力信息做推断或作为淘汰依据。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-900">4. 格式规范：</span>
                    严格按照系统指定的 JSON 结构输出结果，严禁包含任何 JSON 之外的修饰文字。
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                <h3 className="font-bold text-sm text-blue-900 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-700" />
                  候选人对话 Agent 总规矩 (5大准则)
                </h3>
                <p className="text-xs text-blue-800 mb-3">
                  你是负责招聘沟通的 AI 招聘助理，代表公司与候选人沟通。沟通中必须严格遵守以下准则：
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-blue-900">1. 身份与基调：</span>
                    语气专业、亲切、礼貌、简洁，单条回复通常控制在 30~80 字以内，避免机械化套话和群发感。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-blue-900">2. 严格基于知识库：</span>
                    对于薪资结构、福利待遇、办公地点、工作模式及面试流程，必须严格基于提供的【岗位知识库】回答。知识库中未说明的，切勿自行承诺或编造，需说明“会协助向主管/HR确认后答复”或视情况建议转人工接管。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-blue-900">3. 核心目标：</span>
                    明确候选人的基本意愿，确认初筛留下的“待确认问题”，并尽可能在合适时机促成交换电话、微信或索要附件简历。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-blue-900">4. 安全红线：</span>
                    绝不主动询问婚育、隐私等敏感问题；绝不做出超出权限的录用承诺；遇到候选人情绪激烈、严重投诉或提出特殊要求时，立即标记转人工。
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-blue-900">5. 格式规范：</span>
                    每轮沟通分析与回复必须严格按指定 JSON 输出。
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'p1' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">P1 岗位标准解析 Prompt</h3>
              <p className="text-xs text-slate-500">
                将原始岗位 JD 拆解为可逐条验证的结构化匹配标准清单，区分 priority (must / exclude / plus)，合规拦截歧视性表述，并提取 FAQ 知识库。
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`【任务】
请将以下原始岗位 JD 拆解为可逐条验证的结构化匹配标准清单。

【拆解规则】
1. 区分优先级：
   - must（必须项）：缺少该项即直接不符合岗位要求（如必要工种证书、硬性技能要求、硬性最低年限等）。
   - exclude（排他项）：明确禁止或不接受的情况。
   - plus（加分项）：具备更佳，但不满足不影响录用。
2. 合规拦截：自动剔除或拦截原 JD 中的歧视性表述（如仅限男性、限35岁以下等）。如果模型自行推断出某些隐性要求，仅可标记为 priority 为 "plus" 或作为备注建议，不得擅自升级为 "must"。
3. 标准表述需具体、可判定，避免“沟通能力强”等无法从简历直接判定的抽象描述。

【输出格式】
{
  "criteria": [
    {
      "id": "c1",
      "priority": "must | exclude | plus",
      "description": "具体标准描述，如：具备高空作业证并在有效期内",
      "field": "证书/经验/年限/技能"
    }
  ],
  "faq_extract": {
    "salary_range": "薪资范围",
    "work_location": "工作地点"
  }
}`}
              </pre>
            </div>
          )}

          {activeTab === 'p3' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">P3 在线简历初筛 Prompt</h3>
              <p className="text-xs text-slate-500">
                逐条核验候选人是否满足要求，状态限定为 met / not_met / unknown / conflict。必须原样引用 evidence。提取 highlights 与 to_confirm。
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`【判定规则】
1. 状态必须为以下四种之一：
   - met：简历有明确证据满足
   - not_met：简历有明确证据不满足
   - unknown：简历未提及（切勿判为 not_met）
   - conflict：简历内存在前后矛盾
2. 每个判断必须在 evidence 字段中原样引用简历片段；未提及则写 null。
3. 提取候选人的 1~2 个真实履历亮点（供打招呼使用）。
4. 列出需要对话 Agent 在聊天中确认的问题清单（to_confirm），如到岗时间、出差意愿等。

【输出格式】
{
  "stage": "screen",
  "criteria": [
    {
      "id": "c1",
      "priority": "must | exclude | plus",
      "status": "met | not_met | unknown | conflict",
      "evidence": "简历原文语句或 null",
      "note": "判断说明"
    }
  ],
  "highlights": ["候选人的技能或过往亮点，如：有3年大型桥梁钢结构焊接经验"],
  "to_confirm": ["目前是否已离职可随时到岗", "能否接受驻场工作"],
  "level": "A | B | C",
  "summary": "一句话初筛概括"
}`}
              </pre>
            </div>
          )}

          {activeTab === 'p6' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">P6 个性化打招呼语 Prompt</h3>
              <p className="text-xs text-slate-500">
                为刚通过初筛的候选人生成定制沟通语句。40~90字，自然融入初筛亮点，抛出低门槛互动问题，严禁暴露初筛标签。
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`【要求】
1. 字数控制在 40~90 字以内，自然、得体，体现看过他的简历，坚决杜绝生硬的模板感和群发腔。
2. 必须自然融入【初筛亮点】中的 1 个具体优势点（如项目类型、技能工种或经验年限）。
3. 抛出一个低门槛的互动问题，吸引候选人回复。
4. 严禁暴露评分、初筛标签或歧视性词汇。

【输出格式】
{
  "greeting": "打招呼内容"
}`}
              </pre>
            </div>
          )}

          {activeTab === 'p7' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">P7 对话与索要联系方式/简历 Prompt</h3>
              <p className="text-xs text-slate-500">
                理解意图（interested / asking / hesitant / rejecting / sent_resume / other），提取关键信息（willing, start_date, salary_expect, contact_info），基于知识库回复，判断下一步动作（continue / request_resume / end / handoff）。
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`【输出格式】
{
  "intent": "interested | asking | hesitant | rejecting | sent_resume | other",
  "extracted": {
    "willing": true,
    "start_date": "随时到岗 / 一个月内 / null",
    "salary_expect": "提取到的期望薪资或 null",
    "contact_info": "提取到的手机号/微信号或 null"
  },
  "reply": "要发送给候选人的回复文本（30~80字）",
  "next_action": "continue | request_resume | end | handoff",
  "handoff_reason": null
}`}
              </pre>
            </div>
          )}

          {activeTab === 'p9' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">P9 推荐理由与交付总结 Prompt</h3>
              <p className="text-xs text-slate-500">
                整理候选人推荐摘要交付给 HR 或用人部门主管，包含核心推荐理由、已确认项、候选人态度、潜在风险、以及一句话汇报。
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`【输出格式】
{
  "recommend_reason": "核心推荐理由（结合技能匹配度与亮点）",
  "confirmed_items": {
    "期望薪资": "xx",
    "到岗时间": "xx",
    "联系方式": "xx"
  },
  "candidate_attitude": "积极 | 正常 | 谨慎",
  "potential_risks": "可能存在的风险点或需人工面试进一步确认的事项",
  "hr_one_liner": "一句话汇报（如：5年特种焊工经验，技术扎实，薪资期望在范围内，随时到岗，已取得电话）"
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">本系统所有 API 均严格绑定上述 Prompt 结构化执行</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            关闭窗口
          </button>
        </div>

      </div>
    </div>
  );
};
