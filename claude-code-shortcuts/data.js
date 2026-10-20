// Claude Code 快捷键速查的共享数据，两处读取：
//   claude-code-shortcuts.html                                   —— 长图（无头 Chrome 截图出 PNG）
//   ../claude-code-config-commands/claude-code-config-commands.artifact.html —— Artifact 在线版，发布为 keys.js
// 行格式：[键位, 说明]。键位里 "|" 分隔等价键位，空格表示和弦（先后按），"+" 表示同时按；说明可含 <em>。
// 依据 raw/sources/2026-08-07-claude-code-keybindings.md，2026-08-13 与本机 ~/.claude/keybindings.json 核对为 19 组 173 条；
// 2026-09-29 按 CLI 2.1.284 的官方 keybindings 文档增补 Chat 两条和 DiffPanel、EffortSlider、Agents 三组。

var KEYS = [
  {t:"最常用", cn:"日常五键", hi:true, rows:[
    ["shift+tab","切换模式：默认 → 自动接受编辑 → plan"],
    ["escape","打断当前回答或工具调用"],
    ["ctrl+o","展开/收起完整转录视图"],
    ["ctrl+r","反向搜索历史输入"],
    ["ctrl+j","输入框内换行，<em>不发送</em>"],
  ]},
  {t:"Global", cn:"全局 · 任何时候", rows:[
    ["ctrl+t","显示/隐藏待办（TODO）面板"],
    ["ctrl+o","显示/隐藏完整转录视图（展开折叠的工具输出与思考）"],
    ["ctrl+shift+b","显示/隐藏简报面板"],
    ["ctrl+r","反向搜索历史输入（同 shell 的 ctrl+r）"],
    ["ctrl+up|meta+up","改动文件列表上移一个文件"],
    ["ctrl+down|meta+down","改动文件列表下移一个文件"],
    ["ctrl+]","打开当前 Artifact（已发布页面）"],
  ]},
  {t:"Chat", cn:"输入框 / 对话主界面", rows:[
    ["escape","中断正在运行的回答或工具调用"],
    ["ctrl+l","清空输入框（不清屏）"],
    ["cmd+k","清屏（只清显示，<em>不清上下文</em>）"],
    ["ctrl+x ctrl+k","杀掉所有正在跑的子 agent / 后台任务"],
    ["shift+tab","循环切模式：默认 → 自动接受编辑 → plan"],
    ["meta+p","打开模型选择器"],
    ["meta+o","开关 Fast 模式（Opus 快速输出，非降级小模型）"],
    ["meta+t","开关扩展思考"],
    ["meta+w","开关 workflow 关键字（多 agent 编排）"],
    ["enter","发送消息"],
    ["ctrl+j","换行不发送"],
    ["ctrl+x enter","排队发送：Claude 忙时进队列，<em>不打断当前回合</em>"],
    ["ctrl+enter|ctrl+x ctrl+s","立即发出排队中的消息（连同草稿）；终端不支持扩展键时用 ctrl+x ctrl+s"],
    ["up|down","上一条 / 下一条历史输入"],
    ["ctrl+_|ctrl+-|ctrl+shift+-|ctrl+shift+_","撤销（四个键位是兼容不同终端的转义差异，作用相同）"],
    ["ctrl+x ctrl+e|ctrl+g","用外部编辑器（$EDITOR）编辑当前输入"],
    ["ctrl+s","暂存当前输入，之后再取回"],
    ["ctrl+v","粘贴剪贴板里的图片"],
    ["space","按住说话（语音输入）"],
  ]},
  {t:"Autocomplete", cn:"补全弹层出现时", rows:[
    ["tab","接受当前补全项"],
    ["escape","关闭补全"],
    ["up|down","上/下选择候选项"],
  ]},
  {t:"Confirmation", cn:"权限 / 确认对话框", rows:[
    ["y|enter","确认（是）"],
    ["n|escape","拒绝（否）"],
    ["up|down","上/下切换选项"],
    ["tab","跳到下一个字段"],
    ["space","切换当前项的勾选状态"],
    ["shift+tab","切换模式（如「本次允许 / 始终允许」）"],
    ["ctrl+e","展开/收起解释说明"],
  ]},
  {t:"Transcript", cn:"转录视图 · ctrl+o 打开后", note:"一套 less / vim 风格的翻页键。", rows:[
    ["ctrl+e","切换「显示全部 / 折叠」"],
    ["escape|q","退出转录视图"],
    ["ctrl+u","上翻半页"],
    ["ctrl+b|b","上翻整页"],
    ["ctrl+f|space","下翻整页"],
    ["ctrl+n|j|down","下移一行"],
    ["ctrl+p|k|up","上移一行"],
    ["g|home","跳到最顶"],
    ["shift+g|end","跳到最底"],
  ]},
  {t:"HistorySearch", cn:"按下 ctrl+r 之后", rows:[
    ["ctrl+r","跳到下一个匹配结果"],
    ["escape|tab","采纳这条历史，填入输入框但<em>不发送</em>"],
    ["enter","采纳并<em>直接发送</em>"],
    ["ctrl+s","切换搜索范围（当前项目 ↔ 全部会话）"],
  ]},
  {t:"Settings", cn:"设置界面", note:"上下移动提供三套等价键位。", rows:[
    ["up|down","上/下移动选择 · 方向键"],
    ["k|j","上/下移动选择 · vim"],
    ["ctrl+p|ctrl+n","上/下移动选择 · emacs"],
    ["space|enter","确认选中"],
    ["escape","取消返回"],
    ["/","搜索设置项"],
    ["r","重试"],
    ["d|w","统计周期切为按天 / 按周"],
    ["t","按 token 数排序"],
    ["ctrl+u","向上滚半页"],
  ]},
  {t:"Scroll", cn:"滚动与文本选择 · 通用", rows:[
    ["pageup|pagedown","上/下翻页"],
    ["wheelup|wheeldown","滚轮上/下滚一行"],
    ["ctrl+home|ctrl+end","跳到最顶 / 最底"],
    ["ctrl+shift+c|cmd+c","复制选中内容"],
    ["shift+left|shift+right","向左 / 向右扩展选区"],
    ["shift+up|shift+down","向上 / 向下扩展选区"],
    ["shift+home|shift+end","选到行首 / 行尾"],
  ]},
  {t:"MessageSelector", cn:"选择历史消息 · 回退或编辑", rows:[
    ["up|k|ctrl+p","上移一条"],
    ["down|j|ctrl+n","下移一条"],
    ["ctrl+up|shift+up|meta+up|shift+k","跳到最早一条"],
    ["ctrl+down|shift+down|meta+down|shift+j","跳到最新一条"],
    ["enter","选中该消息"],
  ]},
  {t:"DiffDialog", cn:"差异查看对话框", rows:[
    ["escape","关闭"],
    ["left|right","上一个 / 下一个「改动来源」"],
    ["up|k","上一个文件"],
    ["down|j","下一个文件"],
    ["enter","查看详情"],
    ["space","下翻整页"],
    ["shift+space|b","上翻整页"],
    ["pageup|pagedown","上/下翻页"],
    ["g|home","跳到最顶"],
    ["shift+g|end","跳到最底"],
  ]},
  {t:"Select", cn:"通用列表选择器", rows:[
    ["up|k|ctrl+p","上移"],
    ["down|j|ctrl+n","下移"],
    ["pageup|pagedown","翻页"],
    ["home|end","首项 / 末项"],
    ["enter|escape","确认 / 取消"],
  ]},
  {t:"ModelPicker", cn:"模型选择器 · meta+p 打开后", rows:[
    ["left|right","降低 / 提高 reasoning effort 思考强度档位"],
    ["s","该选择<em>仅当前会话生效</em>，不写入全局配置"],
  ]},
  {t:"EffortSlider", cn:"思考强度滑块 · /effort 打开后", rows:[
    ["left|right","滑块降一档 / 升一档（2.1.284 起可改键）"],
    ["tab","开关本会话的 ultracode（滑块提供该选项时）"],
    ["s","所选强度<em>仅当前会话生效</em>"],
  ]},
  {t:"DiffPanel", cn:"改动面板 · 全屏下 /diff 打开后", rows:[
    ["ctrl+x b","切换比较基准：本会话 → 未提交 → 分支"],
  ]},
  {t:"Agents", cn:"agent view · claude agents 打开后", rows:[
    ["ctrl+s","会话分组在「按状态 / 按目录」间切换"],
    ["ctrl+t","置顶 / 取消置顶选中的会话"],
  ]},
  {t:"Task", cn:"有任务在跑时", rows:[
    ["ctrl+x ctrl+b|ctrl+b","转入后台运行，可继续干别的，完成时通知你"],
  ]},
  {t:"Tabs", cn:"标签页", rows:[
    ["tab|right","下一个标签"],
    ["shift+tab|left","上一个标签"],
  ]},
  {t:"Attachments", cn:"附件条", rows:[
    ["left|right","切换附件"],
    ["backspace|delete","移除当前附件"],
    ["down|escape","退出附件区"],
  ]},
  {t:"Footer", cn:"底部状态栏条目", note:"后台任务、建议卡片等。", rows:[
    ["up|ctrl+p|down|ctrl+n","上下移动"],
    ["left|right","前后切换"],
    ["enter","打开选中项"],
    ["escape","清除选择"],
    ["x","关闭"],
    ["backspace|delete","忽略该条目"],
  ]},
  {t:"Plugin", cn:"插件管理界面", rows:[
    ["space","启用 / 禁用插件"],
    ["i","安装"],
    ["f","收藏"],
  ]},
  {t:"ThemePicker", cn:"主题选择器", rows:[
    ["ctrl+t","开关语法高亮"],
    ["ctrl+e","编辑自定义主题"],
  ]},
  {t:"Help", cn:"帮助面板", rows:[
    ["escape","关闭帮助"],
  ]},
];

// 手动分列，避免 CSS 多列在大卡片处留下整段空白
var KEYS_COLS = [
  ["最常用","Chat","Help"],
  ["Global","Transcript","HistorySearch","Tabs"],
  ["Settings","Confirmation","Scroll","EffortSlider"],
  ["DiffDialog","DiffPanel","MessageSelector","Select","Autocomplete","Agents"],
  ["Footer","ModelPicker","Task","Attachments","Plugin","ThemePicker"],
];
