import type { ReviewerVote, QualityCoeff } from '../lib/reviewers';
import { Chip } from '../ui';

const REVIEWER_AVATARS: Record<string, string> = {
  zhouming: '🧑‍🏫',
  yanzhi: '👨‍🔬',
  baihui: '👩‍🎓',
};

const COEFF_TONE: Record<QualityCoeff, 'spring' | 'gold' | 'danger' | ''> = {
  0.5: 'danger',
  1.0: '',
  2.0: 'gold',
};

interface ReviewerVoteCardProps {
  vote: ReviewerVote;
}

/**
 * 已收到的审核员投票 chip（紧凑版）
 *
 * Wave 2.5.A.3 · 仅静态显示
 * Wave 2.5.A.4 · 加 chip 滑入动画 + 金光晕
 */
export function ReviewerVoteCard({ vote }: ReviewerVoteCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '6px 8px',
        background: 'var(--paper-1)',
        border: '1px solid var(--wood-2)',
        marginBottom: 4,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          background: 'var(--paper-3)',
          border: '1px solid var(--wood-4)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {REVIEWER_AVATARS[vote.reviewerId] ?? '👤'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            className="t-title"
            style={{ fontSize: 11, color: 'var(--wood-3)' }}
          >
            {vote.reviewerName}
          </span>
          <Chip tone={COEFF_TONE[vote.coeff]}>x{vote.coeff.toFixed(1)}</Chip>
        </div>
        <div
          className="t-soft"
          style={{
            fontSize: 10,
            lineHeight: 1.5,
            color: 'var(--ink-faint)',
            fontStyle: 'italic',
          }}
        >
          "{vote.comment}"
        </div>
      </div>
    </div>
  );
}
