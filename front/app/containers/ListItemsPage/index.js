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
  Grid,
  Icon,
  Form,
  Segment
} from 'semantic-ui-react';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import List from '../../components/List';
import { makeSelectTransactionTotal, makeSelectCats,
  makeSelectTransactionHash, makeSelectTransactionWallet, makeSelectError, makeSelectLoading } from '../App/selectors';
import { makeSelectEmail, makeSelectAmount } from './selectors';
import { changeAmount, changeEmail } from './actions';
import { createOrder } from '../App/actions';
import reducer from './reducer';
import saga from './saga';
import Input from './Input';
import H2 from '../../components/H2';
import LoadingIndicator from '../../components/LoadingIndicator';


export class ListItemsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { loading } = this.props;
    let catId = this.props.match.params.cat;

    let cat = this.props.cats[catId];
    if (!cat) {
      catId = 1;
      cat = this.props.cats[1];
    }

    return (
      <Segment style={{ height: 470, backgroundColor: '#a2c2eb' }} vertical>
      <article>
        <Helmet>
          <title>Store</title>
          <meta name="description" content="Buy some of our best cats!" />
        </Helmet>
        <Container textAlign="center">
          <Grid columns="2">
            <Grid.Column>
              <img
                src={cat.pic}
                alt={cat.bio}
                style={{ width: 450, height: 450 }}
              />
            </Grid.Column>
            <Grid.Column style={{ paddingTop: 100 }}>
              <H2><FormattedMessage id={'' + catId} defaultMessage={cat.bio} /></H2>
              <Form onSubmit={(evt) => this.props.onSubmitForm(evt, catId)} style={{ maxWidth: 500, margin: '0 auto' }}>
                <label htmlFor="email">
                  <Input
                    style={{ margin: '15px 0', width: 300 }}
                    id="email"
                    type="text"
                    placeholder="your@email.com"
                    value={this.props.email}
                    onChange={this.props.onChangeEmail}
                  />
                </label>
                <br />
                <label htmlFor="amount">
                  <h4 style={{ marginBottom: '-0.25em' }}>Amount:</h4>
                  <Input
                    style={{ margin: '15px 0', width: 300 }}
                    id="amount"
                    type="number"
                    placeholder="1"
                    value={this.props.amount}
                    onChange={this.props.onChangeAmount}
                  />
                </label>
                <br />
                <center style={{ marginTop: 20 }}>
                  <Button animated="vertical" type="submit" size="large" color="black">
                    <Button.Content visible>
                      Buy this kitten <Icon name="shop" />
                    </Button.Content>
                    <Button.Content hidden>
                      {cat.price * this.props.amount} <Icon name="bitcoin" />
                    </Button.Content>
                  </Button>
                </center>
              </Form>
              { loading && <List component={LoadingIndicator} />}
              { !loading && this.props.order_hash && <H2>{ this.props.order_hash }</H2>}
              { this.props.error && this.props.error.response && JSON.stringify(this.props.error.response.data.error) }
            </Grid.Column>
          </Grid>
        </Container>
      </article>
      </Segment>
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
  order_hash: PropTypes.string,
  cats: PropTypes.object,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  email: makeSelectEmail(),
  amount: makeSelectAmount(),
  order_hash: makeSelectTransactionHash(),
  wallet_address: makeSelectTransactionWallet(),
  total: makeSelectTransactionTotal(),
  error: makeSelectError(),
  loading: makeSelectLoading(),
  cats: makeSelectCats(),
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
