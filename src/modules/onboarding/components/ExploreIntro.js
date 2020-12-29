import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledContainer, StyledTitle, StyledNormalText, StyledPlusWrapper } from './atoms';
import { Steps, SkipButton, NextButton, Mark } from './molecules';
// Load common components from common styles
import { StyledWrapper } from '../../core/common.styles';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const ExploreIntro = props => {
  const toNext = () => {
    props.navigation.navigate('HomeIntro');
  };

  return (
    <StyledContainer source={images.ONBOARDING_BACKGROUND}>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <Steps activeIndex={1} />
        <SkipButton
          onPress={() => {
            props.navigation.navigate('App');
          }}
        />
      </StyledWrapper>

      <StyledWrapper marginTop={hp('11.58%')}>
        <StyledTitle>{'Explore\nNear and Far'}</StyledTitle>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('1.71%')}>
        <StyledNormalText>{"Navigate the explore page\nto find out what's nearby."}</StyledNormalText>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('4.21%')}>
        <NextButton onPress={toNext} />
      </StyledWrapper>

      <StyledPlusWrapper alignItems={'flex-start'} style={{ marginLeft: wp('10.26%') }}>
        <Mark type={'explore'} />
      </StyledPlusWrapper>
    </StyledContainer>
  );
};

export default ExploreIntro;
