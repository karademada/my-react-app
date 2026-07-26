import { Fragment } from 'react'
import type { StoryBlock, StoryChild } from '../../types/partner'

/**
 * Rendu du format `blocks` de Strapi 5 sans dependance externe.
 * Couvre ce qu'un recit editorial utilise reellement : paragraphes, titres,
 * citations, listes, gras, italique, liens.
 */
const renderChild = (child: StoryChild, key: number) => {
  if (child.type === 'link') {
    return (
      <a
        key={key}
        href={child.url}
        target="_blank"
        rel="noreferrer noopener"
        style={{ color: 'var(--accent)', textUnderlineOffset: 3 }}
      >
        {child.children?.map((c, i) => renderChild(c, i)) ?? child.text}
      </a>
    )
  }

  let node: React.ReactNode = child.text ?? ''
  if (child.bold) node = <strong style={{ fontWeight: 600 }}>{node}</strong>
  if (child.italic) node = <em>{node}</em>
  if (child.underline) node = <u>{node}</u>
  return <Fragment key={key}>{node}</Fragment>
}

const paragraphStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 17,
  lineHeight: 1.75,
  color: 'var(--text-body)',
  margin: '0 0 24px',
}

export interface StoryBlocksProps {
  blocks: StoryBlock[]
}

export const StoryBlocks = ({ blocks }: StoryBlocksProps) => (
  <div style={{ maxWidth: 'var(--container-text)' }}>
    {blocks.map((block, i) => {
      const children = block.children.map(renderChild)

      switch (block.type) {
        case 'heading': {
          const Tag = (block.level && block.level <= 3 ? `h${block.level}` : 'h4') as 'h2'
          return (
            <Tag
              key={i}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: block.level === 2 ? 28 : 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text-strong)',
                margin: '40px 0 14px',
              }}
            >
              {children}
            </Tag>
          )
        }

        case 'quote':
          return (
            <blockquote
              key={i}
              style={{
                margin: '32px 0',
                paddingLeft: 20,
                borderLeft: '2px solid var(--accent)',
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                lineHeight: 1.45,
                color: 'var(--text-strong)',
              }}
            >
              {children}
            </blockquote>
          )

        case 'list': {
          const Tag = block.format === 'ordered' ? 'ol' : 'ul'
          return (
            <Tag key={i} style={{ ...paragraphStyle, paddingLeft: 22 }}>
              {(block.children as unknown as StoryBlock[]).map((item, j) => (
                <li key={j} style={{ marginBottom: 8 }}>
                  {item.children?.map(renderChild)}
                </li>
              ))}
            </Tag>
          )
        }

        default:
          return (
            <p key={i} style={paragraphStyle}>
              {children}
            </p>
          )
      }
    })}
  </div>
)

export default StoryBlocks
