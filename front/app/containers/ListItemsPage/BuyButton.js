import styled from 'styled-components';

const BuyButton = styled.button `
  display: inline-flex;
  padding: 0.45em 2.2em;
  margin: 1.25em;
  text-decoration: none;
  border-radius: 3px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #41ADDD;
  color: #41ADDD;

  &:hover {
    background: #41ADDD;
    color: #FFF;
  }
`;

export default BuyButton;