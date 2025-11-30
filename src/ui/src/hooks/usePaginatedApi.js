import { useCallback, useEffect, useState } from 'react';

/**
 * Add a unique key to each row for React rendering.
 * @param {Object} row - The data row object.
 * @returns {Object} Row object with a unique key property.
 */
const addKeyToRow = (row) => ({
  key: row.id || row.transactionId || row.key,
  ...row,
});

/**
 * Transform array response into paginated format.
 * @param {Array} result - Array of data rows.
 * @returns {Object} State object with data, total, current, pageSize, and loading.
 */
const transformArrayResponse = (result) => {
  const rows = result.map(addKeyToRow);
  return {
    data: rows,
    total: rows.length,
    current: 1,
    pageSize: rows.length,
    loading: false,
  };
};

/**
 * Transform paginated response into state format.
 * @param {Object} result - Paginated response object with rows, total, page, and pageSize.
 * @param {number} page - Current page number.
 * @param {number} size - Page size.
 * @returns {Object} State object with data, total, current, pageSize, and loading.
 */
const transformPaginatedResponse = (result, page, size) => {
  const rows = result.rows.map(addKeyToRow);
  return {
    data: rows,
    total: result.total ?? rows.length,
    current: result.page ?? page,
    pageSize: result.pageSize ?? size,
    loading: false,
  };
};

/**
 * Transform empty response into state format.
 * @returns {Object} State object with empty data, zero total, and loading false.
 */
const transformEmptyResponse = () => ({
  data: [],
  total: 0,
  loading: false,
});

/**
 * React hook for paginated API calls with state management.
 * @param {Function} fetcher - Async function to fetch data. Should return either an array or { rows, total, page, pageSize }.
 * @param {Object} [options={}] - Configuration options.
 * @param {number} [options.initialPage=1] - Initial page number.
 * @param {number} [options.initialPageSize=10] - Initial page size.
 * @param {Object} [options.initialParams={}] - Initial query parameters.
 * @returns {Object} Hook return object.
 * @returns {Array} return.data - Current page data with keys added.
 * @returns {boolean} return.loading - Loading state.
 * @returns {string|null} return.error - Error message if any.
 * @returns {number} return.current - Current page number.
 * @returns {number} return.pageSize - Current page size.
 * @returns {number} return.total - Total number of items.
 * @returns {Object} return.params - Current query parameters.
 * @returns {Function} return.setParams - Update query parameters and reset to page 1.
 * @returns {Function} return.setPage - Change to a specific page.
 * @returns {Function} return.setPageSize - Change page size and reset to page 1.
 * @returns {Function} return.handlePageChange - Change page and page size simultaneously.
 * @returns {Function} return.reload - Reload current page with current parameters.
 */
export default function usePaginatedApi(fetcher, options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialParams = {},
  } = options;

  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
    params: initialParams,
  });

  const { data, loading, error, current, pageSize, total, params } = state;

  /**
   * Fetch data from the API and update state.
   * @param {number} page - Page number to fetch.
   * @param {number} size - Number of items per page.
   * @param {Object} extraParams - Additional query parameters.
   */
  const fetchData = useCallback(async (page, size, extraParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const payload = { page, pageSize: size, ...extraParams };
      const result = await fetcher(payload);

      let updatedState;
      
      if (Array.isArray(result)) {
        updatedState = transformArrayResponse(result);
      } else if (result && result.rows) {
        updatedState = transformPaginatedResponse(result, page, size);
      } else {
        updatedState = transformEmptyResponse();
      }

      setState((prev) => ({ ...prev, ...updatedState }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err?.message ?? JSON.stringify(err),
      }));
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData(initialPage, initialPageSize, initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  /**
   * Change the current page and/or page size.
   * @param {number} page - New page number.
   * @param {number} size - New page size.
   */
  const handlePageChange = useCallback((page, size) => {
    setState((prev) => ({ ...prev, current: page, pageSize: size }));
    fetchData(page, size, params);
  }, [fetchData, params]);

  /**
   * Update query parameters and reset to the first page.
   * @param {Object} newParams - Parameters to merge with existing params.
   */
  const setParams = useCallback((newParams) => {
    const mergedParams = { ...params, ...newParams };
    setState((prev) => ({ ...prev, params: mergedParams, current: 1 }));
    fetchData(1, pageSize, mergedParams);
  }, [fetchData, pageSize, params]);

  /**
   * Reload the current page with current parameters.
   */
  const reload = useCallback(() => {
    fetchData(current, pageSize, params);
  }, [fetchData, current, pageSize, params]);

  return {
    data,
    loading,
    error,
    current,
    pageSize,
    total,
    params,
    setParams,
    setPage: (page) => handlePageChange(page, pageSize),
    setPageSize: (size) => handlePageChange(1, size),
    handlePageChange,
    reload,
  };
}