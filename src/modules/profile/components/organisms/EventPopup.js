import React, { Component, useEffect, useState, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Linking,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import ProgressiveImage from 'react-native-image-progress';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import styled from 'styled-components/native';
const moment = require('moment');
import Video from 'react-native-video';

// Import Explore and Experience actions
import { connect } from 'react-redux';
import ExperienceActions from '../../../experience/reducers/event/index';
import StationActions from '../../../experience/reducers/station';
import MemoryActions from '../../../experience/reducers/memory';

// Load theme
import theme from '../../../core/theme';
const { font, dimensions, sizes, images } = theme;

// Load common components from common styles
import { StyledWrapper, StyledButton, StyledHorizontalContainer, StyledView } from '../../../core/common.styles';

// Load utils
import Loading from '../../../../utils/loading';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { getUrlForDirection } from '../../../../utils/funcs';
import { EXPLORE } from '../../../../utils/vals';
import { isJoinedStation, isJoinedEvent, isJoinedMemory } from '../../../../utils/funcs';
const { EVENT_DATA } = EXPLORE;

// const StyledContainer = styled(Animated.View)`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   border-top-left-radius: ${wp('4.2%')};
//   border-top-right-radius: ${wp('4.2%')};
//   padding-top: ${hp('2%')};
//   padding-bottom: ${hp('1%')};
//   padding-left: ${wp('4.44%')};
//   padding-right: ${wp('4.44%')};
//   background-color: #ffffff;
//   align-items: center;
// `;

// const StyledDirectionButton = styled.TouchableOpacity`
//   width: ${wp('10%')};
//   height: ${wp('10%')};
//   border-radius: ${wp('5%')};
//   border-width: 1;
//   border-color: #1373e7;
//   background-color: #ffffff;
//   justify-content: center;
//   align-items: center;
// `;

// const DirectionButton = props => (
//   <StyledDirectionButton {...props}>
//     <CustomIcon name="right-turn" size={20} color="#1373E7" />
//   </StyledDirectionButton>
// );

const StyledTitleText = styled.Text`
  color: #212121;
  font-family: ${font.MSemiBold};
  font-size: ${hp('2.5%')};
`;

const StyledDetailText = styled.Text`
  color: #4b4b4b;
  font-family: ${font.MMedium};
  font-size: ${hp('1.875%')};
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledHandlerButton = styled.TouchableOpacity`
  width: ${wp('6.38%')};
  height: ${wp('0.83%')};
  border-radius: 2;
  background-color: #e3e3e2;
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('1.11%')};
`;

const StyledLikesIconText = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #515151;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.smallPadding};
`;
const ModalSoundButton = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      position: 'absolute',
      left: 8,
      top: 8,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 12,
      borderRadius: 20,
    }}
  >
    <View>
      <CustomIcon name={props.muted ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'} size={16} color={'#FFF'} />
    </View>
  </TouchableOpacity>
);
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

const StyledDirectionButton = styled.TouchableOpacity`
  width: ${wp('46.67%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  border-width: 1;
  border-color: #212121;
`;

const StyledDirectionText = styled.Text`
  font-size: ${hp('1.7%')};
  color: ${props => props.color || '#fff'};
  font-family: ${font.MMedium};
  font-weight: 500;
  margin-left: 10;
`;

const DirectionButton = props => {
  return (
    <StyledDirectionButton {...props}>
      <StyledWrapper row width={'100%'} height={'100%'} primary={'center'} secondary={'center'}>
        <CustomIcon name="Get-Directions_20x20" size={18} color="#000" />
        <StyledDirectionText color={'#000'}>{'Directions'}</StyledDirectionText>
      </StyledWrapper>
    </StyledDirectionButton>
  );
};

const EventPopup = props => {
  const {
    slideUpValue,
    eventData,
    auth,
    experience,
    onGetEventMedia,
    currentLocation,
    navigation,
    onPressLine,
    station,
    memory,
  } = props;
  const [sindex, setIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [isBuffer, setBuffer] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const typeString = eventData.type === 'event' ? 'Event' : eventData.type === 'memory' ? 'Memory' : 'Station';
  const markerIcon =
    eventData.type === 'memory'
      ? theme.images.MARKER_MEMORY
      : eventData.type === 'station'
      ? theme.images.MARKER_STATION
      : theme.images.MARKER_EVENT;
  useEffect(() => {
    const trendingObj = new FormData();
    trendingObj.append('parentID', eventData.postID);
    trendingObj.append('token', auth.access_token);
    onGetEventMedia(trendingObj);
  }, [auth.access_token, eventData.postID, onGetEventMedia]);

  const _renderCarouselItem = ({ item, index }) => {
    return (
      <View>
        <StyledButton
          onPress={async () => {
            setPaused(true);
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            let sDate = moment(eventData.sDate).format('YYYY-MM-DD HH:mm:ss');
            let eDate = moment(eventData.eDate).format('YYYY-MM-DD HH:mm:ss');
            if (eventData.type === 'station') {
              props.setStationLoad(false);
              let isJoin = await isJoinedStation(navigation, station, eventData.postID, eventData.childID);
              if (!isJoin) {
                if (eventData.is_deleted === 1) {
                  navigation.navigate('PostStation', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                } else {
                  navigation.navigate('LiveStation', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                }
              }
            } else if (eventData.type === 'memory') {
              props.setMemoryLoad(false);
              let isJoin = await isJoinedMemory(navigation, memory, eventData.postID, eventData.childID);
              if (!isJoin) {
                if (eventData.is_deleted === 1) {
                  navigation.navigate('PostMemory', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                } else {
                  navigation.navigate('LiveMemory', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                }
              }
            } else {
              const { privateJoinedEvents } = experience;
              let index = -1;
              if (privateJoinedEvents && privateJoinedEvents.length > 0) {
                index = privateJoinedEvents.findIndex(sitem => sitem.parentID === eventData.postID);
              }
              if (eventData.is_verify_pin && eventData.userID !== auth.uid && index === -1) {
                let obj = {
                  parentID: eventData.postID,
                  childID: eventData.childID,
                  title: eventData.title,
                  name: eventData.name,
                  type: eventData.type,
                  description: eventData.description,
                  sDate: eventData.sDate,
                  photo: eventData.iUrl,
                  userImage: eventData.uUrl,
                  eDate: eventData.eDate,
                  is_deleted: eventData.is_deleted,
                  navigationType: 'profile',
                  is_secret: eventData.is_secret,
                };
                navigation.navigate('VerifyPin', {
                  data: obj,
                });
              }
              else {
              props.setEventLoad(false);
              let isJoin = await isJoinedEvent(navigation, experience, eventData.postID, eventData.childID);
              if (!isJoin) {
                if (now > eDate) {
                  // Post Event
                  navigation.navigate('PostEvent', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                } else if (now > sDate && now < eDate) {
                  // Live Event
                  navigation.navigate('LiveEvent', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                } else {
                  // View EVent
                  navigation.navigate('ViewEvent', {
                    parentID: eventData.postID,
                    childID: eventData.childID,
                  });
                }
              }

            }


            }
          }}
        >
          {item.video_url ? (
            <View style={styles.progressiveImage}>
              <Video
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
                paused={paused ? true : sindex === index ? false : true}
                resizeMode={'cover'}
                repeat={true}
                onLoadStart={val => {
                  //this.setState({ isBuffer: true });
                  setBuffer(true);
                }}
                onLoad={val => {
                  //this.setState({ isBuffer: false });
                  setBuffer(false);
                }}
                onEnd={() => null}
                allowsExternalPlayback={true}
              />
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center' }}>
                {isBuffer ? <ActivityIndicator size={'large'} /> : <View />}
              </View>
            </View>
          ) : (
            <FastImage
              source={{ uri: item.url }}
              style={styles.progressiveImage}
              // imageStyle={styles.progressiveImageStyle}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </StyledButton>
        {item.video_url && <ModalSoundButton onPress={() => setMuted(!muted)} muted={muted} />}
      </View>
    );
  };
  //[eventData.childID, eventData.eDate, eventData.postID, eventData.sDate, navigation]

  const onGetDirection = useCallback(() => {
    const eventCoordinate = {
      latitude: eventData.lat,
      longitude: eventData.lng,
    };
    const url = getUrlForDirection(currentLocation, eventCoordinate);
    Linking.openURL(url);
  }, [currentLocation, eventData.lat, eventData.lng]);

  const onSnapToItem = useCallback(
    slideIndex => {
      setIndex(slideIndex);
      setPaused(false);
      const focusedMedia = experience.viewMedia.trending_media[slideIndex];
      setTitle(focusedMedia.title);
      setLikes(focusedMedia.likes);
      setComments(focusedMedia.comments);
    },
    [experience.viewMedia.trending_media]
  );

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              translateY: slideUpValue.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              }),
            },
          ],
        },
        styles.container,
      ]}
    >
      <StyledWrapper height={wp('51.4%')}>
        <>
          <Carousel
            data={experience.viewMedia.trending_media || []}
            renderItem={_renderCarouselItem}
            sliderWidth={dimensions.width}
            itemWidth={wp('100%')}
            activeSlideAlignment={'center'}
            firstItem={sindex}
            inactiveSlideScale={0.8}
            removeClippedSubviews={false}
            inactiveSlideOpacity={0.8}
            onSnapToItem={onSnapToItem}
          />
          <EventType eventType={typeString} />
        </>
      </StyledWrapper>

      <HandlerButton onPress={onPressLine} />
      <CloseButton onPress={onPressLine} />

      <StyledWrapper width={wp('100%')} paddingTop={8} paddingLeft={8} paddingRight={8}>
        <StyledTitleText>
          {(experience.viewMedia.trending_media &&
            experience.viewMedia.trending_media.length > 0 &&
            experience.viewMedia.trending_media[sindex].title) ||
            eventData.title}
        </StyledTitleText>

        {experience.viewMedia.trending_media &&
        experience.viewMedia.trending_media.length > 0 &&
        experience.viewMedia.trending_media[sindex].description ? (
          <StyledWrapper marginTop={8}>
            <StyledDescriptionText>{experience.viewMedia.trending_media[sindex].description}</StyledDescriptionText>
          </StyledWrapper>
        ) : null}

        <StyledWrapper row marginTop={8} justifyContent={'flex-start'}>
          <LikesIconDetail
            iconName={'love-big_16x16'}
            count={
              (experience.viewMedia.trending_media &&
                experience.viewMedia.trending_media.length > 0 &&
                experience.viewMedia.trending_media[sindex].likes) ||
              0
            }
            disabled
          />
          <LikesIconDetail
            disabled
            iconName={'comments-big_16x16'}
            count={
              (experience.viewMedia.trending_media &&
                experience.viewMedia.trending_media.length > 0 &&
                experience.viewMedia.trending_media[sindex].comments) ||
              0
            }
            marginLeft={16}
          />
        </StyledWrapper>

        <StyledWrapper width={wp('100%')} primary={'center'} row marginTop={wp('3.61%')} marginBottom={25}>
          <DirectionButton onPress={onGetDirection} />
        </StyledWrapper>
      </StyledWrapper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: wp('4.2%'),
    borderTopRightRadius: wp('4.2%'),
    backgroundColor: '#ffffff',
  },
  progressiveImage: {
    width: '100%',
    height: wp('51.4%'),
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressiveImageStyle: {
    borderRadius: wp('4.44%'),
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
    onGetEventMedia: obj => {
      dispatch(ExperienceActions.fetchTrendingMedia(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventPopup);
