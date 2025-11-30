import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { RefreshContainer, RefreshMessage, RefreshActionButton } from './common/styles';

/**
 * Reload the page
 */
const handleRefresh = () => {
  window.location.reload();
};

const RefreshButton = () => {
  const { showRefresh, lastEventMessage } = useAppState();
  const dispatch = useAppDispatch();

  if (!showRefresh) return null;

  const handleDismiss = () => {
    dispatch({ type: 'HIDE_REFRESH' });
  };

  return (
    <RefreshContainer>
      <RefreshMessage>
        {lastEventMessage}
      </RefreshMessage>
      <RefreshActionButton
        type="primary"
        icon={<ReloadOutlined />}
        onClick={handleRefresh}
      >
        Refresh
      </RefreshActionButton>
      <Button type="primary" onClick={handleDismiss}>
        Dismiss
      </Button>
    </RefreshContainer>
  );
};

export default React.memo(RefreshButton);

RefreshButton.propTypes = {};
