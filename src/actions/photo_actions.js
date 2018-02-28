/*jshint esversion: 6 */
import { FETCH_PHOTO_FAILED } from './types';
import { FETCH_PHOTO } from './types';
import { toJson } from 'unsplash-js/native';

export const fetchPhotosFromAPI = (unsplash, page) => dispatch => {
  unsplash.photos.listPhotos(page, 10, 'latest')
    .then(toJson)
    .then(json => {
      const photos = [];
      const utm = 'utm_source=tenphotos&utm_medium=referral&utm_campaign=api-credit';
      for (let i = 0; i < json.length; i++) {
        const photo = {
          id: json[i].id,
          name: json[i].user.name,
          likes: json[i].likes,
          urlRegular: (json[i].urls.regular + '&' + utm),
          urlFull: (json[i].urls.full + '&' + utm),
          avatarMedium: json[i].user.profile_image.medium,
          avatarLarge: json[i].user.profile_image.large,
          location: json[i].user.location,
          download: json[i].links.download,
          profile: (json[i].user.links.html + '?' + utm),
        };
        photos.push(photo);
      }

      console.log(photos);
      dispatch({ type: FETCH_PHOTO, payload: photos });
    })
    .catch(err => {
      console.log(err);
    });
};
