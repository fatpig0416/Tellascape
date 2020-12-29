import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import Video from 'react-native-video';
import InViewPort from './InviewPort';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../../utils/vals';

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes, images } = theme;

// Import common components
import {
  StyledWrapper,
  PlayIcon,
  PauseIcon,
  StyledSeparator,
  StyledButton,
  StyledButtonOverlay,
} from '../../../core/common.styles';

const cardWidth = Dimensions.get('window').width - wp('2.22%') * 2;

const StyledCardAvatar = styled(FastImage)`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
`;

const StyledUserName = styled.Text`
  font-size: ${wp('3.889%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #212121;
`;

const StyledCategoryName = styled.Text`
  font-size: ${wp('3.333%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: ${props => props.color};
  letter-spacing: 0.3;
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('7.22%')};
  height: ${wp('7.22%')};
  border-radius: ${wp('3.61%')};
`;

const StyledImageWrapper = styled(FastImage)`
  width: 100%;
  height: ${wp('113.61%')};
`;

const StyledEventImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

const StyledImageInfoWrapper = styled.View`
  position: absolute;
  left: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  width: ${cardWidth - wp('4.44%')};
  flex-direction: row;
  justify-content: space-between;
`;

const StyledInfoText = styled.Text`
  font-size: ${wp('3.889%')};
  line-height: ${wp('4.44%')};

  color: #ffffff;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledEventTitle = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.44%')};
  color: #000000;
  font-family: ${font.MSemiBold};
`;

const StyledEventDescription = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('3.889%')};
  color: #565656;
  font-family: ${font.MRegular};
`;

const StyledCardHeader = styled.View`
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: ${wp('2.22%')};
  padding-left: ${wp('2.22%')};
  padding-right: ${wp('2.22%')};
  padding-bottom: ${wp('1.67%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledLiveWrapper = styled.View`
  position: absolute;
  left: ${wp('80%')};
  top: ${wp('1.66%')};
  height: ${wp('5.27%')};
  border-radius: ${wp('2.635')};
  background-color: #fff;
  flex-direction: row;
  padding-left: ${wp('1.66%')};
  padding-right: ${wp('1.66%')};
  align-items: center;
`;

const StyledLiveCircleWrapper = styled.View`
  width: ${wp('2.22%')};
  height: ${wp('2.22%')};
  border-radius: ${wp('1.11%')};
  /* overflow: hidden; */
  margin-right: 3;
  justify-content: center;
  align-items: center;
  background-color: red;
`;

const LiveCircle = props => {
  const { eventType } = props;
  return (
    <StyledLiveCircleWrapper>
      <StyledButtonOverlay
        borderRadius={wp('1.11%')}
        locations={[0, 1]}
        colors={GRADIENT_DATA[eventType].colors}
        useAngle={true}
        angle={GRADIENT_DATA[eventType].angle}
        angleCenter={{ x: 0.5, y: 0.5 }}
      />
    </StyledLiveCircleWrapper>
  );
};

const StyledLiveText = styled.Text`
  font-size: ${wp('3.05%')};
  font-family: ${font.MRegular};
  font-weight: 700;
  color: #454545;
`;

const GRADIENT_DATA = {
  event: {
    angle: 132.44,
    colors: ['#FFB86D', '#FF7B7A'],
  },
  station: {
    angle: 152.26,
    colors: ['#60C4F4', '#67A0FE'],
  },
  memory: {
    angle: 122.8,
    colors: ['#45D8BF', '#3AB1BE'],
  },
};

const CardHeader = props => {
  const { url, eventType, category, name, onPressAvatar, userID } = props;

  const eventImage =
    eventType === 'event' ? images.MARKER_EVENT : eventType === 'memory' ? images.MARKER_MEMORY : images.MARKER_STATION;

  const categoryNameColor = eventType === 'event' ? '#FF9076' : eventType === 'memory' ? '#3BB5BE' : '#65A8FB';
  return (
    <StyledCardHeader>
      <StyledWrapper row secondary={'center'}>
        <TouchableWithoutFeedback onPress={() => onPressAvatar(userID)}>
          <StyledCardAvatar source={{ uri: url }} />
        </TouchableWithoutFeedback>
        <StyledWrapper marginLeft={wp('2.22%')}>
          <StyledUserName>{name}</StyledUserName>
          {category !== 'N/A memory' && <StyledCategoryName color={categoryNameColor}>{category}</StyledCategoryName>}
        </StyledWrapper>
      </StyledWrapper>
      <StyledEventTypeImage source={eventImage} />
    </StyledCardHeader>
  );
};
const Live = props => {
  return (
    <StyledLiveWrapper>
      <LiveCircle {...props} />
      <StyledLiveText>{'LIVE'}</StyledLiveText>
    </StyledLiveWrapper>
  );
};
const CardImage = props => {
  const { url, viewerCount, address } = props;
  return (
    <StyledImageWrapper style={{ backgroundColor: colors.placeholderColor }}>
      <StyledEventImage source={{ uri: url }} />
      {/* <StyledImageInfoWrapper>
        <StyledInfoText>{address}</StyledInfoText>
        <StyledWrapper row secondary={'center'}>
          {/* <CustomIcon name={'Comment-Small_12x12px'} size={16} color={'#fff'} />
          <StyledInfoText marginLeft={wp('3.61%')}>{viewerCount}</StyledInfoText>
        </StyledWrapper>
      </StyledImageInfoWrapper> */}
    </StyledImageWrapper>
  );
};

const StyledCommentText = styled.Text`
  font-size: ${wp('3.055%')};
  /* line-height: ${wp('4.44%')}; */
  color: #000000;
  font-family: ${font.MSemiBold};
  margin-left: ${wp('1.736%')};
`;

const CommentSecton = props => {
  const { count, iconName, iconSize, marginLeft } = props;
  return (
    <StyledWrapper row marginLeft={marginLeft} secondary={'center'}>
      <CustomIcon name={iconName} size={14} color={'#7B7B7B'} />
      <StyledCommentText>{count}</StyledCommentText>
    </StyledWrapper>
  );
};

const StyledCardBottom = styled.View`
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  padding-top: ${wp('2.22%')};
  padding-left: ${wp('2.22%')};
  padding-right: ${wp('2.22%')};
  padding-bottom: ${wp('1.67%')};
  /* flex-direction: row;
  justify-content: space-between;
  align-items: center; */
`;

const CardBottom = props => {
  const { title, description, likes, comments, onPress } = props;
  return (
    <StyledCardBottom>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <StyledEventTitle>{title}</StyledEventTitle>
        <TimeAgo time={props.time * 1000} style={styles.eventCreatedTime} />
      </StyledWrapper>
      {description ? <StyledEventDescription>{description}</StyledEventDescription> : null}
      <StyledWrapper row marginTop={'0.83%'}>
        <TouchableOpacity onPress={onPress}>
          <CommentSecton count={likes} iconName={'love-big_16x16'} />
        </TouchableOpacity>
        <CommentSecton count={comments} iconName={'comments-big_16x16'} marginLeft={wp('3.68%')} />
      </StyledWrapper>
    </StyledCardBottom>
  );
};

class CardView extends Component {
  state = {
    paused: true,
    isBuffer: false,
    isVideoEnd: false,
  };

  render() {
    const {
      uUrl,
      iUrl,
      name,
      created_at,
      title,
      description,
      like_count,
      comment_count,
      category,
      address,
      type,
      video_url,
      userID,
      is_deleted,
    } = this.props.data;
    const { onPressEvent, experience_type, handlePlaying, pausedVideo = false, onPressAvatar, onPressLike } = this.props;
    const { paused, isBuffer, isVideoEnd } = this.state;
    return (
      <View style={styles.cardView}>
        <CardHeader
          url={uUrl}
          name={name}
          category={`${category} ${type}`}
          eventType={type}
          onPressAvatar={onPressAvatar}
          userID={userID}
        />
        <TouchableOpacity onPress={() => onPressEvent(this.props.data)} activeOpacity={1}>
          {experience_type === 'my_feed' && video_url && !pausedVideo ? (
            <View>
              <InViewPort
                onChange={value => {
                  this.setState({ paused: isVideoEnd ? true : !value });
                }}
              >
                <Video
                  source={{
                    uri: video_url,
                  }}
                  ref={ref => {
                    this.player = ref;
                  }}
                  style={{ width: '100%', height: wp('113.61%') }}
                  rate={1}
                  playWhenInactive={false}
                  paused={paused}
                  muted={false}
                  repeat={false}
                  resizeMode={'cover'}
                  allowsExternalPlayback={true}
                  onLoadStart={val => {
                    this.setState({ isBuffer: true });
                  }}
                  onLoad={val => {
                    this.setState({ isBuffer: false });
                  }}
                  onEnd={() => {
                    this.setState({ paused: true, isVideoEnd: true });
                  }}
                />
                {is_deleted === 0 ? <Live eventType={type} /> : null}
              </InViewPort>
              <View
                style={{
                  width: wp('100%'),
                  height: wp('113.61%'),
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: -10,
                }}
              >
                {isBuffer ? <ActivityIndicator size={'large'} /> : <View />}
                {paused ? (
                  Platform.OS === 'android' ? (
                    <View style={styles.buttonContainer}>
                      <CardImage url={iUrl} viewerCount={'21'} address={address} />
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            paused: !paused,
                          });
                          this.player.seek(0);
                        }}
                        style={styles.playContainer}
                      >
                        <PlayIcon />
                      </TouchableOpacity>
                      {is_deleted === 0 ? <Live eventType={type} /> : null}
                    </View>
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            paused: !paused,
                          });
                          this.player.seek(0);
                        }}
                        style={styles.playContainer}
                      >
                        <PlayIcon />
                      </TouchableOpacity>
                    </View>
                  )
                ) : (
                  <View />
                )}
              </View>
            </View>
          ) : (
            <>
              <CardImage url={iUrl} viewerCount={'21'} address={address} />
              {is_deleted === 0 ? <Live eventType={type} /> : null}
            </>
          )}
        </TouchableOpacity>
        <CardBottom
          title={title}
          description={description}
          time={created_at}
          likes={like_count}
          comments={comment_count}
          onPress={onPressLike}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'rgb(90,97,105)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 1,
    marginLeft: wp('2.22%'),
    marginBottom: wp('2.22%'),
  },
  eventCreatedTime: {
    fontSize: wp('3.03%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#b8b8b8',
  },
  buttonContainer: {
    width: wp('95.5%'),
    height: wp('113.61%'),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playContainer: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: wp('10%'),
    borderColor: '#ffffff',
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingLeft: 3,
  },
});

export default CardView;
