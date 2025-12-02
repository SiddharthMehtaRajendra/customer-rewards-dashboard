import React from 'react';
import { useAppDispatch, useAppState } from '../context/AppContext';
import { StyledHeaderCard, StyledHeaderFlex, CardTitle } from './common/styles';

/*
  The Header component displays the selectable cards on the UI, which enable users to switch
  between the all transactions, monthly rewards and the total rewards tables.

  It makes use of the global state to enable the selections to be available across the app.
*/
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
