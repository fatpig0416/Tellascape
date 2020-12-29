import apisauce from 'apisauce';
import apiEndPoints from './apiEndPoints';
const apiUrl = apiEndPoints.productionUrl;

const auth = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const verifyAuth = value => req.post('accounts/verify-phone', value);

  const updateProfile = value => {
    req.setHeader('Authorization', 'Bearer ' + value._parts[0][1]);
    return req.post('accounts/update-profile', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value._parts[0][1],
    });
  };

  const verifyUsername = value => {
    return req.post('accounts/check-username', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });
  };

  return {
    verifyAuth,
    verifyUsername,
    updateProfile,
  };
};

const experience = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const getCategoryLists = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('categories/catlist');
  };

  const followUser = value => {
    return req.post('profile/follow', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });
  };

  const setProfileSettings = value => {
    return req.post('profile/set_profile_settings', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });
  };

  const blockProfile = value => {
    return req.post('profile/block', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });
  };

  const getShareUrl = value => {
    return req.post('post/dynamic_post_share', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });
  };

  const deleteComment = value =>
    req.post('posts/delete_comment', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
      parentID: value.parentID,
      childID: value.childID,
      commentID: value.commentID,
    });

  return {
    getCategoryLists,
    followUser,
    setProfileSettings,
    blockProfile,
    getShareUrl,
    deleteComment,
  };
};

const events = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const createEvent = value =>
    req.post('events/create', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const updateEvent = value =>
    req.post('events/update_event', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const updateQuickEvent = value =>
    req.post('events/update_quick_event', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });
  const deleteEvent = value =>
    req.post('events/delete', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const leaveEvent = value =>
    req.post('events/leave', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });

  const attendance = value =>
    req.post('events/attendance?answer=' + value.answer + '&parentID=' + value.parentID, value, {
      Authorization: 'Bearer ' + value.token,
    });

  const getGuestLists = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('events/event_users?parentID=' + value.parentID);
  };

  const getEvent = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    if (value.uid === undefined) {
      return req.get('events/get?parentID=' + value.parentID);
    }
    return req.get('events/get?parentID=' + value.parentID + '&uid=' + value.uid);
  };

  const setDefaultMedia = value =>
    req.post('posts/set_default_media', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      userID: value.userID,
      mediaID: value.mediaID,
    });

  const editMedia = value =>
    req.post('posts/edit_text', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      title: value.title,
      parentID: value.parentID,
      childID: value.childID,
      mediaID: value.mediaID,
    });

  const deleteMedia = value =>
    req.post('posts/remove_user_media', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
      mediaID: value.mediaID,
    });

  const addPostEventComment = value =>
    req.post('posts/new_comment', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
      parentID: value.parentID,
      childID: value.childID,
      mediaID: value.mediaID,
      comment: value.comment,
    });

  const addInvite = value =>
    req.post('events/invite', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const deleteInvite = value =>
    req.post('events/remove_this_guest', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const blockUser = value =>
    req.post('events/block_this_user', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const reportEvent = value =>
    req.post('report/submit', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      message: value.message,
      type: value.type,
    });

  const addEventComment = value =>
    req.post('posts/new_comment', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      comment: value.comment,
      mediaID: value.mediaID,
    });

  const getEventComments = value =>
    req.post('posts/get_comment', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      mediaID: value.mediaID,
    });

  const likeEvent = value =>
    req.post('posts/like', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      mediaID: value.mediaID,
    });

  const unlikeEvent = value =>
    req.post('posts/like', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      mediaID: value.mediaID,
    });

  const getProfileData = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('profile/posts?index=' + value.index + '&uid=' + value.uid);
  };

  const profileUpdate = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value._parts[5][1],
    });
    return req.post('profile/update_profile', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value._parts[5][1],
    });
  };

  const profileJourney = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('profile/journey?uid=' + value.uid);
  };

  const getOtherUserMedia = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('posts/other_user_media?parentID=' + value.parentID + '&userId=' + value.userID);
  };

  const verifyPin = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('events/verify?parentID=' + value.parentID + '&event_access_pin=' + value.accessPin);
  };

  const removeEvent = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.delete('events/remove?parentID=' + value.parentID);
  };

  const updateGhostMode = value =>
    req.post('events/update_ghost_status', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      status: value.status,
    });
  const assignGuestAdmin = value =>
    req.post('events/assign_guest_admin', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  return {
    createEvent,
    updateEvent,
    updateQuickEvent,
    attendance,
    getGuestLists,
    getEvent,
    setDefaultMedia,
    editMedia,
    deleteMedia,
    addPostEventComment,
    addInvite,
    deleteInvite,
    blockUser,
    reportEvent,
    addEventComment,
    getEventComments,
    likeEvent,
    unlikeEvent,
    deleteEvent,
    leaveEvent,
    getProfileData,
    profileUpdate,
    getOtherUserMedia,
    verifyPin,
    removeEvent,
    updateGhostMode,
    assignGuestAdmin,
    profileJourney,
  };
};

const station = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const createStation = value =>
    req.post('stations/create', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const updateStation = value =>
    req.post('stations/update', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const endStation = value =>
    req.post('stations/end', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const deleteStation = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.delete('stations/delete?parentID=' + value.parentID);
  };

  const leaveStation = value =>
    req.post('stations/leave', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const joinStation = value =>
    req.post('stations/join', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });

  const getStation = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    if (value.uid === undefined) {
      return req.get('stations/get?parentID=' + value.parentID);
    }
    return req.get('stations/get?parentID=' + value.parentID + '&uid=' + value.uid);
  };

  const setDefaultMedia = value =>
    req.post('posts/set_default_media', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      userID: value.userID,
      mediaID: value.mediaID,
    });

  return {
    createStation,
    updateStation,
    getStation,
    setDefaultMedia,
    deleteStation,
    leaveStation,
    joinStation,
    endStation,
  };
};

const memory = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const createMemory = value =>
    req.post('memories/create', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const startMemory = value =>
    req.post('memories/start', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const updateMemory = value =>
    req.post('memories/update_memory', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const endMemory = value =>
    req.post('memories/end', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const deleteMemory = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.delete('memories/delete?parentID=' + value.parentID);
  };

  const leaveMemory = value =>
    req.post('memories/leave', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const joinMemory = value =>
    req.post('memories/join', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });

  const getMemory = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    if (value.uid === undefined) {
      return req.get('memories/get?parentID=' + value.parentID);
    }
    return req.get('memories/get?parentID=' + value.parentID + '&uid=' + value.uid);
  };

  const setDefaultMedia = value =>
    req.post('posts/set_default_media', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      childID: value.childID,
      userID: value.userID,
      mediaID: value.mediaID,
    });

  return {
    createMemory,
    startMemory,
    updateMemory,
    getMemory,
    setDefaultMedia,
    deleteMemory,
    leaveMemory,
    joinMemory,
    endMemory,
  };
};

const explore = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const friends = value => {
    req.setHeaders({
      Authorization: value.token,
    });
    return req.get('explore/friends');
  };

  const markers = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('explore/markers');
  };

  const amazings = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get(`explore/in_fences?lat=${value.lat}&lng=${value.lng}`);
  };

  const joinEvent = value =>
    req.post('events/join', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });

  const peoples = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('explore/peoples?query=' + value.query);
  };

  return {
    friends,
    markers,
    amazings,
    joinEvent,
    peoples,
  };
};

const home = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const trending = value => {
    return req.get('trending/get?index=0');
  };

  const feed = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('feeds/friends?index=' + value.index);
  };

  const local = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('feeds/local?index=' + value.index + '&cords=' + value.cords);
  };

  const bookmark = value =>
    req.post('posts/bookmark', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
      parentID: value.parentID,
      is_bookmark: value.is_bookmark,
    });

  const selectedPost = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('feeds/post?parentID=' + value.parentID);
  };

  const refreshToken = value => {
    return req.get('accounts/refresh-token?uid=' + value.uid);
  };

  return {
    trending,
    feed,
    local,
    bookmark,
    selectedPost,
    refreshToken,
  };
};

const mediaUpload = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const image = value => {
    return req.post('posts/media_upload', value.formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.formData._parts[0][1],
      onUploadProgress: process => {
        value.onProcess(process, value.reqMediaId, value.formData);
      },
    });
  };

  const video = value => {
    return req.post('posts/media_upload', value.formData, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.formData._parts[0][1],
      onUploadProgress: process => {
        value.onProcess(process, value.reqMediaId, value.formData);
      },
    });
  };

  return {
    image,
    video,
  };
};

const trendingMedia = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const fetch = value => {
    return req.post('posts/get_trending_media', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value._parts[0][1],
    });
  };

  return {
    fetch,
  };
};

const notification = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const getNotification = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('notifications/stack_latest');
  };

  const getExperienceStatus = value =>
    req.post('posts/experience_status', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const acceptRequest = value =>
    req.post('profile/accept', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });
  const denyRequest = value =>
    req.post('profile/deny', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  return {
    getNotification,
    getExperienceStatus,
    acceptRequest,
    denyRequest,
  };
};

const messages = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const getContacts = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('messages/contacts');
  };

  return {
    getContacts,
  };
};

const tellasafe = (baseURL = apiUrl) => {
  const req = apisauce.create({
    baseURL,
    timeout: 55000,
  });

  const createAlert = value =>
    req.post('tellasafe/create', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const editAlert = value =>
    req.post('tellasafe/update', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const deleteAlert = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.delete('tellasafe/delete?parentID=' + value.parentID);
  };

  const joinAlert = value =>
    req.post('tellasafe/join', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + value.token,
    });

  const getAlert = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    if (value.uid === undefined) {
      return req.get('tellasafe/get?parentID=' + value.parentID);
    }
    return req.get('tellasafe/get?parentID=' + value.parentID + '&uid=' + value.uid);
  };

  const saveSettings = value =>
    req.post('tellasafe/save-settings', value, {
      'Content-Type': 'multipart/form-data',
      Authorization: value.token,
    });

  const getSettings = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });
    return req.get('tellasafe/settings');
  };

  const sendAlert = value => {
    req.setHeaders({
      Authorization: 'Bearer ' + value.token,
    });

    if (value.is_only_me) {
      return req.get('tellasafe/send_alert?parentID=' + value.parentID + '&is_only_me=' + value.is_only_me);
    }
    return req.get('tellasafe/send_alert?parentID=' + value.parentID);
  };

  return {
    createAlert,
    getAlert,
    deleteAlert,
    joinAlert,
    getSettings,
    saveSettings,
    sendAlert,
    editAlert,
  };
};

export default {
  auth,
  experience,
  events,
  station,
  memory,
  explore,
  home,
  mediaUpload,
  trendingMedia,
  notification,
  messages,
  tellasafe,
};
