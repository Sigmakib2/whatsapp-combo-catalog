const SKELETON_DELAY_MS = 80

let showTimer: number | undefined

function skeleton(): HTMLElement | null {
  return document.getElementById('nav-skeleton')
}

function showSkeleton() {
  const el = skeleton()
  if (!el) return
  el.hidden = false
  el.setAttribute('aria-hidden', 'false')
  el.classList.add('nav-skeleton--active')
}

function hideSkeleton() {
  if (showTimer !== undefined) {
    window.clearTimeout(showTimer)
    showTimer = undefined
  }
  const el = skeleton()
  if (!el) return
  el.classList.remove('nav-skeleton--active')
  el.setAttribute('aria-hidden', 'true')
  el.hidden = true
}

function scheduleSkeleton() {
  if (showTimer !== undefined) window.clearTimeout(showTimer)
  showTimer = window.setTimeout(() => {
    showTimer = undefined
    showSkeleton()
  }, SKELETON_DELAY_MS)
}

document.addEventListener('astro:before-preparation', () => {
  scheduleSkeleton()
})

document.addEventListener('astro:after-preparation', () => {
  hideSkeleton()
})

document.addEventListener('astro:page-load', () => {
  hideSkeleton()
})
