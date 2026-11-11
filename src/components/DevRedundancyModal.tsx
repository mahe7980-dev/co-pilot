import React, { useState } from 'react';
import {
  X,
  Code2,
  Sliders,
  Webhook,
  Terminal,
  ShieldAlert,
  Play,
  RotateCcw,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { DevConfig, DevTraceLog } from '../types/orbit';

interface DevRedundancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DevConfig;
  onUpdateConfig: (newConfig: DevConfig) => void;
  traceLogs: DevTraceLog[];
  onClearLogs: () => void;
  theme?: 'dark' | 'light';
}

export const DevRedundancyModal: React.FC<DevRedundancyModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  traceLogs,
  onClearLogs,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'dom' | 'hooks' | 'prompt' | 'webhook' | 'trace'>('dom');
  const [localConfig, setLocalConfig] = useState<DevConfig>(config);
  const [webhookTestStatus, setWebhookTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateConfig(localConfig);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const testWebhook = () => {
    setWebhookTestStatus('testing');
    setTimeout(() => {
      setWebhookTestStatus('success');
      setTimeout(() => setWebhookTestStatus('idle'), 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-4xl h-[620px] rounded-2xl flex flex-col overflow-hidden border shadow-2xl transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800'
            : 'bg-[#0f121d] border-[#22293e] text-slate-200'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`h-13 px-6 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  非标系统 · 开发者扩展与预留冗余配置
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Dev Slot v1.4
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                为非标自动化采集、逆向风控、生命周期钩子及外部系统对接预留的开发插槽
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> 已生效保存
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> 保存配置
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-[#1f253a] text-slate-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Tab Nav + Right Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Nav */}
          <div
            className={`w-52 border-r p-3 space-y-1 shrink-0 ${
              isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#111422] border-[#1d2338]'
            }`}
          >
            <button
              onClick={() => setActiveTab('dom')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeTab === 'dom'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-700'
                  : 'hover:bg-[#1a2034] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>DOM 仿真与反爬</span>
            </button>

            <button
              onClick={() => setActiveTab('hooks')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeTab === 'hooks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-700'
                  : 'hover:bg-[#1a2034] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>生命周期 Hooks 钩子</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeTab === 'prompt'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-700'
                  : 'hover:bg-[#1a2034] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>模型与 Prompt 扩展槽</span>
            </button>

            <button
              onClick={() => setActiveTab('webhook')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeTab === 'webhook'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-700'
                  : 'hover:bg-[#1a2034] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Webhook className="w-3.5 h-3.5" />
              <span>外部 CRM / Webhook</span>
            </button>

            <button
              onClick={() => setActiveTab('trace')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeTab === 'trace'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-700'
                  : 'hover:bg-[#1a2034] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>动作链路 Trace 日志</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            {/* Tab 1: DOM 仿真与反爬 */}
            {activeTab === 'dom' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    人机行为拟真与反爬冗余 (Anti-Bot Emulation)
                  </h4>
                  <p className="text-xs opacity-70">
                    针对鱼泡直聘网页端反爬与行为检测，配置拟真敲击间隔、滑动曲线与验证码降级策略。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                  {/* Typing Jitter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">模拟人工键盘敲击抖动 (Keyboard Jitter)</div>
                      <div className="text-[11px] opacity-60">随机化每个字符输入间隔，防止被判定为脚本秒发</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.typingSpeedJitter}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, typingSpeedJitter: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Delay Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>单字符基准敲击耗时</span>
                      <span className="font-mono text-indigo-400">{localConfig.typingDelayMs} ms/字</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={5}
                      value={localConfig.typingDelayMs}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, typingDelayMs: Number(e.target.value) })
                      }
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Mouse Bezier Curve */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                    <div>
                      <div className="text-xs font-semibold">贝塞尔鼠标轨迹平滑拟真</div>
                      <div className="text-[11px] opacity-60">点击按钮前生成带有微小颤动的真实鼠标滑动轨迹</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.mouseBezierCurve}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, mouseBezierCurve: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Captcha Strategy */}
                  <div className="pt-2 border-t border-slate-700/30 space-y-1.5">
                    <div className="text-xs font-semibold flex items-center gap-1.5 text-amber-500">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      风控/验证码触发降级预留 (Captcha Fallback)
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { key: 'pause_and_alert', label: '暂停并蜂鸣警报' },
                        { key: 'webhook_notify', label: '推企业微信等人工' },
                        { key: 'manual_switch', label: '无缝移交主窗口' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() =>
                            setLocalConfig({
                              ...localConfig,
                              captchaStrategy: item.key as DevConfig['captchaStrategy'],
                            })
                          }
                          className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                            localConfig.captchaStrategy === item.key
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700'
                              : 'bg-[#1b2030] border-[#29324a] text-slate-300'
                          }`}
                        >
                          <div className="font-medium text-[11px]">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hot-reload CSS Selectors */}
                <div className={`p-4 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                  <div className="text-xs font-semibold">DOM 选择器热更新映射 (为网页改版冗余)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] opacity-60">搜索框输入选择器</span>
                      <input
                        type="text"
                        value={localConfig.customDomSelectors.searchInput}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            customDomSelectors: { ...localConfig.customDomSelectors, searchInput: e.target.value },
                          })
                        }
                        className={`w-full px-2.5 py-1 rounded border font-mono text-[11px] ${
                          isLight ? 'bg-white border-slate-300' : 'bg-[#191e2e] border-[#2b354e]'
                        }`}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] opacity-60">打招呼按钮选择器</span>
                      <input
                        type="text"
                        value={localConfig.customDomSelectors.greetButton}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            customDomSelectors: { ...localConfig.customDomSelectors, greetButton: e.target.value },
                          })
                        }
                        className={`w-full px-2.5 py-1 rounded border font-mono text-[11px] ${
                          isLight ? 'bg-white border-slate-300' : 'bg-[#191e2e] border-[#2b354e]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: 生命周期 Hooks 钩子 */}
            {activeTab === 'hooks' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    生命周期中间件与扩展钩子 (Lifecycle Hooks)
                  </h4>
                  <p className="text-xs opacity-70">
                    在招聘自动化各个关键节点插入开发者自定义脚本或业务拦截器。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-400">
                          Hook: beforeScreen
                        </span>
                        <span className="text-xs font-semibold">候选人初筛前拦截器</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localConfig.hookBeforeScreen}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, hookBeforeScreen: e.target.checked })
                        }
                        className="rounded accent-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] opacity-60">
                      在解析候选人简历前执行。用于校验企业黑名单电话、同行避让规则或历史放弃记录。
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400">
                          Hook: afterGreeting
                        </span>
                        <span className="text-xs font-semibold">发送破冰招呼后监听</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localConfig.hookAfterGreeting}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, hookAfterGreeting: e.target.checked })
                        }
                        className="rounded accent-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] opacity-60">
                      打招呼发送完毕后触发。可用于在本地数据库记录当日额度消耗、打上“已初联”标签。
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                          Hook: onContactCaptured
                        </span>
                        <span className="text-xs font-semibold">捕获手机/微信即时分发</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localConfig.hookOnContactCaptured}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, hookOnContactCaptured: e.target.checked })
                        }
                        className="rounded accent-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] opacity-60">
                      在微聊中识别到正则手机号或微信号时立即触发。支持直接唤起短信网关或派发给外呼专员。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: 模型与 Prompt 扩展槽 */}
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    AI 认知层与 Prompt 动态注入槽 (Model Slots)
                  </h4>
                  <p className="text-xs opacity-70">
                    为不同地区工种、薪资政策或特定雇主品牌注入自定义约束与微调参数。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>推理温度 (Temperature - 越低越客观严谨)</span>
                      <span className="font-mono text-indigo-400">{localConfig.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={localConfig.temperature}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, temperature: Number(e.target.value) })
                      }
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">
                      System Prompt 运行时补丁注入 (Runtime Patch)
                    </label>
                    <textarea
                      rows={3}
                      value={localConfig.customPromptPatch}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, customPromptPatch: e.target.value })
                      }
                      placeholder="例如：如遇到候选人询问是否有班车，说明统一在丰台科技园地铁站集合发车；语气保持热情质朴。"
                      className={`w-full p-2.5 rounded-lg border font-mono text-xs ${
                        isLight ? 'bg-white border-slate-300' : 'bg-[#191e2e] border-[#2b354e]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">
                      岗位知识库边界覆盖 (Knowledge Override)
                    </label>
                    <textarea
                      rows={2}
                      value={localConfig.knowledgeBaseOverride}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, knowledgeBaseOverride: e.target.value })
                      }
                      placeholder="自定义薪资结构补充、餐补发放标准等..."
                      className={`w-full p-2.5 rounded-lg border font-mono text-xs ${
                        isLight ? 'bg-white border-slate-300' : 'bg-[#191e2e] border-[#2b354e]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: 外部 CRM / Webhook */}
            {activeTab === 'webhook' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    外部系统与 CRM 接口预留 (Webhook Pipeline)
                  </h4>
                  <p className="text-xs opacity-70">
                    成功索要到联系方式或初筛完成后，将结构化数据一键回传至飞书、企微或内部 ATS。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141826] border-[#1f253a]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">自动推送交付简报与联系方式</div>
                      <div className="text-[11px] opacity-60">P7 获得手机号后立即向目标 URL 发送 POST JSON</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.enableWebhookPush}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, enableWebhookPush: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block">接收端点 URL</label>
                    <input
                      type="url"
                      value={localConfig.webhookUrl}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, webhookUrl: e.target.value })
                      }
                      className={`w-full px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isLight ? 'bg-white border-slate-300' : 'bg-[#191e2e] border-[#2b354e]'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-70">格式模板:</span>
                      {(['feishu', 'wecom', 'custom_json'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setLocalConfig({ ...localConfig, webhookFormat: fmt })}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border transition ${
                            localConfig.webhookFormat === fmt
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={testWebhook}
                      disabled={webhookTestStatus === 'testing'}
                      className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {webhookTestStatus === 'testing' ? (
                        <span>推送测试中...</span>
                      ) : webhookTestStatus === 'success' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 状态码 200 OK
                        </span>
                      ) : (
                        <span>发送测试 Payload</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: 动作链路 Trace 日志 */}
            {activeTab === 'trace' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-0.5">
                      底层行为 Trace 与 DOM 事件捕获流
                    </h4>
                    <p className="text-[11px] opacity-70">
                      监控 RPA 页面驱动、API 握手与正则捕获的细粒度开发者日志
                    </p>
                  </div>
                  <button
                    onClick={onClearLogs}
                    className="px-2.5 py-1 rounded border text-[11px] hover:opacity-80 transition cursor-pointer"
                  >
                    清空 Trace
                  </button>
                </div>

                <div
                  className={`h-72 rounded-xl border p-3 font-mono text-[11px] overflow-y-auto space-y-1.5 ${
                    isLight ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-[#090b12] text-slate-300 border-[#1c2236]'
                  }`}
                >
                  {traceLogs.length === 0 ? (
                    <div className="text-slate-500 text-center py-10">暂无 Trace 记录，执行任务时将动态注入</div>
                  ) : (
                    traceLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                            log.type === 'DOM'
                              ? 'bg-amber-500/20 text-amber-400'
                              : log.type === 'AI'
                              ? 'bg-purple-500/20 text-purple-300'
                              : log.type === 'HOOK'
                              ? 'bg-blue-500/20 text-blue-300'
                              : log.type === 'RULE'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-slate-200">{log.message}</span>
                        {log.detail && <span className="text-slate-400 opacity-70 truncate">{log.detail}</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
