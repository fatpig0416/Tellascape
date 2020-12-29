import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../../utils/api';

/* ------------- Types ------------- */
import { StationActions } from '../../reducers/station/index';

/* ------------- Sagas ------------- */
import { onAddStation } from './onAddStation';
import { onGetStation, onAddStationComment, onDeleteMedia, onEditMedia, onSetDefaultStationMedia } from './onGetStation';
import { onUpdateStation } from './onUpdateStation';
import { onLeaveStation } from './onLeaveStation';
import { onDeleteStation } from './onDeleteStation';
import { onEndStation } from './onEndStation';
import { onLikeStation } from './onLikeStation';
import { onUploadStationVideo } from './onUploadStationVideo';
import { onJoinStation } from './onJoinStation';
import { onUploadStationImage } from './onUploadStationImage';
/* ------------- API ------------- */
const api = apiRequest.station();
const eventApi = apiRequest.events();
const mediaUploadApi = apiRequest.mediaUpload();
/* ------------- Connect Types To Sagas ------------- */
export default function* stationWatcher() {
  yield takeLatest(StationActions.ADD_STATION, onAddStation, api);
  yield takeLatest(StationActions.UPDATE_STATION, onUpdateStation, api);
  yield takeLatest(StationActions.LEAVE_STATION, onLeaveStation, api);
  yield takeLatest(StationActions.GET_STATION, onGetStation, api);
  yield takeLatest(StationActions.DELETE_STATION, onDeleteStation, api);
  yield takeLatest(StationActions.END_STATION, onEndStation, api);
  yield takeLatest(StationActions.LIKE_STATION, onLikeStation, eventApi);
  yield takeLatest(StationActions.SET_DEFAULT_STATION_MEDIA, onSetDefaultStationMedia, api);
  yield takeLatest(StationActions.ADD_STATION_COMMENT, onAddStationComment, eventApi);
  yield takeLatest(StationActions.DELETE_STATION_MEDIA, onDeleteMedia, eventApi);
  yield takeLatest(StationActions.EDIT_STATION_MEDIA, onEditMedia, eventApi);
  yield takeLatest(StationActions.UPLOAD_STATION_VIDEO, onUploadStationVideo, mediaUploadApi);
  yield takeLatest(StationActions.UPLOAD_STATION_IMAGE, onUploadStationImage, mediaUploadApi);
  yield takeLatest(StationActions.JOIN_STATION, onJoinStation, api);

  // yield takeLatest(StationActions.UPLOAD_IMAGE, onUploadImage, mediaUploadApi);
  // yield takeLatest(StationActions.UPLOAD_VIDEO, onUploadVideo, mediaUploadApi);
}
