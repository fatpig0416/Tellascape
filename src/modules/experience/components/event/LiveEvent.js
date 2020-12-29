import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Share,
  Animated,
  ActivityIndicator,
  Platform,
  Modal as RNModal,
  PermissionsAndroid,
} from 'react-native';
import { database, auth } from 'react-native-firebase';
import styled from 'styled-components/native';
import ModalSelector from 'react-native-modal-selector';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Switch } from 'react-native-switch';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import LinearGradient from 'react-native-linear-gradient';
const moment = require('moment');
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
// Load common components
import { StyledButton, StyledText, StyledWrapper } from '../../../core/common.styles';
// Load utils
import { Loading } from '../../../../utils';
import { getUserCurrentLocation, facebookShare, isGuestAdmin } from '../../../../utils/funcs';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE, DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;
// Import organisms
import MediaView from '../organisms/MediaView';
import MapArea from '../organisms/MapArea';
import LiveHeader from '../organisms/LiveHeader';
import LiveSubHeader from '../organisms/LiveSubHeader';
import ViewMedia from '../organisms/ViewMedia';
import GuestLists from '../organisms/GuestLists';
import Details from '../organisms/Details';
import PhotoZoomModal from '../organisms/PhotoZoomModal';
import DescriptionInputModal from '../organisms/DescriptionInputModal';
import CommonModal from '../../../profile/components/organisms/CommonModal';
import EventLoader from '../organisms/EventLoader';

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;

const PHOTO_MORE_MODAL = [{ label: 'Download Media', value: 'download' }, { label: 'Share Media', value: 'share' }];
const PHOTO_MORE_REPORT_MODAL = [
  { label: 'Download Media', value: 'download' },
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
  background-color: ${colors.LightGreyTwo};
`;

const MoreIconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={30} color={'#fff'} />
  </StyledButton>
);

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

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2 || 0};
`;

const StyledGradientButton = styled.TouchableOpacity`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: ${props => props.marginLeft || 0};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? gradients.Background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
      />
      {children}
    </StyledGradientButton>
  );
};

const StyledModalBodyWrapper = styled.View`
  background-color: ${colors.White};
  padding-top: 20;
  padding-right: 20;
  padding-bottom: 20;
  padding-left: 20;
  border-radius: 10;
`;

const StyledModalHeader = styled.Text`
  text-align: center;
  font-size: 20;
  font-weight: 600;
  color: rgb(167, 167, 167);
`;

const StyledTextInput = styled.TextInput`
  border-bottom-width: 1;
  border-bottom-color: rgb(167, 167, 167);
  padding-top: 5;
  padding-right: 5;
  padding-bottom: 5;
  padding-left: 5;
  margin-top: 20;
  margin-bottom: 10;
  width: ${wp('72%')};
  align-self: center;
  color: rgb(167, 167, 167);
`;

const StyledSwitchWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10;
`;

const StyledModalContainer = styled.View`
  flex: 1;
  padding-bottom: ${hp('7.5%')};
  justify-content: flex-end;
  align-items: center;
`;

const StyledModalBottomContainer = styled.TouchableOpacity`
  width: ${wp('95.56%')};
  height: ${hp('8.75%')};
  background-color: #ffffff;
  border-radius: 14;
  justify-content: center;
  align-items: center;
`;

const StyledModalCancelText = styled.Text`
  font-size: ${hp('2.27%')};
  color: #007aff;
  font-family: ${font.MMedium};
`;

const StyledModalBodyContainer = styled.View`
  width: ${wp('95.56%')};
  height: ${hp('58%')};
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${hp('1.25%')};
  border-radius: 14;
  background-color: #ffffff;
`;

const StyledSectionWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: ${wp('8.89%')};
  padding-right: ${wp('8.89%')};
`;

const StyledPresenceText = styled.Text`
  font-size: ${hp('2.23%')};
  font-family: ${font.MMedium};
  line-height: ${hp('2.97%')};
  margin-top: ${hp('1.09%')};
  margin-top: ${hp('1.88%')};
  color: #000;
`;

const StyledPresenceDescription = styled.Text`
  text-align: center;
  /* font-size: ${hp('2.18%')}; */
  font-size: 17;
  font-family: ${font.MRegular};
  line-height: ${hp('2.81%')};
  margin-top: ${hp('1.72%')};
  color: #6c6c6c;
`;

const StyledSwitchText = styled.Text`
  /* font-size: ${hp('2.65%')}; */
  font-size: 18;
  font-family: ${font.MMedium};
  font-weight: 500;
  margin-right: ${props => (props.isLeft ? 7 : 0)};
  margin-left: ${props => (props.isLeft ? 0 : 7)};
  color: ${props => (props.isActive ? 'rgb(255, 163, 109)' : colors.WarmGrey)};
`;

const StyledSeparator = styled.View`
  width: 100%;
  height: ${hp('0.16%')};
  background-color: rgba(17, 17, 17, 0.5);
  opacity: 0.5;
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

const EndTime = props => (
  <StyledEndTimeWrapper>
    <CustomIcon name={'flash-on_16x16px'} size={sizes.xsmallIconSize} color={'#ff9076'} />
    <StyledEndTimeText>{`Ends on ${moment(props.time).format('MMM DD YYYY')} at ${moment(props.time).format(
      'hh:mm A'
    )}`}</StyledEndTimeText>
  </StyledEndTimeWrapper>
);

class LiveEvent extends Component {
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
    this.props.navigation.setParams({ screenTitle: 'LiveEvent' });
    let routeType = this.props.navigation.getParam('route_type');
    if (
      this.props.navigation.getParam('parentID') &&
      this.props.navigation.getParam('parentID') !== undefined &&
      this.props.navigation.getParam('userID') === undefined
    ) {
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.navigation.getParam('parentID'),
        uid: '',
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
          Alert.alert('Live Event', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
        },
      };
      this.props.onGetPostEvent(req);

      let reqGuestObj = {
        parentID: this.props.navigation.getParam('parentID'),
        token: this.props.auth.access_token,
        onGetGuestSuccess: () => {},
        onGetGuestFail: error => {},
      };
      this.props.onGuestLists(reqGuestObj);
    } else {
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.navigation.getParam('parentID'),
        uid: this.props.navigation.getParam('userID'),
        onGetEventSuccess: () => {},
        onFail: error => {
          Alert.alert('Live Event', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
        },
      };
      this.props.onGetPostEvent(req);
      let reqGuestObj = {
        parentID: this.props.navigation.getParam('parentID'),
        token: this.props.auth.access_token,
        onGetGuestSuccess: () => {},
        onGetGuestFail: error => {},
      };
      this.props.onGuestLists(reqGuestObj);
    }
    this.refOn(this.state.firebaseRef, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  };

  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData(true);
      }),
    ];
  };

  componentDidUpdate() {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { isPrivate, is_secret, founder_uid } = this.props.event_data[0];
      this.moreList = [];
      if (this.props.event_data.length > 0 && this.props.event_data[0].founder_uid !== this.props.auth.uid) {
        // this.moreList.push({
        //   key: 3,
        //   label: 'Leave Event',
        // });
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

      if (this.props.event_data.length > 0 && this.props.event_data[0].is_live === true) {
        this.moreList.push({
          key: 1,
          label: 'My Privacy',
        });
      }
      if (this.props.event_data.length > 0 && this.props.event_data[0].founder_uid !== this.props.auth.uid) {
        // this.moreList.push({
        //   key: 0,
        //   label: 'Report Event',
        // });
      }
      if (this.props.event_data.length > 0 && this.props.event_data[0].founder_uid === this.props.auth.uid) {
        this.moreList.push({
          key: 2,
          label: 'End Event',
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
                    style={{ width: wp('100%'), height: hp('100%') }}
                    resizeMode={'contain'}
                    source={{ uri: zoomInItem.la_url ? zoomInItem.la_url : zoomInItem.url }}
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

  toggleReportModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  reportModalView = () => (
    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>
      <StyledModalBodyWrapper>
        <StyledModalHeader>Report Event</StyledModalHeader>
        <StyledTextInput
          editable
          multiline
          numberOfLines={4}
          placeholder="Report description"
          placeholderTextColor={'rgb(167, 167, 167)'}
          onChangeText={text =>
            this.setState({
              reportDescription: text,
            })
          }
        />
        <GradientButton
          width={wp('72%')}
          height={hp('3.9%')}
          marginLeft={wp('4.5%')}
          onPress={() => {
            this.onSubmitReport();
          }}
          isActive={this.state.reportDescription}
        >
          {!this.state.loading ? (
            <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
              {'Submit'}
            </StyledText>
          ) : (
            <Loading />
          )}
        </GradientButton>
      </StyledModalBodyWrapper>
    </Modal>
  );

  navigate = (url, params = {}) => {
    this.props.navigation.navigate(url, params);
  };
  onSelectMoreData = option => {
    if (option.label === 'Leave Event') {
      const eventObj = new FormData();
      eventObj.append('token', this.props.auth.access_token);
      // obj.append('_method', 'PUT');
      eventObj.append('parentID', this.props.event_data[0].parentID);
      eventObj.append('childID', this.props.event_data[0].child_ID);
      let obj = {
        formData: eventObj,
        leaveEventSuccess: () => {},
        leaveEventFailure: () => {},
      };
      this.props.onLeaveEvent(obj);
      this.props.navigation.navigate('Trending');
    }

    if (option.label === 'End Event') {
      Alert.alert(
        'End Event',
        'By ending event early it will have a negative impact and all guests will be deactivated from the event.',
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
              eventObj.append('parentID', this.props.event_data[0].parentID);
              eventObj.append('childID', this.props.event_data[0].child_ID);
              let obj = {
                formData: eventObj,
                location: location,
              };
              this.props.onDeleteEvent(obj);
              this.props.navigation.popToTop();
            },
          },
        ],
        { cancelable: false }
      );
    }
    if (option.label === 'Report Event') {
      this.onToggleReportModal();
    }
    if (option.label === 'My Privacy') {
      this.setState({
        isPrivayModalVisible: true,
      });
    }
    if (option.label === 'Share Event') {
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
   * Necessary funcs for new design
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
              onGetEventSuccess: () => {
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
    const { other_user_profile, child_ID, trending } = this.props.event_data[0];
    let location = await getUserCurrentLocation();
    const obj = new FormData();

    obj.append('token', this.props.auth.access_token);
    //obj.append('_method', 'POST');
    obj.append('parentID', this.props.event_data[0].parentID);
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
      location: location,
      onSuccess: response => {},
      onFailure: () => {},
      onGetEventSuccess: () => {
        if (selectedFilter === 'trending') {
          this.props.event_data[0].trending.map((item, index) => {
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
    this.props.onLikeEvent(likeObj);
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
      this.setState({ otherUserID: null });
      this.onPressHeaderButton(-1);
    } else {
      this.setState({ isLoading: true, otherUserID: item.userId, mapMediaZoomBottomSlideIndex: 0 });
      let req = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        uid: item.userId,
        onGetEventSuccess: res => {
          this.setState({ isLoading: false });
          this.onPressHeaderButton(-1);
        },
        onFail: error => {
          Alert.alert('Activity', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
        },
      };
      this.props.onGetPostEvent(req);
    }
  };
  //--

  //-- Modal funcs
  onToggleEditMediaModal = () => {
    this.setState(prevState => ({
      isEditMediaModalVisible: !prevState.isEditMediaModalVisible,
    }));
  };

  onSubmitMediaDescription = async (description, onChangeDescription) => {
    if (this.props.event_data.length > 0) {
      this.setState({ loading: true });
      const obj = {
        title: description,
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
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
    obj.append('parent_id', this.props.event_data[0].parentID);
    obj.append('child_id', this.props.event_data[0].child_ID);
    obj.append('message', description);
    obj.append('type', 'event');
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
              console.log(`error is: ${JSON.stringify(err)}`);
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
    const { parentID, trending, my_experience, other_experience } = this.props.event_data[0];

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
      isRefresh,
      mediaZoomSlideIndex,
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
        fenceBuffer,
        endDate,
        address,
        description,
        share_url,
        founder,
        founder_username,
        founder_photo,
        founder_uid,
        guest_admin_uid,
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
        event_size,
        hasAnonymous,
        ghost_status,
        is_live,
        host_ghost_status,
        isFounderJoined,
        is_secret,
      } = this.props.event_data[0];
      let tempCoordinate = my_experience.length > 0 ? my_experience : trending.length > 0 ? trending : [];
      let coordinate = [];
      tempCoordinate.map((item, index) => {
        let obj = { latitude: item.lat, longitude: item.lng };
        coordinate.push(obj);
      });

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

      hostData = hostData.filter(function(item) {
        return is_live === true && item.ghost === false;
      });

      leader_board = leader_board.filter(function(item) {
        return is_live === true && item.ghost === false;
      });
      people_may_know = people_may_know.filter(function(item) {
        return is_live === true && item.ghost === false;
      });
      Others = Others.filter(function(item) {
        return is_live === true && item.ghost === false;
      });

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
              activeIndex={this.state.selectedBottomEntryIndex}
              markerCoordinate={otherUserID === null ? my_experience : other_experience}
              onPressMarker={this.onPressMarker}
            />
          </StyledMapContainer>

          {/** Header */}
          <LiveHeader
            onGoBack={this.onGoBack}
            /* name={`${this.props.auth.first_name} ${this.props.auth.last_name}`} */
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

          {/** Map page */}
          {mediaButtonType === -1 ? (
            <>
              <EndTime time={eDate} />
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
                  isInviteButtonVisible={
                    this.props.auth.uid === founder_uid || this.props.auth.uid === guest_admin_uid ? true : false
                  }
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
                    this.props.navigation.navigate('OpenChat', { parentID: parentID, title, isSend: true });
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

          {/* {this._renderReportModalView()}
          {this._renderEditMediaModalView()} */}
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
                ? PHOTO_MORE_MODAL_MEDIA_DEFAULT
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

          <Modal isVisible={isPrivayModalVisible} style={styles.modalStyle}>
            <StyledModalContainer>
              {/** Modal Body Section */}
              <StyledModalBodyContainer>
                <StyledSectionWrapper>
                  <CustomIcon name={'emoji_happy'} size={hp('4.06%')} color={'#b1b1b1'} />
                  <StyledPresenceText>{'Your Presence'}</StyledPresenceText>
                  <StyledSwitchWrapper>
                    <StyledSwitchText isActive={!isGhostMode} isLeft={true}>
                      {'Live Mode'}
                    </StyledSwitchText>
                    <Switch
                      value={isGhostMode}
                      onValueChange={() => {
                        this.setState(prevState => ({
                          isGhostMode: !prevState.isGhostMode,
                        }));
                      }}
                      disabled={false}
                      circleSize={hp('3.5%')}
                      barHeight={hp('3.7%')}
                      circleBorderWidth={0}
                      backgroundActive={'rgb(254, 114, 133)'}
                      backgroundInactive={'rgb(234, 234, 234)'}
                      switchLeftPx={2.5}
                      switchRightPx={2.5}
                    />
                    <StyledSwitchText isActive={isGhostMode} isLeft={false}>
                      {'Ghost Mode'}
                    </StyledSwitchText>
                  </StyledSwitchWrapper>
                  <StyledPresenceDescription>
                    {'Your username is shown to all the users of the event'}
                  </StyledPresenceDescription>
                </StyledSectionWrapper>

                <StyledSeparator />

                <StyledSectionWrapper>
                  <CustomIcon name={'my_location-24px'} size={hp('4.06%')} color={'#b1b1b1'} />
                  <StyledPresenceText>{'Show Your Location'}</StyledPresenceText>
                  <StyledSwitchWrapper>
                    <StyledSwitchText isActive={!isLocationOff} isLeft={true}>
                      {'On'}
                    </StyledSwitchText>
                    <Switch
                      value={isLocationOff}
                      onValueChange={() => {
                        this.setState(prevState => ({
                          isLocationOff: !prevState.isLocationOff,
                        }));
                      }}
                      disabled={false}
                      circleSize={hp('3.5%')}
                      barHeight={hp('3.7%')}
                      circleBorderWidth={0}
                      backgroundActive={'rgb(254, 114, 133)'}
                      backgroundInactive={'rgb(234, 234, 234)'}
                      switchLeftPx={2.5}
                      switchRightPx={2.5}
                    />
                    <StyledSwitchText isActive={isLocationOff} isLeft={false}>
                      {'Off'}
                    </StyledSwitchText>
                  </StyledSwitchWrapper>
                  <StyledPresenceDescription>
                    {'Event guests can see your location inside the event only'}
                  </StyledPresenceDescription>
                </StyledSectionWrapper>
              </StyledModalBodyContainer>

              {/** Modal Cancel Section */}
              <StyledModalBottomContainer
                onPress={() => {
                  this.setState({
                    isPrivayModalVisible: false,
                  });
                }}
              >
                <StyledModalCancelText>{'Cancel'}</StyledModalCancelText>
              </StyledModalBottomContainer>
            </StyledModalContainer>
          </Modal>
          {isLoading && (
            <View style={{ position: 'absolute', bottom: 0, top: 0, flex: 1, left: 0, right: 0 }}>
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
  mapImage: {
    width: '100%',
    height: '100%',
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
  keyboardAwareContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
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
    onLeaveEvent: obj => {
      dispatch(ExperienceActions.leaveEvent(obj));
    },
    onGuestLists: obj => {
      dispatch(ExperienceActions.getGuestLists(obj));
    },
    onDeleteEvent: obj => {
      dispatch(ExperienceActions.deleteEvent(obj));
    },
    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
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
    onAddPostEventComment: obj => {
      dispatch(ExperienceActions.addPostEventComment(obj));
    },
    onLikeEvent: obj => {
      dispatch(ExperienceActions.likeEvent(obj));
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
)(LiveEvent);