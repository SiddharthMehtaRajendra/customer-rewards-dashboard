import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { StyledSearchInput } from './common/styles';
import { DEBOUNCING_DELAY } from '../utils/constants';

/*
  This search box filters the transactions and rewards tables by the customer name.
  It has an inbuilt debouncing functionality with a delay of 500 ms, to prevent frequent
  API calls, and also to improve the UX. It offers props to the container to make this
  component re-usable and to enable state to be shared with the table.
*/
function SearchBox({ searchValue, onSearchChange }) {
  const debounceTimer = useRef(null);

  const handleInputChange = (event) => {
    const value = event?.target?.value;
    onSearchChange(value, false);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value, true);
    }, DEBOUNCING_DELAY);
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
