# Wave 2.5.C · 远见塔 / 功德堂 / 自家小屋 像素风重写

UI 重构第 2 波 · 第 9 步 — **3 大展示型 panel 像素化**

---

## 这一波做了什么

### 3 个 panel 完全重写

| Panel | 触发 | 功能 |
|---|---|---|
| `NewHomeWallPanel` | EventBus `open-home-wall` (HomeScene [E]) | 自家小屋纪念墙 · 个人成就时间轴（CV / 任务 / 提案 + GitHub avatar + level）|
| `NewMeritBoardPanel` | EventBus `open-merit-board` (功德堂中央碑石 [E]) | 全站 CV 排行榜（Top 20 · 自己高亮 · 前 3 名金/银/铜大行排版）|
| `NewRoadmapPanel` | EventBus `open-roadmap` (远见塔 [E]) | 5 阶段路线图（done/progress/todo + 进度条 + highlights + 阶段间箭头）|

### 复用现有 store

✅ 100% 兼容：
- `cv.ts` (getTotalCV / getCVEntries)
- `proposalStore.ts` (proposals 表查询)
- `levelStore.ts` (fetchUserLevel)
- `profileStore.ts` (fetchMyProfile)
- `get_cv_leaderboard` RPC

### 文件清单
```
🆕 src/lib/roadmapData.ts             (5 stages 数组 · 抽自旧 RoadmapPanel)
🆕 src/hooks/useLeaderboard.ts        (含 estimateLevel)
🆕 src/hooks/useHomeWallData.ts
🆕 src/components/NewHomeWallPanel.tsx
🆕 src/components/NewMeritBoardPanel.tsx
🆕 src/components/NewRoadmapPanel.tsx
🔄 src/hooks/index.ts (加 export)
```

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-5c.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-5c\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-5c -Recurse -Force

# 验证
Test-Path src\lib\roadmapData.ts
Test-Path src\hooks\useLeaderboard.ts
Test-Path src\hooks\useHomeWallData.ts
Test-Path src\components\NewHomeWallPanel.tsx
Test-Path src\components\NewMeritBoardPanel.tsx
Test-Path src\components\NewRoadmapPanel.tsx
```

期望 6 个 `True`。

---

## 必须手动改 src/App.tsx · 替换 3 个 panel

```powershell
cd D:\projects\cua-base

Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave2-5c -ErrorAction SilentlyContinue

$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))

# 加 imports
$oldImport = "import { NewAppealDeskPanel } from './components/NewAppealDeskPanel';"
$newImport = "import { NewAppealDeskPanel } from './components/NewAppealDeskPanel';`r`nimport { NewHomeWallPanel } from './components/NewHomeWallPanel';`r`nimport { NewMeritBoardPanel } from './components/NewMeritBoardPanel';`r`nimport { NewRoadmapPanel } from './components/NewRoadmapPanel';"
$content = $content.Replace($oldImport, $newImport)

# 替换 3 个旧 panel
$content = $content -replace '<HomeWallPanel />', '<NewHomeWallPanel />'
$content = $content -replace '<MeritBoardPanel />', '<NewMeritBoardPanel />'
$content = $content -replace '<RoadmapPanel />', '<NewRoadmapPanel />'

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证
Write-Host "=== imports（应 3 行）==="
Select-String -Path src\App.tsx -Pattern "from './components/NewHomeWallPanel'|from './components/NewMeritBoardPanel'|from './components/NewRoadmapPanel'" | Format-Table LineNumber, Line

Write-Host "=== 应只有 New 版（每个 1 行）==="
Select-String -Path src\App.tsx -Pattern '<HomeWallPanel />|<NewHomeWallPanel />' | Format-Table LineNumber, Line
Select-String -Path src\App.tsx -Pattern '<MeritBoardPanel />|<NewMeritBoardPanel />' | Format-Table LineNumber, Line
Select-String -Path src\App.tsx -Pattern '<RoadmapPanel />|<NewRoadmapPanel />' | Format-Table LineNumber, Line
```

---

## 跑 + 测试

```powershell
pnpm dev
```

打开 `http://localhost:5173/play` 登录进游戏。

### F12 Console 直接触发（最快）

```javascript
// 像 Wave 2.5.B 一样
import('/src/game/EventBus.ts').then(m => {
  window.__EventBus = m.EventBus;
  // 测试 3 个：
  m.EventBus.emit('open-home-wall')      // 自家小屋
  // m.EventBus.emit('open-merit-board')  // 功德堂
  // m.EventBus.emit('open-roadmap')      // 远见塔
});
```

或在游戏里走到对应场景按 [E]：
- 自家小屋（HomeScene 的墙）
- 功德堂（GongdeTangScene 中央碑石）
- 远见塔（VisionTowerScene）

---

## 测试清单

### NewHomeWallPanel · 自家小屋
```
☐ 1. F12 → EventBus.emit('open-home-wall') → 像素风面板（600×620）
☐ 2. 看到个人卡片：GitHub avatar + 名字 + L? + 总 CV
☐ 3. Stat 行：任务数 · 提案数 · 通过数
☐ 4. "完成任务" section: 时间轴卡（金色左边线 · 任务名 · 工坊 · +CP）
☐ 5. 任务卡按时间倒序 · 显示最近 10 条
☐ 6. "创建的提案" section: 类别 chip + outcome chip + 标题 + 投票数
☐ 7. 未登录 → "请先用 GitHub 登录"
☐ 8. ESC 关闭
```

### NewMeritBoardPanel · 功德堂
```
☐ 9. F12 → EventBus.emit('open-merit-board') → 像素风面板（540×620）
☐ 10. 看到 "功德堂 · 贡献者排行" 标题 + "碑上无虚名 · 上石必有功"
☐ 11. 前 3 名大行排版（金/银/铜边框 + 🥇🥈🥉）
☐ 12. 第 4 名后 · 普通行
☐ 13. 自己的行高亮（金色边框 + "我" chip）
☐ 14. 不在 Top 20 → 底部显示 "你不在前 20"
☐ 15. ↻ 按钮 · 手动刷新
☐ 16. 加载中 → "正在录入功德......"
☐ 17. 加载失败 → "读取失败 · 请稍后再试"
```

### NewRoadmapPanel · 远见塔
```
☐ 18. F12 → EventBus.emit('open-roadmap') → 像素风面板（600×620）
☐ 19. Header："远见塔 · 五阶路线图"
☐ 20. 总览 chip：已完成 1 / 进行中 2 / 待开始 2
☐ 21. 5 阶段卡：萌芽镇 / 共创之都 / 议政高地 / 真任务源 / 多人在场
☐ 22. 每阶段：phase label + 名字 + 状态 chip + 描述 + 进度条 + highlights
☐ 23. done 状态：绿色边框 + 100% 进度
☐ 24. progress 状态：金色边框 + 进度条（百分比）
☐ 25. todo 状态：灰色边框 + opacity 0.85
☐ 26. 阶段间箭头 ↓
☐ 27. ESC 关闭
```

### 兼容性检查
```
☐ 旧 HomeWallPanel / MeritBoardPanel / RoadmapPanel 文件保留
☐ Phaser 内 [E] 交互仍触发对应 panel（开新版）
☐ 自家小屋墙 / 功德堂碑石 / 远见塔 NPC 互动正常
☐ Mail / Chat / Friends / QuestLog / Announcement / 议政 全部仍能开
```

---

## ⚠️ 已知限制

- ⚠️ **MeritBoardPanel 等级估算**：不含 proposal_count（RPC 不返回）· L3+ 无法准确显示 · 用 estimateLevel 函数兜底
- ⚠️ **HomeWallPanel CV entries 限制 10 条**：避免长时间用户列表过长 · 可后续加 "查看全部"
- ⚠️ **RoadmapPanel 数据硬编码**：5 stages 在 `lib/roadmapData.ts` · 改阶段需要改代码

---

## ⚠️ 紧急回滚

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave2-5c src\App.tsx
```

---

## Push

```powershell
git add .
git commit -m "Wave 2.5.C: HomeWall/MeritBoard/Roadmap pixel rewrite

- NewHomeWallPanel (600x620): personal achievements timeline
  - GitHub avatar + name + level + total CV
  - CV entries (gold left border)
  - Created proposals (with outcome chips)
- NewMeritBoardPanel (540x620): CV leaderboard
  - Top 3 gold/silver/bronze big rows
  - Rank 4+ compact rows
  - Self-highlight + 'not in top 20' hint
- NewRoadmapPanel (600x620): 5-stage roadmap
  - done/progress/todo with progress bar + highlights
  - Stages connected with ↓ arrows
- 3 new hooks: useHomeWallData / useLeaderboard / (estimateLevel)
- Extracted STAGES to src/lib/roadmapData.ts
- Old 3 panels preserved (Wave 2.6 cleanup)"

git push
```

---

## 下一波 · 强烈推荐 Wave 2.6 收尾

回我**一个**：

- **"完成 · 进 Wave 2.6 收尾"** ✅ 推荐 = 删 30+ 旧组件 + App.tsx 清理 + 整体测试
- **"完成 · 进 Wave 2.5.A.3"** = QuestLog 审核流像素化（3-4h · 锦上添花）
- **"完成 · 暂停找用户测"**
- **"调整某处"** + 写出
