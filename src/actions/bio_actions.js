/*jshint esversion: 6 */
import { FETCH_BIO_FAILED } from './types';
import { FETCH_BIO } from './types';
import { ON_SNAP } from './types';

export const fetchBio = (bio) => dispatch => {
  //console.log(bio);
  dispatch({ type: FETCH_BIO, payload: bio });
};

export const onSnap = (index) => dispatch => {
  //console.log(index);
  dispatch({ type: ON_SNAP, payload: index });
};
