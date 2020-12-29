import React, { Component } from 'react';
import { View, Alert, StyleSheet, Share, Animated, Platform, Modal as RNModal, PermissionsAndroid } from 'react-native';
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
const { MEDIA_FILTER_DATA } = EXPERIENCE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes } = theme;
import * as turf from '@turf/turf';
import smooth from 'smooth-polyline';
var ConvexHullGrahamScan = require('graham_scan');

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

const PHOTO_MORE_MODAL_OTHER_USER = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Share Media', value: 'share' },
];
const COMMENT_OPTIONS = [
  { label: 'Edit Comment', value: 'edit_comment' },
  { label: 'Delete Comment', value: 'delete_comment' },
];

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
class LiveMemory extends Component {
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
    this.props.navigation.setParams({ screenTitle: 'LiveMemory' });
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
            Alert.alert('Live Memory', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
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
            Alert.alert('Live Memory', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
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

  componentDidUpdate() {
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      this.moreList = [];

      if (this.props.memory_data.length > 0 && this.props.memory_data[0].founder_uid !== this.props.auth.uid) {
        if (this.props.memory_data[0].memory_type !== 'QuickStart') {
          // this.moreList.push({
          //   key: 3,
          //   label: 'Leave Memory',
          //   value: 'leave',
          // });
        }
      }
      this.moreList.push({
        key: 3,
        label: 'Share Memory',
        value: 'share',
      });
      if (this.props.memory_data.length > 0 && this.props.memory_data[0].founder_uid !== this.props.auth.uid) {
        this.moreList.push({
          key: 0,
          label: 'Report Memory',
          value: 'report',
        });
      }
      if (this.props.memory_data.length > 0 && this.props.memory_data[0].founder_uid === this.props.auth.uid) {
        this.moreList.push({
          key: 5,
          label: 'Edit Details',
          value: 'edit_details',
        });

        /* Host can End the memory any time */
        this.moreList.push({
          key: 1,
          label: 'End Memory',
          value: 'end',
        });

        /* Host can Delete the memory or we can say remove to host from memory */
        this.moreList.push({
          key: 4,
          label: 'Delete Memory',
          value: 'delete',
        });
      }
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

        {/* {this.state.isZoomIn && (
          <RNModal visible={true} transparent={true}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
              {zoomInItem.video_url ? (
                <View style={{ height: hp('100%'), justifyContent: 'center' }}>
                  <MediaView
                    uri={zoomInItem.video_url ? zoomInItem.video_url : zoomInItem.url}
                    width={wp('100%')}
                    borderRadius={0}
                    resizeMode={'cover'}
                    height={hp('100%')}
                  />
                </View>
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
            </View>
          </RNModal>
        )} */}
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
        title: 'Build your journey with Tellascape.',
      });
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
    }
  };

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
          Alert.alert('User experiecne', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
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
    if (value === 'leave') {
      const eventObj = new FormData();
      eventObj.append('token', this.props.auth.access_token);
      // obj.append('_method', 'PUT');
      eventObj.append('parentID', this.props.memory_data[0].parentID);
      eventObj.append('childID', this.props.memory_data[0].child_ID);
      let obj = {
        formData: eventObj,
        leaveMemorySuccess: () => {},
        leaveMemoryFailure: () => {},
      };
      this.props.onLeaveMemory(obj);
      this.props.navigation.popToTop();
      this.onToggleMoreModal();
    }

    if (value === 'end') {
      Alert.alert(
        'End Memory',
        'Are you sure you would like to end your memory? No more media can be uploaded.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: 'OK',
            onPress: async () => {
              let location = await getUserCurrentLocation();
              const eventObj = new FormData();
              eventObj.append('token', this.props.auth.access_token);
              eventObj.append('uid', this.props.auth.uid);
              eventObj.append('_method', 'DELETE');
              eventObj.append('parentID', this.props.memory_data[0].parentID);
              eventObj.append('childID', this.props.memory_data[0].child_ID);
              let obj = {
                formData: eventObj,
                location: location,
                onSuccess: () => {
                  this.props.navigation.popToTop();
                  this.onToggleMoreModal();
                },
                onFail: msg => {
                  Alert.alert('End Memory', msg);
                  this.onToggleMoreModal();
                },
              };
              this.props.onEndMemory(obj);
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
    if (value === 'privacy') {
      this.setState({
        isPrivayModalVisible: true,
      });
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
                    this.onToggleMoreModal();
                    this.props.setActiveMemory(null);
                    this.props.navigation.popToTop();
                    // this.props.navigation.navigate('HomeBottom');
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
    if (value === 'edit_details') {
      this.setState({
        isMoreModalVisible: false,
      });
      this.props.navigation.navigate('UpdateMemory', {
        parentID: this.props.memory_data[0].parentID,
        childID: this.props.memory_data[0].child_ID,
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
          autoFence = turf.buffer(autoFence, 8, {
            units: 'meters',
          });
        }
      }
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
              eventType={event_type}
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
                  data={otherUserID === null ? my_experience : other_experience}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveMemory);
