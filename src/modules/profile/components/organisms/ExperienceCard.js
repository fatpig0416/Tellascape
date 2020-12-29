import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Image, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import TimeAgo from 'react-native-timeago';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { colors, font, images, gradients, sizes } = theme;
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import _ from 'lodash';
import {
  StyledButton,
  StyledWrapper,
  PlayIcon,
  PauseIcon,
  StyledText,
  StyledSeparator,
  StyledButtonOverlay,
} from '../../../core/common.styles';
import InViewPort from '../../../home/components/organisms/InviewPort';
const StyledCardView = styled.View`
  width: ${wp('95.56%')};
  margin-left: ${wp('2.22%')};
  margin-bottom: ${wp('2.22%')};
  background-color: ${colors.White};
  box-shadow: 0px 12px 20px rgba(90, 97, 105, 0.12);
  border-radius: 15;
`;

const StyledExperienceAvatar = styled(FastImage)`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
`;

const StyledEventTypeWraper = styled.View`
  position: absolute;
  right: ${wp('-1.05%')};
  bottom: 0;
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('4.2%')};
  height: ${wp('4.2%')};
  border-radius: ${wp('2.1%')};
`;

const StyledBoldText = styled.Text`
  font-size: ${props => props.fontSize || wp('3.055%')};
  color: #000000;
  font-family: ${font.MMedium};
  letter-spacing: ${props => props.letterSpacing || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  text-align: center;
`;

const StyledNormalText = styled.Text`
  font-size: ${wp('3.055%')};
  color: #7b7b7b;
  font-family: ${font.MRegular};
  letter-spacing: ${props => props.letterSpacing || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const StyledCardHeader = props => {
  const { name, createdAt, eventType, id, action, userID, uid } = props;

  return (
    <StyledWrapper
      row
      secondary={'center'}
      width={'100%'}
      primary={'space-between'}
      paddingLeft={sizes.smallPadding}
      paddingRight={sizes.smallPadding}
      paddingTop={sizes.smallPadding}
      paddingBottom={sizes.smallPadding}
    >
      <StyledWrapper row>
        <StyledWrapper>
          <StyledExperienceAvatar source={props.avatar} />
          <StyledEventTypeWraper>
            <StyledEventTypeImage
              resizeMode={'cover'}
              source={
                eventType === 'memory'
                  ? images.MARKER_MEMORY
                  : eventType === 'station'
                  ? images.MARKER_STATION
                  : eventType === 'alert'
                  ? images.JELLY_ALERT
                  : images.MARKER_EVENT
              }
            />
          </StyledEventTypeWraper>
        </StyledWrapper>
        <StyledWrapper marginLeft={6}>
          <StyledBoldText>{name}</StyledBoldText>
          <TimeAgo time={createdAt * 1000} style={styles.timeAgo} />
        </StyledWrapper>
      </StyledWrapper>
      <StyledWrapper row>
        <StyledButton onPress={() => action(id)}>
          {uid === userID && <CustomIcon name={'more_horiz-24px'} size={sizes.largeIconSize} color={'#707070'} />}
        </StyledButton>
      </StyledWrapper>
      {/* <StyledWrapper row>
          <StyledButton>
            <CustomIcon name={'bookmark-24px'} size={sizes.largeIconSize} color={'#707070'} />
          </StyledButton>
          <StyledButton marginLeft={sizes.smallPadding}>
            <CustomIcon name={'more_horiz-24px'} size={sizes.largeIconSize} color={'#707070'} />
          </StyledButton>
        </StyledWrapper> */}
    </StyledWrapper>
  );
};

const StyledCardFooter = props => {
  const { description, likeCount, commentCount, eventType } = props;

  return (
    <StyledWrapper
      paddingLeft={sizes.smallPadding}
      paddingRight={sizes.smallPadding}
      paddingTop={sizes.smallPadding}
      paddingBottom={sizes.smallPadding}
    >
      <StyledBoldText>{props.title}</StyledBoldText>
      <StyledNormalText marginTop={2}>{description}</StyledNormalText>
      <StyledWrapper marginTop={2} row>
        {eventType !== 'alert' && (
          <StyledWrapper row secondary={'center'} marginRight={14}>
            <CustomIcon name={'love-big_16x16'} size={sizes.smallIconSize} color={'#707070'} />
            <StyledBoldText marginLeft={sizes.smallPadding}>{likeCount}</StyledBoldText>
          </StyledWrapper>
        )}
        <StyledWrapper row secondary={'center'}>
          <CustomIcon name={'comments-big_16x16'} size={sizes.smallIconSize} color={'#707070'} />
          <StyledBoldText marginLeft={sizes.smallPadding}>{commentCount}</StyledBoldText>
        </StyledWrapper>
      </StyledWrapper>
    </StyledWrapper>
  );
};

class ExperienceCard extends Component {
  state = {
    paused: true,
    isBuffer: false,
    isVideoEnd: false,
  };
  render() {
    const { item, onEventPress, onDeletePress, uid, pausedVideo = false } = this.props;
    const { paused, isBuffer, isVideoEnd } = this.state;

    return (
      <StyledCardView>
        <StyledCardHeader
          avatar={{ uri: item.uUrl }}
          name={item.name}
          userID={item.userID}
          uid={uid}
          createdAt={item.created_at}
          eventType={item.type}
          id={item.postID}
          action={onDeletePress}
        />
        <TouchableOpacity activeOpacity={1} onPress={() => onEventPress(item)}>
          {item.video_url && !_.isEmpty(item.video_url) && !pausedVideo ? (
            <View>
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
                  style={{ width: '100%', height: wp('66.11%') }}
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
                {paused && (
                  <View style={styles.buttonContainer}>
                    {isBuffer && <ActivityIndicator size={'large'} />}
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ paused: !paused });
                        this.player.seek(0);
                      }}
                      style={styles.playContainer}
                    >
                      <PlayIcon />
                    </TouchableOpacity>
                  </View>
                )}
              </InViewPort>
            </View>
          ) : (
            <View style={styles.thumbnailContainer}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size={'small'} />
              </View>
              <Image
                source={item.type === 'alert' ? theme.images.PROFILE_CARD_DEFAULT : { uri: item.iUrl }}
                style={{ width: '100%', height: wp('66.11%') }}
              />
            </View>
          )}
        </TouchableOpacity>
        <StyledCardFooter
          title={item.title || ''}
          eventType={item.type}
          description={item.description}
          likeCount={item.like_count}
          commentCount={item.comment_count}
        />
      </StyledCardView>
    );
  }
}

const styles = StyleSheet.create({
  timeAgo: {
    fontSize: hp('1.7'),
    fontFamily: font.MRegular,
    color: '#7b7b7b',
  },
  loaderContainer: {
    position: 'absolute',
  },
  thumbnailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: wp('66.11%'),
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
    position: 'absolute',
    justifyContent: 'center',
  },
});

export default ExperienceCard;
