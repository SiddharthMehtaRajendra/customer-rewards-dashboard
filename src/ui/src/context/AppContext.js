import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

/* 
  This file uses the React Context API to wrap the app inside the root context.
  This is used for global state management i.e. across the component tree hierarchy.
  It uses React's useReducer hook to aggregate the global state.

  The global state can be acquired or modified by components by using the useAppState
  or useAppDispatch methods respectively.

  This is a lightweight solution to redux. One drawback however is, any updates to the
  global state may trigger a re-render of the app component tree. However, this is a 
  smaller web application so it may not cause a high impact at the moment.
*/

const initialState = {
  currentTable: 'transactions', // 'transactions' | 'monthly' | 'total'
  showRefresh: false,
  lastEventMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SWITCH_TABLE':
      return { ...state, currentTable: action.payload };
    case 'SHOW_REFRESH':
      return { ...state, showRefresh: true, lastEventMessage: action.payload };
    case 'HIDE_REFRESH':
      return { ...state, showRefresh: false };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const useAppState = () => {
  const { state } = useAppContext();
  return state;
};

export const useAppDispatch = () => {
  const { dispatch } = useAppContext();
  return dispatch;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};