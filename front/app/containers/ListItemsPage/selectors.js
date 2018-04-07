import { createSelector } from 'reselect';

/**
 * Direct selector to the listItemsPage state domain
 */
const selectListItemsPageDomain = (state) => state.get('listItemsPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ListItemsPage
 */

const makeSelectListItemsPage = () => createSelector(
  selectListItemsPageDomain,
  (substate) => substate.toJS()
);

const makeSelectAmount = () => createSelector(
  selectListItemsPageDomain,
  (itemspage) => itemspage.get('amount')
);

const makeSelectEmail = () => createSelector(
  selectListItemsPageDomain,
  (itemspage) => itemspage.get('email')
);

export default makeSelectListItemsPage;
export {
  makeSelectAmount,
  makeSelectEmail,
};
