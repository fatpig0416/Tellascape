import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import CustomIcon from '../../../utils/icon/CustomIcon';

const StyledDownButton = styled.TouchableOpacity`
  position: absolute;
  left: 12;
  top: 64;
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  background-color: #fff;
  box-shadow: 0px -3.5px 27px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleButton = ({ onPress }) => (
  <StyledDownButton onPress={onPress}>
    <CustomIcon name={'expand_more-24px'} size={36} color={'rgba(33, 33, 33, 0.6)'} />
  </StyledDownButton>
);

export default CircleButton;
