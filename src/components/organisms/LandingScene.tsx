import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * LandingScene — fond WebGL (Three.js) animé par GSAP.
 *
 * Deux éléments, pensés pour « récolte éthique tracée de Madagascar » :
 *   · un champ de particules organiques qui « respire » (vanille, miel) ;
 *   · quelques spires/cristaux filaires (le réseau de partenaires tracé).
 *
 * La rotation lente + le halo sont pilotés par un tween GSAP infini ; les
 * particules bougent elles-mêmes dans leur `tick`. Le rendu est dégradé
 * (static + overlay) si WebGL n'est pas disponible.
 */
export const LandingScene = ({ className }: { className?: string }) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer | null = null
    let animationId = 0
    const clock = new THREE.Clock()

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // WebGL indisponible : on laisse le conteneur vide, le fond gradient
      // et l'overlay du parent assurent le rendu.
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 6

    const group = new THREE.Group()
    scene.add(group)

    // ---- Particules organiques (champ de « graines ») ---------------------
    const COUNT = 1400
    const positions = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      // Sphéroïde aplati, légèrement décentré vers le haut.
      const r = 2.2 * (0.4 + 0.6 * Math.sqrt(Math.random()))
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.8 + 0.3
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 0.5
      seed[i] = Math.random() * Math.PI * 2
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    const particleMat = new THREE.PointsMaterial({
      color: 0x1c7a57, // moss-600
      size: 0.012,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    group.add(particles)

    // ---- Spires / cristaux filaires (le réseau tracé) ----------------------
    const curveMat = new THREE.LineBasicMaterial({
      color: 0x14543c, // moss-700
      transparent: true,
      opacity: 0.8,
    })

    const spires: THREE.Line[] = []
    const spireCount = 6
    for (let s = 0; s < spireCount; s++) {
      const points: THREE.Vector3[] = []
      const turns = 4 + Math.floor(Math.random() * 3)
      const radius = 1.15 + Math.random() * 0.5
      for (let i = 0; i <= 160; i++) {
        const t = i / 160
        const angle = t * Math.PI * 2 * turns + s * 0.9
        const y = (t - 0.5) * 6
        const r = radius * (0.7 + 0.3 * Math.sin(t * Math.PI))
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * r,
            y * 0.32,
            Math.sin(angle) * r,
          ),
        )
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geo, curveMat)
      line.rotation.y = (s / spireCount) * Math.PI * 2
      line.rotation.z = s * 0.4
      group.add(line)
      spires.push(line)
    }

    // Petites sphères « nœuds » le long des spires (les partenaires).
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x2e9069 })
    for (let s = 0; s < spireCount; s++) {
      for (let k = 0; k < 6; k++) {
        const t = (k + 0.5) / 6
        const angle = t * Math.PI * 2 * (4 + (s % 3)) + s * 0.9
        const y = (t - 0.5) * 6 * 0.32
        const r = (1.15 + (s % 3) * 0.2) * (0.7 + 0.3 * Math.sin(t * Math.PI))
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 8),
          nodeMat,
        )
        mesh.position.set(
          Math.cos(angle) * r,
          y,
          Math.sin(angle) * r,
        )
        spires[s].add(mesh)
      }
    }

    // ---- Lumières / halo ---------------------------------------------
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xe4f1ea, // moss-100
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      }),
    )
    group.add(halo)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // ---- Animation GSAP : rotation douce + halo qui « respire » -------
    const tween = gsap.to(group.rotation, {
      y: Math.PI * 2,
      duration: 46,
      ease: 'none',
      repeat: -1,
    })
    const haloScale = gsap.fromTo(
      halo.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: 1.25,
        y: 1.25,
        z: 1.25,
        duration: 5.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      },
    )

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer!.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      const t = clock.getElapsedTime()
      particles.rotation.y += 0.0004
      const pos = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < COUNT; i++) {
        // respiration douce en altitude
        pos[i * 3 + 1] += Math.sin(t * 0.6 + seed[i]) * 0.0012
      }
      particleGeo.attributes.position.needsUpdate = true

      spires.forEach((line, i) => {
        line.rotation.x += 0.0003
        line.rotation.z += 0.0002 * (i % 2 === 0 ? 1 : -1)
      })

      renderer!.render(scene, camera)
      animationId = requestAnimationFrame(tick)
    }
    animationId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      tween.kill()
      haloScale.kill()
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          ;(obj.material as THREE.Material).dispose()
        } else if (obj instanceof THREE.Line) {
          obj.geometry.dispose()
        }
      })
      particleGeo.dispose()
      renderer!.dispose()
      if (renderer!.domElement.parentElement === mount) {
        mount.removeChild(renderer!.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className={className} aria-hidden="true" />
}

export default LandingScene
