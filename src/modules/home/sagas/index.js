import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../utils/api';

/* ------------- Types ------------- */
import { ExploreAction } from '../reducers/index';

/* ------------- Sagas ------------- */
import { onGetFriends } from './onGetFriends';
import { onGetTrending } from './onGetTrending';
import { onGetFeed } from './onGetFeed';
import { onGetLocal } from './onGetLocal';
import { onGetMarkers } from './onGetMarkers';
import { onGetAmazings } from './onGetAmazings';
import { onBookmark } from './onBookmark';
import { onJoinEvent } from './onJoinEvent';
import { onGetSelectedPost } from './onGetSelectedPost';
import { onGetPeoples } from './onGetPeoples';
/* ------------- API ------------- */
const homeApi = apiRequest.home();
const exploreApi = apiRequest.explore();

/* ------------- Connect Types To Sagas ------------- */
export default function* exploreWatcher() {
  yield takeLatest(ExploreAction.GET_FRIENDS, onGetFriends, exploreApi);
  yield takeLatest(ExploreAction.GET_PEOPLES, onGetPeoples, exploreApi);
  yield takeLatest(ExploreAction.JOIN_EVENT_REQUEST, onJoinEvent, exploreApi);
  yield takeLatest(ExploreAction.GET_TRENDING_REQUEST, onGetTrending, homeApi);
  yield takeLatest(ExploreAction.GET_FEED_REQUEST, onGetFeed, homeApi);
  yield takeLatest(ExploreAction.GET_LOCAL_REQUEST, onGetLocal, homeApi);
  yield takeLatest(ExploreAction.GET_MARKERS_REQUEST, onGetMarkers, exploreApi);
  yield takeLatest(ExploreAction.GET_AMAZINGS_REQUEST, onGetAmazings, exploreApi);
  yield takeLatest(ExploreAction.BOOKMARK_POST_REQUEST, onBookmark, homeApi);
  yield takeLatest(ExploreAction.GET_SELECTED_POST_REQUEST, onGetSelectedPost, homeApi);
}
