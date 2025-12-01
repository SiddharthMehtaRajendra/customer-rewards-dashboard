import { useCallback, useEffect, useRef, useState } from 'react';

const addKeyToRow = (row) => ({
  key: row.id || row.transactionId || row.key,
  ...row,
});

const normalizeResponse = (result, page, size) => {
  if (Array.isArray(result)) {
    const rows = result.map(addKeyToRow);
    return {
      data: rows,
      total: rows.length,
      current: 1,
      pageSize: rows.length,
    };
  }
  
  if (result?.rows) {
    const rows = result.rows.map(addKeyToRow);
    return {
      data: rows,
      total: result.total ?? rows.length,
      current: result.page ?? page,
      pageSize: result.pageSize ?? size,
    };
  }
  
  return {
    data: [],
    total: 0,
    current: page,
    pageSize: size,
  };
};

export default function usePaginatedApi(fetcher, params = {}, options = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: '',
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const isInitialMount = useRef(true);
  
  const prevParamsRef = useRef(params);

  const { data, loading, error, page, pageSize, total } = state;

  const fetchData = useCallback(
    async (pageNum, size, queryParams) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const payload = { page: pageNum, pageSize: size, ...queryParams };
        const result = await fetcher(payload);
        const normalized = normalizeResponse(result, pageNum, size);

        setState((prev) => ({
          ...prev,
          ...normalized,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.message ?? String(err),
        }));
      }
    },
    [fetcher],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData(initialPage, initialPageSize, params);
    }
  }, [fetchData, initialPage, initialPageSize, params]);

  useEffect(() => {
    if (!isInitialMount.current && prevParamsRef.current !== params) {
      prevParamsRef.current = params;
      setState((prev) => ({ ...prev, page: 1 }));
      fetchData(1, pageSize, params);
    }
  }, [params, pageSize, fetchData]);

  const onPageChange = useCallback(
    (newPage, newPageSize) => {
      setState((prev) => ({
        ...prev,
        page: newPage,
        pageSize: newPageSize ?? prev.pageSize,
      }));
      fetchData(newPage, newPageSize ?? pageSize, params);
    },
    [fetchData, pageSize, params],
  );

  const refresh = useCallback(() => {
    fetchData(page, pageSize, params);
  }, [fetchData, page, pageSize, params]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    onPageChange,
    refresh,
  };
}