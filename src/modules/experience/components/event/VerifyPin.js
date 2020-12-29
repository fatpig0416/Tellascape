import React, { Component, useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CodeInput from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ExperienceActions from '../../reducers/event/index';
import { connect } from 'react-redux';
import ExploreAction from '../../../home/reducers/index';
import _ from 'lodash';
import { Loading } from '../../../../utils';
import { isJoinedEvent } from '../../../../utils/funcs';
import moment from 'moment';
// Load common components
import { StyledWrapper, StyledSeparator, StyledButtonOverlay } from '../../../core/common.styles';

// Load theme
import theme from '../../../core/theme';
const { colors, font, images, gradients } = theme;

import CustomIcon from '../../../../utils/icon/CustomIcon';

// Import organisms
import ViewEventHeader from '../organisms/ViewEventHeader';
import ViewEventCardHeader from '../organisms/ViewEventCardHeader';
import ReadMoreText from '../organisms/ReadMoreText';

const StyledCoverImage = styled(FastImage)`
  position: absolute;
  width: ${wp('100%')};
  height: ${wp('100%')};
`;

const StyledDescription = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.72%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #8f8f8f;
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledCodeText = styled.Text`
  font-size: ${wp('3.05%')};
  color: #515151;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('2.22%')};
  text-align: center;
`;

const StyledInviteText = styled.Text`
  font-size: ${wp('4.16%')};
  color: #fff;
  font-family: ${font.MRegular};
  font-weight: 500;
  text-align: center;
`;

const StyledCardView = styled.View`
  width: ${wp('95.56%')};
  border-radius: 15;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
  padding-bottom: ${wp('10.22%')};
`;

const StyledInviteButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${-wp('5%')};
  align-self: center;
  width: ${wp('75.55%')};
  height: ${wp('10%')};
  align-items: center;
  justify-content: center;
`;

const InviteButton = props => {
  return (
    <StyledInviteButton {...props} disabled={!props.isEnabled} onPress={props.onPress}>
      <StyledButtonOverlay
        borderRadius={wp('5%')}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={props.isEnabled ? gradients.Background : [colors.LightGreyEight, colors.LightGreyEight]}
      />
      <StyledInviteText>Access Event</StyledInviteText>
    </StyledInviteButton>
  );
};

const StyledTimeText = styled.Text`
  font-size: ${wp('3.055%')};
  font-family: ${font.MSemiBold};
  height: ${wp('4.44%')};
  color: #fff;
  position: absolute;
  top: -${wp('6.11%')};
  align-self: center;
`;

const CardView = props => {
  const { isPublic, onFulfill } = props;
  const [isInvitePossible, setIsInvitePossible] = useState(false);

  return (
    <View style={{ justifyContent: 'center', flex: 1 }}>
      <StyledCardView>
        <StyledTimeText>{props.time}</StyledTimeText>
        <ViewEventCardHeader {...props} />

        <StyledWrapper paddingLeft={wp('4.44%')} paddingRight={wp('4.44%')} marginBottom={wp('5.55%')}>
          <ReadMoreText content={props.eventDescription} />
        </StyledWrapper>

        {!isPublic ? (
          <>
            <StyledSeparator width={wp('95.56')} height={0.5} bgColor={'rgba(0,0,0,0.87)'} opacity={0.12} />
            <StyledCodeText>ACCESS CODE</StyledCodeText>
            <StyledSeparator width={wp('95.56')} height={0.5} bgColor={'rgba(0,0,0,0.87)'} opacity={0.12} />
            <CodeInput
              onFulfill={onFulfill}
              inactiveColor={colors.LightBlack}
              activeColor={'#5D5D5D'}
              codeLength={4}
              space={7}
              size={wp('11%')}
              defaultCode={'----'}
              cellProps={() => {
                return {
                  style: {
                    marginTop: wp('4.44%'),
                    backgroundColor: '#EFEFEF',
                    borderRadius: 16,
                    borderColor: '#EFEFEF',
                    borderWidth: 1,
                    fontSize: 15,
                    width: wp('12.77%'),
                    height: wp('14.44%'),
                  },
                };
              }}
              inputProps={{
                onChangeText: text => {
                  setIsInvitePossible(text.length === 4 ? true : false);
                },
              }}
            />
            <StyledWrapper secondary={'center'} marginTop={wp('2.78%')}>
              <StyledDescription>This is Private Event, provide access code to see details</StyledDescription>
            </StyledWrapper>
          </>
        ) : null}

        <InviteButton isEnabled={isInvitePossible} onPress={props.onPress} />
      </StyledCardView>
    </View>
  );
};

class VerifyPin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pincode: '',
      isRequestButton: false,
      isLoading: false,
    };
  }

  onFulfill = code => {
    this.setState({
      pincode: code,
      isRequestButton: true,
    });
  };

  goToJoinedPage = () => {
    const {
      navigation: {
        state: {
          params: {
            data: { parentID, childID },
          },
        },
      },
    } = this.props;
    const passedObj = {
      parentID,
      childID,
      verifypin: true,
    };
    this.props.navigation.replace('JoinEvent', passedObj);
  };

  allowJoin = () => {
    this.setState({
      isLoading: true,
    });

    const {
      navigation: {
        state: {
          params: {
            data: { parentID, childID, location, myChildID },
          },
        },
      },
    } = this.props;

    try {
      const joinReqObj = new FormData();
      let centerPoint = {
        lat: location.latitude ? location.latitude : '',
        lng: location.longitude ? location.longitude : '',
      };
      joinReqObj.append('token', this.props.auth.access_token);
      joinReqObj.append('parentID', parentID);
      joinReqObj.append('myChildID', myChildID);
      joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
      let obj = {
        joinObj: joinReqObj,
        joinEventSuccess: this.joinEventSuccess,
        joinEventFailure: this.joinEventFailure,
      };
      this.props.onJoinEvent(obj);
    } catch (error) {
      Alert.alert('Warning', "You can't join this event.");
      this.setState({
        isLoading: false,
      });
    }
  };

  joinEventSuccess = data => {
    this.setState({
      isLoading: false,
    });

    let expObj = {
      parentID: data.parentID,
      childID: data.childID,
    };
    this.props.setActiveExperience(expObj);
    this.setPrivateJoinedEvent(expObj);
    this.goToJoinedPage();
  };

  joinEventFailure = msg => {
    this.setState({
      isLoading: false,
    });
    this.setState({ isLoading: false });
    Alert.alert('Warning', "You can't join this event.");
  };

  setPrivateJoinedEvent = expObj => {
    if (this.props.experience.privateJoinedEvents) {
      const { privateJoinedEvents } = this.props.experience;
      let newArray = [...privateJoinedEvents];
      newArray.push(expObj);
      this.props.setPrivateJoinedEvent(newArray);
    }
  };

  onSuccess = data => {
    if (data && data.length > 0) {
      const {
        experience,
        navigation: {
          state: {
            params: {
              data: { active_post_parentID, active_post_childID, parentID, childID },
            },
          },
        },
      } = this.props;
      if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
        if (active_post_parentID === parentID) {
          let expObj = {
            parentID: parentID,
            childID: childID,
          };
          this.props.setActiveExperience(expObj);
          this.setPrivateJoinedEvent(expObj);
          this.goToJoinedPage();
        } else {
          this.setState({ isLoading: false });
          Alert.alert('LEAVE EVENT', 'You are in an active event. Would you like to leave that event?', [
            { text: 'No', onPress: () => {} },
            {
              text: 'Yes',
              onPress: () => {
                const eventObj = new FormData();
                eventObj.append('token', this.props.auth.access_token);
                // obj.append('_method', 'PUT');
                eventObj.append('parentID', parentID);
                eventObj.append('childID', childID);
                let obj = {
                  formData: eventObj,
                  leaveEventSuccess: () => {},
                  leaveEventFailure: () => {},
                };
                this.props.onLeaveEvent(obj);
                this.allowJoin();
              },
            },
          ]);
        }
      } else if (experience.activeExperience !== undefined && experience.activeExperience === null) {
        this.allowJoin();
      } else if (experience.activeExperience !== undefined && experience.activeExperience.parentID === parentID) {
        this.goToJoinedPage();
      } else {
        this.setState({ isLoading: false });
        Alert.alert('LEAVE EVENT', 'You are in an active event. Would you like to leave that event?', [
          { text: 'No', onPress: () => {} },
          {
            text: 'Yes',
            onPress: () => {
              const eventObj = new FormData();
              eventObj.append('token', this.props.auth.access_token);
              // obj.append('_method', 'PUT');
              eventObj.append('parentID', parentID);
              eventObj.append('childID', childID);
              let obj = {
                formData: eventObj,
                leaveEventSuccess: () => {},
                leaveEventFailure: () => {},
              };
              this.props.onLeaveEvent(obj);
              this.allowJoin();
            },
          },
        ]);
      }
    }
  };

  onFail = msg => {
    this.setState({ isLoading: false });
    Alert.alert('Join Event', msg);
  };

  onSuccessProfile = async data => {
    if (data && data.length > 0) {
      const {
        navigation: {
          state: {
            params: {
              data: { parentID, childID, sDate, eDate, is_deleted },
            },
          },
        },
      } = this.props;
      this.props.setEventLoad(false);
      let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, parentID, childID);
      if (!isJoin) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let sD = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
        let eD = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
        if (now > eD || is_deleted === 1 || is_deleted === true) {
          // Post Event
          this.props.navigation.replace('PostEvent', {
            parentID: parentID,
            childID: childID,
          });
        } else if (now > sD && now < eD) {
          // Live Event
          this.props.navigation.replace('LiveEvent', {
            parentID: parentID,
            childID: childID,
          });
        } else {
          // View EVent
          this.props.navigation.replace('ViewEvent', {
            parentID: parentID,
            childID: childID,
          });
        }
      }
    }
  };

  requestInvite = () => {
    const {
      navigation: {
        state: {
          params: {
            data: { navigationType },
          },
        },
      },
    } = this.props;

    this.setState({ isLoading: true });
    const { pincode } = this.state;
    const { parentID } = this.props.navigation.getParam('data');
    let obj = {
      token: this.props.auth.access_token,
      parentID: parentID,
      accessPin: pincode,
      onSuccess: data => {
        if (navigationType && navigationType === 'profile') {
          this.onSuccessProfile(data);
        } else {
          this.onSuccess(data);
        }
      },
      onFail: this.onFail,
    };
    this.props.onVerifyPin(obj);
  };

  GoBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      experience,
      navigation: {
        state: {
          params: {
            data: { parentID, title, name, type, description, sDate, eDate, photo, userImage, is_secret },
          },
        },
      },
    } = this.props;
    const { isRequestButton, isLoading } = this.state;
    let dateTime = '';
    if (moment(eDate).format('MMMM Do YYYY') === moment(sDate).format('MMMM Do YYYY')) {
      dateTime = `${moment(sDate)
        .format('dddd, D MMMM')
        .toString()
        .toUpperCase()} AT ${moment(sDate).format('hh:mm A')} -  ${moment(eDate).format('hh:mm A')}`;
    } else {
      dateTime = `${moment(sDate)
        .format('dddd, D MMMM')
        .toString()
        .toUpperCase()} AT ${moment(sDate).format('hh:mm A')}`;
    }
    return (
      <View style={{ backgroundColor: '#ECEDED', flex: 1 }}>
        <StyledCoverImage source={{ uri: photo }} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.keyboardAwareContentContainer}
        >
          <ViewEventHeader onBack={this.GoBack} hideShare={true} />
          <CardView
            title={title}
            name={name}
            isPublic={false}
            is_secret={is_secret}
            eventType={type}
            eventDescription={description}
            photoUrl={userImage}
            onFulfill={this.onFulfill}
            time={dateTime}
            onPress={this.requestInvite}
          />
          {isLoading && (
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
              <Loading />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboardAwareContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
});
const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    explore: state.explore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onVerifyPin: obj => {
      dispatch(ExperienceActions.verifyPin(obj));
    },
    onJoinEvent: obj => {
      dispatch(ExploreAction.joinEventRequest(obj));
    },
    onLeaveEvent: obj => {
      dispatch(ExperienceActions.leaveEvent(obj));
    },
    setActiveExperience: obj => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    setPrivateJoinedEvent: obj => {
      dispatch(ExperienceActions.setPrivateJoinedEvent(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyPin);
