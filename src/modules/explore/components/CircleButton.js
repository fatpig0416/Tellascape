import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import CustomIcon from '../../../utils/icon/CustomIcon';

const StyledCircleButton = styled.TouchableOpacity`
  left: ${props => props.left || 0};
  top: ${props => props.top || 0};
  margin-bottom: 8;
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  background-color: 'rgba(0,0,0,0.3)';
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleButton = ({ iconColor, iconName, style, onPress }) => (
  <StyledCircleButton style={style} onPress={onPress}>
    <CustomIcon name={iconName} size={18} color={iconColor || '#fff'} />
  </StyledCircleButton>
);

export default CircleButton;
