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
  RefreshControl,
  Keyboard,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import ExperienceActions from '../../reducers/event';
import ExploreAction from '../../../home/reducers';
import FastImage from 'react-native-fast-image';
import { DEFAULT_FOUNDER_ID } from '../../../../utils/vals';
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

const StyledCloseIconWrapper = styled.TouchableOpacity`
  border-radius: 16;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2;
`;

const BackButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#ffffff'} />
  </StyledButton>
);

const CloseIcon = props => (
  <StyledCloseIconWrapper {...props}>
    <CustomIcon name="Close_16x16px" size={14} color="#5D5C5C" />
  </StyledCloseIconWrapper>
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
        <StyledWrapper
          row
          primary={'space-between'}
          secondary={'center'}
          paddingRight={wp('8%')}
          paddingBottom={hp('2%')}
        >
          <BackButton onPress={props.onBack} />
          <StyledText color={colors.White} fontSize={hp('2.5%')} fontFamily={font.MBold} fontWeight={'700'}>
            {'Invite Guests'}
          </StyledText>
          <StyledButton>
            {/* <CustomIcon name={'more_horiz-24px'} size={sizes.largeIconSize} color={'#ffffff'} /> */}
          </StyledButton>
        </StyledWrapper>
        <View style={{ height: hp('5%') }} />
      </SafeAreaView>
    </LinearGradient>
  </StyledHeader>
);

const StatusIcon = ({ status, onPress }) => {
  if (status) {
    if (status.toLowerCase() === 'invited') {
      return (
        <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { borderWidth: 0 }]}>
          <StyledButtonOverlay
            borderRadius={wp('15%')}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={gradients.Background}
          />
          <CustomIcon name={'Pr-Following_20x20px'} size={18} color={'#FFFFFF'} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.statusStyle}>{status}</Text>
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.iconContainer,
            {
              backgroundColor: '#D1D3D7',
              borderColor: '#D1D3D7',
            },
          ]}
        >
          <CustomIcon name={'Pr-Following_20x20px'} size={18} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        <CustomIcon name={'Pr-Follow_20x20px-Copy'} size={18} color={'#FF9F6D'} />
      </TouchableOpacity>
    );
  }
};

const UserList = ({ data, onPressIcon, isLoading = false, onPressProfile }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: wp('3%') }}>
        <TouchableWithoutFeedback onPress={() => onPressProfile(data.userID)}>
          <FastImage source={{ uri: data.photo }} style={styles.avatar} />
        </TouchableWithoutFeedback>
        <Text style={styles.usernameStyle}>{data.users_name}</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.Orange} />
      ) : (
        <StatusIcon status={data.status} onPress={onPressIcon} />
      )}
    </View>
  );
};

const UserPopup = ({ data, visible, onClose, onPressInvite, isLoading }) => {
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
                      <FastImage source={{ uri: data.photo }} style={styles.searchUserAvatar} />
                    </View>
                    <View style={{ height: hp('2%') }} />
                    <Text style={styles.usernameStyle}>{data.name}</Text>
                    <TouchableOpacity onPress={() => onPressInvite(data)} style={{ marginTop: hp('3%') }}>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={gradients.Background}
                        style={styles.buttonContainer}
                      >
                        {isLoading ? (
                          <ActivityIndicator size={'small'} color={'white'} />
                        ) : (
                          <Text style={styles.buttonText}>{'INVITE'}</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
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

class AddInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      currentUserID: null,
      isRefresh: false,
      searchLoading: false,
      isFocus: false,
      isVisibleUserModal: false,
      selectedUserData: null,
      isLoadingInvite: false,
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
      const userName = item.users_name.toUpperCase();
      const searchValue = val.toUpperCase();
      return userName.indexOf(searchValue) > -1;
    });
  };

  onPressStatusIcon = item => {
    if (item.status) {
    } else {
      if (this.props.event_data && this.props.event_data.length > 0) {
        this.setState({ currentUserID: item.userID });
        const obj = {
          parentID: this.props.event_data[0].parentID,
          childID: this.props.event_data[0].child_ID,
          userID: item.userID,
          token: this.props.auth.access_token,
          onSuccess: response => {
            this.setState({ currentUserID: null });
          },
        };
        this.props.onInviteUser(obj);
      }
    }
  };

  onPressProfile = userID => {
    if (userID !== DEFAULT_FOUNDER_ID) {
      this.props.setProfileLoad(false);
      this.props.navigation.push('ViewProfile', { uid: userID });
    }
  };

  onChangeText = val => {
    this.setState({ searchText: val });

    let obj = {
      token: this.props.auth.access_token,
      query: val,
      onSuccess: () => this.setState({ isLoading: false }),
      onFail: () => this.setState({ isLoading: false }),
    };
    this.setState({ isLoading: true });
    if (val.length > 0) {
      this.props.onGetPeoples(obj);
    } else {
      this.props.setPeoples({ data: [] });
    }
  };

  onPressSearchUser = item => {
    this.setState({ selectedUserData: item, isVisibleUserModal: true });
  };

  onPressInvite = item => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.setState({ isLoadingInvite: true, filterData: [], searchText: '', isFocus: false });
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        userID: item.userID,
        token: this.props.auth.access_token,
        onSuccess: response => {
          this.setState({ isLoadingInvite: false, isVisibleUserModal: false });
        },
        onFail: () => this.setState({ isLoadingInvite: false, isVisibleUserModal: false }),
      };
      this.props.onInviteUser(obj);
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      searchText,
      currentUserID,
      isRefresh,
      isFocus,
      isVisibleUserModal,
      selectedUserData,
      isLoadingInvite,
    } = this.state;
    const { guest_lists, invited_user } = this.props.guestLists;
    const { peoples } = this.props.explore;
    let filterData = [];
    if (peoples && peoples.length > 0) {
      let invitedUser = [];
      if (invited_user && invited_user.length > 0) {
        invitedUser = invited_user;
      }
      peoples.map((item, index) => {
        let iIndex = invitedUser.findIndex(iItem => iItem.userID === item.userID);
        if (iIndex === -1) {
          filterData.push(item);
        }
      });
    }
    return (
      <View style={styles.mainStyle}>
        <Header onBack={() => navigation.goBack()} searchText={searchText} onChangeText={this.onChangeText} />
        <View style={styles.containerStyle}>
          {guest_lists && guest_lists.length > 0 ? (
            <FlatList
              data={guest_lists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <UserList
                  data={item}
                  onPressIcon={() => this.onPressStatusIcon(item)}
                  isLoading={currentUserID && currentUserID === item.userID}
                  onPressProfile={this.onPressProfile}
                />
              )}
              refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={this.onGuestLists} />}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={styles.flatListStyle}
            />
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{'No Guests Available...'}</Text>
            </View>
          )}
        </View>

        <UserPopup
          visible={isVisibleUserModal}
          onClose={() => this.setState({ isVisibleUserModal: false })}
          data={selectedUserData}
          onPressInvite={this.onPressInvite}
          isLoading={isLoadingInvite}
        />

        <View style={styles.autoCompleteContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder={'Find Users'}
              placeholderTextColor={'#5D5C5C'}
              value={searchText}
              onChangeText={this.onChangeText}
              style={styles.searchInputStyle}
              onFocus={() => this.setState({ isFocus: true })}
              onBlur={() => this.setState({ isFocus: false })}
            />
            {searchText.length > 0 || isFocus ? (
              <CloseIcon
                onPress={() => {
                  this.setState({ searchText: '' });
                  Keyboard.dismiss();
                }}
              />
            ) : (
              <CustomIcon name={'Common-Search_20x20px'} size={18} color={'#5D5C5C'} />
            )}
          </View>
          {searchText !== '' && filterData && filterData.length > 0 && (
            <View>
              <View style={styles.searchContainerStyle}>
                <View style={styles.arrowStyle} />
                <View style={styles.searchItemContainer}>
                  <FlatList
                    data={filterData}
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={({ item, index }) => (
                      <TouchableWithoutFeedback onPress={() => this.onPressSearchUser(item)}>
                        <View
                          style={[
                            styles.searchTextContainer,
                            { borderBottomWidth: filterData.length - 1 === index ? 0 : wp('0.1%') },
                          ]}
                        >
                          <Text style={styles.searchTextStyle}>{item.name}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: font.MMedium,
    color: '#FE8A78',
    fontSize: wp('4.2%'),
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EDEDED',
    marginVertical: hp('1%'),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
  },
  avatar: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
  },
  usernameStyle: {
    fontFamily: font.MMedium,
    letterSpacing: 0.3,
    fontSize: wp('3.8%'),
    marginLeft: wp('3%'),
    color: '#282828',
  },
  flatListStyle: {
    marginTop: hp('1%'),
  },
  iconContainer: {
    backgroundColor: '#FBFBFB',
    borderColor: '#E4E4E4',
    borderWidth: wp('0.4%'),
    borderRadius: wp('7%'),
    paddingHorizontal: wp('4.8%'),
    paddingVertical: wp('2.2%'),
  },
  statusStyle: {
    color: '#B8B8B8',
    fontFamily: font.MMedium,
    letterSpacing: 0.5,
    marginRight: wp('2%'),
    fontWeight: '500',
    fontSize: wp('2.5%'),
  },
  arrowStyle: {
    backgroundColor: 'transparent',
    borderLeftWidth: wp('2.8%'),
    borderRightWidth: wp('2.8%'),
    borderBottomWidth: hp('1.5%'),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.Orange,
    marginRight: wp('12%'),
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  searchContainerStyle: {
    marginHorizontal: 12,
  },
  searchItemContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: hp('40%'),
    borderRadius: wp('1.2%'),
    paddingVertical: wp('1%'),
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  searchTextStyle: {
    fontFamily: font.MMedium,
    letterSpacing: 0.3,
    fontSize: wp('3.4%'),
  },
  searchTextContainer: {
    paddingVertical: wp('2.6%'),
    borderBottomColor: '#DBDBDC',
    paddingHorizontal: wp('3%'),
    backgroundColor: '#DBDBDC',
  },
  autoCompleteContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'ios' ? hp('9%') : hp('3.6%'),
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
  searchUserAvatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('10%'),
  },
  buttonContainer: {
    borderRadius: wp('5%'),
    width: wp('30%'),
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  buttonText: {
    color: 'white',
    fontFamily: font.MSemiBold,
    fontSize: wp('4%'),
    letterSpacing: 0.8,
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
    guestLists: state.experience.guestLists,
    explore: state.explore,
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
    onGetPeoples: obj => {
      dispatch(ExploreAction.getPeoples(obj));
    },
    setPeoples: obj => {
      dispatch(ExploreAction.getPeoplesSuccess(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddInvite);
