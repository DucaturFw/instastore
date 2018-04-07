/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  CREATE_ORDER,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
    email: false,
    amount: false,
    id: false,
  },
  transactionData: {
    hash: false,
    total: 0,
    wallet_address: false,
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    // Order creation
    case CREATE_ORDER:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'email'], false)
        .setIn(['userData', 'amount'], 0)
        .setIn(['userData', 'id'], action.id);
    case CREATE_ORDER_SUCCESS:
      return state
        .setIn(['transactionData', 'hash'], action.order_hash)
        .setIn(['transactionData', 'total'], action.total)
        .setIn(['transactionData', 'wallet_address'], action.wallet_address)
        .setIn(['userData', 'email'], action.email)
        .setIn(['userData', 'amount'], action.amount)
        .set('loading', false)
        .set('currentUser', action.email);
    case CREATE_ORDER_ERROR:
      return state
        .set('error', action.error)
        .setIn(['transactionData', 'hash'], false)
        .setIn(['transactionData', 'total'], 0)
        .setIn(['transactionData', 'wallet_address'], false)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
