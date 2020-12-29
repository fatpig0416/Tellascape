import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal as RNModal,
  SafeAreaView,
  Platform,
  Text,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageZoom from 'react-native-image-pan-zoom';
import PhotoView from 'react-native-photo-view';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
// Import common styles
import { StyledWrapper, StyledButton } from '../../../core/common.styles';
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { font, sizes } = theme;

const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16;
  top: ${isIphoneX() ? 40 : 20};
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  /* border-color: #fff; */
  /* border-width: 2; */
  justify-content: center;
  align-items: center;
`;

const ModalCloseButton = props => (
  <StyledModalCloseButton style={{ backgroundColor: 'rgba(128,128,128,0.6)' }} {...props}>
    <CustomIcon name={'Close_16x16px'} size={14} color={'white'} />
  </StyledModalCloseButton>
);

const ModalSoundButton = props => (
  <TouchableOpacity onPress={props.onPress}>
    <View>
      <CustomIcon name={props.muted ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'} size={16} color={'#FFF'} />
    </View>
  </TouchableOpacity>
);
const StyledModalLikesContainer = styled.View`
  position: absolute;
  bottom: 40;
  justify-content: center;
  align-items: center;
  width: ${wp('100%')};
`;

const StyledModalLikesWrapper = styled.View`
  background-color: #f4f4f2;
  border-radius: ${wp('6.165%')};
  padding-left: ${wp('5%')};
  padding-right: ${wp('5%')};
  padding-top: ${wp('2%')};
  padding-bottom: ${wp('2%')};
`;

const StyledModalLikesText = styled.Text`
  color: #242424;
  font-family: ${font.MSemiBold};
  font-size: ${hp('2.5%')};
`;

const ModalLikes = props => (
  <StyledModalLikesContainer>
    <StyledModalLikesWrapper>
      {/* <StyledModalLikesText>{`🔥 ${props.likes}`}</StyledModalLikesText> */}
      <LikesIconDetail iconName={'love-big_16x16'} count={props.likes} disabled />
    </StyledModalLikesWrapper>
  </StyledModalLikesContainer>
);

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
  countTextStyle: {
    fontFamily: font.MSemiBold,
    fontSize: wp('3.5%'),
    color: '#8C8D8D',
  },
  mediaTitleStyle: {
    fontFamily: font.MBold,
    fontSize: wp('4%'),
    color: 'white',
    textTransform: 'capitalize',
  },
  labelStyle: {
    fontFamily: font.MMedium,
    fontSize: wp('3.2%'),
    color: 'white',
    marginLeft: wp('3%'),
  },
  navigationContainer: {
    position: 'absolute',
    top: hp('40%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: wp('6%'),
    alignSelf: 'baseline',
    marginHorizontal: wp('2%'),
  },
});

const StyledLikesIconText = styled.Text`
  font-size: ${hp('2.5%')};
  color: #515151;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.smallPadding};
`;

const LikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.normalIconSize} color={iconColor || '#282828'} />
        <StyledLikesIconText>{count}</StyledLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

export default class PhotoZoomModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      muted: true,
      paused: false,
      isBuffer: false,
    };
  }
  onNext = () => {
    if (this._carousel) {
      this._carousel.snapToNext();
    }
  };
  onPrevious = () => {
    if (this._carousel) {
      this._carousel.snapToPrev();
    }
  };
  render() {
    const {
      isModalVisible,
      onCloseZoomMoal,
      items,
      selectedEntryIndex,
      mediaZoomSlideIndex,
      onSnapToItem,
      selectedFilter,
    } = this.props;
    const { muted, paused, isBuffer } = this.state;
    let slideIndex = mediaZoomSlideIndex > items.length - 1 ? 0 : mediaZoomSlideIndex;
    return (
      <RNModal
        visible={isModalVisible}
        transparent={true}
        style={styles.modalContainer}
        onRequestClose={onCloseZoomMoal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.99)' }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.99)' }}>
            <View
              style={{
                height: hp('10%'),
                justifyContent: 'space-between',
                flex: 0.1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp('3'),
              }}
            >
              <TouchableOpacity onPress={onCloseZoomMoal}>
                <CustomIcon name={'Close_16x16px'} size={16} color={'#8C8D8D'} />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.mediaTitleStyle}>{selectedFilter}</Text>
                <Text style={styles.countTextStyle}>
                  {Number.parseInt(slideIndex) + 1}
                  {' of '}
                  {items.length}
                </Text>
              </View>
              {items[slideIndex].video_url !== undefined ? (
                <ModalSoundButton onPress={() => this.setState({ muted: !muted })} muted={muted} />
              ) : (
                <View />
              )}
            </View>
            <View style={{ flex: 0.8 }}>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={items}
                sliderWidth={wp('100%')}
                itemWidth={wp('100%')}
                activeSlideAlignment={'center'}
                firstItem={selectedEntryIndex}
                initialNumToRender={items.length}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                removeClippedSubviews={false}
                onSnapToItem={onSnapToItem}
                renderItem={({ item, index }) => {
                  const { video_url, url, la_url, userPhoto, likes, comments, userName } = item;
                  return (
                    <View>
                      {video_url ? (
                        <>
                          <View style={{ height: '100%', justifyContent: 'center' }}>
                            <Video
                              source={{
                                uri: video_url,
                              }}
                              style={{
                                width: wp('100%'),
                                height: '100%',
                                borderRadius: wp('0%'),
                              }}
                              rate={1}
                              playWhenInactive={false}
                              muted={muted}
                              paused={paused ? true : slideIndex === index ? false : true}
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
                          </View>
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
                            {isBuffer ? <ActivityIndicator size={'large'} color={'white'} /> : <View />}
                          </View>
                        </>
                      ) : (
                        <PhotoView
                          source={{ uri: la_url ? la_url : url }}
                          androidScaleType="fitCenter"
                          onLoad={() => console.log('Image loaded!')}
                          style={{ width: wp('100%'), height: '100%' }}
                        />
                        // <ImageZoom
                        //   cropWidth={wp('100%')}
                        //   cropHeight={'100%'}
                        //   imageWidth={200}
                        //   imageHeight={200}
                        //   useNativeDriver={true}
                        // >
                        //   <FastImage
                        //     style={{ width: wp('100%'), height: '100%' }}
                        //     resizeMode={'contain'}
                        //     source={{ uri: la_url ? la_url : url }}
                        //   />
                        // </ImageZoom>
                      )}
                    </View>
                  );
                }}
              />
            </View>
            <View
              style={{
                height: hp('10%'),
                justifyContent: 'space-between',
                flex: 0.1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: wp('3'),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage
                  style={{ width: wp('9%'), height: wp('9%'), borderRadius: wp('5%') }}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{ uri: items[slideIndex].userPhoto }}
                />
                <Text style={styles.labelStyle}>{items[slideIndex].userName}</Text>
              </View>
              {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIcon name={'love-big_16x16'} size={18} color={'white'} />
                  <Text style={styles.labelStyle}>{items[slideIndex].likes}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp('5%') }}>
                  <CustomIcon name={'comments-big_16x16'} size={18} color={'white'} />
                  <Text style={styles.labelStyle}>{items[slideIndex].comments.length}</Text>
                </View>
              </View> */}
            </View>
            {/* {items && items.length > 0 && Platform.OS === 'android' && mediaZoomSlideIndex !== 0 && (
              <View style={styles.navigationContainer}>
                <TouchableOpacity style={styles.navigationButtonContainer} onPress={this.onPrevious}>
                  <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'white'} />
                </TouchableOpacity>
              </View>
            )}
            {items && items.length > 0 && Platform.OS === 'android' && items.length - 1 !== mediaZoomSlideIndex && (
              <View style={[styles.navigationContainer, { right: 0 }]}>
                <TouchableOpacity onPress={this.onNext} style={styles.navigationButtonContainer}>
                  <CustomIcon name={'keyboard_arrow_right-24px'} size={36} color={'white'} />
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </SafeAreaView>
      </RNModal>
    );
  }
}
