import Immutable from 'seamless-immutable';
import { IMAGE_FILTERS } from '../../utils';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  data: [],
  categoryLists: {},
  lists: {},
  geofence: {},
  shape: null,
  carouselEntries: [],
  selectedLiveEventData: {},
  liveEventImage: {
    uri: null,
    width: null,
    height: null,
    pictureOrientation: null,
  },
  currentImageFilter: 'Normal', //default image filter is NORMAL
  imageFilters: IMAGE_FILTERS,
  uploadSuccessful: false,
  comments: [],
  profileData: null,
  viewMedia: {
    trending_media: [],
  },
  joinEventData: [],
  activeExperience: null,
  joinEventClose: null,
  isEventLoad: false,
  isProfileLoad: false,
  videoProcess: [],
  localExperience: [],
  privateJoinedEvents: [],
  journeyData: {},
});
