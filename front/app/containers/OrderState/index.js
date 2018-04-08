/**
 *
 * OrderState
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import axios from 'axios';
import { Dimmer, Loader, Progress, Image, Segment, Container, Grid } from 'semantic-ui-react'

const PendingStatus = () => (
  <Progress percent={70} indicating progress>
    <p style={{marginTop: 20}}>Your transaction is pending.</p>
  </Progress>
)

const MissingStatus = () => (
  <Segment>
    <Progress percent={0} disabled progress>
      <p style={{marginTop: 5}}>Your transaction was not found in pool yet.</p>
    </Progress>
  </Segment>
)

const PayedStatus = () => (
    <Progress percent={100} success progress>
      <p style={{marginTop: 20}}>Your transaction was verified! Enjoy the kitties!</p>
    </Progress>
)

export class OrderState extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.tick = this.tick.bind(this);
    this.state = {
      [props.match.params.order_hash]: 'pending',
    };
  }

  componentDidMount() {
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
    this.timer = setInterval(this.tick, 1200);
  }

  componentWillUnmount() {
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:
    clearInterval(this.timer);
  }

  tick() {
    const that = this;
    axios.get('http://34.207.88.113:8814/orders')
      .then((response) => {
        const data = response.data;
        console.log(data.orders.filter((o) => o.order.hash === this.props.match.params.order_hash));
        let order = data.orders.filter((o) => o.order.hash === this.props.match.params.order_hash);
        if (order.length > 0) {
          order = order[0];
          if (order.tx) {
            order.state = 'payed';
          } else {
            order.state = 'pending';
          }
        } else {
          order = { state: 'missing' };
        }
        that.setState({ [this.props.match.params.order_hash]: order.state });
      })
      .catch((err) => err.data);
  }

  render() {
    const order_status = this.state[this.props.match.params.order_hash];
    // const order_status = 'payed';
    // const order_status = 'pending';
    // const order_status = 'missing';

    return (
      <Container>
        <Grid columns="1">
          <Helmet>
            <title>OrderState</title>
            <meta name="description" content="Description of OrderState" />
          </Helmet>
          <Grid.Column style={{padding: '80px 40px', width: 800, margin: '0 auto'}}>
            <h3>Order <a href={ `/order/${this.props.match.params.order_hash}` }>#{ this.props.match.params.order_hash }</a></h3>
            {order_status === 'pending' && <PendingStatus />}
            {order_status === 'missing' && <MissingStatus />}
            {order_status === 'payed' && <PayedStatus />}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

OrderState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(OrderState);
