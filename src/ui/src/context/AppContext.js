import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

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

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('customer-added', (data) => {
      dispatch({ type: 'SHOW_REFRESH', payload: data.message });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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