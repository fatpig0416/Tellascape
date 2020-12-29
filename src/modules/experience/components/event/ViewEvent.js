import React, { Component, useState } from 'react';
import { database, auth } from 'react-native-firebase';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Share,
  ActivityIndicator,
  Platform,
  Dimensions,
  FlatList,
  Modal,
  Keyboard,
  Alert,
  RefreshControl,
  Image as RNImage,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import MapArea from '../organisms/MapArea';
import ExperienceActions from '../../reducers/event/index';
import ExploreAction from '../../../home/reducers';
import MemoryActions from '../../reducers/memory';
import StationActions from '../../reducers/station';
import { Loading } from '../../../../utils';
import { facebookShare } from '../../../../utils/funcs';
import { isIphoneX } from 'react-native-iphone-x-helper';
import SwitchSelector from 'react-native-switch-selector';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import _ from 'lodash';
import {
  GiftedChat,
  Composer,
  Actions,
  InputToolbar,
  Bubble,
  Time,
  Avatar,
  utils,
  Message,
  Send,
  Day,
} from 'react-native-gifted-chat';
// Load common components
import {
  StyledHorizontalContainer,
  StyledText,
  StyledButton,
  StyledCenterContainer,
  StyledSeparator,
  StyledWrapper,
  StyledButtonOverlay,
} from '../../../core/common.styles';
// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, dimensions, images } = theme;
// Load CustomIcon from utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import moment from 'moment';

// Import organisms
import ViewEventHeader from '../organisms/ViewEventHeader';
import ViewEventCardHeader from '../organisms/ViewEventCardHeader';
import ReadMoreText from '../organisms/ReadMoreText';
import MessageSend from '../organisms/MessageSend';

const { width, height } = Dimensions.get('window');

const StyledCoverImage = styled(FastImage)`
  position: absolute;
  width: ${wp('100%')};
  height: ${wp('100%')};
`;

const StyledCardWrapper = styled.View`
  width: ${wp('95.56%')};
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
  background-color: #fff;
  border-radius: 15;
`;

const StyledTimeText = styled.Text`
  font-size: ${wp('3.055%')};
  font-family: ${font.MSemiBold};
  color: #fff;
`;
/*
  height: ${wp('4.44%')};
  position: absolute;
  top: -${wp('6.11%')};
  align-self: center;
  background: #ccc;
  text-shadow-color: rgba(0, 0, 0, 0.75);
  text-shadow-offset: {width: -1, height: 1};
  text-shadow-radius: 10
*/

const StyledAddressText = styled.Text`
  font-size: ${wp('3.05%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #515151;
  text-transform: uppercase;
`;

const StyledMapContainer = styled.View`
  width: 100%;
  height: ${wp('47.77%')};
  background-color: #000;
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
`;

const StyledMapWrapper = styled.View`
  width: 100%;
  height: ${wp('47.77%')};
  background-color: #000;
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  overflow: hidden;
`;

const InfoCard = (props) => {
  const { sDate, eDate, address, parentID } = props;
  return (
    <StyledCardWrapper marginTop={wp('42.22%')}>
      <View style={styles.timeStyle}>
        <StyledTimeText>
          {'  ' + moment(sDate).format('DD MMM YYYY hh:mm A')} : {moment(eDate).format('hh:mm A') + ' '}
        </StyledTimeText>
      </View>
      <ViewEventCardHeader {...props} />
      <StyledWrapper
        paddingLeft={wp('4.44%')}
        paddingRight={wp('4.44%')}
        marginBottom={address ? wp('9.72%') : wp('2.22%')}
      >
        <ReadMoreText content={props.eventDescription} />
      </StyledWrapper>
      <StyledMapContainer>
        <StyledMapWrapper>
          <MapArea parentID={parentID} eventType={'View'} />
        </StyledMapWrapper>
        {address ? (
          <View style={styles.addressStyle}>
            <StyledAddressText>{address}</StyledAddressText>
          </View>
        ) : null}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: wp('47.77%'),
          }}
        />
      </StyledMapContainer>
    </StyledCardWrapper>
  );
};

const StyledRSVPText = styled.Text`
  font-size: ${wp('4.44%')};
  color: #fe7f7e;
  font-family: ${font.MBlack};
`;

const StyledSwitchWrapper = styled.View`
  width: ${wp('43.6%')};
`;

const StyledInviteButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${-wp('5%')};
  align-self: center;
  width: ${wp('75.55%')};
  height: ${wp('10%')};
  align-items: center;
  justify-content: center;
  box-shadow: 4px 6px 27px rgba(40, 76, 98, 0.2);
`;

const StyledInviteText = styled.Text`
  font-size: ${wp('4.16%')};
  color: #fff;
  font-family: ${font.MBold};
  text-align: center;
`;

const InviteButton = (props) => {
  const { title = 'Guest List' } = props;
  return (
    <StyledInviteButton {...props}>
      <StyledButtonOverlay
        borderRadius={wp('5%')}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={gradients.Background}
      />
      <StyledInviteText>{title}</StyledInviteText>
    </StyledInviteButton>
  );
};

const StyledRsvpDescription = styled.Text`
  font-size: ${wp('3.88%')};
  font-family: ${font.MSemiBold};
  margin-left: ${wp('3.05%')};
`;

const StyledCardUserAvatarWrapper = styled.View`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  background-color: #fff;
  justify-content: center;
  align-items: center;
  margin-left: ${(props) => props.marginLeft || 0};
`;

const StyledCardUserAvatar = styled(FastImage)`
  width: ${wp('9.16%')};
  height: ${wp('9.16%')};
  border-radius: ${wp('4.58%')};
`;

const AavatarPiles = (props) => {
  const { avatarData } = props;
  let newData = avatarData.slice(0, 3);
  return (
    <StyledWrapper row>
      {newData.map((item, index) => {
        return (
          <StyledCardUserAvatarWrapper key={index.toString()} marginLeft={index === 0 ? undefined : -wp('4.44%')}>
            <StyledCardUserAvatar source={{ uri: item.photo }} />
          </StyledCardUserAvatarWrapper>
        );
      })}
    </StyledWrapper>
  );
};

const GuestAavatarPiles = (props) => {
  const { avatarData } = props;
  let newData = [];
  if (avatarData && avatarData.length > 7) {
    newData = avatarData.slice(0, 7);
  } else if (avatarData && avatarData.length > 0) {
    newData = avatarData;
  }
  return (
    <StyledWrapper row>
      {newData.map((item, index) => {
        return (
          <View
            key={index.toString()}
            style={{
              borderColor: colors.Orange,
              borderWidth: wp('0.5%'),
              borderRadius: wp('8%'),
              padding: wp('0.4%'),
            }}
          >
            <FastImage
              source={{ uri: item.photo }}
              style={{
                width: wp('9.5%'),
                height: wp('9.5%'),
                borderRadius: wp('8%'),
              }}
            />
          </View>
        );
      })}
    </StyledWrapper>
  );
};

const SWITCH_OPTIONS = [
  { label: 'Not Going', value: 'No' },
  { label: 'Going', value: 'going' },
];
const RsvpCard = (props) => {
  const { data, onInvite, onRSVPSelect, auth, founder, isPrivate } = props;
  const ans = data.filter((item) => item.userID === auth.uid);
  const [isGoing, setIsGoing] = useState(ans && ans.length > 0 && ans[0].answer === 'going' ? true : false);
  const selectedUsers = data.filter((ele) => ele.answer === 'going');
  const goingString = selectedUsers.length > 0 ? ' Going' : '';
  const verbString = selectedUsers.length >= 2 ? ' are' : ' is';
  let rsvpUserNames = '';
  selectedUsers.slice(0, 3).forEach((ele, index) => {
    rsvpUserNames += ele.users_name;
    if (index !== selectedUsers.length - 1) {
      rsvpUserNames += ', ';
    }
  });
  let rsvpDescription = '';
  if (selectedUsers.length > 3) {
    rsvpDescription = rsvpUserNames + ' and ' + `${selectedUsers.length - 3}` + ' others ' + verbString + goingString;
  } else {
    rsvpDescription = rsvpUserNames + verbString + goingString;
  }

  let isVisibleInviteButton = false;
  if (isPrivate && founder === auth.uid) {
    isVisibleInviteButton = true;
  } else if (!isPrivate) {
    isVisibleInviteButton = true;
  }

  return (
    <StyledCardWrapper marginTop={wp('4.44%')}>
      <StyledWrapper
        row
        primary={'space-between'}
        secondary={'center'}
        paddingLeft={wp('2.22%')}
        paddingRight={wp('2.22%')}
        paddingTop={wp('2.22%')}
        marginBottom={wp('8.61%')}
      >
        <StyledRSVPText>{'RSVP'}</StyledRSVPText>

        <StyledSwitchWrapper>
          <SwitchSelector
            options={SWITCH_OPTIONS}
            initial={isGoing ? 1 : 0}
            onPress={(val) => {
              setIsGoing((state) => !state);
              onRSVPSelect(val);
            }}
            buttonColor={'#ffffff'}
            backgroundColor={'#f5f5f5'}
            selectedColor={'#FF9076'}
            hasPadding={true}
            height={wp('8.33%')}
            textStyle={styles.switchNormalText}
            selectedTextStyle={styles.switchSelectedText}
            borderColor={'transparent'}
          />
        </StyledSwitchWrapper>
      </StyledWrapper>

      {selectedUsers.length > 0 ? (
        <StyledWrapper
          style={{ flex: 1 }}
          row
          secondary={'center'}
          paddingLeft={wp('2.22%')}
          marginBottom={wp('8.61%')}
        >
          <AavatarPiles avatarData={selectedUsers} />
          <StyledRsvpDescription style={{ flex: 1 }}>{rsvpDescription}</StyledRsvpDescription>
        </StyledWrapper>
      ) : null}
      {isVisibleInviteButton ? <InviteButton onPress={onInvite} /> : <View />}
    </StyledCardWrapper>
  );
};

const StyledChatcontainer = styled.View`
  width: ${wp('100%')};
  height: ${wp('115%')};
  background-color: #fdfefd;
  padding-bottom: 30;
`;

const StyledChatTitle = styled.Text`
  font-size: ${wp('3.05%')};
  font-family: ${font.MBold};
  color: #515151;
`;

const StyledMessageUserName = styled.Text`
  position: absolute;
  color: #8f8f8f;
  font-size: ${wp('2.78%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  top: -${wp('4%')};
  left: ${wp('3.33%')};
  opacity: 0.6;
`;

const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16;
  top: ${isIphoneX() ? 40 : 20};
  width: ${wp('9%')};
  height: ${wp('9%')};
  border-radius: ${wp('5%')};
  /* border-color: #fff; */
  /* border-width: 2; */
  justify-content: center;
  align-items: center;
`;

const ModalCloseButton = (props) => (
  <StyledModalCloseButton style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute' }} {...props}>
    <CustomIcon name={'Close_16x16px'} size={14} color={'white'} />
  </StyledModalCloseButton>
);

const GuestListCard = (props) => {
  const { guestList = [], onPressInvite, onRSVPSelect, auth, isInvite } = props;
  const ans = guestList.filter((item) => item.userID === auth.uid);
  const [isGoing, setIsGoing] = useState(ans && ans.length > 0 && ans[0].answer === 'going' ? true : false);
  const selectedUsers = guestList.filter((ele) => ele.answer === 'going');
  return (
    <StyledCardWrapper
      marginTop={wp('4.44%')}
      style={{
        paddingHorizontal: wp('2.22%'),
      }}
    >
      <StyledWrapper
        row
        primary={'space-between'}
        secondary={'center'}
        paddingTop={wp('2.22%')}
        marginBottom={wp('2.61%')}
      >
        <StyledRSVPText style={{ fontFamily: font.MBold, fontSize: wp('4.2%'), alignSelf: 'center' }}>
          {'RSVP'}
        </StyledRSVPText>
        <StyledSwitchWrapper style={{ alignSelf: 'flex-end', marginBottom: wp('2.61%') }}>
          <SwitchSelector
            options={SWITCH_OPTIONS}
            initial={isGoing ? 1 : 0}
            onPress={(val) => {
              setIsGoing((state) => !state);
              onRSVPSelect(val);
            }}
            buttonColor={'#ffffff'}
            backgroundColor={'#f5f5f5'}
            selectedColor={'#FF9076'}
            hasPadding={true}
            height={wp('8.33%')}
            textStyle={styles.switchNormalText}
            selectedTextStyle={styles.switchSelectedText}
            borderColor={'transparent'}
          />
        </StyledSwitchWrapper>
      </StyledWrapper>

      <StyledWrapper style={{ flex: 1 }} row secondary={'center'} marginBottom={wp('8.61%')}>
        <GuestAavatarPiles avatarData={selectedUsers} />
        {selectedUsers && selectedUsers.length > 7 && (
          <View style={styles.guestMoreCountWrapper}>
            <StyledRSVPText
              numberOfLines={1}
              style={{
                fontSize: wp('3.3%'),
                fontFamily: font.MBold,
                color: colors.Orange,
              }}
            >{`+${selectedUsers.length - 7}`}</StyledRSVPText>
          </View>
        )}
      </StyledWrapper>
      {isInvite && <InviteButton title={'Invite'} onPress={onPressInvite} />}
    </StyledCardWrapper>
  );
};

class ViewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPrivate: true,
      nextAvatar: 0,
      eventDetail: "I thought about going on an all-almonddiet. But that's just nuts.",
      eventTitle: 'Central Park Car Show',
      guests: [],
      firebaseRef: database().ref('Event' + '-' + this.props.navigation.getParam('parentID', 'Default')),
      viewEventSnapshot: null,
      isRSVP: null,
      selectedButton: '',
      isShowEmoji: false,
      msgText: '',
      messages: [],
      isLoading: false,
      isRefresh: false,
    };
    this.event = [];
    this.onRSVP = this.onRSVP.bind(this);
    this._handleInviteFriends = this._handleInviteFriends.bind(this);
  }

  // - Scenario: when user share the event and user click on event to open the view event
  UNSAFE_componentWillMount() {
    this._fetchData(false);
  }
  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }
  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData(true);
      }),
    ];
    this.refOn(this.state.firebaseRef, (message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  };
  _fetchData = (val) => {
    let obj = {
      parentID: this.props.navigation.getParam('parentID', 'Default'),
      token: this.props.auth.access_token,
      onGetEventSuccess: () => {},
      onFail: (error) => {},
    };
    this.props.onGetPostEvent(obj);
    this.props.onGuestLists(obj);
  };

  parse = (snapshot) => {
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

  refOn = (ref, callback) => {
    ref.limitToLast(20).on('child_added', (snapshot) => callback(this.parse(snapshot)));
  };

  timestamp() {
    return database.ServerValue.TIMESTAMP;
  }

  // send the message to firebase backend
  send = (messages) => {
    let isStart = this.isEventStarted();
    if (isStart !== undefined && !isStart) {
      for (let i = 0; i < messages.length; i++) {
        const { text, user } = messages[i];
        const message = {
          text,
          user,
          createdAt: this.timestamp(),
        };
        this.append(message);
      }
      Keyboard.dismiss();
    }
  };

  append = (message) => this.state.firebaseRef.push(message);

  refOff(ref) {
    ref.off();
  }
  firebaseInstance(parentID) {
    return database().ref('Event' + '-' + parentID);
  }
  componentWillUnmount() {
    this.setState({
      // firebaseRef: this.firebaseInstance(event_post_id),
      messages: [],
    });
    this.state.firebaseRef.off();
  }

  returnUserID() {
    return (auth().currentUser || {}).uid;
  }

  get user() {
    return {
      _id: this.returnUserID(),
      name: this.props.auth.first_name + ' ' + this.props.auth.last_name,
      avatar: this.props.auth.photo,
      id: this.returnUserID(),
    };
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  };

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;
    if (currText) {
      messageTextStyle = {
        fontSize: 12,
        lineHeight: Platform.OS === 'android' ? 34 : 20,
        color: 'black',
      };
    }

    return <Message {...props} messageTextStyle={messageTextStyle} />;
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendButtonWrapper}>
          <CustomIcon name={'arrow_forward-24px'} size={25} color={colors.DarkGrey} />
        </View>
      </Send>
    );
  }

  onNextAvatar = () => {
    if (this.avatarList) {
      this.avatarList.scrollToIndex({ index: this.state.nextAvatar });
    }
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    this.setState({
      nextAvatar: viewableItems[0].index + 1,
    });
  };

  onRSVP = (answer) => {
    let isStart = this.isEventStarted();
    if (this.props.event_data && this.props.event_data.length > 0 && isStart !== undefined && !isStart) {
      this.setState({ isLoading: true });
      const reqObj = {
        token: this.props.auth.access_token,
        parentID: this.props.event_data[0].parentID,
        answer: answer,
        onSuccess: () => {
          this.setState({ isLoading: false });
        },
        onFail: () => {
          this.setState({ isLoading: false });
        },
      };
      this.props.onAttendance(reqObj);
      this.setState({ hasAttendance: true, isRSVP: answer });
    }
  };

  _handleInviteFriends = ({ routeName = 'InviteFriend' }) => {
    let isStart = this.isEventStarted();
    if (isStart !== undefined && !isStart) {
      if (this.props.event_data && this.props.event_data.length > 0) {
        this.props.navigation.navigate(routeName, {
          parentID: this.props.event_data[0].parentID,
          childID: this.props.event_data[0].child_ID,
        });
      }
    }
  };

  onShareUrl = () => {
    let obj = {
      parentID: this.props.event_data[0].parentID,
      url: '-1',
      onSuccess: (res) => {
        this.onSocialMediaShare(res);
      },
      onFail: () => {},
    };
    this.props.onShareUrl(obj);
  };

  onSocialMediaShare = async (share_url) => {
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

  onFaceBookshare = async (share_url) => {
    try {
      if (this.props.event_data && this.props.event_data.length > 0) {
        let shareLinkContent = {
          contentType: 'link',
          quote: this.props.event_data[0].description,
          contentUrl: share_url,
          imageUrl: this.props.event_data[0].coverphoto,
          contentTitle: this.props.event_data[0].title,
          contentDescription: this.props.event_data[0].description,
        };
        facebookShare(shareLinkContent);
      }
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
    }
  };

  onEditEvent = () => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { parentID, child_ID, sDate, eDate, is_deleted } = this.props.event_data[0];
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let sD = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
      let eD = moment(eDate).format('YYYY-MM-DD HH:mm:ss');

      if (now > eD || is_deleted === 1 || is_deleted === true) {
        Alert.alert(
          'Post Event',
          'Does not allow to edit in post event',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.props.navigation.replace('PostEvent', {
                  parentID: parentID,
                  childID: child_ID,
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        let isStart = this.isEventStarted();
        if (isStart !== undefined && !isStart) {
          this.props.navigation.navigate('EditEvent', {
            parentID: parentID,
            childID: child_ID,
          });
        }
      }
    }
  };

  isEventStarted = () => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { parentID, child_ID, sDate, eDate, is_deleted, myChildID, centerPoint } = this.props.event_data[0];
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let sD = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
      let eD = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
      if (now > sD && now < eD) {
        Alert.alert(
          'Event',
          'Event is Live now, click "Okay" to continue join that event.',
          [
            {
              text: 'Okay',
              onPress: () => {
                this.setState({ isLoading: true });
                try {
                  const joinReqObj = new FormData();
                  joinReqObj.append('token', this.props.auth.access_token);
                  joinReqObj.append('parentID', parentID);
                  joinReqObj.append('myChildID', myChildID);
                  joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
                  let obj = {
                    joinObj: joinReqObj,
                    joinEventSuccess: (data) => {
                      this.setState({ isLoading: false });
                      let expObj = {
                        parentID: data.parentID,
                        childID: data.childID,
                      };
                      this.props.setActiveExperience(expObj);
                      this.props.setActiveStation(null);
                      this.props.setActiveMemory(null);
                      this.props.navigation.navigate('JoinEvent', expObj);
                    },
                    joinEventFailure: () => {
                      this.setState({ isLoading: false });
                      Alert.alert('Warning', "You can't join this event.");
                    },
                  };

                  this.props.onJoinEvent(obj);
                } catch (error) {
                  Alert.alert('Warning', "You can't join this event.");
                  this.setState({
                    isLoading: false,
                  });
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  onRSVPpressed = (response) => {
    return this.state.isRSVP !== null && this.state.isRSVP === response ? null : () => this.onRSVP(response);
  };

  componentDidMount() {}

  renderEmojiModal = () => {
    const { isShowEmoji } = this.state;
    return (
      <Modal visible={isShowEmoji} animationType={'fade'}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: hp('10%'), flex: 1 }}>
            <EmojiSelector
              onEmojiSelected={(emoji) => {
                this.setState((previousState) => ({
                  msgText: previousState.msgText + emoji,
                  isShowEmoji: false,
                }));
              }}
              showSearchBar={true}
              showTabs={true}
              showHistory={true}
              showSectionTitles={true}
              category={Categories.all}
            />
          </View>
          <ModalCloseButton
            onPress={() => {
              this.setState({ isShowEmoji: false });
            }}
          />
        </View>
      </Modal>
    );
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composerTextInput}
        stickSendButton={false}
        isAnonymous={this.state.isAnonymous}
      />
    );
  };

  renderActions = (props) => {
    return (
      <Actions
        {...props}
        containerStyle={styles.actionContainer}
        icon={() => (
          <View
            style={{
              height: 24,
              width: 24,
              marginTop: 6,
            }}
          >
            <CustomIcon name={'icon_smile'} size={24} color={'#878787'} />
          </View>
        )}
        onPressActionButton={() => {
          this.setState({ isShowEmoji: true });
        }}
      />
    );
  };

  renderInputToolbar(props) {
    return <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} />;
  }

  renderBubble(props) {
    return (
      <View style={{ marginBottom: wp('2%') }}>
        {props.currentMessage.user._id !== this.props.event_data[0].userID ? (
          <StyledMessageUserName>{props.currentMessage.user.name}</StyledMessageUserName>
        ) : null}

        {props.currentMessage.user._id !== this.props.event_data[0].userID ? (
          <StyledButtonOverlay
            borderRadius={15}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#fe7f7e', '#ffa06d']}
          />
        ) : null}
        <Bubble
          {...props}
          containerStyle={{
            left: {
              width: wp('69.1%'),
              padding: 0,
            },
            right: {
              width: wp('69.1%'),
              padding: 0,
            },
          }}
          wrapperStyle={{
            left: {
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              paddingTop: wp('3.33%'),
              paddingLeft: wp('3.33%'),
              paddingRight: wp('3.33%'),
              paddingBottom: wp('1.6%'),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            },
            right: {
              width: '100%',
              height: '100%',
              backgroundColor: '#E6E6E6',
              paddingTop: wp('3.33%'),
              paddingLeft: wp('3.33%'),
              paddingRight: wp('3.33%'),
              paddingBottom: wp('3.33%'),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            },
          }}
          textStyle={{
            left: {
              color: '#fff',
              fontSize: wp('3.33%'),
              fontFamily: font.MRegular,
              fontWeight: '500',
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              lineHeight: wp('5%'),
            },
            right: {
              color: '#212121',
              fontSize: wp('3.33%'),
              fontFamily: font.MRegular,
              fontWeight: '500',
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              lineHeight: wp('5%'),
            },
          }}
        />
      </View>
    );
  }

  renderTime = (props) => {
    return (
      <Time
        {...props}
        containerStyle={{
          left: {
            marginLeft: 0,
            marginRight: 0,
            marginTop: wp('1.38%'),
            marginBottom: 0,
          },
          right: {
            marginLeft: 0,
            marginRight: 0,
            marginTop: wp('1.38%'),
            marginBottom: 0,
          },
        }}
        timeTextStyle={{
          left: {
            fontSize: wp('2.78%'),
            color: '#000',
            fontFamily: font.MRegular,
            opacity: 0.6,
          },
          right: {
            fontSize: wp('2.78%'),
            color: '#8f8f8f',
            fontFamily: font.MRegular,
            opacity: 0.6,
          },
        }}
      />
    );
  };

  renderAvatar = (props) => {
    if (props.currentMessage && props.currentMessage.user && props.currentMessage.user.photo) {
      return (
        <View>
          <RNImage
            source={{ uri: props.currentMessage.user.photo }}
            style={{ width: wp('8%'), height: wp('8%'), borderRadius: wp('4%') }}
          />
        </View>
      );
    }
  };

  renderMessage = (props) => {
    return (
      <Message
        {...props}
        containerStyle={{
          left: {
            marginBottom: props.currentMessage.user._id !== 1 ? wp('6.94%') : wp('4.166%'),
          },
        }}
      />
    );
  };

  renderSend = (props) => {
    return (
      // // <Send alwaysShowSend={true} containerStyle={styles.sendContainer}>
      // <StyledWrapper row secondary={'center'}>
      //   <PictureButton />
      //   <SendButton onPress={props.onSend} />
      // </StyledWrapper>
      // // </Send>
      <MessageSend {...props} />
    );
  };

  renderDay = (props) => {
    return <Day {...props} wrapperStyle={styles.dayWrapperStyle} />;
  };

  onRefresh = () => {
    this.setState({ isRefresh: true });
    let req = {
      token: this.props.auth.access_token,
      parentID: this.props.event_data[0].parentID,
      onGetEventSuccess: (res) => {
        this.setState({ isRefresh: false });
      },
      onFail: () => {
        this.setState({ isRefresh: false });
      },
    };
    this.props.onGetPostEvent(req);
  };

  render() {
    if (this.props.experience.isEventLoad && this.props.event_data && this.props.event_data.length > 0) {
      const {
        parentID,
        title,
        coverphoto,
        isPrivate,
        userID,
        founder_uid,
        description,
        sDate,
        eDate,
        event_access_pin,
        share_url,
        address,
        rsvp_user,

        founder_photo,
        name,
        type,
        endDate,
        founder,
        can_guest_invite,
        guest_admin,
        is_secret,
      } = this.props.event_data[0];

      let RSVPUser = rsvp_user.find((item) => item.userID === this.props.auth.uid);
      const { msgText, isLoading, isRefresh } = this.state;
      return (
        <View style={{ backgroundColor: '#ECEDED', flex: 1 }}>
          <StyledCoverImage source={{ uri: coverphoto }} />

          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.keyboardAwareContentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={'white'}
                refreshing={isRefresh}
                onRefresh={() => {
                  this.onRefresh();
                }}
              />
            }
          >
            <ViewEventHeader onBack={this.onGoBack} onShare={() => this.onShareUrl()} />

            <InfoCard
              title={title}
              name={founder}
              isPublic={!isPrivate}
              eventType={type}
              eventDescription={description}
              sDate={sDate}
              eDate={eDate}
              address={address}
              photoUrl={founder_photo}
              parentID={parentID}
              isEdit={founder_uid === this.props.auth.uid ? true : false}
              onEditPress={this.onEditEvent}
              is_secret={is_secret}
            />

            {/* <RsvpCard
              data={rsvp_user}
              onRSVPSelect={res => {
                this.onRSVP(res);
              }}
              auth={this.props.auth}
              isPrivate={isPrivate}
              onInvite={this._handleInviteFriends}
              founder={
                this.props.event_data && this.props.event_data.length > 0 ? this.props.event_data[0].founder_uid : ''
              }
            /> */}
            <GuestListCard
              auth={this.props.auth}
              guestList={rsvp_user}
              onRSVPSelect={(res) => {
                this.onRSVP(res);
              }}
              isInvite={founder_uid === this.props.auth.uid ? true : can_guest_invite}
              onPressInvite={() => this._handleInviteFriends({ routeName: 'InviteGuestList' })}
            />

            <StyledWrapper
              width={wp('100%')}
              marginTop={wp('9.16%')}
              paddingTop={wp('2.22%')}
              paddingBottom={wp('2.22%')}
              secondary={'center'}
              backgroundColor={'#fff'}
            >
              <StyledChatTitle>{'PRE-EVENT CHAT'}</StyledChatTitle>
            </StyledWrapper>
            <StyledSeparator width={wp('100%')} height={0.5} bgColor={'#d1d1d1'} />
            {!_.isEmpty(guest_admin) && (
              <StyledWrapper
                width={wp('100%')}
                paddingTop={wp('2.22%')}
                paddingBottom={wp('2.22%')}
                secondary={'center'}
                backgroundColor={'#fff'}
              >
                <StyledChatTitle
                  style={{ fontFamily: font.MRegular }}
                >{`Host has selected ${guest_admin.name} as Guest Admin`}</StyledChatTitle>
              </StyledWrapper>
            )}
            <StyledChatcontainer>
              <GiftedChat
                messages={this.state.messages}
                onSend={(messages) => this.send(messages)}
                user={{
                  _id: userID,
                  name: name,
                  photo: this.props.auth.photo,
                }}
                onInputTextChanged={(val) => {
                  this.setState({ msgText: val });
                }}
                textInputProps={{
                  returnKeyType: 'done',
                  multiline: false,
                }}
                text={msgText}
                renderComposer={(props) => this.renderComposer(props)}
                renderActions={(props) => this.renderActions(props)}
                renderSend={(props) => this.renderSend(props)}
                renderInputToolbar={(props) => this.renderInputToolbar(props)}
                renderMessage={(props) => this.renderMessage(props)}
                renderBubble={(props) => this.renderBubble(props)}
                renderTime={(props) => this.renderTime(props)}
                renderAvatar={(props) => this.renderAvatar(props)}
                renderDay={(props) => this.renderDay(props)}
                isKeyboardInternallyHandled={false}
                listViewProps={{
                  nestedScrollEnabled: true,
                  contentContainerStyle: {
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                  },
                }}
              />
            </StyledChatcontainer>
          </KeyboardAwareScrollView>
          {this.renderEmojiModal()}
          {isLoading && (
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
              <Loading />
            </View>
          )}
        </View>
      );
    } else {
      return <Loading />;
    }
  }
}

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
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
  sendButtonWrapper: {
    marginRight: 10,
    marginBottom: 5,
  },
  chatComponentWrapper: {
    flex: 1,
    height: dimensions.height / 3,
  },
  eventImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'cover',
  },
  keyboardScrollContainer: {
    flexGrow: 1,
  },

  keyboardAwareContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  switchNormalText: {
    color: '#6c6c6c',
    fontSize: wp('3.05%'),
    fontFamily: font.MMedium,
    fontWeight: '400',
  },
  switchSelectedText: {
    color: '#FF9076',
    fontSize: wp('3.05%'),
    fontFamily: font.MMedium,
    fontWeight: '400',
  },
  composerTextInput: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 8,
    borderRadius: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingRight: 50,
  },
  inputToolbarContainer: {
    borderTopWidth: 0,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    justifyContent: 'center',
  },
  actionContainer: {
    justifyContent: 'center',
  },
  sendContainer: {
    marginRight: 0,
    marginLeft: 0,
  },
  dayWrapperStyle: {
    marginBottom: 16,
  },
  addressStyle: {
    position: 'absolute',
    alignSelf: 'center',
    top: -wp('4.58%'),
    width: wp('86.9%'),
    height: wp('9.16%'),
    borderRadius: wp('4.58%'),
    borderColor: colors.Orange,
    backgroundColor: '#fff',
    borderWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 12,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeStyle: {
    position: 'absolute',
    alignSelf: 'center',
    top: wp('-13%'),
    width: wp('86.9%'),
    height: wp('9.16%'),
    borderRadius: wp('4.58%'),
    borderColor: 'rgba(33, 33, 33, 0.6)',
    backgroundColor: 'rgba(33, 33, 33, 0.6)',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 12,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestMoreCountWrapper: {
    width: wp('10.5%'),
    height: wp('10.5%'),
    borderColor: colors.Orange,
    borderWidth: wp('0.5%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
    loading: state.experience.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAttendance: (obj) => {
      dispatch(ExperienceActions.attendance(obj));
    },
    onGuestLists: (obj) => {
      dispatch(ExperienceActions.getGuestLists(obj));
    },
    onGetPostEvent: (obj) => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    onJoinEvent: (obj) => {
      dispatch(ExploreAction.joinEventRequest(obj));
    },
    setActiveExperience: (obj) => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    setActiveMemory: (obj) => {
      dispatch(MemoryActions.setActiveMemory(obj));
    },
    setActiveStation: (obj) => {
      dispatch(StationActions.setActiveStation(obj));
    },
    onShareUrl: (obj) => {
      dispatch(ExperienceActions.shareUrl(obj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);
