# Wave 2.4 · MailBox + FriendsPanel 像素风重写

UI 重构第 2 波 · 第 5 步 — **邮件 + 社交两大面板像素风**

---

## 这一波做了什么

### 4 个新 hook
| Hook | 作用 |
|---|---|
| `useMail` | 邮件列表 + 未读数 + 监听 `mail-received` |
| `useFriends` | 好友 + 请求 · 监听 `friends-updated` |
| `useFollows` | 关注 + 粉丝 · 监听 `follows-updated` |
| `useOpenViaEventBus` | 监听旧 `open-mailbox` / `open-friends-panel` + 新 `toggle-panel` |

### 4 个新 component
| Component | 作用 |
|---|---|
| `MailItem` | 邮件 sidebar 单项（图标 + 主题 + 时间 + 未读点）|
| `NewMailBox` | 邮件主面板（左 sidebar + 右详情 · 480×560）|
| `FriendItem` | 通用好友/请求/关注/粉丝单项 |
| `NewFriendsPanel` | 社交主面板（4 tab + 加好友搜索 · 480×560）|

### 文件清单
```
🆕 src/hooks/useMail.ts
🆕 src/hooks/useFriends.ts
🆕 src/hooks/useFollows.ts
🆕 src/hooks/useOpenViaEventBus.ts
🆕 src/components/MailItem.tsx
🆕 src/components/NewMailBox.tsx
🆕 src/components/FriendItem.tsx
🆕 src/components/NewFriendsPanel.tsx
🔄 src/hooks/index.ts (加 export)
```

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-4.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-4\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-4 -Recurse -Force

# 验证
Test-Path src\hooks\useMail.ts
Test-Path src\hooks\useFriends.ts
Test-Path src\hooks\useFollows.ts
Test-Path src\components\NewMailBox.tsx
Test-Path src\components\NewFriendsPanel.tsx
```

期望 5 个 `True`。

---

## 必须手动改 src/App.tsx · 替换 2 个 panel

```powershell
cd D:\projects\cua-base

Copy-Item src\App.tsx D:\projects\backup-cua\App.tsx.before-wave2-4 -ErrorAction SilentlyContinue

$content = [System.IO.File]::ReadAllText("$PWD\src\App.tsx", [System.Text.UTF8Encoding]::new($false))

# 加 imports
$oldImport = "import { NewChatPanel } from './components/NewChatPanel';"
$newImport = "import { NewChatPanel } from './components/NewChatPanel';`r`nimport { NewMailBox } from './components/NewMailBox';`r`nimport { NewFriendsPanel } from './components/NewFriendsPanel';"
$content = $content.Replace($oldImport, $newImport)

# 替换 <MailBox /> → <NewMailBox />
$content = $content -replace '<MailBox />', '<NewMailBox />'
# 替换 <FriendsPanel /> → <NewFriendsPanel />
$content = $content -replace '<FriendsPanel />', '<NewFriendsPanel />'

[System.IO.File]::WriteAllText("$PWD\src\App.tsx", $content, [System.Text.UTF8Encoding]::new($false))

# 验证
Write-Host "=== imports ==="
Select-String -Path src\App.tsx -Pattern "from './components/NewMailBox'|from './components/NewFriendsPanel'" | Format-Table LineNumber, Line

Write-Host "=== 应该只有 1 个 NewMailBox · 0 个 MailBox ==="
Select-String -Path src\App.tsx -Pattern '<MailBox />|<NewMailBox />' | Format-Table LineNumber, Line

Write-Host "=== 应该只有 1 个 NewFriendsPanel · 0 个 FriendsPanel ==="
Select-String -Path src\App.tsx -Pattern '<FriendsPanel />|<NewFriendsPanel />' | Format-Table LineNumber, Line
```

⚠️ **注意**：保留 `<MailBadge />`、`<FriendsKeyListener />` 等 — 它们仍然能用。

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/play` 登录进游戏。

按 **K 键** → 邮件面板  
按 **F 键** → 社交面板

或点 NewGameAppHUD 左下 ✉ / 👥 图标

---

## 测试清单

### 邮件
```
☐ 1. 按 K 打开 → 像素风邮件面板（480×560）
☐ 2. 看到左 sidebar 列表 + 右详情
☐ 3. 看到欢迎邮件（系统类）
☐ 4. 自动选第一封 + 自动标记已读
☐ 5. 切换邮件 → 详情更新
☐ 6. 未读邮件有金色小圆点
☐ 7. 类别 chip 颜色：系统(灰)/审核(金)/裁定(绿)/申诉(红)/CV(春)
☐ 8. 时间相对：刚刚/N分前/N小时前/N天前
☐ 9. 点 "删除" → 邮件消失
☐ 10. ESC 关闭
☐ 11. 点 NewGameAppHUD 左下 ✉ → 切换面板
```

### 好友
```
☐ 12. 按 F 打开 → 像素风社交面板（480×560）
☐ 13. 看到 4 tab：好友 / 请求 / 关注 / 粉丝
☐ 14. 默认在好友 tab
☐ 15. 切到请求 tab → 看到 incoming + outgoing 分组
☐ 16. 收到的请求：接受 / 拒绝 按钮
☐ 17. 已发送：撤回 按钮
☐ 18. 收到请求时 · 请求 tab 上有红色角标
☐ 19. 点 "+ 加好友" → 搜索栏
☐ 20. 输入用户名 + 🔍 → 找到用户
☐ 21. 点 "加好友" → 发请求 + toast 提示 + 自动跳到请求 tab
☐ 22. 切到关注 tab → 看到关注列表 + 取关按钮
☐ 23. 切到粉丝 tab → 看到粉丝列表
☐ 24. 各 tab 数字角标
☐ 25. 自己用户名搜索 → "不能加自己为好友"
☐ 26. ESC 关闭
☐ 27. 点 NewGameAppHUD 左下 👥 → 切换面板
```

### 兼容性
```
☐ 旧 K 键 / F 键仍能用（emit 旧事件）
☐ 旧 MailBox / FriendsPanel 文件保留
☐ 其他 panel（QuestLog J / ChatPanel T / ProfilePanel P）仍能开
☐ 教程 / 节气 banner / 通知 toast 仍正常
☐ Phaser 多人在场仍正常
```

---

## ⚠️ 紧急回滚

```powershell
Copy-Item D:\projects\backup-cua\App.tsx.before-wave2-4 src\App.tsx
pnpm dev
```

---

## Push

```powershell
git add .
git commit -m "Wave 2.4: NewMailBox + NewFriendsPanel pixel rewrite

- 4 new hooks (useMail/useFriends/useFollows/useOpenViaEventBus)
- 4 new components (MailItem/NewMailBox/FriendItem/NewFriendsPanel)
- NewMailBox: 480x560 list+detail layout, all 5 categories
- NewFriendsPanel: 4 tabs (friends/requests/following/followers)
- Add-friend username search with toast feedback
- Independent unread badges per tab
- Old MailBox/FriendsPanel files preserved (Wave 2.6 cleanup)"

git push
```

---

## 下一波

回我**一个**：

- **"完成 · 进 Wave 2.5"** = QuestLog + 公告板 + 议政 panel 重写（4-5h）
- **"完成 · 暂停找用户测"** = 暂停一周左右
- **"调整某处"** + 写出哪里
