import gsap from 'gsap'

export const startViewTransition = (callback) => {
  const container = document.getElementById('root')
  
  gsap.to(container, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      callback()
      gsap.to(container, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  })
}
