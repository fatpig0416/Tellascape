import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Linking,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProgressiveImage from 'react-native-image-progress';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import styled from 'styled-components/native';
import Video from 'react-native-video';
const moment = require('moment');
import * as geolib from 'geolib';

// Import Explore and Experience actions
import { connect } from 'react-redux';
import ExploreAction from '../../home/reducers/index';
import ExperienceActions from '../../experience/reducers/event/index';
import StationActions from '../../experience/reducers/station';
import MemoryActions from '../../experience/reducers/memory';
import GetLocation from 'react-native-get-location';
// Load theme
import theme from '../../core/theme';
const { font, dimensions, colors, sizes, images } = theme;

// Load common components from common styles
import { StyledButton, StyledView, StyledWrapper, StyledGradientOverlay } from '../../core/common.styles';

// Load utils
import Loading from '../../../utils/loading';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { getUrlForDirection, isJoinedEvent, isJoinedStation, isJoinedMemory } from '../../../utils/funcs';
import _ from 'lodash';
// Load organisms
// import MediaView from '../../experience/components/organisms/MediaView';

const StyledTitleWrapper = styled.View`
  flex: 1;
`;

const StyledJoinText = styled.Text`
  font-size: ${hp('1.7%')};
  color: ${props => props.color || '#fff'};
  font-family: ${font.MMedium};
  font-weight: 500;
  margin-left: 10;
`;

const StyledTitleText = styled.Text`
  color: #212121;
  font-family: ${font.MSemiBold};
  font-size: ${wp('4.44%')};
  line-height: ${wp('5.27%')};
`;

const StyledDetailText = styled.Text`
  color: #515151;
  font-family: ${font.MRegular};
  font-weight: 500;
  font-size: ${wp('2.77%')};
  margin-left: ${props => props.marginLeft || 16};
`;

const StyledHandlerWrapper = styled.View`
  position: absolute;
  width: ${wp('100%')};
  align-items: center;
`;

const StyledHandler = styled.TouchableOpacity`
  width: ${wp('9.16%')};
  height: ${wp('0.83%')};
  border-radius: 2;
  background-color: #dcdcdc;
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('1.11%')};
`;

const HandlerButton = props => {
  return (
    <StyledHandlerWrapper>
      <StyledButton {...props}>
        <StyledHandler />
      </StyledButton>
    </StyledHandlerWrapper>
  );
};

const StyledCarouselWrapper = styled.View`
  height: ${wp('46.9%')};
`;

const StyledLikesIconText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #515151;
  font-family: ${font.MRegular};
  margin-left: ${sizes.smallPadding};
`;

const LikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.smallIconSize} color={iconColor || '#282828'} />
        <StyledLikesIconText>{count}</StyledLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

const ModalSoundButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      position: 'absolute',
      left: 8,
      top: 8,
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 12,
      borderRadius: 20,
    }}
  >
    <View>
      <CustomIcon name={props.muted ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'} size={16} color={'#FFF'} />
    </View>
  </TouchableOpacity>
);

const StyledCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 8;
  top: 8;
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0,0,0,0.3)';
`;

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
  </StyledCloseButton>
);

const StyledJoinButton = styled.TouchableOpacity`
  width: ${wp('46.67%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  margin-right: 8;
`;

const JoinButton = props => {
  return (
    <StyledJoinButton {...props}>
      <StyledGradientOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={props.gradient}
        borderRadius={wp('4.44%')}
      />
      <StyledWrapper row width={'100%'} height={'100%'} primary={'center'} secondary={'center'}>
        <CustomIcon name="add-24px" size={24} color="#fff" />
        <StyledJoinText>{'Join'}</StyledJoinText>
      </StyledWrapper>
    </StyledJoinButton>
  );
};

const StyledDirectionButton = styled.TouchableOpacity`
  width: ${wp('46.67%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  border-width: 1;
  border-color: #212121;
`;

const DirectionButton = props => {
  return (
    <StyledDirectionButton {...props}>
      <StyledWrapper row width={'100%'} height={'100%'} primary={'center'} secondary={'center'}>
        <CustomIcon name="Get-Directions_20x20" size={18} color="#000" />
        <StyledJoinText color={'#000'}>{'Directions'}</StyledJoinText>
      </StyledWrapper>
    </StyledDirectionButton>
  );
};

const StyledDescriptionText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #515151;
  font-family: ${font.MRegular};
`;

const StyledEventTypeImage = styled.Image`
  width: ${wp('4.44%')};
  height: ${wp('4.44%')};
  border-radius: ${wp('4.44%')};
`;

const StyledEventTypeWrapper = styled.View`
  position: absolute;
  left: 8;
  bottom: 13;
  flex-direction: row;
  align-items: center;
  padding-left: 4;
  padding-right: 8;
  height: ${wp('6.66%')};
  border-radius: ${wp('3.33%')};
  background-color: 'rgba(0,0,0,0.3)';
`;

const StyledEventTypeText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #ffffff;
  font-family: ${font.MRegular};
  margin-left: 4;
`;

const EventType = ({ eventType }) => {
  const eventImage =
    eventType === 'Event' ? images.MARKER_EVENT : eventType === 'Memory' ? images.MARKER_MEMORY : images.MARKER_STATION;

  return (
    <StyledEventTypeWrapper>
      <StyledEventTypeImage source={eventImage} />
      <StyledEventTypeText>{eventType}</StyledEventTypeText>
    </StyledEventTypeWrapper>
  );
};

class EventPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      title: '',
      likes: 0,
      comments: 0,
      slideIndex: 0,
      paused: false,
      isBuffer: false,
      muted: true,
    };
  }

  /**
   * Render carousel item
   *
   */

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }
  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didBlur', () => {
        this.setState({ paused: true });
      }),
    ];
  };
  _renderCarouselItem = ({ item, index }) => {
    const { slideIndex, paused, isBuffer, muted } = this.state;
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={async () => {
            this.setState({ paused: true });
            this.props.onDismissEventPopup();
            const { eventData } = this.props;
            if (eventData.type === 'event') {
              if (this.props.event_data && this.props.event_data.length > 0) {
                const { parentID, child_ID, sDate, eDate } = this.props.event_data[0];
                let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, parentID, child_ID);
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
              }
            } else if (eventData.type === 'station') {
              if (this.props.station_data && this.props.station_data.length > 0) {
                const { parentID, child_ID } = this.props.station_data[0];
                let isJoin = await isJoinedStation(this.props.navigation, this.props.station, parentID, child_ID);
                if (!isJoin) {
                  this.props.navigation.navigate('LiveStation', {
                    parentID: parentID,
                    childID: child_ID,
                  });
                }
              }
            } else if (eventData.type === 'memory') {
              if (this.props.memory_data && this.props.memory_data.length > 0) {
                const { parentID, child_ID } = this.props.memory_data[0];
                let isJoin = await isJoinedMemory(this.props.navigation, this.props.memory, parentID, child_ID);
                if (!isJoin) {
                  this.props.navigation.navigate('LiveMemory', {
                    parentID: parentID,
                    childID: child_ID,
                  });
                }
              }
            }
          }}
        >
          {item.video_url ? (
            <View style={styles.progressiveImage}>
              <Video
                ref={ref => {
                  this.video = ref;
                }}
                source={{
                  uri: item.video_url,
                  // headers: {
                  //   range: 'bytes=0',
                  // },
                }}
                style={{
                  width: '100%',
                  height: wp('51.4%'),
                }}
                rate={1}
                playWhenInactive={false}
                muted={muted}
                repeat={true}
                paused={paused ? true : slideIndex === index ? false : true}
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
          ) : (
            <ProgressiveImage
              source={{ uri: item.url }}
              style={styles.progressiveImage}
              imageStyle={styles.progressiveImageStyle}
            />
          )}
        </TouchableWithoutFeedback>
        {item.video_url && <ModalSoundButton onPress={() => this.setState({ muted: !muted })} muted={muted} />}
      </View>
    );
  };

  /**
   * Get directions
   *
   */

  onGetDirection = () => {
    const {
      eventData: { currentLocation, location },
    } = this.props;
    const url = getUrlForDirection(currentLocation, location);
    Linking.openURL(url);
  };

  leavePost = () => {
    const { eventData } = this.props;

    const { activeStation } = this.props.station;
    const { activeMemory } = this.props.memory;
    const { activeExperience } = this.props.experience;

    let alertTitle = '',
      alertBody = '';
    let parentID, child_ID, type;
    if (activeStation != null) {
      alertTitle = 'LEAVE STATION';
      alertBody = 'You are in an active station. Would you like to leave that station?';
      type = 'station';
      parentID = activeStation.parentID;
      child_ID = activeStation.childID;
    } else if (activeMemory != null) {
      alertTitle = 'LEAVE MEMORY';
      alertBody = 'You are in an active event. Would you like to leave that memory?';
      type = 'memory';
      parentID = activeMemory.parentID;
      child_ID = activeMemory.childID;
    } else {
      alertTitle = 'LEAVE EVENT';
      alertBody = 'You are in an active event. Would you like to leave that event?';
      type = 'event';
      parentID = activeExperience != null ? activeExperience.parentID : '';
      child_ID = activeExperience != null ? activeExperience.childID : '';
    }
    Alert.alert(alertTitle, alertBody, [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          const eventObj = new FormData();
          eventObj.append('token', this.props.auth.access_token);
          // obj.append('_method', 'PUT');
          eventObj.append('parentID', parentID);
          eventObj.append('childID', child_ID);
          if (type === 'station') {
            let obj = {
              formData: eventObj,
              leaveStationSuccess: () => {},
              leaveStationFailure: () => {},
            };
            // this.props.onLeaveStation(obj);
            if (eventData.type === 'station') {
              this.allowJoinStation();
            } else if (eventData.type === 'memory') {
              this.allowJoinMemory();
            } else {
              this.allowJoin();
            }
          } else if (type === 'memory') {
            let obj = {
              formData: eventObj,
              leaveMemorySuccess: () => {},
              leaveMemoryFailure: () => {},
            };
            // this.props.onLeaveMemory(obj);
            if (eventData.type === 'station') {
              this.allowJoinStation();
            } else if (eventData.type === 'memory') {
              this.allowJoinMemory();
            } else {
              this.allowJoin();
            }
          } else {
            let obj = {
              formData: eventObj,
              leaveEventSuccess: () => {},
              leaveEventFailure: () => {},
            };
            // this.props.onLeaveEvent(obj);
            if (eventData.type === 'station') {
              this.allowJoinStation();
            } else if (eventData.type === 'memory') {
              this.allowJoinMemory();
            } else {
              this.allowJoin();
            }
          }
        },
      },
    ]);
  };

  /* Join Event */

  onJoinEvent = () => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { sDate, eDate } = this.props.event_data[0];
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let startDate = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
      let endDate = moment(eDate).format('YYYY-MM-DD HH:mm:ss');

      let isValid = false;

      if (now > endDate) {
        Alert.alert('Warning', "You can't join this event.");
      } else if (now > startDate && now < endDate) {
        // Live Event
        isValid = true;
      } else {
        // View EVent
        isValid = false;
      }
      if (isValid) {
        if (this.props.event_data && this.props.event_data.length > 0) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              let polygon = [];
              this.props.event_data[0].fenceBuffer.coordinates[0].map((item, index) => {
                let obj = { lat: item[1], lng: item[0] };
                polygon.push(obj);
              });

              let point = {
                lat: location.latitude,
                lng: location.longitude,
              };
              try {
                if (geolib.isPointInPolygon(point, polygon)) {
                  this.checkForJoin();
                } else {
                  this.setState({ isOpen: false });
                  Alert.alert('KEEP IT REAL', 'You must be inside of the geo-fence to join event.');
                }
              } catch (e) {
                Alert.alert('Tellascape', 'To continue, turn on device location.');
                console.log(`unable to get location: ${JSON.stringify(e)}`);
              }
            })
            .catch(error => {
              const { code, message } = error;
              console.warn(code, message);
            });
        }
      }
    }
  };

  checkForJoin = () => {
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { experience, eventData } = this.props;
      const { privateJoinedEvents } = this.props.experience;
      const {
        title,
        parentID,
        child_ID,
        sDate,
        eDate,
        founder,
        founder_photo,
        coverphoto,
        description,
        founder_uid,
        type,
        active_post_parentID,
        active_post_childID,
        isPrivate,
        is_user_invited,
      } = this.props.event_data[0];
      const rsvpList = eventData.rsvp_user.filter(item => {
        return item.userID === this.props.auth.uid;
      });
      let index = -1;
      if (privateJoinedEvents && privateJoinedEvents.length > 0) {
        index = privateJoinedEvents.findIndex(item => item.parentID === parentID);
      }
      if (
        isPrivate &&
        is_user_invited === false &&
        rsvpList.length === 0 &&
        founder_uid !== this.props.auth.uid &&
        index === -1
      ) {
        const {
          eventData: { location },
        } = this.props;
        let obj = {
          active_post_parentID: active_post_parentID,
          active_post_childID: active_post_childID,
          parentID: parentID,
          childID: child_ID,
          location: location,
          myChildID: this.props.event_data[0].myChildID,
          title: title,
          name: founder,
          type: type,
          description: description,
          sDate: sDate,
          photo: coverphoto,
          userImage: founder_photo,
          eDate: eDate,
        };
        this.props.onDismissEventPopup();
        this.props.navigation.navigate('VerifyPin', {
          data: obj,
        });
      } else {
        if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
          if (active_post_parentID === parentID) {
            let expObj = {
              parentID: parentID,
              childID: child_ID,
            };
            this.props.setActiveExperience(expObj);
            this.goToJoinedPage();
          } else {
            this.leavePost();
          }
        } else if (experience.activeExperience !== undefined && experience.activeExperience === null) {
          this.allowJoin();
        } else if (experience.activeExperience !== undefined && experience.activeExperience.parentID === parentID) {
          this.goToJoinedPage();
        } else {
          this.leavePost();
        }
      }
    }
  };

  allowJoin = () => {
    this.setState({
      isLoading: true,
    });

    const {
      eventData: { parentID, location }, // from parent component
      // from redux store
      auth: { access_token },
    } = this.props;

    const { myChildID } = this.props.event_data[0];
    try {
      const joinReqObj = new FormData();
      let centerPoint = {
        lat: location.latitude ? location.latitude : '',
        lng: location.longitude ? location.longitude : '',
      };
      joinReqObj.append('token', access_token);
      joinReqObj.append('parentID', parentID);
      joinReqObj.append('myChildID', myChildID);
      joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
      let obj = {
        joinObj: joinReqObj,
        joinEventSuccess: this.joinEventSuccess,
        joinEventFailure: this.joinEventFailure,
      };

      // Call joinEvent API
      this.props.onJoinEvent(obj);
      // Add to the joinedEvents list
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
    this.goToJoinedPage();
  };

  joinEventFailure = msg => {
    this.setState({ isLoading: false });
    Alert.alert('Warning', "You can't join this event.");
  };

  goToJoinedPage = () => {
    const {
      eventData: { startdate, enddate, navigation }, // from parent component
      explore: { joinedEvent },
    } = this.props;
    const { parentID, child_ID } = this.props.event_data[0];

    const passedObj = {
      parentID,
      childID: child_ID,
    };
    this.props.setActiveStation(null);
    this.props.setActiveMemory(null);
    this.props.setJoinEventClose(null);
    this.props.onDismissEventPopup();
    navigation.navigate('JoinEvent', passedObj);
  };

  /* Join Event */

  /* Join Station */
  onJoinStation = () => {
    if (this.props.station_data && this.props.station_data.length > 0) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          let polygon = [];
          this.props.station_data[0].fenceBuffer.coordinates[0].map((item, index) => {
            let obj = { lat: item[1], lng: item[0] };
            polygon.push(obj);
          });

          let point = {
            lat: location.latitude,
            lng: location.longitude,
          };
          try {
            if (geolib.isPointInPolygon(point, polygon)) {
              this.checkForJoinStation();
            } else {
              this.setState({ isOpen: false });
              Alert.alert('KEEP IT REAL', 'You must be inside of the geo-fence to join event.');
            }
          } catch (e) {
            Alert.alert('Tellascape', 'To continue, turn on device location.');
            console.log(`unable to get location: ${JSON.stringify(e)}`);
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
    }
  };

  checkForJoinStation = () => {
    if (this.props.station_data && this.props.station_data.length > 0) {
      const { activeStation } = this.props.station;
      const { parentID, child_ID, active_post_parentID, active_post_childID } = this.props.station_data[0];

      if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
        if (active_post_parentID === parentID) {
          let expObj = {
            parentID: parentID,
            childID: child_ID,
          };
          this.props.setActiveStation(expObj);
          this.goToJoinedStation();
        } else {
          this.leavePost();
        }
      } else if (activeStation !== undefined && activeStation === null) {
        this.allowJoinStation();
      } else if (activeStation !== undefined && activeStation.parentID === parentID) {
        this.goToJoinedStation();
      } else {
        this.leavePost();
      }
    }
  };

  allowJoinStation = () => {
    this.setState({
      isLoading: true,
    });

    const {
      eventData: { parentID, location }, // from parent component
      // from redux store
      auth: { access_token },
    } = this.props;

    const { myChildID } = this.props.station_data[0];
    try {
      const joinReqObj = new FormData();
      let centerPoint = {
        lat: location.latitude ? location.latitude : '',
        lng: location.longitude ? location.longitude : '',
      };
      joinReqObj.append('token', access_token);
      joinReqObj.append('parentID', parentID);
      joinReqObj.append('myChildID', myChildID);
      joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
      let obj = {
        joinObj: joinReqObj,
        onSuccess: data => {
          this.setState({
            isLoading: false,
          });

          let expObj = {
            parentID: data.parentID,
            childID: data.childID,
          };
          this.props.setActiveStation(expObj);
          this.goToJoinedStation();
        },
        onFail: this.joinStationFailure,
      };

      // Call joinEvent API
      this.props.onJoinStation(obj);
      // Add to the joinedEvents list
    } catch (error) {
      Alert.alert('Warning', "You can't join this station.");
      this.setState({
        isLoading: false,
      });
    }
  };

  goToJoinedStation = () => {
    const {
      eventData: { startdate, enddate, navigation },
      explore: { joinedEvent },
    } = this.props;
    const { parentID, child_ID } = this.props.station_data[0];
    const passedObj = {
      parentID,
      childID: child_ID,
    };
    this.props.setActiveExperience(null);
    this.props.setActiveMemory(null);
    this.props.setJoinEventClose(null);
    this.props.onDismissEventPopup();
    navigation.navigate('JoinStation', passedObj);
  };
  navigateToPostStation = () => {
    const {
      eventData: { startdate, enddate, navigation },
      explore: { joinedEvent },
    } = this.props;
    const { parentID, child_ID } = this.props.station_data[0];
    const passedObj = {
      parentID,
      childID: child_ID,
    };
    this.props.setActiveExperience(null);
    this.props.setActiveMemory(null);
    this.props.onDismissEventPopup();
    navigation.navigate('PostStation', passedObj);
  };

  joinStationFailure = (msg, code) => {
    this.setState({ isLoading: false });
    if (code === 400) {
      Alert.alert(
        'Join Station',
        'Selected Station already Ended up, you can\'t join the ended station. Click "Okay" to navigate on Post Station',
        [
          {
            text: 'Okay',
            onPress: () => {
              this.navigateToPostStation();
            },
          },
        ]
      );
    } else {
      Alert.alert('Warning', "You can't join this station.");
    }
  };
  /* Join Station */

  /* Join Memory */
  onJoinMemory = () => {
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          let polygon = [];
          this.props.memory_data[0].fenceBuffer.coordinates[0].map((item, index) => {
            let obj = { lat: item[1], lng: item[0] };
            polygon.push(obj);
          });

          let point = {
            lat: location.latitude,
            lng: location.longitude,
          };
          try {
            if (geolib.isPointInPolygon(point, polygon)) {
              this.checkForJoinMemory();
            } else {
              this.setState({ isOpen: false });
              Alert.alert('KEEP IT REAL', 'You must be inside of the geo-fence to join event.');
            }
          } catch (e) {
            Alert.alert('Tellascape', 'To continue, turn on device location.');
            console.log(`unable to get location: ${JSON.stringify(e)}`);
          }
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
    }
  };

  checkForJoinMemory = () => {
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      const { activeMemory } = this.props.memory;
      const { parentID, child_ID, active_post_parentID, active_post_childID } = this.props.memory_data[0];

      if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
        if (active_post_parentID === parentID) {
          let expObj = {
            parentID: parentID,
            childID: child_ID,
          };
          this.props.setActiveMemory(expObj);
          this.goToJoinedMemory();
        } else {
          this.leavePost();
        }
      } else if (activeMemory !== undefined && activeMemory === null) {
        this.allowJoinMemory();
      } else if (activeMemory !== undefined && activeMemory.parentID === parentID) {
        this.goToJoinedMemory();
      } else {
        this.leavePost();
      }
    }
  };

  allowJoinMemory = () => {
    this.setState({
      isLoading: true,
    });

    const {
      eventData: { parentID, location }, // from parent component
      // from redux store
      auth: { access_token },
    } = this.props;

    const { myChildID } = this.props.memory_data[0];
    try {
      const joinReqObj = new FormData();
      let centerPoint = {
        lat: location.latitude ? location.latitude : '',
        lng: location.longitude ? location.longitude : '',
      };
      joinReqObj.append('token', access_token);
      joinReqObj.append('parentID', parentID);
      joinReqObj.append('myChildID', myChildID);
      joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
      let obj = {
        joinObj: joinReqObj,
        onSuccess: data => {
          this.setState({
            isLoading: false,
          });

          let expObj = {
            parentID: data.parentID,
            childID: data.childID,
          };
          this.props.setActiveMemory(expObj);
          this.goToJoinedMemory();
        },
        onFail: this.joinMemoryFailure,
      };

      // Call joinEvent API
      this.props.onJoinMemory(obj);
      // Add to the joinedEvents list
    } catch (error) {
      Alert.alert('Warning', "You can't join this memory.");
      this.setState({
        isLoading: false,
      });
    }
  };

  goToJoinedMemory = () => {
    const {
      eventData: { startdate, enddate, navigation },
      explore: { joinedEvent },
    } = this.props;
    const { parentID, child_ID } = this.props.memory_data[0];
    const passedObj = {
      parentID,
      childID: child_ID,
    };
    this.props.setActiveExperience(null);
    this.props.setActiveStation(null);
    this.props.setJoinEventClose(null);
    this.props.onDismissEventPopup();
    navigation.navigate('JoinMemory', passedObj);
  };

  joinMemoryFailure = msg => {
    this.setState({ isLoading: false });
    Alert.alert('Warning', "You can't join this memory.");
  };
  /* Join Memory */

  leaveEventFailure = () => {
    Alert.alert('Warning', 'Ooops. Something went wrong');
  };

  render() {
    const { eventData, inGeofence } = this.props;
    const { activeStation } = this.props.station;
    const { activeMemory } = this.props.memory;
    const { activeExperience } = this.props.experience;

    const exploreData =
      eventData.type === 'station'
        ? this.props.station_data
        : eventData.type === 'memory'
        ? this.props.memory_data
        : this.props.event_data;
    if (exploreData && exploreData.length > 0) {
      const { isLoading, slideIndex } = this.state;
      const { trending, myChildID, description } = exploreData[0];

      const {
        eventData: { type, parentID, title: eventTitle },
        explore: { joinedEventsList },
        style: propsStyle,
        onDismissEventPopup,
      } = this.props;

      // Event type string
      const typeString = type === 'event' ? 'Event' : type === 'memory' ? 'Memory' : 'Station';

      // Check if this event is registered in the store
      const joinedEventIndex = joinedEventsList.findIndex(ele => ele.parentID === parentID && myChildID);

      const { sDate, eDate, coverphoto } = exploreData[0];
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let startDate = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
      let endDate = moment(eDate).format('YYYY-MM-DD HH:mm:ss');

      return (
        <Animated.View style={[propsStyle, styles.container]}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <StyledCarouselWrapper>
                {trending ? (
                  <>
                    <Carousel
                      ref={c => {
                        this._carousel = c;
                      }}
                      data={trending.length > 0 ? trending : [{ url: coverphoto }]}
                      renderItem={this._renderCarouselItem}
                      sliderWidth={dimensions.width}
                      itemWidth={wp('100%')}
                      activeSlideAlignment={'center'}
                      firstItem={0}
                      inactiveSlideScale={0.9}
                      removeClippedSubviews={false}
                      inactiveSlideOpacity={1}
                      onSnapToItem={index => {
                        this.setState({ slideIndex: index });
                      }}
                    />
                    <EventType eventType={typeString} />
                  </>
                ) : null}
              </StyledCarouselWrapper>

              <HandlerButton onPress={onDismissEventPopup} />
              <CloseButton onPress={onDismissEventPopup} />

              <StyledWrapper width={'100%'} paddingTop={8} paddingLeft={8} paddingRight={8}>
                <StyledView>
                  <StyledTitleText>{(trending.length > 0 && trending[slideIndex].title) || eventTitle}</StyledTitleText>
                  <StyledWrapper row marginTop={8}>
                    {/* <RNImage
                      source={markerIcon}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        width: wp('4.44%'),
                        height: wp('4.44%'),
                        resizeMode: 'contain',
                        marginRight: wp('1.66%'),
                      }}
                    />
                    <StyledDetailText marginLeft={0.1}>{`${typeString}`}</StyledDetailText> */}
                    {/* <StyledDetailText>{`🔥 ${trending[slideIndex].likes || 0}`}</StyledDetailText> */}
                    <LikesIconDetail
                      iconName={'love-big_16x16'}
                      count={(trending.length > 0 && trending[slideIndex].likes) || 0}
                      disabled
                    />
                    {/* <StyledDetailText>{`💬 ${trending[slideIndex].commentCount || 0}`}</StyledDetailText> */}
                    <LikesIconDetail
                      disabled
                      iconName={'comments-big_16x16'}
                      count={(trending.length > 0 && trending[slideIndex].commentCount) || 0}
                      marginLeft={16}
                    />
                  </StyledWrapper>
                </StyledView>

                {description ? (
                  <StyledWrapper marginTop={8}>
                    <StyledDescriptionText>{description}</StyledDescriptionText>
                  </StyledWrapper>
                ) : null}

                <StyledWrapper row marginTop={wp('3.61%')} marginBottom={25} primary={'space-between'}>
                  {now > endDate
                    ? null
                    : joinedEventIndex === -1
                    ? inGeofence &&
                      (eventData.type === 'station' ? (
                        activeStation !== null && activeStation.parentID === exploreData[0].parentID ? null : (
                          <JoinButton onPress={this.onJoinStation} gradient={theme.blue.graident} />
                        )
                      ) : eventData.type === 'memory' ? (
                        activeMemory !== null && activeMemory.parentID === exploreData[0].parentID ? null : (
                          <JoinButton onPress={this.onJoinMemory} gradient={theme.cyan.graident} />
                        )
                      ) : now > startDate ? (
                        activeExperience !== null && activeExperience.parentID === exploreData[0].parentID ? null : (
                          <JoinButton onPress={this.onJoinEvent} gradient={theme.orange.graident} />
                        )
                      ) : null)
                    : null}
                  <DirectionButton onPress={this.onGetDirection} />
                </StyledWrapper>
              </StyledWrapper>
            </>
          )}
        </Animated.View>
      );
    } else {
      return <Loading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    borderTopLeftRadius: wp('4.2%'),
    borderTopRightRadius: wp('4.2%'),
    backgroundColor: '#ffffff',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressiveImage: {
    width: '100%',
    height: wp('51.4%'),
  },
  progressiveImageStyle: {
    resizeMode: 'cover',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    explore: state.explore,
    experience: state.experience,
    event_data: state.experience.event_data,
    station: state.station,
    station_data: state.station.station_data,
    memory: state.memory,
    memory_data: state.memory.memory_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onJoinEvent: obj => {
      dispatch(ExploreAction.joinEventRequest(obj));
    },
    onSaveJoinedEvents: obj => {
      dispatch(ExploreAction.saveJoinedEvents(obj));
    },
    setJoinEventData: obj => {
      dispatch(ExperienceActions.setJoinEventData(obj));
    },
    setActiveExperience: obj => {
      dispatch(ExperienceActions.setActiveExperience(obj));
    },
    onLeaveEvent: obj => {
      dispatch(ExperienceActions.leaveEvent(obj));
    },
    onJoinStation: obj => {
      dispatch(StationActions.joinStation(obj));
    },
    onLeaveStation: obj => {
      dispatch(StationActions.leaveStation(obj));
    },
    setActiveStation: obj => {
      dispatch(StationActions.setActiveStation(obj));
    },
    onJoinMemory: obj => {
      dispatch(MemoryActions.joinMemory(obj));
    },
    onLeaveMemory: obj => {
      dispatch(MemoryActions.leaveMemory(obj));
    },
    setActiveMemory: obj => {
      dispatch(MemoryActions.setActiveMemory(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventPopup);
