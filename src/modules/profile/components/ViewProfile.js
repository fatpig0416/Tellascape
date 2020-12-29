import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  View,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import ProgressiveImage from '../../experience/components/organisms/ProgressiveImage';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector';
import TimeAgo from 'react-native-timeago';
import { BlurView } from '@react-native-community/blur';
import ExperienceCard from './organisms/ExperienceCard';
import firebase from 'react-native-firebase';
// import actions and reselect
import { connect } from 'react-redux';
import ExperienceActions from '../../experience/reducers/event';
import StationActions from '../../experience/reducers/station';
import MemoryActions from '../../experience/reducers/memory';
import AlertActions from '../../tellasafe/reducers/index';
// Load utils
import { Loading } from '../../../utils';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { isJoinedEvent, isJoinedStation, isJoinedMemory, getUserCurrentLocation } from '../../../utils/funcs';
import { DEFAULT_FOUNDER_ID } from '../../../utils/vals';
// Load theme
import theme from '../../core/theme';
const { colors, font, images, gradients, sizes } = theme;
// Lod common components
import {
  StyledButton,
  StyledText,
  StyledWrapper,
  StyledSeparator,
  StyledButtonOverlay,
} from '../../core/common.styles';
// Import organisms
import ExperienceFilter from './organisms/ExperienceFilter';
import FollowersModal from './organisms/FollowersModal';
import CommonModal from './organisms/CommonModal';
import ProfileLoader from './organisms/ProfileLoader';

const followersData = [];

const EXPERIENCE_MORE_MODAL = [{ label: 'Delete Experience', value: 'delete' }];
const EXPERIENCE_MORE_MODAL_ALERT = [
  { label: 'Delete Experience', value: 'delete' },
  { label: 'Edit Alert', value: 'edit' },
];

const StyledScrollView = styled.ScrollView`
  width: 100%;
  height: ${hp('79%')};
  background-color: #e8e8e8;
`;

const StyledPictureMask = styled.View`
  position: absolute;
  width: ${wp('22.5%')};
  height: ${wp('22.5%')};
  border-radius: ${wp('11.25%')};
  bottom: ${-wp('11.25%')};
  align-self: center;
  background-color: ${colors.White};
  justify-content: center;
`;

const StyledStatusIndicator = styled.View`
  width: 15;
  height: 15;
  border-radius: 7.5;
  background-color: #3ab1be;
  align-self: center;
`;

const StyledStatusIndicatorMask = styled.View`
  position: absolute;
  width: 20;
  height: 20;
  border-radius: 10;
  bottom: ${wp('1.25%')};
  right: ${wp('1.25%')};
  background-color: ${colors.White};
  justify-content: center;
`;

const StyledUsernameWrapper = styled.View`
  position: absolute;
  width: 100%;
  bottom: ${wp('15%')};
`;

const StyledUsername = styled.Text`
  margin-top: ${hp('11%')};
  color: ${colors.White};
  font-size: ${wp('6%')};
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5;
  font-family: ${font.MBlack};
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

const StyledAvatar = styled(FastImage)`
  width: ${wp('21.5%')};
  height: ${wp('21.5%')};
  border-radius: ${wp('10.75%')};
  align-self: center;
`;

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
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-left: ${wp('2%')};
  margin-right: ${hp('2%')};
  margin-bottom: ${hp('1%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
`;

const StyledCardView = styled.View`
  width: ${wp('95.56%')};
  margin-left: ${wp('2.22%')};
  margin-bottom: ${wp('2.22%')};
  background-color: ${colors.White};
  box-shadow: 0px 12px 20px rgba(90, 97, 105, 0.12);
  border-radius: 15;
`;

const StyledBoldText = styled.Text`
  font-size: ${props => props.fontSize || wp('3.055%')};
  color: #000000;
  font-family: ${font.MMedium};
  letter-spacing: ${props => props.letterSpacing || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  text-align: center;
`;

const StyledNormalText = styled.Text`
  font-size: ${wp('3.055%')};
  color: #7b7b7b;
  font-family: ${font.MRegular};
  letter-spacing: ${props => props.letterSpacing || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const StyledBioText = styled.Text`
  font-size: ${wp('3.055%')};
  color: #3ab1be;
  font-family: ${font.MSemiBold};
`;

const StyledExperienceAvatar = styled(FastImage)`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
`;

const StyledEventTypeWraper = styled.View`
  position: absolute;
  right: ${wp('-1.05%')};
  bottom: 0;
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('4.2%')};
  height: ${wp('4.2%')};
  border-radius: ${wp('2.1%')};
`;

const StyledPageWrapper = styled.View`
  margin-top: 90;
`;

const StyledCategoryWrapper = styled.View`
  width: 100%;
  background-color: #e6e6e6;
  margin-top: -15;
  border-top-left-radius: ${wp('8%')};
  border-top-right-radius: ${wp('8%')};
  padding-bottom: ${wp('8%')};
`;

const StyledCategoryHeader = styled.Text`
  color: #212121;
  font-family: ${font.MBold};
  font-size: 22;
  font-weight: 500;
  margin-left: 20;
  margin-top: 20;
`;

const StyledPlusButton = styled.TouchableOpacity`
  width: 58;
  height: 58;
  border-radius: 29;
  justify-content: center;
  align-items: center;
  margin-top: 15;
  margin-left: 15;
  margin-top: 35;
  border-radius: 35;
  border-width: 2;
  border-color: #878787;
  background-color: #41cabf;
  overflow: hidden;
`;

const StyledFlatListWrapper = styled.View`
  margin-top: 20;
  padding-top: 10;
  padding-bottom: 10;
  padding-bottom: 10;
`;

const StyledFollowersWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${wp('3.1%')};
  margin-top: ${wp('3.1%')};
  margin-left: ${wp('3.1%')};
`;

const StyledFollowerName = styled.Text`
  font-family: ${font.MBold};
  font-weight: 400;
  font-size: ${wp('5.1%')};
  margin-left: ${wp('3.1%')};
`;

const StyledUserPhoto = styled(FastImage)`
  width: 54;
  height: 54;
  border-radius: 27;
`;

const returnImage = user_id => {
  return `https://tellascape.s3.us-east-2.amazonaws.com/user_media/${user_id}/pr.jpg`;
};

const FollowersRow = ({ data }) => {
  return (
    <StyledFollowersWrapper>
      <StyledUserPhoto source={{ uri: returnImage(data.user_dir) }} />
      <StyledFollowerName>{data.users_name}</StyledFollowerName>
    </StyledFollowersWrapper>
  );
};

const StyledsearchInputWrapper = styled.View`
  flex-direction: row;
  margin-top: ${wp('5.1%')};
  width: 95%;
  background-color: #d4d4d4;
  align-self: center;
  padding-top: ${wp('3.1%')};
  padding-bottom: ${wp('3.1%')};
  border-radius: ${wp('2.1%')};
`;

const StyledSearchInput = styled.TextInput`
  font-family: ${font.MBold};
  font-weight: 500;
  font-size: ${wp('5%')};
  padding-left: ${wp('3.1%')};
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
`;

const BackButton = props => (
  <StyledButton marginLeft={-12} {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={sizes.xlargeIconSize} color={'#ffffff'} />
  </StyledButton>
);

const MoreButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={sizes.xlargeIconSize} color={'#ffffff'} />
  </StyledButton>
);

const StyledEidtText = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: #ffffff;
  font-family: ${font.MSemiBold};
`;

const StyledHeaderName = styled.Text`
  font-size: ${hp('2.5%')};
  color: #ffffff;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const StyledHeaderUsername = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #ffffff;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const HeaderText = props => (
  <StyledWrapper secondary={'center'}>
    <StyledHeaderUsername>{props.userName}</StyledHeaderUsername>
    <StyledHeaderName>{props.name}</StyledHeaderName>
  </StyledWrapper>
);

const StyledEditButton = styled.TouchableOpacity`
  width: ${wp('30.5%')};
  height: ${wp('8.3%')};
  border-radius: ${wp('4.15%')};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${'#f5f5f5'};
`;

const EditButton = props => (
  <StyledEditButton {...props}>
    <CustomIcon name={props.iconName} size={sizes.smallIconSize} color={'#3AB1BE'} />
    <StyledBoldText marginLeft={sizes.smallPadding} style={{ color: props.color || '#000000' }}>
      {props.buttonText}
    </StyledBoldText>
  </StyledEditButton>
);

const StyledFollowerButton = styled.TouchableOpacity`
  align-items: center;
  margin-left: ${wp('3.125%')};
  margin-right: ${wp('3.125%')};
`;

const FollowerButton = props => (
  <StyledFollowerButton {...props} alignItems={'center'}>
    <StyledBoldText>{props.count}</StyledBoldText>
    <StyledNormalText>{props.label}</StyledNormalText>
  </StyledFollowerButton>
);

const PROFILE_FILTER_OPTIONS = [
  { id: 0, label: 'ALL EXPERIENCES', value: null },
  { id: 1, label: 'EVENTS', value: 'event' },
  { id: 2, label: 'MEMORIES', value: 'memory' },
  { id: 3, label: 'STATIONS', value: 'station' },
];

const StyledPermissionText = styled.Text`
  font-size: ${wp('3.88%')};
  color: #fff;
  font-family: ${font.MMedium};
  text-align: center;
  margin-top: ${wp('2.22%')};
`;

const FilterCard = ({ options, value, onPress, onChanged, isExpand }) => {
  let newData = options.filter(item => item.value !== value);
  let index = options.findIndex(item => item.value === value);
  return (
    <View style={{ alignItems: 'center', width: '100%', paddingVertical: wp('2%') }}>
      <TouchableOpacity onPress={onPress} style={styles.filterHeaderContainer}>
        <Text style={styles.filterHeaderText}>{index !== -1 ? options[index].label : ''}</Text>
        <CustomIcon name={!isExpand ? 'expand_more-24px' : 'expand_less-24px'} size={20} color={'#707070'} />
      </TouchableOpacity>
      {isExpand &&
        newData &&
        newData.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => onChanged(item.value)}
              style={styles.filterTextContainer}
            >
              <Text style={styles.filterOptionText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

class ViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      isFollowed: false,
      isModalVisible: false,
      isFeedbackModalVisible: false,
      isFollowersModalVisible: false,
      isFollowingModalVisible: false,
      isBlockedUsersModalVisible: false,
      otherProfileAction: [
        {
          key: 0,
          label: 'Report',
        },
        {
          key: 1,
          label: 'Block User',
        },
      ],

      isMoreModalVisible: false,
      isLoading: false,
      isExperienceMoreModalVisible: false,
      selectedItem: null,
      pausedVideo: false,
      isLoadMore: false,
      isStop: false,
      isRefresh: false,
      isProfileAvatarError: false,
      isFilterExpand: false,
    };
    this.page = 0;
    this.myProfileAction = [
      {
        key: 0,
        label: 'Edit Profile',
      },
      {
        key: 2,
        label: 'Blocked Users',
      },
      // {
      //   key: 3,
      //   label: 'Help',
      // },
      {
        key: 4,
        label: 'Feedback',
      },
      {
        key: 5,
        label: 'Log Out',
      },
    ];
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.onGetProfileData();
    });
    this.willBlurListener = this.props.navigation.addListener('willBlur', this.setComponentIsBlur);
  }

  componentWillMount() {
    this.onGetProfileData();
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  setComponentIsBlur = () => {
    this.setState({ pausedVideo: true });
  };

  onGetProfileData = () => {
    this.setState({ pausedVideo: false });
    this.loadData(0, false);
  };

  loadData = async (page, refresh) => {
    let user_id;
    if (this.props.profileData !== null) {
      user_id = this.props.profileData.profile.uid;
    } else {
      user_id = this.props.uid;
    }
    if (this.props.navigation.getParam('uid') !== undefined) {
      user_id = this.props.navigation.getParam('uid');
    }

    this.setState({ isLoadMore: true, isRefresh: refresh });
    const obj = {
      token: this.props.access_token,
      uid: user_id,
      index: page,
      profileDataSuccess: this.onProfileDataSuccess,
      profileDataFailure: this.onProfileDataFailure,
    };
    this.props.onGetProfileData(obj);
  };

  onLoadMore = () => {
    if (!this.state.isLoadMore && !this.state.isStop) {
      this.loadData(this.page, false);
    }
  };

  onSelect = option => {
    this.setState({
      selected: option,
    });
  };

  onDeleteExperience = item => {
    this.setState({ selectedItem: item });
    this.onToggleMoreExperienceModal();
  };
  deleteExperience = item => {
    const { type, postID } = item;
    const { activeStation } = this.props.station;
    const { activeMemory } = this.props.memory;
    const { activeExperience } = this.props.experience;

    Alert.alert('Delete', 'Do you really wants to remove this experience ?', [
      {
        text: 'Dismiss',
        onPress: () => {
          this.onToggleMoreExperienceModal();
        },
      },
      {
        text: 'OK',
        onPress: async () => {
          this.onToggleMoreExperienceModal();
          let location = await getUserCurrentLocation();
          this.setState({ isLoading: true });
          if (type === 'event') {
            let obj = {
              token: this.props.access_token,
              parentID: postID,
              uid: this.props.uid,
              location: location,
              onSuccess: () => {
                if (activeExperience && activeExperience != null && activeExperience.parentID === postID) {
                  this.props.setActiveExperience(null);
                }
                this.setState({ isLoading: false });
              },
              onFail: msg => {
                this.setState({ isLoading: false });
                Alert.alert('Delete Experience', msg);
              },
            };
            this.props.onRemoveEvent(obj);
          } else if (type === 'station') {
            let obj = {
              token: this.props.access_token,
              parentID: postID,
              uid: this.props.uid,
              location: location,
              onSuccess: () => {
                if (activeStation && activeStation != null && activeStation.parentID === postID) {
                  this.props.setActiveStation(null);
                }
                this.setState({ isLoading: false });
              },
              onFail: msg => {
                this.setState({ isLoading: false });
                Alert.alert('Delete Experience', msg);
              },
            };
            this.props.onDeleteStation(obj);
          } else if (type === 'memory') {
            let obj = {
              token: this.props.access_token,
              parentID: postID,
              uid: this.props.uid,
              location: location,
              onSuccess: () => {
                if (activeMemory && activeMemory != null && activeMemory.parentID === postID) {
                  this.props.setActiveMemory(null);
                }
                this.setState({ isLoading: false });
              },
              onFail: msg => {
                this.setState({ isLoading: false });
                Alert.alert('Delete Experience', msg);
              },
            };
            this.props.onDeleteMemory(obj);
          } else if (type == 'alert') {
            const obj = {
              parentID: postID,
              token: this.props.access_token,
              uid: this.props.uid,
              _method: 'DELETE',
              onSuccess: () => {
                this.setState({ isLoading: false });
              },
              onFail: msg => {
                this.setState({ isLoading: false });
                Alert.alert('Delete Experience', msg);
              },
            };
            this.props.onDeleteAlert(obj);
          }
        },
      },
    ]);
  };
  onProfileDataSuccess = response => {
    if (response.data.length === 0) {
      this.setState({ isStop: true });
    }
    this.setState({ isLoadMore: false, isRefresh: false });
    this.page = this.page + 80;
  };
  onProfileDataFailure = error => {
    this.setState({ isLoadMore: false, isRefresh: false });
    Alert.alert('Profile', error, [{ text: 'OK', onPress: () => this.props.navigation.goBack() }]);
  };

  onEventPress = async item => {
    this.setState({ pausedVideo: true });
    const { uid, first_name } = this.props.profileData.profile;
    if (item.type === 'event') {
      const { privateJoinedEvents } = this.props.experience;
      let index = -1;
      if (privateJoinedEvents && privateJoinedEvents.length > 0) {
        index = privateJoinedEvents.findIndex(item => item.parentID === item.postID);
      }
      if (item.is_verify_pin && item.userID !== this.props.uid && index === -1) {
        let obj = {
          parentID: item.postID,
          childID: item.childID,
          title: item.title,
          name: item.name,
          type: item.type,
          description: item.description,
          sDate: item.sDate,
          photo: item.iUrl,
          userImage: item.uUrl,
          eDate: item.eDate,
          is_deleted: item.is_deleted,
          navigationType: 'profile',
          is_secret: item.is_secret,
        };
        this.props.navigation.navigate('VerifyPin', {
          data: obj,
        });
      } else {
        this.props.setEventLoad(false);
        let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, item.postID, item.childID);
        if (!isJoin) {
          let now = moment().format('YYYY-MM-DD HH:mm:ss');
          let sDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
          let eDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
          if (now > eDate || item.is_deleted === 1 || item.is_deleted === true) {
            // Post Event
            this.props.navigation.navigate('PostEvent', {
              parentID: item.postID,
              childID: item.childID,
              route_type: 'user_experience',
              user_id: uid,
              first_name: first_name,
            });
          } else if (now > sDate && now < eDate) {
            // Live Event
            this.props.navigation.navigate('LiveEvent', {
              parentID: item.postID,
              childID: item.childID,
              route_type: 'user_experience',
              user_id: uid,
              first_name: first_name,
            });
          } else {
            // View EVent
            this.props.navigation.navigate('ViewEvent', {
              parentID: item.postID,
              childID: item.childID,
            });
          }
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
            route_type: 'user_experience',
            user_id: uid,
            first_name: first_name,
          });
        } else {
          this.props.navigation.navigate('LiveStation', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: uid,
            first_name: first_name,
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
            route_type: 'user_experience',
            user_id: uid,
            first_name: first_name,
          });
        } else {
          this.props.navigation.navigate('LiveMemory', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: uid,
            first_name: first_name,
          });
        }
      }
    } else if (item.type === 'alert') {
      if (item.is_ended === 1) {
        Alert.alert('Alert', 'Alert is already ended, click on "Okay" to remove the experience', [
          {
            text: 'Okay',
            onPress: () => {
              const obj = {
                parentID: item.postID,
                token: this.props.access_token,
                uid: this.props.uid,
                _method: 'DELETE',
                onSuccess: () => {
                  this.props.navigation.popToTop();
                },
                onFail: msg => {
                  this.setState({ isLoading: false });
                  Alert.alert('Delete Experience', msg);
                },
              };
              this.props.onDeleteAlert(obj);
            },
          },
        ]);
      } else {
        this.props.navigation.navigate('Explore', { routeData: { parent_id: item.postID } });
      }
    }
  };

  onOtherSelectMoreData = option => {
    if (option.label === 'Report') {
      this.toggleReportModal();
    }
    if (option.label === 'Block') {
      const profileData = this.props.profileData;
      const obj = new FormData();
      obj.append('token', this.props.access_token);
      obj.append('uid', profileData.profile.uid);
      obj.append('_method', 'POST');
      this.props.onBlockProfile(obj);
    }
  };

  onSubmitReport = () => {
    const profileData = this.props.profileData;
    const obj = new FormData();
    obj.append('token', this.props.access_token);
    obj.append('_method', 'POST');
    obj.append('uid', profileData.profile.uid);
    obj.append('type', 'Profile');
    this.props.onReportProfile(obj);
    Alert.alert('Success', 'Profile report successfully submitted.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.toggleReportModal();
        },
      },
    ]);
  };

  onSubmitFeedback = () => {
    const obj = new FormData();
    obj.append('token', this.props.access_token);
    obj.append('_method', 'POST');
    obj.append('comment', this.state.feedbackDescription);
    obj.append('type', 'Feedback');
    this.props.onReportProfile(obj);
    Alert.alert('Success', 'Thanks for shared the feedback.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.toggleFeedbackModal();
        },
      },
    ]);
  };

  onMySelectMoreData = option => {
    const profileData = this.props.profileData;
    const { first_name, last_name, user_name, profile_img, profile_img_la } = profileData.profile;
    const { coverPhoto, tellus } = profileData;

    if (option.label === 'Feedback') {
      this.toggleFeedbackModal();
    }

    if (option.key === 1) {
      const obj = new FormData();
      obj.append('token', this.props.access_token);
      obj.append('uid', this.props.uid);
      obj.append('_method', 'POST');
      this.props.onSetProfileSettings(obj);
    }

    if (option.key === 2) {
      this.toggleBlockedUsersModal();
    }

    if (option.key === 5) {
      AsyncStorage.setItem('accessToken', '');
      this.props.navigation.navigate('Auth');
    }

    if (option.key === 0) {
      this.props.navigation.navigate('EditProfile', {
        data: {
          first_name,
          last_name,
          user_name,
          profile_img,
          coverPhoto,
          tellus,
          profile_img_la,
        },
      });
    }
  };

  followUser = user => {
    this.setState({ isLoading: true });
    const data = new FormData();
    data.append('token', this.props.access_token);
    data.append('action', '1');
    data.append('uid', user);
    let obj = {
      formData: data,
      onSuccess: response => {
        this.setState({ isLoading: false });
        Alert.alert('Tellascape', response.msg || 'follow request sent successfully.');
      },
      onFail: () => {
        this.setState({ isLoading: false });
      },
    };
    this.props.onFollowUser(obj);
  };

  unfollowUser = user => {
    Alert.alert('Unfollow this User?', "you will not have access to user's media anymore", [
      {
        text: 'Cancel',
      },
      {
        text: 'Unfollow',
        onPress: () => {
          const data = new FormData();
          data.append('token', this.props.access_token);
          data.append('action', 0);
          data.append('uid', user);
          let obj = {
            formData: data,
            onSuccess: () => {},
            onFail: () => {},
          };
          this.props.onFollowUser(obj);
        },
      },
    ]);
  };
  onOtherShowMoreList = () => {
    this.otherProfileSelector.open();
  };

  onMyShowMoreList = () => {
    // this.myProfileSelector.open();
    this.onToggleMoreModal();
  };

  reportModalView = () => (
    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>
      <StyledModalBodyWrapper>
        <StyledModalHeader>Report Profile</StyledModalHeader>
        <StyledTextInput
          editable
          multiline
          numberOfLines={4}
          placeholder="Please describe about the reported profile."
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

  feedbackModalView = () => (
    <Modal
      isVisible={this.state.isFeedbackModalVisible}
      onBackdropPress={() => this.setState({ isFeedbackModalVisible: false })}
      onRequestClose={() => this.setState({ isFeedbackModalVisible: false })}
    >
      <StyledModalBodyWrapper>
        <StyledModalHeader>Feedback</StyledModalHeader>
        <StyledTextInput
          editable
          multiline
          numberOfLines={4}
          placeholder="Write your valuable feedback..."
          placeholderTextColor={'rgb(167, 167, 167)'}
          onChangeText={text =>
            this.setState({
              feedbackDescription: text,
            })
          }
        />
        <GradientButton
          width={wp('72%')}
          height={hp('3.9%')}
          marginLeft={wp('4.5%')}
          onPress={() => {
            this.onSubmitFeedback();
          }}
          isActive={this.state.feedbackDescription}
        >
          {!this.state.loading ? (
            <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
              {'Submit Feedback'}
            </StyledText>
          ) : (
            <Loading />
          )}
        </GradientButton>
      </StyledModalBodyWrapper>
    </Modal>
  );

  blockedUsersModalView = (followers, first_name) => (
    <Modal
      isVisible={this.state.isBlockedUsersModalVisible}
      onBackdropPress={() => this.setState({ isBlockedUsersModalVisible: false })}
      style={styles.modal}
    >
      <StyledPageWrapper showsVerticalScrollIndicator={false}>
        <StyledCategoryWrapper>
          <StyledPlusButton
            onPress={() => this.setState({ isBlockedUsersModalVisible: false })}
            ref={ref => (this.touchable = ref)}
          >
            <StyledButtonOverlay start={{ x: 0.28, y: 0 }} end={{ x: 0.72, y: 1 }} colors={['#e6e6e6', '#e6e6e6']} />
            <CustomIcon name={'close-24px'} size={sizes.xlargeIconSize} color={colors.Grey} />
          </StyledPlusButton>
          <StyledCategoryHeader>{`${first_name}'s Followers`}</StyledCategoryHeader>
          <StyledsearchInputWrapper>
            <CustomIcon
              name={'Common-Search_20x20px'}
              size={sizes.normalIconSize}
              color={colors.Grey}
              style={{ marginLeft: 15 }}
            />
            <StyledSearchInput placeholder={'Search Users'} />
          </StyledsearchInputWrapper>
          <StyledFlatListWrapper>
            {/**
             */}
            <FlatList
              data={followers}
              renderItem={({ item }) => <FollowersRow data={item} />}
              keyExtractor={item => item.user_dir}
              ItemSeparatorComponent={() => <StyledSeparator width={'100%'} bgColor={'#d8d8d8'} />}
            />
          </StyledFlatListWrapper>
        </StyledCategoryWrapper>
      </StyledPageWrapper>
    </Modal>
  );

  toggleReportModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleFeedbackModal = () => {
    this.setState({ isFeedbackModalVisible: !this.state.isFeedbackModalVisible });
  };

  // toggleFollowersModal = () => {
  //   this.setState({ isFollowersModalVisible: !this.state.isFollowersModalVisible });
  // };

  toggleBlockedUsersModal = () => {
    this.setState({ isFollowersModalVisible: !this.state.isFollowersModalVisible });
  };

  goToJourney = profile => {
    let obj = {
      token: this.props.access_token,
      uid: profile.uid,
    };
    this.props.onGetProfileJourney(obj);
    this.props.navigation.navigate('Journey');
  };

  onGoBack = () => {
    this.props.navigation.goBack();
  };

  onChangeFilterOption = value => {
    this.setState({
      selected: value,
      isFilterExpand: false,
    });
  };

  onEditProfile = () => {
    const profileData = this.props.profileData;
    const { first_name, last_name, user_name, profile_img, age, gender, profile_img_la } = profileData.profile;
    const { coverPhoto, tellus } = profileData;

    this.props.navigation.navigate('EditProfile', {
      data: {
        first_name,
        last_name,
        user_name,
        profile_img,
        coverPhoto,
        tellus,
        age,
        gender,
        profile_img_la,
      },
    });
  };

  onToggleFollowersModal = () => {
    this.setState(prevState => ({
      isFollowersModalVisible: !prevState.isFollowersModalVisible,
    }));
  };

  onToggleFollowingModal = () => {
    this.setState(prevState => ({
      isFollowingModalVisible: !prevState.isFollowingModalVisible,
    }));
  };

  onToggleMoreModal = () => {
    this.setState(prevState => ({
      isMoreModalVisible: !prevState.isMoreModalVisible,
    }));
  };
  onToggleMoreExperienceModal = () => {
    this.setState(prevState => ({
      isExperienceMoreModalVisible: !prevState.isExperienceMoreModalVisible,
    }));
  };
  onPressMoreExperienceModal = value => {
    switch (value) {
      case 'delete':
        if (this.state.selectedItem != null) {
          this.deleteExperience(this.state.selectedItem);
        }
        break;
      case 'edit':
        this.onToggleMoreExperienceModal();
        const { postID, childID, title, description, category } = this.state.selectedItem;
        this.props.navigation.navigate('EditAlert', {
          parentID: postID,
          childID: childID,
          title: title,
          description: description,
          category: category,
          routeName: 'ViewProfile',
        });
        break;
      default:
        break;
    }
  };

  onPressMoreModal = value => {
    this.onToggleMoreModal();

    const profileData = this.props.profileData;
    const { first_name, last_name, user_name, profile_img, age, gender, profile_img_la } = profileData.profile;
    const { coverPhoto, tellus } = profileData;

    switch (value) {
      case 'private':
      case 'public':
        const obj = new FormData();
        obj.append('token', this.props.access_token);
        obj.append('uid', this.props.uid);
        obj.append('_method', 'POST');
        this.props.onSetProfileSettings(obj);
        break;
      case 'edit':
        this.props.navigation.navigate('EditProfile', {
          data: {
            first_name,
            last_name,
            user_name,
            profile_img,
            coverPhoto,
            tellus,
            age,
            gender,
            profile_img_la,
          },
        });
        break;
      case 'block':
        this.toggleBlockedUsersModal();
        break;
      case 'feedback':
        this.toggleFeedbackModal();
        break;
      case 'logout':
        firebase
          .auth()
          .signOut()
          .then(val => {
            AsyncStorage.setItem('accessToken', '');
            AsyncStorage.removeItem('user_name');
            this.props.navigation.navigate('Auth');
          })
          .catch(error => Alert.alert('Something went wrong!!'));
        break;

      default:
        break;
    }
  };

  renderFooter = () => {
    if (!this.state.isLoadMore) return null;
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  renderHeader = (profileData, followIndex) => {
    const { isProfileAvatarError, isFilterExpand } = this.state;
    const { is_follow, followers, followings, coverPhoto, is_private, tellus, total_count } = profileData;
    const {
      first_name,
      last_name,
      profile_img,
      user_name,
      uid,
      follower,
      following,
      profile_img_la,
      follower_request,
    } = profileData.profile;
    let isDefaultuid = false;
    if (uid === DEFAULT_FOUNDER_ID) {
      isDefaultuid = true;
    }
    let isRequestSend = false;
    if (is_private) {
      if (follower_request && follower_request !== null && follower_request.length > 0) {
        let index = follower_request.findIndex(item => item.uid === this.props.uid);
        if (index !== -1) {
          isRequestSend = true;
        }
      }
    }
    return (
      <StyledWrapper width={wp('100%')} backgroundColor={'white'} style={{ marginBottom: wp('2.22%') }}>
        <StyledWrapper>
          {coverPhoto !== null ? (
            <View style={styles.avtarContainer}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size={'small'} />
              </View>
              <FastImage source={{ uri: coverPhoto }} style={{ width: wp('100%'), height: hp('30%') }} />
            </View>
          ) : (
            <Image source={images.PROFILE_COVER} style={{ width: wp('100%'), height: hp('30%') }} />
          )}

          <StyledPictureMask>
            {profile_img_la !== null && !isProfileAvatarError ? (
              <View style={styles.avtarContainer}>
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size={'small'} />
                </View>
                <StyledAvatar
                  source={{ uri: profile_img_la, cached: 'reload' }}
                  resizeMode={'cover'}
                  onError={() => this.setState({ isProfileAvatarError: true })}
                />
              </View>
            ) : (
              <StyledAvatar source={images.PROFILE} resizeMode={'cover'} />
            )}
            <StyledStatusIndicatorMask>
              <StyledStatusIndicator />
            </StyledStatusIndicatorMask>
          </StyledPictureMask>
        </StyledWrapper>

        {/** Eidt && Journey buttons */}
        <StyledWrapper
          row
          width={'100%'}
          primary={'space-between'}
          secondary={'center'}
          paddingLeft={wp('6.66%')}
          paddingRight={wp('6.66%')}
          marginTop={hp('1.7%')}
        >
          {this.props.uid === uid ? (
            <EditButton iconName={'PE-Edit_20x20px'} buttonText={'Edit'} onPress={this.onEditProfile} />
          ) : isDefaultuid ? (
            <View style={{ height: wp('8.3%') }} />
          ) : followIndex === -1 ? (
            <EditButton
              iconName={'Pr-Follow_20x20px-Copy'}
              buttonText={'Follow'}
              onPress={() => {
                if (!isRequestSend) {
                  this.followUser(uid);
                }
              }}
              color={isRequestSend ? '#aaaaaa' : '#000000'}
            />
          ) : (
            <EditButton
              iconName={'Pr-Following_20x20px'}
              buttonText={'Following'}
              onPress={() => this.unfollowUser(uid)}
            />
          )}
          {!isDefaultuid && (
            <EditButton
              iconName={'Pr-SeeJourney_20x20px'}
              buttonText={'Journey'}
              onPress={() => this.goToJourney(profileData.profile)}
              disabled={followIndex === -1 && this.props.uid !== uid}
              color={followIndex === -1 && this.props.uid !== uid ? '#aaaaaa' : '#000000'}
            />
          )}
        </StyledWrapper>

        <StyledWrapper width={'100%'} row primary={'center'} marginTop={sizes.smallPadding}>
          <FollowerButton count={follower} label={'Followers'} onPress={this.onToggleFollowersModal} />
          <FollowerButton count={total_count} label={'Experiences'} />
          <FollowerButton count={following} label={'Following'} onPress={this.onToggleFollowingModal} />
        </StyledWrapper>

        {/** bio secton */}
        <StyledWrapper
          primary={'center'}
          secondary={'center'}
          paddingLeft={wp('4%')}
          paddingRight={wp('4%')}
          marginBottom={sizes.normalPadding}
          marginTop={sizes.smallPadding}
          width={'100%'}
        >
          {tellus ? <StyledNormalText>{tellus}</StyledNormalText> : <StyledBioText />}
        </StyledWrapper>

        <StyledSeparator width={wp('100%')} bgColor={'#000'} opacity={0.3} height={1} />
        <StyledWrapper width={'100%'}>
          <FilterCard
            options={PROFILE_FILTER_OPTIONS}
            value={this.state.selected}
            onChanged={this.onChangeFilterOption}
            isExpand={this.state.isFilterExpand}
            onPress={() => this.setState({ isFilterExpand: !isFilterExpand })}
          />
        </StyledWrapper>
      </StyledWrapper>
    );
  };

  render() {
    const profileData = this.props.profileData;
    const {
      isFollowersModalVisible,
      isFollowingModalVisible,
      isMoreModalVisible,
      isLoading,
      isExperienceMoreModalVisible,
      selectedItem,
      pausedVideo,
      isRefresh,
    } = this.state;
    if (this.props.experience.isProfileLoad && profileData && profileData !== null) {
      let filteredData =
        profileData &&
        profileData.data.filter(event => {
          if (this.state.selected !== null) {
            return event.type === this.state.selected;
          }
          return event;
        });
      const {
        first_name,
        last_name,
        profile_img,
        user_name,
        uid,
        follower,
        following,
        profile_img_la,
      } = profileData.profile;
      const { is_follow, followers, followings, coverPhoto, is_private, tellus, total_count } = profileData;
      let followIndex = profileData.followers.findIndex(item => item.uid === this.props.uid);
      let isPossibleToSee = followIndex !== -1;
      if (this.props.uid === uid) {
        isPossibleToSee = true;
      }

      const moreModalData = [
        { label: 'Edit Profile', value: 'edit' },
        { label: 'Feedback', value: 'feedback' },
        { label: 'Log Out', value: 'logout' },
      ];

      if (is_private) {
        moreModalData.splice(1, 0, { label: 'Set as Public', value: 'public' });
      } else {
        moreModalData.splice(1, 0, { label: 'Set as Private', value: 'private' });
      }
      return (
        <StyledWrapper style={{ flex: 1, backgroundColor: '#e8e8e8' }}>
          <StyledHeader>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={gradients.BackgroundLightGreen}
              style={styles.headerContainer}
            >
              <SafeAreaView>
                <StyledWrapper row primary={'space-between'} secondary={'center'}>
                  <BackButton onPress={this.onGoBack} />
                  <HeaderText name={`${first_name} ${last_name}`} userName={`@${user_name}`} />
                  {this.props.uid === uid ? (
                    <ModalSelector
                      data={[
                        {
                          key: 0,
                          label: 'Edit Profile',
                        },
                        {
                          key: 1,
                          label: is_private === true ? 'Set as Public' : 'Set as Private',
                        },
                        // {
                        //   key: 2,
                        //   label: 'Blocked Users',
                        // },
                        // {
                        //   key: 3,
                        //   label: 'Help',
                        // },
                        {
                          key: 4,
                          label: 'Feedback',
                        },
                        {
                          key: 5,
                          label: 'Log Out',
                        },
                      ]}
                      onChange={this.onMySelectMoreData}
                      ref={selector => {
                        this.myProfileSelector = selector;
                      }}
                      customSelector={<MoreButton onPress={this.onMyShowMoreList} />}
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
                    <ModalSelector
                      data={this.state.otherProfileAction}
                      onChange={this.onOtherSelectMoreData}
                      ref={selector => {
                        this.otherProfileSelector = selector;
                      }}
                      customSelector={<MoreButton onPress={this.onOtherShowMoreList} />}
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
                  )}
                </StyledWrapper>
              </SafeAreaView>
            </LinearGradient>
          </StyledHeader>
          {filteredData && filteredData.length === 0 ? (
            <View style={{ flex: 1 }}>
              {this.renderHeader(profileData, followIndex)}
              <StyledWrapper style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <StyledBoldText fontSize={sizes.middleFontSize} marginBottom={hp('5%')}>
                  {this.props.uid !== uid && followIndex !== -1
                    ? 'No any experience created yet.'
                    : 'Create Your First \nExperience\n👇'}
                </StyledBoldText>
              </StyledWrapper>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              ListHeaderComponent={this.renderHeader(profileData, followIndex)}
              renderItem={({ item, index }) => (
                <ExperienceCard
                  item={item}
                  onEventPress={this.onEventPress}
                  onDeletePress={() => this.onDeleteExperience(item)}
                  uid={this.props.uid}
                  pausedVideo={pausedVideo}
                />
              )}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              scrollEnabled={isPossibleToSee}
              onEndReached={this.onLoadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={isRefresh}
                  onRefresh={() => {
                    this.setState({ isStop: false });
                    this.loadData(0, true);
                    this.page = 0;
                  }}
                />
              }
            />
          )}

          {!isPossibleToSee ? (
            <View style={styles.absolute}>
              <StyledWrapper marginTop={wp('22%')} secondary={'center'}>
                <CustomIcon name={'Pr-Follow_20x20px-Copy'} size={24} color={'#fff'} />
                <StyledPermissionText>{'Followers Only\nCan See Journey and Media'}</StyledPermissionText>
              </StyledWrapper>
            </View>
          ) : null}

          {this.reportModalView()}
          {this.feedbackModalView()}
          {this.blockedUsersModalView(followersData, first_name)}
          {followers.length > 0 && followers ? (
            <FollowersModal
              title={`${first_name}'s Followers`}
              navigation={this.props.navigation}
              isModalVisible={isFollowersModalVisible}
              data={followers}
              onToggleModal={this.onToggleFollowersModal}
            />
          ) : null}
          {followings.length > 0 && followings ? (
            <FollowersModal
              title={`${first_name}'s Followings`}
              navigation={this.props.navigation}
              isModalVisible={isFollowingModalVisible}
              data={followings}
              onToggleModal={this.onToggleFollowingModal}
            />
          ) : null}

          <CommonModal
            modalData={moreModalData}
            isModalVisible={isMoreModalVisible}
            isBlur={true}
            onCancelModal={this.onToggleMoreModal}
            onPressModalItem={this.onPressMoreModal}
          />
          <CommonModal
            modalData={
              selectedItem && selectedItem.type === 'alert' ? EXPERIENCE_MORE_MODAL_ALERT : EXPERIENCE_MORE_MODAL
            }
            isModalVisible={isExperienceMoreModalVisible}
            isBlur={true}
            onCancelModal={this.onToggleMoreExperienceModal}
            onPressModalItem={this.onPressMoreExperienceModal}
          />

          {isLoading && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.28)',
                justifyContent: 'center',
                alignContent: 'center',
                width: wp('100%'),
                height: hp('100%'),
              }}
            >
              <Loading />
            </View>
          )}
        </StyledWrapper>
      );
    } else {
      return <ProfileLoader />;
    }
  }
}

const mapStateToProps = state => {
  return {
    experience: state.experience,
    access_token: state.auth.access_token,
    profileData: state.experience.profileData,
    uid: state.auth.uid,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFollowUser: obj => {
      dispatch(ExperienceActions.followUser(obj));
    },
    onGetProfileData: obj => {
      dispatch(ExperienceActions.getProfileData(obj));
    },
    onReportProfile: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    onSetProfileSettings: obj => {
      dispatch(ExperienceActions.setProfileSettings(obj));
    },
    onBlockProfile: obj => {
      dispatch(ExperienceActions.blockProfile(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    onRemoveEvent: obj => {
      dispatch(ExperienceActions.removeEvent(obj));
    },
    setActiveExperience: obj => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    onDeleteStation: obj => {
      dispatch(StationActions.deleteStation(obj));
    },
    setActiveStation: obj => {
      dispatch(StationActions.setActiveStation(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    onDeleteMemory: obj => {
      dispatch(MemoryActions.deleteMemory(obj));
    },
    setActiveMemory: obj => {
      dispatch(MemoryActions.setActiveMemory(obj));
    },
    onDeleteAlert: obj => {
      dispatch(AlertActions.deleteAlert(obj));
    },
    onGetProfileJourney: obj => {
      dispatch(ExperienceActions.profileJourney(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPage);

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
  eventPostImage: {
    width: '100%',
    height: hp('35%'),
  },
  profilePicture: {
    width: 142,
    height: 142,
    borderRadius: 71,
    alignSelf: 'center',
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  timeAgo: {
    fontSize: hp('1.7'),
    fontFamily: font.MRegular,
    color: '#7b7b7b',
  },
  absolute: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'rgba(0,0,0,0.9)',
    top: hp('55%'),
  },
  flexContainerScroll: {
    flex: 1,
  },
  flexGrowContainerScroll: {
    flexGrow: 1,
  },
  avtarContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    position: 'absolute',
  },
  filterOptionText: {
    fontSize: wp('3.055%'),
    color: '#515151',
    fontFamily: font.MMedium,
    letterSpacing: 0.5,
  },
  filterTextContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: wp('1.6%'),
    borderTopWidth: wp('0.1%'),
    borderColor: 'grey',
  },
  filterHeaderText: {
    fontSize: wp('3.3%'),
    color: '#515151',
    fontFamily: font.MBold,
    letterSpacing: 0.5,
  },
  filterHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1'),
  },
});
