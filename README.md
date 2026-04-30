# Wave 2.5.A.4 · QuestLog 审核员投票动画完整版（Q1）

UI 重构第 2 波 · QuestLog 最后一步 — **审核员投票完整动画 + Quorum toast + 烟花**

---

## 这一波做了什么

### Q1 完整版动画

| 动画 | 描述 |
|---|---|
| **Chip 滑入** | 收到投票时 · 从右滑入 + cubic-bezier 弹回（0.6s）|
| **金光晕** | fresh 卡片金色 box-shadow 脉动（1.2s）|
| **进度条** | 0% → 33% → 66% → 100% · 弹性曲线 + shine 光带 |
| **Quorum toast** | 完成时 · 全屏金色卡片旋转弹出（2.5s）|
| **烟花粒子** | 12 个粒子径向飞散 + 旋转（0.8-1.4s）|

### 文件清单

```
🆕 src/hooks/useFreshVotes.ts            (跟踪刚到的投票 · EventBus reviewer-vote-cast)
🆕 src/hooks/useQuorumEvent.ts           (监听 quest-finalized 触发 toast)
🆕 src/components/ReviewProgressBar.tsx  (弹性进度条 + shine)
🆕 src/components/QuorumToast.tsx        (全屏 toast + 12 烟花粒子)
🔄 src/components/ReviewerVoteCard.tsx   (加 isFresh 滑入 + 金光晕)
🔄 src/components/NewQuestLog.tsx        (整合 4 个组件 + 2 hooks)
🔄 src/hooks/index.ts                    (加 export)
```

---

## 安装

```powershell
cd D:\projects\cua-base

$zip = "C:\Users\ghani\Downloads\cua-spike-wave2-5a4.zip"
Test-Path $zip

tar -xf $zip
Copy-Item -Path .\cua-spike-wave2-5a4\* -Destination . -Recurse -Force
Remove-Item -Path .\cua-spike-wave2-5a4 -Recurse -Force

# 验证
Test-Path src\hooks\useFreshVotes.ts
Test-Path src\hooks\useQuorumEvent.ts
Test-Path src\components\ReviewProgressBar.tsx
Test-Path src\components\QuorumToast.tsx
```

期望 4 个 `True`。

---

## 不需要改 App.tsx

NewQuestLog 已在 App.tsx · 这次只升级文件内容。

---

## 跑

```powershell
pnpm dev
```

按 **J** 打开任务日志。

---

## 测试 · 必须用 F12 测试入口

⚠️ **审核员投票真实需要 30-90 秒** · 直接接任务等不现实。F12 模拟最快。

### Step 1 · 准备一个 reviewing 任务

F12 Console 跑：

```javascript
const s = JSON.parse(localStorage.getItem('cua-yuanye-quests-workshop-v2') || '{}');
s['paper-import'] = {
  status: 'reviewing',
  submissionLink: 'https://github.com/test/demo',
  selfRated: 1.0,
  submissionId: 'test-' + Date.now(),
  submittedAt: Date.now(),
  withdrawDeadline: Date.now() + 60000,
  votes: [],
};
localStorage.setItem('cua-yuanye-quests-workshop-v2', JSON.stringify(s));
location.reload();
```

刷新后 · 按 J · 切到**审核中** tab · 看到 paper-import 卡片 + **空进度条**（0/3 票）。

### Step 2 · 模拟收到投票（一票一票来）

F12 Console 跑（**保持 NewQuestLog 打开**）：

```javascript
import('/src/game/EventBus.ts').then(m => {
  window.__EventBus = m.EventBus;
  // 收到第 1 票
  m.EventBus.emit('reviewer-vote-cast', {
    submissionId: JSON.parse(localStorage.getItem('cua-yuanye-quests-workshop-v2') || '{}')['paper-import'].submissionId,
    vote: {
      reviewerId: 'zhouming',
      reviewerName: '周明',
      coeff: 1.0,
      comment: '基本达标，流派标签准确',
      votedAt: Date.now(),
    },
  });
});
```

⚠️ **但是** —— `reviewer-vote-cast` 只触发**前端 fresh 动画** · **不会**真正写到 localStorage。要真的让卡片显示新投票需要直接改 questStore：

```javascript
// 完整模拟收到一票（写 store + emit event）
import('/src/lib/questStore.ts').then(qs => {
  import('/src/game/EventBus.ts').then(eb => {
    window.__EventBus = eb.EventBus;
    const submissionId = JSON.parse(localStorage.getItem('cua-yuanye-quests-workshop-v2') || '{}')['paper-import'].submissionId;
    const vote = {
      reviewerId: 'zhouming',
      reviewerName: '周明',
      coeff: 1.0,
      comment: '基本达标，流派标签准确',
      votedAt: Date.now(),
    };
    qs.addReviewerVote(submissionId, vote);
    eb.EventBus.emit('reviewer-vote-cast', { submissionId, vote });
    console.log('✓ 第 1 票模拟完成 · 看 chip 滑入 + 金光晕 + 进度条 33%');
  });
});
```

### Step 3 · 模拟收到第 2 票（不同 reviewer）

```javascript
import('/src/lib/questStore.ts').then(qs => {
  import('/src/game/EventBus.ts').then(eb => {
    const submissionId = JSON.parse(localStorage.getItem('cua-yuanye-quests-workshop-v2') || '{}')['paper-import'].submissionId;
    const vote = {
      reviewerId: 'yanzhi',
      reviewerName: '严之',
      coeff: 2.0,
      comment: '隐藏 Repo 链接补全 · 高质量',
      votedAt: Date.now(),
    };
    qs.addReviewerVote(submissionId, vote);
    eb.EventBus.emit('reviewer-vote-cast', { submissionId, vote });
    console.log('✓ 第 2 票完成 · 进度条 66%');
  });
});
```

### Step 4 · 模拟收到第 3 票 + 触发 finalize（关键 · 看 toast + 烟花）

```javascript
import('/src/lib/questStore.ts').then(qs => {
  import('/src/game/EventBus.ts').then(eb => {
    const submissionId = JSON.parse(localStorage.getItem('cua-yuanye-quests-workshop-v2') || '{}')['paper-import'].submissionId;
    const vote = {
      reviewerId: 'baihui',
      reviewerName: '白徽',
      coeff: 1.0,
      comment: '稳健 · 标准达标',
      votedAt: Date.now(),
    };
    qs.addReviewerVote(submissionId, vote);
    eb.EventBus.emit('reviewer-vote-cast', { submissionId, vote });
    console.log('✓ 第 3 票完成 · 0.5s 后会触发 quorum');

    // ReviewProcessor 监听 reviewer-quorum-reached · 但因为我们直接 emit reviewer-vote-cast 没有 quorum 检查
    // 直接 emit quest-finalized 触发 toast
    setTimeout(() => {
      eb.EventBus.emit('quest-finalized', {
        taskId: 'paper-import',
        questTitle: '单篇论文入库',
        finalCoeff: 1.5,
        cpEarned: 18,
      });
      console.log('✓ quest-finalized · 看全屏 toast + 烟花');
    }, 500);
  });
});
```

---

## 测试清单

```
☐ 1. Step 1 · 进入 reviewing 状态 · 看到空进度条 0/3
☐ 2. Step 2 · 第 1 票 · chip 从右滑入 + 弹回 + 金光晕（1.2s 衰退）
☐ 3. Step 2 · 进度条从 0% 弹性增长到 33%
☐ 4. Step 2 · 进度条上有 shine 光带 loop（2s）
☐ 5. Step 3 · 第 2 票 · 同样滑入 + 金光晕 · 进度条 33% → 66%
☐ 6. Step 4 · 第 3 票 · chip 滑入 · 进度条 66% → 100%
☐ 7. Step 4 · 0.5s 后 · 全屏金色 toast 弹出（旋转 + 弹性）
☐ 8. Step 4 · toast 显示 "★ 审 核 完 成 ★ + 任务名 + x1.5 + +18 CV 入账"
☐ 9. Step 4 · 12 个金色粒子径向飞散 + 旋转
☐ 10. 2.5 秒后 · toast 自动消失
☐ 11. 静态投票卡（已存在的 vote）· 不应再播 fresh 动画
☐ 12. ESC 关闭面板 · 1s tick + 事件监听全部停止（节省资源）
```

### 兼容性

```
☐ Q2 撤回倒计时仍正常（每秒跳秒）
☐ Q3 申诉 modal 仍正常
☐ Q4 CV 金光动画仍正常
☐ 接受 / 提交 / 撤回流程仍正常
```

---

## ⚠️ 已知限制

- ⚠️ **Fresh 动画依赖 reviewer-vote-cast EventBus event**：如果直接修改 localStorage 不 emit · chip 不会播 fresh
- ⚠️ **Quorum toast 触发于 quest-finalized**：实际游戏内是 ReviewProcessor 在 quorum 达成时 emit · 测试时需要手动 emit
- ⚠️ **toast 仅在 NewQuestLog 打开时触发**：关闭面板时 useQuorumEvent 自动停止
- ⚠️ **同一 votedAt 不会重复触发 fresh**：useFreshVotes 用 Set<votedAt>

---

## ⚠️ 紧急回滚

```powershell
git checkout src/components/NewQuestLog.tsx
git checkout src/components/ReviewerVoteCard.tsx
Remove-Item src\hooks\useFreshVotes.ts -Force
Remove-Item src\hooks\useQuorumEvent.ts -Force
Remove-Item src\components\ReviewProgressBar.tsx -Force
Remove-Item src\components\QuorumToast.tsx -Force
git checkout src/hooks/index.ts
```

---

## Push

```powershell
git add .
git commit -m "Wave 2.5.A.4: Q1 reviewer vote full animation

Reviewer vote chip slide-in:
- ReviewerVoteCard: isFresh prop -> 0.6s slide-in (cubic-bezier elastic)
                     + 1.2s gold glow pulse
- useFreshVotes: track recent votes via reviewer-vote-cast EventBus event
                  Set<votedAt>, auto-clear after 1.5s

Review progress bar:
- ReviewProgressBar component: 0%/33%/66%/100% elastic transition
- Shine light band loops while in progress (2s)

Quorum toast (in-panel):
- QuorumToast component: full-screen overlay within NewQuestLog (540x600)
- Gold card pop-rotate 2.5s (cubic-bezier elastic)
- 12 firework particles radial fly + rotation
- useQuorumEvent: listens to quest-finalized, emits triggerKey

Wave 2 100% complete (16 panels migrated + 4 wave 2.5.A sub-iterations)"

git push
```

---

## 🎉 Wave 2 真完成

```
✅ 2.1 · NewGameAppHUD（10 components）
✅ 2.2.A · 5 hooks + 替换 4 个 HUD
✅ 2.3.A · NewChatPanel 世界
✅ 2.3.B · NewChatPanel 完整版
✅ 2.4 · NewMailBox + NewFriendsPanel
✅ 2.5.A · NewAnnouncementPanel
✅ 2.5.A.2 · NewQuestLog 80% 视觉
✅ 2.5.A.3 · Q2 撤回 + Q3 申诉 + Q4 CV 动画
✅ 2.5.A.4 · Q1 审核员投票完整动画 ⬅ 这次
✅ 2.5.B · 议政 3 panel
✅ 2.5.C · 远见塔/功德堂/自家小屋
✅ 2.6 · 删 16 个旧组件
✅ 2.6.B · README + docs
```

## 下一步 · 强烈建议

回我**一个**：

- **"Wave 2 真完成 · 暂停找用户测"** ✅ **强推**
- **"merge ui-redesign 到 main + 部署生产"**
- **"Wave 3 · GitHub Issues 双向同步"**
- **"调整某处"**
