
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { CREATE_ORDER } from 'containers/App/constants';
import { orderCreated, orderCreationError } from 'containers/App/actions';

import { postData } from 'utils/request';
import { makeSelectEmail, makeSelectAmount } from 'containers/ListItemsPage/selectors';

/**
 * Github repos request/response handler
 */
export function* createOrder(action) {
  // Select username from store
  const email = yield select(makeSelectEmail());
  const amount = yield select(makeSelectAmount());
  const requestURL = `http://34.207.88.113:3000/create_order`;

  try {
    console.log('Trying to reach the server.');
    // Call our postData helper (see 'utils/request')
    const data = yield call(postData, requestURL, {
      order_info: { amount, id: action.id },
      user_info: { email },
    });
    const { total, wallet_address, order_hash } = data;
    yield put(orderCreated(email, amount, total, wallet_address, order_hash));

    try {
      let orders = JSON.parse(localStorage.getItem('orders'));
      if (!orders || !Array.isArray(orders)) {
        orders = [];
      }
      orders.push(order_hash);
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (err) { console.error(err); }
    window.bitWeb.sendTransaction({
      to: wallet_address,
      amount: total,
      data: order_hash,
    });
    yield put(push(`/order/${order_hash}`));
  } catch (err) {
    console.log('Error');
    yield put(orderCreationError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* createOrderSaga() {
  yield takeLatest(CREATE_ORDER, createOrder);
}
