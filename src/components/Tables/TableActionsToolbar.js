import PropTypes from 'prop-types';
import { DownloadOutlined } from '@ant-design/icons';
import SearchBox from '../SearchBox';
import { TableActions, SearchBoxWrapper, ExportButton, ExportButtonWrapper } from '../common/styles';

const TableActionsToolbar = ({ searchValue, onSearchChange, onExportCSV }) => (
  <TableActions>
    <SearchBoxWrapper>
      <SearchBox searchValue={searchValue} onSearchChange={onSearchChange} />
    </SearchBoxWrapper>
    <ExportButtonWrapper>
      <ExportButton icon={<DownloadOutlined />} onClick={onExportCSV}>
        Export to CSV
      </ExportButton>
    </ExportButtonWrapper>
  </TableActions>
);

TableActionsToolbar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
};

export default TableActionsToolbar;
