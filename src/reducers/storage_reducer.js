import { ASYNC_STORAGE_EMPTY } from '../actions/types';
import { ASYNC_STORAGE_NOT_EMPTY } from '../actions/types';
import { ASYNC_STORAGE_STATUS } from '../actions/types';
import { FAV_ICON_COLOR } from '../actions/types';

const INITIAL_STATE = {
  status: '',
  favIconColor: '',
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ASYNC_STORAGE_STATUS:
      return { ...state, status: action.payload };
    case FAV_ICON_COLOR:
      return { ...state, favIconColor: action.payload };
    default:
      return state;
  }
};
