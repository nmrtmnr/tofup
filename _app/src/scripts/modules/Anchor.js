import GSAP from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

export default class Anchor {
  /**
  * @constructor
  * @param {HTMLElement} this.el - module適用対象のElement
  * @param {Object} this.opts - this.elのオプション
  *
  * @param {Number} this.threshold - アンカー移動時の余分領域の閾値
  * 追従コンテンツ（header...etc）がある場合などにそのコンテンツの高さだけ移動距離を減らす...etc
  *
  * @param {Array} this.thresholdTarget - アンカー移動時の余分領域となる対象
  *
  * @param {HTMLElement} this.target - 遷移先のターゲット
  * @param {Boolean} this.touchFlg - タッチ判定（タッチ対応デバイス時）
  * @param {Boolean} this.select - 処理実行時に選択されたAnchorだけを選択
  * @param {Number} this.scrollSpeed - スクロール速度
  *
  */
  constructor(el, opts) {
    this.el = el

    this.threshold = 0
    this.thresholdTarget = Array.from(document.querySelectorAll('[data-anchor-threshold-target]'))

    this.target = null
    this.touchFlg = false
    this.select = false
    this.scrollSpeed = 1.2

    GSAP.registerPlugin(ScrollToPlugin)

    this.init()
  }

  init() {
    this.setThreshold()
    this.bindEvents()
  }

  /**
  * @method bindEvents
  * @desc eventをbindる
  */
  bindEvents() {
    window.addEventListener('load', () => {
      this.target = this.el.getAttribute('href').replace('#', '')
      this.target = this.target ? document.getElementById(this.target) : null

      this.setThreshold()
    })

    window.addEventListener('resize', () => {
      this.setThreshold()
    })

    if(this.el) {
      this.el.addEventListener('touchstart', e => {
        this.touchFlg = true
      })

      this.el.addEventListener('touchend', e => {
        e.preventDefault()
        e.stopPropagation()
        this.touchFlg = false
        this.move()
      })

      this.el.addEventListener('click', e => {
        if(!this.touchFlg) {
          e.preventDefault()
          e.stopPropagation()
          this.move()
        }
      })
    }
  }

  /**
  * @method setThreshold
  * @desc アンカー移動時の余分領域の計算
  */
  setThreshold() {
    let threshold = 0

    if(this.thresholdTarget) {
      for(let i = 0; i < this.thresholdTarget.length; i++) {
        threshold += this.thresholdTarget[i].clientHeight
      }
    }

    this.threshold = threshold
  }

  /**
  * @method move
  * @desc 移動処理
  */
  move() {
    let yPos = 0
    this.select = true

    if(this.target) {
      yPos = window.pageYOffset + this.target.getBoundingClientRect().top - this.threshold
    }

    GSAP.to(window, {
      duration: this.scrollSpeed,
      ease: 'Power2.easeOut',
      scrollTo: { y: yPos, autoKill: false },
      onComplete: () => {
      }
    })
  }
}
