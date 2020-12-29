import { DEVICE_WIDTH, MAP_CONTAINER_HEIGHT } from '.';
import theme from '../modules/core/theme';
import GetLocation from 'react-native-get-location';
import ImageResizer from 'react-native-image-resizer';
import { ShareDialog } from 'react-native-fbsdk';
import _ from 'lodash';

const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatPhoneNumber = phoneNumberString => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match;
  if (cleaned.length === 9) {
    match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  } else {
    match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  }
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return null;
};

// const getMapSnapshotURI = map => {
//   const snapshot =
//     map &&
//     map.takeSnapshot({
//       width: DEVICE_WIDTH,
//       height: MAP_CONTAINER_HEIGHT,
//       format: 'png',
//       quality: 0.8,
//       result: 'file',
//     });
//   return snapshot
//     .then(uri => {
//       return Promise.resolve(uri);
//     })
//     .catch(err => {
//       return Promise.reject(err);
//     });
// };
const getMapSnapshotURI = async map => {
  try {
    const snapshot = await map.takeSnapshot({
      width: DEVICE_WIDTH,
      height: MAP_CONTAINER_HEIGHT,
      format: 'png',
      quality: 0.8,
      result: 'file',
    });
    return Promise.resolve(snapshot);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getCustomMapMarkerIcon = type => {
  switch (type) {
    case 'event':
      return theme.images.MARKER_EVENT;
    case 'memory':
      return theme.images.MARKER_MEMORY;
    case 'station':
      return theme.images.MARKER_STATION;
    default:
      return;
  }
};

const truncate = (str, length) => {
  const dots = str.length > length ? '...' : '';
  return str.substring(0, length) + dots;
};

// Promise returning for user's current locatio

const getUserCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        return resolve(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          return resolve(null);
        } else {
          return resolve({ code });
        }
      });
  });
};

const getResizeImage = (uri, w = 600, h = 600, quality = 100) => {
  return new Promise((resolve, reject) => {
    ImageResizer.createResizedImage(uri, w, h, 'JPEG', quality)
      .then(res => {
        return resolve(res);
      })
      .catch(error => {
        return resolve(null);
      });
  });
};

const isJoinedEvent = (navigation, experience, parentID, childID) => {
  return new Promise((resolve, reject) => {
    if (experience.activeExperience !== undefined && experience.activeExperience === null) {
      return resolve(false);
    } else if (experience.activeExperience.parentID === parentID) {
      navigation.navigate('JoinEvent', {
        parentID: parentID,
        childID: childID,
      });
    } else {
      return resolve(false);
    }
  });
};

const isJoinedStation = (navigation, station, parentID, childID) => {
  return new Promise((resolve, reject) => {
    if (station.activeStation !== undefined && station.activeStation === null) {
      return resolve(false);
    } else if (station.activeStation.parentID === parentID) {
      navigation.navigate('JoinStation', {
        parentID: parentID,
        childID: childID,
      });
    } else {
      return resolve(false);
    }
  });
};

const isJoinedMemory = (navigation, memory, parentID, childID) => {
  return new Promise((resolve, reject) => {
    if (memory.activeMemory !== undefined && memory.activeMemory === null) {
      return resolve(false);
    } else if (memory.activeMemory.parentID === parentID) {
      navigation.navigate('JoinMemory', {
        parentID: parentID,
        childID: childID,
      });
    } else {
      return resolve(false);
    }
  });
};

const isGuestAdmin = (auth, eventData) => {
  const { guest_admin } = eventData;
  if (!_.isEmpty(guest_admin) && guest_admin.uid === auth.uid) {
    return true;
  } else {
    return false;
  }
};

// Get the values of AN object without unknown key
const getValueFromObjectWithoutKey = obj => {
  const unknownKey = Object.keys(obj)[0];
  return obj[unknownKey];
};

// Get the url for directions of google map
const getUrlForDirection = (p1, p2) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${p1.latitude},${p1.longitude}&destination=${p2.latitude},${
    p2.longitude
  }`;
};

// Format seconds as string with format hh:mm:ss
const formatTime = sec_num => {
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
};

const facebookShare = shareLinkContent => {
  ShareDialog.canShow(shareLinkContent)
    .then(function(canShow) {
      if (canShow) {
        return ShareDialog.show(shareLinkContent);
      }
    })
    .then(
      function(result) {
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: ' + result.postId);
        }
      },
      function(error) {
        console.log('Share fail with error: ' + error);
      }
    );
};

export {
  validateEmail,
  formatPhoneNumber,
  getMapSnapshotURI,
  getCustomMapMarkerIcon,
  truncate,
  getValueFromObjectWithoutKey,
  getUrlForDirection,
  formatTime,
  getUserCurrentLocation,
  getResizeImage,
  isJoinedEvent,
  isJoinedStation,
  isJoinedMemory,
  facebookShare,
  isGuestAdmin,
};
