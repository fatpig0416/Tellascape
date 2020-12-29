import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Share,
  Alert,
  Animated,
  Platform,
  Modal as RNModal,
  PermissionsAndroid,
  Image as RNImage,
  TouchableOpacity,
  Text,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';
import Image from 'react-native-image-progress';
import { database, auth } from 'react-native-firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BlurView } from '@react-native-community/blur';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import * as geolib from 'geolib';
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector';
const moment = require('moment');
import _ from 'lodash/fp';
import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'uuid';
import Video from 'react-native-video';

// Load actions and reselect
import { connect } from 'react-redux';
import ExperienceActions from '../../reducers/event/index';

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;

// Load utils
import { Loading } from '../../../../utils';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { getUserCurrentLocation, isGuestAdmin, facebookShare } from '../../../../utils/funcs';
import { EXPERIENCE, DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;
import MediaView from '../organisms/MediaView';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import EventLoader from '../organisms/EventLoader';
import { isIphoneX } from 'react-native-iphone-x-helper';

// Load common components
import {
  StyledHorizontalContainer,
  StyledButton,
  StyledText,
  StyledWrapper,
  StyledButtonOverlay,
} from '../../../core/common.styles';

// Import organisms
import MapArea from '../organisms/MapArea';
import PhotoZoomModal from '../organisms/PhotoZoomModal';
import LiveHeader from '../organisms/LiveHeader';
import LiveSubHeader from '../organisms/LiveSubHeader';
import ViewMedia from '../organisms/ViewMedia';
import GuestLists from '../organisms/GuestLists';
import Details from '../organisms/Details';
import DescriptionInputModal from '../organisms/DescriptionInputModal';
import CommonModal from '../../../profile/components/organisms/CommonModal';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';

const PHOTO_MORE_REPORT_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_MODAL = [{ label: 'Download Media', value: 'download' }, { label: 'Share Media', value: 'share' }];
const PHOTO_MORE_DOWNLOAD_OPTION = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Title', value: 'title' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_MODAL_MEDIA_DEFAULT = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Title', value: 'title' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];

const PHOTO_MORE_OTHER_USER = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];

const COMMENT_OPTIONS = [
  { label: 'Edit Comment', value: 'edit_comment' },
  { label: 'Delete Comment', value: 'delete_comment' },
];

const StyledContainer = styled.View`
  flex: 1;
  background-color: #d9d9d9;
`;

const StyledMapContainer = styled.View`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('100%')};
  border-radius: 15;
  border-width: 0;
`;
const StyledBottomCard = styled.View`
  position: absolute;
  width: 100%;
  bottom: ${hp('1.25%')};
`;

const StyledEndTimeWrapper = styled.View`
  margin-top: ${sizes.smallPadding};
  height: ${hp('2.8%')};
  align-self: center;
  border-radius: ${hp('1.4%')};
  background-color: ${colors.White};
  padding-left: ${sizes.smallPadding};
  padding-right: ${sizes.smallPadding};
  flex-direction: row;
  align-items: center;
`;

const StyledEndTimeText = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #515151;
  margin-left: ${sizes.smallPadding};
  font-family: ${font.MLight};
  font-weight: 500;
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

const MoreIconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={30} color={'#fff'} />
  </StyledButton>
);

const EndTime = props => (
  <StyledEndTimeWrapper>
    <StyledEndTimeText>{`Ended on ${moment(props.time).format('MMM DD YYYY')} at ${moment(props.time).format(
      'hh:mm A'
    )}`}</StyledEndTimeText>
  </StyledEndTimeWrapper>
);
const ModalCloseButton = props => (
  <StyledModalCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={14} color={'white'} />
  </StyledModalCloseButton>
);

class PostEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressedMedia: true,
      isPressedGuest: false,
      isPressedDetail: false,
      isMoreCarouselDescription: false,
      isMoreEventDescription: false,
      isMoreMyUploadTitle: false,
      selectedEntryIndex: 0,
      isMediaOptionOpen: false,
      isZoomIn: false,
      isTrending: false,
      isMyExperience: false,
      isMyUploads: false,
      isEditMediaModalVisible: false,
      mediaTitle: '',
      zoomInItem: null,
      isReportEventModalVisible: false,
      reportDescription: '',
      loading: false,
      commentText: '',
      isMoreComment: false,
      mediaButtonText: 'TRENDING',
      onFocusKeyboard: false,
      editMediaItem: null,
      isOtherExperience: false,
      isShowOtherExperience: false,
      isLoading: false,
      otherUserID: null,
      selectedBottomEntryIndex: 1,
      mediaButtonType: 0,
      isZoomModalVisible: false,
      selectedFilter: MEDIA_FILTER_DATA[0].value,
      messages: [],
      firebaseRef: database().ref('Event' + '-' + this.props.navigation.getParam('parentID', 'Default')),
      isPhotoMoreModalVisible: false,
      isRefresh: false,
      mediaZoomSlideIndex: 0,
      isActivity: false,
      isUpload: false,
      isCompressing: false,
      isFailUpload: false,
      mapMediaZoomBottomSlideIndex: 0,
      paused: false,
      isVisibleCommentModal: false,
      selectedComment: null,
    };
    this.event = [];
    this.moreList = [];
  }

  UNSAFE_componentWillMount() {
    this._fetchData(false);
  }
  _fetchData = val => {
    let routeType = this.props.navigation.getParam('route_type');
    if (this.props.navigation.getParam('parentID') && this.props.navigation.getParam('parentID') !== undefined) {
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.navigation.getParam('parentID'),
        onGetEventSuccess: response => {
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
          Alert.alert('Post Event', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
        },
      };
      this.props.onGetPostEvent(req);
      this.refOn(this.state.firebaseRef, message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      );
    }
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData(true);
      }),
    ];

    if (this.props.auth && this.props.event_data && this.props.event_data.length > 0) {
      if (this.props.auth.uid === this.props.event_data[0].userID) {
        this.setState({ isTrending: true });
      } else {
        this.setState({ isMyUploads: false });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.moreList = [];

    if (this.props.event_data && this.props.event_data.length > 0) {
      let deleteKey = 'Delete Event';
      const { isPrivate, is_secret, founder_uid } = this.props.event_data[0];

      if (
        this.props.event_data[0].founder_uid === this.props.auth.uid ||
        isGuestAdmin(this.props.auth, this.props.event_data[0])
      ) {
        this.moreList.push({
          key: 0,
          label: 'Upload Media',
        });
      } else {
        deleteKey = 'Delete My Content';
      }
      // this.moreList.push({
      //   key: 1,
      //   label: 'Report',
      // });
      this.moreList.push({
        key: 2,
        label: deleteKey,
      });
      if (
        this.props.event_data[0].founder_uid === this.props.auth.uid ||
        isGuestAdmin(this.props.auth, this.props.event_data[0])
      ) {
        this.moreList.push({
          key: 3,
          label: 'Edit Details',
        });
      }
      if (isPrivate || is_secret) {
        if (founder_uid === this.props.auth.uid) {
          this.moreList.push({
            key: 4,
            label: 'Share Event',
          });
        }
      } else {
        this.moreList.push({
          key: 4,
          label: 'Share Event',
        });
      }
    }

    if (prevProps.experience.localExperience !== this.props.experience.localExperience) {
      const { localExperience } = this.props.experience;
      if (localExperience && localExperience.length > 0 && this.props.event_data && this.props.event_data.length > 0) {
        let newArray = [...localExperience];
        newArray = newArray.filter((item, index) => {
          return item.parentID === this.props.event_data[0].parentID;
        });
        let index = newArray.findIndex(item => item.status === 'pending');
        if (index !== -1) {
          if (!this.state.isUpload & !this.state.isFailUpload) {
            if (newArray[index].mediaType === 'image') {
              this.onImageUploadRequest(newArray[index]);
            } else {
            }
          }
        }
      }
    }
  }

  onImageUploadRequest = item => {
    const { formData, lat, lng, parentID, percent, req_media_id, status, uri } = item;
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
    fData.append('post_event_upload', true);

    //upload image data
    let imgObj = {
      formData: fData,
      reqMediaId: req_media_id,
      onSuccess: response => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        this.setState({ isUpload: false });
        const { localExperience } = this.props.experience;
        let newArray = [];
        localExperience.map((item, index) => {
          if (item.req_media_id === response.req_media_id) {
          } else {
            newArray.push(item);
          }
        });
        this.props.setLocalExperience(newArray);
      },
      onFail: (req_media_id, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        this.setState({ isUpload: false });
        const { localExperience } = this.props.experience;
        let newArray = [];
        localExperience.map((item, index) => {
          if (item.req_media_id === req_media_id) {
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
            newArray.push(item);
          }
        });
        this.props.setLocalExperience(newArray);
      },
      onProcess: (progressEvent, reqMediaId, formData) => {
        if (this.state.isCompressing) {
          this.setState({ isCompressing: false });
        }
        const percentFraction = progressEvent.loaded / progressEvent.total;
        const percent = Math.floor(percentFraction * 100);

        const { localExperience } = this.props.experience;
        let newArray = [];
        localExperience.map((item, index) => {
          if (item.req_media_id === reqMediaId) {
            let obj = {
              req_media_id: reqMediaId,
              parentID: formData._parts[3][1],
              uri: formData._parts[2][1],
              lat: formData._parts[5][1],
              lng: formData._parts[6][1],
              formData: formData,
              status: 'pending',
              percent: percent,
              mediaType: 'image',
            };
            newArray.push(obj);
          } else {
            newArray.push(item);
          }
        });

        this.props.setLocalExperience(newArray);
      },
    };
    setTimeout(() => {
      this.props.uploadImage(imgObj);
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

  navigateToProfile = uid => {
    this.props.navigation.push('ViewProfile', { uid: uid });
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

  toggleReportModal = () => {
    this.setState({ isReportEventModalVisible: !this.state.isReportEventModalVisible });
  };

  onShowMoreList = () => {
    this.selector.open();
  };

  onSelectMoreData = async option => {
    if (option.key == 0) {
      this.onUploadPhoto();
    } else if (option.key === 1) {
      this.toggleReportModal();
    } else if (option.key === 2) {
      let location = await getUserCurrentLocation();
      if (this.props.event_data && this.props.event_data.length > 0) {
        this.setState({ isLoading: true });
        const { parentID } = this.props.event_data[0];
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
            Alert.alert('Delete Event', msg);
          },
        };
        this.props.onRemoveEvent(obj);
      }
    } else if (option.key === 3) {
      this.setState({
        isMoreModalVisible: false,
      });
      this.props.navigation.navigate('UpdateEvent', {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
      });
    } else if (option.key === 4) {
      let obj = {
        parentID: this.props.event_data[0].parentID,
        url: '-1',
        onSuccess: res => {
          this.onShare(res);
        },
        onFail: () => {},
      };
      this.props.onShareUrl(obj);
    }
  };

  onFaceBookshare = url => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      try {
        let shareLinkContent = {
          contentType: 'link',
          quote: this.props.event_data[0].description,
          contentUrl: url,
          imageUrl: this.props.event_data[0].coverphoto,
          contentTitle: this.props.event_data[0].title,
          contentDescription: this.props.event_data[0].description,
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

  onLikeEvent = async item => {
    const { mediaButtonType, selectedFilter } = this.state;
    const { other_user_profile, child_ID } = this.props.event_data[0];
    let location = await getUserCurrentLocation();
    const obj = new FormData();

    obj.append('token', this.props.auth.access_token);
    //obj.append('_method', 'POST');
    obj.append('parentID', this.props.event_data[0].parentID);
    if (mediaButtonType === 0 && selectedFilter === 'trending' && item.user_child_id) {
      obj.append('childID', item.user_child_id);
    } else {
      obj.append(
        'childID',
        _.isEmpty(other_user_profile.other_user_child_id) ? child_ID : other_user_profile.other_user_child_id
      );
    }
    obj.append('mediaID', item.mediaId);
    obj.append('uid', this.state.otherUserID);
    let likeObj = {
      formData: obj,
      location: location,
      onSuccess: response => {},
      onFailure: () => {},
      onGetEventSuccess: () => {
        if (selectedFilter === 'trending') {
          this.props.event_data[0].trending.map((titem, index) => {
            if (titem.mediaId === item.mediaId) {
              this.setState({ selectedEntryIndex: index });
              setTimeout(() => {
                this._carouselvm.snapToItem(index);
              }, 1);
            }
          });
        }
      },
    };

    this.props.onLikeEvent(likeObj);
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.initialRegion, 2000);
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
  };

  onGoBack = () => {
    this.props.navigation.goBack();
  };

  //-- ViewMeid funcs
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

  onSendComment = async (commentText, item, changeComment) => {
    if (this.props.event_data.length > 0 && commentText) {
      let location = await getUserCurrentLocation();
      const { parentID, other_user_profile, child_ID } = this.props.event_data[0];
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
        location: location,
      };
      this.props.onAddPostEventComment(obj);
      changeComment('');
    }
  };

  onEditMedia = editMediaItem => {
    this.setState({ editMediaItem }, () => {
      this.setState({ isEditMediaModalVisible: true, mediaTitle: editMediaItem.title });
    });
  };

  onSetDefaultMedia = mediaItem => {
    if (this.props.event_data.length > 0) {
      const { mediaId, userId } = mediaItem;
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
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
          if (this.props.event_data.length > 0) {
            const obj = {
              mediaID: mediaId,
              parentID: this.props.event_data[0].parentID,
              childID: this.props.event_data[0].child_ID,
              token: this.props.auth.access_token,
              _method: 'DELETE',
              userID: userId,
              uid: this.state.otherUserID,
              type: mediaData.video_url ? 'video' : 'image',
              onGetEventSuccess: res => {
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

  onUserExperience = item => {
    if (this.props.auth.uid === item.userID) {
      const { my_experience } = this.props.event_data[0];
      this.setState({ otherUserID: item.userID });
      const savedFilterId = MEDIA_FILTER_DATA.findIndex(fitlerItem => fitlerItem.value === 'otherexp');
      if (savedFilterId !== -1) {
        MEDIA_FILTER_DATA.splice(savedFilterId);
      }
      let filterType = 'experience';
      if (my_experience.length === 0) {
        filterType = 'trending';
      }
      this.onChangeFilterOption(filterType);
      this.onPressHeaderButton(0);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userID, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        uid: item.userID,
        onGetEventSuccess: res => {
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
      this.props.onGetPostEvent(req);
    }
  };

  onActivity = item => {
    if (this.props.auth.uid === item.userId) {
      this.setState({ otherUserID: null, isActivity: false });
      this.onPressHeaderButton(-1);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userId, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        uid: item.userId,
        onGetEventSuccess: res => {
          this.setState({ isLoading: false, isActivity: true });
          this.onPressHeaderButton(-1);
        },
        onFail: error => {
          Alert.alert('Activity', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
        },
      };
      this.props.onGetPostEvent(req);
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
            {item.status === 'pending' ? (
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
                  const { localExperience } = this.props.experience;
                  if (localExperience && localExperience.length > 0) {
                    let newArray = [...localExperience];
                    let index = newArray.findIndex(e => e.req_media_id === item.req_media_id);
                    if (index !== -1) {
                      newArray[index] = {
                        ...newArray[index],
                        status: 'pending',
                      };
                    }
                    this.props.setLocalExperience(newArray);
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

        {/* {this.state.isZoomIn && (
          <RNModal visible={true} transparent={true}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
              {zoomInItem.video_url ? (
                <View style={{ height: hp('100%'), justifyContent: 'center' }}>
                  <MediaView
                    uri={zoomInItem.video_url ? zoomInItem.video_url : zoomInItem.url}
                    width={wp('100%')}
                    borderRadius={0}
                    height={hp('100%')}
                    resizeMode={'cover'}
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
                    source={{ uri: zoomInItem.la_url ? zoomInItem.la_url : zoomInItem.url }}
                    style={{ width: wp('100%'), height: hp('100%') }}
                    resizeMode={'contain'}
                  />
                </ImageZoom>
              )}

              <ModalCloseButton onPress={() => this.setState({ isZoomIn: false })} />
            </View>
          </RNModal>
        )} */}
      </View>
    );
  };

  //-- Modal funcs
  onToggleEditMediaModal = () => {
    this.setState(prevState => ({
      isEditMediaModalVisible: !prevState.isEditMediaModalVisible,
    }));
  };

  onSubmitMediaDescription = async (description, onChangeDescription) => {
    if (this.props.event_data.length > 0) {
      const obj = {
        title: this.state.mediaTitle,
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        mediaID: this.state.editMediaItem.mediaId,
        token: this.props.auth.access_token,
        _method: 'PUT',
        uid: this.state.otherUserID,
      };
      this.props.onEditMedia(obj);
      this.setState({ isEditMediaModalVisible: false, mediaTitle: '' });
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
    obj.append('parent_id', this.props.event_data[0].parentID);
    obj.append('child_id', this.props.event_data[0].child_ID);
    obj.append('message', description);
    obj.append('type', 'event');
    if (this.selectedMediaId) {
      obj.append('media_id', this.selectedMediaId);
    }

    await this.props.onReportEvent(obj);
    this.selectedMediaId = null;
    this.toggleReportModal();
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
              console.log(`handle downlod: ${JSON.stringify(err)}`);
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

  uploadEventImage = async uri => {
    let location = await getUserCurrentLocation();
    const { parentID, child_ID, type, myChildID } = this.props.event_data[0];
    const obj = new FormData();
    if (uri && location !== null) {
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

      const { localExperience } = this.props.experience;
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
      let newArray = [...localExperience, ...tempData];
      this.props.setLocalExperience(newArray);
    } else {
      Alert.alert('Warning!', 'Unable to get device location!!');
    }
  };

  onUploadPhoto = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then(image => {
      this.setState({ mediaButtonType: -1 });
      this.uploadEventImage(image.path);
    });
  };

  onTogglePhotoMoreModal = () => {
    this.setState(prevState => ({
      isPhotoMoreModalVisible: !prevState.isPhotoMoreModalVisible,
    }));
  };

  onPressPhotoMoreModal = async value => {
    this.onTogglePhotoMoreModal();

    const { selectedFilter, selectedEntryIndex } = this.state;
    const { share_url, trending, my_experience, other_experience, parentID } = this.props.event_data[0];

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
        case 'download':
          this.handleDownload(mediaData[selectedEntryIndex]);
          break;
        case 'upload':
          this.onUploadPhoto();
          break;
        case 'title':
          this.onEditMedia(mediaData[selectedEntryIndex]);
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
                if (selectedComment !== null && this.props.event_data && this.props.event_data.length > 0) {
                  const { id, media_id } = selectedComment;
                  const { parentID, child_ID } = this.props.event_data[0];
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

  onPressMarker = selectItem => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { otherUserID } = this.state;
      const markerData =
        otherUserID === null ? this.props.event_data[0].my_experience : this.props.event_data[0].other_experience;
      markerData.map((item, index) => {
        if (selectItem.mediaId === item.mediaId) {
          this._carousel.snapToItem(index);
        }
      });
    }
  };

  onRefresh = () => {
    const { otherUserID } = this.state;
    this.setState({ isRefresh: true });
    let req;
    if (otherUserID === null) {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        onGetEventSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: () => {
          this.setState({ isRefresh: false });
        },
      };
    } else {
      req = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        uid: otherUserID,
        onGetEventSuccess: res => {
          this.setState({ isRefresh: false });
        },
        onFail: error => {
          this.setState({ isRefresh: false });
        },
      };
    }
    this.props.onGetPostEvent(req);
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
      isLoading,
      mediaButtonType,
      selectedEntryIndex,
      selectedFilter,
      isZoomModalVisible,
      isReportEventModalVisible,
      isEditMediaModalVisible,
      otherUserID,
      selectedBottomEntryIndex,
      messages,
      isPhotoMoreModalVisible,
      isRefresh,
      mediaZoomSlideIndex,
      isActivity,
      isZoomIn,
      mapMediaZoomBottomSlideIndex,
      paused,
      isVisibleCommentModal,
    } = this.state;
    if (this.props.experience.isEventLoad && this.props.event_data && this.props.event_data.length > 0) {
      var {
        parentID,
        child_ID,
        title,
        address,
        description,
        founder,
        founder_username,
        centerPoint,
        shapeMeta,
        likes,
        comments,
        live,
        isPrivate,
        name,
        startDate,
        endDate,
        is_live,
        guests,
        share_url,
        bookmark,
        invited_user,
        rsvp_user,
        weather,
        trending,
        my_experience,
        other_experience,
        userID,
        fenceBuffer,
        other_user_profile,
        leader_board,
        people_may_know,
        Others,
        eDate,
        sDate,
        founder_photo,
        founder_uid,
        event_size,
        total_media_count,
        hasAnonymous,
        ghost_status,
        is_live,
        host_ghost_status,
        isFounderJoined,
      } = this.props.event_data[0];
      const { localExperience } = this.props.experience;

      let coordinate = [];
      fenceBuffer.coordinates[0].map((item, index) => {
        let obj = { latitude: item[1], longitude: item[0] };
        coordinate.push(obj);
      });
      const center = geolib.getCenterOfBounds(coordinate);
      const bounds = geolib.getBounds(coordinate);
      const latitudeDelta = Math.abs(center.latitude - bounds.minLat) * 2.6;
      const longitudeDelta = Math.abs(center.longitude - bounds.minLng) * 2.6;
      this.initialRegion = {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      };

      let newArray = [...localExperience];
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
          hasAnonymous: hasAnonymous,
          ghost: host_ghost_status,
        },
      ];

      // hostData = hostData.filter(function (item) {
      //   return is_live === true && item.ghost === true;
      // });
      // leader_board = leader_board.filter(function (item) {
      //   return is_live === true && item.ghost === true;
      // });
      // people_may_know = people_may_know.filter(function (item) {
      //   return is_live === true && item.ghost === true;
      // });
      // Others = Others.filter(function (item) {
      //   return is_live === true && item.ghost === true;
      // });
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
          <StyledMapContainer>
            <MapArea
              parentID={parentID}
              eventType={'Live'}
              coordinates={coordinate}
              activeIndex={this.state.selectedBottomEntryIndex}
              markerCoordinate={otherUserID === null ? my_experience : other_experience}
              onPressMarker={this.onPressMarker}
            />
          </StyledMapContainer>
          <LiveHeader
            onGoBack={this.onGoBack}
            name={`${founder}`}
            avatarSource={{ uri: founder_photo }}
            title={title.length < 33 ? title : title.substring(0, 33) + '...'}
            onPressAvatar={() => {
              if (founder_uid !== DEFAULT_FOUNDER_ID) {
                this.props.setProfileLoad(false);
                this.props.navigation.push('ViewProfile', { uid: founder_uid });
              }
            }}
            moreIconButton={
              guestIndex !== -1 ? (
                <ModalSelector
                  data={this.moreList}
                  onChange={this.onSelectMoreData}
                  ref={selector => {
                    this.selector = selector;
                  }}
                  customSelector={<MoreIconButton onPress={this.onShowMoreList} />}
                  cancelText={'Cancel'}
                  overlayStyle={styles.overlayStyle}
                  optionContainerStyle={styles.optionContainerStyle}
                  optionStyle={styles.optionStyle}
                  optionTextStyle={styles.optionTextStyle}
                  sectionStyle={styles.sectionStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                />
              ) : (
                <View />
              )
            }
          />
          <LiveSubHeader buttonType={mediaButtonType} onPress={this.onPressHeaderButton} />

          {mediaButtonType === -1 ? (
            <>
              <EndTime time={eDate} />
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
          {/* {this._renderMenu()} */}
          {mediaButtonType !== -1 ? (
            <StyledWrapper flex={1} backgroundColor={mediaButtonType === -1 ? 'transparent' : '#d1d1d1'}>
              {mediaButtonType === 0 ? (
                <ViewMedia
                  refer={vm => {
                    this._carouselvm = vm;
                  }}
                  optionsData={MEDIA_FILTER_DATA}
                  mediaData={mediaData}
                  description={description}
                  selectedEntryIndex={
                    selectedFilter === 'trending'
                      ? mediaData.length - 1 >= selectedEntryIndex
                        ? selectedEntryIndex
                        : 0
                      : selectedEntryIndex
                  }
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
                  navigateProfile={(uID, hasAnonymous) => {
                    if (!hasAnonymous && uID !== DEFAULT_FOUNDER_ID) {
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
                    eventSize: event_size,
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
                    this.props.navigation.navigate('OpenChat', { parentID: parentID, title, isSend: false });
                  }}
                  isRefresh={isRefresh}
                  onRefresh={this.onRefresh}
                />
              ) : null}
            </StyledWrapper>
          ) : null}

          {/** Modals */}
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
            onChangeText={val => {
              this.setState({ mediaTitle: val });
            }}
          />
          <CommonModal
            modalData={
              selectedFilter === 'otherexp' && this.props.auth.uid === founder_uid
                ? PHOTO_MORE_OTHER_USER
                : selectedFilter === 'experience'
                ? this.props.auth.uid === founder_uid
                  ? PHOTO_MORE_DOWNLOAD_OPTION
                  : PHOTO_MORE_MODAL_MEDIA_DEFAULT
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

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Loading />
            </View>
          )}
        </StyledContainer>
      );
    } else {
      return <EventLoader />;
    }
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPostEvent: obj => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    onSetDefaultMedia: obj => {
      dispatch(ExperienceActions.setDefaultMedia(obj));
    },
    onEditMedia: obj => {
      dispatch(ExperienceActions.editMedia(obj));
    },
    onDeleteMedia: obj => {
      dispatch(ExperienceActions.deleteMedia(obj));
    },
    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    onAddPostEventComment: obj => {
      dispatch(ExperienceActions.addPostEventComment(obj));
    },
    onLikeEvent: obj => {
      dispatch(ExperienceActions.likeEvent(obj));
    },
    onRemoveEvent: obj => {
      dispatch(ExperienceActions.removeEvent(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    uploadImage: obj => {
      dispatch(ExperienceActions.uploadImage(obj));
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
)(PostEvent);

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  optionContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  optionStyle: {
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
  },
  cancelStyle: {
    backgroundColor: 'white',
    height: hp('8%'),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
    fontFamily: font.MSemiBold,
  },
  sectionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTextStyle: {
    fontSize: hp('2%'),
    color: '#8f8f8f',
    fontFamily: font.MMedium,
  },
  modalContainer: {
    margin: 0,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    flex: 1,
    left: 0,
    right: 0,
  },
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
  progressContainer: {
    width: '100%',
    height: hp('2%'),
    borderColor: colors.Orange,
    borderWidth: 1,
    borderRadius: hp('1%'),
    justifyContent: 'center',
  },
  progressInner: {
    width: '100%',
    height: hp('2%'),
    borderRadius: hp('1%'),
    backgroundColor: colors.Orange,
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
