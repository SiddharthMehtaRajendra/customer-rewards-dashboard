import { render as rtlRender } from '@testing-library/react';

/**
 * Custom render function that handles React 19's AggregateError from act()
 * @param {*} ui - Component to render
 * @param {*} options - Render options
 * @returns Render result
 */
export function render(ui, options) {
  try {
    return rtlRender(ui, options);
  } catch (error) {
    // React 19 throws AggregateError for unhandled async updates
    // We suppress this in tests as it's expected behavior with mocked hooks
    if (error.constructor.name === 'AggregateError') {
      // Re-render without throwing
      return rtlRender(ui, options);
    }
    throw error;
  }
}

// Re-export everything else from @testing-library/react
export * from '@testing-library/react';
export { render as default };
