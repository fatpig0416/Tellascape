import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import ExperienceActions from '../../reducers/event';
import FastImage from 'react-native-fast-image';
import { DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  StyledView,
  StyledText,
  StyledButton,
  StyledImage,
  StyledSeparator,
  StyledWrapper,
  StyledButtonOverlay,
} from '../../../core/common.styles';
const StyledHeader = styled.View`
  width: ${wp('100%')};
`;
const tooltipText =
  'Allows Host to: upload, download, delete others content and them from the event.\n\nThis also allows the “Guest Admin” content to also be uploaded to the Original Host journey page as well as the ghost host journey page';
const BackButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#ffffff'} />
  </StyledButton>
);

const Header = props => (
  <StyledHeader>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={gradients.Background}
      style={styles.headerContainer}
    >
      <SafeAreaView>
        <StyledWrapper row primary={'space-between'} secondary={'center'} paddingRight={wp('8%')}>
          <BackButton onPress={props.onBack} />
          <StyledText color={colors.White} fontSize={hp('2.5%')} fontFamily={font.MBold} fontWeight={'700'}>
            {'Guest List'}
          </StyledText>
          <StyledButton>
            {/* <CustomIcon name={'more_horiz-24px'} size={sizes.largeIconSize} color={'#ffffff'} /> */}
          </StyledButton>
        </StyledWrapper>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder={'Find Users'}
            placeholderTextColor={'#5D5C5C'}
            value={props.searchText}
            onChangeText={props.onChangeText}
            style={styles.searchInputStyle}
          />
          <CustomIcon name={'Common-Search_20x20px'} size={18} color={'#5D5C5C'} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  </StyledHeader>
);

const PopupOption = ({
  label,
  onPress,
  color = '#282828',
  isSuffix = false,
  onPressSuffix,
  isTooltipVisible,
  onChangeTooltipVisibility,
}) => {
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
  onPressProfile,
  onPressBlock,
  onPressRemove,
  isTooltipVisible,
  onChangeTooltipVisibility,
  onMakeAdmin,
  adminID,
}) => {
  if (data !== null) {
    return (
      <Modal visible={visible} transparent={true}>
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
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  } else {
    return <View />;
  }
};

const MoreButton = ({ onPress, isMore = true }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.moreButtonContainer}>
        <CustomIcon name={isMore ? 'expand_more-24px' : 'expand_less-24px'} size={30} color={'#fe847c'} />
        <Text style={styles.moreText}>{isMore ? `See More` : `Less`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const InviteButton = ({ onPress }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
        <View style={styles.inviteContainer}>
          <FastImage
            source={theme.images.INVITE_ICON}
            resizeMode={'contain'}
            style={{ width: wp('17%'), height: wp('17%') }}
          />
        </View>
        <Text style={styles.inviteText}>{'Invite'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const GuestItemCard = ({ data, onLongPress }) => {
  let opacity = data.is_blocked ? 0.4 : 1;
  return (
    <TouchableWithoutFeedback onLongPress={onLongPress} onPress={onLongPress}>
      <View style={styles.itemContainer}>
        <View style={styles.avatarContainer}>
          <FastImage source={{ uri: data.photo }} style={[styles.avatar, { opacity }]} />
        </View>
        <Text style={[styles.usernameStyle, { opacity }]}>{data.users_name}</Text>
        <Text style={[styles.statusStyle]}>{data.status || ''}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

class InviteGuestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      isVisiblePopup: false,
      selectedUser: null,
      isMore: false,
      isRefresh: false,
      isTooltipVisible: false,
    };
  }

  onGuestLists = () => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isRefresh: true });
      let obj = {
        parentID: this.props.event_data[0].parentID,
        token: this.props.auth.access_token,
        onSuccess: () => {
          this.setState({ isRefresh: false });
        },
        onFail: error => {
          this.setState({ isRefresh: false });
        },
      };
      this.props.onGuestLists(obj);
    }
  };
  onFindUsers = (arrayList, val) => {
    return arrayList.filter(item => {
      if (item.type) {
        return item;
      } else {
        const userName = item.users_name.toUpperCase();
        const searchValue = val.toUpperCase();
        return userName.indexOf(searchValue) > -1;
      }
    });
  };

  onPressProfile = userID => {
    if (userID !== DEFAULT_FOUNDER_ID) {
      this.props.setProfileLoad(false);
      this.props.navigation.push('ViewProfile', { uid: userID });
    }
  };

  onPressBlock = item => {
    const { selectedUser } = this.state;
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
          if (selectedUser.is_blocked) {
            Alert.alert('Unlock User', 'You have unblocked "' + selectedUser.users_name + '" to this event');
          } else {
            Alert.alert('Block User', 'You have blocked "' + selectedUser.users_name + '" to this event');
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
    const { selectedUser } = this.state;
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoading: true });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        userID: item.userID,
        token: this.props.auth.access_token,
        onSuccess: () => {
          this.setState({ isLoading: false });
          Alert.alert('Remove Guest', 'You removed "' + selectedUser.users_name + '" for this event');
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', msg);
        },
      };
      this.props.onDeleteInvitedUser(obj);
    }
  };

  onChangeTooltipVisibility = val => {
    this.setState({ isTooltipVisible: val });
  };

  onMakeAdmin = item => {
    const { selectedUser } = this.state;
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoading: true });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        uid: item.userID,
        token: this.props.auth.access_token,
        type: 'guest',
        onSuccess: res => {
          this.setState({ isLoading: false });
          Alert.alert('Guest Admin', res.msg);
        },
        onFail: msg => {
          this.setState({ isLoading: false });
          Alert.alert('Tellascape', msg);
        },
      };
      this.props.onAssignAdmin(obj);
    }
  };
  render() {
    const {
      navigation,
      auth: { uid },
    } = this.props;
    const { searchText, isVisiblePopup, selectedUser, isMore, isLoading, isRefresh, isTooltipVisible } = this.state;
    const { founder_uid } = this.props.event_data[0];
    let filterData = [];
    const { invited_user, guest_admin_id } = this.props.guestLists;
    if (invited_user && invited_user.length > 0) {
      filterData = this.onFindUsers(invited_user, searchText);
    }
    filterData = [
      {
        type: 'Invite',
      },
      ...filterData,
    ];
    if (filterData.length > 8 && isMore === false) {
      filterData = filterData.slice(0, 8);
    }
    return (
      <View style={styles.mainStyle}>
        <Header
          onBack={() => navigation.goBack()}
          searchText={searchText}
          onChangeText={val => this.setState({ searchText: val })}
        />
        <View style={styles.containerStyle}>
          <View style={styles.labelContainer}>
            {uid === founder_uid && <Text style={styles.labelStyle}>{'Tap and Hold to Manage'}</Text>}
          </View>
          {filterData && filterData !== null && filterData.length > 0 ? (
            <FlatList
              numColumns={2}
              data={filterData}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentInset={{ right: 0, top: 0, left: 0, bottom: hp('5%') }}
              contentContainerStyle={styles.flatlistStyle}
              renderItem={({ item, index }) =>
                item.type && item.type === 'Invite' ? (
                  <InviteButton onPress={() => navigation.navigate('AddInvite')} />
                ) : (
                  <GuestItemCard
                    data={item}
                    onLongPress={() => this.setState({ selectedUser: item, isVisiblePopup: true })}
                  />
                )
              }
              refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={this.onGuestLists} />}
              ItemSeparatorComponent={() => <View style={{ width: 1, height: 1 }} />}
              ListFooterComponent={() =>
                invited_user && invited_user.length > 7 ? (
                  <MoreButton onPress={() => this.setState({ isMore: !isMore })} isMore={!isMore} />
                ) : (
                  <View />
                )
              }
            />
          ) : (
            <View />
          )}
          <UserPopup
            data={selectedUser}
            visible={isVisiblePopup}
            auth={this.props.auth}
            founder_uid={founder_uid}
            onClose={() => this.setState({ isVisiblePopup: false })}
            onPressProfile={this.onPressProfile}
            onPressBlock={this.onPressBlock}
            onPressRemove={this.onPressRemove}
            isTooltipVisible={isTooltipVisible}
            onChangeTooltipVisibility={this.onChangeTooltipVisibility}
            onMakeAdmin={this.onMakeAdmin}
            adminID={guest_admin_id}
          />
        </View>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={colors.Orange} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: '#E3E5E5',
  },
  searchContainer: {
    backgroundColor: 'white',
    marginHorizontal: wp('2.7%'),
    borderRadius: hp('4%'),
    paddingHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputStyle: {
    fontFamily: font.MMedium,
    fontSize: wp('3.4%'),
    paddingVertical: hp('1%'),
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
  flatlistStyle: {
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    marginHorizontal: wp('3%'),
    backgroundColor: 'white',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('2%'),
    borderBottomColor: '#E3E5E5',
    borderBottomWidth: wp('0.19%'),
    borderRightWidth: wp('0.19%'),
    borderRightColor: '#E3E5E5',
  },
  labelContainer: {
    marginVertical: hp('0.7%'),
  },
  labelStyle: {
    alignSelf: 'center',
    color: '#9C9C9C',
    fontFamily: font.MMedium,
    fontSize: wp('2.8%'),
    letterSpacing: 0.3,
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
  moreButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('0.5%'),
  },
  moreText: {
    color: '#fe847c',
    fontFamily: font.MMedium,
  },
  inviteContainer: {
    width: wp('16%'),
    height: wp('16%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: {
    color: '#fe847c',
    fontFamily: font.MMedium,
    fontWeight: '600',
    fontSize: wp('3.8%'),
    letterSpacing: 0.5,
    marginTop: hp('1.25%'),
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
  avtarMainContainer: {
    alignItems: 'center',
    paddingRight: wp('10%'),
    paddingLeft: wp('5%'),
    marginBottom: hp('2%'),
  },
  loaderContainer: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
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
    guestLists: state.experience.guestLists,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInviteUser: obj => {
      dispatch(ExperienceActions.addInvite(obj));
    },
    onDeleteInvitedUser: obj => {
      dispatch(ExperienceActions.deleteInvite(obj));
    },
    onGuestLists: obj => {
      dispatch(ExperienceActions.getGuestLists(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    onBlockUser: obj => {
      dispatch(ExperienceActions.blockUser(obj));
    },
    onAssignAdmin: obj => {
      dispatch(ExperienceActions.assignAdmin(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteGuestList);
