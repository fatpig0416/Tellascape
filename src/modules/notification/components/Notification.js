import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SwitchSelector from 'react-native-switch-selector';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
// Load theme
import theme from '../../core/theme';
const { images, font, colors } = theme;
import { DEFAULT_FOUNDER_ID } from '../../../utils/vals';

// Import common styles
import { StyledButtonOverlay, StyledWrapper, StyledButton, StyledSeparator } from '../../core/common.styles';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { connect } from 'react-redux';
import NotificationAction from '../reducers/index';
import ExperienceActions from '../../experience/reducers/event/index';
import MemoryActions from '../../experience/reducers/memory';
import StationActions from '../../experience/reducers/station';
import { isJoinedEvent, isJoinedMemory, isJoinedStation } from '../../../utils/funcs';
const StyledContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  width: ${wp('100%')};
  height: ${hp('100%')};
  background-color: #e8e8e8;
`;

const StyledBody = styled.View`
  width: ${wp('100%')};
  height: ${hp('81.72%')};
  background-color: #fff;
  border-top-left-radius: 20;
  border-top-right-radius: 20;
  align-items: center;
`;

const StyledCloseButtonWrapper = styled.TouchableOpacity`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  border-width: 1;
  border-color: #878787;
`;

const CloseButton = props => (
  <StyledCloseButtonWrapper {...props}>
    <CustomIcon name={'Close_16x16px'} size={16} color={'#878787'} />
  </StyledCloseButtonWrapper>
);

const HeaderText = styled.Text`
  font-size: ${wp('4.44%')};
  font-family: ${font.MSemiBold};
  color: #212121;
  text-align: center;
  align-self: center;
`;

const Header = props => {
  // const {} = props;
  return (
    <StyledWrapper
      row
      width={'100%'}
      paddingTop={wp('4.02%')}
      paddingLeft={wp('4.44%')}
      paddingRight={wp('4.44%')}
      primary={'space-between'}
      secondary={'center'}
    >
      {/* <CloseButton /> */}
      <HeaderText>{'Notifications'}</HeaderText>
      <StyledWrapper width={wp('10%')} />
    </StyledWrapper>
  );
};

const StyledSwitchWrapper = styled.View`
  width: ${wp('90.83%')};
  margin-top: ${wp('4.44%')};
  margin-bottom: ${wp('4.44%')};
`;

const SWITCH_OPTIONS = [
  {
    value: 'notification',
    customIcon: () => <CustomIcon name={'Navbar_Notifications_32px'} size={21} color={'rgba(33, 33, 33, 0.8)'} />,
  },
  // {
  //   value: 'bookmark',
  //   customIcon: () => <CustomIcon name={'Pr-Bookmarks_20x20px'} size={20} color={'rgba(33, 33, 33, 0.8)'} />,
  // },
];

const CustomSelect = props => {
  return (
    <StyledSwitchWrapper>
      <SwitchSelector
        options={SWITCH_OPTIONS}
        initial={0}
        onPress={val => props.onSwitchValue(val)}
        buttonColor={'#fff'}
        backgroundColor={'#f5f5f5'}
        // selectedColor={'#FF9076'}
        hasPadding={true}
        height={wp('10%')}
        borderColor={'transparent'}
      />
    </StyledSwitchWrapper>
  );
};

const StyledAvatar = styled(FastImage)`
  width: ${wp('7.33%')};
  height: ${wp('7.33%')};
  border-radius: ${wp('4.165%')};
  justify-content: center;
  align-items: center;
`;

const StyledUserName = styled.Text`
  font-size: ${wp('3.05%')};
  color: #000;
  font-family: ${font.MSemiBold};
`;

const StyledItemDescription = styled.Text`
  font-size: ${wp('3.05%')};
  color: #8f8f8f;
  font-family: ${font.MMedium};
`;

const StyledTimeText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #8f8f8f;
  font-family: ${font.MSemiBold};
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('3.05%')};
  height: ${wp('3.05%')};
  border-radius: ${wp('1.525%')};
`;

const EventTypeImage = props => {
  const { eventType } = props;
  const eventImage =
    eventType === 'first_event'
      ? images.MARKER_EVENT
      : eventType === 'first_memory'
      ? images.MARKER_MEMORY
      : images.MARKER_STATION;

  return (
    <StyledWrapper marginRight={wp('2.22%')}>
      <StyledEventTypeImage source={eventImage} />
    </StyledWrapper>
  );
};

const UserNameAvatar = ({ name }) => {
  let uname = name.split(' ');
  let username;
  if (uname.length >= 2) {
    username = uname[0].substring(0, 1) + uname[1].substring(0, 1);
  } else {
    if (name.length > 1) {
      username = name.substring(0, 1);
    } else {
      username = 'T';
    }
  }
  return (
    <View
      style={{
        position: 'absolute',
        width: wp('7.33%'),
        height: wp('7.33%'),
        borderColor: '#3EC0BE',
        borderWidth: wp('0.3%'),
        borderRadius: wp('4.5%'),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#3EC0BE', fontFamily: font.MBold, letterSpacing: 1, fontSize: wp('3%') }}>{username}</Text>
    </View>
  );
};

const NotificaitonItem = props => {
  const { uUrl, name, created_at, type, user_id, title, sdate } = props.data;
  let notificationIcon = '';
  let description = <StyledItemDescription style={{ flex: 1 }}>{''}</StyledItemDescription>;
  switch (type) {
    case 'following':
      notificationIcon = '';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          {' '}
          <StyledUserName>{name}</StyledUserName>
          {' is following you'}
        </StyledItemDescription>
      );
      break;
    case 'like':
      notificationIcon = 'love-big_16x16';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' liked your media'}
        </StyledItemDescription>
      );
      break;
    case 'unlike':
      notificationIcon = 'love-big_16x16';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' unliked your media'}
        </StyledItemDescription>
      );
      break;
    case 'comment':
      notificationIcon = 'comments-big_16x16';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' commented your media'}
        </StyledItemDescription>
      );
      break;
    case 'message':
      notificationIcon = 'Navbar_Messages_32px';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' sent you a message'}
        </StyledItemDescription>
      );
      break;
    case 'first_event':
      notificationIcon = 'first_event';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' posted a first experience'}
        </StyledItemDescription>
      );
      break;
    case 'first_memory':
      notificationIcon = 'first_memory';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' posted a first memory'}
        </StyledItemDescription>
      );
      break;
    case 'first_station':
      notificationIcon = 'first_station';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' posted a first station'}
        </StyledItemDescription>
      );
      break;
    case 'event_invitation':
      let date = moment(new Date(sdate * 1000)).format('DD MMM YYYY HH:mm:ss');
      notificationIcon = 'first_event';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          {` ${props.data.text !== undefined ? props.data.text : ''} `}
        </StyledItemDescription>
      );
      break;
    case 'friend_request_accept':
      notificationIcon = '';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          {' '}
          <StyledUserName>{name}</StyledUserName>
          {' has accepted your follow request.'}
        </StyledItemDescription>
      );
      break;
    case 'delete_media':
      notificationIcon = 'first_memory';
      description = (
        <StyledItemDescription style={{ flex: 1 }}>
          <StyledUserName>{name}</StyledUserName>
          {' has deleted a media.'}
        </StyledItemDescription>
      );
      break;
    default:
      notificationIcon = '';
      description = <StyledItemDescription style={{ flex: 1 }}>{title}</StyledItemDescription>;
      break;
  }
  return (
    <StyledWrapper
      row
      width={wp('100%')}
      // height={wp('14.16%')}
      paddingLeft={wp('4.44%')}
      paddingRight={wp('4.44%')}
      paddingTop={wp('1%')}
      paddingBottom={wp('1%')}
      secondary={'center'}
    >
      <StyledButton onPress={() => props.toProfile(user_id)}>
        <View style={{ width: wp('8.33%'), height: wp('8.33%') }}>
          <UserNameAvatar name={name} />
          <StyledAvatar source={{ uri: uUrl }} />
        </View>
      </StyledButton>
      <TouchableWithoutFeedback onPress={props.onPressItem}>
        <StyledWrapper
          row
          secondary={'center'}
          marginLeft={wp('3.33%')}
          flex={1}
          paddingTop={wp('1.5%')}
          paddingBottom={wp('1.5%')}
        >
          <StyledWrapper style={{ flex: 1, marginRight: wp('3%') }}>
            <StyledWrapper row marginTop={1} secondary={'center'} style={{ flex: 1 }}>
              {/* {notificationIcon ? (
                notificationIcon.substring(0, 5) === 'first' ? (
                  <EventTypeImage eventType={notificationIcon} />
                ) : (
                  <StyledWrapper marginRight={wp('2.22%')}>
                    <CustomIcon name={notificationIcon} size={12} color={'#7B7B7B'} />
                  </StyledWrapper>
                )
              ) : null} */}
              <StyledWrapper style={{ flex: 1 }}>{description}</StyledWrapper>
            </StyledWrapper>
          </StyledWrapper>
          {/* <StyledTimeText>{`${created_at} m`}</StyledTimeText> */}
          <TimeAgo time={created_at * 1000} style={styles.eventCreatedTime} hideAgo={true} />
        </StyledWrapper>
      </TouchableWithoutFeedback>
    </StyledWrapper>
  );
};

const TabSelect = ({ index, onChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => onChange(0)} style={index === 0 ? styles.activeTab : styles.inactiveTab}>
        <Text style={index === 0 ? styles.activeText : styles.inactiveText}>{'Notifications'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange(1)} style={index === 1 ? styles.activeTab : styles.inactiveTab}>
        <Text style={index === 1 ? styles.activeText : styles.inactiveText}>{'Schedule'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const RequestList = ({ item, onPressAccept, onPressDeny }) => {
  return (
    <View style={styles.requestContainer}>
      <Text style={styles.requestMsgText}>
        <Text style={{ fontFamily: font.MSemiBold, letterSpacing: 0.5, textAlign: 'center' }}>{item.username}</Text>
        {` has sent the request for follow to you`}
      </Text>
      <View style={styles.requestButtonContainer}>
        <TouchableOpacity style={styles.acceptContainer} onPress={() => onPressAccept(item)}>
          <CustomIcon name={'Category_Active_20x20px'} size={12} color={'white'} />
          <Text style={styles.acceptText}>{'Accept'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineContainer} onPress={() => onPressDeny(item)}>
          <CustomIcon name={'Close_16x16px'} size={10} color={'black'} />
          <Text style={styles.declineText}>{'Decline'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MorButton = ({ text, onPress }) => {
  return (
    <View style={styles.moreContainer}>
      <TouchableOpacity onPress={onPress} style={{ width: '100%', alignItems: 'center', paddingVertical: hp('1') }}>
        <Text style={styles.moreText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const StackExperience = ({ title, data, navigateProfile, onPressItem, isExpand, onPressMore }) => {
  let newData = isExpand ? data : data.slice(0, 4);
  if (data && data.length > 0) {
    return (
      <View style={{ marginBottom: hp('1.5%') }}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        {newData.map((item, index) => {
          return (
            <View
              key={index.toString()}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.18)',
              }}
            >
              <NotificaitonItem data={item} toProfile={navigateProfile} onPressItem={() => onPressItem(item)} />
            </View>
          );
        })}

        {data.length > 4 && <MorButton onPress={onPressMore} text={isExpand ? 'Less' : 'More'} />}
      </View>
    );
  }
  return <View />;
};

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'notification',
      isLoading: false,
      tabIndex: 0,
      isMoreInvited: false,
      isMoreMyPlanned: false,
      isMoreAccepted: false,
    };
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidMount = () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData();
      }),
    ];
  };

  _fetchData = async () => {
    this.props.setBadgeCount(0);
    this.setState({ isLoading: true });
    const obj = {
      token: this.props.auth.access_token,
      onSuccess: () => {
        this.setState({ isLoading: false });
      },
      onFail: () => {
        this.setState({ isLoading: false });
      },
    };
    this.props.onGetNotification(obj);
  };

  onTabChanged = index => {
    this.setState({ tabIndex: index });
  };

  onSwitchValue = value => {
    this.setState({
      selectedTab: value,
    });
  };

  navigateProfile = uID => {
    if (uID !== DEFAULT_FOUNDER_ID) {
      this.props.setProfileLoad(false);
      this.props.navigation.push('ViewProfile', { uid: uID });
    }
  };

  onPressItem = async item => {
    const { type, parentID, childID, isPrivate } = item;
    if (type && type === 'event_invitation') {
      this.setState({ isLoading: true });
      let req = {
        token: this.props.auth.access_token,
        parent_id: parentID,
        media_id: -1,
        onSuccess: async response => {
          this.setState({ isLoading: false });
          const { is_secret, is_user_invited, sDate, eDate } = response.data;

          const { privateJoinedEvents } = this.props.experience;
          let index = -1;
          if (privateJoinedEvents && privateJoinedEvents.length > 0) {
            index = privateJoinedEvents.findIndex(item => item.parentID === parentID);
          }
          if (isPrivate && index === -1) {
            let obj = {
              parentID: parentID,
              childID: childID,
              title: item.title,
              name: item.name,
              type: item.expType,
              description: item.description,
              sDate: moment(sDate).format('YYYY-MM-DD HH:mm:ss'),
              photo: item.iUrl,
              userImage: item.uUrl,
              eDate: moment(eDate).format('YYYY-MM-DD HH:mm:ss'),
              is_deleted: item.is_deleted,
              navigationType: 'profile',
              is_secret: is_secret,
            };

            if (is_user_invited) {
              this.props.setEventLoad(false);
              let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, parentID, childID);
              if (!isJoin) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss');
                if (now > obj.eDate) {
                  // Post Event
                  this.props.navigation.navigate('PostEvent', {
                    parentID: parentID,
                    childID: childID,
                  });
                } else if (now > obj.sDate && now < obj.eDate) {
                  // Live Event
                  this.props.navigation.navigate('LiveEvent', {
                    parentID: parentID,
                    childID: childID,
                  });
                } else {
                  // View EVent
                  this.props.navigation.navigate('ViewEvent', {
                    parentID: parentID,
                    childID: childID,
                  });
                }
              }
            } else {
              this.props.navigation.navigate('VerifyPin', {
                data: obj,
              });
            }
          } else {
            this.props.setEventLoad(false);
            let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, parentID, childID);
            if (!isJoin) {
              let now = moment().format('YYYY-MM-DD HH:mm:ss');
              let formatted_sdate = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
              let formatted_edate = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
              if (now > formatted_edate) {
                // Post Event
                this.props.navigation.navigate('PostEvent', {
                  parentID: parentID,
                  childID: childID,
                });
              } else if (now > formatted_sdate && now < formatted_edate) {
                // Live Event
                this.props.navigation.navigate('LiveEvent', {
                  parentID: parentID,
                  childID: childID,
                });
              } else {
                // View EVent
                this.props.navigation.navigate('ViewEvent', {
                  parentID: parentID,
                  childID: childID,
                });
              }
            }
          }
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', msg, [], { cancelable: false });
        },
      };
      this.props.onGetExperienceStatus(req);
    } else if (type && (type === 'comment' || type === 'like')) {
      this.setState({ isLoading: true });
      let req = {
        token: this.props.auth.access_token,
        parent_id: parentID,
        media_id: item.mediaID,
        onSuccess: response => {
          this.setState({ isLoading: false });
          const { sDate, eDate, is_deleted } = response.data;
          this.redirectToExperience({
            parentID: parentID,
            childID: childID,
            mediaID: item.mediaID,
            sd: sDate,
            ed: eDate,
            expType: item.expType,
            is_deleted: is_deleted,
          });
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert(
            'Tellascape',
            msg,
            [
              {
                text: 'Okay',
              },
            ],
            { cancelable: false }
          );
        },
      };
      this.props.onGetExperienceStatus(req);
    }
  };

  redirectToExperience = ({ parentID, childID, mediaID, sd, ed, expType, is_deleted }) => {
    const { activeExperience } = this.props.experience;
    const { activeStation } = this.props.station;
    const { activeMemory } = this.props.memory;

    if (expType === 'event') {
      let routeName = 'LiveEvent';
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let sDate = moment(sd).format('YYYY-MM-DD HH:mm:ss');
      let eDate = moment(ed).format('YYYY-MM-DD HH:mm:ss');
      if (activeExperience !== undefined && activeExperience !== null && activeExperience.parentID === parentID) {
        routeName = 'JoinEvent';
      } else {
        if (now > eDate) {
          routeName = 'PostEvent';
        } else if (now > sDate && now < eDate) {
          routeName = 'LiveEvent';
        } else {
          routeName = 'ViewEvent';
        }
      }
      this.props.setEventLoad(false);
      this.props.navigation.navigate(routeName, {
        parentID: parentID,
        childID: childID,
        route_type: 'notification',
        mediaID: mediaID,
      });
    } else if (expType === 'station') {
      let routeName = 'LiveStation';
      if (activeStation !== undefined && activeStation !== null && activeStation.parentID === parentID) {
        routeName = 'JoinStation';
      } else {
        if (is_deleted === 1) {
          routeName = 'PostStation';
        } else {
          routeName = 'LiveStation';
        }
      }
      this.props.setStationLoad(false);
      this.props.navigation.navigate(routeName, {
        parentID: parentID,
        childID: childID,
        route_type: 'notification',
        mediaID: mediaID,
      });
    } else if (expType === 'memory') {
      let routeName = 'LiveMemory';
      if (activeMemory !== undefined && activeMemory !== null && activeMemory.parentID === parentID) {
        routeName = 'JoinMemory';
      } else {
        if (is_deleted === 1) {
          routeName = 'PostMemory';
        } else {
          routeName = 'LiveMemory';
        }
      }
      this.props.setMemoryLoad(false);
      this.props.navigation.navigate(routeName, {
        parentID: parentID,
        childID: childID,
        route_type: 'notification',
        mediaID: mediaID,
      });
    }
  };

  onPressAccept = item => {
    Alert.alert('Tellascape', 'Are you sure ?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({ isLoading: true });
          const { uid } = item;
          let req = {
            token: this.props.auth.access_token,
            uid: uid,
            onSuccess: response => {
              this.setState({ isLoading: false });
              Alert.alert('Tellascape', response.msg || 'Following request removed.');
            },
            onFail: () => {
              this.setState({ isLoading: false });
            },
          };
          this.props.onAcceptRequest(req);
        },
      },
    ]);
  };
  onPressDeny = item => {
    Alert.alert('Tellascape', 'Are you sure ?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({ isLoading: true });
          const { uid } = item;
          let req = {
            token: this.props.auth.access_token,
            uid: uid,
            onSuccess: response => {
              this.setState({ isLoading: false });
              Alert.alert('Tellascape', response.msg || 'Following request removed.');
            },
            onFail: () => {
              this.setState({ isLoading: false });
            },
          };
          this.props.onDenyRequest(req);
        },
      },
    ]);
  };

  onPressPlannedExp = item => {
    const { parent_id, child_id, exp_type } = item;
    if (exp_type && exp_type === 'memory') {
      this.props.setMemoryLoad(false);
      this.props.navigation.navigate('LiveMemory', {
        parentID: parent_id,
        childID: child_id,
      });
    }
    if (exp_type && exp_type === 'event') {
      this.props.setEventLoad(false);
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let sDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
      let eDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
      if (now > sDate && now < eDate) {
        // Live Event
        this.props.navigation.navigate('LiveEvent', {
          parentID: parent_id,
          childID: child_id,
        });
      } else {
        // View EVent
        this.props.navigation.navigate('ViewEvent', {
          parentID: parent_id,
          childID: child_id,
        });
      }
    }
  };

  render() {
    const { selectedTab, isLoading, tabIndex, isMoreInvited, isMoreAccepted, isMoreMyPlanned } = this.state;
    const { data, request_list, invited_stack, accepted_stack, planned_stack } = this.props.notification;
    return (
      <StyledContainer>
        <StyledBody>
          <Header />
          {/* <CustomSelect onSwitchValue={this.onSwitchValue} /> */}
          <TabSelect index={tabIndex} onChange={this.onTabChanged} />

          {tabIndex === 0 ? (
            <FlatList
              data={[0]}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    {request_list &&
                      request_list.map((ritem, rindex) => {
                        return (
                          <RequestList
                            key={rindex.toString()}
                            item={ritem}
                            onPressAccept={this.onPressAccept}
                            onPressDeny={this.onPressDeny}
                          />
                        );
                      })}
                    {data &&
                      data.map((ditem, dindex) => {
                        return (
                          <NotificaitonItem
                            key={dindex.toString()}
                            data={ditem}
                            toProfile={this.navigateProfile}
                            onPressItem={() => this.onPressItem(ditem)}
                          />
                        );
                      })}
                  </View>
                );
              }}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
              ListHeaderComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
              ListFooterComponent={() => (
                <StyledWrapper marginBottom={30}>
                  <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />
                </StyledWrapper>
              )}
            />
          ) : null}
          {tabIndex === 1 && (
            <View style={{ flex: 1 }}>
              <FlatList
                data={[0]}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: hp('5%') }}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {invited_stack && invited_stack.length > 0 && (
                        <StackExperience
                          title={'Invited Experiences'}
                          data={invited_stack}
                          navigateProfile={this.navigateProfile}
                          onPressItem={item => this.onPressItem(item)}
                          isExpand={isMoreInvited}
                          onPressMore={() => this.setState({ isMoreInvited: !isMoreInvited })}
                        />
                      )}
                      {planned_stack && planned_stack.length > 0 && (
                        <StackExperience
                          title={'My Planned Experiences'}
                          data={planned_stack}
                          navigateProfile={this.navigateProfile}
                          onPressItem={item => this.onPressPlannedExp(item)}
                          isExpand={isMoreMyPlanned}
                          onPressMore={() => this.setState({ isMoreMyPlanned: !isMoreMyPlanned })}
                        />
                      )}
                      {accepted_stack && accepted_stack.length > 0 && (
                        <StackExperience
                          title={'Accepted Experiences'}
                          data={accepted_stack}
                          navigateProfile={this.navigateProfile}
                          onPressItem={item => this.onPressItem(item)}
                          isExpand={isMoreAccepted}
                          onPressMore={() => this.setState({ isMoreAccepted: !isMoreAccepted })}
                        />
                      )}
                    </>
                  );
                }}
              />
            </View>
          )}
        </StyledBody>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </StyledContainer>
    );
  }
}

const styles = StyleSheet.create({
  eventCreatedTime: {
    fontSize: wp('3.03%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#b8b8b8',
  },
  loaderContainer: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    borderColor: '#f5f5f5',
    borderWidth: wp('0.5%'),
    borderRadius: hp('6%'),
    flexDirection: 'row',
    marginHorizontal: wp('5%'),
    marginVertical: wp('4.44%'),
    paddingHorizontal: wp('0.5%'),
    paddingVertical: wp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.aquaColor,
    borderRadius: hp('6%'),
    paddingVertical: wp('2.5%'),
  },
  inactiveTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    fontFamily: font.MMedium,
    color: 'white',
    letterSpacing: 0.5,
    fontSize: wp('3.5%'),
  },
  inactiveText: {
    fontFamily: font.MRegular,
    letterSpacing: 0.5,
    fontSize: wp('3.5%'),
  },
  requestContainer: {
    width: wp('100%'),
    paddingVertical: hp('2.5%'),
    alignItems: 'center',
  },
  requestMsgText: {
    fontFamily: font.MRegular,
  },
  requestButtonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: hp('1.5%'),
  },
  acceptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.aquaColor,
    borderRadius: hp('5%'),
    alignSelf: 'baseline',
    width: wp('30%'),
    justifyContent: 'center',
    paddingVertical: hp('1%'),
  },
  acceptText: {
    color: 'white',
    fontFamily: font.MMedium,
    letterSpacing: 0.5,
    marginLeft: wp('1.5%'),
  },
  declineContainer: {
    width: wp('30%'),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('5%'),
    borderRadius: wp('5%'),
    borderColor: colors.aquaColor,
    borderWidth: wp('0.2%'),
  },
  declineText: {
    color: 'black',
    fontFamily: font.MRegular,
    letterSpacing: 0.5,
    marginLeft: wp('1.5%'),
  },
  norequestText: {
    fontFamily: font.MMedium,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  sectionHeaderText: {
    fontFamily: font.MMedium,
    fontSize: wp('4%'),
    paddingHorizontal: wp('4.44%'),
    paddingVertical: hp('1.5%'),
  },
  moreContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
  },
  moreText: {
    color: colors.aquaColor,
    fontFamily: font.MRegular,
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    notification: state.notification,
    experience: state.experience,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetNotification: obj => {
      dispatch(NotificationAction.notification(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    setBadgeCount: obj => {
      dispatch(NotificationAction.setBadgeCount(obj));
    },
    onGetExperienceStatus: obj => {
      dispatch(NotificationAction.experienceStatus(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    onAcceptRequest: obj => {
      dispatch(NotificationAction.acceptRequest(obj));
    },
    onDenyRequest: obj => {
      dispatch(NotificationAction.denyRequest(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);
