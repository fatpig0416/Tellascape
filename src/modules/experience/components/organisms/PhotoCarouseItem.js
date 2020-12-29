// import React from 'react';
import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';

import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Load common components
import { StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes } = theme;

// Import organisms
import Video from 'react-native-video';

const StyledPhotoInfoContainer = styled.View`
  position: absolute;
  width: ${wp('100%')};
  padding-left: ${wp('2.22%')};
  padding-right: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  flex-direction: row;
  justify-content: space-between;
`;

const StyledPhotoZoomButton = styled.TouchableOpacity`
  width: ${wp('8.33%')};
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  margin-left: ${wp('2.22%')};
`;

const StyledPhotoAvatarWrapper = styled(FastImage)`
  width: ${wp('7.22%')};
  height: ${wp('7.22%')};
  border-radius: ${wp('3.61%')};
  background-color: ${colors.White};
  justify-content: center;
  align-items: center;
  margin-right: ${sizes.smallPadding};
`;

const StyledPhotoAvatar = styled(FastImage)`
  width: ${wp('6.66%')};
  height: ${wp('6.66%')};
  border-radius: ${wp('3.33%')};
`;

const StyledUserName = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: #ffffff;
  font-family: ${font.MBold};
`;

const PhotoZoomButton = props => {
  const { iconName, iconSize } = props;

  return (
    <StyledPhotoZoomButton onPress={props.onPress}>
      <CustomIcon name={iconName || 'Scale_16x16'} size={iconSize || sizes.smallIconSize} color={'#ffffff'} />
    </StyledPhotoZoomButton>
  );
};

const StyledGradeWrapper = styled.View`
  position: absolute;
  right: ${wp('2.22%')};
  top: ${wp('2.22%')};
`;

class PhotoCarouseItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isBuffer: false,
      muted: true,
    };
  }
  render() {
    const {
      data: { url, video_url, userPhoto, userName, is_default },
      onPressZoom,
      onPressMore,
      index,
      selectedEntryIndex,
      type,
      paused,
      onChangePaused,
      selectedFilter
    } = this.props;
    const starColor =
      type !== undefined
        ? type === 'event'
          ? theme.orange.icon
          : type === 'station'
          ? theme.blue.icon
          : theme.cyan.icon
        : theme.orange.icon;
    const { muted, isBuffer } = this.state;
    return (
      <StyledWrapper>
        {video_url ? (
          // <MediaView index={index} selectedEntryIndex={selectedEntryIndex} uri={video_url} width={wp('100%')} borderRadius={0} height={wp('100%')} />
          <>
            <Video
              // ref={ref => {
              //   this.video = ref;
              // }}
              source={{
                uri: video_url,
                // headers: {
                //   range: 'bytes=0',
                // },
              }}
              style={{
                width: '100%',
                height: wp('100%'),
                borderRadius: wp('0%'),
              }}
              rate={1}
              playWhenInactive={false}
              muted={muted}
              paused={paused ? true : selectedEntryIndex === index ? false : true}
              resizeMode={'cover'}
              onLoadStart={val => {
                this.setState({ isBuffer: true });
              }}
              onLoad={val => {
                this.setState({ isBuffer: false });
              }}
              onEnd={() => null}
              repeat={true}
              allowsExternalPlayback={true}
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.1)',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
              }}
            >
              {isBuffer ? <ActivityIndicator size={'large'} color={'black'} /> : <View />}
            </View>
          </>
        ) : (
          <FastImage source={{ uri: url }} style={{ width: wp('100%'), height: wp('100%') }} />
        )}
        <StyledGradeWrapper>
          {is_default !== undefined && is_default === 1 && selectedFilter === 'experience' ? (
            <CustomIcon name={'grade-24px'} size={sizes.largeIconSize} color={starColor} />
          ) : null}
        </StyledGradeWrapper>
        <StyledPhotoInfoContainer>
          <StyledWrapper row secondary={'center'}>
            <StyledPhotoAvatarWrapper>
              <StyledPhotoAvatar source={{ uri: userPhoto }} />
            </StyledPhotoAvatarWrapper>
            <StyledUserName>{userName}</StyledUserName>
          </StyledWrapper>

          <StyledWrapper row>
            {video_url && (
              <PhotoZoomButton
                onPress={() => {
                  this.setState({ muted: !this.state.muted });
                }}
                iconName={muted ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'}
                iconSize={20}
              />
            )}
            <PhotoZoomButton
              onPress={() => {
                onChangePaused(true);
                onPressZoom();
              }}
            />
            <PhotoZoomButton onPress={onPressMore} iconName={'more_horiz-24px'} iconSize={28} />
          </StyledWrapper>
        </StyledPhotoInfoContainer>
      </StyledWrapper>
    );
  }
}

export default PhotoCarouseItem;
