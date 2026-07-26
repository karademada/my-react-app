import type { Commitment, CommitmentCategory } from '../../types/partner'

/**
 * Pas une pastille coloree : un mot en capitales mono souligne d'un trait fin.
 * La couleur reste dans la photo, les labels restent typographiques.
 */
const RULE_COLOR: Record<CommitmentCategory, string> = {
  bio: 'var(--bio)',
  ecological: 'var(--moss-500)',
  'fair-trade': 'var(--gilt)',
  social: 'var(--ink-700)',
  responsible: 'var(--metal-500)',
}

export interface CommitmentMarkProps {
  commitment: Pick<Commitment, 'name' | 'category'>
  size?: 'sm' | 'md'
}

export const CommitmentMark = ({ commitment, size = 'sm' }: CommitmentMarkProps) => (
  <span
    style={{
      display: 'inline-block',
      borderBottom: `1.5px solid ${RULE_COLOR[commitment.category]}`,
      paddingBottom: 2,
      fontFamily: 'var(--font-mono)',
      fontSize: size === 'sm' ? 'var(--text-label-sm)' : 'var(--text-label)',
      fontWeight: 500,
      letterSpacing: 'var(--ls-label-sm)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}
  >
    {commitment.name}
  </span>
)

export interface CommitmentMarkListProps {
  commitments: Pick<Commitment, 'name' | 'category'>[]
  size?: 'sm' | 'md'
}

export const CommitmentMarkList = ({ commitments, size = 'sm' }: CommitmentMarkListProps) => {
  if (commitments.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px' }}>
      {commitments.map((c) => (
        <CommitmentMark key={c.name} commitment={c} size={size} />
      ))}
    </div>
  )
}

export default CommitmentMark
