import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Database,
  Upload,
  Check,
  Copy,
  FileText,
  CheckCircle2,
  Play,
  Settings,
  ClipboardList,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { OrbitJob, JobProjectDetails, DevTraceLog } from '../../types/orbit';
import { getJobProjectDetails } from '../../data/jobProjectData';

interface JobDetailViewProps {
  job: OrbitJob;
  onBack: () => void;
  onSaveJob: (updatedJob: OrbitJob) => void;
  isDrawer?: boolean;
  initialTab?: 'detail' | 'rag' | 'logs';
  allJobs?: OrbitJob[];
  onSelectJob?: (jobId: string) => void;
  logs?: DevTraceLog[];
  onClearLogs?: () => void;
  onToggleJobLoop?: (jobId: string) => void;
  onOpenLoopSettings?: (job: OrbitJob) => void;
  theme?: 'dark' | 'light';
}

type MarkStyle = 'marker' | 'wavy' | 'line';

interface MarkedEntry {
  text: string;
  style: MarkStyle;
}

interface UploadedKbFile {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  status: '已上传' | '上传中';
  type?: 'table_image' | 'doc';
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  onSaveJob,
  isDrawer = false,
  initialTab = 'detail',
  logs = [],
  onClearLogs,
  onToggleJobLoop,
  onOpenLoopSettings,
}) => {
  // 顶部三个一级 Tab：'detail' (职位详情) | 'rag' (岗位知识库) | 'logs' (任务日志)
  const [activeMainTab, setActiveMainTab] = useState<'detail' | 'rag' | 'logs'>(initialTab);

  useEffect(() => {
    setActiveMainTab(initialTab);
  }, [initialTab]);

  // 是否已在知识库中上传并解析招聘项目需求表截图
  const [isTableParsed, setIsTableParsed] = useState<boolean>(
    Boolean(job.hasParsedRequirementTable ?? true)
  );
  const [isParsingTable, setIsParsingTable] = useState<boolean>(false);
  const [uploadedTableFileName, setUploadedTableFileName] = useState<string>(
    '招聘项目需求表_京东南京日常保洁.png'
  );

  const [formData, setFormData] = useState<JobProjectDetails>(() => {
    return (
      job.projectDetails ||
      getJobProjectDetails(job.id, job.title, job.category, job.salaryExpect)
    );
  });

  // 知识库已上传文件列表（包含需求表截图与文档）
  const [kbFiles, setKbFiles] = useState<UploadedKbFile[]>([
    {
      id: 'f_table',
      name: `招聘项目需求表_${job.title}.png`,
      size: '680 KB',
      uploadTime: '今日 10:12',
      status: '已上传',
      type: 'table_image',
    },
    {
      id: 'f_1',
      name: `${job.title}_岗位标准问答与作业规范.pdf`,
      size: '1.2 MB',
      uploadTime: '今日 10:15',
      status: '已上传',
      type: 'doc',
    },
  ]);

  useEffect(() => {
    setFormData(
      job.projectDetails ||
        getJobProjectDetails(job.id, job.title, job.category, job.salaryExpect)
    );
    setIsTableParsed(Boolean(job.hasParsedRequirementTable ?? true));
    setUploadedTableFileName(`招聘项目需求表_${job.title}.png`);
    setKbFiles([
      {
        id: 'f_table',
        name: `招聘项目需求表_${job.title}.png`,
        size: '680 KB',
        uploadTime: '今日 10:12',
        status: '已上传',
        type: 'table_image',
      },
      {
        id: 'f_1',
        name: `${job.title}_岗位标准问答与作业规范.pdf`,
        size: '1.2 MB',
        uploadTime: '今日 10:15',
        status: '已上传',
        type: 'doc',
      },
    ]);
  }, [job]);

  // 文本内联标记列表（选中文字时弹出悬浮工具栏进行标记）
  const [markedList, setMarkedList] = useState<MarkedEntry[]>([
    { text: '8000-11000元/月', style: 'marker' },
    { text: '每个小时是35块5，从第三个月开始，大约在8千到1.1w', style: 'marker' },
    { text: '首租干满26天第2月报销第一个月租金', style: 'wavy' },
    { text: '直接宣导整体投入549', style: 'marker' },
    { text: '不搬重物、不登高作业，油烟机仅做表面去污除尘，不涉及深度拆洗', style: 'line' },
    { text: '女性 21-48周岁（以身份证为准）', style: 'line' },
  ]);

  const [selectionPopup, setSelectionPopup] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    existingStyle?: MarkStyle;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  });

  const [saveToast, setSaveToast] = useState<string | null>(null);
  const kbFileInputRef = useRef<HTMLInputElement>(null);

  // 点击空白处关闭划词悬浮工具栏
  useEffect(() => {
    const handleMouseDownOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-mark-toolbar="true"]')) {
        return;
      }
      setSelectionPopup((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    document.addEventListener('mousedown', handleMouseDownOutside);
    return () => document.removeEventListener('mousedown', handleMouseDownOutside);
  }, []);

  // 处理鼠标松开时检测选中文本并弹出悬浮工具条
  const handleMouseUpSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const text = sel.toString().trim();
    if (!text || text.length < 1 || text.length > 160) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const existing = markedList.find((m) => m.text === text);

    setSelectionPopup({
      visible: true,
      x: Math.max(140, Math.min(window.innerWidth - 140, rect.left + rect.width / 2)),
      y: Math.max(70, rect.top - 10),
      text,
      existingStyle: existing?.style,
    });
  };

  const handleMarkedSpanClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    entry: MarkedEntry
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectionPopup({
      visible: true,
      x: Math.max(140, Math.min(window.innerWidth - 140, rect.left + rect.width / 2)),
      y: Math.max(70, rect.top - 10),
      text: entry.text,
      existingStyle: entry.style,
    });
  };

  const applyMarkStyle = (style: MarkStyle) => {
    const targetText = selectionPopup.text.trim();
    if (!targetText) return;

    setMarkedList((prev) => {
      const existing = prev.find((m) => m.text === targetText);
      if (existing && existing.style === style) {
        return prev.filter((m) => m.text !== targetText);
      }
      const filtered = prev.filter((m) => m.text !== targetText);
      return [...filtered, { text: targetText, style }];
    });

    window.getSelection()?.removeAllRanges();
    setSelectionPopup((prev) => ({ ...prev, visible: false }));
  };

  const handleCopySelectedText = () => {
    const targetText = selectionPopup.text;
    if (!targetText) return;
    navigator.clipboard?.writeText(targetText);
    window.getSelection()?.removeAllRanges();
    setSelectionPopup((prev) => ({ ...prev, visible: false }));
    setSaveToast('已复制选中内容');
    setTimeout(() => setSaveToast(null), 1800);
  };

  const getMarkSpanClass = (style: MarkStyle) => {
    switch (style) {
      case 'marker':
        return 'bg-[#fde047]/85 text-slate-900 rounded-xs px-0.5 shadow-[inset_0_-2px_0_rgba(234,179,8,0.4)] cursor-pointer transition hover:brightness-95';
      case 'wavy':
        return 'underline decoration-wavy decoration-[#f59e0b] decoration-2 underline-offset-4 text-slate-900 cursor-pointer transition hover:bg-amber-50/70';
      case 'line':
        return 'underline decoration-[#3b82f6] decoration-2 underline-offset-4 text-slate-900 cursor-pointer transition hover:bg-blue-50/70';
    }
  };

  const renderMarkableText = (content?: string | number) => {
    const str = String(content ?? '');
    if (!str || markedList.length === 0) return str;

    const sortedMarks = [...markedList]
      .filter((m) => m.text && str.includes(m.text))
      .sort((a, b) => b.text.length - a.text.length);

    if (sortedMarks.length === 0) return str;

    let segments: Array<{ text: string; mark?: MarkedEntry }> = [{ text: str }];

    for (const mark of sortedMarks) {
      const nextSegments: Array<{ text: string; mark?: MarkedEntry }> = [];
      for (const seg of segments) {
        if (seg.mark || !seg.text.includes(mark.text)) {
          nextSegments.push(seg);
          continue;
        }
        const parts = seg.text.split(mark.text);
        parts.forEach((part, idx) => {
          if (part) nextSegments.push({ text: part });
          if (idx < parts.length - 1) {
            nextSegments.push({ text: mark.text, mark });
          }
        });
      }
      segments = nextSegments;
    }

    return segments.map((seg, i) =>
      seg.mark ? (
        <span
          key={i}
          onClick={(e) => handleMarkedSpanClick(e, seg.mark!)}
          className={getMarkSpanClass(seg.mark.style)}
          title="点击可切换标记样式或取消标记"
        >
          {seg.text}
        </span>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      )
    );
  };

  // 在岗位知识库中上传文件或需求表截图并解析
  const handleKbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(12, Math.round(file.size / 1024))} KB`;

    const isImage = file.type.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(file.name);
    const newFileId = `f_${Date.now()}`;

    setIsParsingTable(true);
    setKbFiles((prev) => [
      {
        id: newFileId,
        name: file.name,
        size: sizeStr,
        uploadTime: '刚刚',
        status: '已上传',
        type: isImage ? 'table_image' : 'doc',
      },
      ...prev,
    ]);

    setTimeout(() => {
      setIsParsingTable(false);
      setIsTableParsed(true);
      setUploadedTableFileName(file.name);
      onSaveJob({
        ...job,
        hasParsedRequirementTable: true,
      });
      setSaveToast(`已上传并解析「${file.name}」至岗位知识库`);
      setTimeout(() => setSaveToast(null), 2400);
    }, 500);

    e.target.value = '';
  };

  const dutyLines = formData.jobDesc
    .split(/[；;。\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // 岗位标签列表
  const jobTags =
    formData.highlights && formData.highlights.length > 0
      ? formData.highlights
      : ['长白班', '就近派单', '提供宿舍', '免费培训'];

  // 当前岗位的专属日志流
  const jobLogs = logs.filter((l) => !l.jobId || l.jobId === job.id);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none bg-[#f2f4f7] text-slate-800 relative">
      {/* ==================== 选中文字时弹出的悬浮标记工具栏 ==================== */}
      {selectionPopup.visible && (
        <div
          data-mark-toolbar="true"
          style={{
            position: 'fixed',
            left: `${selectionPopup.x}px`,
            top: `${selectionPopup.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="z-[999999] select-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="bg-[#323338] text-white rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 flex items-center gap-1">
            <button
              onClick={handleCopySelectedText}
              className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer min-w-[54px]"
            >
              <Copy className="w-4 h-4 text-slate-100 mb-1" />
              <span className="text-[11px] text-slate-200 font-medium leading-none">复制</span>
            </button>

            <button
              onClick={() => applyMarkStyle('marker')}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition cursor-pointer min-w-[54px] ${
                selectionPopup.existingStyle === 'marker' ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-4 h-4 rounded-[3px] bg-[#f5b851] text-[#232326] font-serif font-bold text-xs flex items-center justify-center mb-1 leading-none">
                A
              </div>
              <span className="text-[11px] text-slate-200 font-medium leading-none">马克笔</span>
            </button>

            <button
              onClick={() => applyMarkStyle('wavy')}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition cursor-pointer min-w-[54px] ${
                selectionPopup.existingStyle === 'wavy' ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-4 h-4 flex flex-col items-center justify-center mb-1">
                <span className="text-xs font-serif font-medium text-slate-100 leading-none">A</span>
                <svg className="w-4 h-1 text-slate-100 -mt-0.5" viewBox="0 0 16 4" fill="none">
                  <path
                    d="M1 2.5C2.5 0.8 4 4.2 5.5 2.5C7 0.8 8.5 4.2 10 2.5C11.5 0.8 13 4.2 14.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[11px] text-slate-200 font-medium leading-none">波浪线</span>
            </button>

            <button
              onClick={() => applyMarkStyle('line')}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition cursor-pointer min-w-[54px] ${
                selectionPopup.existingStyle === 'line' ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-4 h-4 flex flex-col items-center justify-center mb-1">
                <span className="text-xs font-serif font-medium text-slate-100 leading-none">A</span>
                <span className="w-3.5 h-[1.5px] bg-slate-100 rounded-full mt-0.5" />
              </div>
              <span className="text-[11px] text-slate-200 font-medium leading-none">直线</span>
            </button>
          </div>
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#323338] mx-auto" />
        </div>
      )}

      {/* ==================== 1. 顶部导航栏：返回与岗位名（不切换岗位）+ 三个核心 Tab + 右侧合并的运行中/启停按钮 ==================== */}
      <div className="px-6 py-3 bg-white border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* 左侧：仅保留返回与当前岗位名称 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-bold text-base transition cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>{job.title}</span>
          </button>
        </div>

        {/* 中部：三个一级 Tab（职位详情 / 岗位知识库 / 任务日志） */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveMainTab('detail')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'detail'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>职位详情</span>
          </button>

          <button
            onClick={() => setActiveMainTab('rag')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'rag'
                ? 'bg-white text-purple-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>岗位知识库</span>
          </button>

          <button
            onClick={() => setActiveMainTab('logs')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'logs'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>任务日志</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-600 font-mono">
              {jobLogs.length}
            </span>
          </button>
        </div>

        {/* 右侧：运行中状态与启动/停止合并为一个按钮 + 设置按钮 */}
        <div className="flex items-center gap-2">
          {saveToast && (
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{saveToast}</span>
            </div>
          )}

          {onToggleJobLoop && (
            <button
              onClick={() => onToggleJobLoop(job.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
                job.loopRunning
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={job.loopRunning ? '当前运行中，点击停止' : '当前已停止，点击启动运行'}
            >
              {job.loopRunning ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>运行中 · 停止</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-600" />
                  <span>启动运行</span>
                </>
              )}
            </button>
          )}

          {onOpenLoopSettings && (
            <button
              onClick={() => onOpenLoopSettings(job)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
              title="当前岗位下线与定时设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {isDrawer && (
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              title="关闭抽屉"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ==================== 2. 主体内容区：根据 activeMainTab 切换 ==================== */}
      {activeMainTab === 'detail' && (
        /* ==================== TAB 1: 职位详情（纯净展示鱼泡基本字段，上传解析已移至岗位知识库） ==================== */
        <div
          onMouseUp={handleMouseUpSelection}
          onScroll={() =>
            selectionPopup.visible &&
            setSelectionPopup((prev) => ({ ...prev, visible: false }))
          }
          className="flex-1 overflow-y-auto p-6 space-y-5 select-text"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            {/* 合并简化后的单张基本信息与职责要求大卡片 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              {/* 顶部：标题 + 岗位标签 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900">
                    {renderMarkableText(job.title)}
                  </h2>

                  {/* 岗位标签 */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {jobTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {renderMarkableText(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 核心基础字段网格：岗位名称、地点、薪资范围、周期、学历要求、经验要求、招聘有效期 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">岗位名称</span>
                  <span className="font-bold text-slate-900 mt-1 block truncate">
                    {renderMarkableText(job.title)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">工作地点</span>
                  <span className="font-bold text-slate-900 mt-1 block truncate" title={job.address}>
                    {renderMarkableText(job.address || formData.address)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">薪资范围</span>
                  <span className="font-bold text-slate-900 font-mono mt-1 block">
                    {renderMarkableText(job.salaryExpect)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">入职周期</span>
                  <span className="font-bold text-slate-900 mt-1 block">
                    {renderMarkableText(formData.cyclePeriod || '3-7天')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">学历要求</span>
                  <span className="font-bold text-slate-900 mt-1 block">
                    {renderMarkableText(formData.education || '不限')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">经验要求</span>
                  <span className="font-bold text-slate-900 mt-1 block truncate" title={formData.experience}>
                    {renderMarkableText(formData.experience || '经验不限')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">招聘有效期</span>
                  <span className="font-bold text-slate-900 font-mono mt-1 block">
                    {renderMarkableText(formData.deadlineDate || '2026-12-31')}
                  </span>
                </div>
              </div>

              {/* 岗位职责 + 任职要求（合并展示在同一卡片中） */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900">岗位职责</div>
                  {dutyLines.map((line, index) => {
                    const cleanLine = line.replace(/^[1-9][、.．]\s*/, '');
                    return (
                      <div key={index}>
                        {index + 1}、{renderMarkableText(cleanLine)}。
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900">任职要求</div>
                  {formData.certs.map((c, idx) => {
                    const cleanCert = c.replace(/^[1-9][、.．]\s*/, '');
                    return (
                      <div key={idx}>
                        {idx + 1}、{renderMarkableText(cleanCert)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === 'rag' && (
        /* ==================== TAB 2: 岗位知识库（包含上传需求表截图/文档与解析内容） ==================== */
        <div
          onMouseUp={handleMouseUpSelection}
          onScroll={() =>
            selectionPopup.visible &&
            setSelectionPopup((prev) => ({ ...prev, visible: false }))
          }
          className="flex-1 overflow-y-auto p-6 select-text"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>岗位知识库</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    上传招聘需求表截图、培训手册或 FAQ 文档，解析补充岗位知识供微聊自动应答
                  </p>
                </div>

                <input
                  ref={kbFileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xlsx,.xls,.txt"
                  className="hidden"
                  onChange={handleKbFileUpload}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isParsingTable}
                    onClick={() => kbFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isParsingTable ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>上传需求表截图/文件解析</span>
                  </button>
                </div>
              </div>

              {/* 已上传文件列表 */}
              <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden">
                {kbFiles.map((f) => (
                  <div
                    key={f.id}
                    className="px-4 py-3 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {f.type === 'table_image' ? (
                        <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 truncate">
                        {f.name}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] shrink-0">
                        {f.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-slate-400">{f.uploadTime}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 上传需求表截图解析出来的补充内容（已从职位详情移入岗位知识库） */}
              {isTableParsed && (
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/aistudio/__2026-11-10_13.41.26_fe4c3ea9.png"
                        alt="招聘项目需求表"
                        className="w-8 h-6 object-cover rounded border border-slate-200"
                      />
                      <span className="font-bold text-slate-800">
                        需求表截图解析知识内容（{uploadedTableFileName}）
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 leading-relaxed">
                    <div className="md:col-span-2">
                      <span className="text-slate-400">薪资明细：</span>
                      <span>{renderMarkableText(formData.payNote)}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-400">其他福利：</span>
                      <span>{renderMarkableText(formData.otherWelfare)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">工作时间：</span>
                      <span>{renderMarkableText(formData.workHours)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">面试流程：</span>
                      <span>{renderMarkableText(formData.interviewProcess)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">住宿与餐饮：</span>
                      <span>{renderMarkableText(`${formData.dorm}；${formData.meal}`)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">发薪与保险：</span>
                      <span>{renderMarkableText(`${formData.payDay}；${formData.insurance}`)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMainTab === 'logs' && (
        /* ==================== TAB 3: 任务日志 ==================== */
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    job.loopRunning
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      【{job.title}】任务日志
                    </h2>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        job.loopRunning
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {job.loopRunning ? '● 运行中' : '○ 已停止'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    实时记录当前岗位的候选人检索 (P1)、客观初筛 (P3)、破冰招呼 (P6)、微聊转化 (P7) 与简报生成 (P9)
                  </p>
                </div>
              </div>

              {onClearLogs && jobLogs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>清空日志</span>
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>执行时间轴与动作明细 ({jobLogs.length} 条)</span>
                <span className="text-[11px] font-mono text-slate-400">
                  JOB_ID: {job.id}
                </span>
              </div>

              {jobLogs.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  暂无该岗位的任务日志，启动运行后将实时写入执行记录
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {jobLogs.map((log) => (
                    <div
                      key={log.id}
                      className="px-5 py-3.5 hover:bg-slate-50/80 transition flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-mono text-[11px] text-slate-400 shrink-0 mt-0.5">
                          {log.timestamp}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                            log.type === 'AI'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : log.type === 'DOM'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : log.type === 'HOOK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {log.type}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800">{log.message}</div>
                          {log.detail && (
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                              {log.detail}
                            </div>
                          )}
                        </div>
                      </div>

                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
