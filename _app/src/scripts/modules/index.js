/**
 * @returns {Class} New Constructor
 */
Array.prototype.forEach.call(document.querySelectorAll('[data-module]'), element => {
  const keys = element.getAttribute('data-module').split(/\s+/)
  const opts = element.getAttribute('data-options') || null

  keys.forEach(key => {
    import(`./${key.charAt(0).toUpperCase() + key.slice(1)}`).then(
      module => {
        const options = opts ? keys.length > 1 ? JSON.parse(opts)[key] : JSON.parse(opts) : {}
        if (module !== void 0) return new module.default(element, options)
      }
    )
  })
})
