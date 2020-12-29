import React, { Component } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, View, Alert } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { CachedImage } from 'react-native-img-cache';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import _ from 'lodash';

// Import Explore and Experience actions
import { connect } from 'react-redux';
import ExploreAction from '../../home/reducers/index';
import MemoryActions from '../../experience/reducers/memory';
import StationActions from '../../experience/reducers/station';
import ExperienceActions from '../../experience/reducers/event';
// Load theme
import theme from '../../core/theme';
const { font, dimensions, images, gradients } = theme;

// Load common components from common styles
import {
  StyledSeparator,
  StyledHorizontalContainer,
  StyledButton,
  StyledButtonOverlay,
} from '../../core/common.styles';

// Load Constant Values
import { EXPLORE } from '../../../utils/vals';
import CustomIcon from '../../../utils/icon/CustomIcon';
const { TIME_OPTIONS, EVENT_CATEGORIES, STATION_CATEGORIES } = EXPLORE;

const StyledCloseButton = styled.TouchableOpacity`
  width: 36;
  height: 36;
  border-radius: 18;
  border-width: 1;
  border-color: #878787;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 12;
  margin-top: 12;
`;

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <MaterialIcon name="close" size={20} color="#878787" />
  </StyledCloseButton>
);

const StyledScrollBody = styled.ScrollView`
  flex: 1;
  width: 100%;
  margin-top: 16;
`;

const StyledExperienceButton = styled.TouchableOpacity`
  width: ${(dimensions.width - 56) / 3};
  height: 90;
  background-color: #ffffff;
  border-radius: 8;
  border-width: ${props => (props.isSelected ? 0 : 1)};
  border-color: #9b9b9b;
  display: flex;
  align-items: center;
  justify-content: center;
  /* opacity: ${props => (!props.isSelected ? 1 : 0.3)}; */
`;

const StyledExperienceButtonText = styled.Text`
  color: ${props => (props.isSelected ? '#ffffff' : '#212121')};
  font-family: ${props => (props.isSelected ? font.MBold : font.MMedium)};
  font-size: 12;
  margin-top: 8;
`;

const StyledExperienceButtonImage = styled.Image`
  width: 40;
  height: 40;
  resize-mode: contain;
`;

const ExperienceButton = props => {
  const { type, isSelected } = props;
  return (
    <StyledExperienceButton {...props}>
      {isSelected ? (
        <StyledButtonOverlay
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          borderRadius={8}
          colors={gradients.BackgroundGreen}
        />
      ) : null}
      <StyledExperienceButtonImage
        source={
          type === 'event'
            ? !isSelected
              ? images.EVENT_ICON
              : images.EVENT_WHITE_ICON
            : type === 'memory'
            ? !isSelected
              ? images.MEMORY_ICON
              : images.MEMORY_WHITE_ICON
            : type === 'station'
            ? !isSelected
              ? images.STATION_ICON
              : images.STATION_WHITE_ICON
            : null
        }
      />
      <StyledExperienceButtonText isSelected={isSelected}>
        {type === 'event' ? 'Events' : type === 'memory' ? 'Memories' : type === 'station' ? 'Stations' : ''}
      </StyledExperienceButtonText>
    </StyledExperienceButton>
  );
};

const StyledTimeTagButton = styled.TouchableOpacity`
  flex: 1;
  height: 36;
  border-radius: 18;
  border-width: 1;
  border-color: #e6e6e6;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: ${props => (!props.isFirst ? 8 : 0)};
  border-color: ${props => (props.isMatched ? '#3AB1BE' : '#e6e6e6')};
`;

const StyledTimeTagText = styled.Text`
  font-family: ${font.MMedium};
  font-size: 13;
  color: ${props => (props.isMatched ? '#212121' : '#878787')};
  margin-left: ${props => (props.isAnotherMatched ? 4 : 0)};
`;

const TimeTag = props => {
  const { time, timeOptions } = props;
  const isMatched = timeOptions.includes(time);
  const isAnotherMatched = TIME_OPTIONS[1].includes(time);

  return (
    <StyledTimeTagButton {...props} isMatched={isMatched}>
      {isAnotherMatched && (
        <MaterialIcon
          name={
            _.isEqual(time, TIME_OPTIONS[0])
              ? 'history'
              : _.isEqual(time, TIME_OPTIONS[1])
              ? 'schedule'
              : _.isEqual(time, TIME_OPTIONS[2])
              ? 'update'
              : null
          }
          color={timeOptions.includes(time) ? '#3AB1BE' : '#878787'}
          size={15}
        />
      )}
      <StyledTimeTagText isMatched={isMatched} isAnotherMatched={isAnotherMatched}>
        {time}
      </StyledTimeTagText>
    </StyledTimeTagButton>
  );
};

const StyledCategoryTagButton = styled.TouchableOpacity`
  flex: 1;
  height: 40;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1;
  border-radius: 8;
  padding-left: 8;
  padding-right: 8;
  margin-right: ${props => (props.isLeft ? 4 : 0)};
  margin-left: ${props => (!props.isLeft ? 4 : 0)};
  border-color: ${props => (props.isMatched ? '#3AB1BE' : '#d4d4d4')};
`;

const StyledCategoryTagText = styled.Text`
  font-family: ${font.MMedium};
  font-size: 13;
  color: ${props => (props.isMatched ? '#212121' : '#878787')};
`;

const StyledCheckWrapper = styled.View`
  width: 20;
  height: 20;
  border-radius: 10;
  justify-content: center;
  align-items: center;
`;

const CategoryTag = props => {
  const { categories, category } = props;
  const isMatched = categories.includes(category);

  return (
    <StyledCategoryTagButton {...props} isMatched={isMatched}>
      <StyledCategoryTagText isMatched={isMatched}>{category}</StyledCategoryTagText>
      {isMatched ? (
        <StyledCheckWrapper>
          <StyledButtonOverlay
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            borderRadius={10}
            colors={gradients.BackgroundGreen}
          />
          <CustomIcon name="Category_Active_20x20px" size={10} color="#ffffff" />
        </StyledCheckWrapper>
      ) : null}
    </StyledCategoryTagButton>
  );
};

const StyledIconImage = styled.Image`
  width: 20;
  height: 20;
  resize-mode: contain;
`;

const StyledSectionHeader = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 16;
  padding-right: 16;
  height: 48;
  margin-top: ${props => props.marginTop || 0};
`;

const StyledSectionHeaderText = styled.Text`
  font-family: ${font.MSemiBold};
  font-size: 16;
  line-height: 20;
  color: #212121;
  margin-top: ${props => props.marginTop || 0};
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledView = styled.View`
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const StyledCarouselContainer = styled.View`
  width: 100%;
  padding-left: 16;
  margin-bottom: 40;
`;

const StyledCarouseItemlWrapper = styled.TouchableOpacity`
  width: 100%;
  margin-right: 16;
`;

const StyledCarouselItemText = styled.Text`
  width: 100;
  height: 28;
  margin-top: 8;
  font-family: ${font.MRegular};
  font-size: 12;
  color: #363636;
`;

const StyledRestText = styled.Text`
  font-family: ${font.MMedium};
  font-size: 13;
  color: #3ab1be;
  margin-right: ${props => props.marginRight || 0};
`;

const ResetButton = props => (
  <StyledButton {...props}>
    <StyledHorizontalContainer>
      <StyledRestText marginRight={8}>{'Reset'}</StyledRestText>
      <CustomIcon name="Reset_16x16px" size={12} color="#3ab1be" />
    </StyledHorizontalContainer>
  </StyledButton>
);

const StyledListButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ListButton = props => (
  <StyledListButton {...props}>
    <StyledRestText>{'See List'}</StyledRestText>
    <MaterialIcon name="chevron-right" size={24} color="#3aB1Be" />
  </StyledListButton>
);

class FilterPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  componentDidMount() {
    const {
      currentLocation,
      auth: { access_token },
    } = this.props;

    // Get amazings baced on the position
    const amazingReqObj = {
      token: access_token,
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    };
    this.props.onGetAmazings(amazingReqObj);
  }

  /* Join Event */
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
    const { privateJoinedEvents } = this.props.experience;
    let index = -1;
    if (privateJoinedEvents && privateJoinedEvents.length > 0) {
      index = privateJoinedEvents.findIndex(item => item.parentID === postID);
    }
    if (isPrivate && founder_uid !== this.props.auth.uid && rsvpList.length === 0 && index === -1) {
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
      this.props.navigation.navigate('VerifyPin', {
        data: obj,
      });
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
  };

  navigateToEvent = item => {
    this.props.setEventLoad(false);
    this.props.setActiveStation(null);
    this.props.setActiveMemory(null);
    this.props.navigation.navigate('JoinEvent', {
      parentID: item.parentID,
      childID: item.childID,
    });
    this.props.onClose();
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
    Alert.alert('Warning', "You can't join this event.");
  };
  /* Join Event */

  /** Join Station */
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
          Alert.alert(
            'Join Station',
            'Selected Station already Ended up, you can\'t join the ended station. Click "Okay" to navigate on Post Station',
            [
              {
                text: 'Okay',
                onPress: () => {
                  this.navigateToPostStation(item);
                },
              },
            ]
          );
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
    this.props.navigation.navigate('JoinStation', {
      parentID: item.parentID,
      childID: item.childID,
    });
    this.props.onClose();
  };
  navigateToPostStation = item => {
    this.props.setStationLoad(false);
    this.props.setActiveExperience(null);
    this.props.setActiveMemory(null);
    this.props.navigation.navigate('PostStation', {
      parentID: item.postID,
      childID: item.childID,
    });
    this.props.onClose();
  };
  /** Join Station */

  /** Join Memory */
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
    this.props.navigation.navigate('JoinMemory', {
      parentID: item.parentID,
      childID: item.childID,
    });
    this.props.onClose();
  };
  /** Join Memory */
  /**
   * Render Carousel
   *
   */
  renderCarouselSlide = ({ item, index }) => {
    return (
      <StyledCarouseItemlWrapper
        onPress={() => {
          item.type === 'event'
            ? this.onPressEvent(item)
            : item.type === 'station'
            ? this.onPressStation(item)
            : this.onPressMemory(item);
        }}
      >
        <CachedImage
          component={Image}
          indicator={ActivityIndicator}
          style={styles.cachedImageStyle}
          source={{ uri: item.media }}
        />
        <StyledCarouselItemText>{item.title}</StyledCarouselItemText>
      </StyledCarouseItemlWrapper>
    );
  };

  render() {
    const {
      explore: { amazings },
      onEventCategoryChange,
      onStationCategoryChange,
      eventCategories,
      stationCategories,
      timeOptions,
      onTimeOptionChange,
      isEventSelected,
      isMemorySelected,
      isStationSelected,
      toggleMemorySelected,
      toggleEventSelected,
      toggleStationSelected,
      onResetPress,
    } = this.props;
    const { isLoading } = this.state;
    return (
      <Animated.View style={[this.props.style, styles.container]}>
        <CloseButton onPress={this.props.onClose} />

        <StyledScrollBody showsVerticalScrollIndicator={false}>
          <StyledView>
            <StyledSectionHeader>
              <StyledSectionHeaderText>{'Show Experiences'}</StyledSectionHeaderText>
              <ResetButton onPress={onResetPress} />
            </StyledSectionHeader>

            <StyledHorizontalContainer
              alignItems={'center'}
              justifyContent={'space-between'}
              marginLeft={16}
              marginRight={16}
            >
              <ExperienceButton type="event" isSelected={isEventSelected} onPress={toggleEventSelected} />
              <ExperienceButton type="station" isSelected={isStationSelected} onPress={toggleStationSelected} />
              <ExperienceButton type="memory" isSelected={isMemorySelected} onPress={toggleMemorySelected} />
            </StyledHorizontalContainer>

            <StyledHorizontalContainer
              alignItems={'center'}
              justifyContent={'space-around'}
              marginTop={24}
              marginLeft={16}
              marginRight={16}
            >
              <TimeTag
                timeOptions={timeOptions}
                time={TIME_OPTIONS[0]}
                onPress={() => onTimeOptionChange(TIME_OPTIONS[0])}
                isFirst
              />
              <TimeTag
                timeOptions={timeOptions}
                time={TIME_OPTIONS[1]}
                onPress={() => onTimeOptionChange(TIME_OPTIONS[1])}
              />
              {/* {!isMemorySelected && (
                <TimeTag
                  timeOptions={timeOptions}
                  time={TIME_OPTIONS[2]}
                  onPress={() => onTimeOptionChange(TIME_OPTIONS[2])}
                />
              )} */}
            </StyledHorizontalContainer>

            <StyledHorizontalContainer
              alignItems={'center'}
              justifyContent={'space-around'}
              marginTop={8}
              marginLeft={16}
              marginRight={16}
            >
              <TimeTag
                timeOptions={timeOptions}
                time={TIME_OPTIONS[2]}
                onPress={() => onTimeOptionChange(TIME_OPTIONS[2])}
                isFirst
              />
              <TimeTag
                timeOptions={timeOptions}
                time={TIME_OPTIONS[3]}
                onPress={() => onTimeOptionChange(TIME_OPTIONS[3])}
              />
              {/* {!isMemorySelected && (
                <TimeTag
                  timeOptions={timeOptions}
                  time={TIME_OPTIONS[5]}
                  onPress={() => onTimeOptionChange(TIME_OPTIONS[5])}
                />
              )} */}
            </StyledHorizontalContainer>

            {/**
             * If Event is selected
             *
             */}
            {isEventSelected && (
              <StyledSectionHeader marginTop={20}>
                <StyledHorizontalContainer alignItems={'center'}>
                  <StyledIconImage source={images.EVENT_ICON} />
                  <StyledSectionHeaderText marginLeft={8}>{'Categories'}</StyledSectionHeaderText>
                </StyledHorizontalContainer>
              </StyledSectionHeader>
            )}
            {isEventSelected && (
              <StyledView marginLeft={16} marginRight={16}>
                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[0]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[0])}
                    isLeft
                  />
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[1]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[1])}
                  />
                </StyledHorizontalContainer>

                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[2]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[2])}
                    isLeft
                  />
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[3]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[3])}
                  />
                </StyledHorizontalContainer>

                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[4]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[4])}
                    isLeft
                  />
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[5]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[5])}
                  />
                </StyledHorizontalContainer>

                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[6]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[6])}
                    isLeft
                  />
                  <CategoryTag
                    categories={eventCategories}
                    category={EVENT_CATEGORIES[7]}
                    onPress={() => onEventCategoryChange(EVENT_CATEGORIES[7])}
                  />
                </StyledHorizontalContainer>
              </StyledView>
            )}

            {/**
             * If Station is selected
             *
             */}
            {isStationSelected && (
              <StyledSectionHeader marginTop={16}>
                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'}>
                  <StyledIconImage source={images.STATION_ICON} />
                  <StyledSectionHeaderText marginLeft={8}>{'Categories'}</StyledSectionHeaderText>
                </StyledHorizontalContainer>
              </StyledSectionHeader>
            )}
            {isStationSelected && (
              <StyledView marginLeft={16} marginRight={16}>
                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[0]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[0])}
                    isLeft
                  />
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[1]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[1])}
                  />
                </StyledHorizontalContainer>
                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[2]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[2])}
                    isLeft
                  />
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[3]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[3])}
                  />
                </StyledHorizontalContainer>
                <StyledHorizontalContainer alignItems={'center'} justifyContent={'space-around'} marginBottom={8}>
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[4]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[4])}
                    isLeft
                  />
                  <CategoryTag
                    categories={stationCategories}
                    category={STATION_CATEGORIES[5]}
                    onPress={() => onStationCategoryChange(STATION_CATEGORIES[5])}
                  />
                </StyledHorizontalContainer>
              </StyledView>
            )}

            {/**
             * Separator
             *
             */}
            <StyledSeparator bgColor={'#d4d4d4'} marginTop={40} />

            {/**
             * Amazing things section
             *
             */}
            <StyledSectionHeader marginTop={16}>
              <StyledSectionHeaderText marginLeft={8}>{'Amazing Things Near You'}</StyledSectionHeaderText>
              {/* <ListButton /> */}
            </StyledSectionHeader>

            {/**
             * Render Carousel
             *
             */}
            <StyledCarouselContainer>
              <Carousel
                ref={c => {
                  this.carousel = c;
                }}
                data={amazings}
                renderItem={this.renderCarouselSlide}
                sliderWidth={dimensions.width - 32}
                itemWidth={108}
                removeClippedSubviews={false}
                activeSlideAlignment={'start'}
                firstItem={0}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
              />
            </StyledCarouselContainer>
          </StyledView>
        </StyledScrollBody>
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size={'large'} color="black" />
          </View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: dimensions.height - 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
    display: 'flex',
  },
  cachedImageStyle: {
    width: 100,
    height: 72,
    borderRadius: 12,
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    explore: state.explore,
    experience: state.experience,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetAmazings: obj => {
      dispatch(ExploreAction.getAmazingsRequest(obj));
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPopup);
