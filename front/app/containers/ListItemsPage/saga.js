
import { call, put, select, takeLatest } from 'redux-saga/effects';
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
  } catch (err) {
    console.log('Error');
    yield put(orderCreationError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* createOrderSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(CREATE_ORDER, createOrder);
}
