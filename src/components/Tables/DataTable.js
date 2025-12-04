import PropTypes from 'prop-types';
import { Table } from 'antd';
import { TableWrapper } from '../common/styles';

/*
  This is a re-usable component which displays the data fetched from the respective
  APIs. It is the actual Antd table component, so it accepts the props which are 
  responsible for interacting with the table on the UI as well as for display.
*/
const DataTable = ({ columns, data, page, pageSize, total, onPageChange, onChange }) => (
  <TableWrapper>
    <Table
      columns={columns}
      dataSource={data}
      onChange={onChange}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPageChange,
      }}
      scroll={{ x: true }}
    />
  </TableWrapper>
);

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

export default DataTable;
