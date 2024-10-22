export default class SetCSSVars {
  constructor(el, opts) {
    this.el = el
    this.opts = opts['setCSSVars']

    this.root = document.querySelector(':root')
    console.log(':', Settings)

    if (this.el) { this.init() }
  }

  init() {
    this.set()
    this.bindEvents()
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.set()
    })
  }

  set() {
    const v = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      clientWidth: document.documentElement.clientWidth,
    }

    this.root.style.setProperty('--window-width', window.innerWidth)
    this.root.style.setProperty('--window-height', window.innerHeight)
    this.root.style.setProperty('--client-viewport-width', document.documentElement.clientWidth)

    if (v.clientWidth > Settings.breakpoint.lv2) {
      this.root.style.setProperty('--project-base-root', 1)
    } else if (v.clientWidth >= Settings.breakpoint.lv1) {
      this.root.style.setProperty('--project-base-root', v.clientWidth / Settings.breakpoint.lv2)
    } else {
      this.root.style.setProperty('--project-base-root', v.clientWidth / Settings.design.sp.size)
    }
  }
}