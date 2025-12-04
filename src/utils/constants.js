const formatPrice = (price) => {
  const priceNumericValue = typeof price === 'number' ? price : parseFloat(price);
  if (priceNumericValue === null || priceNumericValue === undefined || isNaN(priceNumericValue)) {
    throw new Error('Price is required');
  } 
  return `$${priceNumericValue.toFixed(2)}`;
};

const TRANSACTIONS_DATA_JSON_PATH = '/transactions.json';

const TABLE_TYPE = {
  TRANSACTIONS_TABLE: 'transactions',
  MONTHLY_REWARDS_TABLE: 'monthly',
  TOTAL_REWARDS_TABLE: 'total',
};

const DEBOUNCING_DELAY = 500;

const MONTHLY_REWARDS_TABLE_COLUMNS = [
  { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
  { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Month', dataIndex: 'month', key: 'month' },
  { title: 'Year', dataIndex: 'year', key: 'year' },
  { title: 'Monthly Rewards', dataIndex: 'points', key: 'monthlyRewards' },
];

const TOTAL_REWARDS_TABLE_COLUMNS = [
  { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
  { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Total Rewards', dataIndex: 'totalPoints', key: 'totalRewards' },
];

const TRANSACTIONS_TABLE_COLUMNS = [
  { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId' },
  { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId', width: 110 },
  { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
  {
    title: 'Purchase Date',
    dataIndex: 'purchaseDate',
    key: 'purchaseDate',
  },
  { title: 'Product', dataIndex: 'product', key: 'product' },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: formatPrice,
    width: 100,
  },
  {
    title: 'Reward Points',
    dataIndex: 'points',
    key: 'points',
    width: 140,
  },
];

export {
  TRANSACTIONS_DATA_JSON_PATH,
  DEBOUNCING_DELAY,
  TABLE_TYPE,
  MONTHLY_REWARDS_TABLE_COLUMNS,
  TOTAL_REWARDS_TABLE_COLUMNS,
  TRANSACTIONS_TABLE_COLUMNS,
};