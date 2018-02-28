/*jshint esversion: 6 */
import { FETCH_PHOTO_FAILED } from '../actions/types';
import { FETCH_PHOTO } from '../actions/types';

const INITIAL_STATE = {
  data: [],
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PHOTO:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
