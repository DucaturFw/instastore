/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectCurrentUser = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('currentUser')
);

const makeSelectLoading = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectUserEmail = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['userData', 'email'])
);

const makeSelectUserAmount = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['userData', 'amount'])
);

const makeSelectTransactionTotal = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['transactionData', 'total'])
);

const makeSelectTransactionHash = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['transactionData', 'order_hash'])
);

const makeSelectTransactionWallet = () => createSelector(
    selectGlobal,
    (globalState) => globalState.getIn(['transactionData', 'wallet_address'])
);

const makeSelectLocation = () => createSelector(
    selectRoute,
    (routeState) => routeState.get('location').toJS()
);

const makeSelectCats = () => createSelector(
    selectGlobal,
    (globalState) => globalState.get('cats').toJS()
);

export {
    selectGlobal,
    makeSelectCurrentUser,
    makeSelectLoading,
    makeSelectError,
    makeSelectRepos,
    makeSelectLocation,
    makeSelectUserEmail,
    makeSelectUserAmount,
    makeSelectTransactionTotal,
    makeSelectTransactionHash,
    makeSelectTransactionWallet,
    makeSelectCats,
};