import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, FlatList, View, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

// Load common components
import {
  StyledView,
  StyledButton,
  StyledHorizontalContainer,
  StyledWrapper,
  StyledSeparator,
  StyledButtonOverlay,
} from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { images, colors, font, gradients, sizes, orange, blue, cyan } = theme;

const StyledHeader = styled.View`
  width: ${wp('100%')};
  height: ${hp('12.1875%')};
  justify-content: flex-end;
  padding-bottom: 8;
  padding-left: ${wp('5.55%')};
  padding-right: ${wp('5.55%')};
`;

const StyledHeaderTitle = styled.Text`
  font-size: ${sizes.largeFontSize};
  color: #fff;
  font-family: ${font.MBold};
`;

const StyledHeaderAvatarWrapper = styled(FastImage)`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  background-color: ${colors.White};
  justify-content: center;
  align-items: center;
`;

const StyledHeaderAvatar = styled(FastImage)`
  width: ${wp('8.33%')};
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
`;

const BackButton = props => (
  <StyledButton marginLeft={-12} {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={props.iconSize} color={props.iconColor} />
  </StyledButton>
);

const StyledHeaderUsername = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #fff;
  font-family: ${font.MBold};
`;

const IconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={props.iconName} size={props.iconSize} color={'#fff'} />
  </StyledButton>
);

const LiveHeader = props => {
  const {
    onGoBack,
    avatarSource,
    name,
    title,
    moreIconButton,
    experienceType,
    onPressMore,
    onPressAvatar,
    isMoreButton,
  } = props;
  const specificTheme = experienceType === 'station' ? blue : experienceType === 'memory' ? cyan : orange;
  return (
    <View>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={specificTheme.graident}
        style={styles.headerContainer}
      >
        <SafeAreaView>
          {/* <StyledButtonOverlay start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={specificTheme.graident} /> */}
          <StyledWrapper row primary={'space-between'} secondary={'center'}>
            <StyledWrapper style={{ flex: 1 }} row secondary={'center'}>
              <BackButton onPress={onGoBack} iconSize={sizes.xlargeIconSize} iconColor={'#fff'} />
              <StyledWrapper style={{ flex: 1 }} row secondary={'center'} marginLeft={sizes.xsmallPadding}>
                <TouchableWithoutFeedback onPress={onPressAvatar}>
                  <View>
                    <StyledHeaderAvatarWrapper>
                      <StyledHeaderAvatar source={avatarSource} />
                    </StyledHeaderAvatarWrapper>
                  </View>
                </TouchableWithoutFeedback>
                <StyledWrapper style={{ flex: 1 }} marginLeft={14}>
                  <StyledHeaderUsername>{name}</StyledHeaderUsername>
                  <StyledHeaderTitle numberOfLines={1}>{title}</StyledHeaderTitle>
                </StyledWrapper>
              </StyledWrapper>
            </StyledWrapper>
            {moreIconButton ? (
              moreIconButton
            ) : isMoreButton !== undefined && !isMoreButton ? (
              <View />
            ) : (
              <IconButton
                onPress={onPressMore}
                marginLeft={sizes.normalPadding}
                iconName={'more_horiz-24px'}
                iconSize={sizes.xlargeIconSize}
              />
            )}
          </StyledWrapper>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
});

export default LiveHeader;
