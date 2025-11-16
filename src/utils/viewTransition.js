export const startViewTransition = (callback) => {
  if (!document.startViewTransition) {
    callback()
    return
  }
  document.startViewTransition(callback)
}
