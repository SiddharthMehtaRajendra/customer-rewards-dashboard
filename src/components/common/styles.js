import styled from 'styled-components';
import { Button, Card, Flex, Input } from 'antd';

// Dashboard Styles
export const DashboardContainer = styled.div`
  max-width: 95%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
`;

export const DashboardTitle = styled.h1`
  margin-top: 24px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
`;

export const CardTitle = styled.b`
  font-size: 18px;
`;

export const TableSection = styled.div`
  margin-top: 24px;
  padding-bottom: 12px;
`;

// Common Loading Container
export const LoadingContainer = styled.div`
  text-align: center;
  padding: 24px;
`;

// SearchBox Styles
export const StyledSearchInput = styled(Input)`
  margin-bottom: 24px;
  max-width: 350px;
  padding: 8px 12px;
  
  &:hover,
  &:focus {
    border-color: #8cbed6;
  }
`;

// Header Styles
export const StyledHeaderCard = styled(Card)`
  width: 20rem;
  height: 10rem;
  cursor: pointer;
  border: ${(props) => (props.isSelected ? '3px solid #8cbed6' : '1px solid #e0e0e0')};
  transition: all 0.3s ease;
  border-radius: 8px;
  background-color: ${(props) => (props.isSelected ? '#fafafa' : '#fff')};
  box-shadow: ${(props) => (props.isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)')};

  &:hover {
    box-shadow: ${(props) => (props.isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)')};
    transform: ${(props) => (props.isSelected ? 'translateY(0)' : 'translateY(-2px)')};
  }
`;

export const StyledHeaderFlex = styled(Flex)`
  max-width: 90%;
  margin: 0 auto;
  margin-top: 32px;
  margin-bottom: 40px;
  padding: 24px;
`;

// Table Styles
export const TableContainer = styled.div`
  padding: 24px;
`;

export const TableWrapper = styled.div`
  height: 600px;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
`;

export const ExportButton = styled(Button)`
  margin-bottom: 16px;
  background-color: #52c41a !important;
  border-color: #52c41a !important;
  color: white !important;
  
  &:hover {
    background-color: #73d13d !important;
    border-color: #73d13d !important;
  }
`;

export const TableActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
`;

export const SearchBoxWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const ExportButtonWrapper = styled.div`
  position: absolute;
  right: 0;
`;
