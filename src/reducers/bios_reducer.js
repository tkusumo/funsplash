/*jshint esversion: 6 */
import { FETCH_BIO_FAILED } from '../actions/types';
import { FETCH_BIO } from '../actions/types';
import { ON_SNAP } from '../actions/types';

const INITIAL_STATE = {
  bioDetail: {},
  idx: 0,
};

export default function(state=INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_BIO:
      return { ...state, bioDetail: action.payload };
    case ON_SNAP:
      return { ...state, idx: action.payload };
    default:
      return state;
  }
};
