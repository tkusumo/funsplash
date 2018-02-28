import { FETCH_COLLECTION_FAILED } from '../actions/types';
import { FETCH_COLLECTION } from '../actions/types';
import { FETCH_COLLECTION_PHOTOS_FAILED } from '../actions/types';
import { FETCH_COLLECTION_PHOTOS } from '../actions/types';

const INITIAL_STATE = {
  data: [],
  photos: [],
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COLLECTION:
      return { ...state, data: action.payload };
    case FETCH_COLLECTION_PHOTOS:
      return { ...state, photos: action.payload };
    default:
      return state;
  }
};
