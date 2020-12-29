import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../../utils/api';

/* ------------- Types ------------- */
import { ExperienceActions } from '../../reducers/event/index';

/* ------------- Sagas ------------- */
import { onGetCategoryLists } from '../onGetCategoryLists';
import { onAddEvent } from './onAddEvent';
import { onAttendance } from './onAttendance';
import { onGetGuestLists } from './onGuestLists';
import { onGetEvent } from './onGetEvent';
import {
  onGetPostEvent,
  onSetDefaultMedia,
  onEditMedia,
  onDeleteMedia,
  onAddPostEventComment,
  onUpdateGhostMode,
} from './onGetPostEvent';
import { onUpdateEvent } from './onUpdateEvent';
import { onUpdateQuickEvent } from './onUpdateQuickEvent';
import { onLeaveEvent } from './onLeaveEvent';
import { onDeleteEvent } from './onDeleteEvent';
import { onAddInvite } from './onAddInvite';
import { onDeleteInvite } from './onDeleteInvite';
import { onBlockUser } from './onBlockUser';
import { onUploadImage } from './onUploadImage';
import { onUploadVideo } from './onUploadVideo';
import { onReportEvent } from './onReportEvent';
import { onFetchTrendingMedia } from './onFetchTrendingMedia';
import { onAddEventComment } from './onAddEventComment';
import { onGetEventComments } from './onGetEventComments';
import { onLikeEvent } from './onLikeEvent';
import { onUnLikeEvent } from './onUnlikeEvent';
import { onGetProfileData } from './onGetProfileData';
import { onProfileUpdate } from '../onProfileUpdate';
import { onSetProfileSettings } from '../onSetProfileSettings';
import { onFollowUser } from '../onFollowUser';
import { onBlockProfile } from '../onBlockProfile';
import { onGetOtherUserMedia } from './onGetOtherUserMedia';
import { onVerifyPin } from './onVerifyPin';
import { onRemoveEvent } from './onRemoveEvent';
import { onAssignAdmin } from './onAssignAdmin';
import { onGetProfileJourney } from './onGetProfileJourney';
import { onShareUrl } from './onShareUrl';
import { onDeleteComment } from './onDeleteComment';
/* ------------- API ------------- */
const api = apiRequest.experience();
const eventApi = apiRequest.events();
const mediaUploadApi = apiRequest.mediaUpload();
const trendingMediaApi = apiRequest.trendingMedia();

/* ------------- Connect Types To Sagas ------------- */
export default function* experienceWatcher() {
  yield takeLatest(ExperienceActions.GET_CATEGORY_LISTS, onGetCategoryLists, api);
  yield takeLatest(ExperienceActions.GET_EVENT, onGetEvent, eventApi);
  yield takeLatest(ExperienceActions.GET_POST_EVENT, onGetPostEvent, eventApi);
  yield takeLatest(ExperienceActions.SET_DEFAULT_MEDIA, onSetDefaultMedia, eventApi);
  yield takeLatest(ExperienceActions.EDIT_MEDIA, onEditMedia, eventApi);
  yield takeLatest(ExperienceActions.DELETE_MEDIA, onDeleteMedia, eventApi);
  yield takeLatest(ExperienceActions.ADD_POST_EVENT_COMMENT, onAddPostEventComment, eventApi);
  yield takeLatest(ExperienceActions.UPDATE_GHOST_MODE, onUpdateGhostMode, eventApi);
  yield takeLatest(ExperienceActions.GET_OTHER_USER_MEDIA, onGetOtherUserMedia, eventApi);
  yield takeLatest(ExperienceActions.VERIFY_PIN, onVerifyPin, eventApi);
  yield takeLatest(ExperienceActions.REMOVE_EVENT, onRemoveEvent, eventApi);

  yield takeLatest(ExperienceActions.ADD_EVENT, onAddEvent, eventApi);
  yield takeLatest(ExperienceActions.UPDATE_EVENT, onUpdateEvent, eventApi);
  yield takeLatest(ExperienceActions.UPDATE_QUICK_EVENT, onUpdateQuickEvent, eventApi);
  yield takeLatest(ExperienceActions.ATTENDANCE, onAttendance, eventApi);
  yield takeLatest(ExperienceActions.LEAVE_EVENT, onLeaveEvent, eventApi);
  yield takeLatest(ExperienceActions.DELETE_EVENT, onDeleteEvent, eventApi);
  yield takeLatest(ExperienceActions.ADD_INVITE, onAddInvite, eventApi);
  yield takeLatest(ExperienceActions.DELETE_INVITE, onDeleteInvite, eventApi);
  yield takeLatest(ExperienceActions.BLOCK_USER, onBlockUser, eventApi);
  yield takeLatest(ExperienceActions.GET_GUEST_LISTS, onGetGuestLists, eventApi);
  yield takeLatest(ExperienceActions.UPLOAD_IMAGE, onUploadImage, mediaUploadApi);
  yield takeLatest(ExperienceActions.UPLOAD_VIDEO, onUploadVideo, mediaUploadApi);
  yield takeLatest(ExperienceActions.REPORT_EVENT, onReportEvent, eventApi);
  yield takeLatest(ExperienceActions.FETCH_TRENDING_MEDIA, onFetchTrendingMedia, trendingMediaApi);
  yield takeLatest(ExperienceActions.ADD_EVENT_COMMENT, onAddEventComment, eventApi);
  yield takeLatest(ExperienceActions.GET_EVENT_COMMENTS, onGetEventComments, eventApi);
  yield takeLatest(ExperienceActions.LIKE_EVENT, onLikeEvent, eventApi);
  yield takeLatest(ExperienceActions.UNLIKE_EVENT, onUnLikeEvent, eventApi);
  yield takeLatest(ExperienceActions.GET_PROFILE_DATA, onGetProfileData, eventApi);
  yield takeLatest(ExperienceActions.PROFILE_UPDATE, onProfileUpdate, eventApi);
  yield takeLatest(ExperienceActions.FOLLOW_USER, onFollowUser, api);
  yield takeLatest(ExperienceActions.SET_PROFILE_SETTINGS, onSetProfileSettings, api);
  yield takeLatest(ExperienceActions.BLOCK_PROFILE, onBlockProfile, api);
  yield takeLatest(ExperienceActions.ASSIGN_ADMIN, onAssignAdmin, eventApi);
  yield takeLatest(ExperienceActions.PROFILE_JOURNEY, onGetProfileJourney, eventApi);
  yield takeLatest(ExperienceActions.SHARE_URL, onShareUrl, api);
  yield takeLatest(ExperienceActions.DELETE_COMMENT, onDeleteComment, api);
}
