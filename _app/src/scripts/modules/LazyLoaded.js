export default class LazyLoaded {
  constructor(el, opts) {
    if (el) {
      this.el = el;
      this.opts = opts["lazyLoaded"] || null;

      this.targets = null;

      this.init();
    }
  }

  init() {
    this.setProps();
    this.bindEvents();
  }

  setProps() {
    this.targets = [
      ...this.el.querySelectorAll("img"),
      ...this.el.querySelectorAll("video"),
    ];
  }

  bindEvents() {
    if (this.targets) {
      this.targets.forEach((target) => {
        if (target.getAttribute("loading")) {
          target.addEventListener("load", () => {
            target.classList.add("loaded");
          });
        }
      });
    }
  }
}
