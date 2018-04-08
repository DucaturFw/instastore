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
    return (
      <article>
        <Helmet>
          <title>OrderState</title>
          <meta name="description" content="Description of OrderState" />
        </Helmet>
        <div>
          <p>
            Hello Neighbour,
            check this out: { this.props.match.params.order_hash }
            <br />
            Your order is in state: { this.state[this.props.match.params.order_hash] }
          </p>
        </div>
      </article>
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
