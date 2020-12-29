import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Platform,
  Linking,
  DeviceEventEmitter,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Alert,
  RefreshControl,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import uuid from 'uuid';
import _ from 'lodash/fp';
import theme from '../../core/theme';
import ExploreAction from '../reducers/index';
import ExperienceActions from '../../experience/reducers/event/index';
import StationActions from '../../experience/reducers/station';
import MemoryActions from '../../experience/reducers/memory';
import AlertActions from '../../tellasafe/reducers';
import NotificationAction from '../../notification/reducers';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MAP_CONTAINER_HEIGHT } from '../../../utils';
import {
  isJoinedEvent,
  isJoinedStation,
  isJoinedMemory,
  getUserCurrentLocation,
  getValueFromObjectWithoutKey,
} from '../../../utils/funcs';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { DEFAULT_FOUNDER_ID } from '../../../utils/vals';
import GeoLocation from '@react-native-community/geolocation';
import * as geolib from 'geolib';
import Pusher from 'pusher-js/react-native';

// Import oragnism
import TrendingCarousel from './organisms/TrendingCarousel';

const { font, colors } = theme;

const StyledTrendingExperienceWrapper = styled.View`
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
  padding-top: ${wp('2.5%')};
  padding-bottom: ${wp('2.5%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
`;

const StyledPhotoContainer = styled.View`
  padding-top: ${wp('2.22%')};
  padding-bottom: ${wp('8.33%')};
  align-items: center;
`;

const StyledRow = styled.View`
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
`;

const StyledUserItemWrapper = styled.View`
  border-radius: 31;
  margin-bottom: 5;
  padding-left: 2;
  padding-right: 2;
`;

const StyledUserPhoto = styled.Image`
  width: ${wp('45.6%')};
  height: 200;
  border-radius: 20;
`;

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [
      {
        saturation: '-100',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: 65,
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: '50',
      },
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        saturation: '-100',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'all',
    stylers: [
      {
        lightness: '30',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
      {
        lightness: '40',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colors.aquaColor,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [
      {
        lightness: -25,
      },
      {
        saturation: -100,
      },
    ],
  },
];

const StyledTrendingText = styled.Text`
  font-size: ${wp('4.16%')};
  line-height: ${wp('5.27%')};
  color: #000000;
  font-family: ${font.MBold};
  letter-spacing: 1;
`;

const StyledMapContainer = styled.View`
  height: ${MAP_CONTAINER_HEIGHT};
  align-items: center;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.2);
`;

/** Trending Class */
class Trending extends Component {
  static navigationOptions = { title: '', header: null };
  constructor(props) {
    super(props);
    this.state = {
      toolTipVisible: false,
      visible: false,
      selected: null,
      isShowAllEvents: false,
      isShowAllStations: false,
      isShowAllMemories: false,
      currentLocation: { latitude: 40.611884, longitude: -99.532927 },
      isRefresh: false,
    };
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
  }

  handleDynamicLink = url => {
    console.log({ dynamicKink: url });
    if (!url) {
      return;
    }
    const paramsString = url.split('?').slice(-1) || [''];
    let params = {};
    const paramStringArr = paramsString[0].split('&') || [];

    if (paramStringArr.length) {
      paramStringArr.forEach(pS => {
        const key = pS.split('=')[0];
        const val = pS.split('=')[1];
        params[key] = val;
      });
    }

    const parent_id = params.parent_id || '';
    const child_id = params.child_id || '';
    const routeName = params.expType || '';
    const mediaId = params.media_id || '';
    this.handleOpenURL({ url: `tellascape://${routeName}/${parent_id}/${child_id}/${mediaId}` });
  };

  // dynamic url parsed from native code
  componentWillMount = () => {
    this.nativeModule = NativeModules.SimpleActions;
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('onDetectDynamicLink', ({ url }) => {
        console.log('Dynamic Link from background: ', url);
        this.handleDynamicLink(url);
      });
    } else {
      this.emitter = new NativeEventEmitter(NativeModules.BridgeEvents);
      this.emitter.addListener('onDetectDynamicLink', url => {
        console.log('Dynamic Link from background: ', url);
        this.handleDynamicLink(url);
      });
    }
  };

  componentDidMount = async () => {
    this.props.navigation.setParams({
      scrollToTop: this.scrollToTop,
    });

    /*
     In this request has error always come first because user
     get the popup for permission but this request sent before the
     user click to accept permission in Android.
     Request creating the over flow for Android release.
    */
    if (Platform.OS === 'ios') {
      GeoLocation.setRNConfiguration({ skipPermissionRequests: true });
      this.getUpdatedLocation();
      /*
      this.watchID = GeoLocation.watchPosition(
        position => {
          this.getUpdatedLocation();
        },
        error => console.log('error', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, distanceFilter: 1 }
      ); */
    }
    const { localStation } = this.props.station;
    const { localMemory } = this.props.memory;
    const { localExperience } = this.props.experience;
    let stationArray = [...localStation];
    stationArray = stationArray.map((item, index) => {
      return {
        ...item,
        status: 'fail',
      };
    });
    this.props.setLocalStation(stationArray);

    let memoryArray = [...localMemory];
    memoryArray = memoryArray.map((item, index) => {
      return {
        ...item,
        status: 'fail',
      };
    });
    this.props.setLocalMemory(memoryArray);

    let experienceArray = [...localExperience];
    experienceArray = experienceArray.map((item, index) => {
      return {
        ...item,
        status: 'fail',
      };
    });
    this.props.setLocalExperience(experienceArray);

    this.notificationListener = firebase.notifications().onNotification(notification => {
      let data = {
        _data: notification.data,
      };
      this.onReceiveNotification(data);
    });
    this.notificationOpenListener = firebase.notifications().onNotificationOpened(notificationOpen => {
      let newData = notificationOpen.notification.data;
      let action, routeData, type;
      if (newData && newData._data) {
        action = newData._data.action;
        routeData = newData._data;
        type = newData._data.type;
      } else {
        action = newData.action;
        routeData = newData;
        type = newData.type;
      }
      if (action && action === 'alerts') {
        this.props.navigation.navigate('Explore', { routeData: routeData });
      } else if (type && type === 'event_invitation') {
        let parentID, childID;
        if (newData && newData._data) {
          parentID = newData._data.parentPostID;
          childID = newData._data.childPostID;
        } else {
          parentID = newData.parentPostID;
          childID = newData.childPostID;
        }
        this.props.navigation.navigate('ViewEvent', {
          parentID: parentID,
          childID: childID,
        });
      }
    });
    this.messageListner = firebase.messaging().onMessage(message => {
      this.onReceiveNotification(message);
    });

    Pusher.logToConsole = false;

    let pusher = new Pusher('97ee976d9813deaaddb1', { cluster: 'mt1' });
    var channel = pusher.subscribe('notification');

    channel.bind('notification-event', data => {
      this.onReceivePusherData(data);
    });

    this._unsubscribe = this.props.navigation.addListener('didFocus', () => {
      this.setState({
        isShowAllEvents: false,
        isShowAllStations: false,
        isShowAllMemories: false,
      });
    });

    if (Platform.OS === 'android') {
      await this.requestLocationPermission();

      Linking.getInitialURL().then(url => this.handleOpenURL({ url }));
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }

    const trendingReqObj = {
      token: this.props.auth.access_token,
      index: 0,
    };

    this.props.onGetTrending();
    this.props.onGetMarkers(trendingReqObj);
    this.tabFocusedListener = this.props.navigation.addListener('willFocus', this.setComponentIsFocused);
  };

  requestLocationPermission = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Tellascape',
        message:
          'In order to track the path of your routes, or build a geofence around an experience, we need access to your GPS.',
      });

      /* This request is infinite time and creating the overflow for App */
      GeoLocation.setRNConfiguration({ skipPermissionRequests: true });
      this.getUpdatedLocation();
      // this.watchID = GeoLocation.watchPosition(
      //   position => {
      //     this.getUpdatedLocation();
      //   },
      //   error => console.log('error', error),
      //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 0, distanceFilter: 1 }
      // );
    } catch (err) {
      console.warn(err);
    }
  };
  setComponentIsFocused = async () => {
    const { currentLocation } = this.state;
    this.map.animateToRegion({
      ...currentLocation,
      latitudeDelta: 0.00004,
      longitudeDelta: 0.00004,
    });
  };
  componentWillUnmount() {
    this.notificationListener();
    Linking.removeEventListener('url', this.handleOpenURL);
    this._unsubscribe.remove();
  }

  getUpdatedLocation = async () => {
    const location = await getUserCurrentLocation();
    if (location !== null && location.latitude && location.code !== 'UNAVAILABLE' && location.code !== 'CANCELLED') {
      const { markers } = this.props.explore;
      let alertMarkers = [];
      markers.map((item, index) => {
        const markerData = getValueFromObjectWithoutKey(item);
        if (markerData.type === 'alert') {
          alertMarkers.push(markerData);
          let isInAlertBuffer = this.checkUserLocation(location.latitude, location.longitude, markerData.fenceBuffer);
          if (isInAlertBuffer) {
            if (markerData.founder_uid !== this.props.auth.uid) {
              this.callSendAlert(markerData.parentID);
            }
          }
        }
      });
    }
  };

  checkUserLocation(latitude, longitude, fenceBuffer) {
    let polygon = [];
    fenceBuffer.coordinates[0].map((item, index) => {
      let obj = { lat: item[1], lng: item[0] };
      polygon.push(obj);
    });

    let point = {
      lat: latitude,
      lng: longitude,
    };

    try {
      if (geolib.isPointInPolygon(point, polygon)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  callSendAlert = parentID => {
    const { localSendAlert } = this.props.explore;
    if (localSendAlert && localSendAlert !== null) {
      let index = localSendAlert.findIndex(item => item.parentID === parentID);
      if (index === -1) {
        let obj = {
          token: this.props.auth.access_token,
          parentID: parentID,
          is_only_me: true,
          onSuccess: () => {
            let newArray = [];
            newArray = [...localSendAlert];
            newArray.push({ parentID: parentID });
            this.props.setLocalSendAlert(newArray);
          },
          onFail: () => {},
        };
        this.props.onSendAlert(obj);
      }
    }
  };

  scrollToTop = () => {
    if (this.refs && this.refs.scrollRef) {
      this.refs.scrollRef.scrollTo({ x: 0, y: 0, animated: false });
    }
  };
  onReceiveNotification = message => {
    if (
      (this.props.explore && this.props.explore.local && this.props.explore.local.length > 0) ||
      (this.props.explore && this.props.explore.feed && this.props.explore.feed.length > 0)
    ) {
      const { local, feed } = this.props.explore;
      let localArray = [...local];
      let feedArray = [...feed];
      let token = this.props.auth.access_token;
      let parentID = message._data.parent_id;
      let childID = message._data.child_id;
      let type = message._data.type;
      const { activeStation } = this.props.station;
      const { activeMemory } = this.props.memory;
      const { activeExperience } = this.props.experience;
      const { localSendAlert } = this.props.explore;

      let req = {
        token: this.props.auth.access_token,
        parentID: parentID,
      };

      if (type === 'event' && activeExperience !== null && activeExperience.parentID === parentID) {
        this.props.onGetPostEvent(req);
      } else if (type === 'station' && activeStation !== null && activeStation.parentID === parentID) {
        this.props.onGetStation(req);
      } else if (type === 'memory' && activeMemory !== null && activeMemory.parentID === parentID) {
        this.props.onGetMemory(req);
      } else if (type === 'invitation') {
        // this.props.navigation.navigate('ViewEvent', {
        //   parentID: parentID,
        //   childID: childID,
        // });
      } else if (
        type === 'alert' &&
        message._data.action &&
        (message._data.action === 'alerts' ||
          message._data.action === 'REMOVE_ALERT' ||
          message._data.action === 'ADD_ALERT')
      ) {
        const reqObj = {
          token: this.props.auth.access_token,
          onSuccess: async response => {
            const { data } = response;
            if (message._data.action === 'ADD_ALERT') {
              let location = await getUserCurrentLocation();
              if (location !== null) {
                data.map((item, index) => {
                  const markerData = getValueFromObjectWithoutKey(item);
                  if (markerData.parentID === parentID) {
                    let isInAlertBuffer = this.checkUserLocation(
                      location.latitude,
                      location.longitude,
                      markerData.fenceBuffer
                    );
                    if (isInAlertBuffer) {
                      if (markerData.founder_uid !== this.props.auth.uid) {
                        let obj = {
                          token: this.props.auth.access_token,
                          parentID: markerData.parentID,
                          is_only_me: true,
                          onSuccess: () => {
                            let newArray = [];
                            newArray = [...localSendAlert];
                            newArray.push({ parentID: markerData.parentID });
                            this.props.setLocalSendAlert(newArray);
                          },
                          onFail: () => {},
                        };
                        this.props.onSendAlert(obj);
                      }
                    }
                  }
                });
              }
            }
          },
        };
        this.props.onGetMarkers(reqObj);
      }

      const localIndex = localArray.findIndex(localItem => localItem.postID === parentID);
      const feedIndex = feedArray.findIndex(feedItem => feedItem.postID === parentID);

      if (localIndex === -1 && feedIndex === -1) {
      } else {
        let obj = {
          token: token,
          parentID: parentID,
          onSuccess: response => {
            if (response && response.length > 0) {
              let data = response[0];

              if (localIndex !== -1) {
                localArray[localIndex] = {
                  ...data,
                };
                let localObj = {
                  empty: true,
                  data: localArray,
                };
                this.props.setLocalSuccess(localObj);
              }

              if (feedIndex !== -1) {
                feedArray[feedIndex] = {
                  ...data,
                };
                let feedObj = {
                  empty: true,
                  data: feedArray,
                };
                this.props.setFeedSuccess(feedObj);
              }
            }
          },
          onFail: () => {},
        };
        this.props.onGetSelectedPost(obj);
      }
    }
  };

  onReceivePusherData = data => {
    if (data && data.original) {
      let postType = data.original.postType;
      if (postType === 'comment') {
        this.pusherCommentEvent(data.original);
      } else if (postType === 'delete_comment') {
        this.pusherDeleteCommentEvent(data.original);
      } else if (postType === 'like' || postType === 'unlike') {
        this.pusherLikeEvent(data.original);
      } else if (postType === 'media') {
        this.pusherMediaEvent(data.original);
      } else if (postType === 'delete_media') {
        this.pusherDeleteMediaEvent(data.original);
      } else if (postType === 'set_title') {
        this.pusherTitleMediaEvent(data.original);
      } else if (postType === 'defalut_media') {
        this.pusherDefaultMediaEvent(data.original);
      } else if (postType === 'end') {
        this.pusherEndEvent(data.original);
      } else if (postType === 'create') {
        this.pusherCreateEvent(data.original);
      } else if (postType === 'event_invitation') {
        this.pusherEventInvitation(data.original);
      } else if (postType === 'remove_experience') {
        this.pusherDeleteExperience(data.original);
      } else if (postType === 'block_event_user') {
        this.pusherBlockEventUser(data.original);
      } else if (postType === 'remove_guest') {
        this.pusherRemoveGuest(data.original);
      } else if (postType === 'follow_request') {
        this.pusherFollowRequest(data.original);
      }
    }
  };

  pusherCommentEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let experienceData, updateData;
    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }
    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { trending, my_experience, other_experience } = experienceData;
      let newTrendingArray = [];
      let newMyExperienceArray = [];
      let newOtherExperienceArray = [];
      if (trending && trending.length > 0) {
        newTrendingArray = [...trending];
        let mediaIndex = newTrendingArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newTrendingArray[mediaIndex] = {
            ...newTrendingArray[mediaIndex],
            comments: [...newTrendingArray[mediaIndex].comments, ...data.comments],
          };
        }
      }

      if (my_experience && my_experience.length > 0) {
        newMyExperienceArray = [...my_experience];
        let mediaIndex = newMyExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newMyExperienceArray[mediaIndex] = {
            ...newMyExperienceArray[mediaIndex],
            comments: [...newMyExperienceArray[mediaIndex].comments, ...data.comments],
          };
        }
      }

      if (other_experience && other_experience.length > 0) {
        newOtherExperienceArray = [...other_experience];
        let mediaIndex = newOtherExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newOtherExperienceArray[mediaIndex] = {
            ...newOtherExperienceArray[mediaIndex],
            comments: [...newOtherExperienceArray[mediaIndex].comments, ...data.comments],
          };
        }
      }

      let updatedObj = {
        ...experienceData,
        trending: newTrendingArray,
        my_experience: newMyExperienceArray,
        other_experience: newOtherExperienceArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
        if (data.user_id !== this.props.auth.uid) {
          this.showToast(data);
        }
      }

      const { feed, local } = this.props.explore;
      if (local && local.length > 0) {
        let localArray = [...local];
        let localIndex = localArray.findIndex(item => item.postID === data.parentID);
        if (localIndex !== -1) {
          localArray[localIndex] = {
            ...localArray[localIndex],
            comment_count: data.total_comments,
          };
        }
        let localObj = {
          empty: true,
          data: localArray,
        };
        this.props.setLocalSuccess(localObj);
      }

      if (feed && feed.length > 0) {
        let feedArray = [...feed];
        let feedIndex = feedArray.findIndex(item => item.postID === data.parentID);
        if (feedIndex !== -1) {
          feedArray[feedIndex] = {
            ...feedArray[feedIndex],
            comment_count: data.total_comments,
          };
        }
        let feedObj = {
          empty: true,
          data: feedArray,
        };
        this.props.setFeedSuccess(feedObj);
      }

      const profileData = this.props.profileData;
      if (profileData && profileData.data && profileData.data.length > 0) {
        let dataArray = [...profileData.data];
        let dataIndex = dataArray.findIndex(item => item.postID === data.parentID);
        if (dataIndex !== -1) {
          dataArray[dataIndex] = {
            ...dataArray[dataIndex],
            comment_count: data.total_comments,
          };
        }
        let profileObj = {
          ...profileData,
          data: dataArray,
        };
        this.props.setProfileData(profileObj);
      }
    }

    if (data.user_id !== this.props.auth.uid) {
      this.addBadgeCount();
    }
  };

  pusherDeleteCommentEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let commentID = data.commentID;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { trending, my_experience, other_experience } = experienceData;
      let newTrendingArray = [];
      let newMyExperienceArray = [];
      let newOtherExperienceArray = [];

      if (trending && trending.length > 0) {
        newTrendingArray = [...trending];
        let mediaIndex = newTrendingArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          let oldComments = [...newTrendingArray[mediaIndex].comments];
          if (oldComments && oldComments.length > 0) {
            let oldCommentIndex = oldComments.findIndex(item => item.id === commentID);
            if (oldCommentIndex !== -1) {
              oldComments.splice(oldCommentIndex, 1);
            }
          }
          newTrendingArray[mediaIndex] = {
            ...newTrendingArray[mediaIndex],
            comments: oldComments,
          };
        }
      }

      if (my_experience && my_experience.length > 0) {
        newMyExperienceArray = [...my_experience];
        let mediaIndex = newMyExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          let oldComments = [...newMyExperienceArray[mediaIndex].comments];
          if (oldComments && oldComments.length > 0) {
            let oldCommentIndex = oldComments.findIndex(item => item.id === commentID);
            if (oldCommentIndex !== -1) {
              oldComments.splice(oldCommentIndex, 1);
            }
          }
          newMyExperienceArray[mediaIndex] = {
            ...newMyExperienceArray[mediaIndex],
            comments: oldComments,
          };
        }
      }

      if (other_experience && other_experience.length > 0) {
        newOtherExperienceArray = [...other_experience];
        let mediaIndex = newOtherExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          let oldComments = [...newOtherExperienceArray[mediaIndex].comments];
          if (oldComments && oldComments.length > 0) {
            let oldCommentIndex = oldComments.findIndex(item => item.id === commentID);
            if (oldCommentIndex !== -1) {
              oldComments.splice(oldCommentIndex, 1);
            }
          }

          newOtherExperienceArray[mediaIndex] = {
            ...newOtherExperienceArray[mediaIndex],
            comments: oldComments,
          };
        }
      }

      let updatedObj = {
        ...experienceData,
        trending: newTrendingArray,
        my_experience: newMyExperienceArray,
        other_experience: newOtherExperienceArray,
      };

      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }

      const { feed, local } = this.props.explore;
      if (local && local.length > 0) {
        let localArray = [...local];
        let localIndex = localArray.findIndex(item => item.postID === data.parentID);
        if (localIndex !== -1) {
          localArray[localIndex] = {
            ...localArray[localIndex],
            comment_count: data.total_comments,
          };
        }
        let localObj = {
          empty: true,
          data: localArray,
        };
        this.props.setLocalSuccess(localObj);
      }
      if (feed && feed.length > 0) {
        let feedArray = [...feed];
        let feedIndex = feedArray.findIndex(item => item.postID === data.parentID);
        if (feedIndex !== -1) {
          feedArray[feedIndex] = {
            ...feedArray[feedIndex],
            comment_count: data.total_comments,
          };
        }
        let feedObj = {
          empty: true,
          data: feedArray,
        };
        this.props.setFeedSuccess(feedObj);
      }

      const profileData = this.props.profileData;
      if (profileData && profileData.data && profileData.data.length > 0) {
        let dataArray = [...profileData.data];
        let dataIndex = dataArray.findIndex(item => item.postID === data.parentID);
        if (dataIndex !== -1) {
          dataArray[dataIndex] = {
            ...dataArray[dataIndex],
            comment_count: data.total_comments,
          };
        }
        let profileObj = {
          ...profileData,
          data: dataArray,
        };
        this.props.setProfileData(profileObj);
      }
    }
  };

  pusherLikeEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { trending, my_experience, other_experience } = experienceData;

      let newTrendingArray = [];
      let newMyExperienceArray = [];
      let newOtherExperienceArray = [];
      if (trending && trending.length > 0) {
        newTrendingArray = [...trending];
        let mediaIndex = newTrendingArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newTrendingArray[mediaIndex] = {
            ...newTrendingArray[mediaIndex],
            likes: data.likes,
          };
        }
      }

      if (my_experience && my_experience.length > 0) {
        newMyExperienceArray = [...my_experience];
        let mediaIndex = newMyExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newMyExperienceArray[mediaIndex] = {
            ...newMyExperienceArray[mediaIndex],
            likes: data.likes,
          };
        }
      }

      if (other_experience && other_experience.length > 0) {
        newOtherExperienceArray = [...other_experience];
        let mediaIndex = newOtherExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newOtherExperienceArray[mediaIndex] = {
            ...newOtherExperienceArray[mediaIndex],
            likes: data.likes,
          };
        }
      }

      let updatedObj = {
        ...experienceData,
        trending: newTrendingArray,
        my_experience: newMyExperienceArray,
        other_experience: newOtherExperienceArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
        if (data.user_id !== this.props.auth.uid) {
          this.showToast(data);
        }
      }

      const profileData = this.props.profileData;
      if (profileData && profileData.data && profileData.data.length > 0) {
        let dataArray = [...profileData.data];
        let dataIndex = dataArray.findIndex(item => item.postID === data.parentID);
        if (dataIndex !== -1) {
          dataArray[dataIndex] = {
            ...dataArray[dataIndex],
            like_count: data.total_likes,
          };
        }
        let profileObj = {
          ...profileData,
          data: dataArray,
        };
        this.props.setProfileData(profileObj);
      }
    }

    const { feed, local } = this.props.explore;
    if (local && local.length > 0) {
      let localArray = [...local];
      let localIndex = localArray.findIndex(item => item.postID === data.parentID);
      if (localIndex !== -1) {
        localArray[localIndex] = {
          ...localArray[localIndex],
          like_count: data.total_likes,
        };
      }
      let localObj = {
        empty: true,
        data: localArray,
      };
      this.props.setLocalSuccess(localObj);
    }

    if (feed && feed.length > 0) {
      let feedArray = [...feed];
      let feedIndex = feedArray.findIndex(item => item.postID === data.parentID);
      if (feedIndex !== -1) {
        feedArray[feedIndex] = {
          ...feedArray[feedIndex],
          like_count: data.total_likes,
        };
      }
      let feedObj = {
        empty: true,
        data: feedArray,
      };
      this.props.setFeedSuccess(feedObj);
    }

    if (this.props.explore.data && this.props.explore.data.length > 0) {
      const trendingArray = [...this.props.explore.data];
      let index = trendingArray.findIndex(item => item.postID === data.parentID);
      if (index !== -1) {
        trendingArray[index] = {
          ...trendingArray[index],
          like_count: data.total_likes,
        };
      }
      let trendObj = {
        data: trendingArray,
      };
      this.props.setTrendingData(trendObj);
    }

    if (data.user_id !== this.props.auth.uid) {
      this.addBadgeCount();
    }
  };

  pusherMediaEvent = data => {
    let type = data.type;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { my_experience, trending, other_experience } = experienceData;
      if (my_experience) {
        let newArray = [...[data.media], ...my_experience];
        let updatedObj;
        if (data.media && data.media.userId && data.media.userId === this.props.auth.uid) {
          if (trending && trending.length < 15) {
            let trndIndex = trending.findIndex(item => item.mediaId === data.mediaID);
            let myexpIndex = my_experience.findIndex(item => item.mediaId === data.mediaID);
            if (trndIndex === -1 && myexpIndex === -1) {
              updatedObj = {
                ...experienceData,
                trending: [...[data.media], ...trending],
                my_experience: newArray,
              };
            }
          } else {
            let myexpIndex = my_experience.findIndex(item => item.mediaId === data.mediaID);
            if (myexpIndex === -1) {
              updatedObj = {
                ...experienceData,
                my_experience: newArray,
              };
            }
          }
        } else {
          if (trending && trending.length < 15) {
            let trndIndex = trending.findIndex(item => item.mediaId === data.mediaID);
            let otherIndex = other_experience.findIndex(item => item.mediaId === data.mediaID);
            if (trndIndex === -1 && otherIndex === -1) {
              updatedObj = {
                ...experienceData,
                trending: [...[data.media], ...trending],
                other_experience: [...[data.media], ...other_experience],
              };
            }
          } else if (other_experience) {
            let otherIndex = other_experience.findIndex(item => item.mediaId === data.mediaID);
            if (otherIndex === -1) {
              updatedObj = {
                ...experienceData,
                other_experience: [...[data.media], ...other_experience],
              };
            }
          }
        }
        if (updatedObj !== null && updatedObj !== undefined) {
          updateData([updatedObj]);
          this.showToast(data);
        }
      }
    }
  };

  pusherDeleteMediaEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { trending, my_experience, other_experience } = experienceData;
      let newTrendingArray = [];
      let newMyExperienceArray = [];
      let newOtherExperienceArray = [];

      if (trending && trending.length > 0) {
        newTrendingArray = [...trending];
        let mediaIndex = newTrendingArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newTrendingArray.splice(mediaIndex, 1);
        }
      }

      if (my_experience && my_experience.length > 0) {
        newMyExperienceArray = [...my_experience];
        let mediaIndex = newMyExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newMyExperienceArray.splice(mediaIndex, 1);
        }
      }

      if (other_experience && other_experience.length > 0) {
        newOtherExperienceArray = [...other_experience];
        let mediaIndex = newOtherExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newOtherExperienceArray.splice(mediaIndex, 1);
        }
      }

      let updatedObj = {
        ...experienceData,
        trending: newTrendingArray,
        my_experience: newMyExperienceArray,
        other_experience: newOtherExperienceArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
        this.showToast(data);
      }
    }
  };

  pusherTitleMediaEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { trending, my_experience, other_experience } = experienceData;
      let newTrendingArray = [];
      let newMyExperienceArray = [];
      let newOtherExperienceArray = [];

      if (trending && trending.length > 0) {
        newTrendingArray = [...trending];
        let mediaIndex = newTrendingArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newTrendingArray[mediaIndex] = {
            ...newTrendingArray[mediaIndex],
            title: data.title,
          };
        }
      }

      if (my_experience && my_experience.length > 0) {
        newMyExperienceArray = [...my_experience];
        let mediaIndex = newMyExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newMyExperienceArray[mediaIndex] = {
            ...newMyExperienceArray[mediaIndex],
            title: data.title,
          };
        }
      }

      if (other_experience && other_experience.length > 0) {
        newOtherExperienceArray = [...other_experience];
        let mediaIndex = newOtherExperienceArray.findIndex(item => item.mediaId === mediaID);
        if (mediaIndex !== -1) {
          newOtherExperienceArray[mediaIndex] = {
            ...newOtherExperienceArray[mediaIndex],
            title: data.title,
          };
        }
      }

      let updatedObj = {
        ...experienceData,
        trending: newTrendingArray,
        my_experience: newMyExperienceArray,
        other_experience: newOtherExperienceArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }
    }
  };

  pusherDefaultMediaEvent = data => {
    let type = data.type;
    let mediaID = data.mediaID;
    let experienceData, updateData;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (experienceData && experienceData !== null && updateData !== null && data.parentID === experienceData.parentID) {
      const { my_experience } = experienceData;
      if (my_experience && my_experience.length > 0) {
        let newArray = [];
        my_experience.map((item, index) => {
          if (item.mediaId === mediaID) {
            newArray.push({
              ...item,
              is_default: 1,
            });
          } else {
            newArray.push({
              ...item,
              is_default: 0,
            });
          }
        });
        let updatedObj = {
          ...experienceData,
          my_experience: newArray,
        };
        if (updatedObj !== null && updatedObj !== undefined) {
          updateData([updatedObj]);
        }
      }
    }
  };

  pusherEndEvent = data => {
    let type = data.type;
    let parentID = data.parentPostID;
    let experienceData, updateData;

    if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    } else if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    }

    if (experienceData && experienceData !== null && parentID === experienceData.parentID) {
      let updatedObj = {
        ...experienceData,
        is_deleted: 1,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }
    }

    if (this.props.explore) {
      const { markers, amazings, feed, local } = this.props.explore;
      let newArray = [];
      let expArray = [];
      let feedArray = [];
      let localArray = [];
      if (markers && markers.length > 0) {
        markers.map((item, index) => {
          if (parentID == Object.keys(item)[0]) {
          } else {
            newArray.push(item);
          }
        });
        this.props.getMarkersSuccess({ data: newArray });
      }
      if (amazings && amazings.length > 0) {
        expArray = [...amazings];
        let index = expArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          expArray.splice(index, 1);
        }
        this.props.getAmazingsSuccess({ data: expArray });
      }

      if (feed && feed.length > 0) {
        feedArray = [...feed];
        let index = feedArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          feedArray[index] = {
            ...feedArray[index],
            is_deleted: 1,
          };
        }
        let feedObj = {
          empty: true,
          data: feedArray,
        };
        this.props.setFeedSuccess(feedObj);
      }
      if (local && local.length > 0) {
        localArray = [...local];
        let index = localArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          localArray[index] = {
            ...localArray[index],
            is_deleted: 1,
          };
        }
        let localObj = {
          empty: true,
          data: localArray,
        };
        this.props.setLocalSuccess(localObj);
      }
    }
  };

  pusherDeleteExperience = data => {
    let type = data.type;
    let parentID = data.parentPostID;
    let experienceData, updateData;

    if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    } else if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    }

    if (experienceData && experienceData !== null && parentID === experienceData.parentID) {
      let updatedObj = {
        ...experienceData,
        is_deleted: 1,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }
    }

    if (this.props.explore) {
      const { markers, amazings, feed, local, data } = this.props.explore;
      let newArray = [];
      let expArray = [];
      let feedArray = [];
      let localArray = [];
      let trendingArray = [];
      if (markers && markers.length > 0) {
        markers.map((item, index) => {
          if (parentID == Object.keys(item)[0]) {
          } else {
            newArray.push(item);
          }
        });
        this.props.getMarkersSuccess({ data: newArray });
      }
      if (amazings && amazings.length > 0) {
        expArray = [...amazings];
        let index = expArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          expArray.splice(index, 1);
        }
        this.props.getAmazingsSuccess({ data: expArray });
      }
      if (feed && feed.length > 0) {
        feedArray = [...feed];
        let index = feedArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          feedArray.splice(index, 1);
        }
        let feedObj = {
          empty: true,
          data: feedArray,
        };
        this.props.setFeedSuccess(feedObj);
      }
      if (local && local.length > 0) {
        localArray = [...local];
        let index = localArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          localArray.splice(index, 1);
        }
        let localObj = {
          empty: true,
          data: localArray,
        };
        this.props.setLocalSuccess(localObj);
      }
      if (data && data.length > 0) {
        trendingArray = [...data];
        let index = trendingArray.findIndex(item => item.postID === parentID);
        if (index !== -1) {
          trendingArray.splice(index, 1);
        }
        let trendObj = {
          data: trendingArray,
        };
        this.props.setTrendingData(trendObj);
      }
    }
  };

  pusherCreateEvent = data => {
    let expObject = data.data;
    let parentID = data.data.parentID;

    if (this.props.explore) {
      const { markers } = this.props.explore;
      let newArray = [...markers];
      newArray.push({
        [parentID]: {
          ...expObject,
        },
      });
      this.props.getMarkersSuccess({ data: newArray });
    }
  };

  pusherEventInvitation = data => {
    if (data.id === this.props.auth.uid) {
      this.addBadgeCount();
    }
  };

  pusherBlockEventUser = data => {
    let type = data.type;
    let experienceData, updateData;
    let blockUserID = data.block_user_id;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (
      experienceData &&
      experienceData !== null &&
      updateData !== null &&
      data.parentPostID === experienceData.parentID
    ) {
      const { people_may_know, Others, is_blocked } = experienceData;
      let peopleDataArray = [];
      let otherDataArray = [];
      let isblocked = is_blocked;

      if (people_may_know && people_may_know.length > 0) {
        peopleDataArray = [...people_may_know];
        let index = peopleDataArray.findIndex(item => item.userID === blockUserID);
        if (index !== -1) {
          peopleDataArray[index] = {
            ...peopleDataArray[index],
            is_blocked: !peopleDataArray[index].is_blocked,
          };
        }
      }

      if (Others && Others.length > 0) {
        otherDataArray = [...Others];
        let index = otherDataArray.findIndex(item => item.userID === blockUserID);
        if (index !== -1) {
          otherDataArray[index] = {
            ...otherDataArray[index],
            is_blocked: !otherDataArray[index].is_blocked,
          };
        }
      }
      if (this.props.auth.uid === blockUserID) {
        isblocked = !isblocked;
      }

      let updatedObj = {
        ...experienceData,
        is_blocked: isblocked,
        people_may_know: peopleDataArray,
        Others: otherDataArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }
    }
  };
  pusherRemoveGuest = data => {
    let type = data.type;
    let experienceData, updateData;
    let guestID = data.guest_id;

    if (type === 'memory') {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        experienceData = this.props.memory_data[0];
        updateData = this.props.getMemorySuccess;
      }
    } else if (type === 'event') {
      if (this.props.event_data && this.props.event_data.length > 0) {
        experienceData = this.props.event_data[0];
        updateData = this.props.getEventSuccess;
      }
    } else if (type === 'station') {
      if (this.props.station_data && this.props.station_data.length > 0) {
        experienceData = this.props.station_data[0];
        updateData = this.props.getStationSuccess;
      }
    }

    if (
      experienceData &&
      experienceData !== null &&
      updateData !== null &&
      data.parentPostID === experienceData.parentID
    ) {
      const { people_may_know, Others } = experienceData;
      let peopleDataArray = [];
      let otherDataArray = [];

      if (people_may_know && people_may_know.length > 0) {
        peopleDataArray = [...people_may_know];
        let index = peopleDataArray.findIndex(item => item.userID === guestID);
        if (index !== -1) {
          peopleDataArray.splice(index, 1);
        }
      }

      if (Others && Others.length > 0) {
        otherDataArray = [...Others];
        let index = otherDataArray.findIndex(item => item.userID === guestID);
        if (index !== -1) {
          otherDataArray.splice(index, 1);
        }
      }
      if (this.props.auth.uid === guestID) {
        Alert.alert(
          'Tellascape',
          'You are removed for this event by Host, so you are not able to continue upload your experience.',
          [
            {
              text: 'Okay',
              onPress: () => {
                const eventObj = new FormData();
                eventObj.append('token', this.props.auth.access_token);
                // obj.append('_method', 'PUT');
                eventObj.append('parentID', experienceData.parentID);
                eventObj.append('childID', experienceData.child_ID);

                let obj = {
                  formData: eventObj,
                  leaveEventSuccess: () => {},
                  leaveEventFailure: () => {},
                };
                this.props.onLeaveEvent(obj);
                this.props.setActiveExperience(null);
                this.props.setLocalExperience([]);
                this.props.navigation.popToTop();
              },
            },
          ],
          { cancelable: false }
        );
      }

      let updatedObj = {
        ...experienceData,
        people_may_know: peopleDataArray,
        Others: otherDataArray,
      };
      if (updatedObj !== null && updatedObj !== undefined) {
        updateData([updatedObj]);
      }
    }
  };

  pusherFollowRequest = data => {
    let receiver = data.receiver;
    let sender = data.sender;
    let loginUid = this.props.auth.uid;
    let action = data.action;
    if (data.message && receiver === loginUid) {
      this.showMessageToast(data.message);
      this.addBadgeCount();
    }
    if (loginUid === receiver && action === 'rejected') {
      if (this.props.profileData && this.props.profileData !== null) {
        const { profile } = this.props.profileData;
        let requestList = [...profile.follower_request];
        if (requestList && requestList !== null && requestList.length > 0) {
          let index = requestList.findIndex(item => item.uid === receiver);
          if (index !== -1) {
            requestList.splice(index, 1);
          }
          let updatedData = {
            ...this.props.profileData,
            profile: {
              ...profile,
              follower_request: requestList,
            },
          };
          if (updatedData && updatedData !== undefined && updatedData !== null) {
            this.props.setProfileData(updatedData);
          }
        }
      }
    }
    if (loginUid === receiver && action === 'accepted') {
      if (this.props.profileData && this.props.profileData !== null) {
        const { followers, profile } = this.props.profileData;
        if (profile && profile.uid === sender) {
          let newArray = [...followers];
          if (newArray && newArray.length > 0) {
            newArray.push(data.follow);
          }
          let updatedData = {
            ...this.props.profileData,
            followers: newArray,
            profile: {
              ...profile,
              follower: newArray.length,
            },
          };
          if (updatedData && updatedData !== undefined && updatedData !== null) {
            this.props.setProfileData(updatedData);
          }
        }
      }
    }
    if (loginUid === sender || loginUid === receiver) {
      const obj = {
        token: this.props.auth.access_token,
      };
      this.props.onGetNotification(obj);
    }
  };

  addBadgeCount = () => {
    const { badgeCount } = this.props.notification;
    let count = badgeCount + 1;
    this.props.setBadgeCount(count);
  };

  showToast = data => {
    if (data && data.message && data.message !== null && data.message !== '') {
      if (data.user_id && data.user_id !== this.props.auth.uid) {
        // Toast.showWithGravity(data.message, 2, Toast.TOP);
      }
    }
  };
  showMessageToast = msg => {
    // Toast.showWithGravity(msg, 2, Toast.TOP);
  };

  // handle firebase dynamic link
  handleOpenURL = ({ url: incomingUrl }) => {
    console.log({ incomingUrl });
    if (!incomingUrl) {
      return;
    } else if (incomingUrl.includes('.page.link')) {
      // handles incoming url when app is opened
      this.nativeModule.parseDynamicLink(
        incomingUrl,
        (parsedUrl) => {
          console.log('Dynamic Link from foreground: ', parsedUrl);
          this.handleDynamicLink(decodeURIComponent(parsedUrl));
        },
        e => {
          console.log({ error: e });
        }
      );
    } else {
      this.navigate(incomingUrl);
    }
  };

  navigate = async url => {
    const route = url.replace(/.*?:\/\//g, '');
    const params = route.split('/');
    const routeName = params[0];
    const parent_id = params[1];
    const child_id = params[2];
    const media_id = params[3];
    console.log({ parent_id, child_id, routeName, media_id });
    if (routeName === 'ViewEvent' || routeName === 'PostEvent' || routeName === 'LiveEvent') {
      const { current } = this.props.experience;
      current?.length &&
        (current.parentID || current[0].parentID) &&
        this.props.navigation.navigate(routeName, {
          parentID: parent_id,
          childID: child_id,
          route_type: 'share',
          mediaID: media_id,
        });
    } else if (routeName === 'PostStation' || routeName === 'LiveStation') {
      let isJoin = await isJoinedStation(this.props.navigation, this.props.station, parent_id, child_id);
      if (!isJoin) {
        this.props.navigation.navigate(routeName, {
          parentID: parent_id,
          childID: child_id,
          route_type: 'share',
          mediaID: media_id,
        });
      }
    } else if (routeName === 'PostMemory' || routeName === 'LiveMemory') {
      let isJoin = await isJoinedMemory(this.props.navigation, this.props.memory, parent_id, child_id);
      if (!isJoin) {
        this.props.navigation.navigate(routeName, {
          parentID: parent_id,
          childID: child_id,
          route_type: 'share',
          mediaID: media_id,
        });
      }
    } else if (routeName === 'alert') {
      this.props.navigation.navigate('Explore', { routeData: { parent_id: parent_id } });
    } else if (routeName === 'explore') {
      this.props.navigation.navigate('Explore', { routeData: { parent_id: parent_id } });
    }
  };

  onSelect = option => {
    this.setState({
      selected: option,
    });
  };

  showMenu = () => {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };

  renderImage = data => {
    let arr = [];
    data.map(item => {
      arr.push({
        uri: item.iUrl,
        dimensions: {
          width: 1080,
          height: 1920,
        },
      });
    });
    return arr;
  };

  onChangeShowAllEvent = () => {
    this.setState({
      isShowAllEvents: !this.state.isShowAllEvents,
    });
  };

  onChangeShowAllStation = () => {
    this.setState({
      isShowAllStations: !this.state.isShowAllStations,
    });
  };

  onChangeShowAllMemory = () => {
    this.setState({
      isShowAllMemories: !this.state.isShowAllMemories,
    });
  };

  onEventPress = async item => {
    if (item.type === 'event') {
      this.props.setEventLoad(false);
      let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, item.postID, item.childID);
      if (!isJoin) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let sDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
        let eDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
        if (now > eDate || item.is_deleted === 1) {
          // Post Event
          this.props.navigation.navigate('PostEvent', {
            parentID: item.postID,
            childID: item.childID,
          });
        } else if (now > sDate && now < eDate) {
          // Live Event
          this.props.navigation.navigate('LiveEvent', {
            parentID: item.postID,
            childID: item.childID,
          });
        } else {
          // View EVent
          this.props.navigation.navigate('ViewEvent', {
            parentID: item.postID,
            childID: item.childID,
          });
        }
      }
    } else if (item.type === 'station') {
      this.props.setStationLoad(false);
      let isJoin = await isJoinedStation(this.props.navigation, this.props.station, item.postID, item.childID);
      if (!isJoin) {
        if (item.is_deleted === 1) {
          this.props.navigation.navigate('PostStation', {
            parentID: item.postID,
            childID: item.childID,
          });
        } else {
          this.props.navigation.navigate('LiveStation', {
            parentID: item.postID,
            childID: item.childID,
          });
        }
      }
    } else if (item.type === 'memory') {
      this.props.setMemoryLoad(false);
      let isJoin = await isJoinedMemory(this.props.navigation, this.props.memory, item.postID, item.childID);
      if (!isJoin) {
        if (item.is_deleted === 1) {
          this.props.navigation.navigate('PostMemory', {
            parentID: item.postID,
            childID: item.childID,
          });
        } else {
          this.props.navigation.navigate('LiveMemory', {
            parentID: item.postID,
            childID: item.childID,
          });
        }
      }
    }
  };

  onRefresh = () => {
    this.setState({ isRefresh: true });
    let obj = {
      onSuccess: () => this.setState({ isRefresh: false }),
      onFail: () => this.setState({ isRefresh: false }),
    };
    this.props.onGetTrending(obj);
  };

  onPressLike = async item => {
    const { type, media, postID, childID } = item;
    let onLikeApi = this.props.onLikeEvent;
    if (type === 'station') {
      onLikeApi = this.props.onLikeStation;
    } else if (type === 'memory') {
      onLikeApi = this.props.onLikeMemory;
    }
    let location = await getUserCurrentLocation();
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('parentID', postID);
    obj.append('childID', childID);
    obj.append('mediaID', media);
    let likeObj = {
      formData: obj,
      location: location,
      onSuccess: response => {},
      onFailure: () => {},
    };
    onLikeApi(likeObj);
  };

  render = () => {
    let filteredData, imageInfos;
    let eventData = [];
    let stationData = [];
    let memoryData = [];
    if (this.props.explore.data) {
      let allData = this.props.explore.data;
      eventData =
        allData &&
        allData.filter(event => {
          return event.type === 'event';
        });
      stationData =
        allData &&
        allData.filter(event => {
          return event.type === 'station';
        });

      memoryData =
        allData &&
        allData.filter(event => {
          return event.type === 'memory';
        });

      imageInfos =
        filteredData &&
        filteredData.map(item => ({
          id: uuid.v4(),
          parentID: item.postID,
          childID: item.childID,
          url: item.iUrl,
          width: item.width,
          height: item.height,
          ratio: item.width / item.height,
          size: item.width * item.height,
          type: item.type,
          sDate: item.sDate,
          eDate: item.eDate,
          is_deleted: item.is_deleted,
        }));
    }
    const { isShowAllEvents, isShowAllStations, isShowAllMemories, isRefresh } = this.state;
    const { currentLocation } = this.state;
    return (
      <ScrollView
        ref={'scrollRef'}
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={() => {
              this.onRefresh();
            }}
          />
        }
      >
        <StyledMapContainer>
          <MapView
            provider={PROVIDER_GOOGLE}
            // showsUserLocation={true}
            style={styles.map}
            mapType={'standard'}
            customMapStyle={mapStyle}
            maxZoomLevel={3.2}
            minZoomLevel={3}
            ref={map => {
              this.map = map;
            }}
            // initialRegion={{
            //   latitude: 40.611884,
            //   longitude: -99.532927,
            //   latitudeDelta: 0.00004,
            //   longitudeDelta: 0.00004,
            // }}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: 0.00004,
              longitudeDelta: 0.00004,
            }}
          >
            {this.props.explore.data && this.props.explore.data.length > 0 && (
              <MapView.Heatmap
                points={
                  this.props.explore.data &&
                  this.props.explore.data.map(item => ({
                    latitude: item.lat,
                    longitude: item.lng,
                    weight: Math.random() * 100,
                  }))
                }
                gradient={{
                  colors: ['#8FB0F2', '#A8F4B5', '#F6FA68', '#E0C557', '#C53733'],
                  startPoints: [0.01, 0.24, 0.48, 0.72, 0.96],
                  colorMapSize: 500,
                }}
                heatmapMode={'POINTS_WEIGHT'}
                maxIntensity={100}
                gradientSmoothing={10}
                radius={20}
                opacity={0.8}
              />
            )}
          </MapView>
        </StyledMapContainer>

        {eventData.length > 0 && (
          <TrendingCarousel
            status={isShowAllEvents}
            onChangeStatus={this.onChangeShowAllEvent}
            eventType={'event'}
            data={eventData}
            onEventPress={this.onEventPress}
            onPressAvatar={uID => {
              if (uID !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: uID });
              }
            }}
            onPressLike={item => this.onPressLike(item)}
          />
        )}
        {stationData.length > 0 && (
          <TrendingCarousel
            onChangeStatus={this.onChangeShowAllStation}
            status={isShowAllStations}
            eventType={'station'}
            data={stationData}
            onEventPress={this.onEventPress}
            onPressAvatar={uID => {
              if (uID !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: uID });
              }
            }}
            onPressLike={item => this.onPressLike(item)}
          />
        )}
        {memoryData.length > 0 && (
          <TrendingCarousel
            onChangeStatus={this.onChangeShowAllMemory}
            status={isShowAllMemories}
            eventType={'memory'}
            data={memoryData}
            onEventPress={this.onEventPress}
            onPressAvatar={uID => {
              if (uID !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: uID });
              }
            }}
            onPressLike={item => this.onPressLike(item)}
          />
        )}

        {/* <StyledTrendingExperienceWrapper>
          <StyledText fontSize={hp('2.2%')} fontWeight={'600'} fontFamily={font.MSemiBold} color={'rgb(40, 40, 40)'}>
            Trending Experiences
          </StyledText>
          <Filter onSelect={this.onSelect} selected={this.state.selected} />
        </StyledTrendingExperienceWrapper>

        {filteredData && filteredData.length === 0 ? (
          <View style={styles.notFoundWrapper}>
            <Text style={styles.notFoundText}>No experience found</Text>
          </View>
        ) : (
          <StyledPhotoContainer>
            <ImageGrid data={imageInfos} experience={this.props.experience} navigation={this.props.navigation} />
          </StyledPhotoContainer>
        )} */}
      </ScrollView>
    );
  };
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    explore: state.explore,
    photo: state.auth.photo,
    station: state.station,
    memory: state.memory,
    memory_data: state.memory.memory_data,
    event_data: state.experience.event_data,
    station_data: state.station.station_data,
    notification: state.notification,
    profileData: state.experience.profileData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetFriends: obj => {
      dispatch(ExploreAction.getFriends(obj));
    },
    onGetTrending: obj => {
      dispatch(ExploreAction.getTrendingRequest(obj));
    },
    onGetMarkers: obj => {
      dispatch(ExploreAction.getMarkersRequest(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    onGetSelectedPost: obj => {
      dispatch(ExploreAction.getSelectedPostRequest(obj));
    },
    setLocalSuccess: obj => {
      dispatch(ExploreAction.getLocalSuccess(obj));
    },
    setFeedSuccess: obj => {
      dispatch(ExploreAction.getFeedSuccess(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    onGetMemory: obj => {
      dispatch(MemoryActions.getMemory(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    onGetStation: obj => {
      dispatch(StationActions.getStation(obj));
    },
    onGetPostEvent: obj => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    setLocalStation: obj => {
      dispatch(StationActions.setLocalStation(obj));
    },
    setLocalMemory: obj => {
      dispatch(MemoryActions.setLocalMemory(obj));
    },
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    setLocalSendAlert: obj => {
      dispatch(ExploreAction.setLocalSendAlert(obj));
    },
    onSendAlert: obj => {
      dispatch(AlertActions.sendAlert(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    getMemorySuccess: obj => {
      dispatch(MemoryActions.getMemorySuccess(obj));
    },
    getStationSuccess: obj => {
      dispatch(StationActions.getStationSuccess(obj));
    },
    getEventSuccess: obj => {
      dispatch(ExperienceActions.getPostEventSuccess(obj));
    },
    getMarkersSuccess: obj => {
      dispatch(ExploreAction.getMarkersSuccess(obj));
    },
    getAmazingsSuccess: obj => {
      dispatch(ExploreAction.getAmazingsSuccess(obj));
    },
    setBadgeCount: obj => {
      dispatch(NotificationAction.setBadgeCount(obj));
    },
    setTrendingData: obj => {
      dispatch(ExploreAction.getTrendingSuccess(obj));
    },
    onLeaveEvent: obj => {
      dispatch(ExperienceActions.leaveEvent(obj));
    },
    setActiveExperience: obj => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    onGetNotification: obj => {
      dispatch(NotificationAction.notification(obj));
    },
    setProfileData: obj => {
      dispatch(ExperienceActions.setPusherProfileData(obj));
    },
    onGetLocal: obj => {
      dispatch(ExploreAction.getLocalRequest(obj));
    },
    onLikeStation: obj => {
      dispatch(StationActions.likeStation(obj));
    },
    onLikeMemory: obj => {
      dispatch(MemoryActions.likeMemory(obj));
    },
    onLikeEvent: obj => {
      dispatch(ExperienceActions.likeEvent(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trending);

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#e8e8e8',
    flexGrow: 1,
    paddingBottom: 35,
  },
  imageContainer: {
    borderRadius: 23,
    padding: wp('1.8%'),
    backgroundColor: '#e8e8e8',
  },
  container: {
    height: MAP_CONTAINER_HEIGHT,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  createEventText: {
    padding: 10,
  },
  listStyle: {
    marginTop: 10,
  },
  notFoundWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  notFoundText: {
    alignSelf: 'center',
    fontSize: wp('5%'),
  },
});
