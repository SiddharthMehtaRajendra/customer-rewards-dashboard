import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingContainer } from '../common/styles';
import { memo } from 'react';

const LoadingState = ({ message }) => (
  <LoadingContainer>
    <Spin tip={message} />
  </LoadingContainer>
);

LoadingState.propTypes = {
  message: PropTypes.string.isRequired,
};

export default memo(LoadingState);
