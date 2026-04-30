# Wave 2.5.A.3 · QuestLog 审核流像素化（80% · Q2/Q3/Q4）

UI 重构第 2 波 · QuestLog 完整化 — **撤回倒计时 + 申诉流 + CV 金光动画**

---

## 这一波做了什么

### 3 个子功能

| Q | 功能 | 状态 |
|---|---|---|
| **Q2** | 撤回倒计时 1s tick 实时刷新 | ✅ 完成 |
| **Q3** | 申诉流入口（已完成 tab "发起申诉"按钮 + 确认 modal） | ✅ 完成 |
| **Q4** | CV 完整版金光动画（数字滚 + 金光环 + 闪光 + 浮动 +N） | ✅ 完成 |
| **Q1** | 审核员投票动画完整版（chip 滑入 + 完成 toast + 烟花） | ⏳ Wave 2.5.A.4 |

### 文件清单
```
🆕 src/hooks/useCountdownTick.ts        (Q2 1s tick)
🆕 src/components/ReviewerVoteCard.tsx  (审核员意见显示 · 简版 chip)
🆕 src/components/AppealConfirmModal.tsx (Q3 申诉确认弹窗)
🆕 src/components/CVRewardBurst.tsx     (Q4 完整版动画)
🔄 src/components/NewQuestLog.tsx       (整合 Q2/Q3/Q4)
🔄 src/hooks/index.ts                   (加 useCountdownTick export)
```

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-5a3.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-5a3\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-5a3 -Recurse -Force

# 验证
Test-Path src\hooks\useCountdownTick.ts
Test-Path src\components\ReviewerVoteCard.tsx
Test-Path src\components\AppealConfirmModal.tsx
Test-Path src\components\CVRewardBurst.tsx
```

期望 4 个 `True`。

---

## 不需要改 App.tsx

NewQuestLog 已经在 App.tsx 引用（Wave 2.5.A.2 装的）—— 这次只是升级文件内容，App.tsx 不变。

---

## 跑

```powershell
pnpm dev
```

打开 `http://localhost:5173/play` 登录进游戏。按 J 键 / 点 NewGameAppHUD 📋

---

## 测试清单

### Q2 · 撤回倒计时（看实时跳秒）
```
☐ 1. 接受任务 · 提交（任意 https URL）
☐ 2. 切到 "审核中" tab
☐ 3. 看到 "可撤回 N s" 数字 · **每秒 -1**
☐ 4. 0 秒后变 "撤回窗口已过"（仅当过期 + 还没收到 quorum 时）
☐ 5. 关闭面板 · 1s tick 自动停止（节省资源）
☐ 6. 重开面板 · 倒计时继续准确
```

### Q3 · 申诉流入口
```
☐ 7. "已完成" tab 看到任务 · 右下有 "发起申诉" 按钮（如果未申诉过）
☐ 8. 点 "发起申诉" → modal 弹出（420 宽 · 灰色背景遮罩）
☐ 9. modal 显示：自评 vs 评审 + 入账 CV chip
☐ 10. 申诉规则提示（30-90 秒 / 只上调 / CV 不扣除）
☐ 11. 点 "再想想" 关闭 modal
☐ 12. 点 "确认申诉" → toast 提示 + 任务移到 "审核中" tab（appealing 状态）
☐ 13. ESC · 优先关 modal · 不关面板
☐ 14. 申诉中状态 · 看到复审员投票列表（每收到一票就显示）
```

### Q4 · CV 完整版金光动画
```
☐ 15. 提交后等审核员投票（30-90 秒）
☐ 16. quorum 完成 · 任务自动移到 "已完成" tab
☐ 17. 看到大金色卡片：
       · "★ CV 入 账 ★" eyebrow
       · 数字 0 → cpEarned 滚动（800ms · ease-out）
       · 金光环扩散（1.5s · 4x 缩放 + opacity 衰减）
       · 背景径向闪光（600ms）
       · 浮动 +N CV（normal 3 个 · excellent 5 个 · 1.6s 浮上飘）
☐ 18. 10 秒后 · 退化为静态 chip "+N CV · x1.0 · 日期"
☐ 19. 重开面板 · 已经过 10s 的不再播动画（直接静态）
☐ 20. x2.0 卓越任务 · 浮动 +N 数量更多
```

### ReviewerVoteCard（reviewing tab）
```
☐ 21. "审核中" tab · 看到任务 · 收到投票后展开 extra
☐ 22. 看到 "审核员意见" eyebrow
☐ 23. 每条投票卡：头像 + 名字 + coeff chip + 评论（斜体）
☐ 24. coeff x0.5 红 / x1.0 普通 / x2.0 金
```

### 兼容性
```
☐ 接受 / 提交 / 撤回 流程仍正常
☐ ReviewProcessor / AppealProcessor headless 仍正常工作
☐ Mail / Chat / Friends / 议政 / 远见塔 等 panel 仍能开
```

---

## ⚠️ 已知限制

- ⚠️ **Q1 审核员投票动画完整版** 留 Wave 2.5.A.4（chip 滑入 + 全屏 toast + 烟花）
- ⚠️ **CV 动画窗口 10 秒** · 在 finalizedAt + 10s 内打开面板才看到动画 · 错过就静态
- ⚠️ **申诉 modal 是 React DOM** · 不是 Phaser 内 [E] 触发的明镜阁 panel · 两个入口并存
- ⚠️ **撤回倒计时仅当 panel 打开时跑** · 关闭面板时 1s tick 自动停止（节省资源 · 但偶发跳秒不准）

---

## ⚠️ 紧急回滚

```powershell
# 回滚 NewQuestLog 到 Wave 2.5.A.2 版本
git checkout src/components/NewQuestLog.tsx

# 删 Wave 2.5.A.3 新文件
Remove-Item src\hooks\useCountdownTick.ts -Force
Remove-Item src\components\ReviewerVoteCard.tsx -Force
Remove-Item src\components\AppealConfirmModal.tsx -Force
Remove-Item src\components\CVRewardBurst.tsx -Force
git checkout src/hooks/index.ts
```

---

## Push

```powershell
git add .
git commit -m "Wave 2.5.A.3: QuestLog Q2/Q3/Q4 (countdown + appeal + CV animation)

Q2 · Withdraw countdown 1s tick:
- useCountdownTick hook (interval-based · auto-stop when panel closed)
- Live remaining seconds in reviewing tab

Q3 · Appeal flow inline:
- AppealConfirmModal (420w · self vs final + rules + CV chip)
- 'Submit appeal' button on completed quests (if !appealed)
- ESC stack: modal → submit form → panel
- 100% compatible with NewAppealDeskPanel (same startAppealState API)

Q4 · CV full reward animation:
- CVRewardBurst component (10s window after finalizedAt)
- Number rolling 0 → cpEarned (800ms ease-out cubic)
- Gold ring expand (1.5s · 4x scale)
- Background radial flash (600ms)
- Floating +N (3 normal / 5 excellent · 1.6s upward)

ReviewerVoteCard:
- Replaces plain '0/3' text in reviewing tab
- Avatar + name + coeff chip + italic comment

Q1 (reviewer vote animation full version) → Wave 2.5.A.4"

git push
```

---

## 下一波

回我**一个**：

- **"完成 · 进 Wave 2.5.A.4"** = Q1 审核员投票动画完整版（4-5h 单波）
- **"完成 · 暂停找用户测"**
- **"调整某处"** + 写出
