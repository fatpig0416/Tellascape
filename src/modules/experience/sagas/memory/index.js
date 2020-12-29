import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../../utils/api';

/* ------------- Types ------------- */
import { MemoryActions } from '../../reducers/memory/index';

/* ------------- Sagas ------------- */
import { onAddMemory } from './onAddMemory';
import { onUpdateMemory } from './onUpdateMemory';
import { onStartMemory } from './onStartMemory';
import { onGetMemory, onAddMemoryComment, onDeleteMedia, onEditMedia, onSetDefaultMemoryMedia } from './onGetMemory';
import { onLeaveMemory } from './onLeaveMemory';
import { onDeleteMemory } from './onDeleteMemory';
import { onEndMemory } from './onEndMemory';
import { onLikeMemory } from './onLikeMemory';
import { onUploadMemoryVideo } from './onUploadMemoryVideo';
import { onJoinMemory } from './onJoinMemory';
import { onUploadMemoryImage } from './onUploadMemoryImage';
/* ------------- API ------------- */
const api = apiRequest.memory();
const eventApi = apiRequest.events();
const mediaUploadApi = apiRequest.mediaUpload();
/* ------------- Connect Types To Sagas ------------- */
export default function* memoryWatcher() {
  yield takeLatest(MemoryActions.ADD_MEMORY, onAddMemory, api);
  yield takeLatest(MemoryActions.UPDATE_MEMORY, onUpdateMemory, api);
  yield takeLatest(MemoryActions.START_MEMORY, onStartMemory, api);
  yield takeLatest(MemoryActions.LEAVE_MEMORY, onLeaveMemory, api);
  yield takeLatest(MemoryActions.GET_MEMORY, onGetMemory, api);
  yield takeLatest(MemoryActions.DELETE_MEMORY, onDeleteMemory, api);
  yield takeLatest(MemoryActions.END_MEMORY, onEndMemory, api);
  yield takeLatest(MemoryActions.JOIN_MEMORY, onJoinMemory, api);
  yield takeLatest(MemoryActions.SET_DEFAULT_MEMORY_MEDIA, onSetDefaultMemoryMedia, api);

  yield takeLatest(MemoryActions.LIKE_MEMORY, onLikeMemory, eventApi);
  yield takeLatest(MemoryActions.ADD_MEMORY_COMMENT, onAddMemoryComment, eventApi);
  yield takeLatest(MemoryActions.DELETE_MEMORY_MEDIA, onDeleteMedia, eventApi);
  yield takeLatest(MemoryActions.EDIT_MEMORY_MEDIA, onEditMedia, eventApi);

  yield takeLatest(MemoryActions.UPLOAD_MEMORY_VIDEO, onUploadMemoryVideo, mediaUploadApi);
  yield takeLatest(MemoryActions.UPLOAD_MEMORY_IMAGE, onUploadMemoryImage, mediaUploadApi);
}
