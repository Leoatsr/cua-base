import { PixelPanel } from '../index';

interface MinimapProps {
  sceneName?: string;       // 场景名 e.g. "萌芽镇"
  playerX?: number;         // 0-100 percent
  playerY?: number;
  // landmarks 用 % 坐标 + 颜色画矩形
  landmarks?: Array<{
    x: number;       // 0-100
    y: number;
    w: number;
    h: number;
    color: string;
  }>;
  // 路径（直线 e.g. 主道）
  road?: { y: number; color?: string };
}

/**
 * 右上小地图（避开 TopRightChips 那行，top: 90）
 *
 * 用法：
 *   <Minimap
 *     sceneName="萌芽镇"
 *     playerX={45}
 *     playerY={55}
 *     landmarks={[{ x: 30, y: 30, w: 40, h: 20, color: '#daa520' }]}
 *     road={{ y: 50 }}
 *   />
 */
export function Minimap({
  sceneName = '萌芽镇',
  playerX = 50,
  playerY = 50,
  landmarks = [],
  road,
}: MinimapProps) {
  return (
    <PixelPanel className="pp-tight" style={{ padding: 8, width: 160 }}>
      <div className="t-eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>
        {sceneName}
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: '#8fbc5c',
          border: '2px solid var(--wood-4)',
          position: 'relative',
        }}
      >
        {/* 路径 */}
        {road && (
          <div
            style={{
              position: 'absolute',
              top: `${road.y}%`,
              left: '10%',
              right: '10%',
              height: 3,
              background: road.color || '#a89070',
            }}
          />
        )}
        {/* 地标 */}
        {landmarks.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${m.y}%`,
              left: `${m.x}%`,
              width: `${m.w}%`,
              height: `${m.h}%`,
              background: m.color,
            }}
          />
        ))}
        {/* 玩家位置 */}
        <div
          style={{
            position: 'absolute',
            top: `${playerY}%`,
            left: `${playerX}%`,
            width: 6,
            height: 6,
            background: 'var(--danger)',
            border: '1px solid var(--paper-0)',
            boxShadow: '0 0 0 2px var(--paper-0)',
          }}
        />
      </div>
    </PixelPanel>
  );
}
