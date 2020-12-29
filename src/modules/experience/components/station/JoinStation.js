import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Share,
  Animated,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image as RNImage,
  Platform,
  Modal as RNModal,
  PermissionsAndroid,
} from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { database } from 'react-native-firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
const moment = require('moment');
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { BlurView } from '@react-native-community/blur';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

// Import actions and reducers
import { connect } from 'react-redux';
import ExperienceActions from '../../reducers/event/index';
import StationActions from '../../reducers/station';
// Load common components
import { StyledButton, StyledText, StyledWrapper, StyledButtonOverlay } from '../../../core/common.styles';
import { StyledLoadingContainer } from '../../../../styles/Common.styles';
// Load utils
import { Loading } from '../../../../utils';
import { getUserCurrentLocation, facebookShare } from '../../../../utils/funcs';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE, DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;
// Import organisms
import MapArea from './organisms/MapArea';
import LiveHeader from '../organisms/LiveHeader';
import LiveSubHeader from '../organisms/LiveSubHeader';
import ViewMedia from '../organisms/ViewMedia';
import GuestLists from '../organisms/GuestLists';
import Details from './organisms/Details';
import PhotoZoomModal from '../organisms/PhotoZoomModal';
import DescriptionInputModal from '../organisms/DescriptionInputModal';
import CommonModal from '../../../profile/components/organisms/CommonModal';
import PrivacyModal from '../organisms/PrivacyModal';
import Video from 'react-native-video';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RNFFmpeg } from 'react-native-ffmpeg';
import uuid from 'uuid';
import EventLoader from '../organisms/EventLoader';

const PHOTO_MORE_MODAL = [{ label: 'Download Media', value: 'download' }, { label: 'Share Media', value: 'share' }];
const PHOTO_MORE_REPORT_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Share Media', value: 'share' },
  { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_DELETE_REPORT_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
  { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_DELETE_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
];
const PHOTO_MORE_MODAL_MEDIA_DEFAULT = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Set Title', value: 'title' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
];
const COMMENT_OPTIONS = [
  { label: 'Edit Comment', value: 'edit_comment' },
  { label: 'Delete Comment', value: 'delete_comment' },
];

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;

const StyledContainer = styled.View`
  flex: 1;
  background-color: ${colors.LightGreyTwo};
`;

const StyledBottomCard = styled.View`
  position: absolute;
  width: 100%;
  bottom: ${hp('1.25%')};
`;

const StyledMapContainer = styled.View`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('100%')};
  border-radius: 15;
  border-width: 0;
`;

const startingStatus = 'starting';
const pendingStatus = 'pending';

const ModalCloseButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      position: 'absolute',
      right: 16,
      top: isIphoneX() ? 48 : 20,
      backgroundColor: 'rgba(128,128,128,0.6)',
      padding: 12,
      borderRadius: 20,
    }}
  >
    <View>
      <CustomIcon name={'Close_16x16px'} size={14} color={'#FFF'} />
    </View>
  </TouchableOpacity>
);
const ModalSoundButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      position: 'absolute',
      left: 16,
      top: isIphoneX() ? 48 : 20,
      backgroundColor: 'rgba(128,128,128,0.6)',
      padding: 12,
      borderRadius: 20,
    }}
  >
    <View>
      <CustomIcon name={props.muted ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'} size={16} color={'#FFF'} />
    </View>
  </TouchableOpacity>
);
class JoinStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPublic: false, // Check if the event is public
      isMore: true,
      selectedMore: '',
      selectedShare: '',
      isModalVisible: false,
      reportDescription: '',
      loading: false,
      isPrivayModalVisible: false,
      isGhostMode: false,
      isLocationOff: false,
      selectedBottomEntryIndex: 1,
      isZoomIn: false,
      zoomInItem: {},

      mediaButtonType: -1,
      selectedFilter: MEDIA_FILTER_DATA[0].value,
      selectedEntryIndex: 0,
      isZoomModalVisible: false,
      isEditMediaModalVisible: false,
      otherUserID: null,
      isLoding: false,
      messages: [],
      firebaseRef: database().ref('Event' + '-' + this.props.navigation.getParam('parentID', 'Default')),
      isPhotoMoreModalVisible: false,
      isMoreModalVisible: false,
      isBuffer: false,
      paused: false,
      isRefresh: false,
      isUpload: false,
      isFailUpload: false,
      muted: true,
      isDeleted: false,
      isCompressing: false,
      isActivity: false,
      mediaZoomSlideIndex: 0,
      mapMediaZoomBottomSlideIndex: 0,
      paused: false,
      isVisibleCommentModal: false,
      selectedComment: null,
    };
    this.moreList = [];
    this.navigate = this.navigate.bind(this);
    this.carouselEntries = [];
    this.coordinates = [];
    this.centerCoordinate = null;
  }

  UNSAFE_componentWillMount() {
    this._fetchData(false);
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  _fetchData = val => {
    this.props.navigation.setParams({ screenTitle: 'JoinStation' });
    let routeType = this.props.navigation.getParam('route_type');
    if (val === true) {
      if (
        this.props.navigation.getParam('parentID') &&
        this.props.navigation.getParam('parentID') !== undefined &&
        this.props.navigation.getParam('userID') === undefined
      ) {
        let req = {
          token: this.props.auth.access_token,
          parentID: this.props.navigation.getParam('parentID'),
          uid: '',
          onSuccess: response => this.onSuccessGetStation(response, routeType),
          onFail: (error, code) => {
            if (code === 500) {
              Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.onPressMoreModal('leave') }]);
            } else {
              Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
            }
          },
        };
        this.props.onGetStation(req);
      } else {
        let req = {
          token: this.props.auth.access_token,
          parentID: this.props.navigation.getParam('parentID'),
          uid: this.props.navigation.getParam('userID'),
          onSuccess: response => this.onSuccessGetStation(response, routeType),
          onFail: (error, code) => {
            if (code === 500) {
              Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.onPressMoreModal('leave') }]);
            } else {
              Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
            }
          },
        };
        this.props.onGetStation(req);
      }
      this.refOn(this.state.firebaseRef, message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      );
    }
  };
  onSuccessGetStation = (response, routeType) => {
    if (response && response.length > 0) {
      const { is_deleted, parentID, child_ID, my_experience } = response[0];
      // this.props.setLocalStation([]);
      if (is_deleted === 1 || is_deleted === true) {
        const eventObj = new FormData();
        eventObj.append('token', this.props.auth.access_token);
        // obj.append('_method', 'PUT');
        eventObj.append('parentID', parentID);
        eventObj.append('childID', child_ID);
        let obj = {
          formData: eventObj,
          leaveStationSuccess: () => {},
          leaveStationFailure: () => {},
        };
        this.props.onLeaveStation(obj);
        Alert.alert(
          'Station Ended',
          'Oops! This station has been ended. No more media can be uploaded.',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.props.setActiveStation(null);
                this.props.setLocalStation([]);
                this.props.navigation.replace('PostStation', {
                  parentID: parentID,
                  childID: child_ID,
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else if (routeType && routeType === 'notification') {
        if (my_experience && my_experience.length > 0) {
          let mediaID = this.props.navigation.getParam('mediaID');
          let index = my_experience.findIndex(item => item.mediaId === mediaID);
          this.props.setJoinEventClose(0);
          this.setState({ mediaButtonType: 0, selectedFilter: 'experience' }, () => {
            if (index !== -1) {
              if (this._carouselvm) {
                this.setState({ selectedEntryIndex: index });
                setTimeout(() => this._carouselvm.snapToItem(index), 250);
              }
            }
          });
        }
      }
    }
  };

  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData(true);
      }),
      this.props.navigation.addListener('didBlur', () => {
        this.props.setJoinEventClose(null);
      }),
    ];
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.station.localStation !== this.props.station.localStation) {
      const { localStation } = this.props.station;
      if (localStation && localStation.length > 0 && this.props.station_data && this.props.station_data.length > 0) {
        let newArray = [...localStation];
        newArray = newArray.filter((item, index) => {
          return item.parentID === this.props.station_data[0].parentID;
        });
        let index = newArray.findIndex(item => item.status === pendingStatus);
        if (index !== -1) {
          if (!this.state.isUpload && !this.state.isFailUpload) {
            if (newArray[index].mediaType === 'image') {
              newArray[index] = {
                ...newArray[index],
                status: startingStatus,
              };
              this.props.setLocalStation(newArray);
              this.onImageUploadRequest(newArray[index]);
            } else {
              if (newArray[index].is_compresss === false) {
                newArray[index] = {
                  ...newArray[index],
                  is_compresss: true,
                  status: startingStatus,
                };
                this.props.setLocalStation(newArray);
                this.onVideoUploadRequest(newArray[index]);
              }
            }
          }
        }
      }
    }

    if (
      !this.state.isDeleted &&
      this.props.station.isStationLoad &&
      this.props.station_data &&
      this.props.station_data.length > 0
    ) {
      const { is_deleted, parentID, child_ID, founder_uid } = this.props.station_data[0];
      if ((is_deleted === 1 || is_deleted === true) && founder_uid !== this.props.auth.uid) {
        this.setState({ isDeleted: true });
        const eventObj = new FormData();
        eventObj.append('token', this.props.auth.access_token);
        eventObj.append('parentID', parentID);
        eventObj.append('childID', child_ID);
        let obj = {
          formData: eventObj,
          leaveStationSuccess: () => {},
          leaveStationFailure: () => {},
        };
        this.props.onLeaveStation(obj);
        Alert.alert(
          'Station Ended',
          'Oops! This station has been ended. No more media can be uploaded.',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.props.setActiveStation(null);
                this.props.setLocalStation([]);
                this.props.navigation.replace('PostStation', {
                  parentID: parentID,
                  childID: child_ID,
                });
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
    if (this.props.station_data && this.props.station_data.length > 0) {
      this.moreList = [];
      this.moreList.push({
        key: 3,
        label: 'Leave Station',
        value: 'leave',
      });
      this.moreList.push({
        key: 5,
        label: 'Edit Details',
        value: 'edit_details',
      });
      if (this.props.station_data.length > 0 && this.props.station_data[0].founder_uid === this.props.auth.uid) {
        this.moreList.push({
          key: 4,
          label: 'Share Station',
          value: 'share',
        });

        this.moreList.push({
          key: 2,
          label: 'End Station',
          value: 'end',
        });

        this.moreList.push({
          key: 3,
          label: 'Delete Station',
          value: 'delete',
        });
      }
    }
    if (this.props.station_data.length > 0 && this.props.station_data[0].founder_uid !== this.props.auth.uid) {
      this.moreList.push({
        key: 0,
        label: 'Report Station',
        value: 'report',
      });
    }
    let routeType = this.props.navigation.getParam('route_type');
    if (this.props.experience.joinEventClose === null && this.state.mediaButtonType !== -1 && !routeType) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mediaButtonType: -1 });
    }
  }

  refOn = (ref, callback) => {
    ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  parse = snapshot => {
    const { text, user, createdAt } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    // const createdAt = new Date();
    const message = {
      id,
      _id,
      createdAt: new Date(createdAt),
      text,
      user,
    };
    return message;
  };

  onToggleHeader = () => {
    this.setState(prevState => ({
      isMore: !prevState.isMore,
    }));
  };

  onGoBack = () => {
    this.props.setJoinEventClose(null);
    const { mediaButtonType } = this.state;
    if (mediaButtonType !== -1) {
      this.setState({
        mediaButtonType: -1,
      });
    } else {
      if (
        this.props.navigation.getParam('isExpStack') !== undefined &&
        this.props.navigation.getParam('isExpStack') === true
      ) {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('HomeBottom');
      } else {
        this.props.navigation.goBack();
      }
    }
  };

  scale = new Animated.Value(1);

  onZoomStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: this.scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  _renderItem = ({ item, index }) => {
    const { zoomInItem, isBuffer, paused, muted } = this.state;
    return (
      <View>
        {item.status !== undefined ? (
          <View
            style={{
              justifyContent: 'center',
              height: hp('22.81%'),
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 15,
            }}
          >
            {item.mediaType === 'image' ? (
              <RNImage
                source={{ uri: item.uri.uri }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: hp('22.81'),
                  borderRadius: 15,
                }}
                resizeMode={'cover'}
              />
            ) : (
              <Video
                source={{
                  uri: item.uri.uri,
                  // headers: {
                  //   range: 'bytes=0',
                  // },
                }}
                paused={true}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: hp('22.81'),
                  borderRadius: 15,
                }}
                resizeMode={'cover'}
              />
            )}

            {item.status === startingStatus ? (
              item.percent !== undefined && (
                <View
                  style={{
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                  }}
                >
                  <View style={styles.progressContainer}>
                    <Animated.View style={[styles.progressInner, { width: item.percent + '%' }]} />
                    {/* <Animated.Text style={styles.progressLabel}>{item.percent}%</Animated.Text> */}
                  </View>
                </View>
              )
            ) : !this.state.isCompressing ? (
              <TouchableOpacity
                onPress={() => {
                  const { localStation } = this.props.station;
                  if (localStation && localStation.length > 0) {
                    let newArray = [...localStation];
                    let index = newArray.findIndex(e => e.req_media_id === item.req_media_id);
                    if (index !== -1) {
                      newArray[index] = {
                        ...newArray[index],
                        status: pendingStatus,
                      };
                    }
                    this.props.setLocalStation(newArray);
                  }
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 24 }}>Retry</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        ) : (
          <StyledButton
            onPress={() => {
              this.setState({ isZoomIn: !this.state.isZoomIn, zoomInItem: item });
            }}
            marginTop={hp('1.25%')}
          >
            <View style={styles.image}>
              <Image source={{ uri: item.url }} style={styles.imageStyle} imageStyle={{ borderRadius: 15 }} />
            </View>
          </StyledButton>
        )}
      </View>
    );
  };

  renderZoomModal = () => {
    const { isZoomIn, zoomInItem, paused, muted, isBuffer } = this.state;
    return (
      <RNModal visible={isZoomIn} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.90)' }}>
          {zoomInItem.video_url !== undefined ? (
            <TouchableWithoutFeedback onPress={() => this.setState({ paused: !paused })}>
              <View style={{ height: hp('100%'), justifyContent: 'center' }}>
                <Video
                  ref={ref => {
                    this.video = ref;
                  }}
                  source={{
                    uri: zoomInItem.video_url,
                    // headers: {
                    //   range: 'bytes=0',
                    // },
                  }}
                  style={{ width: wp('100%'), height: hp('100%') }}
                  rate={1}
                  playWhenInactive={false}
                  paused={paused}
                  muted={muted}
                  repeat={true}
                  resizeMode={'cover'}
                  onLoadStart={val => {
                    this.setState({ isBuffer: true });
                  }}
                  onLoad={val => {
                    this.setState({ isBuffer: false });
                  }}
                  onEnd={() => null}
                  allowsExternalPlayback={true}
                />
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center' }}>
                  {isBuffer ? <ActivityIndicator size={'large'} /> : <View />}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <ImageZoom
              cropWidth={wp('100%')}
              cropHeight={hp('100%')}
              imageWidth={wp('100%')}
              imageHeight={hp('100%')}
              useNativeDriver={true}
            >
              <Image
                style={{ width: wp('100%'), height: hp('100%') }}
                resizeMode={'contain'}
                source={{ uri: zoomInItem.la_url ? zoomInItem.la_url : zoomInItem.url }}
              />
            </ImageZoom>
            // <PinchGestureHandler onGestureEvent={this.onZoomEvent} onHandlerStateChange={this.onZoomStateChange}>
            //   <Animated.Image
            //     source={{ uri: zoomInItem.la_url ? zoomInItem.la_url : zoomInItem.url }}
            //     style={{
            //       width: wp('100%'),
            //       height: hp('100%'),
            //       transform: [{ scale: this.scale }],
            //     }}
            //     resizeMode="contain"
            //   />
            // </PinchGestureHandler>
          )}
          <ModalCloseButton onPress={() => this.setState({ isZoomIn: false })} />
          {zoomInItem.video_url !== undefined && (
            <ModalSoundButton onPress={() => this.setState({ muted: !muted })} muted={muted} />
          )}
        </View>
      </RNModal>
    );
  };

  onVideoUploadRequest = async item => {
    this.setState({ isUpload: true, isCompressing: true });
    let prefix = Platform.OS === 'android' ? 'Camera' : 'tmp';
    let uri;
    if (item.uri.uri) {
      uri = item.uri.uri;
    } else {
      uri = item.uri;
    }
    let path = uri.split(prefix);
    let newFile = uuid.v4() + '.mp4';
    let output = path[0] + prefix + '/' + newFile;
    output = output.replace('file://', '');
    RNFFmpeg.execute(`-i ${uri} -r 30 -c:v libx264 -crf 23 -s 720x1280 ${output}`).then(
      // RNFFmpeg.execute(`-i ${uri} -c:v libx264 -b:v 2M -b:a 64k -x264-params keyint=24:bframes=2 ${output}`).then(
      async response => {
        let uriObj = {
          ...item.formData._parts[2][1],
          uri: Platform.OS === 'android' ? `file://${output}` : output.replace('file://', ''),
        };

        const fData = new FormData();
        fData.append('token', item.formData._parts[0][1]);
        fData.append('_method', item.formData._parts[1][1]);
        fData.append('mediaID', uriObj);
        fData.append('parentID', item.formData._parts[3][1]);
        fData.append('childID', item.formData._parts[4][1]);
        fData.append('lat', item.formData._parts[5][1]);
        fData.append('lng', item.formData._parts[6][1]);
        fData.append('type', item.formData._parts[7][1]);
        fData.append('req_media_id', item.formData._parts[8][1]);
        fData.append('post_event_upload', false);

        let videoObj = {
          formData: fData,
          reqMediaId: item.formData._parts[8][1],
          onSuccess: response => {
            if (this.state.isCompressing) {
              this.setState({ isCompressing: false });
            }
            this.setState({ isUpload: false });
            const { localStation } = this.props.station;
            let newArray = [];
            localStation.map((sItem, index) => {
              if (sItem.req_media_id === response.req_media_id) {
              } else {
                newArray.push(sItem);
              }
            });
            this.props.setLocalStation(newArray);
          },
          onFail: (req_media_id, formData) => {
            if (this.state.isCompressing) {
              this.setState({ isCompressing: false });
            }
            this.setState({ isUpload: false });
            const { localStation } = this.props.station;
            let newArray = [];
            localStation.map((sItem, index) => {
              if (sItem.req_media_id === req_media_id) {
                let obj = {
                  req_media_id: req_media_id,
                  parentID: formData._parts[3][1],
                  uri: formData._parts[2][1],
                  lat: formData._parts[5][1],
                  lng: formData._parts[6][1],
                  formData: formData,
                  status: 'fail',
                  percent: 0,
                  mediaType: 'video',
                  is_compresss: false,
                };
                newArray.push(obj);
              } else {
                newArray.push(sItem);
              }
            });
            this.props.setLocalStation(newArray);
          },
          onProcess: (progressEvent, reqMediaId, formData) => {
            if (this.state.isCompressing) {
              this.setState({ isCompressing: false });
            }
            const percentFraction = progressEvent.loaded / progressEvent.total;
            const percent = Math.floor(percentFraction * 100);
            const { localStation } = this.props.station;
            let newArray = [];
            localStation.map((sItem, index) => {
              if (sItem.req_media_id === reqMediaId) {
                let obj = {
                  req_media_id: reqMediaId,
                  parentID: formData._parts[3][1],
                  uri: formData._parts[2][1],
                  lat: formData._parts[5][1],
                  lng: formData._parts[6][1],
                  formData: formData,
                  status: startingStatus,
                  percent: percent,
                  mediaType: 'video',
                  is_compresss: false,
                };
                newArray.push(obj);
              } else {
                newArray.push(sItem);
              }
            });
            this.props.setLocalStation(newArray);
          },
        };
        setTimeout(() => {
          this.props.uploadStationVideo(videoObj);
        }, 1);
      }
    );
  };

  onImageUploadRequest = item => {
    this.setState({ isUpload: true, isCompressing: true });
    const fData = new FormData();
    fData.append('token', item.formData._parts[0][1]);
    fData.append('_method', item.formData._parts[1][1]);
    fData.append('mediaID', item.formData._parts[2][1]);
    fData.append('parentID', item.formData._parts[3][1]);
    fData.append('childID', item.formData._parts[4][1]);
    fData.append('lat', item.formData._parts[5][1]);
    fData.append('lng', item.formData._parts[6][1]);
    fData.append('type', item.formData._parts[7][1]);
    fData.append('req_media_id', item.formData._parts[8][1]);
    fData.append('post_event_upload', false);

    let imgObj = {
      formData: fData,
      reqMediaId: item.formData._parts[8][1],
      onSuccess: response => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        this.setState({ isUpload: false });
        const { localStation } = this.props.station;
        let newArray = [];
        localStation.map((sItem, index) => {
          if (sItem.req_media_id === response.req_media_id) {
          } else {
            newArray.push(sItem);
          }
        });
        this.props.setLocalStation(newArray);
      },
      onFail: (req_media_id, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        this.setState({ isUpload: false });
        const { localStation } = this.props.station;
        let newArray = [];
        localStation.map((sItem, index) => {
          if (sItem.req_media_id === req_media_id) {
            let obj = {
              req_media_id: req_media_id,
              parentID: formData._parts[3][1],
              uri: formData._parts[2][1],
              lat: formData._parts[5][1],
              lng: formData._parts[6][1],
              formData: formData,
              status: 'fail',
              percent: 0,
              mediaType: 'image',
            };
            newArray.push(obj);
          } else {
            newArray.push(sItem);
          }
        });
        this.props.setLocalStation(newArray);
      },
      onProcess: (progressEvent, reqMediaId, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        const percentFraction = progressEvent.loaded / progressEvent.total;
        const percent = Math.floor(percentFraction * 100);
        const { localStation } = this.props.station;
        let newArray = [];
        localStation.map((sItem, index) => {
          if (sItem.req_media_id === reqMediaId) {
            let obj = {
              req_media_id: reqMediaId,
              parentID: formData._parts[3][1],
              uri: formData._parts[2][1],
              lat: formData._parts[5][1],
              lng: formData._parts[6][1],
              formData: formData,
              status: startingStatus,
              percent: percent,
              mediaType: 'image',
            };
            newArray.push(obj);
          } else {
            newArray.push(sItem);
          }
        });

        this.props.setLocalStation(newArray);
      },
    };
    setTimeout(() => {
      this.props.uploadStationImage(imgObj);
    }, 1);
  };

  toggleReportModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  /**
   * Necessary funcs for new design
   *
   */

  onPressHeaderButton = index => {
    this.setState({
      mediaButtonType: index,
      isActivity: false,
    });
    this.props.setJoinEventClose(index);
  };

  //-- ViewMedia funcs
  onChangeFilterOption = value => {
    this.setState({
      selectedFilter: value,
      selectedEntryIndex: 0,
    });
    if (this._carouselvm) {
      this._carouselvm.snapToItem(0);
    }
  };

  onToggleZoomModal = () => {
    this.setState(prevState => ({
      mediaZoomSlideIndex: this.state.selectedEntryIndex,
      isZoomModalVisible: !prevState.isZoomModalVisible,
    }));
  };

  onChangeSelectedEntryIndex = slideIndex => {
    this.setState({
      selectedEntryIndex: slideIndex,
    });
  };

  onSendComment = (commentText, item, changeComment) => {
    if (this.props.station_data.length > 0 && commentText) {
      const { parentID, other_user_profile, child_ID } = this.props.station_data[0];
      const { mediaButtonType, selectedFilter } = this.state;

      let commentChildID;
      if (mediaButtonType === 0 && selectedFilter === 'trending' && item.user_child_id) {
        commentChildID = item.user_child_id;
      } else {
        commentChildID = _.isEmpty(other_user_profile.other_user_child_id)
          ? child_ID
          : other_user_profile.other_user_child_id;
      }

      const obj = {
        parentID: parentID,
        childID: commentChildID,
        mediaID: item.mediaId,
        comment: commentText,
        token: this.props.auth.access_token,
        uid: this.state.otherUserID,
      };
      this.props.onAddStationComment(obj);
      changeComment('');
    }
  };

  onEditMedia = editMediaItem => {
    this.setState({ editMediaItem }, () => {
      this.setState({ isEditMediaModalVisible: true, mediaTitle: editMediaItem.title });
    });
  };

  onSetDefaultMedia = mediaItem => {
    if (this.props.station_data.length > 0) {
      const { mediaId, userId } = mediaItem;
      const obj = {
        parentID: this.props.station_data[0].parentID,
        childID: this.props.station_data[0].child_ID,
        mediaID: mediaId,
        userID: userId,
        token: this.props.auth.access_token,
        _method: 'PUT',
        uid: this.state.otherUserID,
        media_type: mediaItem.video_url ? 'video' : 'image',
      };
      this.props.onSetDefaultMedia(obj);
    }
  };

  onDeleteMedia = mediaData => {
    const { mediaId, is_default, userId } = mediaData;
    const { selectedFilter } = this.state;
    // if (is_default === 1) {
    //   Alert.alert('Default Media', "You can't delete default media");
    //   return;
    // }
    Alert.alert('Delete Media', 'Are you want to sure delete media!', [
      { text: 'Dismiss', onPress: () => {} },
      {
        text: 'OK',
        onPress: () => {
          if (this.props.station_data.length > 0) {
            const obj = {
              mediaID: mediaId,
              parentID: this.props.station_data[0].parentID,
              childID: this.props.station_data[0].child_ID,
              token: this.props.auth.access_token,
              _method: 'DELETE',
              userID: userId,
              uid: this.state.otherUserID,
              type: mediaData.video_url ? 'video' : 'image',
              onSuccess: () => {
                this.setState({ selectedEntryIndex: 0 });
                if (selectedFilter !== 'uploads') {
                  setTimeout(() => {
                    this._carouselvm.snapToItem(0);
                  }, 1);
                }
              },
            };
            this.props.onDeleteMedia(obj);
          }
        },
      },
    ]);
  };

  onLikeEvent = async selectedCarouselData => {
    const { mediaButtonType, selectedFilter } = this.state;
    const { other_user_profile, child_ID } = this.props.station_data[0];
    const obj = new FormData();

    obj.append('token', this.props.auth.access_token);
    //obj.append('_method', 'POST');
    obj.append('parentID', this.props.station_data[0].parentID);
    if (mediaButtonType === 0 && selectedFilter === 'trending' && selectedCarouselData.user_child_id) {
      obj.append('childID', selectedCarouselData.user_child_id);
    } else {
      obj.append(
        'childID',
        _.isEmpty(other_user_profile.other_user_child_id) ? child_ID : other_user_profile.other_user_child_id
      );
    }
    obj.append('mediaID', selectedCarouselData.mediaId);
    obj.append('uid', this.state.otherUserID);
    let likeObj = {
      formData: obj,
      onFailure: () => {},
      onSuccess: () => {
        if (selectedFilter === 'trending') {
          this.props.station_data[0].trending.map((item, index) => {
            if (item.mediaId === selectedCarouselData.mediaId) {
              this.setState({ selectedEntryIndex: index });
              setTimeout(() => {
                this._carouselvm._snapToItem(index);
              }, 1);
            }
          });
        }
      },
    };

    this.props.onLikeStation(likeObj);
  };
  //--

  //-- Modal funcs
  onToggleEditMediaModal = () => {
    this.setState(prevState => ({
      isEditMediaModalVisible: !prevState.isEditMediaModalVisible,
    }));
  };

  onSubmitMediaDescription = async (description, onChangeDescription) => {
    if (this.props.station_data.length > 0) {
      this.setState({ loading: true });
      const obj = {
        title: description,
        parentID: this.props.station_data[0].parentID,
        childID: this.props.station_data[0].child_ID,
        mediaID: this.state.editMediaItem.mediaId,
        token: this.props.auth.access_token,
        _method: 'PUT',
        uid: this.state.otherUserID,
      };
      await this.props.onEditMedia(obj);
      this.onToggleEditMediaModal();
      this.setState({ loading: false });
      onChangeDescription('');
    }
  };

  onToggleReportModal = () => {
    this.setState(prevState => ({
      isReportEventModalVisible: !prevState.isReportEventModalVisible,
    }));
  };

  onSubmitReport = async (description, onChangeDescription) => {
    this.setState({ loading: true });
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parent_id', this.props.station_data[0].parentID);
    obj.append('child_id', this.props.station_data[0].child_ID);
    obj.append('message', description);
    obj.append('type', 'station');
    if (this.selectedMediaId) {
      obj.append('media_id', this.selectedMediaId);
    }

    this.onToggleReportModal();
    await this.props.onReportEvent(obj);
    this.selectedMediaId = null;
    this.setState({ loading: false });
    onChangeDescription('');
  };

  onUserExperience = item => {
    if (this.props.auth.uid === item.userID) {
      this.setState({ otherUserID: item.userID });
      const savedFilterId = MEDIA_FILTER_DATA.findIndex(mediaItem => mediaItem.value === 'otherexp');
      if (savedFilterId !== -1) {
        MEDIA_FILTER_DATA.splice(savedFilterId);
      }
      this.onChangeFilterOption('experience');
      this.onPressHeaderButton(0);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userID, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.station_data[0].parentID,
        uid: item.userID,
        onSuccess: res => {
          this.setState({ isLoading: false });
          const savedFilterId = MEDIA_FILTER_DATA.findIndex(item => item.value === 'otherexp');
          if (savedFilterId !== -1) {
            MEDIA_FILTER_DATA.splice(savedFilterId);
          }
          MEDIA_FILTER_DATA.push({ id: 3, label: `${item.first_name}'s EXPERIENCE`, value: 'otherexp' });
          this.onChangeFilterOption('otherexp');
          this.onPressHeaderButton(0);
        },
        onFail: (error, code) => {
          if (code === 500) {
            Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.onPressMoreModal('leave') }]);
          } else {
            Alert.alert('User experiecne', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
          }
        },
      };
      this.props.onGetStation(req);
    }
  };

  onActivity = item => {
    if (this.props.auth.uid === item.userId) {
      this.setState({ otherUserID: null, isActivity: false });
      this.onPressHeaderButton(-1);
      this.props.setJoinEventClose(null);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userId, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.station_data[0].parentID,
        uid: item.userId,
        onSuccess: res => {
          this.setState({ isLoading: false });
          this.onPressHeaderButton(-1);
          this.setState({ isActivity: true });
          this.props.setJoinEventClose(null);
        },
        onFail: (error, code) => {
          if (code === 500) {
            Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.onPressMoreModal('leave') }]);
          } else {
            Alert.alert('Activity', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
          }
        },
      };
      this.props.onGetStation(req);
    }
  };
  //--

  navigate = (url, params = {}) => {
    this.props.navigation.navigate(url, params);
  };

  onShowMoreList = () => {
    this.selector.open();
  };

  onShare = async share_url => {
    try {
      await Share.share({
        url: share_url,
        message: share_url,
        title: 'Build your journey with Tellascape',
      });
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
    }
  };

  /* Method is outdated */
  onFaceBookshare = url => {
    if (this.props.station_data && this.props.station_data.length > 0) {
      try {
        let shareLinkContent = {
          contentType: 'link',
          quote: this.props.station_data[0].description,
          contentUrl: url,
          imageUrl: this.props.station_data[0].coverphoto,
          contentTitle: this.props.station_data[0].title,
          contentDescription: this.props.station_data[0].description,
          // commonParameters: {
          //   hashtag: '#tellascpe',
          // },
        };
        facebookShare(shareLinkContent);
      } catch (error) {
        console.log(`Share Error Handling IS: ${error.message} `);
      }
    }
  };

  getRandomCoordinate = polygon => {
    const bounds = geolib.getBounds(polygon);

    while (true) {
      const randomLatitude = Math.random() * (bounds.maxLat - bounds.minLat) + bounds.minLat;
      const randomLongitude = Math.random() * (bounds.maxLng - bounds.minLng) + bounds.minLng;

      if (geolib.isPointInPolygon({ latitude: randomLatitude, longitude: randomLongitude }, polygon)) {
        return { latitude: randomLatitude, longitude: randomLongitude };
      }
    }
  };

  getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'Tellascape',
        message: 'To save the media to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Tellascape',
        'Grant Permission to save media to your device.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } catch (err) {
      Alert.alert(
        'Tellascape',
        'Failed to save Image: ' + err.message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  handleDownload = async data => {
    // if device is android we have to ensure you have permission
    const { la_url, extension, video_url } = data;
    let type = extension === 'mp4' ? 'video' : 'photo';
    let url = extension === 'mp4' ? video_url : la_url;
    if (Platform.OS === 'android') {
      const granted = await this.getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    let dirs = RNFetchBlob.fs.dirs;
    let filename = '/tellascape_' + Date.parse(new Date()).toString() + `.${extension}`;
    let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + filename : dirs.PictureDir + filename;
    if (Platform.OS == 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: extension,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      })
        .fetch('GET', url)
        .then(res => {
          CameraRoll.saveToCameraRoll(res.data, type)
            .then(res =>
              Alert.alert(
                'Tellascape',
                'Media successfully downloaded.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
              )
            )
            .catch(err => {
              Alert.alert(
                'Tellascape',
                'Media save failed.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
              );
            });
        })
        .catch(error => console.log(error));
    } else {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: extension,
      })
        .fetch('GET', url)
        .then(res => {
          CameraRoll.save(res.data, { type: type })
            .then(res =>
              Alert.alert(
                'Tellascape',
                'Media successfully downloaded.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
              )
            )
            .catch(err => {
              Alert.alert(
                'Tellascape',
                'Media save failed.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                {
                  cancelable: false,
                }
              );
            });
        });
    }
  };

  onTogglePhotoMoreModal = () => {
    this.setState(prevState => ({
      isPhotoMoreModalVisible: !prevState.isPhotoMoreModalVisible,
    }));
  };

  onPressPhotoMoreModal = value => {
    this.onTogglePhotoMoreModal();
    const { selectedFilter, selectedEntryIndex } = this.state;
    const { parentID, trending, my_experience, other_experience } = this.props.station_data[0];
    const mediaData =
      selectedFilter === 'trending'
        ? trending
        : selectedFilter === 'experience'
        ? my_experience
        : selectedFilter === 'uploads'
        ? my_experience
        : other_experience;
    const selectedMediaId = mediaData[selectedEntryIndex].mediaId;

    setTimeout(() => {
      switch (value) {
        case 'share':
          let obj = {
            parentID: parentID,
            url: mediaData[selectedEntryIndex].la_url,
            onSuccess: res => {
              this.onShare(res);
            },
            onFail: () => {},
          };
          this.props.onShareUrl(obj);
          break;
        case 'report':
          this.selectedMediaId = selectedMediaId;
          this.onToggleReportModal();
          break;
        case 'set_default':
          this.selectedMediaId = selectedMediaId;
          this.onSetDefaultMedia(mediaData[selectedEntryIndex]);
          break;
        case 'delete':
          this.onDeleteMedia(mediaData[selectedEntryIndex]);
          break;
        case 'title':
          this.onEditMedia(mediaData[selectedEntryIndex]);
          break;
        case 'download':
          this.handleDownload(mediaData[selectedEntryIndex]);
          break;
        default:
          break;
      }
    }, 1000);
  };

  onPressCommentOptionModal = value => {
    this.setState({ isVisibleCommentModal: false });
    const { selectedComment } = this.state;
    setTimeout(() => {
      switch (value) {
        case 'edit_comment':
          break;
        case 'delete_comment':
          Alert.alert('Delete Comment', 'Are you sure want to delete comment ?', [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => {
                if (selectedComment !== null && this.props.station_data && this.props.station_data.length > 0) {
                  const { id, media_id } = selectedComment;
                  const { parentID, child_ID } = this.props.station_data[0];
                  let obj = {
                    token: this.props.auth.access_token,
                    parentID: parentID,
                    childID: child_ID,
                    commentID: id,
                    _method: 'DELETE',
                    mediaID: media_id,
                  };
                  this.props.onDeleteComment(obj);
                }
              },
            },
          ]);
          break;
        default:
          break;
      }
    }, 1000);
  };

  onPressMoreModal = value => {
    if (value === 'leave') {
      this.onMediaUploadWarningPopup('leave');
    }

    if (value === 'end') {
      setTimeout(() => {
        Alert.alert(
          'End Station',
          'Are you sure you would like to end your Station? No more media can be uploaded.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
            },
            {
              text: 'OK',
              onPress: async () => {
                this.onMediaUploadWarningPopup('end');
              },
            },
          ],
          { cancelable: false }
        );
      }, 500);
    }

    if (value === 'delete') {
      setTimeout(() => {
        Alert.alert(
          'Delete Station',
          'Are you sure you would like to delete your Station ?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
            },
            {
              text: 'OK',
              onPress: async () => {
                this.onMediaUploadWarningPopup('delete');
              },
            },
          ],
          { cancelable: false }
        );
      }, 500);
    }
    if (value === 'report') {
      this.onToggleMoreModal();
      setTimeout(() => {
        this.onToggleReportModal();
      }, 500);
    }
    if (value === 'privacy') {
      this.setState({
        isPrivayModalVisible: true,
      });
    }
    if (value === 'share') {
      setTimeout(() => {
        this.setState({
          isMoreModalVisible: false,
        });
        let obj = {
          parentID: this.props.station_data[0].parentID,
          url: '-1',
          onSuccess: res => {
            this.onShare(res);
          },
          onFail: () => {},
        };
        this.props.onShareUrl(obj);
      }, 500);
    }
    if (value === 'edit_details') {
      this.setState({
        isMoreModalVisible: false,
      });
      this.props.navigation.navigate('EditStation', {
        parentID: this.props.station_data[0].parentID,
        childID: this.props.station_data[0].child_ID,
      });
    }
  };

  onToggleMoreModal = () => {
    this.setState(prevState => ({
      isMoreModalVisible: !prevState.isMoreModalVisible,
    }));
  };

  onTogglePrivacyMoal = () => {
    this.setState(prevState => ({
      isPrivayModalVisible: !prevState.isPrivayModalVisible,
    }));
  };

  onToggleGhostMode = () => {
    this.setState(prevState => ({
      isGhostMode: !prevState.isGhostMode,
    }));
  };

  onToggleLocationOff = () => {
    this.setState(prevState => ({
      isLocationOff: !prevState.isLocationOff,
    }));
  };

  onRefresh = () => {
    const { otherUserID } = this.state;
    this.setState({ isRefresh: true });
    let req;
    if (otherUserID === null) {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.station_data[0].parentID,
        onSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: (error, code) => {
          this.setState({ isRefresh: false });
          if (code === 500) {
            Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
          }
        },
      };
    } else {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.station_data[0].parentID,
        uid: otherUserID,
        onSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: (error, code) => {
          this.setState({ isRefresh: false });
          if (code === 500) {
            Alert.alert('Join Station', error, [{ text: 'OK', onPress: () => this.onPressMoreModal('leave') }]);
          }
        },
      };
    }
    this.props.onGetStation(req);
  };

  onMediaUploadWarningPopup = type => {
    if (this.props.station_data && this.props.station_data.length > 0) {
      const { parentID } = this.props.station_data[0];
      const { localStation } = this.props.station;
      let performAction, displayTxt;

      if (type === 'leave') {
        performAction = this.onLeaveExperience;
        displayTxt = 'Leave';
      } else if (type === 'delete') {
        performAction = this.onDeleteExperience;
        displayTxt = 'Delete';
      } else if (type === 'end') {
        performAction = this.onEndExperience;
        displayTxt = 'End';
      }
      let newArray = [...localStation];
      newArray = newArray.filter((item, index) => {
        return item.parentID === parentID && (item.status === pendingStatus || item.status === startingStatus);
      });
      if (newArray.length > 0) {
        setTimeout(() => {
          Alert.alert(
            'Warning!',
            'We noticed some of your content has not yet been added to this experience. If you ' +
              displayTxt +
              ' now that content will be lost.',
            [
              {
                text: 'Wait for content to upload',
                onPress: () => {
                  this.setState({ isMoreModalVisible: false });
                },
              },
              {
                text: displayTxt + ' anyway',
                onPress: () => {
                  if (performAction && performAction !== null) {
                    performAction();
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }, 500);
      } else {
        if (performAction && performAction !== null) {
          performAction();
        }
      }
    }
  };

  onLeaveExperience = () => {
    const eventObj = new FormData();
    eventObj.append('token', this.props.auth.access_token);
    // obj.append('_method', 'PUT');
    eventObj.append('parentID', this.props.station_data[0].parentID);
    eventObj.append('childID', this.props.station_data[0].child_ID);
    let obj = {
      formData: eventObj,
      leaveStationSuccess: () => {},
      leaveStationFailure: () => {},
    };
    this.props.onLeaveStation(obj);
    this.props.setActiveStation(null);
    this.props.setLocalStation([]);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.onToggleMoreModal();
  };

  onEndExperience = async () => {
    let location = await getUserCurrentLocation();
    const eventObj = new FormData();
    eventObj.append('token', this.props.auth.access_token);
    eventObj.append('uid', this.props.auth.uid);
    eventObj.append('_method', 'DELETE');
    eventObj.append('parentID', this.props.station_data[0].parentID);
    eventObj.append('childID', this.props.station_data[0].child_ID);
    let obj = {
      formData: eventObj,
      location: location,
    };
    this.props.onEndStation(obj);
    this.props.setActiveStation(null);
    this.props.setLocalStation([]);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.onToggleMoreModal();
  };

  onDeleteExperience = async () => {
    if (this.props.station_data && this.props.station_data.length > 0) {
      let location = await getUserCurrentLocation();
      this.setState({ isLoading: true });
      const { parentID } = this.props.station_data[0];
      let obj = {
        token: this.props.auth.access_token,
        parentID: parentID,
        uid: this.props.auth.uid,
        location: location,
        onSuccess: () => {
          this.props.setActiveStation(null);
          this.props.setLocalStation([]);
          this.props.navigation.popToTop();
          this.props.navigation.navigate('HomeBottom');
          this.onToggleMoreModal();
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          // Alert.alert('Delete Station', msg);
        },
      };
      this.props.onDeleteStation(obj);
    }
  };

  onChangePaused = val => {
    this.setState({ paused: val });
  };

  onLongPressComment = item => {
    const { userID } = item;
    if (this.props.auth.uid === userID) {
      this.setState({ selectedComment: item, isVisibleCommentModal: true });
    }
  };

  render() {
    const {
      isMore,
      moreList,
      isPrivayModalVisible,
      isGhostMode,
      isLocationOff,

      mediaButtonType,
      selectedFilter,
      selectedEntryIndex,

      isZoomModalVisible,
      isReportEventModalVisible,
      isEditMediaModalVisible,
      isLoading,
      otherUserID,
      selectedBottomEntryIndex,
      messages,
      isPhotoMoreModalVisible,
      isMoreModalVisible,
      isRefresh,
      isActivity,
      mediaZoomSlideIndex,
      isZoomIn,
      mapMediaZoomBottomSlideIndex,
      paused,
      isVisibleCommentModal,
    } = this.state;
    if (this.props.station.isStationLoad && this.props.station_data && this.props.station_data.length > 0) {
      const {
        parentID,
        child_ID,
        title,
        fenceBuffer,
        fenceJson,
        endDate,
        address,
        description,
        share_url,
        founder,
        founder_username,
        founder_uid,

        trending,
        my_experience,
        isPrivate,
        other_experience,
        is_deleted,

        // header
        name,
        founder_photo,

        // For guest lists
        Others,
        leader_board,
        people_may_know,

        // For details
        likes,
        comments,
        sDate,
        eDate,
        invited_user,
        userID,
        guests,
        total_media_count,
        weather,
        type,
        isFounderJoined,
      } = this.props.station_data[0];
      const { localStation } = this.props.station;
      let tempCoordinate = my_experience.length > 0 ? my_experience : trending.length > 0 ? trending : [];
      let coordinate = [];
      tempCoordinate.map((item, index) => {
        if (item.lat !== undefined && item.lng !== undefined) {
          let obj = { latitude: item.lat, longitude: item.lng };
          coordinate.push(obj);
        }
      });

      let newArray = [...localStation];
      newArray = newArray.filter((item, index) => {
        return item.parentID === parentID;
      });
      let newMyExperience = [];
      newMyExperience = [...newArray, ...my_experience];

      const mediaData =
        selectedFilter === 'trending'
          ? trending
          : selectedFilter === 'experience'
          ? my_experience
          : selectedFilter === 'uploads'
          ? my_experience
          : other_experience;

      if (my_experience.length === 0) {
        const filterID = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'experience');
        if (filterID !== -1) {
          MEDIA_FILTER_DATA.splice(filterID);
        }
        const filterID1 = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'uploads');
        if (filterID1 !== -1) {
          MEDIA_FILTER_DATA.splice(filterID1);
        }
      } else {
        const filterID = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'experience');
        if (filterID === -1) {
          MEDIA_FILTER_DATA.push({
            id: 1,
            label: 'MY EXPERIENCE',
            value: 'experience',
          });
        }
        const filterID1 = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'uploads');
        if (filterID1 === -1) {
          MEDIA_FILTER_DATA.push({
            id: 2,
            label: 'MY UPLOADS',
            value: 'uploads',
          });
        }
      }
      let hostData = [
        {
          first_name: founder,
          profile_img: founder_photo,
          userID: founder_uid,
        },
      ];

      let guestIndex = -1;
      if (guests && guests.length > 0) {
        guestIndex = guests.findIndex(item => item.userID === this.props.auth.uid);
      }

      let filterIndex = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === selectedFilter);
      let mediaOptionName = '';
      if (filterIndex !== -1) {
        mediaOptionName = MEDIA_FILTER_DATA[filterIndex].label;
      }

      let isMapZoom = otherUserID === null ? my_experience.length > 0 : other_experience.length > 0;

      let modalSlideIndex = 0;
      if (mediaData && mediaData.length > 0) {
        modalSlideIndex = selectedEntryIndex > mediaData.length - 1 ? mediaData.length - 1 : selectedEntryIndex;
      }
      return (
        <StyledContainer>
          {/** Map area */}
          <StyledMapContainer>
            <MapArea
              parentID={parentID}
              eventType={'Live'}
              coordinates={coordinate}
              activeIndex={
                otherUserID === null
                  ? newMyExperience.length > 1
                    ? selectedBottomEntryIndex
                    : 0
                  : other_experience.length > 1
                  ? selectedBottomEntryIndex
                  : 0
              }
              markerCoordinate={otherUserID === null ? my_experience : other_experience}
            />
          </StyledMapContainer>

          {/** Header */}
          <LiveHeader
            onGoBack={this.onGoBack}
            name={founder}
            avatarSource={{ uri: founder_photo }}
            title={title.length < 33 ? title : title.substring(0, 33) + '...'}
            onPressMore={this.onToggleMoreModal}
            onPressAvatar={() => {
              if (founder_uid !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: founder_uid });
              }
            }}
            isMoreButton={guestIndex !== -1 ? true : false}
            experienceType={'station'}
          />
          <LiveSubHeader buttonType={mediaButtonType} onPress={this.onPressHeaderButton} experienceType={'station'} />

          {/** Map page */}
          {this.props.experience.joinEventClose === null || mediaButtonType === -1 ? (
            <>
              <StyledBottomCard>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={otherUserID === null ? newMyExperience : isActivity ? other_experience : newMyExperience}
                  renderItem={this._renderItem}
                  sliderWidth={wp('100%')}
                  itemWidth={wp('72.22%')}
                  activeSlideAlignment={'center'}
                  firstItem={selectedBottomEntryIndex}
                  inactiveSlideScale={0.82}
                  inactiveSlideOpacity={1}
                  removeClippedSubviews={false}
                  onSnapToItem={slideIndex => {
                    this.setState({
                      selectedBottomEntryIndex: slideIndex,
                      mapMediaZoomBottomSlideIndex: slideIndex,
                    });
                  }}
                />
              </StyledBottomCard>
            </>
          ) : null}

          {/** For 3 tabs */}
          {mediaButtonType !== -1 && this.props.experience.joinEventClose !== null ? (
            <StyledWrapper flex={1} backgroundColor={mediaButtonType === -1 ? 'transparent' : '#d9d9d9'}>
              {/** View Media */}
              {mediaButtonType === 0 ? (
                <ViewMedia
                  refer={vm => {
                    this._carouselvm = vm;
                  }}
                  mediaData={mediaData}
                  selectedEntryIndex={
                    selectedFilter === 'trending'
                      ? mediaData.length - 1 >= selectedEntryIndex
                        ? selectedEntryIndex
                        : 0
                      : selectedEntryIndex
                  }
                  type={type}
                  optionsData={MEDIA_FILTER_DATA}
                  description={description}
                  selectedFilter={selectedFilter}
                  onChangeFilterOption={this.onChangeFilterOption}
                  onChangeSelectedEntryIndex={this.onChangeSelectedEntryIndex}
                  onToggleZoomModal={this.onToggleZoomModal}
                  onTogglePhotoMoreModal={this.onTogglePhotoMoreModal}
                  onSendComment={this.onSendComment}
                  onEditMedia={this.onEditMedia}
                  onSetDefaultMedia={this.onSetDefaultMedia}
                  onDeleteMedia={this.onDeleteMedia}
                  onLikeEvent={this.onLikeEvent}
                  onActivity={this.onActivity}
                  isRefresh={isRefresh}
                  uid={this.props.auth.uid}
                  founder_uid={founder_uid}
                  onRefresh={this.onRefresh}
                  paused={paused}
                  onChangePaused={this.onChangePaused}
                  onPressCommentAvtar={uID => {
                    if (uID !== DEFAULT_FOUNDER_ID) {
                      this.props.setProfileLoad(false);
                      this.props.navigation.push('ViewProfile', { uid: uID });
                    }
                  }}
                  onLongPressComment={this.onLongPressComment}
                />
              ) : null}

              {/** Guest Lists */}
              {mediaButtonType === 1 ? (
                <GuestLists
                  isFounderJoined={isFounderJoined}
                  hostData={hostData}
                  leaderData={leader_board}
                  otherData={Others}
                  peopleData={people_may_know}
                  toExperience={item => {
                    this.onUserExperience(item);
                  }}
                  navigateProfile={uID => {
                    if (uID !== DEFAULT_FOUNDER_ID) {
                      this.props.setProfileLoad(false);
                      this.props.navigation.push('ViewProfile', { uid: uID });
                    }
                  }}
                  isInviteButtonVisible={false}
                  toInviteGuestList={() => {
                    this.props.navigation.push('InviteGuestList', {
                      parentID: parentID,
                      childID: child_ID,
                    });
                  }}
                  experienceType={'station'}
                  isRefresh={isRefresh}
                  onRefresh={this.onRefresh}
                />
              ) : null}

              {/** Details */}
              {mediaButtonType === 2 ? (
                <Details
                  data={{
                    founder,
                    address,
                    likes,
                    comments,
                    isPrivate,
                    sDate,
                    eDate,
                    eventSize: guests.length,
                    media: total_media_count,
                    share_url,
                    parentID,
                    description,
                    weather,
                    title,
                  }}
                  onShareOpen={() => {
                    let obj = {
                      parentID: parentID,
                      url: '-1',
                      onSuccess: res => {
                        this.onShare(res);
                      },
                      onFail: () => {},
                    };
                    this.props.onShareUrl(obj);
                  }}
                  onOpenChat={() => {
                    this.props.navigation.navigate('OpenChat', { parentID: parentID, title, title });
                  }}
                  onPressHost={() => {
                    if (founder_uid !== DEFAULT_FOUNDER_ID) {
                      this.props.setProfileLoad(false);
                      this.props.navigation.push('ViewProfile', { uid: founder_uid });
                    }
                  }}
                  isRefresh={isRefresh}
                  onRefresh={this.onRefresh}
                />
              ) : null}
            </StyledWrapper>
          ) : null}

          {/** Modals: Photo zoom, Report and Edit modals */}
          {mediaData.length > 0 ? (
            <PhotoZoomModal
              items={mediaData}
              selectedEntryIndex={selectedEntryIndex}
              isModalVisible={isZoomModalVisible}
              onCloseZoomMoal={() => {
                this.onToggleZoomModal();
                this.onChangePaused(false);
              }}
              mediaZoomSlideIndex={mediaZoomSlideIndex}
              onSnapToItem={index => this.setState({ mediaZoomSlideIndex: index })}
              selectedFilter={mediaOptionName}
            />
          ) : null}

          {isMapZoom && (
            <PhotoZoomModal
              items={otherUserID === null ? my_experience : other_experience}
              selectedEntryIndex={selectedBottomEntryIndex}
              isModalVisible={isZoomIn}
              onCloseZoomMoal={() => this.setState({ isZoomIn: false })}
              mediaZoomSlideIndex={mapMediaZoomBottomSlideIndex}
              onSnapToItem={index => this.setState({ mapMediaZoomBottomSlideIndex: index })}
              selectedFilter={
                otherUserID === null
                  ? my_experience.length > 0
                    ? my_experience[0].userName + "'s EXPERIENCE"
                    : 'EXPERIENCE'
                  : other_experience.length > 0
                  ? other_experience[0].userName + "'s EXPERIENCE"
                  : 'EXPERIENCE'
              }
            />
          )}

          {/** Various kinds of modals */}
          <DescriptionInputModal
            title={'Report'}
            placeholder={'Report description'}
            isModalVisible={isReportEventModalVisible}
            experienceType={'station'}
            onToggleModal={this.onToggleReportModal}
            onSubmit={this.onSubmitReport}
          />
          <DescriptionInputModal
            title={'Title'}
            mediaTitle={this.state.mediaTitle}
            placeholder={'Media Description'}
            isModalVisible={isEditMediaModalVisible}
            onToggleModal={this.onToggleEditMediaModal}
            experienceType={'station'}
            onSubmit={this.onSubmitMediaDescription}
            onChangeText={val => {
              this.setState({ mediaTitle: val });
            }}
          />
          <CommonModal
            modalData={
              selectedFilter === 'otherexp' && this.props.auth.uid === founder_uid
                ? PHOTO_MORE_MODAL_MEDIA_DEFAULT
                : selectedFilter === 'experience'
                ? PHOTO_MORE_MODAL_MEDIA_DEFAULT
                : this.props.auth.uid === founder_uid
                ? mediaData.length > 0 && mediaData[modalSlideIndex].userId === this.props.auth.uid
                  ? PHOTO_MORE_DELETE_MODAL
                  : PHOTO_MORE_DELETE_REPORT_MODAL
                : mediaData.length > 0 && mediaData[modalSlideIndex].userId === this.props.auth.uid
                ? PHOTO_MORE_MODAL
                : PHOTO_MORE_REPORT_MODAL
            }
            isModalVisible={isPhotoMoreModalVisible}
            isBlur={true}
            onCancelModal={this.onTogglePhotoMoreModal}
            onPressModalItem={this.onPressPhotoMoreModal}
          />
          <CommonModal
            modalData={COMMENT_OPTIONS}
            isModalVisible={isVisibleCommentModal}
            isBlur={true}
            onCancelModal={() => this.setState({ isVisibleCommentModal: false })}
            onPressModalItem={this.onPressCommentOptionModal}
          />
          <CommonModal
            modalData={this.moreList}
            isModalVisible={isMoreModalVisible}
            isBlur={false}
            onCancelModal={this.onToggleMoreModal}
            onPressModalItem={this.onPressMoreModal}
          />
          <PrivacyModal
            isModalVisible={isPrivayModalVisible}
            onTogglePrivacyMoal={this.onTogglePrivacyMoal}
            isGhostMode={isGhostMode}
            onToggleGhostMode={this.onToggleGhostMode}
            isLocationOff={isLocationOff}
            onToggleLocationOff={this.onToggleLocationOff}
          />
          {/* {this.renderZoomModal()} */}
          {isLoading && (
            <StyledLoadingContainer>
              <Loading />
            </StyledLoadingContainer>
          )}
        </StyledContainer>
      );
    } else {
      return <EventLoader />;
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
  },
  imageStyle: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalContainer: {
    margin: 0,
  },
  progressContainer: {
    width: '100%',
    height: hp('2%'),
    borderColor: theme.blue.icon,
    borderWidth: 1,
    borderRadius: hp('1%'),
    justifyContent: 'center',
  },
  progressInner: {
    width: '100%',
    height: hp('2%'),
    borderRadius: hp('1%'),
    backgroundColor: theme.blue.icon,
  },
  progressLabel: {
    fontSize: wp('3.5%'),
    color: 'white',
    position: 'absolute',
    zIndex: 1,
    fontFamily: font.MBold,
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
    station: state.station,
    station_data: state.station.station_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // station
    onGetStation: obj => {
      dispatch(StationActions.getStation(obj));
    },
    onLikeStation: obj => {
      dispatch(StationActions.likeStation(obj));
    },
    onAddStationComment: obj => {
      dispatch(StationActions.addStationComment(obj));
    },
    onDeleteMedia: obj => {
      dispatch(StationActions.deleteStationMedia(obj));
    },
    onEditMedia: obj => {
      dispatch(StationActions.editStationMedia(obj));
    },
    setActiveStation: obj => {
      dispatch(StationActions.setActiveStation(obj));
    },
    onLeaveStation: obj => {
      dispatch(StationActions.leaveStation(obj));
    },
    onEndStation: obj => {
      dispatch(StationActions.endStation(obj));
    },
    onDeleteStation: obj => {
      dispatch(StationActions.deleteStation(obj));
    },
    setLocalStation: obj => {
      dispatch(StationActions.setLocalStation(obj));
    },
    uploadStationVideo: obj => {
      dispatch(StationActions.uploadStationVideo(obj));
    },
    uploadStationImage: obj => {
      dispatch(StationActions.uploadStationImage(obj));
    },
    onSetDefaultMedia: obj => {
      dispatch(StationActions.setDefaultStationMedia(obj));
    },

    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    onShareUrl: obj => {
      dispatch(ExperienceActions.shareUrl(obj));
    },
    onDeleteComment: obj => {
      dispatch(ExperienceActions.deleteComment(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinStation);
