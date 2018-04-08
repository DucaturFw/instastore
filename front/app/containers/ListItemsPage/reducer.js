/*
 *
 * ListItemsPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_EMAIL,
  CHANGE_AMOUNT,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  email: 'example@gmail.com',
  amount: 1,
});

function listItemsPageReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_EMAIL:
      return state
        .set('email', action.email);
    case CHANGE_AMOUNT:
      // force to use number
      return state
        .set('amount', parseInt(action.amount, 10) || 1);
    default:
      return state;
  }
}

export default listItemsPageReducer;
