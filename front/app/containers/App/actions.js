/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  CREATE_ORDER,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
} from './constants';

/**
 * Create order, this action starts the request saga
 *
 * @return {object} An action object with a type of CREATE_ORDER
 */
export function createOrder(id = 1) {
  return {
    type: CREATE_ORDER,
    id
  };
}


/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {string} email The user email
 * @param  {Number} amount The current amount
 * @param  {Number} total The total amount of BTC
 * @param  {string} wallet_address The address to send money to
 * @param  {string} order_hash The order's hash for transaction's OP_RETURN code
 *
 * @return {object}      An action object with a type of CREATE_ORDER_SUCCESS passing the transaction and user data
 */
export function orderCreated(email, amount, total, wallet_address, order_hash) { // eslint-disable-line camelcase
  return {
    type: CREATE_ORDER_SUCCESS,
    email,
    amount,
    total,
    wallet_address,
    order_hash,
  };
}

/**
 * Dispatched when creation of order fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of CREATE_ORDER_ERROR passing the error
 */
export function orderCreationError(error) {
  return {
    type: CREATE_ORDER_ERROR,
    error,
  };
}
