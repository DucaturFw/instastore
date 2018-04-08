/**
 *
 * ListItemsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Responsive,
  Segment,
  Form,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';

import List from '../../components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectTransactionTotal,
  makeSelectTransactionHash, makeSelectTransactionWallet, makeSelectError, makeSelectLoading } from '../App/selectors';
import { makeSelectEmail, makeSelectAmount } from './selectors';
import { changeAmount, changeEmail } from './actions';
import { createOrder, orderCreationError } from '../App/actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Input from './Input';
import Section from './Section';
import BuyButton from './BuyButton';
import H2 from '../../components/H2';
import LoadingIndicator from '../../components/LoadingIndicator';


export class ListItemsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    if (this.props.email && this.props.email.trim().length > 0 &&
        this.props.amount && this.props.amount > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    const { loading, error } = this.props;

    return (
      <article>
        <Helmet>
          <title>Store</title>
          <meta name="description" content="Buy some of our best products!" />
        </Helmet>
        <Container textAlign='center'>
          <Grid columns="2">
                <Grid.Column>
                  <img
                    src="https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/611402.svg"
                    style={{width: 450, height: 450}}
                  />
                  </Grid.Column>
                  <Grid.Column style={{paddingTop: 100}}>
                  <H2><FormattedMessage {...messages.header} /></H2>
                  <Form onSubmit={this.props.onSubmitForm} style={{maxWidth: 500, margin: '0 auto'}}>
                    <label htmlFor="email">
                      <Input
                        style={{margin: '20px 0', width: 300}}
                        id="email"
                        type="text"
                        placeholder="your@email.com"
                        value={this.props.email}
                        onChange={this.props.onChangeEmail}
                      />
                    </label>
                    <br />
                    <label htmlFor="amount">
                      <Input
                        style={{margin: '20px 0', width: 300}}
                        id="amount"
                        type="number"
                        placeholder="1"
                        value={this.props.amount}
                        onChange={this.props.onChangeAmount}
                      />
                    </label>
                    <br />
                    <center><Button type="submit">Buy</Button></center>
                  </Form>
                  { loading && <List component={LoadingIndicator} />}
                  { !loading && this.props.order_hash && <H2>{ this.props.order_hash }</H2>}
                  { this.props.error && this.props.error.response && JSON.stringify(this.props.error.response.data.error) }
              </Grid.Column>
          </Grid>
        </Container>
      </article>
    );
  }
}

ListItemsPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  email: PropTypes.oneOfType([
    PropTypes.string,
  ]),
  onSubmitForm: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangeAmount: PropTypes.func,
  amount: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  email: makeSelectEmail(),
  amount: makeSelectAmount(),
  order_hash: makeSelectTransactionHash(),
  wallet_address: makeSelectTransactionWallet(),
  total: makeSelectTransactionTotal(),
  error: makeSelectError(),
  loading: makeSelectLoading(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeAmount: (evt) => dispatch(changeAmount(evt.target.value)),
    onChangeEmail: (evt) => dispatch(changeEmail(evt.target.value)),
    onSubmitForm: (evt, id = 1) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createOrder(id));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'listItemsPage', reducer });
const withSaga = injectSaga({ key: 'listItemsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ListItemsPage);
