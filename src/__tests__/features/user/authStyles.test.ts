import { describe, it, expect } from 'vitest'
import { inputStyle } from '../../../features/user/authStyles'

describe('inputStyle', () => {
  // Les champs auth sont posés dans une carte à largeur fixe : sans ces deux
  // propriétés, padding et bordure s'ajoutent aux 100% et le champ déborde.
  it('contraint le champ à la largeur de son conteneur', () => {
    expect(inputStyle.width).toBe('100%')
    expect(inputStyle.boxSizing).toBe('border-box')
  })
})
