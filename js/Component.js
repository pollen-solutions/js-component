export class Component {
  debug = false
  options = {}
  state = {}

  /**
   * @param {HTMLElement} $el
   * @param {Object} options
   */
  constructor($el, options = {}) {
    if (this.constructor === Component) {
      throw new TypeError(`Abstract class [Component] cannot be instantiated directly`)
    }

    // Check element
    if (this._checkIsHTMLElement($el)) {
      this.$el = $el
    } else {
      console.error(`Element [${this.constructor.name}] must be a valid HTML Element.`)
      return
    }

    this.boot()

    // Init options
    this.#_initOptions(options)

    this.state = {}

    if (this._init()) {
      this.initialized = true
    } else {
      console.error(`[${this.constructor.name}] initialization failed.`)
    }

    this.booted()
  }

  /**
   * Initialize options.
   *
   * @param {Object} options
   *
   * @return
   *
   * @private
   */
  #_initOptions(options) {
    this.options = {...this.options, ...this.getDefaultOptions()}

    let tagOptions = this.$el.dataset.options || {}

    if (tagOptions) {
      try {
        tagOptions = decodeURIComponent(tagOptions)
      } catch (e) {
        this.debug && console.error(e)
      }
    }

    try {
      tagOptions = JSON.parse(tagOptions)
    } catch (e) {
      this.debug && console.error(e)
    }

    if (typeof tagOptions === 'object' && tagOptions !== null) {
      this.options = {...this.options, ...tagOptions}
    }

    this.options = {...this.options, ...options}
  }

  /**
   * Object get.
   *
   * @param {String} dotKey
   * @param {Object} obj
   *
   * @return {*}
   *
   * @private
   */
  #_objGet(dotKey, obj) {
    return dotKey.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : null
    }, obj || self)
  }

  /**
   * Object set.
   *
   * @param {String} dotKey
   * @param {*} value
   * @param {Object} obj
   *
   * @return {*}
   *
   * @private
   */
  #_objSet(dotKey, value, obj) {
    let keys = dotKey.split('.'),
        lastIdx = keys.length - 1

    keys.reduce((prev, curr) => {
      if (curr === keys[lastIdx]) {
        prev[curr] = value
      } else if (!prev.hasOwnProperty(curr)) {
        prev[curr] = {}
      }
      return prev ? prev[curr] : null
    }, obj || self)

    return obj
  }

  /**
   * Object unset.
   *
   * @param {String} dotKey
   * @param {Object} obj
   *
   * @return {boolean}
   *
   * @private
   */
  #_objUnset(dotKey, obj) {
    let keys = dotKey.split('.'),
        lastIdx = keys.length - 1

    const res = keys.reduce((prev, curr) => {
      if (!prev.hasOwnProperty(curr)) {
        return false
      } else if (curr === keys[lastIdx]) {
        return delete prev[curr]
      }
      return prev ? prev[curr] : false
    }, obj || self)

    return !!res
  }

  /**
   * Check element.
   *
   * @param {*} $el
   * @return {boolean}
   *
   * @protected
   */
  _checkIsHTMLElement($el) {
    return $el instanceof HTMLElement
  }

  /**
   * Initialize.
   *
   * @return {boolean}
   *
   * @protected
   */
  _init() {
    return true
  }

  /**
   * Destroy.
   *
   * @return {void}
   *
   * @protected
   */
  _destroy() {
    this.initialized = false
  }

  // -----------------------------------------------------------------------------------------------------------------
  // HELPERS
  // -----------------------------------------------------------------------------------------------------------------
  /**
   * On component boot
   *
   * @return {void}
   */
  boot() {
    this.debug && console.log(`[${this.constructor.name}] boot.`)
  }

  /**
   * When component is booted.
   *
   * @return {void}
   */
  booted() {
    this.debug && console.log(`[${this.constructor.name}] booted.`)
  }

  /**
   * Get default options.
   *
   * @return {Object}
   */
  getDefaultOptions() {
    return {}
  }

  /**
   * Get option value.
   * {@internal Dotted key syntax is allowed.}
   *
   * @param {string} key
   * @param {*} defaults
   * @return {{}|null}
   */
  getOption(key = null, defaults = null) {
    if (key === null) {
      return this.options
    }

    return this.#_objGet(key, this.options) ?? defaults
  }

  /**
   * Set option.
   * {@internal Dotted key syntax is allowed.}
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {Component}
   */
  setOption(key, value = null) {
    this.#_objSet(key, value, this.options)

    return this
  }

  /**
   * Get state value.
   * {@internal Dotted key syntax is allowed.}
   *
   * @param {string} key
   * @param {*}  defaults
   *
   * @return {{}|null}
   */
  getState(key = null, defaults = null) {
    if (key === null) {
      return this.state
    }

    return this.#_objGet(key, this.state) ?? defaults
  }

  /**
   * Set state.
   * {@internal Dotted key syntax is allowed.}
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {Component}
   */
  setState(key, value = null) {
    this.#_objSet(key, value, this.state)

    return this
  }

  /**
   * Delete state.
   * {@internal Dotted key syntax is allowed.}
   *
   * @param {string} key
   *
   * @return {boolean}
   */
  deleteState(key) {
    return this.#_objUnset(key, this.state)
  }
}