# Wave 2.3.B · ChatPanel 完整版（场景 / 私聊 / 用户名搜索）

UI 重构第 2 波 · 第 4 步 — **聊天 3 频道全部上线**

---

## 这一波做了什么

| 类型 | 文件 | 作用 |
|---|---|---|
| 🆕 hook | `src/hooks/useCurrentScene.ts` | 监听 chat scene |
| 🆕 hook | `src/hooks/usePrivateConversations.ts` | 拉私聊对话列表 |
| 🆕 hook | `src/hooks/useChatHistory.ts` | 历史 + 实时 message 合并 |
| 🆕 hook | `src/hooks/useUnreadCounts.ts` | 3 频道独立未读计数 |
| 🆕 component | `src/components/ConversationItem.tsx` | 私聊 sidebar 单项 |
| 🆕 component | `src/components/UserSearchBar.tsx` | G2-D 用户名搜索 |
| 🔄 component | `src/components/NewChatPanel.tsx` | 升级到 3 频道完整版 |
| 🔄 hook | `src/hooks/index.ts` | 加 export |

✅ Wave 2.3.B 完整功能：
- 🌍 世界 / 📍 场景 / ✉ 私聊 3 频道全部激活
- 私聊 sidebar + recipient 切换
- G2-D 用户名搜索新私聊
- 各 tab 独立未读角标
- 历史消息加载（world / private 持久 · scene 实时）
- 自动选第一个 conversation（切到私聊 tab 时）
- Empty state（无消息 / 未进场景 / 未选对话 不同提示）
- 面板尺寸升级 380×520 → **480×560**（容纳私聊 sidebar）

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-3b.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-3b\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-3b -Recurse -Force

# 验证（应有 4 个新 hook + 2 个新 component + NewChatPanel 升级）
Test-Path src\hooks\useCurrentScene.ts
Test-Path src\hooks\usePrivateConversations.ts
Test-Path src\hooks\useChatHistory.ts
Test-Path src\hooks\useUnreadCounts.ts
Test-Path src\components\ConversationItem.tsx
Test-Path src\components\UserSearchBar.tsx
```

期望 6 个 `True`。

---

## 不需要改 App.tsx

NewChatPanel 已经在 App.tsx 引用（Wave 2.3.A 装的）—— 这次只是升级文件内容，App.tsx 不变。

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/play` 登录进游戏。

按 **T 键** 打开聊天面板。

---

## 测试清单

### 世界频道（Wave 2.3.A 已能用 · 验证还能跑）
```
☐ 1. 按 T 打开 · 默认在世界频道 tab
☐ 2. 看到面板尺寸更大了（480×560）
☐ 3. 历史消息自动加载（如果之前发过）
☐ 4. 发新消息 → 实时显示
☐ 5. 5s 冷却倒计时
```

### 场景频道（Wave 2.3.B 新功能）
```
☐ 6. 走进任意工坊或镇子里 → 切到 📍 场景 tab
☐ 7. 看到 header 显示 "聊天 · 萌芽镇" 等当前 scene 名
☐ 8. 发场景消息 → 只对当前 scene 玩家可见
☐ 9. 切换到另一个场景 → 历史清空（场景消息不持久）
☐ 10. 回到不在任何场景时 → 场景 tab 灰色 + "未进入场景" hint
```

### 私聊频道（Wave 2.3.B 新功能）
```
☐ 11. 切到 ✉ 私聊 tab
☐ 12. 左侧 sidebar 出现（130px 宽）
☐ 13. 如果有历史 conversation → 自动列出
☐ 14. 第一个 conversation 自动激活
☐ 15. 点 sidebar 项切换 recipient
☐ 16. 看到对应历史消息
☐ 17. 发送私聊 → 对方收到
☐ 18. 头部显示 "聊天 · {对方名字}"
☐ 19. 私聊未读角标在 tab 标签上
```

### G2-D 用户名搜索（Wave 2.3.B 新功能）
```
☐ 20. 私聊 tab → 点 sidebar 顶部 "+ 新对话"
☐ 21. 搜索栏出现
☐ 22. 输入用户名 → 按 Enter 或点 🔍
☐ 23. 找到 → 显示头像 + 名字 + @username + "对话" 按钮
☐ 24. 点 "对话" → 切到这个 recipient · 搜索栏关闭
☐ 25. 搜不存在的用户 → "找不到用户 X"
☐ 26. 搜自己 → "不能给自己发消息"
☐ 27. 再点 "+ 新对话" 收起搜索栏
```

### 未读角标（Wave 2.3.B 新功能）
```
☐ 28. 关闭面板 · 别人发世界消息 → world tab 角标 +1
☐ 29. 别人发私聊给你 → private tab 角标 +1
☐ 30. 打开面板 + 切到对应 tab → 角标清零
☐ 31. 自己发的消息不计入
```

### 兼容性
```
☐ 旧 T 键仍开（ChatPanelKeyListener 不变）
☐ 旧 ChatPanel 文件保留（src/components/ChatPanel.tsx 还在）
☐ 其他 panel（QuestLog J / MailBox K / FriendsPanel F / ProfilePanel P）仍能开
☐ 教程 / 节气 banner / 通知 toast 仍正常
☐ Phaser 多人在场仍正常
☐ 点 NewGameAppHUD 左下 💬 也能切换面板
```

---

## ⚠️ 已知小限制

- ⚠️ **Bot 消息进世界频道会显示** —— 这是设计如此，没改
- ⚠️ **conversation 列表手动刷新** —— 收到新私聊会自动 reload，但偶发延迟可手动重开 panel 触发
- ⚠️ **没消息发送动画** —— 单纯滚动到底，没有"咻"的进入效果
- ⚠️ **scene 切换历史清空** —— 场景消息不持久（这是 chatStore 设计）

---

## ⚠️ 紧急回滚

如果坏了：

```powershell
# 回滚 NewChatPanel 到 Wave 2.3.A 版本
git checkout src/components/NewChatPanel.tsx
# 删 Wave 2.3.B 新文件
Remove-Item src\hooks\useCurrentScene.ts -Force -ErrorAction SilentlyContinue
Remove-Item src\hooks\usePrivateConversations.ts -Force -ErrorAction SilentlyContinue
Remove-Item src\hooks\useChatHistory.ts -Force -ErrorAction SilentlyContinue
Remove-Item src\hooks\useUnreadCounts.ts -Force -ErrorAction SilentlyContinue
Remove-Item src\components\ConversationItem.tsx -Force -ErrorAction SilentlyContinue
Remove-Item src\components\UserSearchBar.tsx -Force -ErrorAction SilentlyContinue
git checkout src/hooks/index.ts
```

---

## Push

跑通后：

```powershell
git add .
git commit -m "Wave 2.3.B: ChatPanel full version (scene/private/search)

- 4 new hooks (useCurrentScene/usePrivateConversations/useChatHistory/useUnreadCounts)
- 2 new components (ConversationItem/UserSearchBar)
- NewChatPanel upgraded: 480x560 with sidebar
- All 3 channels active (world/scene/private)
- G2-D username search to start new private conversations
- Independent unread badges per tab
- History loading for world+private (scene is realtime-only)
- Empty states for each channel"

git push
```

---

## 下一波

Wave 2.3 完成（A + B）— ChatPanel 全部到位。

回我**一个**：

- **"完成 · 进 Wave 2.4 (MailBox + FriendsPanel)"** = 4-5h 重写两个 panel 视觉
- **"完成 · 用户测一段时间"** = 暂停一下找 5-10 个 Web Agent 同行试玩
- **"调整某处"** + 写出哪里
