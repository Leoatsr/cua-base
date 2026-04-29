# Wave 1 · 设计系统 + Landing 页 + React Router

UI 重构第 1 波 · 4-5h 工作量

---

## 这一波做了什么

| 类型 | 文件 | 说明 |
|---|---|---|
| 🆕 CSS | `src/styles/design-system.css` | 设计 token + 像素组件 CSS |
| 🆕 React | `src/ui/Chip.tsx` | 标签 |
| 🆕 React | `src/ui/PixelPanel.tsx` | 古籍纸面板 |
| 🆕 React | `src/ui/PixelButton.tsx` | 像素按钮 |
| 🆕 React | `src/ui/Sprite.tsx` | SVG 像素艺术 sprite |
| 🆕 React | `src/ui/TileMap.tsx` | tile 地图渲染 |
| 🆕 React | `src/ui/Banner.tsx` | 横幅 |
| 🆕 React | `src/ui/Divider.tsx` | 分割线 |
| 🆕 lib | `src/lib/gameMeta.ts` | GAME 数据（区域 / 工坊 / NPC / 等级）|
| 🆕 React | `src/pages/Landing.tsx` | 落地页 → `/` 路由 |
| 🆕 React | `src/pages/ComingSoon.tsx` | `/manual` `/codex` `/maps` 临时占位 |

无 SQL · 无 Phaser 改动 · 无破坏性改动 · localStorage key 不动。

---

## ⚠️ 你需要手动改 2 个文件

我没有你最新 `main.tsx` 和 `App.tsx` 的副本——你必须**手动修改**这 2 个文件。

### 文件 1 · `index.html` 加字体

打开 `index.html`，在 `<head>` 里**最前面**加：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Noto+Serif+SC:wght@400;700;900&family=Noto+Sans+SC:wght@400;500;700&family=Press+Start+2P&display=swap" rel="stylesheet" />
```

### 文件 2 · `src/main.tsx` import css

在 `main.tsx` **最顶部**加一行 import：

```typescript
import './styles/design-system.css';
```

完整 main.tsx 大概长这样（你参考自己的实际现状）：

```typescript
import './styles/design-system.css';
// ... 其他 import

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 文件 3 · `src/App.tsx` 加 React Router

这是**关键**——你的 `App.tsx` 需要改成 React Router 包装。

#### 当前你的 App.tsx 大概长这样

```typescript
function App() {
  return (
    <>
      <PhaserGame />
      <HUD />
      <TutorialOverlay />
      {/* 等等所有顶层组件 */}
    </>
  );
}
```

#### 改成这样（关键部分）

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/Landing';
import { ManualPage, CodexPage, MapsPage } from './pages/ComingSoon';
// 你已有的 PublicProfilePage import 保持

// 把现有的"游戏主体" 抽成一个 GameApp 组件
function GameApp() {
  // 这里放你原来 App() 的所有内容（PhaserGame / HUD / 各种 panel 等）
  return (
    <>
      <PhaserGame />
      <HUD />
      <TutorialOverlay />
      {/* 等等 */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<GameApp />} />
        <Route path="/manual" element={<ManualPage />} />
        <Route path="/codex" element={<CodexPage />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/u/:username" element={<PublicProfilePage />} />
        {/* fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

⚠️ **重要**：你之前如果在 App.tsx 里有 useEffect / useState 等顶层逻辑（比如 tutorialManager.load() / timeSettings.load() / startSolarTermNotifier()）—— 这些要**移到 GameApp 组件里**，或保留在 App() 但放在 BrowserRouter 之外（如果不依赖路由）。

---

## 安装

```powershell
cd D:\projects\cua-base

# 确认在 ui-redesign 分支
git branch
# 期望看到 * ui-redesign

# 装 zip
tar -xf C:\Users\ghani\Downloads\cua-spike-wave1.zip
Copy-Item -Path .\cua-spike-wave1\* -Destination . -Recurse -Force
Remove-Item -Recurse cua-spike-wave1

# 验证新文件都在
Test-Path src\styles\design-system.css
Test-Path src\ui\PixelPanel.tsx
Test-Path src\pages\Landing.tsx

# 手动改 index.html / main.tsx / App.tsx（按上面说明）
notepad index.html
notepad src\main.tsx
notepad src\App.tsx

# 跑
pnpm dev
```

---

## 测试

### A. 落地页（/）

打开 `http://localhost:5173/`

期望看到：
- ✅ 顶部横栏：左侧 "CUA 基地" + 叶子 sprite，右侧导航（首页 / 手册 / 图鉴 / 地图 / 进入游戏 ▶）
- ✅ Hero 区："PHASE 3" 横幅 + "把开源贡献，变成一座有人的镇" 大标题 + 像素插画
- ✅ 三大区域（萌芽镇 / 贡献者中心 / 议政高地）
- ✅ 9 工坊网格（降噪 / 链接 / 共创）
- ✅ 核心循环 7 步流程
- ✅ "已实现系统" + "正在做的事" 4 卡片
- ✅ CTA 区 + Footer

### B. /play

点 "进入游戏 ▶" 按钮 → 跳到 `/play` → 应该看到原来的游戏（含 HUD / Phaser 等）

⚠️ Wave 1 不改游戏内 UI——所以 `/play` 看到的是旧版样式。Wave 2 才改。

### C. /manual /codex /maps

点导航 → 跳到 ComingSoon 占位页 → 看到"正在重构中" + "回首页看进度" 按钮

### D. /u/{username}

之前的公开页路由保持不动 —— 还能正常访问。

---

## ⚠️ 已知风险

### 1. App.tsx 改坏了游戏跑不起来

⚠️ 改 App.tsx 加 BrowserRouter 时容易出错。如果 `/play` 跳过去看到白屏：

```powershell
# F12 看 Console 报错
# 90% 是某个 useState / useEffect 的位置不对

# 紧急回滚
git checkout src/App.tsx
```

### 2. 字体加载慢

首次加载 Google Fonts 可能慢（特别是大陆访问）。可以考虑：
- 改用国内字体 CDN（fonts.font.im）
- 或本地化字体（webfontloader）

Wave 1 暂不优化——后续再说。

### 3. 样式冲突

新的 design-system.css 跟你现有的 Tailwind / index.css 可能有冲突——尤其 `body` `html` 的全局 reset。

如果出现奇怪的样式，看 F12 → Elements → 检查 cascade。

---

## 验证 Wave 1 通过

跑通后做 4 件事：

```powershell
# 1. 编译通过
pnpm build

# 2. dev 跑通
pnpm dev

# 3. 浏览器看 4 个 URL 都能开
# http://localhost:5173/
# http://localhost:5173/play
# http://localhost:5173/manual
# http://localhost:5173/u/Leoatsr  (如果你之前能开)

# 4. 没看到红色 console error
```

---

## Push 到分支

```powershell
git add .
git status

# 看了 staged 没问题后
git commit -m "Wave 1: Design system + Landing + React Router

- New design system CSS (pixel ancient-book aesthetic)
- 8 shared UI components (PixelPanel/Button/Sprite/TileMap/Banner/Chip/Divider)
- Landing page at / route
- ComingSoon placeholders at /manual /codex /maps (Wave 2-4 will replace)
- /play route wraps existing game"

git push
```

Push 后 Vercel 会自动给 ui-redesign 分支生成 preview URL：

```
cua-base-git-ui-redesign-leoatsr.vercel.app
```

打开看效果。

---

## 下一波

跑通 Wave 1 后，回我"完成"——我立刻开始 Wave 2（游戏内 HUD 全套）。
