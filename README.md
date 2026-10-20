# claude-artifacts

Claude Code 与 DDD 的中文速查合集，在 Claude Artifact 里发布，源码在这里维护。

在线版：<https://claude.ai/artifact/WispTTwKvreJbTf6daKjM2>（Claude Artifact，需登录 claude.ai 查看）

## 内容

左侧菜单切换四页，按 `/` 聚焦搜索框，搜索范围限当前页，菜单上实时显示各页命中数。支持深色主题和手机宽度。

| 页面 | 规模 | 来源 |
|---|---|---|
| 配置项 | 46 项 | `/config` 截图 + Claude Code 官方文档 |
| 斜杠命令 | 115 条 | Claude Code 官方文档 |
| 快捷键 | 183 个 | 官方 keybindings 文档 + 本机配置 |
| DDD 学习笔记 | 10 节 | `ddd/DDD学习笔记.md` |

数据基线：Claude Code CLI 2.1.284（2026-09-29）。快捷键页的 `ctrl+l` 说明仍是旧内容，待修正。

## 目录

```
claude-code-config-commands/
  claude-code-config-commands.artifact.html   Artifact 在线版（单页，含 DDD 页）
  claude-code-config-commands.html            配置项 + 斜杠命令长图源文件
  claude-code-config-commands.png             长图（4800×6148）
  data.js                                     配置项、斜杠命令数据，改文案只改这里
  keys.js -> ../claude-code-shortcuts/data.js 快捷键数据（软链接）
claude-code-shortcuts/
  claude-code-shortcuts.html                  快捷键长图源文件
  claude-code-shortcuts.png                   长图（4400×4012）
  data.js                                     快捷键数据，行格式 [键位, 说明]
ddd/DDD学习笔记.md                             DDD 笔记原文
```

## 本地预览

用浏览器直接打开 `claude-code-config-commands/claude-code-config-commands.artifact.html`，无需构建。`keys.js` 是软链接，Windows 上克隆需开启 symlink 支持，否则快捷键页为空。

## 更新数据

1. 改 `data.js`（配置项、命令）或 `claude-code-shortcuts/data.js`（快捷键）。
2. 长图用无头 Chrome 对 `*.html` 截图重出；Artifact 重新发布 `*.artifact.html` 及两个数据文件。

## 说明

内容为个人整理的中文速查，非官方文档，以 [Claude Code 官方文档](https://code.claude.com/docs) 为准。DDD 笔记为个人学习总结。
