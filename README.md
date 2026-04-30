# Wave 3.B · CodexPage 完整版

UI 重构第 3 波 · 第 2 步 — **图鉴独立页面（6 tab 完整版）**

---

## 这一波做了什么

✅ CodexPage.tsx · 像素古籍风 6 tab 完整图鉴
- 顶部横向 tab（vs Manual 的左侧 sidebar）
- 6 tab：工坊 / NPC / 等级 / 任务 / 审核员 / 节气
- 数据 100% 复用现有源（gameMeta + questDefinitions + reviewers + timeStore）

✅ 文件清单
```
🆕 src/pages/CodexPage.tsx           (~700 行 · 6 tab + 4 helper 子组件)
🆕 src/lib/solarTermsData.ts         (24 节气数据 + 描述 + 物候特征)
🆕 src/lib/reviewerProfiles.ts       (3 审核员 + 3 申诉员人物档案)
```

---

## 6 Tab 内容总览

### Tab 1 · 🏛 工坊（9 个 · 复用 gameMeta WORKSHOPS）
- 卡片网格（3 列）· 每卡片像素图标 + 名字 + 板块 chip + 描述
- 9 工坊：播客 / 百科 / 数据 / 内参 / 招聘 / 会议 / 开源 / 测评 / 生态
- 3 板块：降噪 / 链接 / 共创

### Tab 2 · 👥 NPC（6 个 · 复用 gameMeta NPCS）
- 卡片网格（2 列）· 头像 + 名字 + 区域 chip + 角色 + 一句话台词
- 6 NPC：村长阿降 / 周明 / 严之 / 白徽 / 阿香 / 议长

### Tab 3 · 🎖 等级（5 个 · 复用 gameMeta LEVELS）
- 列表 · L0-L4 + CV 阈值 + 解锁区域
- 底部 · 升级解锁权限说明（L1 投票权 / L2 议政 / L3 复议 / L4 共建）

### Tab 4 · 📋 任务（5 真任务 · 复用 questDefinitions）
- 完整 · 标题 + 难度 chip + CP chip + 估时 + 描述 + 质量评判 + 验收
- 5 任务：单篇论文 / 作者卡片 / 周抽查 / 自动化脚本 / 季度研判

### Tab 5 · ⚖ 审核员（6 个）
- 主审：周明（严谨）/ 严之（挑剔）/ 白徽（稳健）
- 申诉：谢忱（公正）/ 李明（严苛）/ 苏砚（宽厚）
- 卡片：头像 + 名字 + role chip + 性格 + 评审风格 + 偏好 + 投票延迟
- 底部 · 申诉规则说明

### Tab 6 · 🌱 节气（24 个 · 复用 timeStore SOLAR_TERMS）
- 按四季分组：春 / 夏 / 秋 / 冬（每季 6 节气）
- 每节气卡片 · emoji 图标 + 名字 + 诗意描述 + 物候特征
- 季节背景色调（春绿 / 夏黄 / 秋橙 / 冬蓝）

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave3b.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave3b\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave3b -Recurse -Force

# 验证
Test-Path src\pages\CodexPage.tsx
Test-Path src\lib\solarTermsData.ts
Test-Path src\lib\reviewerProfiles.ts
```

期望 3 个 `True`。

---

## ⚠️ 必须改 App.tsx · 把 CodexPage import 从 ComingSoon 拆出来

跟 ManualPage 一样的修复：

```powershell
cd D:\projects\cua-base

Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave3b -ErrorAction SilentlyContinue

$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))

# 旧 import:
# import { ManualPage } from './pages/ManualPage';
# import { CodexPage, MapsPage } from './pages/ComingSoon';
# 新 import:
# import { ManualPage } from './pages/ManualPage';
# import { CodexPage } from './pages/CodexPage';
# import { MapsPage } from './pages/ComingSoon';

$old = "import { CodexPage, MapsPage } from './pages/ComingSoon';"
$new = "import { CodexPage } from './pages/CodexPage';`r`nimport { MapsPage } from './pages/ComingSoon';"
$content = $content.Replace($old, $new)

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证
Write-Host "=== 修改后 imports ==="
Select-String -Path src\App.tsx -Pattern "ManualPage|CodexPage|MapsPage" | Format-Table LineNumber, Line -Wrap
```

期望看到：
```
LineNumber  Line
----------  ----
        66  import { ManualPage } from './pages/ManualPage';
        67  import { CodexPage } from './pages/CodexPage';
        68  import { MapsPage } from './pages/ComingSoon';
       312  <Route path="/manual" element={<ManualPage />} />
       313  <Route path="/codex" element={<CodexPage />} />
       314  <Route path="/maps" element={<MapsPage />} />
```

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/codex`

---

## 测试清单

```
☐ 1. 顶栏 · 返回首页 + 图鉴标题 + 手册/进入游戏链接
☐ 2. 顶部横向 6 tab · 默认选中 工坊
☐ 3. 切 tab · 当前 tab 米黄背景 + 金色下划线
☐ 4. "工坊" tab · 9 个卡片 · 每卡片 emoji + 名字 + 板块 chip + 描述
☐ 5. "NPC" tab · 6 个卡片 · 含村长阿降 + 高粱（百晓居首席被列在 NPCS 数组里? 验证）
☐ 6. "等级" tab · L0-L4 列表 + 底部解锁说明
☐ 7. "任务" tab · 5 真任务 · 难度 chip 颜色（入门绿/中等金/困难红）+ CP + 估时
☐ 8. "审核员" tab · 主审 3 个 + 申诉 3 个 · 性格描述 + 偏好 + 投票延迟
☐ 9. "节气" tab · 24 节气按春夏秋冬分组 · 季节背景色不同
☐ 10. ESC · 返回首页
☐ 11. 顶栏 "手册" 链接 · 跳转 /manual
☐ 12. 顶栏 "进入游戏" · 跳转 /play
```

---

## ⚠️ 已知限制

- ⚠️ **NPC tab 没有 高粱（百晓居首席）** · 因为 gameMeta NPCS 只有 6 个 · 高粱在 SproutCityScene.ts 里独立定义
- ⚠️ **节气描述** · 来自我编写的诗意 + 七十二候物候 · 非官方
- ⚠️ **审核员人物档案** · 来自 reviewers.ts voteFn 行为反推 · 非显式定义

---

## ⚠️ 紧急回滚

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave3b src\App.tsx
Remove-Item src\pages\CodexPage.tsx -Force
Remove-Item src\lib\solarTermsData.ts -Force
Remove-Item src\lib\reviewerProfiles.ts -Force
```

---

## Push

```powershell
git add .
git commit -m "Wave 3.B: CodexPage full rewrite

CodexPage (~700 lines, 6 tabs):
- workshops: 9 workshops grid (gameMeta WORKSHOPS)
- npcs: 6 NPCs cards (gameMeta NPCS)
- levels: L0-L4 list + unlock rules (gameMeta LEVELS)
- quests: 5 real quests detail (questDefinitions QUESTS)
- reviewers: 3 main + 3 appeal profiles (new reviewerProfiles.ts)
- solar: 24 solar terms grouped by season (new solarTermsData.ts)

Top-bar horizontal tabs (vs Manual sidebar)
ESC returns to landing
Pixel scroll aesthetic + season-colored backgrounds

App.tsx: import CodexPage from ./pages/CodexPage (no longer ComingSoon stub)

Wave 3.A + 3.B = Manual + Codex 100% complete."

git push
```

---

## 下一步

回我**一个**：

- **"全好 · push + 进 Wave 4 (MapsPage)"** = 工作量 2-3h
- **"全好 · push + 暂停找用户测"** ✅ 强推
- **"X 有问题"** + 描述
- **"先看 NPCs · 加百晓居首席高粱进 gameMeta"** = +0.5h 小任务

⚠️ Wave 4 MapsPage 是最后一波 · 简单 · 但你可以选先暂停测一下。
