import React, { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledContainer, StyledTitle, StyledNormalText, StyledPlusWrapper } from './atoms';
import { Steps, SkipButton, ExperienceTypeButton, NextButton, Plus } from './molecules';
// Load common components from common styles
import { StyledWrapper } from '../../core/common.styles';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const MagicPlus = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Welcome');
    }, 100);
  }, [props.navigation]);

  const toNext = () => {
    props.navigation.navigate('ExploreIntro');
  };

  const toExperienceTypes = () => {
    props.navigation.navigate('ExperienceTypeIntro');
  };

  return (
    <StyledContainer source={images.ONBOARDING_BACKGROUND}>
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <Steps activeIndex={0} />
        <SkipButton
          onPress={() => {
            props.navigation.navigate('App');
          }}
        />
      </StyledWrapper>

      <StyledWrapper marginTop={hp('11.58%')}>
        <StyledTitle>{'Use Magic\nPlus Button'}</StyledTitle>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('1.71%')}>
        <StyledNormalText>{'To access the available '}</StyledNormalText>
        <StyledWrapper marginTop={4}>
          <ExperienceTypeButton onPress={toExperienceTypes} />
        </StyledWrapper>
      </StyledWrapper>

      <StyledWrapper marginTop={hp('4.21%')}>
        <NextButton onPress={toNext} />
      </StyledWrapper>

      <StyledPlusWrapper>
        <Plus />
      </StyledPlusWrapper>
    </StyledContainer>
  );
};

export default MagicPlus;
