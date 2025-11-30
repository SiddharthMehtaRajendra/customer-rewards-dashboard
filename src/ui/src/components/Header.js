import React from 'react';
import { useAppDispatch, useAppState } from '../context/AppContext';
import { StyledHeaderCard, StyledHeaderFlex } from './common/styles';

const Header = () => {
  const dispatch = useAppDispatch();
  const { currentTable } = useAppState();

  return (
    <StyledHeaderFlex vertical={false} gap={'24px'} justify="center" align="center">
      <StyledHeaderCard isSelected={currentTable === 'transactions'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'transactions' }); }}>
        <b style={{ fontSize: '16px' }}>Retrieve all transactions</b>
      </StyledHeaderCard>
      <StyledHeaderCard isSelected={currentTable === 'monthly'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'monthly' }); }}>
        <b style={{ fontSize: '16px' }}>Retrieve monthly rewards</b>
      </StyledHeaderCard>
      <StyledHeaderCard isSelected={currentTable === 'total'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'total' }); }}>
        <b style={{ fontSize: '16px' }}>Retrieve total rewards</b>
      </StyledHeaderCard>
    </StyledHeaderFlex>
  );
};

export default React.memo(Header);

Header.propTypes = {};
