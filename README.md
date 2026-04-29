# Wave 2.5.B · 议政 3 panel 像素风重写

UI 重构第 2 波 · 第 8 步 — **议政厅 + 申诉案桌**

---

## 这一波做了什么

### 3 个 panel 完全重写

| Panel | 触发 | 功能 |
|---|---|---|
| `NewCreateProposalPanel` | EventBus `open-create-proposal` | 新建提案（标题 + 描述 + 5 类别 + 4 时长选项 · L2 守门）|
| `NewProposalListPanel` | EventBus `open-proposal-list` | 提案列表（公示中/已决议 2 tab + 类别筛选）+ 投票（赞/反/弃 + 备注 · L1 守门）|
| `NewAppealDeskPanel` | EventBus `open-appeal-desk` | 任务申诉案桌（明镜阁）· 列出可申诉任务 + 发起申诉 |

### 复用现有 store API

✅ 100% 兼容 `proposalStore.ts`：
- createProposal / castVote / withdrawVote / getMyVote
- listOpenProposals / listClosedProposals / finalizeOverdueProposals
- subscribeProposalChanges (realtime)

✅ 100% 兼容 `questStore.ts` + `appealReviewers.ts`：
- 申诉数据完全跟旧 AppealDeskPanel 一致
- 用 startAppealState + scheduleAppealVotes
- 沿用 ReviewProcessor / AppealProcessor 的事件链

### 文件清单
```
🆕 src/hooks/useProposals.ts
🆕 src/components/NewCreateProposalPanel.tsx
🆕 src/components/NewProposalListPanel.tsx
🆕 src/components/NewAppealDeskPanel.tsx
🔄 src/hooks/index.ts (加 export)
```

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-5b.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-5b\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-5b -Recurse -Force

# 验证
Test-Path src\hooks\useProposals.ts
Test-Path src\components\NewCreateProposalPanel.tsx
Test-Path src\components\NewProposalListPanel.tsx
Test-Path src\components\NewAppealDeskPanel.tsx
```

期望 4 个 `True`。

---

## 必须手动改 src/App.tsx · 替换 3 个 panel

```powershell
cd D:\projects\cua-base

Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave2-5b -ErrorAction SilentlyContinue

$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))

# 加 imports
$oldImport = "import { NewQuestLog } from './components/NewQuestLog';"
$newImport = "import { NewQuestLog } from './components/NewQuestLog';`r`nimport { NewCreateProposalPanel } from './components/NewCreateProposalPanel';`r`nimport { NewProposalListPanel } from './components/NewProposalListPanel';`r`nimport { NewAppealDeskPanel } from './components/NewAppealDeskPanel';"
$content = $content.Replace($oldImport, $newImport)

# 替换 3 个旧 panel
$content = $content -replace '<CreateProposalPanel />', '<NewCreateProposalPanel />'
$content = $content -replace '<ProposalListPanel />', '<NewProposalListPanel />'
$content = $content -replace '<AppealDeskPanel />', '<NewAppealDeskPanel />'

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证
Write-Host "=== imports（应 3 行）==="
Select-String -Path src\App.tsx -Pattern "from './components/NewCreateProposalPanel'|from './components/NewProposalListPanel'|from './components/NewAppealDeskPanel'" | Format-Table LineNumber, Line

Write-Host "=== 应只有 New 版 · 0 个旧版 ==="
Select-String -Path src\App.tsx -Pattern '<CreateProposalPanel />|<NewCreateProposalPanel />' | Format-Table LineNumber, Line
Select-String -Path src\App.tsx -Pattern '<ProposalListPanel />|<NewProposalListPanel />' | Format-Table LineNumber, Line
Select-String -Path src\App.tsx -Pattern '<AppealDeskPanel />|<NewAppealDeskPanel />' | Format-Table LineNumber, Line
```

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/play` 登录进游戏。

### 测试入口

议政厅在游戏里通过 [E] 键交互（议政高地 GovHill 场景的讲坛）：
- **新提案** · 议政高地讲坛 [E] → CreateProposalPanel · 需 L2
- **看提案** · 议政高地公告板 [E] → ProposalListPanel
- **申诉** · 明镜阁 MirrorPavilion 案桌 [E] → AppealDeskPanel

或用 F12 Console 直接触发：
```javascript
// 测试新建提案
window.eventBus?.emit('open-create-proposal');
// 或 (旧式)
EventBus.emit('open-create-proposal')
```

测试 3 个 panel：

```javascript
EventBus.emit('open-create-proposal')   // 新建提案
EventBus.emit('open-proposal-list')     // 提案列表
EventBus.emit('open-appeal-desk')       // 申诉案桌
```

---

## 测试清单

### NewCreateProposalPanel（L2 守门）
```
☐ 1. F12 → EventBus.emit('open-create-proposal') → 像素风面板出现
☐ 2. 看到标题输入 / 5 类别按钮 / 描述区 / 4 时长按钮
☐ 3. 标题字符计数 / 描述字符计数
☐ 4. 类别选择高亮金色
☐ 5. 时长 "3 天" 默认选中
☐ 6. 短描述 → 验证错误提示
☐ 7. 点 "发起提案" · 如果 L<2 → 显示 "等级不足"
☐ 8. L≥2 → 显示成功 + 1.5s 后关闭
☐ 9. ESC 关闭（提交中不能关）
```

### NewProposalListPanel
```
☐ 10. F12 → EventBus.emit('open-proposal-list') → 像素风面板（600×620）
☐ 11. 看到 2 tab：公示中 / 已决议
☐ 12. 类别筛选条（6 个按钮：全部 / 5 类别）
☐ 13. 左 sidebar 列表（220px）
☐ 14. 点提案项 → 右侧详情显示
☐ 15. 详情：类别 chip / 标题 / 作者 / 倒计时
☐ 16. 详情：描述（whitespace 保留）+ 投票统计条
☐ 17. 投票按钮：✓赞成 / ✗反对 / ⊘弃权 / 撤票
☐ 18. 加备注（可选）
☐ 19. 投票 · 如果 L<1 → "等级不足"
☐ 20. 投票后 → 自己的票显示在详情区
☐ 21. 投票统计实时更新（subscribeProposalChanges 触发）
☐ 22. 已决议 tab → 没有投票按钮 + 显示 outcome chip
☐ 23. 顶部 "+ 新提案" → 触发 NewCreateProposalPanel
☐ 24. 自动 finalizeOverdueProposals · 如有关闭显示 "已结案 N"
```

### NewAppealDeskPanel
```
☐ 25. F12 → EventBus.emit('open-appeal-desk') → 像素风面板
☐ 26. 看到 "明镜阁 · 申诉案桌" 标题 + 副标题
☐ 27. 待申诉列表（status='submitted' + !appealed + 有 finalCoeff）
☐ 28. 已申诉历史（按结果显示：上调/维持/驳回）
☐ 29. 点 "发起申诉" → 确认页（自评 vs 评审 + 入账 CV + 申诉规则）
☐ 30. 点 "确认申诉" → toast 提示 + 关闭面板 + 调度 3 复审员
☐ 31. 点 "再想想" → 回列表
☐ 32. ESC 在确认页 · 先回列表 · 再按一次关面板
```

### 兼容性检查
```
☐ 旧 CreateProposalPanel / ProposalListPanel / AppealDeskPanel 文件保留
☐ Phaser 内 [E] 交互仍触发对应 panel（开新版）
☐ 议政高地 / 明镜阁 场景的 NPC 互动正常
☐ ReviewProcessor / AppealProcessor headless 组件仍正常
☐ Mail（K）/ Chat（T）/ Friends（F）/ QuestLog（J）仍能开
```

---

## ⚠️ 已知限制

- ⚠️ **没有 [E] 键提示像素化** — Phaser 内的 [E] 交互悬浮提示是 Phaser 渲染，不是 React
- ⚠️ **议政厅 NPC 对话** 仍是旧版 DialogueBox · Wave 2.6 后续看
- ⚠️ **L0 用户**看不到议政内容（所有 panel 都需要至少 L1）

---

## ⚠️ 紧急回滚

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave2-5b src\App.tsx
```

---

## Push

```powershell
git add .
git commit -m "Wave 2.5.B: Council Hall 3 panels pixel rewrite

- NewCreateProposalPanel (540x600): title + 5 categories + 4 durations + L2 gate
- NewProposalListPanel (600x620): list + filter + vote bar + comment
- NewAppealDeskPanel (540x600): appealable + history + confirm form
- useProposals hook: realtime subscription + lazy finalize on open
- 100% compatible with proposalStore / questStore APIs
- Old 3 panels preserved (Wave 2.6 cleanup)"

git push
```

---

## 下一波

回我**一个**：

- **"完成 · 进 Wave 2.5.C"** = 远见塔/功德堂/路线图（3-4h）
- **"完成 · 进 Wave 2.6 收尾"** = 删旧组件 + 整体测试（2-3h · 推荐）
- **"完成 · 暂停找用户测"**
- **"调整某处"** + 写出
