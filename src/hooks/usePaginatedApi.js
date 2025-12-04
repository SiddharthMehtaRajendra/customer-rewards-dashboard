import { useCallback, useEffect, useRef, useState } from 'react';

/*
  This method adds a unique key to every row element,
  which allows for more efficient React renders.
*/
const addKeyToRowElement = (row) => ({
  key: row?.id || row?.transactionId || row?.key,
  ...row,
});

/* 
  This method converts the API response to a format suitable for the Antd
  table data source, which includes pagination and adding a unique key to each
  fetched row.
*/
const normalizeResponse = (result, page, size) => {
  if (Array.isArray(result)) {
    const dataWithKeys = result.map(addKeyToRowElement);
    return {
      data: dataWithKeys,
      total: dataWithKeys.length,
      current: 1,
      pageSize: dataWithKeys.length,
    };
  }
  
  if (result?.data) {
    const dataWithKeys = result?.data?.map(addKeyToRowElement);
    return {
      data: dataWithKeys,
      total: result?.total ?? dataWithKeys?.length,
      current: result?.page ?? page,
      pageSize: result?.pageSize ?? size,
    };
  }
  
  return {
    data: [],
    total: 0,
    current: page,
    pageSize: size,
  };
};

/*
  This is the custom hook which calls the backend server APIs and paginates them.
  API calls are made for two instances, either on initial page load, or if one
  of the pagination elements on the table UI are changed.

  The hook enables the client to be aware whether the data is currently being fetched
  or if there is an error while fetching data. The fetcher method corresponds to the api
  layer i.e. api.js methods.

  The hook also provides callback methods to the component such as onPageChange or refresh,
  to enable pagination or refresh data in the components which use this hook.
*/
export default function usePaginatedApi(fetcher, params = {}, options = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const isInitialMount = useRef(true);
  
  const prevParamsRef = useRef(params);

  const { data, loading, error, page, pageSize, total } = state;

  const fetchData = useCallback(
    async (pageNum, size, queryParams) => {
      setState((previousState) => ({ ...previousState, loading: true, error: null }));

      try {
        const payload = { page: pageNum, pageSize: size, ...queryParams };
        const result = await fetcher(payload);
        const normalized = normalizeResponse(result, pageNum, size);

        setState((previousState) => ({
          ...previousState,
          ...normalized,
          loading: false,
        }));
      } catch (error) {
        setState((previousState) => ({
          ...previousState,
          loading: false,
          error,
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
      setState((previousState) => ({ ...previousState, page: 1 }));
      fetchData(1, pageSize, params);
    }
  }, [params, pageSize, fetchData]);

  const onPageChange = useCallback(
    (newPage, newPageSize) => {
      setState((previousState) => ({
        ...previousState,
        page: newPage,
        pageSize: newPageSize ?? previousState.pageSize,
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