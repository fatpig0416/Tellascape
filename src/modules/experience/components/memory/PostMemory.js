import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Share,
  Animated,
  Platform,
  Modal as RNModal,
  PermissionsAndroid,
  Image as RNImage,
  TouchableOpacity,
  Text,
} from 'react-native';
import { database } from 'react-native-firebase';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat } from 'react-native-gifted-chat';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { BlurView } from '@react-native-community/blur';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { isIphoneX } from 'react-native-iphone-x-helper';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'uuid';

// Import actions and reducers
import { connect } from 'react-redux';
import ExperienceActions from '../../reducers/event/index';
import MemoryActions from '../../reducers/memory';

// Import organisms
import MediaView from '../organisms/MediaView';
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
import EventLoader from '../organisms/EventLoader';

// Import common components
import { StyledButton, StyledWrapper } from '../../../core/common.styles';
import { StyledLoadingContainer } from '../../../../styles/Common.styles';

// Load utils
import { Loading } from '../../../../utils';
import { getUserCurrentLocation, facebookShare } from '../../../../utils/funcs';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE, DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
import * as turf from '@turf/turf';
import smooth from 'smooth-polyline';
var ConvexHullGrahamScan = require('graham_scan');

const { MEDIA_FILTER_DATA } = EXPERIENCE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes } = theme;

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
  { label: 'Upload Media', value: 'upload' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Set Title', value: 'title' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
];

const PHOTO_MORE_MODAL_OTHER_USER = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Share Media', value: 'share' },
];

const COMMENT_OPTIONS = [
  { label: 'Edit Comment', value: 'edit_comment' },
  { label: 'Delete Comment', value: 'delete_comment' },
];

const startingStatus = 'starting';
const pendingStatus = 'pending';

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

const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16;
  top: ${isIphoneX() ? 40 : 20};
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  background-color: rgba(128, 128, 128, 0.6);
`;

const ModalCloseButton = props => (
  <StyledModalCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={14} color={'white'} />
  </StyledModalCloseButton>
);
class PostMemory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPublic: false,
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
      zoomInItem: null,

      mediaButtonType: 0,
      selectedFilter: MEDIA_FILTER_DATA[0].value,
      selectedEntryIndex: 0,
      isZoomModalVisible: false,
      isEditMediaModalVisible: false,
      otherUserID: null,
      isLoading: false,
      messages: [],
      firebaseRef: database().ref('Event' + '-' + this.props.navigation.getParam('parentID', 'Default')),
      isPhotoMoreModalVisible: false,
      isMoreModalVisible: false,
      isRefresh: false,
      mediaZoomSlideIndex: 0,
      mapMediaZoomBottomSlideIndex: 0,
      paused: false,
      isVisibleCommentModal: false,
      selectedComment: null,
      isUpload: false,
      isFailUpload: false,
      isCompressing: false,
    };

    const savedFilterId = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'otherexp');
    if (savedFilterId !== -1) {
      MEDIA_FILTER_DATA.splice(savedFilterId);
    }

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
    this.props.navigation.setParams({ screenTitle: 'PostMemory' });
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
          onSuccess: response => {
            const { my_experience, trending } = response[0];
            if (routeType && routeType === 'share') {
              if (trending && trending.length > 0) {
                let mediaID = this.props.navigation.getParam('mediaID');
                let index = trending.findIndex(item => item.mediaId === mediaID);
                this.setState({ mediaButtonType: 0, selectedFilter: 'trending' }, () => {
                  if (index !== -1) {
                    if (this._carouselvm) {
                      this.setState({ selectedEntryIndex: index });
                      setTimeout(() => this._carouselvm.snapToItem(index), 250);
                    }
                  }
                });
              }
            } else if (routeType && routeType === 'notification') {
              if (my_experience && my_experience.length > 0) {
                let mediaID = this.props.navigation.getParam('mediaID');
                let index = my_experience.findIndex(item => item.mediaId === mediaID);
                this.setState({ mediaButtonType: 0, selectedFilter: 'experience' }, () => {
                  if (index !== -1) {
                    if (this._carouselvm) {
                      this.setState({ selectedEntryIndex: index });
                      setTimeout(() => this._carouselvm.snapToItem(index), 250);
                    }
                  }
                });
              }
            } else if (routeType && routeType === 'user_experience') {
              let user_id = this.props.navigation.getParam('user_id');
              let first_name = this.props.navigation.getParam('first_name');
              let obj = {
                userID: user_id,
                first_name: first_name,
              };
              this.onUserExperience(obj);
            }
          },
          onFail: error => {
            Alert.alert('Post Memory', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
          },
        };
        this.props.onGetMemory(req);
      } else {
        let req = {
          token: this.props.auth.access_token,
          parentID: this.props.navigation.getParam('parentID'),
          uid: this.props.navigation.getParam('userID'),
          onSuccess: () => {},
          onFail: error => {
            Alert.alert('Post Memory', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
          },
        };
        this.props.onGetMemory(req);
      }
      this.refOn(this.state.firebaseRef, message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      );
    }
  };

  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData(true);
      }),
    ];
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      this.moreList = [];
      this.moreList.push({
        key: 3,
        label: 'Share Memory',
        value: 'share',
      });
      if (this.props.memory_data.length > 0 && this.props.memory_data[0].founder_uid === this.props.auth.uid) {
        this.moreList.push({
          key: 0,
          label: 'Upload Media',
          value: 'upload_media',
        });
        this.moreList.push({
          key: 4,
          label: 'Edit Details',
          value: 'edit_details',
        });
        this.moreList.push({
          key: 2,
          label: 'Delete Memory',
          value: 'delete',
        });
      }
      if (this.props.memory_data.length > 0 && this.props.memory_data[0].founder_uid !== this.props.auth.uid) {
        this.moreList.push({
          key: 0,
          label: 'Report Memory',
          value: 'report',
        });
      }
    }

    if (prevProps.memory.localMemory !== this.props.memory.localMemory) {
      const { localMemory } = this.props.memory;
      if (localMemory && localMemory.length > 0 && this.props.memory_data && this.props.memory_data.length > 0) {
        let newArray = [...localMemory];
        newArray = newArray.filter((item, index) => {
          return item.parentID === this.props.memory_data[0].parentID;
        });
        let index = newArray.findIndex(item => item.status === pendingStatus);
        if (index !== -1) {
          if (!this.state.isUpload && !this.state.isFailUpload) {
            if (newArray[index].mediaType === 'image') {
              newArray[index] = {
                ...newArray[index],
                status: startingStatus,
              };
              this.props.setLocalMemory(newArray);
              this.onImageUploadRequest(newArray[index]);
            }
          }
        }
      }
    }
  }

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
        const { localMemory } = this.props.memory;
        let newArray = [];
        localMemory.map((sItem, index) => {
          if (sItem.req_media_id === response.req_media_id) {
          } else {
            newArray.push(sItem);
          }
        });
        this.props.setLocalMemory(newArray);
      },
      onFail: (req_media_id, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        this.setState({ isUpload: false });
        const { localMemory } = this.props.memory;
        let newArray = [];
        localMemory.map((sItem, index) => {
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
        this.props.setLocalMemory(newArray);
      },
      onProcess: (progressEvent, reqMediaId, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        const percentFraction = progressEvent.loaded / progressEvent.total;
        const percent = Math.floor(percentFraction * 100);
        const { localMemory } = this.props.memory;
        let newArray = [];
        localMemory.map((sItem, index) => {
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

        this.props.setLocalMemory(newArray);
      },
    };
    setTimeout(() => {
      this.props.uploadMemoryImage(imgObj);
    }, 1);
  };

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
    this.props.navigation.goBack();
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
    const { zoomInItem } = this.state;
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
                  </View>
                </View>
              )
            ) : !this.state.isCompressing ? (
              <TouchableOpacity
                onPress={() => {
                  const { localMemory } = this.props.memory;
                  if (localMemory && localMemory.length > 0) {
                    let newArray = [...localMemory];
                    let index = newArray.findIndex(e => e.req_media_id === item.req_media_id);
                    if (index !== -1) {
                      newArray[index] = {
                        ...newArray[index],
                        status: pendingStatus,
                      };
                    }
                    this.props.setLocalMemory(newArray);
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

  navigate = (url, params = {}) => {
    this.props.navigation.navigate(url, params);
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
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      try {
        let shareLinkContent = {
          contentType: 'link',
          quote: this.props.memory_data[0].description,
          contentUrl: url,
          imageUrl: this.props.memory_data[0].coverphoto,
          contentTitle: this.props.memory_data[0].title,
          contentDescription: this.props.memory_data[0].description,
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

  /**
   * Necessary funcs for oragnisms
   *
   */

  onPressHeaderButton = index => {
    this.setState({
      mediaButtonType: index,
    });
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
    if (this.props.memory_data.length > 0 && commentText) {
      const { parentID, other_user_profile, child_ID } = this.props.memory_data[0];
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
      this.props.onAddMemoryComment(obj);
      changeComment('');
    }
  };

  onEditMedia = editMediaItem => {
    this.setState({ editMediaItem }, () => {
      this.setState({ isEditMediaModalVisible: true, mediaTitle: editMediaItem.title });
    });
  };

  onSetDefaultMedia = mediaItem => {
    if (this.props.memory_data.length > 0) {
      const { mediaId, userId } = mediaItem;
      const obj = {
        parentID: this.props.memory_data[0].parentID,
        childID: this.props.memory_data[0].child_ID,
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
          if (this.props.memory_data.length > 0) {
            const obj = {
              mediaID: mediaId,
              parentID: this.props.memory_data[0].parentID,
              childID: this.props.memory_data[0].child_ID,
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
    const { other_user_profile, child_ID, trending } = this.props.memory_data[0];
    const obj = new FormData();

    obj.append('token', this.props.auth.access_token);
    //obj.append('_method', 'POST');
    obj.append('parentID', this.props.memory_data[0].parentID);
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
          this.props.memory_data[0].trending.map((item, index) => {
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
    this.props.onLikeMemory(likeObj);
  };

  onUserExperience = item => {
    if (this.props.auth.uid === item.userID) {
      this.setState({ otherUserID: item.userID });
      const savedFilterId = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'otherexp');
      if (savedFilterId !== -1) {
        MEDIA_FILTER_DATA.splice(savedFilterId);
      }
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        if (this.props.memory_data[0].my_experience.length > 0) {
          this.onChangeFilterOption('experience');
        }
      }
      this.onPressHeaderButton(0);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userID, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.memory_data[0].parentID,
        uid: item.userID,
        onSuccess: res => {
          this.setState({ isLoading: false });
          const savedFilterId = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'otherexp');
          if (savedFilterId !== -1) {
            MEDIA_FILTER_DATA.splice(savedFilterId);
          }
          MEDIA_FILTER_DATA.push({
            id: 3,
            label: `${item.first_name}'s EXPERIENCE`,
            value: 'otherexp',
          });
          this.onChangeFilterOption('otherexp');
          this.onPressHeaderButton(0);
        },
        onFail: error => {
          Alert.alert('User experience', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
        },
      };
      this.props.onGetMemory(req);
    }
  };

  onActivity = item => {
    if (this.props.auth.uid === item.userId) {
      this.setState({ otherUserID: null });
      this.onPressHeaderButton(-1);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userId, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.memory_data[0].parentID,
        uid: item.userId,
        onSuccess: res => {
          this.setState({ isLoading: false });
          this.onPressHeaderButton(-1);
        },
        onFail: error => {
          Alert.alert('Activity', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
        },
      };
      this.props.onGetMemory(req);
    }
  };

  onRefresh = () => {
    const { otherUserID } = this.state;
    this.setState({ isRefresh: true });
    let req;
    if (otherUserID === null) {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.memory_data[0].parentID,
        onSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: () => {
          this.setState({ isRefresh: false });
        },
      };
    } else {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.memory_data[0].parentID,
        uid: otherUserID,
        onSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: error => {
          this.setState({ isRefresh: false });
        },
      };
    }
    this.props.onGetMemory(req);
  };
  //--

  //-- Modal funcs
  onToggleEditMediaModal = () => {
    this.setState(prevState => ({
      isEditMediaModalVisible: !prevState.isEditMediaModalVisible,
    }));
  };

  onSubmitMediaDescription = async (description, onChangeDescription) => {
    if (this.props.memory_data.length > 0) {
      this.setState({ loading: true });
      const obj = {
        title: description,
        parentID: this.props.memory_data[0].parentID,
        childID: this.props.memory_data[0].child_ID,
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
    obj.append('parent_id', this.props.memory_data[0].parentID);
    obj.append('child_id', this.props.memory_data[0].child_ID);
    obj.append('message', description);
    obj.append('type', 'memory');
    if (this.selectedMediaId) {
      obj.append('media_id', this.selectedMediaId);
    }

    this.onToggleReportModal();
    await this.props.onReportEvent(obj);
    this.selectedMediaId = null;
    this.setState({ loading: false });
    onChangeDescription('');
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

  uploadMemoryImage = async uri => {
    let location = await getUserCurrentLocation();
    try {
      if (location !== null) {
        const obj = new FormData();
        const { parentID, child_ID, type, myChildID } = this.props.memory_data[0];
        if (uri) {
          let imageID = uuid.v4();
          obj.append('token', this.props.auth.access_token);
          obj.append('_method', 'POST');
          obj.append('mediaID', {
            name: `${imageID}.jpg`,
            size: 1 * 1024 * 1024,
            mime: 'image/jpeg',
            type: 'image/jpeg',
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          });
          obj.append('parentID', parentID);
          obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
          obj.append('lat', location !== null ? location.latitude : null);
          obj.append('lng', location !== null ? location.longitude : null);
          obj.append('type', type);
          obj.append('req_media_id', imageID);

          const { localMemory } = this.props.memory;
          let tempData = [];
          let localObj = {
            req_media_id: imageID,
            parentID: parentID,
            uri: uri,
            formData: obj,
            lat: location !== null ? location.latitude : null,
            lng: location !== null ? location.longitude : null,
            status: 'pending',
            percent: 0,
            mediaType: 'image',
          };
          tempData.push(localObj);
          let newArray = [...localMemory, ...tempData];
          this.props.setLocalMemory(newArray);
        }
      }
    } catch (error) {}
  };

  onUploadPhoto = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then(image => {
      this.setState({ mediaButtonType: -1, otherUserID: null });
      this.uploadMemoryImage(image.path);
    });
  };

  onTogglePhotoMoreModal = () => {
    this.setState(prevState => ({
      isPhotoMoreModalVisible: !prevState.isPhotoMoreModalVisible,
    }));
  };

  onPressPhotoMoreModal = value => {
    this.onTogglePhotoMoreModal();

    const { selectedFilter, selectedEntryIndex } = this.state;
    const { parentID, trending, my_experience, other_experience } = this.props.memory_data[0];

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
            url: mediaData[selectedEntryIndex].url,
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
        case 'upload':
          this.onUploadPhoto();
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
                if (selectedComment !== null && this.props.memory_data && this.props.memory_data.length > 0) {
                  const { id, media_id } = selectedComment;
                  const { parentID, child_ID } = this.props.memory_data[0];
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
    if (value === 'delete') {
      Alert.alert(
        'Delete Memory',
        'Are you sure ?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: 'OK',
            onPress: async () => {
              if (this.props.memory_data && this.props.memory_data.length > 0) {
                let location = await getUserCurrentLocation();
                this.setState({ isLoading: true });
                const { parentID } = this.props.memory_data[0];
                let obj = {
                  token: this.props.auth.access_token,
                  parentID: parentID,
                  uid: this.props.auth.uid,
                  location: location,
                  onSuccess: () => {
                    this.props.navigation.popToTop();
                  },
                  onFail: msg => {
                    this.setState({ isLoading: false });
                    Alert.alert('Delete Memory', msg);
                  },
                };
                this.props.onDeleteMemory(obj);
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
    if (value === 'report') {
      this.onToggleMoreModal();
      setTimeout(() => {
        this.onToggleReportModal();
      }, 500);
    }
    if (value === 'share') {
      this.setState({
        isMoreModalVisible: false,
      });
      setTimeout(() => {
        let obj = {
          parentID: this.props.memory_data[0].parentID,
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
      this.props.navigation.navigate('UpdateMemory', {
        parentID: this.props.memory_data[0].parentID,
        childID: this.props.memory_data[0].child_ID,
      });
    }
    if (value === 'upload_media') {
      this.setState({
        isMoreModalVisible: false,
      });
      this.onUploadPhoto();
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

  onChangePaused = val => {
    this.setState({ paused: val });
  };

  onLongPressComment = item => {
    const { userID } = item;
    if (this.props.auth.uid === userID) {
      this.setState({ selectedComment: item, isVisibleCommentModal: true });
    }
  };
  //--

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
      mediaZoomSlideIndex,
      isZoomIn,
      mapMediaZoomBottomSlideIndex,
      paused,
      isVisibleCommentModal,
    } = this.state;

    if (this.props.memory.isMemoryLoad && this.props.memory_data && this.props.memory_data.length > 0) {
      const {
        parentID,
        child_ID,
        title,
        fenceBuffer,
        endDate,
        address,
        description,
        share_url,
        founder,
        founder_username,
        founder_photo,
        founder_uid,
        trending,
        my_experience,
        isPrivate,
        other_experience,
        name,

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
        weather,
        guests,
        total_media_count,
        type,
        memory_type,
        centerPoint,
        isFounderJoined,
        isQuickMemoryStarted,
      } = this.props.memory_data[0];
      const { localMemory } = this.props.memory;
      let tempCoordinate = my_experience.length > 0 ? my_experience : trending.length > 0 ? trending : [];
      let coordinate = [];
      tempCoordinate.map((item, index) => {
        let obj = { latitude: item.lat, longitude: item.lng };
        coordinate.push(obj);
      });
      let event_type = 'Live';
      var autoFence;
      if (memory_type === 'QuickStart') {
        var mediaCords = [];
        event_type = 'QuickMemory';
        mediaCords.push({ latitude: centerPoint.lat, longitude: centerPoint.lng });
        if (tempCoordinate.length > 0) {
          tempCoordinate.map((item, index) => {
            if (item.lat !== '' || item.lat !== undefined) {
              let obj = { latitude: item.lat, longitude: item.lng };
              mediaCords.push(obj);
            }
          });
        }
        var pointCollection = mediaCords;
        var convexHull = new ConvexHullGrahamScan();
        for (var i = 0; i < pointCollection.length; i++) {
          var mediaLat = pointCollection[i]['latitude'];
          var mediaLng = pointCollection[i]['longitude'];
          convexHull.addPoint(mediaLng, mediaLat);
        }
        var hullPoints = convexHull.getHull();
        var parsedHull = [];
        if (hullPoints.length > 2) {
          Object.keys(hullPoints).map(function(key) {
            parsedHull.push([hullPoints[key]['x'], hullPoints[key]['y']]);
          });
          parsedHull.push(parsedHull[0]);
          // parsedHull = smooth(parsedHull);
          autoFence = turf.polygon([parsedHull]);
          autoFence = turf.buffer(autoFence, 10, {
            units: 'meters',
          });
        }
      }
      let newArray = [...localMemory];
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
              eventType={event_type}
              parentID={parentID}
              coordinates={coordinate}
              fence={autoFence}
              isQuickMemoryStarted={isQuickMemoryStarted}
              activeIndex={this.state.selectedBottomEntryIndex}
              markerCoordinate={otherUserID === null ? my_experience : other_experience}
            />
          </StyledMapContainer>

          {/** Header */}
          <LiveHeader
            onGoBack={this.onGoBack}
            name={founder}
            avatarSource={{ uri: founder_photo }}
            title={title.length < 25 ? title : title.substring(0, 25) + '...'}
            onPressMore={this.onToggleMoreModal}
            experienceType={'memory'}
            onPressAvatar={() => {
              if (founder_uid !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: founder_uid });
              }
            }}
            isMoreButton={guestIndex !== -1 ? true : false}
          />
          <LiveSubHeader buttonType={mediaButtonType} onPress={this.onPressHeaderButton} experienceType={'memory'} />

          {/** Map page */}
          {mediaButtonType === -1 ? (
            <>
              <StyledBottomCard>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={otherUserID === null ? newMyExperience : other_experience}
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
          {mediaButtonType !== -1 ? (
            <StyledWrapper flex={1} backgroundColor={mediaButtonType === -1 ? 'transparent' : '#d1d1d1'}>
              {/** View Media */}
              {mediaButtonType === 0 ? (
                <ViewMedia
                  refer={vm => {
                    this._carouselvm = vm;
                  }}
                  mediaData={mediaData}
                  description={description}
                  selectedEntryIndex={
                    selectedFilter === 'trending'
                      ? mediaData.length - 1 >= selectedEntryIndex
                        ? selectedEntryIndex
                        : 0
                      : selectedEntryIndex
                  }
                  type={type}
                  optionsData={MEDIA_FILTER_DATA}
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
                  uid={this.props.auth.uid}
                  founder_uid={founder_uid}
                  isRefresh={isRefresh}
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
                  experienceType={'memory'}
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
                    this.props.navigation.navigate('OpenChat', { parentID: parentID, title });
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

          <DescriptionInputModal
            title={'Report'}
            placeholder={'Report description'}
            experienceType={'memory'}
            isModalVisible={isReportEventModalVisible}
            onToggleModal={this.onToggleReportModal}
            onSubmit={this.onSubmitReport}
          />
          <DescriptionInputModal
            title={'Title'}
            placeholder={'Media Description'}
            mediaTitle={this.state.mediaTitle}
            isModalVisible={isEditMediaModalVisible}
            onToggleModal={this.onToggleEditMediaModal}
            onSubmit={this.onSubmitMediaDescription}
            experienceType={'memory'}
            onChangeText={val => {
              this.setState({ mediaTitle: val });
            }}
          />
          <CommonModal
            modalData={
              selectedFilter === 'otherexp' && this.props.auth.uid === founder_uid
                ? PHOTO_MORE_MODAL_OTHER_USER
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
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  modalStyle: {
    margin: 0,
  },
  modalContainer: {
    margin: 0,
  },
  progressContainer: {
    width: '100%',
    height: hp('2%'),
    borderColor: theme.cyan.icon,
    borderWidth: 1,
    borderRadius: hp('1%'),
    justifyContent: 'center',
  },
  progressInner: {
    width: '100%',
    height: hp('2%'),
    borderRadius: hp('1%'),
    backgroundColor: theme.cyan.icon,
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
    memory: state.memory,
    memory_data: state.memory.memory_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetMemory: obj => {
      dispatch(MemoryActions.getMemory(obj));
    },
    onLikeMemory: obj => {
      dispatch(MemoryActions.likeMemory(obj));
    },
    onAddMemoryComment: obj => {
      dispatch(MemoryActions.addMemoryComment(obj));
    },
    onDeleteMedia: obj => {
      dispatch(MemoryActions.deleteMemoryMedia(obj));
    },
    onEditMedia: obj => {
      dispatch(MemoryActions.editMemoryMedia(obj));
    },
    setActiveMemory: obj => {
      dispatch(MemoryActions.setActiveMemory(obj));
    },
    onLeaveMemory: obj => {
      dispatch(MemoryActions.leaveMemory(obj));
    },
    onEndMemory: obj => {
      dispatch(MemoryActions.endMemory(obj));
    },
    onDeleteMemory: obj => {
      dispatch(MemoryActions.deleteMemory(obj));
    },
    setLocalMemory: obj => {
      dispatch(MemoryActions.setLocalMemory(obj));
    },
    uploadMemoryVideo: obj => {
      dispatch(MemoryActions.uploadMemoryVideo(obj));
    },
    onSetDefaultMedia: obj => {
      dispatch(MemoryActions.setDefaultMemoryMedia(obj));
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
    uploadMemoryImage: obj => {
      dispatch(MemoryActions.uploadMemoryImage(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostMemory);