import { Link } from 'react-router-dom'
import LandingScene from '../../components/organisms/LandingScene'

/**
 * LandingPage — vitrine de l'activité (récolte éthique tracée).
 * Fonds WebGL animé (LandingScene) + sections narratives. La boutique
 * vit à part sur /shop.
 */
export const LandingPage = () => {
  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-body)',
      }}
    >
      {/* ===== Hero ===== */}
      <section
        style={{
          position: 'relative',
          height: '92vh',
          minHeight: 560,
          background:
            'radial-gradient(120% 100% at 70% 0%, #0f2419 0%, #10241b 55%, #0a1712 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Canvas WebGL */}
        <LandingScene
          className="landing-canvas"
        />

        {/* Halo textuel par-dessus */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--moss-200)',
              marginBottom: 24,
            }}
          >
            Récolte éthique · tracée · de Madagascar
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 8vw, 96px)',
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              color: 'var(--paper-0)',
              margin: 0,
              maxWidth: '15ch',
            }}
          >
            Le geste juste,{' '}
            <span style={{ color: 'var(--moss-200)' }}>de la terre à vous.</span>
          </h1>
          <p
            style={{
              marginTop: 28,
              maxWidth: 520,
              fontSize: 'clamp(16px, 2vw, 20px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            Vanille Bourbon, huiles essentielles et miels — sourcés sans
            intermédiaire auprès de coopératives que nous connaissons, et
            tracés jusqu'à la parcelle.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 40,
            }}
          >
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 48,
                padding: '0 28px',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink-900)',
                background: 'var(--paper-0)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
              }}
            >
              Découvrir la boutique
            </Link>
            <Link
              to="/partners"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 48,
                padding: '0 28px',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--paper-0)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
              }}
            >
              Nos partenaires
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 3 piliers ===== */}
      <section
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '96px var(--gutter-page) 40px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--moss-700)',
          }}
        >
          Pourquoi place·kabar
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 28,
            marginTop: 32,
          }}
        >
          {[
            ['Tracé', "Chaque référence remonte jusqu'à sa parcelle, son fermier et sa coopérative."],
            ['Juste', 'Rémunérés en direct, sans intermédiaire qui se sert au passage.'],
            ['Éthique', 'Culture sans intrant de synthèse, pour la terre comme pour les hommes.'],
          ].map(([titre, texte]) => (
            <div
              key={titre}
              style={{
                borderTop: '1.5px solid var(--text-strong)',
                paddingTop: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-strong)',
                  margin: '0 0 10px',
                }}
              >
                {titre}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                }}
              >
                {texte}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA boutique ===== */}
      <section
        style={{
          maxWidth: 'var(--container-text)',
          margin: '0 auto',
          padding: '64px var(--gutter-page) 112px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text-strong)',
            margin: '0 0 16px',
          }}
        >
          La boutique, la co-récolte et ceux qui la font.
        </h2>
        <p
          style={{
            margin: '0 auto 36px',
            maxWidth: 460,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'var(--text-muted)',
          }}
        >
          Commandez vanilles, huiles essentielles et miels de Madagascar, et
          découvrez les visages derrière chaque produit.
        </p>
        <Link
          to="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 50,
            padding: '0 32px',
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--paper-0)',
            background: 'var(--ink-900)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
          }}
        >
          Accéder à la boutique
        </Link>
      </section>
    </div>
  )
}

export default LandingPage
