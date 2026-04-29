import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprite, TileMap, PixelButton, Chip } from '../ui';
import {
  AvatarPanel,
  CVBar,
  TopRightChips,
  Minimap,
  QuestCard,
  IconBar,
  Hotbar,
  DialogueBox,
  HelpButton,
  KeyHint,
} from '../ui/hud';
import {
  useProfile,
  useCV,
  useLevel,
  useGameTime,
  useOnlineCount,
} from '../hooks';
import { formatTime, phaseLabel } from '../lib/timeStore';
import { useState } from 'react';

/**
 * Game View Preview — /play-new 路由
 *
 * Wave 2.2.A 阶段：用真 store 数据，但游戏画面是 SVG 模拟（非 Phaser）
 *
 * 跟 NewGameAppHUD 区别：
 *   - GameViewPreview 是隔离测试，跟 PhaserGame 不共存
 *   - 用 SVG TileMap 模拟萌芽镇场景
 *   - 不会触发真 panel 切换（避免影响真游戏状态）
 */

const SPROUTOWN_MAP = [
  'GGGGGGGGGGGGGGGGGGGGGGGG',
  'GGTTTGGGGGGGGGGGGGGTTTGG',
  'GGGGGGGPPPPPPPPGGGGGGGGG',
  'GGGGGGGPHHHHHHPGGGTTGGGG',
  'GGTGGGGPHWWWWHPGGGGGGGGG',
  'GGGGGGGPHHDHHHPGGGGGGGGG',
  'GGGGGGGPPPPPPPPGGGGGGGGG',
  'GGGGRRRRRRRRRRRRRRRGGGGG',
  'GGGGGGGGGGGGGGGGGGGGTTGG',
  'GGGGGGGPPPPPPPPGGGGGGGGG',
  'GGTGGGGPSSSSSSPGGGGGGGGG',
  'GGGGGGGPSDSSSSPGGGGGGGTG',
  'GGGGGGGPPPPPPPPGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGG',
];

const SPROUTOWN_PALETTE = {
  G: { fill: '#8fbc5c', dot: '#7fab4c' },
  T: { fill: '#4f7838' },
  P: { fill: '#cd853f' },
  H: { fill: '#daa520' },
  W: { fill: '#5a7da8' },
  D: { fill: '#3a2a1a' },
  R: { fill: '#a89070', line: '#8a7050' },
  S: { fill: '#8a877f', dot: '#6e6c66' },
};

const DIALOGUES = [
  '初来乍到？先把这五件小事做了，CV 自然来。',
  '看见前面那家百科工坊没有？走进去就能接到第一份正经活儿。',
  '工坊主会开出一个任务列表，从 GitHub Issues 实时拉取。',
  '完成后回来按 E 提交链接 —— 三审通过 CV 就到账。',
  '攒够 100 CV 升 L1，解锁贡献者中心 9 工坊。去吧！',
];

export function GameViewPreview() {
  const navigate = useNavigate();
  const profile = useProfile();
  const cv = useCV();
  const levelInfo = useLevel();
  const gameTime = useGameTime();
  const online = useOnlineCount();

  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const advanceDialogue = () => {
    if (dialogueIndex < DIALOGUES.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setShowDialogue(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* 假游戏场景 — 萌芽镇 SVG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          background:
            'linear-gradient(180deg, #fce5b4 0%, #f5deb3 30%, #b3d68a 50%, #8fbc5c 100%)',
        }}
      >
        <div style={{ transform: 'scale(1.4)' }}>
          <TileMap
            data={SPROUTOWN_MAP}
            palette={SPROUTOWN_PALETTE}
            tileSize={16}
            scale={2}
            sprites={[
              { x: 11, y: 5, w: 12, h: 16, el: <Sprite name="char" scale={1} /> },
              {
                x: 14,
                y: 7,
                w: 12,
                h: 16,
                el: (
                  <Sprite
                    name="char"
                    scale={1}
                    palette={{
                      '1': '#fce5c4',
                      '2': '#3a2a1a',
                      '3': '#2f6b5d',
                      '4': '#1f4a40',
                    }}
                  />
                ),
              },
              {
                x: 8,
                y: 11,
                w: 12,
                h: 16,
                el: (
                  <Sprite
                    name="char"
                    scale={1}
                    palette={{
                      '1': '#fce5c4',
                      '2': '#3a2a1a',
                      '3': '#c0392b',
                      '4': '#7a1f1f',
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* 顶部返回按钮 */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
        }}
      >
        <PixelButton size="pb-sm" onClick={() => navigate('/')}>
          ← 返回官网
        </PixelButton>
      </div>

      {/* 左上 — 真 profile + CV */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          zIndex: 5,
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

      {/* 右上 — 真节气 / 时间 / 在线人数 */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 10,
          zIndex: 5,
        }}
      >
        <TopRightChips
          solarTerm={gameTime.solarTerm}
          clockTime={formatTime(gameTime)}
          daypart={phaseLabel(gameTime.phase)}
          onlineCount={online.global}
        />
      </div>

      {/* 右上 · 小地图 */}
      <div style={{ position: 'absolute', top: 60, right: 12, zIndex: 5 }}>
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
          position: 'absolute',
          top: 110,
          left: 12,
          zIndex: 5,
          width: 280,
        }}
      >
        <QuestCard
          title="未接取任务"
          description="靠近任意工坊主，按 E 接取任务。Phase 2.5 上线后将自动从 GitHub Issues 拉取真实贡献任务。"
          workshopName="Phase 2.5 待接入"
        />
      </div>

      {/* 左下 — 5 图标按钮（preview 不触发真 panel）*/}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 5 }}>
        <IconBar
          items={[
            { icon: '📜', label: '公告', onClick: () => alert('Preview · 真 /play 会触发公告板') },
            { icon: '📋', label: '任务', onClick: () => alert('Preview · 真 /play 会触发任务日志') },
            { icon: '✉', label: '邮件', badge: 0, onClick: () => alert('Preview · 真 /play 会触发邮件') },
            { icon: '💬', label: '聊天', onClick: () => alert('Preview · 真 /play 会触发聊天') },
            { icon: '👥', label: '好友', onClick: () => alert('Preview · 真 /play 会触发好友') },
          ]}
        />
      </div>

      {/* 右下 — Hotbar + 帮助 */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          zIndex: 5,
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
        <HelpButton onClick={() => alert('Preview · 手册 TBD')} />
      </div>

      {showDialogue && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 90,
            transform: 'translateX(-50%)',
            width: 'min(720px, 90%)',
            zIndex: 4,
          }}
        >
          <DialogueBox
            npcName="村长 · 阿降"
            text={DIALOGUES[dialogueIndex]}
            onAdvance={advanceDialogue}
          />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
        }}
      >
        <KeyHint />
      </div>

      {/* 调试小标签 */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(calc(-50% + 80px))',
          zIndex: 6,
        }}
      >
        <Chip>Wave 2.2.A · 真数据 · /play 即将切换</Chip>
      </div>
    </div>
  );
}
