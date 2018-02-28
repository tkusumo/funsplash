/*jshint esversion: 6 */
import { combineReducers } from 'redux';

import photos from './photos_reducer';
import bio from './bios_reducer';
import collections from './collections_reducer';
import storage from './storage_reducer';

export default combineReducers({
  photos,
  bio,
  collections,
  storage,
});
