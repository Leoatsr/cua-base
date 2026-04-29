# Wave 2.2.A · 真数据接通 + /play 替换

UI 重构第 2 波 · 第 2 步 — **接通真 store · 替换 /play 视觉**

---

## 这一波做了什么

### 接通 5 个真 store
| Hook | 数据来源 |
|---|---|
| `useProfile()` | `fetchMyProfile()` + EventBus `profile-updated` |
| `useCV()` | `getTotalCV()` + EventBus `cv-updated` |
| `useLevel()` | 基于 CV 算 L0-L4（`gameMeta.LEVELS`）|
| `useGameTime()` | `computeGameTime()` setInterval 1s |
| `useOnlineCount()` | EventBus `online-count-updated` |

### 文件清单
| 类型 | 文件 |
|---|---|
| 🆕 hook | `src/hooks/useProfile.ts` |
| 🆕 hook | `src/hooks/useCV.ts` |
| 🆕 hook | `src/hooks/useLevel.ts` |
| 🆕 hook | `src/hooks/useGameTime.ts` |
| 🆕 hook | `src/hooks/useOnlineCount.ts` |
| 🆕 hook | `src/hooks/index.ts` |
| 🆕 page | `src/pages/NewGameAppHUD.tsx` — 新像素 HUD（用于 /play）|
| 🔄 page | `src/pages/GameViewPreview.tsx` — 接真数据（替换 Wave 2.1 的 mock 版）|

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-2a.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-2a\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-2a -Recurse -Force

# 验证
Test-Path src\hooks\useProfile.ts
Test-Path src\hooks\index.ts
Test-Path src\pages\NewGameAppHUD.tsx
```

期望 3 个 `True`。

---

## 两步测试 · 先 /play-new 再 /play

### Step 1 · 先看 /play-new（真数据隔离测试）

```powershell
pnpm dev
```

打开 `http://localhost:5173/play-new` 

期望看到：
- ✅ AvatarPanel 显示**你的真实 GitHub 名字**（不是 "Gaoliang"）
- ✅ CVBar 显示**你真实 CV**（如果 0 → 显示 "0 / 100"）
- ✅ TopRightChips 显示**真实游戏节气**（立春/雨水/...）
- ✅ TopRightChips 显示**真实游戏时间**（HH:MM）
- ✅ 显示**真实在线人数**（取决于当前在线情况）
- ✅ Hotbar 第 2 格显示**真实 CV** 当数量
- ✅ 顶部 chip "Wave 2.2.A · 真数据"

如果**不对**（比如 AvatarPanel 仍显示 "Gaoliang"）—— 说明你**没登录**，hook 拿不到 profile。先登录再测。

### Step 2 · 满意后改 App.tsx 替换 /play

打开 `src/App.tsx`，找 `MainGameApp` 那个 function（在 200 行左右）。

⚠️ **不要改 `MainGameApp`** —— 我们要做的是**在 MainGameApp 里加新 HUD + 删旧组件**。

跑这条 PowerShell 命令做替换：

```powershell
cd D:\projects\cua-base

# 备份
Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave2-2a -ErrorAction SilentlyContinue

# 加 import NewGameAppHUD
$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))
$oldImport = "import { GameViewPreview } from './pages/GameViewPreview';"
$newImport = "import { GameViewPreview } from './pages/GameViewPreview';`r`nimport { NewGameAppHUD } from './pages/NewGameAppHUD';"
$content = $content.Replace($oldImport, $newImport)

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证 import 加上了
Select-String -Path src\App.tsx -Pattern "NewGameAppHUD" | Format-Table LineNumber, Line
```

期望看到：
```
LineNumber Line
---------- ----
        83 import { NewGameAppHUD } from './pages/NewGameAppHUD';
```

### Step 3 · 手动改 MainGameApp 函数体

⚠️ **这是关键改动** —— 必须**手动**做（PowerShell 难精确替换）。

打开 `src/App.tsx`：

```powershell
notepad src\App.tsx
```

按 `Ctrl+F` 搜索 `<HUD />` —— 找到 MainGameApp 函数 return 块。

#### 改前（你当前长这样）

```tsx
return (
  <>
    <PhaserGame />

    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <CrashFallback error={error} resetError={resetError} />
      )}
    >
      {gameStarted && (
        <>
          <HUD />              {/* ← 删 */}
          <CVDisplay />        {/* ← 删 */}
          <AuthBadge />
          <QuestPanel />
          ...
          <LevelBadge />       {/* ← 删 */}
          ...
          <TimeOverlay />
          <TimeHUD />          {/* ← 删 */}
          <TimeSettingsButton />
          ...
        </>
      )}
      {!gameStarted && <TitleScreen onStart={handleStart} />}
    </SentryErrorBoundary>
  </>
);
```

#### 改后（4 个删 + 1 个加）

1. 删 `<HUD />`
2. 删 `<CVDisplay />`
3. 删 `<LevelBadge />`
4. 删 `<TimeHUD />`
5. **加** `<NewGameAppHUD visible={gameStarted} />` —— 放在 `<PhaserGame />` 之后、`<SentryErrorBoundary>` 之前

完整 return 块：

```tsx
return (
  <>
    <PhaserGame />
    <NewGameAppHUD visible={gameStarted} />     {/* ← 新加 */}

    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <CrashFallback error={error} resetError={resetError} />
      )}
    >
      {gameStarted && (
        <>
          {/* HUD 已删 */}
          {/* CVDisplay 已删 */}
          <AuthBadge />
          <QuestPanel />
          <TitleList />
          <DialogueBox />
          <WorldMap />
          <QuestLog />
          <MailBox />
          <MailBadge />
          <ReviewBadge />
          <ReviewPanel />
          <RoadmapPanel />
          <AppealDeskPanel />
          <CreateProposalPanel />
          <ProposalListPanel />
          <HomeWallPanel />
          <MeritBoardPanel />
          {/* LevelBadge 已删 */}
          <LevelUpAnimation />
          <FaceCustomizer />
          <ProfilePanel />
          <ProfilePanelKeyListener />
          <ProfileLink />
          <OnlineRoster />
          <ChatPanel />
          <ChatPanelKeyListener />
          <PlayerInteractPrompt />
          <PlayerInteractMenu />
          <PlayerInteractKeyListener />
          <QuestHistoryPanel />
          <QuestHistoryKeyListener />
          <NotificationToast />
          <NotificationPanel />
          <NotificationKeyListener />
          <NotificationBadge />
          <FriendsPanel />
          <FriendsKeyListener />
          <EmotePanel />
          <EmoteOverlay />
          <DashboardPanel />
          <DashboardKeyListener />
          <AnnouncementButton />
          <HelpButton />
          <TutorialOverlay />
          <TimeOverlay />
          {/* TimeHUD 已删 */}
          <TimeSettingsButton />
          <NpcGreetingToast />
          <SolarTermBanner />
          <ReviewProcessor />
          <ReviewSeeder />
          <AppealProcessor />
        </>
      )}
      {!gameStarted && <TitleScreen onStart={handleStart} />}
    </SentryErrorBoundary>
  </>
);
```

保存 → Vite HMR 自动重载。

### Step 4 · 浏览器测 /play

```
http://localhost:5173/play
```

期望：
- ✅ 进入 TitleScreen 登录界面（如果未登录）
- ✅ 登录后看到游戏 + **新像素 HUD**（左上头像 / 右上节气 / 右下 hotbar 等）
- ✅ Phaser canvas 正常运行
- ✅ 角色 WASD 能移动
- ✅ 按 E 跟 NPC 对话仍能用
- ✅ 点新像素左下 5 图标 → 触发 EventBus `toggle-panel`（暂时无响应，Wave 2.3 接）
- ✅ 教程系统、节气 banner、通知 toast 都正常工作

⚠️ **如果出问题** —— 立刻回滚：
```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave2-2a src\App.tsx
pnpm dev
```

---

## 已知限制（Wave 2.2.A · 故意）

- ⚠️ **5 图标按钮点击无响应** — 触发了 `toggle-panel` EventBus 但旧 panel 还没监听 · Wave 2.3 接通
- ⚠️ **小地图玩家位置静态** — 不会随移动更新（Wave 2.B 才接 Phaser scene 数据）
- ⚠️ **当前任务卡片是占位** — Phase 2.5 接入 GitHub Issues 后才有真数据
- ⚠️ **旧 ChatPanel/MailBox 仍保留视觉风格**（黑底）— Wave 2.3+ 重写为像素风
- ⚠️ **登录前 TitleScreen 没改**（Wave 2.B 才改）

---

## 测试清单

```
☐ /play-new 真 profile / CV / 时间显示正确
☐ /play 登录后 NewGameAppHUD 出现
☐ /play TitleScreen 登录前不出现 NewGameAppHUD
☐ Phaser 角色 WASD 仍能移动
☐ 按 E 跟 NPC 对话仍能用
☐ 教程 24 step 仍能跑
☐ 节气切换 banner 仍能出
☐ 通知 toast 仍能出
☐ TimeOverlay 昼夜 tint 仍生效
☐ ProfilePanel (P 键)、ChatPanel (T/Enter)、QuestLog (J)、MailBox (K)、FriendsPanel (F) 仍能开
☐ 议政高地 5 panel 仍能进
☐ /u/Leoatsr 公开页仍能开
```

---

## Push

跑通后：

```powershell
git add .
git commit -m "Wave 2.2.A: Connect real stores + replace /play HUD

- 5 hooks (useProfile/useCV/useLevel/useGameTime/useOnlineCount)
- NewGameAppHUD with real data (avatar/CV/time/solar term/online)
- Removed old HUD/CVDisplay/LevelBadge/TimeHUD from App.tsx
- 5 icon buttons trigger 'toggle-panel' EventBus (handlers in Wave 2.3+)
- Old ChatPanel/MailBox/QuestLog/etc preserved (visual rewrite in Wave 2.3+)
- TutorialOverlay/SolarTermBanner/NotificationToast etc all preserved"

git push
```

---

## 下一波 · Wave 2.3

满意后回我"完成"或"接受"——我立刻开 **Wave 2.3 · ChatPanel 像素风重写**（3-4h）。

或回滚：

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave2-2a src\App.tsx
```
