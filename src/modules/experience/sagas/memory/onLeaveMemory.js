import { call, put } from 'redux-saga/effects';

export function* onLeaveMemory(api, payload) {
  try {
    const response = yield call(api.leaveMemory, payload.data.formData);
    if (response.ok) {
      payload.data.leaveMemorySuccess();
    } else {
      payload.data.leaveMemoryFailure();
    }
  } catch (error) {
    console.log(`error is leave: `, error);
  }
}
