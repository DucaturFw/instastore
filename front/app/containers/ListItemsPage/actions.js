/*
 *
 * ListItemsPage actions
 *
 */

import {
    CHANGE_AMOUNT,
    CHANGE_EMAIL,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} amount The amount of products to be bought
 *
 * @return {object}    An action object with a type of CHANGE_AMOUNT
 */
export function changeAmount(amount) {
  return {
    type: CHANGE_AMOUNT,
    amount,
  };
}

/**
 * Changes the input field of the form
 *
 * @param  {name} amount The email of user
 *
 * @return {object}    An action object with a type of CHANGE_EMAIL
 */
export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}
