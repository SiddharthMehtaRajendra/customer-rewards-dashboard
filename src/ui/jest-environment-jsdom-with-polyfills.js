const { TestEnvironment } = require('jest-environment-jsdom');

class JSDOMEnvironmentWithPolyfills extends TestEnvironment {
  async setup() {
    await super.setup();
    
    if (!this.global.window.matchMedia) {
      this.global.window.matchMedia = this.global.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      });
    }
  }
}

module.exports = JSDOMEnvironmentWithPolyfills;
