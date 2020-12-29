import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledContainer, StyledTitle, StyledNormalText, StyledPlusWrapper } from './atoms';
import { Steps, SkipButton, NextButton } from './molecules';
// Load common components from common styles
import { StyledWrapper } from '../../core/common.styles';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const FeedbackIntro = props => {
  const toNext = () => {
    props.navigation.navigate('App');
  };

  return (
    <StyledContainer source={images.ONBOARDING_BACKGROUND}>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <Steps activeIndex={3} />
        <SkipButton
          onPress={() => {
            props.navigation.navigate('App');
          }}
        />
      </StyledWrapper>

      <StyledWrapper marginTop={hp('11.58%')}>
        <StyledTitle>{'Feel Free\nto Tell Us!'}</StyledTitle>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('1.71%')}>
        <StyledNormalText>
          {
            'As a new platform we look\nforward to your feedback and will\ntake every measure to enhance\nour app and keep you moving.'
          }
        </StyledNormalText>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('4.21%')}>
        <NextButton onPress={toNext} noneIcon buttonText={'Let’s Go'} />
      </StyledWrapper>
    </StyledContainer>
  );
};

export default FeedbackIntro;
