/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Alert, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';
import theme from '../../core/theme';
import { connect } from 'react-redux';
import { getUserCurrentLocation } from '../../../utils/funcs';
import ExploreAction from '../../home/reducers/index';
import ExperienceActions from '../reducers/event/index';
import StationActions from '../reducers/station';
import MemoryActions from '../reducers/memory';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import moment from 'moment';
import { LatLng, computeOffset } from 'spherical-geometry-js';
import GetLocation from 'react-native-get-location';

import { StyledText, StyledButton, StyledHorizontalContainer } from '../../core/common.styles';
const { images, colors, font, gradients } = theme;

const StyledModalBoxBody = styled.View`
  width: ${wp('95.83%')};
  border-top-left-radius: ${props => (!props.isExistingJoinable ? 20 : 0)};
  border-top-right-radius: ${props => (!props.isExistingJoinable ? 20 : 0)};
  border-bottom-left-radius: 20;
  border-bottom-right-radius: 20;
  background-color: ${colors.LightGreyTwo};
  padding-bottom: ${hp('2.5%')};
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
`;

const StyledEventCard = styled.View`
  width: ${wp('42.22%')};
  height: ${hp('18.63%')};
  border-radius: 10;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.94);
`;

const StyledEventIcon = styled.Image`
  width: ${hp('6.5%')};
  height: ${hp('6.5%')};
  margin-bottom: 10;
  resize-mode: contain;
`;

const StyledTitleText = styled.Text`
  color: #454545;
  font-family: ${font.MRegular};
  font-size: ${wp('4%')};
  font-weight: 500;
`;

const StyledDescriptionText = styled.Text`
  opacity: 0.7;
  color: #626262;
  font-family: ${font.MRegular};
  font-size: ${wp('3%')};
  line-height: 18;
  text-align: center;
`;

const EventCard = props => (
  <StyledButton {...props}>
    <StyledEventCard>
      <StyledEventIcon source={props.icon} />
      <StyledTitleText>{props.title}</StyledTitleText>
      <StyledDescriptionText>{props.description}</StyledDescriptionText>
    </StyledEventCard>
  </StyledButton>
);

const StyledMemoryCard = styled.View`
  width: 100%;
  height: ${hp('20.53%')};
  background-color: rgba(255, 255, 255, 0.94);
  margin-top: ${hp('1.25%')};
  border-radius: 10;
  font-family: ${font.MRegular};
`;

const StyledMemoryBody = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-family: ${font.MRegular};
`;

const StyledMemoryBottomWrapper = styled.View`
  width: 100%;
  height: ${hp('5.72%')};
  border-top-width: ${hp('0.16%')};
  border-top-color: rgba(0, 0, 0, 0.18);
  flex-direction: row;
  align-items: center;
  font-family: ${font.MRegular};
`;

const StyledMemoryBottomButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  font-family: ${font.MRegular};
  align-items: center;
`;

const StyledMemoryBottomButtonText = styled.Text`
  font-size: 15;
  line-height: 18;
  color: #454545;
  font-family: ${font.MRegular};
  font-weight: 600;
`;

const MemoryBottomButton = props => (
  <StyledMemoryBottomButton {...props}>
    <StyledMemoryBottomButtonText>{props.title}</StyledMemoryBottomButtonText>
  </StyledMemoryBottomButton>
);

const StyledBottomSeparator = styled.View`
  width: ${wp('0.28%')};
  height: ${hp('5.72%')};
  background-color: rgba(0, 0, 0, 0.18);
`;

const MemoryCard = props => (
  <StyledMemoryCard>
    <StyledMemoryBody>
      <StyledEventIcon source={images.JELLY_MEMORY} />
      <StyledDescriptionText>
        {'capture your special moment now or start\ndreaming and make it come true'}
      </StyledDescriptionText>
    </StyledMemoryBody>
    <StyledMemoryBottomWrapper>
      <MemoryBottomButton onPress={props.onStartMemory} title={'Start Memory'} />
      <StyledBottomSeparator />
      <MemoryBottomButton onPress={props.onPlanMemory} title={'Plan Memory'} />
    </StyledMemoryBottomWrapper>
  </StyledMemoryCard>
);

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeIndex: 0,
    };
    this._redirectLiveMemory = this._redirectLiveMemory.bind(this);
  }

  UNSAFE_componentWillMount() {
    this._fetchData();
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData();
      }),
    ];
  };

  _fetchData = async () => {
    let location = await getUserCurrentLocation();
    const { amazingRequest } = this.props.explore;
    const { access_token } = this.props.auth;
    const amazingReqObj = {
      token: access_token,
      lat: location.latitude,
      lng: location.longitude,
    };
    if (!amazingRequest) this.props.onGetAmazings(amazingReqObj);
  };

  navigateToEvent = item => {
    this.props.setEventLoad(false);
    this.props.setActiveStation(null);
    this.props.setActiveMemory(null);
    this.props.setJoinEventClose(null);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('JoinEvent', {
      parentID: item.parentID,
      childID: item.childID,
      isExpStack: true,
    });
    this.props.onCloseToggle();
  };

  callJoinEvent = item => {
    const { access_token } = this.props.auth;
    let centerPoint = {
      lat: item.centerPoint.lat ? item.centerPoint.lat : '',
      lng: item.centerPoint.lng ? item.centerPoint.lng : '',
    };
    const joinReqObj = new FormData();
    joinReqObj.append('token', access_token);
    joinReqObj.append('parentID', item.postID);
    joinReqObj.append('myChildID', item.myChildID);
    joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
    let obj = {
      joinObj: joinReqObj,
      joinEventSuccess: this.joinEventSuccess,
      joinEventFailure: this.joinEventFailure,
    };
    this.setState({ isLoading: true });
    this.props.onJoinEvent(obj);
  };

  joinEventSuccess = data => {
    this.setState({ isLoading: false });
    let expObj = {
      parentID: data.parentID,
      childID: data.childID,
    };
    this.props.setActiveExperience(expObj);
    let obj = {
      parentID: data.parentID,
      childID: data.childID,
    };
    this.navigateToEvent(obj);
  };
  joinEventFailure = () => {
    this.setState({ isLoading: false });
    Alert.alert('Warning', "You can't join this Event.");
  };

  onPressEvent = item => {
    const {
      title,
      postID,
      childID,
      active_post_parentID,
      active_post_childID,
      centerPoint,
      myChildID,
      isPrivate,
      userName,
      type,
      description,
      sDate,
      eDate,
      media,
      founder_photo,
      rsvp_user,
      founder_uid,
    } = item;

    const { experience } = this.props;
    const rsvpList = rsvp_user.filter(item => {
      return item.userID === this.props.auth.uid;
    });
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let startD = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
    let endD = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
    if (startD > now) {
      this.props.navigation.navigate('ViewEvent', {
        parentID: postID,
        childID: childID,
      });
      this.props.onCloseToggle();
    } else {
      const { privateJoinedEvents } = this.props.experience;
      let index = -1;
      if (privateJoinedEvents && privateJoinedEvents.length > 0) {
        index = privateJoinedEvents.findIndex(item => item.parentID === postID);
      }
      if (isPrivate && founder_uid !== this.props.auth.uid && rsvpList.length === 0 && index === -1) {
        if (item.is_user_invited !== undefined && item.is_user_invited === true) {
          this.callJoinEvent(item);
        } else {
          let location = {
            latitude: centerPoint.lat,
            longitude: centerPoint.lng,
          };
          let obj = {
            active_post_parentID: active_post_parentID,
            active_post_childID: active_post_childID,
            parentID: postID,
            childID: childID,
            location: location,
            myChildID: myChildID,
            title: title,
            name: userName,
            type: type,
            description: description,
            sDate: sDate,
            eDate: eDate,
            photo: media,
            userImage: founder_photo,
          };
          this.props.setEventLoad(false);
          this.props.navigation.popToTop();
          this.props.navigation.navigate('HomeBottom');
          this.props.navigation.navigate('VerifyPin', {
            data: obj,
          });
          this.props.onCloseToggle();
        }
      } else {
        if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
          if (active_post_parentID === postID) {
            let expObj = {
              parentID: postID,
              childID: childID,
            };
            this.props.setActiveExperience(expObj);
            let obj = {
              parentID: postID,
              childID: childID,
            };
            this.navigateToEvent(obj);
          } else {
            Alert.alert('LEAVE EVENT', 'You are in an active event. Would you like to leave that event?', [
              { text: 'No', onPress: () => {} },
              {
                text: 'Yes',
                onPress: () => {
                  const eventObj = new FormData();
                  eventObj.append('token', this.props.auth.access_token);
                  // obj.append('_method', 'PUT');
                  eventObj.append('parentID', postID);
                  eventObj.append('childID', childID);
                  let obj = {
                    formData: eventObj,
                    leaveEventSuccess: () => {},
                    leaveEventFailure: () => {},
                  };
                  this.props.onLeaveEvent(obj);
                  this.callJoinEvent(item);
                },
              },
            ]);
          }
        } else if (experience.activeExperience !== undefined && experience.activeExperience === null) {
          this.callJoinEvent(item);
        } else if (experience.activeExperience !== undefined && experience.activeExperience.parentID === postID) {
          let obj = {
            parentID: postID,
            childID: childID,
          };
          this.navigateToEvent(obj);
        } else {
          Alert.alert('LEAVE EVENT', 'You are in an active event. Would you like to leave that event?', [
            { text: 'No', onPress: () => {} },
            {
              text: 'Yes',
              onPress: () => {
                const eventObj = new FormData();
                eventObj.append('token', this.props.auth.access_token);
                // obj.append('_method', 'PUT');
                eventObj.append('parentID', postID);
                eventObj.append('childID', childID);
                let obj = {
                  formData: eventObj,
                  leaveEventSuccess: () => {},
                  leaveEventFailure: () => {},
                };
                this.props.onLeaveEvent(obj);
                this.callJoinEvent(item);
              },
            },
          ]);
        }
      }
    }
  };

  onPressStation = item => {
    const { postID, childID, active_post_parentID, active_post_childID } = item;
    const { activeStation } = this.props.station;
    if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
      if (active_post_parentID === postID) {
        let expObj = {
          parentID: postID,
          childID: childID,
        };
        this.props.setActiveStation(expObj);
        let obj = {
          parentID: postID,
          childID: childID,
        };
        this.navigateToStation(obj);
      } else {
        Alert.alert('LEAVE STATION', 'You have already join another station. Can you leave station ?', [
          { text: 'No', onPress: () => {} },
          {
            text: 'Yes',
            onPress: () => {
              const eventObj = new FormData();
              eventObj.append('token', this.props.auth.access_token);
              // obj.append('_method', 'PUT');
              eventObj.append('parentID', postID);
              eventObj.append('childID', childID);
              let obj = {
                formData: eventObj,
                leaveStationSuccess: () => {},
                leaveStationFailure: () => {},
              };
              this.props.onLeaveStation(obj);
              this.callJoinStation(item);
            },
          },
        ]);
      }
    } else if (activeStation !== undefined && activeStation === null) {
      this.callJoinStation(item);
    } else if (activeStation !== undefined && activeStation.parentID === postID) {
      let obj = {
        parentID: postID,
        childID: childID,
      };
      this.navigateToStation(obj);
    } else {
      Alert.alert('LEAVE STATION', 'You have already join another station. Can you leave station ?', [
        { text: 'No', onPress: () => {} },
        {
          text: 'Yes',
          onPress: () => {
            const eventObj = new FormData();
            eventObj.append('token', this.props.auth.access_token);
            // obj.append('_method', 'PUT');
            eventObj.append('parentID', postID);
            eventObj.append('childID', childID);
            let obj = {
              formData: eventObj,
              leaveStationSuccess: () => {},
              leaveStationFailure: () => {},
            };
            this.props.onLeaveStation(obj);
            this.callJoinStation(item);
          },
        },
      ]);
    }
  };

  callJoinStation = item => {
    const { access_token } = this.props.auth;
    let centerPoint = {
      lat: item.centerPoint.lat ? item.centerPoint.lat : '',
      lng: item.centerPoint.lng ? item.centerPoint.lng : '',
    };
    const joinReqObj = new FormData();
    joinReqObj.append('token', access_token);
    joinReqObj.append('parentID', item.postID);
    joinReqObj.append('myChildID', item.myChildID);
    joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
    let obj = {
      joinObj: joinReqObj,
      onSuccess: data => {
        this.setState({ isLoading: false });
        let expObj = {
          parentID: data.parentID,
          childID: data.childID,
        };
        this.props.setActiveStation(expObj);
        let obj = {
          parentID: data.parentID,
          childID: data.childID,
        };
        this.navigateToStation(obj);
      },
      onFail: (msg, code) => {
        this.setState({ isLoading: false });
        if (code === 400) {
          Alert.alert('Join Station', 'Selected Station already ended, Click "Okay" to navigate on Post Station', [
            {
              text: 'Okay',
              onPress: () => {
                this.navigateToPostStation(item);
              },
            },
          ]);
        } else {
          Alert.alert('Warning', "You can't join this station.");
        }
      },
    };
    this.setState({ isLoading: true });
    this.props.onJoinStation(obj);
  };

  navigateToStation = item => {
    this.props.setStationLoad(false);
    this.props.setActiveExperience(null);
    this.props.setActiveMemory(null);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('JoinStation', {
      parentID: item.parentID,
      childID: item.childID,
      isExpStack: true,
    });
    this.props.onCloseToggle();
  };
  navigateToPostStation = item => {
    this.props.setStationLoad(false);
    this.props.setActiveExperience(null);
    this.props.setActiveMemory(null);
    this.props.setJoinEventClose(null);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('PostStation', {
      parentID: item.postID,
      childID: item.childID,
      isExpStack: true,
    });
    this.props.onCloseToggle();
  };

  onPressMemory = item => {
    const { postID, childID, active_post_parentID, active_post_childID } = item;
    const { activeMemory } = this.props.memory;
    if (!_.isEmpty(active_post_parentID) && !_.isEmpty(active_post_childID)) {
      if (active_post_parentID === postID) {
        let expObj = {
          parentID: postID,
          childID: childID,
        };
        this.props.setActiveMemory(expObj);
        let obj = {
          parentID: postID,
          childID: childID,
        };
        this.navigateToMemory(obj);
      } else {
        Alert.alert('LEAVE MEMORY', 'You have already join another memory. Can you leave memory ?', [
          { text: 'No', onPress: () => {} },
          {
            text: 'Yes',
            onPress: () => {
              const eventObj = new FormData();
              eventObj.append('token', this.props.auth.access_token);
              // obj.append('_method', 'PUT');
              eventObj.append('parentID', postID);
              eventObj.append('childID', childID);
              let obj = {
                formData: eventObj,
                leaveMemorySuccess: () => {},
                leaveMemoryFailure: () => {},
              };
              this.props.onLeaveMemory(obj);
              this.callJoinMemory(item);
            },
          },
        ]);
      }
    } else if (activeMemory !== undefined && activeMemory === null) {
      this.callJoinMemory(item);
    } else if (activeMemory !== undefined && activeMemory.parentID === postID) {
      let obj = {
        parentID: postID,
        childID: childID,
      };
      this.navigateToMemory(obj);
    } else {
      Alert.alert('LEAVE MEMORY', 'You have already join another memory. Can you leave memory ?', [
        { text: 'No', onPress: () => {} },
        {
          text: 'Yes',
          onPress: () => {
            const eventObj = new FormData();
            eventObj.append('token', this.props.auth.access_token);
            // obj.append('_method', 'PUT');
            eventObj.append('parentID', postID);
            eventObj.append('childID', childID);
            let obj = {
              formData: eventObj,
              leaveMemorySuccess: () => {},
              leaveMemoryFailure: () => {},
            };
            this.props.onLeaveMemory(obj);
            this.callJoinMemory(item);
          },
        },
      ]);
    }
  };

  callJoinMemory = item => {
    const { access_token } = this.props.auth;
    let centerPoint = {
      lat: item.centerPoint.lat ? item.centerPoint.lat : '',
      lng: item.centerPoint.lng ? item.centerPoint.lng : '',
    };
    const joinReqObj = new FormData();
    joinReqObj.append('token', access_token);
    joinReqObj.append('parentID', item.postID);
    joinReqObj.append('myChildID', item.myChildID);
    joinReqObj.append('centerPoint', JSON.stringify(centerPoint));
    let obj = {
      joinObj: joinReqObj,
      onSuccess: data => {
        this.setState({ isLoading: false });
        let expObj = {
          parentID: data.parentID,
          childID: data.childID,
        };
        this.props.setActiveMemory(expObj);
        let obj = {
          parentID: data.parentID,
          childID: data.childID,
        };
        this.navigateToMemory(obj);
      },
      onFail: () => {
        this.setState({ isLoading: false });
        Alert.alert('Warning', "You can't join this memory.");
      },
    };
    this.setState({ isLoading: true });
    this.props.onJoinMemory(obj);
  };

  navigateToMemory = item => {
    this.props.setMemoryLoad(false);
    this.props.setActiveExperience(null);
    this.props.setActiveStation(null);
    this.props.setJoinEventClose(null);
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('JoinMemory', {
      parentID: item.parentID,
      childID: item.childID,
      isExpStack: true,
    });
    this.props.onCloseToggle();
  };

  _renderItem = ({ item, index }) => {
    let date = moment(item.sDate).format('D MMM YYYY, hh:mm A');
    if (item.type !== 'event') {
      if (item.eDate !== false) {
        date = moment(item.eDate).format('D MMM YYYY, hh:mm A');
      } else {
        date = moment(item.sDate).format('D MMM YYYY, hh:mm A');
      }
    }
    return (
      <View style={{ height: hp('23.22%'), backgroundColor: 'white', width: wp('87.00'), borderRadius: 15 }}>
        <StyledButton
          onPress={() =>
            item.type === 'event'
              ? this.onPressEvent(item)
              : item.type === 'station'
              ? this.onPressStation(item)
              : this.onPressMemory(item)
          }
        >
          <View style={{ flexDirection: 'row' }}>
            <FastImage source={{ uri: item.media }} style={styles.image} />
            <View style={{ position: 'absolute', height: hp('21.72%'), justifyContent: 'flex-end', left: wp('1.5%') }}>
              <View>
                <Image
                  source={
                    item.type === 'memory'
                      ? images.MEMORY_ICON
                      : item.type === 'station'
                      ? images.STATION_ICON
                      : images.EVENT_ICON
                  }
                  resizeMode={'contain'}
                  style={{ width: 30, height: 30 }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                marginHorizontal: wp('1.5%'),
                marginVertical: wp('1.5%'),
              }}
            >
              <View style={{ flex: 0.88 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: item.founder_photo }}
                    style={{ width: wp('8.33%'), height: wp('8.33%'), borderRadius: wp('4.33%') }}
                  />
                  <View style={{ flex: 1, marginLeft: wp('1%') }}>
                    <StyledTitleText numberOfLines={1} style={{ fontSize: wp('3.1%') }}>
                      {item.userName}
                    </StyledTitleText>
                    <StyledTitleText
                      numberOfLines={1}
                      style={{
                        fontSize: wp('3.2%'),
                        fontWeight: '400',
                        color:
                          item.type === 'station'
                            ? theme.blue.text
                            : item.type === 'memory'
                            ? theme.cyan.text
                            : theme.orange.text,
                      }}
                    >
                      {item.category} {item.type}
                    </StyledTitleText>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-start', marginTop: hp('2 %'), flex: 1 }}>
                  <StyledText color={'#000000'} fontSize={wp('3.4%')} fontWeight={500}>
                    {item.title}
                  </StyledText>
                  <StyledDescriptionText style={{ textAlign: 'left', flex: 1 }}>
                    {item.description}
                  </StyledDescriptionText>
                </View>
              </View>

              <View style={{ flex: 0.12 }}>
                <StyledTitleText
                  style={{ fontSize: wp('3.2%'), color: '#929292', fontWeight: '500' }}
                  numberOfLines={1}
                >
                  {date}
                </StyledTitleText>
              </View>
            </View>
          </View>
        </StyledButton>
      </View>
    );
  };

  onCreateEvent = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('CreateEvent');
    this.props.onToggle();
  };

  onCreateStation = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
    this.props.navigation.navigate('CreateStation');
    this.props.onToggle();
  };

  onPlanMemory = () => {
    this.props.navigation.navigate('PlanMemory');
    this.props.onToggle();
  };

  onStartMemory = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      distanceFilter: 0,
      maximumAge: 0,
    })
      .then(location => {
        this.setState({ isLoading: true });
        const obj = new FormData();
        obj.append('token', this.props.auth.access_token);
        let centerPoint = {
          lat: location.latitude ? location.latitude : '',
          lng: location.longitude ? location.longitude : '',
        };
        let meta = {
          radius: 1,
          center: {
            lat: location.latitude ? location.latitude : '',
            lng: location.longitude ? location.longitude : '',
          },
        };

        const latlng = new LatLng(centerPoint.lat, centerPoint.lng);
        let numSides = 15;
        let coordinate = [];
        var points = [],
          degreeStep = 360 / numSides;

        for (var ii = 0; ii < numSides; ii++) {
          var gpos = computeOffset(latlng, 1, degreeStep * ii);
          points.push([gpos.lng(), gpos.lat()]);
        }
        points.push(points[0]);
        coordinate.push(points);

        let fenceJson = {
          type: 'Polygon',
          coordinates: coordinate,
        };

        var points = [];
        let buffer_coords = [];
        for (var i = 0; i < numSides; i++) {
          var gpos = computeOffset(latlng, 244, degreeStep * i);
          // 800 feet to 121.92 * 2 meter
          points.push([gpos.lng(), gpos.lat()]);
        }
        points.push(points[0]);
        buffer_coords.push(points);

        let fenceBuffer = {
          type: 'Polygon',
          coordinates: buffer_coords,
        };

        obj.append('centerPoint', JSON.stringify(centerPoint));
        obj.append('fenceBuffer', JSON.stringify(fenceBuffer));
        obj.append('fenceJson', JSON.stringify(fenceJson));
        obj.append('metadata', JSON.stringify(meta));
        obj.append('fenceType', 'circle');
        try {
          let formObj = {
            formData: obj,
            startMemorySuccess: this.startMemorySuccess,
            startMemoryFailure: this.startMemoryFailure,
            location: location,
          };
          this.props.onQuickStartMemory(formObj);
        } catch (error) {
          Alert.alert('Warning', 'Memory creation failed.', [{ text: 'OK' }], {
            cancelable: false,
          });
        }
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        Alert.alert(
          'Warning',
          'We are unable to get the current location, Please turn on the Location from Settings > Location.',
          [{ text: 'OK' }],
          {
            cancelable: false,
          }
        );
      });
  };

  _redirectLiveMemory = data => {
    let expObj = {
      parentID: data.parentID,
      childID: data.child_ID,
    };
    this.props.setActiveMemory(expObj);
    this.props.setStartQuickMemory(false);
    this.props.setMemoryLoad(false);

    this.setState({
      loading: false,
    });
    data.parentID &&
      this.props.navigation.navigate('JoinMemory', {
        parentID: data.parentID,
        childID: data.child_ID,
      });
  };

  startMemorySuccess = response => {
    this._redirectLiveMemory(response);
  };

  startMemoryFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Start Memory creation failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  render() {
    const { data } = this.props.experience;
    const { amazings } = this.props.explore;
    const { isLoading, activeIndex } = this.state;

    return (
      <>
        <View style={amazings.length > 0 ? styles.activeExperienceStyle : styles.inactiveExperienceStyle}>
          {amazings.length > 0 ? (
            <View style={styles.experienceContainerStyle}>
              {/* <StyledText color={'#454545'} fontFamily={font.MSemiBold} fontSize={hp('2%')} fontWeight={'600'}> */}
              <View style={{ alignItems: 'center', height: hp('6.5%'), flexDirection: 'row' }}>
                <Text style={{ fontFamily: font.MSemiBold, fontSize: hp('2%'), flex: 1 }}>
                  {'Joinable  Experiences'}
                </Text>
                <View
                  style={{
                    backgroundColor: 'black',
                    borderRadius: wp('4'),
                    paddingHorizontal: wp('3%'),
                    paddingVertical: wp('1%'),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.MBold,
                      fontSize: wp('3.5%'),
                      letterSpacing: 1,
                      color: 'white',
                    }}
                  >
                    {activeIndex + 1}
                    {'/'}
                    {amazings.length}
                  </Text>
                </View>
              </View>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={amazings}
                renderItem={this._renderItem}
                sliderWidth={wp('100%')}
                itemWidth={wp('100%')}
                activeSlideAlignment={'start'}
                firstItem={0}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                onSnapToItem={index => this.setState({ activeIndex: index })}
              />
            </View>
          ) : null}
        </View>
        {amazings.length > 0 && (
          <View
            style={{
              backgroundColor: colors.LightGreyTwo,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: wp('2%'),
            }}
          >
            {amazings.map((item, index) => {
              if (index === activeIndex) {
                return <View style={styles.activeDot} key={index.toString()} />;
              }
              return <View style={styles.inactiveDot} key={index.toString()} />;
            })}
          </View>
        )}
        <StyledModalBoxBody
          style={{ height: hp('50%'), paddingTop: hp('0%') }}
          isExistingJoinable={amazings.length > 0 ? true : false}
        >
          <StyledHorizontalContainer
            style={{ marginBottom: wp('4%'), marginTop: amazings.length > 0 ? wp('2%') : wp('4%') }}
          >
            <StyledText color={'#454545'} fontFamily={font.MSemiBold} fontSize={hp('2%')} fontWeight={'600'}>
              {'Add  Experience'}
            </StyledText>
          </StyledHorizontalContainer>
          <StyledHorizontalContainer justifyContent={'space-between'}>
            <EventCard
              title={'Add Event'}
              description={'the ultimate event\nexperience'}
              icon={images.JELLY_EVENT}
              onPress={() => this.onCreateEvent()}
            />
            <EventCard
              title={'Add Station'}
              description={'find a cool spot and\nshare it with the world'}
              icon={images.JELLY_STATION}
              onPress={this.onCreateStation}
            />
          </StyledHorizontalContainer>
          <MemoryCard onPlanMemory={this.onPlanMemory} onStartMemory={this.onStartMemory} />
          {isLoading && (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 100 }}>
              <ActivityIndicator size={'large'} color="black" />
            </View>
          )}
        </StyledModalBoxBody>
      </>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: wp('43.695%'),
    height: hp('23.22%'),
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  popover: {
    width: wp('100%'),
  },
  inactiveExperienceStyle: {
    width: wp('95.83%'),
    height: hp('29.72%'),
    backgroundColor: 'rgba(0,0,0,0)',
  },
  activeExperienceStyle: {
    width: wp('95.83%'),
    height: hp('29.72%'),
    backgroundColor: colors.LightGreyTwo,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  experienceContainerStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: wp('4.44%'),
    paddingRight: wp('4.44%'),
  },
  activeDot: {
    backgroundColor: colors.aquaColor,
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
  },
  inactiveDot: {
    backgroundColor: 'white',
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    explore: state.explore,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetAmazings: obj => {
      dispatch(ExploreAction.getAmazingsRequest(obj));
    },
    setJoinEventData: obj => {
      dispatch(ExperienceActions.setJoinEventData(obj));
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
    onJoinStation: obj => {
      dispatch(StationActions.joinStation(obj));
    },
    onLeaveStation: obj => {
      dispatch(StationActions.leaveStation(obj));
    },
    setActiveStation: obj => {
      dispatch(StationActions.setActiveStation(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    setActiveMemory: obj => {
      dispatch(MemoryActions.setActiveMemory(obj));
    },
    onLeaveMemory: obj => {
      dispatch(MemoryActions.leaveMemory(obj));
    },
    onJoinMemory: obj => {
      dispatch(MemoryActions.joinMemory(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    onQuickStartMemory: obj => {
      dispatch(MemoryActions.startMemory(obj));
    },
    setGeofence: (obj, original) => {
      dispatch(ExperienceActions.setGeofence(obj));
    },
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },
    setStartQuickMemory: obj => {
      dispatch(MemoryActions.setStartQuickMemory(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Experience);
