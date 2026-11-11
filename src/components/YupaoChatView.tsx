import React, { useState } from 'react';
import {
  FileText,
  Paperclip,
  RotateCcw,
  Search,
  ChevronDown,
  Smile,
  MapPin,
  Image as ImageIcon,
  Send,
  Star,
  Bookmark,
  Edit3,
  ShieldAlert,
  Ban,
  Phone,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
} from 'lucide-react';
import { OrbitJob, YupaoCandidate, OrbitChatMessage } from '../types/orbit';

interface YupaoChatViewProps {
  currentJob: OrbitJob;
  candidates: YupaoCandidate[];
  activeCandidate: YupaoCandidate;
  onSelectCandidate: (candidate: YupaoCandidate) => void;
  chatMessages: OrbitChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenResumeDrawer: () => void;
  theme?: 'dark' | 'light';
}

export const YupaoChatView: React.FC<YupaoChatViewProps> = ({
  currentJob,
  candidates,
  activeCandidate,
  onSelectCandidate,
  chatMessages,
  onSendMessage,
  onOpenResumeDrawer,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 1. Top Filter Tabs from authentic Yupao (图1)
  const [activeTopTab, setActiveTopTab] = useState('全部');
  const topTabs = [
    { key: '全部', label: '全部' },
    { key: '新招呼', label: '新招呼(2)•', badge: 2 },
    { key: '仅沟通', label: '仅沟通' },
    { key: '已约面', label: '已约面' },
    { key: '已交换电话', label: '已交换电话' },
    { key: '已交换微信', label: '已交换微信' },
    { key: '已获取简历', label: '已获取简历' },
    { key: '牛人发起', label: '牛人发起' },
    { key: '我发起', label: '我发起' },
    { key: '不合适', label: '不合适' },
  ];

  // 2. Chat list sub-filter
  const [subFilter, setSubFilter] = useState('全部');
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none bg-[#f4f7fa]">
      
      {/* ======================================================== */}
      {/* 1. TOP FILTER TABS BAR (图1 鱼泡直聘真实顶部标签)          */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200 shrink-0 shadow-2xs">
        <div className="px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {topTabs.map((tab) => {
            const isActive = activeTopTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTopTab(tab.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#e6f4ff] text-[#008aff] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TWO-COLUMN AUTHENTIC CHAT WORKSPACE (左列表 + 右聊天)   */}
      {/* ======================================================== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* ------------------------------------------------------ */}
        {/* COLUMN 1: 沟通牛人列表                                 */}
        {/* ------------------------------------------------------ */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          
          {/* Top Search & Filter Dropdown in Chat List */}
          <div className="p-3 border-b border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer hover:bg-slate-100">
                <span>全部职位</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <button className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-tabs: 全部 / 未读 / 牛人已读未回 / 批量 */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-3 font-medium">
                {['全部', '未读', '牛人已读未回'].map((st) => (
                  <span
                    key={st}
                    onClick={() => setSubFilter(st)}
                    className={`cursor-pointer transition ${
                      subFilter === st ? 'text-[#008aff] font-bold' : 'hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </span>
                ))}
              </div>
              <span className="text-slate-400 hover:text-slate-700 cursor-pointer text-[11px]">
                批量
              </span>
            </div>
          </div>

          {/* Candidates Chat Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {candidates.map((cand) => {
              const isSelected = activeCandidate.id === cand.id;

              return (
                <div
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition relative ${
                    isSelected
                      ? 'bg-[#f0f7ff] border-l-4 border-l-[#008aff]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Candidate Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-xs ${
                        cand.gender === '女' ? 'bg-pink-500' : 'bg-blue-600'
                      }`}
                    >
                      {cand.name.slice(0, 1)}
                    </div>
                    {cand.status.includes('新招呼') && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        2
                      </span>
                    )}
                  </div>

                  {/* Candidate Info & Last Message */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {cand.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {currentJob.title} | {cand.age}岁
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {cand.status.includes('在线') ? '刚刚' : cand.status.includes('新招呼') ? '10分钟前' : '今天'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <p className="text-slate-500 truncate pr-2">
                        {cand.phone && cand.id === activeCandidate.id && chatMessages.some(m => m.contactExtracted)
                          ? `已交换电话: ${cand.phone}`
                          : cand.status.includes('新招呼')
                          ? `[新招呼] 您好，请问${currentJob.title}还招人吗？`
                          : `您好！请问${currentJob.title}的工作地点和排班是在哪呢？`}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {cand.salary}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 text-center text-xs text-slate-400">没有更多了</div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* COLUMN 2: 完整对话沟通主视窗                            */}
        {/* ------------------------------------------------------ */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          
          {/* Candidate Conversation Header */}
          <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  {activeCandidate.name}
                </span>
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold ${
                    activeCandidate.gender === '女' ? 'bg-pink-500' : 'bg-blue-500'
                  }`}
                >
                  {activeCandidate.gender === '女' ? '♀' : '♂'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-emerald-600 font-medium">当前在线</span>
                <span className="text-xs text-slate-500">{activeCandidate.age}岁</span>
              </div>
            </div>

            {/* Resume Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenResumeDrawer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#008aff] hover:bg-[#007be6] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>在线简历</span>
              </button>

              <button
                onClick={onOpenResumeDrawer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#13c2c2] hover:bg-[#0eb3b3] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>附件简历</span>
              </button>
            </div>
          </div>

          {/* Subheader banner: 期望 与 沟通职位 */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400">期望：</span>
                <span className="font-medium text-slate-800">
                  {activeCandidate.city} · {currentJob.title} · {activeCandidate.salary}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">沟通职位：</span>
                <span className="font-semibold text-slate-900">{currentJob.title}</span>
                <RotateCcw className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-600" />
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          {/* Chat Container with Right Vertical Tool Strip */}
          <div className="flex-1 flex min-h-0 relative">
            
            {/* Message History & Live Conversation Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#fafbfd]">
              
              {/* Timestamp Notice */}
              <div className="text-center">
                <span className="text-[11px] text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  14:23 对方向你发起了沟通
                </span>
              </div>

              {/* 1. Candidate's initial inquiry */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                    activeCandidate.gender === '女' ? 'bg-pink-500' : 'bg-blue-600'
                  }`}
                >
                  {activeCandidate.name.slice(0, 1)}
                </div>

                <div className="space-y-1 max-w-lg">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-800 shadow-2xs leading-relaxed">
                    您好，请问目前【{currentJob.title}】还在招人吗？工作地点和薪资结算方式具体是怎样的呢？
                  </div>
                </div>
              </div>

              {/* 2. System Matching Card from Recruiter */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  马
                </div>

                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{currentJob.title}</span>
                    <span className="text-xs font-mono font-bold text-[#008aff]">{currentJob.salaryExpect}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {currentJob.category.split('/')[0] || currentJob.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> 北京市{activeCandidate.city.split('·')[0].trim() || '丰台区'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    岗位要求：{currentJob.requirements.join('；')}。工作规范，按时发放工资，提供工伤保险。
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      该牛人来自系统自动匹配
                    </span>
                    <span className="text-slate-400">已在线发送岗位卡片</span>
                  </div>
                </div>
              </div>

              {/* 3. AI Agent Intelligent Response */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#008aff] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="space-y-1 max-w-lg">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-800 shadow-2xs leading-relaxed space-y-1">
                    <p>
                      {activeCandidate.name}老师您好！我们目前正在招聘【{currentJob.title}】，工作地点在<strong>北京市{activeCandidate.city.split('·')[0].trim() || '丰台区'}</strong>，综合薪资为 {currentJob.salaryExpect}。
                    </p>
                    <p className="text-slate-600 pt-0.5">
                      看到您在【{activeCandidate.tags[0] || '本行业'}】方面有多年的从业经验，非常符合我们的用工标准。请问您目前最快什么时候方便到岗呢？
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Candidate Reply */}
              <div className="flex items-start justify-end gap-3">
                <div className="space-y-1 max-w-lg text-right">
                  <div className="p-3.5 bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tr-xs text-xs text-left shadow-2xs leading-relaxed">
                    我目前是离职状态，随时都可以到岗的！我的电话是{' '}
                    <span className="font-bold text-[#008aff]">
                      {activeCandidate.phone || '13810239988'}
                    </span>
                    ，微信号也是这个，麻烦加下我发下具体的报道地点和时间！
                  </div>
                  <span className="text-[10px] text-slate-400 pr-1">14:24</span>
                </div>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                    activeCandidate.gender === '女' ? 'bg-pink-500' : 'bg-blue-600'
                  }`}
                >
                  {activeCandidate.name.slice(0, 1)}
                </div>
              </div>

              {/* 5. AI Agent Confirmation & Contact Captured */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#008aff] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="space-y-1 max-w-lg">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-800 shadow-2xs leading-relaxed space-y-1">
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>已收到您的联系电话: {activeCandidate.phone || '13810239988'}</span>
                    </div>
                    <p>
                      太好了！已成功登记您的手机号码 <strong>{activeCandidate.phone || '13810239988'}</strong>。我们用工主管稍后会直接致电您同步详细乘车路线与到岗试岗流程，请留意接听电话！
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Extra Messages */}
              {chatMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAgent ? '' : 'justify-end'}`}
                  >
                    {isAgent && (
                      <div className="w-9 h-9 rounded-full bg-[#008aff] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`space-y-1 max-w-lg ${isAgent ? '' : 'text-right'}`}>
                      <div
                        className={`p-3.5 text-xs rounded-2xl shadow-2xs leading-relaxed ${
                          isAgent
                            ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                            : 'bg-[#e6f4ff] border border-blue-200 text-slate-900 rounded-tr-xs text-left'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                    </div>

                    {!isAgent && (
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                          activeCandidate.gender === '女' ? 'bg-pink-500' : 'bg-blue-600'
                        }`}
                      >
                        {activeCandidate.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Edge: Authentic Floating Action Tools from 图1 */}
            <div className="w-11 border-l border-slate-200 bg-white flex flex-col items-center py-4 space-y-4 text-slate-400 shrink-0">
              <button title="置顶聊天" className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Bookmark className="w-4 h-4" />
              </button>
              <button title="收藏标星" className="p-1.5 hover:text-amber-500 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Star className="w-4 h-4" />
              </button>
              <button title="写备注" className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
              <button title="举报投诉" className="p-1.5 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button title="标记不合适" className="p-1.5 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Ban className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Chat Action Toolbar */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendMessage('方便发一份您的详细简历附件吗？我同步用工部门审核。')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  求简历
                </button>
                <button
                  onClick={() => onSendMessage('方便交换下您的电话号码吗？稍后主管直接与您沟通面试。')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  换电话
                </button>
                <button
                  onClick={() => onSendMessage('方便留一下您的微信号吗？我发您详细的班次与地址定位。')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  换微信
                </button>
                <button
                  onClick={() => onSendMessage('我们诚挚邀请您明天上午到门店现场面试试岗，请问您方便吗？')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  约面试
                </button>
                <button
                  onClick={() => onSendMessage('感谢您的关注，目前该班次名额已满，祝您求职顺利！')}
                  className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:text-slate-700 text-xs transition cursor-pointer"
                >
                  不合适
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                善语结善缘，恶言伤人心
              </span>
            </div>

            {/* Input & Emoticons Bar */}
            <div className="relative border border-slate-300 rounded-xl bg-white focus-within:border-[#008aff] transition p-2">
              <div className="flex items-center gap-3 pb-1 text-slate-400 border-b border-slate-100 mb-1">
                <Smile className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                <span className="text-[11px] font-medium hover:text-slate-700 cursor-pointer">常</span>
                <MapPin className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                <ImageIcon className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
              </div>

              <textarea
                rows={2}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="发送消息..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none resize-none bg-transparent"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  按Enter键发送，按Ctrl+Enter键换行 · {chatInput.length}/300
                </span>
                <button
                  onClick={handleSend}
                  disabled={!chatInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#008aff] hover:bg-[#007ae6] text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-40"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
