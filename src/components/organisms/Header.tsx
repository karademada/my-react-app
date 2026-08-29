import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import type { User } from '../../types'

export interface HeaderProps {
  isAuthenticated: boolean
  user: User | null
  loyaltyPoints: number
  cartItemCount: number
  isCartOpen: boolean
  searchQuery: string
  selectedCategory: string | null
  categories: string[]
  onLogin?: () => void
  onLogout: () => void
  onCartToggle: () => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string | null) => void
  cartContent?: ReactNode
}

const Wordmark = () => (
  <Link
    to="/"
    style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)',
      textDecoration: 'none',
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline',
    }}
  >
    place
    <span style={{ color: 'var(--moss-600)', padding: '0 1px' }}>·</span>
    kabar
  </Link>
)

export const Header = ({
  isAuthenticated,
  user,
  loyaltyPoints,
  cartItemCount,
  isCartOpen,
  searchQuery,
  selectedCategory,
  categories,
  onLogin,
  onLogout,
  onCartToggle,
  onSearchChange,
  onCategoryChange,
  cartContent,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCartOpen) return

    // Refs nulles si le panier n'est pas encore monté : GSAP loggerait
    // "GSAP target not found" sur une cible vide.
    const cart = cartRef.current
    const backdrop = backdropRef.current
    const tweens: gsap.core.Tween[] = []

    if (cart) {
      tweens.push(
        gsap.fromTo(
          cart,
          // xPercent (et non x) : largeur du drawer fluide (min(400px, 100vw))
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.24, ease: 'power2.out' },
        ),
      )
    }
    if (backdrop) {
      tweens.push(
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.24 }),
      )
    }

    return () => tweens.forEach((tween) => tween.kill())
  }, [isCartOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleSelectCategory = (category: string | null) => {
    onCategoryChange(category)
    closeMenu()
  }

  /** Barre de catégories : partagée entre la nav desktop (<1024 scroll)
   *  et le drawer mobile du burger. */
  const renderCategoryNav = (className: string) => (
    <div
      className={className}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}
    >
      <span
        onClick={() => handleSelectCategory(null)}
        style={{
          cursor: 'pointer',
          color: selectedCategory === null ? 'var(--ink-900)' : 'var(--text-muted)',
          fontWeight: selectedCategory === null ? 600 : 500,
          borderBottom: selectedCategory === null ? '2px solid var(--moss-600)' : '2px solid transparent',
          paddingBottom: 2,
        }}
      >
        Toute la collection
      </span>
      {categories.map((cat) => (
        <span
          key={cat}
          onClick={() => handleSelectCategory(cat)}
          style={{
            cursor: 'pointer',
            color: selectedCategory === cat ? 'var(--ink-900)' : 'var(--text-muted)',
            fontWeight: selectedCategory === cat ? 600 : 500,
            borderBottom: selectedCategory === cat ? '2px solid var(--moss-600)' : '2px solid transparent',
            paddingBottom: 2,
          }}
        >
          {cat}
        </span>
      ))}
      {/* Lien de route, pas un filtre : repoussé à droite pour ne pas se
          lire comme une catégorie de plus. <a> comme les autres liens de
          ce Header, qui ne connaît pas le router. */}
      <a
        href="/partners"
        onClick={closeMenu}
        style={{
          marginLeft: 'auto',
          color: 'var(--text-muted)',
          fontWeight: 500,
          textDecoration: 'none',
          borderBottom: '2px solid transparent',
          paddingBottom: 2,
        }}
      >
        Partenaires
      </a>
    </div>
  )


  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ background: 'var(--ink-900)', color: 'var(--paper-0)', textAlign: 'center', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Livraison neutre en carbone · Récolte éthique tracée de Madagascar
        </div>

        <div
          className="pk-header-utility"
          style={{
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="pk-header-burger"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              zIndex: 100,
            }}
            aria-label="Menu"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 24 }}>
              <div style={{ height: 2, background: 'var(--ink-900)', width: '100%' }} />
              <div style={{ height: 2, background: 'var(--ink-900)', width: '100%' }} />
              <div style={{ height: 2, background: 'var(--ink-900)', width: '100%' }} />
            </div>
          </button>

          <div className="pk-header-logo-container">
            <Wordmark />
          </div>

          <div className="pk-header-search" style={{ gap: 0, alignItems: 'center' }}>
            <input
              placeholder="Rechercher un produit…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                flex: 1,
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: 'var(--ink-900)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line)',
                borderRight: 'none',
                borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                padding: '10px 16px',
                outline: 'none',
              }}
            />
            <button
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--paper-0)',
                background: 'var(--ink-900)',
                border: '1px solid var(--ink-900)',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                padding: '10px 18px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Chercher
            </button>
          </div>

          <div className={`pk-header-actions ${isMenuOpen ? 'open' : ''}`}>
            <div className="pk-header-menu-nav">{renderCategoryNav('pk-catnav pk-catnav-mobile')}</div>

            <div className="pk-header-menu-account">
              {isAuthenticated && user ? (
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bonjour</div>
                  <button onClick={onLogout} style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-900)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    {user.email?.split('@')[0] ?? ''} · Déconnexion
                  </button>
                  <Link to="/espace-partenaire" onClick={closeMenu} style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--moss-600)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    Espace partenaire
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <Link
                    to="/register"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      color: 'var(--ink-900)',
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                    }}
                  >
                    Inscription
                  </Link>
                  <Link
                    to="/login"
                    onClick={onLogin}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 40,
                      padding: '10px 18px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '-0.005em',
                      color: 'var(--paper-0)',
                      background: 'var(--ink-900)',
                      border: '1.5px solid var(--ink-900)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                    }}
                  >
                    Connexion
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <span className="pk-catnav-fidelity" style={{ color: 'var(--moss-700)', marginTop: 16 }}>
                  Fidélité · {loyaltyPoints} pts
                </span>
              )}
            </div>
          </div>

          <button
            className="pk-header-cart"
            onClick={onCartToggle}
            style={{
              position: 'relative',
              background: 'transparent',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink-900)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Panier
            {cartItemCount > 0 && (
              <span
                style={{
                  background: 'var(--ink-900)',
                  color: 'var(--paper-0)',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <nav
          style={{
            borderTop: '1px solid var(--line)',
            background: 'var(--paper-100)',
          }}
        >
          {renderCategoryNav('pk-catnav')}
        </nav>
      </header>

      {isCartOpen && (
        <div
          ref={cartRef}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 'min(400px, 100vw)',
            height: '100vh',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-900)' }}>Votre panier</span>
            <button
              onClick={onCartToggle}
              style={{ background: 'none', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 22, color: 'var(--ink-900)', cursor: 'pointer', lineHeight: 1 }}
              aria-label="Fermer"
            >×</button>
          </div>
          <div style={{ padding: 16 }}>{cartContent}</div>
        </div>
      )}
      {isMenuOpen && (
        <div
          className="pk-header-menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {isCartOpen && (
        <div
          ref={backdropRef}
          onClick={onCartToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(26,21,18,.42)',
            zIndex: 999,
          }}
        />
      )}
    </>
  )
}

export default Header
