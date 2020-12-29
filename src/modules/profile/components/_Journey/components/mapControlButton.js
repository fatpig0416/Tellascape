import React from 'react';
import styled from 'styled-components/native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import CustomIcon from '../../../../../utils/icon/CustomIcon';

const StyledMapControlButton = styled.TouchableOpacity`
  width: ${wp('11.1%')};
  height: ${wp('11.1%')};
  border-radius: ${wp('5.55%')};
  background-color: ${props => props.backgroundColor || '#ffffff'};
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.marginTop || 0};
  margin-left: ${props => props.marginLeft || 0};
`;

const MapControlButton = ({ iconName, iconColor, backgroundColor, marginTop, marginLeft, onPress }) => (
  <StyledMapControlButton
    backgroundColor={backgroundColor}
    marginTop={marginTop}
    marginLeft={marginLeft}
    onPress={onPress}
  >
    <CustomIcon name={iconName} size={24} color={iconColor || '#6c6c6c'} />
  </StyledMapControlButton>
);

export default MapControlButton;
