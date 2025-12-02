import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { RefreshContainer, RefreshMessage, RefreshActionButton } from './common/styles';

const handleRefresh = () => {
  window.location.reload();
};

/* 
  This is a refresh button that displays on the UI upon the socket event
  for a transaction being added to the transactions table.

  The data is refreshed by using the browser window reload API which triggers
  a page reload. The dismiss button can also be clicked to hide this component
  from display, in case the user chooses not to refresh data.
*/
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
