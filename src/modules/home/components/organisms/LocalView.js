import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StyledButton, StyledCardView, StyledWrapper, StyledTextArea } from '../../../core/common.styles';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import ProgressiveImage from '../../../experience/components/organisms/ProgressiveImage';
import TimeAgo from 'react-native-timeago';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors, font, sizes, images } = theme;
import { PlayIcon, PauseIcon, StyledButtonOverlay } from '../../../core/common.styles';
import InViewPort from './InviewPort';

const StyleCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledUserAvatarWrapper = styled.View`
  width: ${hp('4.9%')};
  height: ${hp('4.9%')};
  border-radius: ${hp('3.45%')};
  justify-content: center;
  align-items: center;
  padding: 2px 2px 2px 2px;
  border-color: #fe7f7e;
  border-width: ${wp('0.2%')};
`;

const StyleUsername = styled.Text`
  /* padding-top: 2;
  padding-bottom: 2;
  padding-right: 2;
  text-align-vertical: center;
  margin-left: 9;
  color: #212121;
  font-size: ${wp('4.0%')};
  font-weight: 600; */
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

const StyledRow = styled.View`
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
`;

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

const StyledCommentText = styled.Text`
  font-size: ${wp('3.055%')};
  /* line-height: ${wp('4.44%')}; */
  color: #000000;
  font-family: ${font.MSemiBold};
  margin-left: ${wp('1.736%')};
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('7.22%')};
  height: ${wp('7.22%')};
  border-radius: ${wp('3.61%')};
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
const Live = props => {
  return (
    <StyledLiveWrapper>
      <LiveCircle {...props} />
      <StyledLiveText>{'LIVE'}</StyledLiveText>
    </StyledLiveWrapper>
  );
};
const MoreIconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={30} color={'#626262'} />
  </StyledButton>
);

const CommentSecton = props => {
  const { count, iconName, iconSize, marginLeft } = props;
  return (
    <StyledWrapper row marginLeft={marginLeft} secondary={'center'}>
      <CustomIcon name={iconName || 'comments-big_16x16'} size={14} color={'#7B7B7B'} />
      <StyledCommentText>{count}</StyledCommentText>
    </StyledWrapper>
  );
};

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

class LocalView extends Component {
  state = {
    paused: true,
    isBuffer: false,
    isVideoEnd: false,
  };

  render() {
    const { item, index, onEventPress, pausedVideo = false, onPressAvatar, toggleReportModal, onPressLike } = this.props;
    const { url, type, category, name, title, description, like_count, comment_count, userID, is_deleted } = item;
    const { paused, isBuffer, isVideoEnd } = this.state;

    let categoryNameColor = type === 'event' ? '#FF9076' : type === 'memory' ? '#3BB5BE' : '#65A8FB';
    let eventImage =
      type === 'event' ? images.MARKER_EVENT : type === 'memory' ? images.MARKER_MEMORY : images.MARKER_STATION;
    return (
      <StyledCardView width={wp('95.56%')} marginTop={index === 0 ? 8 : undefined}>
        <StyleCardHeader>
          <StyledWrapper
            row
            secondary={'center'}
            paddingLeft={wp('2.22%')}
            paddingRight={wp('2.22%')}
            paddingBottom={wp('1.67%')}
            paddingTop={wp('2.22%')}
          >
            <StyledUserAvatarWrapper style={{ borderColor: categoryNameColor }}>
              <TouchableWithoutFeedback onPress={() => onPressAvatar(userID)}>
                <FastImage
                  style={{ width: hp('4.25%'), height: hp('4.25%'), borderRadius: hp('3.125%') }}
                  source={{ uri: item.uUrl }}
                />
              </TouchableWithoutFeedback>
            </StyledUserAvatarWrapper>
            <StyledWrapper marginLeft={wp('2.22%')}>
              <StyleUsername>{item.name}</StyleUsername>
              {item.metadata.category !== 'N/A' && (
                <StyledCategoryName color={categoryNameColor}>{`${item.metadata.category} ${type}`}</StyledCategoryName>
              )}
            </StyledWrapper>
          </StyledWrapper>

          <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={10} paddingTop={10}>
            {
              //   <CustomIcon
              //   name={'bookmark_border-24px'}
              //   size={30}
              //   color={'#626262'}
              // />
            }
            {this.props.auth.uid !== item.userID ? (
              <MoreIconButton onPress={() => toggleReportModal(item)} />
            ) : (
              <StyledEventTypeImage source={eventImage} />
            )}
          </StyledRow>
        </StyleCardHeader>
        <TouchableWithoutFeedback onPress={() => onEventPress(item)}>
          <View>
            {item.video_url && !pausedVideo ? (
              <>
                <InViewPort
                  onChange={value => {
                    this.setState({ paused: isVideoEnd ? true : !value });
                  }}
                >
                  <Video
                    source={{
                      uri: item.video_url,
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
                    onLoadStart={val => {
                      this.setState({ isBuffer: true });
                    }}
                    onLoad={val => {
                      this.setState({ isBuffer: false });
                    }}
                    onEnd={() => {
                      this.setState({ paused: true, isVideoEnd: true });
                    }}
                    allowsExternalPlayback={true}
                  />
                  {is_deleted === 0 ? <Live eventType={type} /> : null}
                  <View
                    style={{
                      width: wp('100%'),
                      height: wp('113.61%'),
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isBuffer ? <ActivityIndicator size={'large'} /> : <View />}
                  </View>
                </InViewPort>

                {paused ? (
                  Platform.OS === 'android' ? (
                    <View style={styles.buttonContainer}>
                      <ProgressiveImage
                        source={{ uri: item.iUrl }}
                        width={'100%'}
                        height={hp('60%')}
                        backgroundColor={colors.placeholderColor}
                      />
                      {is_deleted === 0 ? <Live eventType={type} /> : null}
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
              </>
            ) : (
              <>
                <ProgressiveImage
                  source={{ uri: item.iUrl }}
                  width={'100%'}
                  height={hp('55%')}
                  backgroundColor={colors.placeholderColor}
                />
                {is_deleted === 0 ? <Live eventType={type} /> : null}
              </>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* <PostFooter data={item} /> */}
        <CardBottom
          title={title}
          description={description}
          time={item.metadata.created_at}
          likes={like_count}
          comments={comment_count}
          onPress={onPressLike}
        />
      </StyledCardView>
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

export default LocalView;
