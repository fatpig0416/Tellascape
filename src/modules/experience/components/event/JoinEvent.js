import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Share,
  Animated,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image as RNImage,
  Platform,
  PermissionsAndroid,
  Modal as RNModal,
} from 'react-native';
import styled from 'styled-components/native';
import ModalSelector from 'react-native-modal-selector';
import Modal from 'react-native-modal';
import { database, auth } from 'react-native-firebase';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Switch } from 'react-native-switch';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import LinearGradient from 'react-native-linear-gradient';
import { isIphoneX } from 'react-native-iphone-x-helper';
const moment = require('moment');
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { BlurView } from '@react-native-community/blur';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
// Import actions and reducers
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ExperienceActions from '../../reducers/event/index';
import { selectAuth } from '../../../auth/reducers';
import { selectEventData, selectedLiveEventData, selectExperience } from '../../reducers/event';
// Load common components
import { StyledButton, StyledText, StyledWrapper } from '../../../core/common.styles';
// Load utils
import { Loading } from '../../../../utils';
import { getUserCurrentLocation, facebookShare, isGuestAdmin } from '../../../../utils/funcs';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE, DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;
// Import organisms
import MapArea from '../organisms/MapArea';
import LiveHeader from '../organisms/LiveHeader';
import LiveSubHeader from '../organisms/LiveSubHeader';
import ViewMedia from '../organisms/ViewMedia';
import GuestLists from '../organisms/GuestLists';
import Details from '../organisms/Details';
import PhotoZoomModal from '../organisms/PhotoZoomModal';
import DescriptionInputModal from '../organisms/DescriptionInputModal';
import CommonModal from '../../../profile/components/organisms/CommonModal';
import Video from 'react-native-video';
import { RNFFmpeg } from 'react-native-ffmpeg';
import uuid from 'uuid';
import EventLoader from '../organisms/EventLoader';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import Exif from 'react-native-exif';
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image';
import Tooltip from 'react-native-walkthrough-tooltip';

const tooltipText =
  'Allows Host to: upload, download, delete others content and them from the event.\n\nThis also allows the “Guest Admin” content to also be uploaded to the Original Host journey page as well as the ghost host journey page';
const PHOTO_MORE_MODAL = [{ label: 'Download Media', value: 'download' }, { label: 'Share Media', value: 'share' }];
const PHOTO_MORE_REPORT_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];

const PHOTO_MORE_MODAL_EXPERIENCE = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Title', value: 'title' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_DELETE_MODAL = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Delete Media', value: 'delete' },
  // { label: 'Upload Media', value: 'upload' },
  { label: 'Share Media', value: 'share' },
  // { label: 'Report Media', value: 'report' },
];
const PHOTO_MORE_MODAL_MEDIA_DEFAULT = [
  { label: 'Download Media', value: 'download' },
  { label: 'Set Title', value: 'title' },
  { label: 'Set Default', value: 'set_default' },
  { label: 'Delete Media', value: 'delete' },
  { label: 'Upload Media', value: 'upload' },
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

const startingStatus = 'starting';
const pendingStatus = 'pending';

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;

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

const StyledPhotoInfoWrapper = styled.View`
  position: absolute;
  left: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  width: ${wp('30%')};
  height: ${hp('4.06%')};
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: ${hp('2.03%')};
  background-color: rgba(0, 0, 0, 0.4);
`;

const StyledPhotoText = styled.Text`
  font-size: ${hp('1.56%')};
  font-family: ${font.MSemiBold};
  margin-left: ${wp('1.39%')};
  color: #fefefe;
`;

const StyledLikesIconText = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #fefefe;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.smallPadding};
`;

const LikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.smallIconSize} color={iconColor || '#fefefe'} />
        <StyledLikesIconText>{count}</StyledLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

const PhotoInfo = props => (
  <StyledPhotoInfoWrapper>
    {/* <StyledPhotoText>{`🔥 ${props.likes}`}</StyledPhotoText>
    <StyledPhotoText>{`💬 ${props.msgCounts}`}</StyledPhotoText> */}
    <LikesIconDetail iconName={'love-big_16x16'} count={props.likes} disabled />
    <LikesIconDetail disabled iconName={'comments-big_16x16'} count={props.msgCounts} marginLeft={16} />
  </StyledPhotoInfoWrapper>
);

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
  right: 20;
  top: 40;
`;
const StyledModalLikesContainer = styled.View`
  position: absolute;
  bottom: 40;
  justify-content: center;
  align-items: center;
  width: ${wp('100%')};
`;
const StyledModalLikesWrapper = styled.View`
  background-color: #f4f4f2;
  border-radius: ${wp('6.165%')};
  padding-left: ${wp('5%')};
  padding-right: ${wp('5%')};
  padding-top: ${wp('2%')};
  padding-bottom: ${wp('2%')};
`;
const StyledModalLikesText = styled.Text`
  color: #242424;
  font-family: ${font.MSemiBold};
  font-size: ${hp('2.5%')};
`;

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
const StyledModalLikesIconText = styled.Text`
  font-size: ${hp('2.5%')};
  color: #242424;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.smallPadding};
`;

const ModalLikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.normalIconSize} color={iconColor || '#282828'} />
        <StyledModalLikesIconText>{count}</StyledModalLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

const ModalLikes = props => (
  <StyledModalLikesContainer>
    <StyledModalLikesWrapper>
      {/* <StyledModalLikesText>{`🔥 ${props.likes}`}</StyledModalLikesText> */}
      <ModalLikesIconDetail iconName={'love-big_16x16'} count={props.likes} disabled />
    </StyledModalLikesWrapper>
  </StyledModalLikesContainer>
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

const PopupOption = ({ label, onPress, color = '#282828', isSuffix, isTooltipVisible, onChangeTooltipVisibility }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.popupLabelContainer}>
        <Text style={[styles.popupLabelStyle, { color: color, flex: 1 }]}>{label}</Text>
        {isSuffix && (
          <Tooltip
            isVisible={isTooltipVisible}
            content={<Text style={styles.tooltipText}>{tooltipText}</Text>}
            contentStyle={styles.tooltipContainer}
            placement="bottom"
            onClose={() => onChangeTooltipVisibility(false)}
          >
            <TouchableOpacity
              hitSlop={{ bottom: 7, top: 7, right: 7, left: 7 }}
              onPress={() => onChangeTooltipVisibility(true)}
            >
              <View style={styles.popupSuffixContainer}>
                <Text>{'?'}</Text>
              </View>
            </TouchableOpacity>
          </Tooltip>
        )}
      </View>
    </TouchableOpacity>
  );
};

const UserPopup = ({
  data,
  visible,
  onClose,
  auth,
  founder_uid,
  onMakeAdmin,
  guest_admin,
  onPressBlock,
  onPressProfile,
  onPressRemove,
  isTooltipVisible,
  onChangeTooltipVisibility,
  onPressViewExperience,
}) => {
  let adminID = '';
  if (!_.isEmpty(guest_admin)) {
    adminID = guest_admin.uid;
  }
  if (data !== null) {
    return (
      <RNModal visible={visible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContainer, { backgroundColor: 'white' }]}>
                  <View style={styles.avtarMainContainer}>
                    <View style={styles.avatarContainer}>
                      <FastImage source={{ uri: data.photo }} style={styles.avatar} />
                    </View>
                    <View style={{ height: wp('1%') }} />
                    <Text style={styles.usernameStyle}>{data.users_name}</Text>
                    <Text style={styles.statusStyle}>{data.status}</Text>
                  </View>

                  {founder_uid === auth.uid && founder_uid !== data.userID && adminID !== data.userID && (
                    <PopupOption
                      label={'Make Admin'}
                      onPress={() => [onClose(), onMakeAdmin(data)]}
                      isSuffix={true}
                      isTooltipVisible={isTooltipVisible}
                      onChangeTooltipVisibility={onChangeTooltipVisibility}
                    />
                  )}
                  <PopupOption label={'View Profile'} onPress={() => [onClose(), onPressProfile(data.userID)]} />
                  {founder_uid === auth.uid && founder_uid !== data.userID && (
                    <>
                      <PopupOption
                        label={data.is_blocked ? 'Unblock Media' : 'Block Media'}
                        onPress={() => [onClose(), onPressBlock(data)]}
                      />
                      <PopupOption
                        label={'Remove'}
                        color={'#FF3737'}
                        onPress={() => [onClose(), onPressRemove(data)]}
                      />
                    </>
                  )}
                  <PopupOption label={'View Experience'} onPress={() => [onClose(), onPressViewExperience(data)]} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </RNModal>
    );
  } else {
    return <View />;
  }
};

class JoinEvent extends Component {
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
      selectedBottomEntryIndex: 0,
      isZoomIn: false,
      muted: true,
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
      isBuffer: false,
      paused: false,
      isRefresh: false,
      isUpload: false,
      isFailUpload: false,
      isDeleted: false,
      isCompressing: false,
      isActivity: false,
      mediaZoomSlideIndex: 0,
      isVisibleGuestModal: false,
      selectGuestUser: {},
      isGuestTooltipVisible: false,
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
    this.props.navigation.setParams({ screenTitle: 'JoinEvent' });
    let isVerifyPin = this.props.navigation.getParam('verifypin');
    let routeType = this.props.navigation.getParam('route_type');
    if (val === true || isVerifyPin) {
      if (
        this.props.navigation.getParam('parentID') &&
        this.props.navigation.getParam('parentID') !== undefined &&
        this.props.navigation.getParam('userID') === undefined
      ) {
        let req = {
          token: this.props.auth.access_token,
          parentID: this.props.navigation.getParam('parentID'),
          uid: '',
          onGetEventSuccess: response => this.onGetEventSuccess(response, routeType),
          onFail: (error, code) => {
            if (code === 500) {
              Alert.alert('Join Event', error, [
                { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
              ]);
            } else {
              Alert.alert('Join Event', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
            }
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
          onGetEventSuccess: response => this.onGetEventSuccess(response, routeType),
          onFail: (error, code) => {
            if (code === 500) {
              Alert.alert('Join Event', error, [
                { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
              ]);
            } else {
              Alert.alert('Join Event', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
            }
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
    }
  };
  onGetEventSuccess = (response, routeType) => {
    if (response && response.length > 0) {
      const { is_deleted, parentID, child_ID, ghost_status, is_guest_removed_by_host, my_experience } = response[0];
      this.setState({ isGhostMode: ghost_status });
      //this.props.setLocalExperience([]);
      if (is_deleted === 1 || is_deleted === true) {
        const eventObj = new FormData();
        eventObj.append('token', this.props.auth.access_token);
        // obj.append('_method', 'PUT');
        eventObj.append('parentID', parentID);
        eventObj.append('childID', child_ID);
        let obj = {
          formData: eventObj,
          leaveEventSuccess: () => {},
          leaveEventFailure: () => {},
        };
        this.props.onLeaveEvent(obj);
        Alert.alert('Event Ended', 'Oops! This event has been ended. No more media can be uploaded.', [
          {
            text: 'Okay',
            onPress: () => {
              this.props.setLocalExperience([]);
              this.props.setActiveExperience(null);
              this.props.navigation.replace('PostEvent', {
                parentID: parentID,
                childID: child_ID,
              });
            },
          },
        ]);
      } else if (is_guest_removed_by_host) {
        Alert.alert(
          'Tellascape',
          'You are removed for this event by Host, so you are not able to continue upload your experience.',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.onLeaveExperience();
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
    if (prevProps.experience.localExperience !== this.props.experience.localExperience) {
      const { localExperience } = this.props.experience;
      if (localExperience && localExperience.length > 0 && this.props.event_data && this.props.event_data.length > 0) {
        let newArray = [...localExperience];
        newArray = newArray.filter((item, index) => {
          return item.parentID === this.props.event_data[0].parentID;
        });
        let index = newArray.findIndex(item => item.status === pendingStatus);
        if (index !== -1) {
          if (!this.state.isUpload && !this.state.isFailUpload) {
            if (newArray[index].mediaType === 'image') {
              newArray[index] = {
                ...newArray[index],
                status: startingStatus,
              };
              this.props.setLocalExperience(newArray);
              this.onImageUploadRequest(newArray[index]);
            } else {
              if (newArray[index].is_compresss === false) {
                newArray[index] = {
                  ...newArray[index],
                  is_compresss: true,
                  status: startingStatus,
                };
                this.props.setLocalExperience(newArray);
                this.onVideoUploadRequest(newArray[index]);
              }
            }
          }
        }
      }
    }

    if (
      !this.state.isDeleted &&
      this.props.experience.isEventLoad &&
      this.props.event_data &&
      this.props.event_data.length > 0
    ) {
      const { is_deleted, parentID, child_ID, founder_uid } = this.props.event_data[0];
      if ((is_deleted === 1 || is_deleted === true) && founder_uid !== this.props.auth.uid) {
        this.setState({ isDeleted: true });
        const eventObj = new FormData();
        eventObj.append('token', this.props.auth.access_token);
        eventObj.append('parentID', parentID);
        eventObj.append('childID', child_ID);
        let obj = {
          formData: eventObj,
          leaveEventSuccess: () => {},
          leaveEventFailure: () => {},
        };
        this.props.onLeaveEvent(obj);
        Alert.alert(
          'Event Ended',
          'Oops! This event has been ended. No more media can be uploaded.',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.props.setLocalExperience([]);
                this.props.setActiveExperience(null);
                this.props.navigation.replace('PostEvent', {
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

    if (this.props.event_data && this.props.event_data.length > 0) {
      const { isPrivate, is_secret, founder_uid } = this.props.event_data[0];
      this.moreList = [];
      //if (this.props.event_data.length > 0 && this.props.event_data[0].founder_uid !== this.props.auth.uid) {
      this.moreList.push({
        key: 3,
        label: 'Leave Event',
      });
      //}

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
    let routeType = this.props.navigation.getParam('route_type');
    if (this.props.experience.joinEventClose === null && this.state.mediaButtonType !== -1 && !routeType) {
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
                  const { localExperience } = this.props.experience;
                  if (localExperience && localExperience.length > 0) {
                    let newArray = [...localExperience];
                    let index = newArray.findIndex(e => e.req_media_id === item.req_media_id);
                    if (index !== -1) {
                      newArray[index] = {
                        ...newArray[index],
                        status: pendingStatus,
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
              this.setState({ isZoomIn: !this.state.isZoomIn, zoomInItem: item, paused: false });
            }}
            marginTop={hp('1.25%')}
          >
            <View style={styles.image}>
              <Image source={{ uri: item.url }} style={styles.imageStyle} imageStyle={{ borderRadius: 15 }} />
            </View>

            {/* <PhotoInfo
            likes={item.likes !== undefined ? item.likes : 0}
            msgCounts={item.comments !== undefined ? item.comments.length : 1}
          /> */}
          </StyledButton>
        )}
      </View>
    );
  };

  renderZoomModel = () => {
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

          {/* <ModalLikes likes={zoomInItem.likes} /> */}
        </View>
      </RNModal>
    );
  };

  onVideoUploadRequest = async item => {
    const { formData, lat, lng, parentID, percent, req_media_id } = item;
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
                  mediaType: 'video',
                  is_compresss: false,
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
                  status: startingStatus,
                  percent: percent,
                  mediaType: 'video',
                  is_compresss: false,
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
          this.props.uploadVideo(videoObj);
        }, 1);
      }
    );
  };

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
    fData.append('post_event_upload', false);

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
              status: startingStatus,
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

  toggleReportModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

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

  onSendComment = async (commentText, item, changeComment) => {
    if (this.props.event_data.length > 0 && commentText) {
      const location = await getUserCurrentLocation();
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

  onLikeEvent = async selectedCarouselData => {
    const { mediaButtonType, selectedFilter } = this.state;
    const { other_user_profile, child_ID } = this.props.event_data[0];
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

  onUserExperience = item => {
    if (this.props.auth.uid === item.userID) {
      const { my_experience } = this.props.event_data[0];
      this.setState({ otherUserID: item.userID });
      const savedFilterId = MEDIA_FILTER_DATA.findIndex(item => item.value === 'otherexp');
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
            Alert.alert('Join Event', error, [
              { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
            ]);
          } else {
            Alert.alert('User experiecne', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
          }
        },
      };
      this.props.onGetPostEvent(req);
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
        parentID: this.props.event_data[0].parentID,
        uid: item.userId,
        onGetEventSuccess: res => {
          this.setState({ isLoading: false });
          this.onPressHeaderButton(-1);
          this.setState({ isActivity: true });
          this.props.setJoinEventClose(null);
        },
        onFail: (error, code) => {
          if (code === 500) {
            Alert.alert('Join Event', error, [
              { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
            ]);
          } else {
            Alert.alert('Activity', error, [{ text: 'OK', onPress: () => this.setState({ isLoading: false }) }]);
          }
        },
      };
      this.props.onGetPostEvent(req);
    }
  };
  //--

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
      this.onMediaUploadWarningPopup('leave');
    }

    if (option.label === 'End Event') {
      setTimeout(() => {
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
                this.onMediaUploadWarningPopup('end');
              },
            },
          ],
          { cancelable: false }
        );
      }, 500);
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
        title: 'Build your journey with Tellascape.',
      });
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
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
        status: pendingStatus,
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
      // let imageWidth = image.width;
      // let imageHeight = image.height;
      // let imageNewWidth = Math.ceil((imageWidth / 3.4) * 2);
      // let imageNewHeight = Math.ceil((imageHeight / 3.4) * 2);
      // ImageResizer.createResizedImage(
      //   image.path,
      //   imageNewWidth,
      //   imageNewHeight,
      //   'JPEG',
      //   Platform.OS === 'android' ? 100 : 1
      // ).then(response => {
      //   const { uri } = response;
      this.uploadEventImage(image.path);
      // });
    });
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

  /* Method is outdated. */
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

  onTogglePhotoMoreModal = () => {
    this.setState(prevState => ({
      isPhotoMoreModalVisible: !prevState.isPhotoMoreModalVisible,
    }));
  };

  onPressPhotoMoreModal = value => {
    this.onTogglePhotoMoreModal();
    const { selectedFilter, selectedEntryIndex } = this.state;
    const { trending, my_experience, other_experience, parentID } = this.props.event_data[0];
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
        case 'download':
          this.handleDownload(mediaData[selectedEntryIndex]);
          break;
        case 'upload':
          this.onUploadPhoto();
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
        onFail: (error, code) => {
          this.setState({ isRefresh: false });
          if (code === 500) {
            Alert.alert('Join Event', error, [
              { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
            ]);
          }
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
        onFail: (error, code) => {
          this.setState({ isRefresh: false });
          if (code === 500) {
            if (code === 500) {
              Alert.alert('Join Event', error, [
                { text: 'OK', onPress: () => this.onSelectMoreData({ label: 'Leave Event' }) },
              ]);
            }
          }
        },
      };
    }
    this.props.onGetPostEvent(req);
  };
  updateGhostStatus() {
    const { isGhostMode } = this.state;
    if (this.props.event_data.length > 0) {
      const ghostObj = new FormData();
      ghostObj.append('token', this.props.auth.access_token);
      ghostObj.append('parentID', this.props.event_data[0].parentID);
      ghostObj.append('status', isGhostMode);

      let obj = {
        formData: ghostObj,
        updateGhostSuccess: () => {
          this.setState({ isPrivayModalVisible: false });
        },
        updateGhostFailure: () => {},
      };
      this.props.onUpdateGhostMode(obj);
    }
  }

  onMediaUploadWarningPopup = type => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { parentID } = this.props.event_data[0];
      const { localExperience } = this.props.experience;
      let newArray = [...localExperience];
      newArray = newArray.filter((item, index) => {
        return item.parentID === parentID && (item.status === pendingStatus || item.status === startingStatus);
      });
      if (newArray.length > 0) {
        setTimeout(() => {
          Alert.alert(
            'Warning!',
            'We noticed some of your content has not yet been added to this experience. If you leave now that content will be lost.',
            [
              {
                text: 'Wait for content to upload',
                onPress: () => {},
              },
              {
                text: 'Leave anyway',
                onPress: () => {
                  if (type === 'leave') {
                    this.onLeaveExperience();
                  } else if (type === 'end') {
                    this.onEndExperience();
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }, 500);
      } else {
        if (type === 'leave') {
          this.onLeaveExperience();
        } else if (type === 'end') {
          this.onEndExperience();
        }
      }
    }
  };
  onLeaveExperience = () => {
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
    this.props.setActiveExperience(null);
    this.props.setLocalExperience([]);
    this.props.navigation.popToTop();
  };
  onEndExperience = async () => {
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
    this.props.setActiveExperience(null);
    this.props.setLocalExperience([]);
    this.props.navigation.popToTop();
  };

  onPressBlock = item => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoading: true });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        userID: item.userID,
        is_blocked: !item.is_blocked,
        token: this.props.auth.access_token,
        onSuccess: () => {
          this.setState({ isLoading: false });
          if (item.is_blocked) {
            Alert.alert('Unlock User', 'You have unblocked "' + item.users_name + '" to this event');
          } else {
            Alert.alert('Block User', 'You have blocked "' + item.users_name + '" to this event');
          }
        },
        onFail: () => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', 'Something went wrong. Please try again.');
        },
      };
      this.props.onBlockUser(obj);
    }
  };
  onPressRemove = item => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoading: true });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        userID: item.userID,
        token: this.props.auth.access_token,
        onSuccess: () => {
          this.setState({ isLoading: false });
          Alert.alert('Remove Guest', 'You removed "' + item.users_name + '" for this event');
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', msg);
        },
      };
      this.props.onRemoveGuest(obj);
    }
  };

  onPressProfile = userID => {
    if (userID !== DEFAULT_FOUNDER_ID) {
      this.props.setProfileLoad(false);
      this.props.navigation.push('ViewProfile', { uid: userID });
    }
  };

  onChangeTooltipVisibility = val => {
    this.setState({ isGuestTooltipVisible: val });
  };

  onMakeAdmin = item => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoading: true });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        uid: item.userID,
        token: this.props.auth.access_token,
        onSuccess: res => {
          this.setState({ isLoading: false });
          Alert.alert('Guest Admin', res.msg);
          let data = {
            is_blocked: item.is_blocked,
            name: item.users_name,
            photo: item.photo,
            uid: item.userID,
          };
          this.props.updateGuestAdmin(data);
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', msg);
        },
      };
      this.props.onAssignAdmin(obj);
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
      isRefresh,
      isActivity,
      mediaZoomSlideIndex,
      isVisibleGuestModal,
      selectGuestUser,
      isGuestTooltipVisible,
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
        founder_uid,
        guest_admin_uid,
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
        event_size,
        weather,
        hasAnonymous,
        is_live,
        ghost_status,
        host_ghost_status,
        isFounderJoined,
        guest_admin,
      } = this.props.event_data[0];
      const { localExperience } = this.props.experience;

      let tempCoordinate = my_experience.length > 0 ? my_experience : trending.length > 0 ? trending : [];
      let coordinate = [];
      tempCoordinate.map((item, index) => {
        if (item && item.lat && item.lng) {
          let obj = { latitude: item.lat, longitude: item.lng };
          coordinate.push(obj);
        }
      });

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
      // = otherUserID === null ? my_experience : other_experience;

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
      let guestData = [];
      let peopleData = [...people_may_know];
      let otherData = [...Others];
      let guestAdminID = '';
      if (!_.isEmpty(guest_admin)) {
        guestAdminID = guest_admin.uid;
        guestData.push({
          first_name: guest_admin.name,
          profile_img: guest_admin.photo,
          userID: guest_admin.uid,
        });
        peopleData = peopleData.filter(item => item.userID !== guest_admin.uid);
        otherData = otherData.filter(item => item.userID !== guest_admin.uid);
      }
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
              onPressMarker={this.onPressMarker}
            />
          </StyledMapContainer>

          {/** Header */}
          <LiveHeader
            onGoBack={this.onGoBack}
            name={`${founder}`}
            avatarSource={{ uri: founder_photo }}
            title={title.length < 20 ? title : title.substring(0, 19) + '...'}
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
          {this.props.experience.joinEventClose === null || mediaButtonType === -1 ? (
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

          {/** For 3 tabs */}
          {mediaButtonType !== -1 && this.props.experience.joinEventClose !== null ? (
            <StyledWrapper flex={1} backgroundColor={mediaButtonType === -1 ? 'transparent' : '#d9d9d9'}>
              {/** View Media */}
              {mediaButtonType === 0 ? (
                <ViewMedia
                  refer={vm => {
                    this._carouselvm = vm;
                  }}
                  optionsData={MEDIA_FILTER_DATA}
                  mediaData={mediaData}
                  selectedEntryIndex={
                    selectedFilter === 'trending'
                      ? mediaData.length - 1 >= selectedEntryIndex
                        ? selectedEntryIndex
                        : 0
                      : selectedEntryIndex
                  }
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
                  onRefresh={this.onRefresh}
                  paused={paused}
                  onChangePaused={this.onChangePaused}
                  uid={this.props.auth.uid}
                  founder_uid={founder_uid}
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
                  otherData={otherData}
                  peopleData={peopleData}
                  guestData={guestData}
                  guestAdminID={guestAdminID}
                  toExperience={item => {
                    this.onUserExperience(item);
                  }}
                  onGuestPress={item => {
                    if (item.userID === founder_uid || (guestData.length > 0 && guestData[0].userID === item.userID)) {
                      this.onUserExperience(item);
                    } else {
                      this.setState({ isVisibleGuestModal: true, selectGuestUser: item });
                    }
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
                  onPressBlock={this.onPressBlock}
                  onPressRemove={this.onPressRemove}
                  isActionButtons={
                    isGuestAdmin(this.props.auth, this.props.event_data[0]) || founder_uid === this.props.auth.uid
                  }
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
            mediaTitle={this.state.mediaTitle}
            placeholder={'Media Description'}
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
                : founder_uid === this.props.auth.uid || isGuestAdmin(this.props.auth, this.props.event_data[0])
                ? selectedFilter === 'experience'
                  ? PHOTO_MORE_MODAL_MEDIA_DEFAULT
                  : PHOTO_MORE_DELETE_MODAL
                : selectedFilter === 'experience'
                ? PHOTO_MORE_MODAL_EXPERIENCE
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

          <UserPopup
            data={selectGuestUser}
            visible={isVisibleGuestModal}
            auth={this.props.auth}
            founder_uid={founder_uid}
            onClose={() => this.setState({ isVisibleGuestModal: false })}
            onPressProfile={this.onPressProfile}
            onPressBlock={this.onPressBlock}
            onPressRemove={this.onPressRemove}
            onMakeAdmin={this.onMakeAdmin}
            guest_admin={guest_admin}
            isTooltipVisible={isGuestTooltipVisible}
            onChangeTooltipVisibility={this.onChangeTooltipVisibility}
            onPressViewExperience={this.onUserExperience}
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
                        this.setState({ isGhostMode: !isGhostMode }, () => {
                          this.updateGhostStatus();
                        });
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
          {/* {this.renderZoomModel()} */}
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
  modalContainer: {
    width: wp('60%'),
    backgroundColor: 'white',
    paddingLeft: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('0.5%'),
    borderRadius: wp('4%'),
    alignSelf: 'center',
  },
  avtarMainContainer: {
    alignItems: 'center',
    paddingRight: wp('10%'),
    paddingLeft: wp('5%'),
    marginBottom: hp('2%'),
  },
  avatarContainer: {
    borderWidth: wp('0.5%'),
    padding: wp('0.25%'),
    borderRadius: wp('10%'),
    borderColor: colors.Orange,
  },
  avatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('10%'),
  },
  usernameStyle: {
    fontFamily: font.MMedium,
    fontSize: wp('3.7%'),
    marginTop: hp('0.5%'),
  },
  statusStyle: {
    color: '#fe847c',
    fontFamily: font.MMedium,
    fontWeight: '600',
    marginTop: hp('0.5%'),
  },
  popupLabelContainer: {
    borderTopColor: '#DEDEDE',
    borderTopWidth: 0.5,
    paddingVertical: hp('1.4%'),
    flexDirection: 'row',
  },
  popupLabelStyle: {
    fontFamily: font.MMedium,
    fontSize: wp('3.8%'),
    color: '#282828',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  popupSuffixContainer: {
    backgroundColor: '#DEDEDE',
    width: wp('5%'),
    height: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('5%'),
    marginRight: wp('3%'),
  },
  tooltipText: {
    fontFamily: font.MRegular,
    lineHeight: hp('2.5%'),
  },
  tooltipContainer: {
    backgroundColor: '#FFF7E1',
    paddingHorizontal: wp('3%'),
    marginHorizontal: wp('10%'),
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
    videoProcess: state.experience.videoProcess,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPostEvent: obj => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    onGuestLists: obj => {
      dispatch(ExperienceActions.getGuestLists(obj));
    },
    onLeaveEvent: obj => {
      dispatch(ExperienceActions.leaveEvent(obj));
    },
    onDeleteEvent: obj => {
      dispatch(ExperienceActions.deleteEvent(obj));
    },
    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    setActiveExperience: obj => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },

    uploadVideo: obj => {
      dispatch(ExperienceActions.uploadVideo(obj));
    },
    uploadImage: obj => {
      dispatch(ExperienceActions.uploadImage(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },

    // View Meida
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
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    onUpdateGhostMode: obj => {
      dispatch(ExperienceActions.updateGhostMode(obj));
    },
    onBlockUser: obj => {
      dispatch(ExperienceActions.blockUser(obj));
    },
    onRemoveGuest: obj => {
      dispatch(ExperienceActions.deleteInvite(obj));
    },
    onAssignAdmin: obj => {
      dispatch(ExperienceActions.assignAdmin(obj));
    },
    updateGuestAdmin: obj => {
      dispatch(ExperienceActions.updateGuestAdmin(obj));
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
)(JoinEvent);
