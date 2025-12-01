import axios from 'axios';

const DEFAULT_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleResponse = (res) => res.data;

const handleError = (err) => {
  if (err.response) {
    const message = err.response.data?.error || err.response.data || err.message;
    return Promise.reject({ status: err.response.status, message });
  }
  return Promise.reject({ message: err.message });
};

export const get = (url, config) =>
  apiClient
    .get(url, config)
    .then(handleResponse)
    .catch(handleError);

export const post = (url, data, config) =>
  apiClient
    .post(url, data, config)
    .then(handleResponse)
    .catch(handleError);

export const put = (url, data, config) =>
  apiClient
    .put(url, data, config)
    .then(handleResponse)
    .catch(handleError);

export const del = (url, config) =>
  apiClient
    .delete(url, config)
    .then(handleResponse)
    .catch(handleError);

export const fetchTransactions = (params) => get('/api/transactions', { params });
export const fetchTransactionsByCustomer = (customerId, params) =>
  get(`/api/transactions/customer/${customerId}`, { params });
export const addTransactionForCustomer = (body) =>
  post('/api/transactions/', body);

export const fetchRewardsTotal = (params) => get('/api/rewards/total', { params });
export const fetchRewardsMonthly = (params) =>
  get('/api/rewards/monthly/', { params });
export const fetchRewardsTop = (customerId) => get(`/api/rewards/top/${customerId}`);

export default apiClient;
