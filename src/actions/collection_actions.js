import { FETCH_COLLECTION } from './types';
import { FETCH_COLLECTION_FAILED } from './types';
import { FETCH_COLLECTION_PHOTOS } from './types';
import { FETCH_COLLECTION_PHOTOS_FAILED } from './types';
import { toJson } from 'unsplash-js/native';

export const fetchCollectionsFromAPI = (unsplash, page) => dispatch => {
  unsplash.users.collections('unsplash', page, 15, 'updated')
    .then(toJson)
    .then(json => {
      dispatch({ type: FETCH_COLLECTION, payload: json });
    })
    .catch(err => {
      dispatch({ type: FETCH_COLLECTION_FAILED, payload: err });
    });
};

export const fetchCollectionPhotosFromAPI = (unsplash, page, id) => dispatch => {
  unsplash.collections.getCollectionPhotos(id, page, 10, 'latest')
    .then(toJson)
    .then(json => {
      const photos = [];
      const utm = '&utm_source=tenphotos&utm_medium=referral&utm_campaign=api-credit';
      for (let i = 0; i < json.length; i++) {
        const photo = {
          id: json[i].id,
          name: json[i].user.name,
          likes: json[i].likes,
          urlRegular: (json[i].urls.regular + utm),
          urlFull: (json[i].urls.full + utm),
          avatarMedium: json[i].user.profile_image.medium,
          avatarLarge: json[i].user.profile_image.large,
          location: json[i].user.location,
          download: json[i].links.download_location,
        };

        photos.push(photo);
      }

      dispatch({ type: FETCH_COLLECTION_PHOTOS, payload: photos });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: FETCH_COLLECTION_PHOTOS_FAILED, payload: err });
    });
};
