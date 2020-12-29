import React, { Component } from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Share,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIphoneX } from 'react-native-iphone-x-helper';
import theme from '../modules/core/theme';
import UserAvatar from './UserAvatar';
import HeaderLogo from './HeaderLogo';
import CustomIcon from '../utils/icon/CustomIcon';
import Constants from '../modules/core/Constants';
import { BlurView } from '@react-native-community/blur';
import ProgressiveImage from 'react-native-image-progress';
import DeviceInfo from 'react-native-device-info';
import { StyledWrapper } from '../modules/core/common.styles';

const { font, colors, cyan, graident, sizes } = theme;
const moment = require('moment');

import { connect } from 'react-redux';
import ExperienceActions from '../modules/experience/reducers/event';
import ExploreAction from '../modules/home/reducers/index';

import LinearGradient from 'react-native-linear-gradient';
import { StyledButton, StyledText } from '../modules/core/common.styles';
import { Loading } from '../utils';
import { DEFAULT_FOUNDER_ID } from '../utils/vals';
import { getValueFromObjectWithoutKey, isJoinedEvent, isJoinedStation, isJoinedMemory } from '../utils/funcs';

const StyledSortWrapper = styled.View`
  width: ${wp('10.55')};
  height: ${wp('10.55')};
  border-radius: ${wp('5.275')};
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const StyledHeader = styled.View`
  background-color: #eeeeee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${isIphoneX() ? wp('18.88%') : wp('13.33%')};
  padding-left: ${wp('2.22%')};
  padding-right: ${wp('2.22%')};
  padding-bottom: ${wp('2.22%')};
`;
const StyledHeaderText = styled.Text`
  text-align: center;
  font-size: 20;
  font-weight: 600;
  color: rgb(167, 167, 167);
  font-family: ${font.MRegular};
`;
const StyledLogoWrapper = styled.View`
  width: ${wp('13.33%')};
  height: ${wp('13.33%')};
  border-radius: ${wp('6.665%')};
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.Image`
  width: ${wp('20.55')};
  height: ${wp('20.55')};
  border-radius: ${wp('10.275')};
  background-color: #fff;
`;
const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: ${16};
  top: ${16};
`;
const ItemList = ({ title, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.itemContainerStyle}>
        <Text style={styles.textStyle}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const StyledTellasafeButton = styled.TouchableOpacity`
  width: ${wp('55.55%')};
  height: ${wp('8.88%')};
  align-items: center;
  justify-content: center;
  margin-top: ${wp('5.5%')};
  box-shadow: 0px 4px 8px rgba(106, 51, 124, 0.2);
`;

const TellasafeButton = props => {
  return (
    <StyledTellasafeButton {...props}>
      <StyledButtonOverlay
        height={wp('8.88%')}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#FF6C6F', '#E14E55']}
      />
      <StyledWrapper row primary={'center'} secondary={'center'}>
        <CustomIcon name="LifeSaver_18x18px" size={20} style={styles.icon} color={'#ffffff'} />
        <Text style={styles.tellasafeTextStyle}>{'Tellasafe'}</Text>
      </StyledWrapper>
    </StyledTellasafeButton>
  );
};

const AvatarInitialView = title => {
  let titleLen = title.split(' ');
  let fChar = '',
    lChar = '';
  if (titleLen.length >= 2) {
    fChar = titleLen[0].length >= 1 ? titleLen[0].substring(0, 1) : '';
    lChar = titleLen[1].length >= 1 ? titleLen[1].substring(0, 1) : '';
  } else if (titleLen.length === 1) {
    fChar = titleLen[0].length >= 1 ? titleLen[0].substring(0, 1) : '';
  }
  return (
    <View>
      <Text style={styles.avtarTextStyle}>{`${fChar.toUpperCase()}${lChar.toUpperCase()}`}</Text>
    </View>
  );
};

const SearchItemList = ({ title, photo, onPress, isPhoto = false }) => {
  var number = Math.floor(Math.random() * 3);
  let gradient =
    number === 0
      ? theme.gradients.Background
      : number === 1
      ? theme.gradients.BackgroundBlue
      : theme.gradients.BackgroundGreen;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.searchItemContainerStyle}>
        {isPhoto && (
          <LinearGradient colors={gradient} style={styles.avatarContainerStyle}>
            <ProgressiveImage
              source={{
                uri: photo,
              }}
              renderError={() => {
                return AvatarInitialView(title);
              }}
              renderIndicator={() => {
                return AvatarInitialView(title);
              }}
              style={styles.avatarImageStyle}
            />
          </LinearGradient>
        )}
        <Text style={styles.searchItemTextStyle}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
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

const Label = ({ label, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.labelItemContainerStyle}>
        <Text style={styles.labelStyle}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
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

const StyledBody = styled.View`
  width: ${wp('85%')};
  background-color: ${colors.White};
  padding-top: 20;
  padding-right: 20;
  padding-bottom: 20;
  padding-left: 20;
  border-radius: 10;
  align-items: center;
`;
const StyledInput = styled.TextInput`
  width: 100%;
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-bottom: ${hp('1%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-right: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
  padding-bottom: ${hp('1.4%')};
  font-family: ${font.MRegular};
`;

const ModalCloseButton = props => (
  <StyledModalCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={16} color={props.color} />
  </StyledModalCloseButton>
);

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? theme.gradients.BackgroundLightGreen : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
      />
      {children}
    </StyledGradientButton>
  );
};

const StyledButtonText = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: ${colors.White};
  font-family: ${font.MMedium};
  font-weight: 500;
`;
// const data = ['Party Event', 'Amazing Event', 'Outdoors Statuon', 'Plan Memory', 'Quick Memory'];

const StyledAlertView = styled.View`
  position: absolute;
  top: 0;
  width: ${wp('100%')};
  height: ${isIphoneX() ? hp('8.35%') : hp('7.45%')};
  background-color: 'rgba(0,0,0,0.5)';
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  padding-top: ${isIphoneX() ? hp('4.79%') : hp('2.89%')};
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
`;

const StyledAlertText = styled.Text`
  color: white;
  font-family: ${theme.font.MSemiBold};
  font-size: ${wp('3.33%')};
`;

const AlertView = props => {
  return (
    <StyledAlertView>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <StyledAlertText>{'Onboarding is always availible via menu'}</StyledAlertText>
        <StyledButton {...props}>
          <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
        </StyledButton>
      </StyledWrapper>
    </StyledAlertView>
  );
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isFeedbackModalVisible: false,
      isSearchModalVisible: false,
      isFindFriendsVisible: false,
      isWebView: false,
      searchTitle: '',
      searchFriend: '',
      isLoading: false,
      isAlertVisible: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isFocused && this.props.isFocused) {
      this.fetchAllMakers();
    }
  }
  fetchAllMakers = async () => {
    // Get all markers
    const exploreReqObj = {
      token: this.props.auth.access_token,
    };
    this.props.onGetMarkers(exploreReqObj);
  };

  hideModal = () => {
    this.setState({ isVisible: false });
  };
  renderSearchModel = () => {
    const { isSearchModalVisible, searchTitle } = this.state;
    const { markers } = this.props.explore;
    let locationPin = [],
      filteredData = [];
    markers.map((item, index) => {
      const markerData = getValueFromObjectWithoutKey(item);
      let obj = {
        id: markerData.parentID,
        parentID: markerData.parentID,
        childID: markerData.childID,
        location: {
          latitude: markerData.lat,
          longitude: markerData.lng,
        },
        title: markerData.title,
        iUrl: markerData.iUrl,
        type: markerData.type,
        category: markerData.category,
        startdate: markerData.startdate,
        enddate: markerData.enddate,
        sDate: markerData.sDate,
        eDate: markerData.eDate,
        rsvp_user: markerData.rsvp_user,
      };
      locationPin.push(obj);
    });
    if (locationPin.length > 0) {
      if (searchTitle.length > 0) {
        filteredData = locationPin.filter(function(item) {
          const itemTitleData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
          const textTitleData = searchTitle.toUpperCase();
          return itemTitleData.includes(textTitleData);
        });
      }
    }

    return (
      <Modal visible={isSearchModalVisible} transparent={true} animationType={'fade'}>
        <View style={styles.modalStyle}>
          <View style={{ backgroundColor: '#D8D8D8', flex: 1 }}>
            <LinearGradient
              colors={['rgba(0,0,0,0.99)', 'rgba(0,0,0,0.39)', 'rgba(0,0,0,0.54)']}
              style={[styles.containerStyle, { flex: 1 }]}
            >
              <View style={{ paddingTop: wp('10%') }}>
                <TouchableWithoutFeedback onPress={() => this.setState({ isSearchModalVisible: false })}>
                  <StyledSortWrapper style={{ backgroundColor: '#292E30' }}>
                    <CustomIcon name="keyboard_arrow_left-24px" size={36} style={styles.icon} color={'#D8D8D8'} />
                  </StyledSortWrapper>
                </TouchableWithoutFeedback>
                <View style={styles.inputContainerStyle}>
                  <TextInput
                    placeholder={'Search'}
                    placeholderTextColor="#D8D8D8"
                    style={styles.inputStyle}
                    onChangeText={text => {
                      this.setState({ searchTitle: text });
                    }}
                    value={searchTitle}
                  />
                  <CustomIcon name="Common-Search_20x20px" size={22} style={styles.icon} color={'#D8D8D8'} />
                </View>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                  <View>
                    {filteredData.map((item, index) => {
                      return (
                        <SearchItemList
                          key={index}
                          title={item.title}
                          onPress={async () => {
                            const { parentID, child_ID, sDate, eDate, type } = item;

                            if (type === 'event') {
                              let isJoin = await isJoinedEvent(
                                this.props.navigation,
                                this.props.experience,
                                parentID,
                                child_ID
                              );
                              if (!isJoin) {
                                let now = moment().format('YYYY-MM-DD HH:mm:ss');
                                let startD = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
                                let endD = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
                                if (now > startD && now < endD) {
                                  // Live Event
                                  this.props.navigation.navigate('LiveEvent', {
                                    parentID: parentID,
                                    childID: child_ID,
                                  });
                                } else {
                                  // View EVent
                                  this.props.navigation.navigate('ViewEvent', {
                                    parentID: parentID,
                                    childID: child_ID,
                                  });
                                }
                              }
                            } else if (type === 'station') {
                              let isJoin = await isJoinedStation(
                                this.props.navigation,
                                this.props.station,
                                parentID,
                                child_ID
                              );
                              if (!isJoin) {
                                this.props.navigation.navigate('LiveStation', {
                                  parentID: parentID,
                                  childID: child_ID,
                                });
                              }
                            } else if (type === 'memory') {
                              let isJoin = await isJoinedMemory(
                                this.props.navigation,
                                this.props.memory,
                                parentID,
                                child_ID
                              );
                              if (!isJoin) {
                                this.props.navigation.navigate('LiveMemory', {
                                  parentID: parentID,
                                  childID: child_ID,
                                });
                              }
                            }
                            this.setState({isSearchModalVisible : false})

                          }}
                        />
                      );
                    })}
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    );
  };

  renderFindFriends = data => {
    const { isFindFriendsVisible, searchFriend, isLoading } = this.state;
    return (
      <Modal visible={isFindFriendsVisible} transparent={true} animationType={'fade'}>
        <View style={styles.modalStyle}>
          <View style={{ backgroundColor: '#D8D8D8', flex: 1 }}>
            <LinearGradient
              colors={['rgba(0,0,0,0.99)', 'rgba(0,0,0,0.39)', 'rgba(0,0,0,0.54)']}
              style={[styles.containerStyle, { flex: 1 }]}
            >
              <View style={{ paddingTop: wp('10%') }}>
                <TouchableWithoutFeedback onPress={() => this.setState({ isFindFriendsVisible: false })}>
                  <StyledSortWrapper style={{ backgroundColor: '#292E30' }}>
                    <CustomIcon name="keyboard_arrow_left-24px" size={36} style={styles.icon} color={'#D8D8D8'} />
                  </StyledSortWrapper>
                </TouchableWithoutFeedback>
                <View style={styles.inputContainerStyle}>
                  <TextInput
                    placeholder={'Find Friends'}
                    placeholderTextColor="#D8D8D8"
                    style={styles.inputStyle}
                    onChangeText={text => {
                      this.setState({ searchFriend: text });
                      if (text.length >= 3) {
                        let obj = {
                          token: this.props.auth.access_token,
                          query: text,
                          onSuccess: () => this.setState({ isLoading: false }),
                          onFail: () => this.setState({ isLoading: false }),
                        };
                        this.setState({ isLoading: true });
                        this.props.onGetPeoples(obj);
                      } else {
                        this.props.setPeoples({ data: [] });
                      }
                    }}
                    value={searchFriend}
                  />
                  <CustomIcon name="Common-Search_20x20px" size={22} style={styles.icon} color={'#D8D8D8'} />
                </View>
                {isLoading && <ActivityIndicator style={{ marginTop: wp('3%') }} />}
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                  <View>
                    {data &&
                      data != null &&
                      data.map((item, index) => {
                        return (
                          <SearchItemList
                            key={index}
                            title={item.name}
                            photo={item.photo}
                            isPhoto={true}
                            onPress={() => {
                              if (item.userID !== DEFAULT_FOUNDER_ID) {
                                this.setState({ isFindFriendsVisible: false });
                                this.props.setProfileLoad(false);
                                this.props.navigation.navigate('ViewProfile', { uid: item.userID });
                              }
                            }}
                          />
                        );
                      })}
                    {searchFriend.length >= 3 && data.length === 0 && !isLoading && (
                      <Text style={styles.noFoundStyle}>{'No friends found...!'}</Text>
                    )}
                  </View>
                </KeyboardAwareScrollView>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    );
  };

  onSubmitFeedback = () => {
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('comment', this.state.feedbackDescription);
    obj.append('type', 'Feedback');
    this.props.onReportProfile(obj);
    Alert.alert('Success', 'Thanks for shared the feedback.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.toggleFeedbackModal();
          this.setState({ feedbackDescription: '' });
        },
      },
    ]);
  };
  feedbackModalView = () => {
    const { isFeedbackModalVisible, feedbackDescription, loading } = this.state;
    return (
      <Modal
        visible={isFeedbackModalVisible}
        transparent={true}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        avoidKeyboard={true}
        onBackdropPress={() => this.setState({ isFeedbackModalVisible: false })}
      >
        <BlurView blurType={Platform.OS === 'ios' ? 'extraDark' : 'dark'} style={styles.keyboardAwareContentContainer}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.keyboardAwareContentContainer}
          >
            <StyledBody>
              <ModalCloseButton color={cyan.icon} onPress={this.toggleFeedbackModal} />
              <StyledHeaderText>{'Feedback'}</StyledHeaderText>
              <StyledInput
                value={feedbackDescription}
                editable
                multiline
                numberOfLines={4}
                placeholder={'Write your valuable feedback...'}
                placeholderTextColor={'rgb(167, 167, 167)'}
                onChangeText={text => this.setState({ feedbackDescription: text })}
              />
              <GradientButton
                width={'75%'}
                height={hp('4.2%')}
                onPress={() => this.onSubmitFeedback()}
                isActive={feedbackDescription}
                background={cyan}
              >
                {!loading ? <StyledButtonText>{'Submit Feedback'}</StyledButtonText> : <Loading />}
              </GradientButton>
            </StyledBody>
          </KeyboardAwareScrollView>
        </BlurView>
      </Modal>
    );
  };

  onShare = async share_url => {
    const desc =
      'Tellascape is flipping the script on traditional social media by giving people a platform to seek real world experiences, and share these moments in an authenticated fashion. Search the world near and far for things to do, or capture the memories closest to you.\n \n Get it for free at http://tellascape.com/#download';
    try {
      await Share.share({
        url: share_url,
        message: desc,
      });
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
    }
  };

  toCreateSafe = () => {
    this.props.navigation.navigate('CreateSafe');
  };

  onCloseAlert = () => {
    this.setState({
      isAlertVisible: false,
    });
  };

  renderModal = () => {
    const { isVisible } = this.state;
    const { photo, auth, navigation } = this.props;
    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType={'slide'}
        onBackButtonPress={() => {
          this.hideModal();
          // this.props.navigation.goBack();
        }}
        onRequestClose={() => {
          this.hideModal();
          // this.props.navigation.goBack();
        }}
      >
        <View style={styles.modalStyle}>
          <TouchableWithoutFeedback onPress={this.hideModal}>
            <View style={styles.mainContainerStyle}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#D8D8D8' }}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.99)', 'rgba(0,0,0,0.39)', 'rgba(0,0,0,0.54)']}
                    style={styles.containerStyle}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.hideModal();
                        this.props.setProfileLoad(false);
                        navigation.navigate('ViewProfile', { uid: auth.uid });
                      }}
                    >
                      <StyledImage source={this.renderImage(photo)} />
                    </TouchableWithoutFeedback>
                    <ItemList title={`@${auth.user_name}`} />
                    <ItemList
                      title={'Search'}
                      onPress={() => {
                        this.hideModal();
                        this.setState({ isSearchModalVisible: true });
                      }}
                    />
                    {/* <ItemList title={'Settings'} onPress={() => {}} /> */}
                    <ItemList
                      title={'Onboarding'}
                      onPress={() => {
                        this.hideModal();
                        navigation.navigate('Onboarding');
                      }}
                    />
                    <ItemList
                      title={'Invite Friends'}
                      onPress={() => {
                        this.onShare(Constants.development.shareUrl);
                      }}
                    />
                    <ItemList
                      title={'Find Friends'}
                      onPress={() => {
                        this.props.setPeoples({ data: [] });
                        this.hideModal();
                        this.setState({ searchFriend: '', isFindFriendsVisible: true });
                      }}
                    />
                    <TellasafeButton onPress={this.toCreateSafe} />
                    <View style={styles.labelContainerStyle}>
                      <Label
                        label={'About Us'}
                        onPress={() => {
                          this.hideModal();
                          this.setState({ isWebView: true });
                          this.props.navigation.navigate('Webview', {
                            uri: Constants.development.aboutUs,
                            title: 'About Us',
                            key: 'home',
                          });
                        }}
                      />
                      <Label
                        label={'Help'}
                        onPress={() => {
                          this.hideModal();
                          this.setState({ isWebView: true });
                          this.props.navigation.navigate('Webview', {
                            uri: Constants.development.help,
                            title: 'Help',
                            key: 'home',
                          });
                        }}
                      />
                      <Label
                        label={'Feedback'}
                        onPress={() => {
                          this.hideModal();
                          this.toggleFeedbackModal();
                        }}
                      />
                    </View>
                    <Label label={`Version : ${DeviceInfo.getVersion()}`} />
                  </LinearGradient>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  };
  renderImage = (image = '') => (image === null || image.length === 0 ? image.PROFILE : { uri: image });
  toggleFeedbackModal = () => {
    this.setState({ isFeedbackModalVisible: !this.state.isFeedbackModalVisible });
  };
  render() {
    const { isVisible, isWebView, isAlertVisible } = this.state;
    const { navigation } = this.props;
    const { peoples } = this.props.explore;

    return !isWebView ? (
      <SafeAreaView style={{ backgroundColor: '#eeeeee' }}>
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: true })}>
            <StyledSortWrapper style={{ backgroundColor: isVisible ? 'rgba(10,18,19,0.39)' : 'white' }}>
              <CustomIcon
                name="sort-24px"
                size={26}
                style={styles.icon}
                color={isVisible ? 'white' : 'rgba(0,0,0,0.54)'}
              />
            </StyledSortWrapper>
          </TouchableWithoutFeedback>
          <StyledLogoWrapper>
            <HeaderLogo />
          </StyledLogoWrapper>
          <UserAvatar navigation={navigation} />
        </View>
        {this.feedbackModalView()}
        {this.renderModal()}
        {this.renderSearchModel()}
        {this.renderFindFriends(peoples)}
        {/* {isAlertVisible ? <AlertView onPress={this.onCloseAlert} /> : null} */}
      </SafeAreaView>
    ) : (
      <View />
    );
  }
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: isIphoneX() ? wp('18.88%') : wp('13.33%'),
    paddingLeft: wp('2.22%'),
    paddingRight: wp('2.22%'),
    paddingBottom: wp('2.22%'),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eeeeee',
    marginVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
  icon: {
    textAlignVertical: 'center',
  },
  modalStyle: {
    flex: 1,
  },
  mainContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    width: wp('100%'),
    alignItems: 'center',
    paddingBottom: hp('4%'),
    paddingTop: hp('4%'),
  },
  itemContainerStyle: {
    borderBottomWidth: 0.25,
    borderColor: '#D8D8D8',
    width: wp('90%'),
    alignItems: 'center',
    paddingVertical: wp('5.5%'),
  },
  textStyle: {
    color: '#D8D8D8',
    fontFamily: font.MBold,
    fontSize: wp('4.3%'),
    letterSpacing: 0.5,
  },
  tellasafeTextStyle: {
    color: '#ffffff',
    fontFamily: font.MBold,
    fontSize: wp('4.3%'),
    letterSpacing: 0.5,
    marginLeft: wp('2.77%'),
  },
  labelContainerStyle: {
    flexDirection: 'row',
    width: wp('100%'),
    justifyContent: 'space-around',
  },
  labelItemContainerStyle: {
    paddingVertical: wp('5%'),
  },
  labelStyle: {
    color: '#D8D8D8',
    fontFamily: font.MRegular,
    letterSpacing: 0.5,
  },
  searchItemContainerStyle: {
    borderBottomWidth: 0.25,
    borderColor: '#D8D8D8',
    width: wp('90%'),
    alignItems: 'center',
    paddingVertical: wp('5.5%'),
    flexDirection: 'row',
  },
  searchItemTextStyle: {
    color: '#D8D8D8',
    fontFamily: font.MRegular,
    fontSize: wp('4.3%'),
    letterSpacing: 0.5,
    marginLeft: wp('3%'),
  },
  inputContainerStyle: {
    marginTop: hp('3%'),
    width: wp('90%'),
    height: hp('6.5%'),
    backgroundColor: '#9DA0A1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: hp('4%'),
    paddingHorizontal: wp('5%'),
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    fontSize: wp('4%'),
    height: hp('6.5%'),
    fontFamily: font.MBold,
  },
  keyboardAwareContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFoundStyle: {
    color: 'white',
    textAlign: 'center',
    marginVertical: hp('5%'),
    fontFamily: font.MBold,
    letterSpacing: 0.4,
    fontSize: wp('3.5%'),
  },
  avatarContainerStyle: {
    alignItems: 'center',
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: hp('3%'),
  },
  avatarImageStyle: {
    width: hp('6%'),
    height: hp('6%'),
  },
  avtarTextStyle: {
    color: 'white',
    fontFamily: font.MBold,
    fontSize: wp('5%'),
    letterSpacing: 0.5,
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  return {
    photo: state.auth.photo,
    auth: state.auth,
    explore: state.explore,
    experience: state.experience,
    station: state.station,
    memory: state.memory,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    onReportProfile: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    onGetMarkers: obj => {
      dispatch(ExploreAction.getMarkersRequest(obj));
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
)(Header);
