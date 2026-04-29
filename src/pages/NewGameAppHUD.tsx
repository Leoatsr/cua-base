import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprite } from '../ui';
import {
  AvatarPanel,
  CVBar,
  TopRightChips,
  Minimap,
  QuestCard,
  IconBar,
  Hotbar,
} from '../ui/hud';
import {
  useProfile,
  useCV,
  useLevel,
  useGameTime,
  useOnlineCount,
} from '../hooks';
import { formatTime, phaseLabel } from '../lib/timeStore';
import { EventBus } from '../game/EventBus';

/**
 * NewGameApp · /play 路由替换 MainGameApp 视觉部分
 *
 * Wave 2.2.A · 这一波做的事:
 *   ✅ 接通 7 个真 store (profile/level/cv/time/online)
 *   ✅ 替换视觉：旧 HUD/CVDisplay/LevelBadge/TimeHUD → 新像素风
 *   ✅ 5 图标按钮触发现有 toggle (打开旧 panel)
 *   ✅ Phaser canvas 共存
 *   ✅ 教程/通知/节气/审核/议政等关键功能全保留
 *
 * Wave 2.3+ 后续:
 *   🔧 重写 ChatPanel/MailBox/FriendsPanel/QuestLog 视觉
 *   🔧 删除旧 HUD/CVDisplay 等组件文件
 */

interface NewGameAppHUDProps {
  /** 是否显示 HUD（登录前 TitleScreen 时不显示）*/
  visible?: boolean;
}

export function NewGameAppHUD({ visible = true }: NewGameAppHUDProps) {
  const navigate = useNavigate();
  const profile = useProfile();
  const cv = useCV();
  const levelInfo = useLevel();
  const gameTime = useGameTime();
  const online = useOnlineCount();

  // 锁定 body overflow（游戏全屏，禁止滚动）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!visible) return null;

  // ============================================================
  // 5 图标按钮触发 EventBus 让现有 panel toggle
  // 目前用 emit 通用事件 'toggle-panel'，每个旧 panel 自己监听
  // 后续 Wave 2.3+ 重写 panel 时改成直接触发新 panel
  // ============================================================
  const triggerPanel = (panel: 'announcement' | 'questlog' | 'mail' | 'chat' | 'friends') => {
    EventBus.emit('toggle-panel', { panel });
  };

  return (
    <>
      {/* 顶部返回按钮 */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          pointerEvents: 'auto',
        }}
      >
        <button
          className="pb pb-sm"
          onClick={() => navigate('/')}
        >
          ← 返回官网
        </button>
      </div>

      {/* 左上 — 头像 + CV 进度条 */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <AvatarPanel
          name={profile?.display_name || profile?.username || '...'}
          level={`${levelInfo.level.lv} · ${levelInfo.level.name}`}
        />
        <CVBar
          current={cv}
          threshold={levelInfo.nextThreshold || 100}
          nextLevelLabel={levelInfo.nextLevelLabel}
        />
      </div>

      {/* 右上 — 节气 / 时间 / 在线 chips */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 10,
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <TopRightChips
          solarTerm={gameTime.solarTerm}
          clockTime={formatTime(gameTime)}
          daypart={phaseLabel(gameTime.phase)}
          onlineCount={online.global}
        />
      </div>

      {/* 右上 — 小地图（避开 chips） */}
      <div
        style={{
          position: 'fixed',
          top: 60,
          right: 12,
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <Minimap
          sceneName="萌芽镇"
          playerX={45}
          playerY={55}
          landmarks={[
            { x: 30, y: 30, w: 40, h: 20, color: '#daa520' },
            { x: 20, y: 60, w: 30, h: 15, color: '#cd853f' },
          ]}
          road={{ y: 50 }}
        />
      </div>

      {/* 左中 — 当前任务（占位）*/}
      <div
        style={{
          position: 'fixed',
          top: 110,
          left: 12,
          zIndex: 50,
          width: 280,
          pointerEvents: 'auto',
        }}
      >
        <QuestCard
          title="未接取任务"
          description="靠近任意工坊主，按 E 接取任务。Phase 2.5 上线后将自动从 GitHub Issues 拉取真实贡献任务。"
          workshopName="Phase 2.5 待接入"
        />
      </div>

      {/* 左下 — 5 图标按钮 */}
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <IconBar
          items={[
            { icon: '📜', label: '公告', onClick: () => triggerPanel('announcement') },
            { icon: '📋', label: '任务', onClick: () => triggerPanel('questlog') },
            { icon: '✉', label: '邮件', onClick: () => triggerPanel('mail') },
            { icon: '💬', label: '聊天', onClick: () => triggerPanel('chat') },
            { icon: '👥', label: '好友', onClick: () => triggerPanel('friends') },
          ]}
        />
      </div>

      {/* 右下 — Hotbar + 帮助按钮 */}
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <Hotbar
          slots={[
            { content: <Sprite name="leaf" scale={3} /> },
            { content: <Sprite name="coin" scale={3} />, qty: cv > 0 ? cv : undefined },
            { content: <span style={{ fontSize: 22 }}>📜</span> },
            {},
            {},
          ]}
        />
        <button
          className="pb pb-primary"
          onClick={() => triggerPanel('announcement')}
          style={{ width: 56, height: 56, padding: 0, fontSize: 24 }}
        >
          ?
        </button>
      </div>
    </>
  );
}
