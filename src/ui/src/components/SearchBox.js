import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { StyledSearchInput } from './common/styles';

function SearchBox({ searchValue, onSearchChange }) {
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Update input immediately for UX
    onSearchChange(value, false);

    // Debounce the API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value, true);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <StyledSearchInput
      placeholder={'Search by customer name...'}
      prefix={<SearchOutlined />}
      value={searchValue}
      onChange={handleInputChange}
      allowClear
    />
  );
}

export default SearchBox;

SearchBox.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
