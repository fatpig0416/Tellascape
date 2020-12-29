import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/event/index';

export function* onGetCategoryLists(api, payload) {
  try {
    const response = yield call(api.getCategoryLists, payload.data);
    if (response.ok) {
      yield put(Actions.getCategoryListsSuccess(response.data));
    } else {
      yield put(Actions.getCategoryListsFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getCategoryListsFailure(error.message));
  }
}
