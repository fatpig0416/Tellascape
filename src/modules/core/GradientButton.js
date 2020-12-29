import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import theme from './theme';
const { colors } = theme;

const BUTTON_HEIGHT = 44;

const StyledButton = styled.TouchableOpacity`
  margin-top: ${props => -props.height / 2};
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: ${props => props.height / 2};
  justify-content: center;
  align-items: center;
  background-color: ${colors.White};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.27);
  elevation: 10;
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2};
`;

const GradientButton = ({ width, height, onPress, children, isActive }) => {
  return (
    <StyledButton width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? ['rgb(69, 216, 191)', 'rgb(53, 161, 190)'] : [colors.LightGreyEight, colors.LightGreyEight]}
      />
      {children}
    </StyledButton>
  );
};

GradientButton.defaultProps = {
  width: '100%',
  height: BUTTON_HEIGHT,
  text: '',
  onPress: () => {},
  isActive: true,
};

GradientButton.propTypes = {
  height: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func,
  marginTop: PropTypes.number,
};

export default GradientButton;
