import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Load common components from common styles
import { StyledGradientOverlay } from '../../../core/common.styles';
import { StyledMessageGradientButton, StyledMessageGradientButtonText } from '../atoms';

const MessageGradientButton = props => {
  const gradientColors = ['#44D6BF', '#3BB4BE'];

  return (
    <StyledMessageGradientButton {...props}>
      <StyledGradientOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={gradientColors}
        borderRadius={wp('5%')}
        useAngle={true}
      />
      <StyledMessageGradientButtonText>{props.buttonText}</StyledMessageGradientButtonText>
    </StyledMessageGradientButton>
  );
};

export default MessageGradientButton;
