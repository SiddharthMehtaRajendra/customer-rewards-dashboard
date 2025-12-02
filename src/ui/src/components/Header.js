import React from 'react';
import { useAppDispatch, useAppState } from '../context/AppContext';
import { StyledHeaderCard, StyledHeaderFlex, CardTitle } from './common/styles';

const Header = () => {
  const dispatch = useAppDispatch();
  const { currentTable } = useAppState();

  return (
    <StyledHeaderFlex vertical={false} gap={'24px'} justify="center" align="center">
      <StyledHeaderCard isSelected={currentTable === 'transactions'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'transactions' }); }}>
        <CardTitle>Retrieve all transactions</CardTitle>
      </StyledHeaderCard>
      <StyledHeaderCard isSelected={currentTable === 'monthly'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'monthly' }); }}>
        <CardTitle>Retrieve monthly rewards</CardTitle>
      </StyledHeaderCard>
      <StyledHeaderCard isSelected={currentTable === 'total'} onClick={() => { dispatch({ type: 'SWITCH_TABLE', payload: 'total' }); }}>
        <CardTitle>Retrieve total rewards</CardTitle>
      </StyledHeaderCard>
    </StyledHeaderFlex>
  );
};

export default React.memo(Header);

Header.propTypes = {};
