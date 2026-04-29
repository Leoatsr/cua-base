# CUA 基地 · CUA Base

> _A pixel MMO for the WebAgentLab open-source community._
>
> 像素风浏览器游戏化协作平台 · 为 WebAgentLab 开源社区打造

[![ui-redesign](https://img.shields.io/badge/branch-ui--redesign-orange)](https://github.com/Leoatsr/cua-base/tree/ui-redesign)
[![tech](https://img.shields.io/badge/tech-Vite_8_+_React_19_+_Phaser_3.90-blue)]()
[![status](https://img.shields.io/badge/Wave_2-complete-green)]()

---

## 这是什么

**CUA 基地（CUA Base）**是一个像素风的浏览器协作平台 —— 用游戏化的方式让 Web Agent 开发者贡献、互动、参与治理。

不是单机游戏。不是元宇宙。这是一个**协作工坊** —— 每完成一份真实贡献就有 CV 入账、有审核员复审、有同行投票。

### 核心理念

- **降噪** — 不打扰、不推送、不通知轰炸
- **链接** — 用工坊系统让贡献者自然连接
- **共创** — 每一份 commit / 论文 / Issue · 都看得到

---

## 项目状态

🎉 **Wave 2 UI 重写完成（2026-04）** —— 16 个面板全部从黑底深色 UI 迁移到**像素古籍风**。

- ✅ NewGameAppHUD（10 个 HUD 组件）
- ✅ 7 大功能面板（Chat / Mail / Friends / Quest / 公告板 / 议政 / 远见塔 等）
- ✅ 共享 UI 库（PixelPanel / PixelButton / Chip / Sprite / TileMap / Banner / Divider）
- ✅ 设计系统（design-system.css · CSS vars · 像素古籍风）

详见 [docs/wave-2-summary.md](./docs/wave-2-summary.md)

---

## 技术栈

```
Frontend:  Vite 8 + React 19 + TypeScript (strict)
Game:      Phaser 3.90
Realtime:  Supabase (Auth + Realtime + Postgres + RLS)
Routing:   react-router-dom 7
Errors:    Sentry
Deploy:    Vercel
Package:   pnpm
```

**编译验证命令**：

```bash
npx tsc --noEmit --verbatimModuleSyntax --noUnusedLocals --noUnusedParameters
```

---

## 跑起来

### 前置依赖

- Node.js ≥ 20
- pnpm ≥ 10
- Supabase 账号（自己建一个免费 project）

### 步骤

```powershell
# 1. clone
git clone https://github.com/Leoatsr/cua-base.git
cd cua-base
git checkout ui-redesign

# 2. 装依赖
pnpm install

# 3. 配置环境变量（写 .env.local）
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJxxx

# 4. 跑
pnpm dev
```

打开 `http://localhost:5173/`。

---

## 主要功能

### 🌱 萌芽镇（Phase 1 · 已完成）
- 9 大角色变量
- 阿降 NPC + 引导教程
- 典籍阁 / 铁匠铺 / 阿降小屋
- 萌芽印记成长系统

### 🛠 共创之都（Phase 2 · 进行中）
- **百晓居首工坊** · 5 真任务：
  - 单篇论文入库（10–15 CV）
  - 作者/机构卡片完善（5 CV）
  - 单周数据质量抽查（50 CV）
  - 自动化抓取脚本（150–300 CV）
  - 季度技术版图研判（200–300 CV）
- 任务提交 / 撤回（3 分钟窗口） / 3 审核员投票 / 申诉闭环
- CV 入账 + 邮件系统

### 🏛 议政高地（Phase 4 · 进行中）
- **议政厅** · 提案投票（5 类别 + 4 时长 · L2 mentor 守门 · L1 投票）
- **明镜阁** · 申诉案桌（3 复审员独立评议 · 只上调不下调）
- **远见塔** · 5 阶段路线图（you are here）

### 🏆 功德堂（Phase 4 · 进行中）
- CV 排行榜（Top 20 · 自己高亮）

### 🏠 自家小屋（Phase 1 · 已完成）
- 个人成就时间轴（CV / 任务 / 提案）

---

## 键盘快捷键

| 键 | 功能 |
|---|---|
| `T` | 打开聊天 |
| `K` | 打开邮件 |
| `F` | 打开好友 |
| `J` | 打开任务日志 |
| `P` | 打开个人资料 |
| `E` | 与 NPC / 设施交互（在游戏内） |
| `Esc` | 关闭当前面板 |

底部 5 图标按钮（NewGameAppHUD）：📜 公告 · 📋 任务 · ✉ 邮件 · 💬 聊天 · 👥 好友

---

## 项目结构

```
cua-base/
├── src/
│   ├── components/    # 共享 UI 组件（28 个 NewXxx 面板）
│   ├── ui/             # 像素 UI 库（PixelPanel / PixelButton / Chip ...）
│   ├── ui/hud/         # NewGameAppHUD 子组件（AvatarPanel / CVBar / IconBar ...）
│   ├── hooks/          # React hooks（useProfile / useCV / useLevel / useChatMessages ...）
│   ├── pages/          # 路由页面（LandingPage / NewGameAppHUD / ManualPage ...）
│   ├── lib/            # 数据 store（chatStore / questStore / proposalStore ...）
│   ├── game/           # Phaser 场景 + EventBus
│   └── styles/         # design-system.css
├── docs/               # 开发文档（wave-2-summary.md ...）
└── sql/                # Supabase migration（25 个 .sql 文件）
```

---

## 设计系统

像素古籍风 · 受**宋代雕版印刷**启发：

- **配色** · paper-0/1/2/3（米黄）+ wood-1/2/3/4（深木色）+ gold（鎏金）+ ink（墨黑）
- **字体** · `Ma Shan Zheng`（标题）/ `ZCOOL XiaoWei`（标题次）/ `霞鹜文楷`（正文）/ `Inter`（数字）
- **像素 vs 古籍** · 边框使用像素角（::before/::after 4×4 木色方块） · 整体保持古籍纸质感
- **行距** · 正文 1.7 · 古籍呼吸感

详见 `src/styles/design-system.css`。

---

## 贡献

CUA 基地是为 WebAgentLab 社区打造的 —— 欢迎提 Issue · 欢迎 PR · 欢迎来玩。

```
GitHub: https://github.com/Leoatsr/cua-base
社区:    WebAgentLab
作者:    Leoatsr
```

---

## 相关项目

- 🌸 [花信风 (HuaXinFeng)](https://github.com/Leoatsr/HUAXIN) · 传统 24 番花信风物候地图
- 📜 [唐代诗人足迹地图](https://github.com/Leoatsr/zujiditu) · 40 唐代诗人 462 足迹

---

## License

MIT
