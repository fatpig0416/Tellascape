import React from 'react';
import { View, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import theme from '../modules/core/theme';
import styled from 'styled-components';

const { images, colors, font } = theme;

const StyledImage = styled.Image`
  width: ${wp('13.33%')};
  height: ${wp('13.33%')};
`;

const HeaderLogo = () => {
  return <StyledImage source={images.LOGO} />;
};

export default HeaderLogo;
