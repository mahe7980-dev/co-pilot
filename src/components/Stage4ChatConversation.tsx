import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  DollarSign,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Code,
  Lock,
  Layers,
  MessageSquare,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  ChatMessage,
  ChatTurnAnalysis,
  ExtractedInfo,
  IntentType,
  NextActionType,
  JobParsed
} from '../types';

interface Stage4ChatConversationProps {
  jobTitle: string;
  candidateName: string;
  candidateProfile: string;
  knowledgeBase: Record<string, any>;
  toConfirmList: string[];
  messages: ChatMessage[];
  onSendMessage: (candidateText: string) => Promise<void>;
  extractedInfo: ExtractedInfo;
  latestAnalysis: ChatTurnAnalysis | null;
  isLoading: boolean;
  onNext: () => void;
  onViewJson: (title: string, data: any) => void;
  candidateQuickReplies: string[];
  onSimulateCandidate: () => Promise<void>;
  isSimulatingCandidate: boolean;
}

export const Stage4ChatConversation: React.FC<Stage4ChatConversationProps> = ({
  jobTitle,
  candidateName,
  candidateProfile,
  knowledgeBase,
  toConfirmList,
  messages,
  onSendMessage,
  extractedInfo,
  latestAnalysis,
  isLoading,
  onNext,
  onViewJson,
  candidateQuickReplies,
  onSimulateCandidate,
  isSimulatingCandidate,
}) => {
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleQuickSend = async (text: string) => {
    if (isLoading) return;
    await onSendMessage(text);
  };

  const getIntentBadge = (intent: IntentType) => {
    switch (intent) {
      case 'interested':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">interested (积极有意向)</span>;
      case 'asking':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">asking (询问细节)</span>;
      case 'hesitant':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">hesitant (观望犹豫)</span>;
      case 'rejecting':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">rejecting (明确婉拒)</span>;
      case 'sent_resume':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">sent_resume (已提供联系方式/简历)</span>;
      case 'other':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">other (其他/异议)</span>;
    }
  };

  const getActionBadge = (action: NextActionType) => {
    switch (action) {
      case 'continue':
        return <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">continue (继续沟通)</span>;
      case 'request_resume':
        return <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">request_resume (发起索要简历/电话)</span>;
      case 'end':
        return <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">end (结束沟通)</span>;
      case 'handoff':
        return <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-600 text-white animate-pulse">handoff (触发红线转人工)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold font-mono">
              P7 核心任务
            </span>
            <h2 className="text-base font-bold text-slate-900">拟真对话意图识别 & 关键线索转化</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            由【候选人对话 Agent】执行：单条 <span className="font-semibold text-blue-700">30~80 字</span>，
            严格依据岗位知识库，核实待确认问题，顺势获取电话/微信/简历，红线异议自动触发转人工。
          </p>
        </div>
        {latestAnalysis && (
          <button
            onClick={() => onViewJson('P7 最新一轮对话决策 JSON', latestAnalysis)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium shadow-xs transition shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <span>查看最新轮 JSON</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Chat Room (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Chat Room Top Bar */}
          <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                  {candidateName?.slice(0, 1) || '候'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{candidateName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    候选人在线沟通
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                  沟通岗位：{jobTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={onSimulateCandidate}
                disabled={isSimulatingCandidate || isLoading}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="AI 模拟候选人以第一人称自然回复"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulatingCandidate ? 'animate-spin' : ''}`} />
                <span>{isSimulatingCandidate ? '候选人打字中...' : 'AI 候选人拟真回复'}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs">
                暂无消息，请通过 P6 生成打招呼语开启对话
              </div>
            ) : (
              messages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <span className="text-[10px] px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-medium">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        isAgent ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[78%] space-y-1 ${isAgent ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                        <span>{isAgent ? 'AI 招聘助理' : candidateName}</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isAgent
                            ? 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                            : 'bg-emerald-600 text-white rounded-tr-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Display turn metadata if analyzed */}
                      {msg.analysis && isAgent && (
                        <div className="flex items-center gap-1.5 px-1 pt-0.5 text-[10px] text-slate-500">
                          <span className="font-mono">意图: {msg.analysis.intent}</span>
                          <span>·</span>
                          <span className="font-mono">动作: {msg.analysis.next_action}</span>
                          <span>·</span>
                          <span>字数: {msg.text.length}字</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span>AI 招聘助理正在根据岗位知识库解析回复...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Scenario Chips for Candidate */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>快速扮演候选人回复 (一键测试):</span>
              <span className="text-[10px]">点击即可填入并发送</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidateQuickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSend(qr)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] transition text-left cursor-pointer truncate max-w-[280px]"
                >
                  {qr}
                </button>
              ))}
              {/* Intentional test chips */}
              <button
                onClick={() => handleQuickSend('我要求底薪3.5万以上加每个月8000车补，你们达不到就叫你们经理出来！')}
                disabled={isLoading}
                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] transition cursor-pointer"
                title="测试超额薪资红线与转人工机制"
              >
                🚨 测试过高薪资红线
              </button>
              <button
                onClick={() => handleQuickSend('你是机器人吗？叫你们人工HR来跟我聊！')}
                disabled={isLoading}
                className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] transition cursor-pointer"
                title="测试要求人工接管红线"
              >
                ⚠️ 测试要求人工接管
              </button>
            </div>
          </div>

          {/* Candidate Text Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`以候选人身份输入消息回复招聘助理...`}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发送</span>
            </button>
          </div>

        </div>

        {/* Right Column: AI Agent Decision Brain & Extracted State (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Handoff Alert Banner (if triggered) */}
          {latestAnalysis?.next_action === 'handoff' && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-md space-y-2 animate-bounce-short">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <span>⚠️ 触发招聘安全红线：系统已自动转人工处理！</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                <span className="font-semibold">转人工原因:</span> {latestAnalysis.handoff_reason || '候选人提出超出权限或特殊要求'}
              </p>
              <div className="p-2 rounded bg-white/80 border border-rose-200 text-[11px] text-slate-700">
                符合总规矩第4条：绝不做出超出权限承诺，遇到严重投诉、超出上限薪资或特殊要求立即转人工接管。
              </div>
            </div>
          )}

          {/* Extracted Key Information Dashboard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                关键信息实时抽取看板
              </h3>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                P7 extracted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {/* Willing */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    <span>看机会意向 (willing)</span>
                  </span>
                </div>
                <div className="font-bold text-slate-900">
                  {extractedInfo.willing === true ? (
                    <span className="text-emerald-700">✓ 明确有意向</span>
                  ) : extractedInfo.willing === false ? (
                    <span className="text-rose-600">✗ 暂无意向/婉拒</span>
                  ) : (
                    <span className="text-slate-400 font-normal">待明确</span>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span>预计到岗 (start_date)</span>
                  </span>
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {extractedInfo.start_date || <span className="text-slate-400 font-normal">待沟通确认</span>}
                </div>
              </div>

              {/* Salary Expectation */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-blue-500" />
                    <span>期望薪资 (salary)</span>
                  </span>
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {extractedInfo.salary_expect || <span className="text-slate-400 font-normal">未透露</span>}
                </div>
              </div>

              {/* Contact Info (Lock Target!) */}
              <div
                className={`p-2.5 rounded-xl border space-y-1 ${
                  extractedInfo.contact_info
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold text-emerald-800">联系方式 (核心目标)</span>
                  </span>
                  {extractedInfo.contact_info && <Lock className="w-3 h-3 text-emerald-600" />}
                </div>
                <div className="font-bold text-sm text-emerald-900 truncate font-mono">
                  {extractedInfo.contact_info || <span className="text-slate-400 text-xs font-normal">待索要获取</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Latest Decision & Intent Brain Card */}
          {latestAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                本轮 Agent 意图识别与下一步决策
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">识别候选人意图 (intent):</span>
                  <div>{getIntentBadge(latestAnalysis.intent)}</div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">下一步动作 (next_action):</span>
                  <div>{getActionBadge(latestAnalysis.next_action)}</div>
                </div>
              </div>
            </div>
          )}

          {/* To-Confirm Checklist Tracking */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                待确认清单核实进度 ({toConfirmList.length} 项)
              </h3>
            </div>
            <div className="space-y-1.5">
              {toConfirmList.map((item, idx) => {
                const isLikelyDone =
                  (item.includes('到岗') && !!extractedInfo.start_date) ||
                  (item.includes('薪资') && !!extractedInfo.salary_expect) ||
                  (item.includes('意向') && extractedInfo.willing !== null);

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                      isLikelyDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>• {item}</span>
                    <span className="text-[10px] font-semibold">
                      {isLikelyDone ? '✓ 已确认' : '待追问'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grounding Knowledge Base Inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">知识库严格边界 (禁止随意承诺):</span>
            <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <p><span className="font-semibold text-slate-800">薪资结构:</span> {knowledgeBase.salary || knowledgeBase.salary_range}</p>
              <p><span className="font-semibold text-slate-800">工作地点:</span> {knowledgeBase.location || knowledgeBase.work_location}</p>
              <p><span className="font-semibold text-slate-800">工时班次:</span> {knowledgeBase.work_hours}</p>
            </div>
          </div>

          {/* Proceed to Stage 5 Button */}
          <div className="pt-2">
            <button
              onClick={onNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>沟通就绪，生成 HR 推荐交付总结 (P9)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
