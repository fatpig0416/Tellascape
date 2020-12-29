import React from 'react';
import styled from 'styled-components/native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CustomIcon from '../../../../../utils/icon/CustomIcon';
import theme from '../../../../core/theme';

import { MARGIN_TOP_FLOAT, MARGIN_LEFT_FLOAT } from '../constants';

const StyledBackButton = styled.TouchableOpacity`
  max-width: ${wp('82%')};
  height: ${hp('5.6%')};
  margin-top: ${MARGIN_TOP_FLOAT};
  margin-left: ${MARGIN_LEFT_FLOAT};
  padding-left: ${wp('1.2%')}; /** Arrow icon issue */
  padding-right: ${wp('3.6%')};
  border-radius: ${hp('2.8%')};
  background-color: 'rgba(0,0,0,0.4)';
  flex-direction: row;
  justify-content: space-between;
  align-self: flex-start;
  align-items: center;
`;

const StyledBackButtonText = styled.Text`
  font-size: ${hp('1.875%')};
  font-family: ${theme.font.MSemiBold};
  color: #ffffff;
`;

const BackButton = ({ name, onPress }) => (
  <StyledBackButton onPress={onPress}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={24} color={'#ffffff'} />
    <StyledBackButtonText>{name}</StyledBackButtonText>
  </StyledBackButton>
);

export default BackButton;
