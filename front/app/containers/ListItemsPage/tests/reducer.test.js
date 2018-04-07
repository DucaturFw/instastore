
import { fromJS } from 'immutable';
import listItemsPageReducer from '../reducer';

describe('listItemsPageReducer', () => {
  it('returns the initial state', () => {
    expect(listItemsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
