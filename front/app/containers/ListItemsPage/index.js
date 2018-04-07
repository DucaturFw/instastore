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
import Form from './Form';
import Input from './Input';
import Section from './Section';
import BuyButton from './BuyButton';
import H2 from '../../components/H2';
import List from '../../components/List';
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
        <div>
          <FormattedMessage {...messages.header} />
          <Section>
            <H2>
              <FormattedMessage {...messages.mainDescription} />
            </H2>
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="email">
                <FormattedMessage {...messages.emailLabel} /> <Input
                  id="email"
                  type="text"
                  placeholder="your@email.com"
                  value={this.props.email}
                  onChange={this.props.onChangeEmail}
                />
              </label>
              <br />
              <label htmlFor="amount">
                <FormattedMessage {...messages.amountLabel} /> <Input
                  id="amount"
                  type="number"
                  placeholder="1"
                  value={this.props.amount}
                  onChange={this.props.onChangeAmount}
                />
              </label>
              <br />
              <center><BuyButton type="submit">Buy</BuyButton></center>
            </Form>
            { loading && <List component={LoadingIndicator} />}
            { !loading && this.props.order_hash && <H2>{ this.props.order_hash }</H2>}
          </Section>
        </div>
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
