import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledContainer, StyledTitle, StyledNormalText, StyledPlusWrapper } from './atoms';
import { Steps, SkipButton, NextButton, Mark } from './molecules';
// Load common components from common styles
import { StyledWrapper } from '../../core/common.styles';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const HomeIntro = props => {
  const toNext = () => {
    props.navigation.navigate('FeedbackIntro');
  };

  return (
    <StyledContainer source={images.ONBOARDING_BACKGROUND}>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <Steps activeIndex={2} />
        <SkipButton
          onPress={() => {
            props.navigation.navigate('App');
          }}
        />
      </StyledWrapper>

      <StyledWrapper marginTop={hp('11.58%')}>
        <StyledTitle>{'Get into Trending!'}</StyledTitle>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('1.71%')}>
        <StyledNormalText>{'View trending experiences near and far on the home page.'}</StyledNormalText>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('1.71%')}>
        <StyledNormalText>
          {"Access your friend's public experiences and create\nyour own. Life is waiting!"}
        </StyledNormalText>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('4.21%')}>
        <NextButton onPress={toNext} />
      </StyledWrapper>

      <StyledPlusWrapper alignItems={'flex-start'}>
        <Mark type={'home'} />
      </StyledPlusWrapper>
    </StyledContainer>
  );
};

export default HomeIntro;
