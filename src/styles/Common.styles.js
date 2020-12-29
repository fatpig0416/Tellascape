import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Load utils
import CustomIcon from '../utils/icon/CustomIcon';

// Load theme
import theme from '../modules/core/theme';
const { colors, font, gradients, sizes } = theme;

const GRADIENT_BUTTON_WIDTH = wp('81.66%');

const StyledContainer = styled.View`
  flex: 1;
`;

const StyledWrapper = styled.View`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  justify-content: ${props => props.primary || 'flex-start'};
  align-items: ${props => props.secondary || 'flex-start'};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
`;

const StyledGradientOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.borderRadius || 0};
`;

const StyledGradientButton = styled.TouchableOpacity`
  width: ${GRADIENT_BUTTON_WIDTH};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
`;

const StyledGradientButtonText = styled.Text`
  font-size: ${wp('4.16%')};
  color: #ffffff;
  font-family: ${font.MBold};
`;

const GradientButton = props => {
  const gradientColors =
    props.experienceType === 'memory'
      ? gradients.BackgroundGreen
      : props.experienceType === 'event'
      ? gradients.Background
      : props.experienceType === 'safe'
      ? gradients.BackgroundRed
      : ['#60C3F4', '#76BBFB', '#88A6FF'];

  return (
    <StyledGradientButton {...props} disabled={!props.isValidated}>
      <StyledGradientOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={props.isValidated ? gradientColors : [colors.LightGreyEight, colors.LightGreyEight]}
        borderRadius={wp('5%')}
        useAngle={true}
        angle={125}
      />
      <StyledGradientButtonText>{props.buttonText}</StyledGradientButtonText>
    </StyledGradientButton>
  );
};

const StyledButton = styled.TouchableOpacity``;

const IconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={props.iconName} size={props.iconSize} color={props.iconColor || '#fff'} />
  </StyledButton>
);

const StyledLoadingContainer = styled.View`
  position: absolute;
  bottom: 0;
  top: 0;
  flex: 1;
  left: 0;
  right: 0;
`;

export {
  StyledContainer,
  StyledWrapper,
  StyledGradientOverlay,
  IconButton,
  StyledButton,
  GradientButton,
  StyledLoadingContainer,
};
