// Custom Jest environment that extends jsdom with needed polyfills
const { TestEnvironment } = require('jest-environment-jsdom');

class JSDOMEnvironmentWithPolyfills extends TestEnvironment {
  async setup() {
    await super.setup();
    
    // Add matchMedia polyfill to the window object BEFORE any tests run
    if (!this.global.window.matchMedia) {
      this.global.window.matchMedia = this.global.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      });
    }
  }
}

module.exports = JSDOMEnvironmentWithPolyfills;
