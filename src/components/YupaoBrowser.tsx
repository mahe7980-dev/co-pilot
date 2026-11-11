import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ChevronDown,
  MoreHorizontal,
  Search,
  Bell,
  SlidersHorizontal,
  Phone,
  FileText,
  MessageSquare,
  Users,
  Building2,
  ShoppingBag,
  Heart,
  LayoutGrid,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { OrbitJob, YupaoCandidate, OrbitChatMessage } from '../types/orbit';
import { YupaoChatView } from './YupaoChatView';

interface YupaoBrowserProps {
  currentJob: OrbitJob;
  candidates: YupaoCandidate[];
  activeCandidate: YupaoCandidate | null;
  onSelectCandidate: (candidate: YupaoCandidate) => void;
  isChatOpen: boolean;
  onToggleChat: (open: boolean) => void;
  chatMessages: OrbitChatMessage[];
  onSendMessage: (text: string) => void;
  isInspectingResume: boolean;
  onToggleResume: (open: boolean) => void;
  automationStepId: number;
  theme?: 'dark' | 'light';
}

export const YupaoBrowser: React.FC<YupaoBrowserProps> = ({
  currentJob,
  candidates,
  activeCandidate,
  onSelectCandidate,
  isChatOpen,
  onToggleChat,
  chatMessages,
  onSendMessage,
  isInspectingResume,
  onToggleResume,
  automationStepId,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  // Yupao Tab Navigation: 'search' (搜索牛人) | 'chat' (沟通)
  const [yupaoTab, setYupaoTab] = useState<'search' | 'chat'>('search');

  // Automatically switch to chat view when automation reaches greeting (P6), chat (P7), or delivery (P9)
  useEffect(() => {
    if (automationStepId >= 3) {
      setYupaoTab('chat');
    }
  }, [automationStepId]);

  const [chatInput, setChatInput] = useState('');
  const [district, setDistrict] = useState('丰台区');
  const [keyword, setKeyword] = useState(currentJob.yupaoSearchKeyword || '保洁清洁工');
  const [searchInput, setSearchInput] = useState('');

  // Filters State
  const [activeAgeFilter, setActiveAgeFilter] = useState('不限');
  const [activeEduFilter, setActiveEduFilter] = useState('不限');
  const [activeExpFilter, setActiveExpFilter] = useState('不限');
  const [activeCollegeFilter, setActiveCollegeFilter] = useState('不限');

  const handleSend = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative select-none transition-colors duration-200 ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#0b0d13] text-slate-100'
      }`}
    >
      
      {/* Browser Address Bar */}
      <div
        className={`px-4 py-2 border-b flex items-center gap-2 text-xs shrink-0 transition-colors ${
          isLight
            ? 'bg-[#f4f5f8] border-[#d8dce6]'
            : 'bg-[#141724] border-[#1f2538]'
        }`}
      >
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        <div
          className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-1.5 font-mono text-xs ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800 shadow-2xs'
              : 'bg-[#0d0f18] border-[#232a3f] text-slate-300'
          }`}
        >
          <Lock className="w-3 h-3 text-emerald-500" />
          <span className={isLight ? 'text-slate-400' : 'text-slate-400'}>https://</span>
          <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
            www.yupao.com
          </span>
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
            {yupaoTab === 'search'
              ? `/zhipin/search?district=${encodeURIComponent(district)}&job=${encodeURIComponent(keyword)}`
              : `/zhipin/chat?candidateId=${encodeURIComponent(activeCandidate?.id || 'song')}`}
          </span>
        </div>
        <MoreHorizontal className="w-4 h-4 opacity-60 cursor-pointer hover:opacity-100" />
      </div>

      {/* 3. Authentic 鱼泡直聘 Web Interface (Exact replica of user's uploaded image) */}
      <div className="flex-1 flex overflow-hidden bg-[#f4f7fa] text-slate-800">
        
        {/* 鱼泡 Left Dark Navigation Bar */}
        <div className="w-44 bg-[#0d141e] text-slate-400 flex flex-col justify-between shrink-0 select-none border-r border-slate-800 hidden md:flex">
          <div>
            {/* 鱼泡 Logo */}
            <div className="h-14 px-4 flex items-center gap-2 border-b border-slate-800/80">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-xs">
                <span className="font-black text-xs">鱼</span>
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">鱼泡直聘</span>
            </div>

            {/* Menu List */}
            <nav className="p-2 space-y-1 text-xs">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>职位管理</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <Users className="w-4 h-4 text-slate-400" />
                <span>推荐牛人</span>
              </div>
              {/* Menu Item 1: 搜索牛人 */}
              <div
                onClick={() => setYupaoTab('search')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition ${
                  yupaoTab === 'search'
                    ? 'bg-[#15273d] text-[#0091ff] font-bold border border-[#1890ff]/30 shadow-xs'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Search className={`w-4 h-4 ${yupaoTab === 'search' ? 'text-[#0091ff]' : 'text-slate-400'}`} />
                <span>搜索牛人</span>
              </div>

              {/* Menu Item 2: 沟通 (with red 4 badge matching Image 1) */}
              <div
                onClick={() => setYupaoTab('chat')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                  yupaoTab === 'chat'
                    ? 'bg-[#15273d] text-[#0091ff] font-bold border border-[#1890ff]/30 shadow-xs'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`w-4 h-4 ${yupaoTab === 'chat' ? 'text-[#0091ff]' : 'text-slate-400'}`} />
                  <span>沟通</span>
                </div>
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
                <span>互动</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>公司管理</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>道具商城</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer">
                <Heart className="w-4 h-4 text-slate-400" />
                <span>团体意外险</span>
              </div>
            </nav>
          </div>

        </div>

        {/* 鱼泡 Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f7fa]">
          
          {/* Top Bar of Yupao Portal */}
          <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="font-bold text-sm text-slate-900">
              {yupaoTab === 'search' ? '搜索牛人' : '沟通'}
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-600">
              <div className="relative cursor-pointer">
                <Bell className="w-4 h-4 text-slate-500 hover:text-slate-800" />
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  2
                </span>
              </div>
              <span className="hover:text-blue-600 cursor-pointer">职位发布规则</span>
              <span className="hover:text-blue-600 cursor-pointer">我的客服</span>
              <span className="hover:text-blue-600 cursor-pointer">面试</span>
              <span className="hover:text-blue-600 cursor-pointer">招聘数据</span>
              <span className="hover:text-blue-600 cursor-pointer">账号权益</span>
              <span className="hover:text-blue-600 cursor-pointer text-[#0091ff] font-medium">升级VIP</span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="font-semibold text-slate-800">马先生</span>
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-blue-700">
                  马
                </div>
              </div>
            </div>
          </div>

          {yupaoTab === 'chat' ? (
            <YupaoChatView
              currentJob={currentJob}
              candidates={candidates}
              activeCandidate={activeCandidate || candidates[0]}
              onSelectCandidate={onSelectCandidate}
              chatMessages={chatMessages}
              onSendMessage={onSendMessage}
              onOpenResumeDrawer={() => onToggleResume(true)}
              theme={theme}
            />
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Search Bar Strip */}
              <div className="p-4 sm:p-5 max-w-6xl mx-auto w-full space-y-4">
                {/* Giant Composite Search Bar */}
                <div className="bg-white rounded-xl border-2 border-[#008aff] p-1 shadow-sm flex items-center">
                  {/* Dropdown 1: District */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-200 text-xs font-semibold text-slate-800 shrink-0 cursor-pointer hover:bg-slate-50 rounded-l-lg">
                <span>{district}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown 2: Job Category */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-200 text-xs font-semibold text-slate-800 shrink-0 cursor-pointer hover:bg-slate-50">
                <span>{keyword}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Input: Search keyword */}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索你想要的牛人"
                className="flex-1 px-3 py-1.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400"
              />

              {/* Big Blue Search Button */}
              <button className="px-6 py-2 bg-[#008aff] hover:bg-[#007ae6] text-white rounded-lg flex items-center justify-center transition cursor-pointer shadow-xs">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Filter Matrix Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5 text-xs text-slate-600">
              
              {/* Row 1: 年龄要求 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-slate-400 w-16 text-right">年龄要求：</span>
                  {['不限', '20-25', '25-30', '30-35', '35-40', '40-50', '50以上', '自定义'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveAgeFilter(item)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition ${
                        activeAgeFilter === item ? 'text-[#008aff] font-bold' : 'hover:text-slate-900'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="hover:underline cursor-pointer">筛选说明</span>
                  <span>|</span>
                  <span className="hover:underline cursor-pointer">清空筛选</span>
                </div>
              </div>

              {/* Row 2: 学历要求 */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-slate-400 w-16 text-right">学历要求：</span>
                {['不限', '初中及以下', '中专/中技', '高中', '大专', '本科', '硕士', '博士'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveEduFilter(item)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      activeEduFilter === item ? 'text-[#008aff] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <span className="text-slate-400 text-[10px]">(可选)</span>
              </div>

              {/* Row 3: 院校类别 */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-slate-400 w-16 text-right">院校类别：</span>
                {['不限', '985', '211', '双一流', '留学', '海内外名校', '重点专科'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveCollegeFilter(item)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      activeCollegeFilter === item ? 'text-[#008aff] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <span className="text-slate-400 text-[10px]">(可选)</span>
              </div>

              {/* Row 4: 经验要求 */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-slate-400 w-16 text-right">经验要求：</span>
                {['不限', '在校/应届', '26年毕业', '27年毕业', '27年后毕业', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上', '自定义'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveExpFilter(item)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                      activeExpFilter === item ? 'text-[#008aff] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Row 5: 其他筛选下拉 */}
              <div className="flex items-center flex-wrap gap-3 pt-1 border-t border-slate-100">
                <span className="text-slate-400 w-16 text-right">其他筛选：</span>
                {['性别', '薪资区间', '牛人活跃度', '求职状态', '专业'].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px] cursor-pointer"
                  >
                    <span>{f}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>

              {/* Checkboxes Row */}
              <div className="flex items-center gap-5 pt-2 text-[11px] text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#008aff]" />
                  <span>近14天没有联系过</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#008aff]" />
                  <span>近30天没有联系过</span>
                </label>
                <span className="text-slate-300">|</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#008aff]" />
                  <span>近14天没有和同事联系过</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#008aff]" />
                  <span>近30天没有和同事联系过</span>
                </label>
              </div>

            </div>

            {/* Candidates List with Right Floating Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Candidate Cards Column (9 cols) */}
              <div className="lg:col-span-9 space-y-3">
                {candidates.map((cand) => {
                  const isCurrent = activeCandidate?.id === cand.id;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => onSelectCandidate(cand)}
                      className={`p-4 bg-white rounded-xl border transition-all cursor-pointer relative ${
                        isCurrent
                          ? 'border-[#008aff] ring-2 ring-[#008aff]/20 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Active Agent Target Indicator */}
                      {isCurrent && (
                        <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <Sparkles className="w-3 h-3 animate-spin" />
                          <span>AI 招聘智能体 正在执行初筛与自动化微聊</span>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Avatar with Gender Badge & Online Status */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="relative">
                            <div className="w-13 h-13 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-slate-500 font-bold text-lg">
                              {cand.name.slice(0, 1)}
                            </div>
                            {/* Gender Badge (blue for male, pink for female) */}
                            <span
                              className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                                cand.gender === '女' ? 'bg-pink-500' : 'bg-blue-500'
                              }`}
                            >
                              {cand.gender === '女' ? '♀' : '♂'}
                            </span>
                          </div>

                          <span className="mt-1 text-[10px] px-1.5 py-0.2 rounded font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {cand.id === 'cleaner_xia' ? '● 在线' : '3天内活跃'}
                          </span>
                        </div>

                        {/* Middle Info */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900">{cand.name}</h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCandidate(cand);
                                onToggleChat(true);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-blue-500 transition cursor-pointer"
                              title="电话直呼"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            {cand.verified && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-200 font-medium">
                                实名
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span>{cand.age}岁</span>
                            <span>|</span>
                            <span className="text-slate-700 font-medium">{cand.status}</span>
                          </div>

                          <p className="text-xs text-slate-700 line-clamp-1 leading-snug">
                            {cand.resumeDetails.workHistory[0]?.desc || cand.skills}
                          </p>

                          {/* Work Experience Row if present */}
                          {cand.resumeDetails.workHistory.length > 0 && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                              <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="font-mono text-slate-400">
                                {cand.resumeDetails.workHistory[0].period}
                              </span>
                              <span className="font-medium text-slate-700 truncate">
                                {cand.resumeDetails.workHistory[0].company} · {cand.resumeDetails.workHistory[0].role}
                              </span>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cand.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Expectation & Actions */}
                        <div className="text-right shrink-0 space-y-2">
                          <div className="text-xs text-slate-600">
                            <span>期望：</span>
                            <span className="font-bold text-[#008aff]">{cand.city} · {cand.salary}</span>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCandidate(cand);
                                onToggleResume(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition cursor-pointer"
                            >
                              查看简历
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCandidate(cand);
                                setYupaoTab('chat');
                              }}
                              className="px-3 py-1 bg-[#008aff] hover:bg-[#007ae6] text-white rounded text-xs font-semibold transition cursor-pointer shadow-xs"
                            >
                              立即沟通
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Sidebar Widget (3 cols) */}
              <div className="lg:col-span-3 space-y-3">
                {/* 搜索畅聊卡 Widget */}
                <div className="bg-gradient-to-b from-[#eaf4ff] to-[#f4f9ff] rounded-2xl border border-blue-200/80 p-4 text-center space-y-3 shadow-2xs">
                  <div className="font-bold text-xs text-slate-800">搜索畅聊卡</div>
                  <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-8 h-8 text-[#008aff]" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    无限制解锁牛人联系方式，极速直聘
                  </p>
                  <button className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-[#008aff] border border-[#008aff] rounded-lg text-xs font-semibold transition cursor-pointer">
                    查看详情
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

        </div>
      </div>

      {/* Embedded Candidate Resume Drawer */}
      {isInspectingResume && activeCandidate && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#008aff]" />
                <span className="font-bold text-sm">鱼泡简历客观核验 · {activeCandidate.name}</span>
              </div>
              <button
                onClick={() => onToggleResume(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Profile Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeCandidate.name}</h3>
                  <p className="text-slate-500 mt-0.5">{activeCandidate.gender} · {activeCandidate.age}岁 · 学历: {activeCandidate.resumeDetails.education}</p>
                  <p className="text-emerald-700 font-semibold mt-1">求职状态: {activeCandidate.status}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-base text-[#008aff]">{activeCandidate.salary}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{activeCandidate.city}</p>
                </div>
              </div>

              {/* Verified Certificates */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  从业认证与健康合格证明
                </span>
                <div className="space-y-1">
                  {activeCandidate.resumeDetails.certs.map((cert, cIdx) => (
                    <div key={cIdx} className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                      ✓ {cert}
                    </div>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#008aff]" />
                  过往履历 (P3 客观判断依据)
                </span>
                <div className="space-y-2">
                  {activeCandidate.resumeDetails.workHistory.map((w, wIdx) => (
                    <div key={wIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold text-slate-900">{w.company}</span>
                        <span className="text-[11px] font-mono text-slate-500">{w.period}</span>
                      </div>
                      <span className="font-medium text-[#008aff] block">{w.role}</span>
                      <p className="text-slate-600 leading-relaxed text-[11px] pt-1">{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights extracted by Agent */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 space-y-1.5">
                <span className="font-bold text-xs flex items-center gap-1 text-purple-900">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  P3 提取履历亮点 (供 P6 打招呼使用)
                </span>
                <div className="space-y-1 text-[11px]">
                  {activeCandidate.resumeDetails.highlights.map((h, hIdx) => (
                    <div key={hIdx}>• {h}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  onToggleResume(false);
                  setYupaoTab('chat');
                }}
                className="px-4 py-2 bg-[#008aff] hover:bg-[#007ae6] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>进入微聊沟通</span>
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
