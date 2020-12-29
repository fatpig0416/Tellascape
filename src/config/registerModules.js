import { combineReducers } from 'redux';

/* ------------- Assemble The Reducers ------------- */
const rootReducer = combineReducers({
  auth: require('../modules/auth/reducers/index').reducer,
  explore: require('../modules/home/reducers/index').reducer,
  experience: require('../modules/experience/reducers/event/index').reducer,
  station: require('../modules/experience/reducers/station/index').reducer,
  memory: require('../modules/experience/reducers/memory/index').reducer,
  notification: require('../modules/notification/reducers/index').reducer,
  messages: require('../modules/message/reducers/index').reducer,
  tellasafe: require('../modules/tellasafe/reducers/index').reducer,
});
export default rootReducer;
