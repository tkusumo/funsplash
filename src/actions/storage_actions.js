import { AsyncStorage } from 'react-native';
import { ASYNC_STORAGE_EMPTY } from './types';
import { ASYNC_STORAGE_NOT_EMPTY } from './types';
import { ASYNC_STORAGE_STATUS } from './types';
import { FAV_ICON_COLOR } from './types';
import { FAV_ICON_EMPTY_COLOR } from './types';
import { FAV_ICON_NOT_EMPTY_COLOR } from './types';

export const checkAsyncStorage = (navigation, color) => async dispatch => {
  // const value = await AsyncStorage.getAllKeys((err, keys) => {
  //   AsyncStorage.multiGet(keys, (err, stores) => {
  //     if (stores.length > 0) {
  //       dispatch({ type: ASYNC_STORAGE_STATUS, payload: ASYNC_STORAGE_NOT_EMPTY });
  //     } else {
  //       dispatch({ type: ASYNC_STORAGE_STATUS, payload: ASYNC_STORAGE_EMPTY });
  //     }
  //   });
  // });
  navigation.setParams({ favIconColor: color });
};

export const setFavIconColor = (color) => async dispatch => {
  dispatch({ type: FAV_ICON_COLOR, payload: color });
};
