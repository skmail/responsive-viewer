export const onRefresh = (callback: () => void) => {
  const onRefresh = (e: KeyboardEvent) => {
    let isF5 = false
    let isR = false

    const code = e.code
    if (code === 'F5') {
      isF5 = true
    }

    if (code === 'KeyR') {
      isR = true
    }

    if (isF5 || ((e.ctrlKey || e.metaKey) && isR)) {
      e.preventDefault()
      callback()
    }
  }

  window.addEventListener('keydown', onRefresh)

  return () => {
    window.removeEventListener('keydown', onRefresh)
  }
}
