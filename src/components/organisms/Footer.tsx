const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Maison', links: ['Notre histoire', 'Coopératives partenaires', 'Traçabilité', 'Engagement carbone'] },
  { title: 'Boutique', links: ['Vanille & épices', 'Soins & savons', 'Apparel', 'Homeware'] },
  { title: 'Service', links: ['Livraison', 'Retours gratuits', 'Contact', 'FAQ'] },
  { title: 'Légal', links: ['Mentions légales', 'Confidentialité', 'CGV', 'Cookies'] },
]

export const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        background: 'var(--ink-900)',
        color: 'var(--paper-100)',
        marginTop: 96,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '64px 32px 24px',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(4, 1fr)',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: '-0.02em',
              color: 'var(--paper-0)',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'baseline',
            }}
          >
            place
            <span style={{ color: 'var(--moss-400)', padding: '0 1px' }}>·</span>
            kabar
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--paper-300)', marginTop: 16, maxWidth: 280 }}>
            La place du commerce juste — produits bio tracés de Madagascar et apparel durable, sans intermédiaire.
          </p>
          <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--moss-400)' }}>
            Récolte 2025 · Madagascar
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--paper-400)',
                marginBottom: 16,
              }}
            >
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    style={{
                      color: 'var(--paper-200)',
                      textDecoration: 'none',
                      fontSize: 14,
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 32px',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--paper-400)',
        }}
      >
        <span>© {year} place·kabar — Toamasina · Madagascar</span>
        <span>Livraison neutre en carbone · Retours gratuits</span>
      </div>
    </footer>
  )
}

export default Footer
