import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const StyledLoadingWrapper = styled.View`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('100%')};
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0, 0, 0, 0.5)';
`;

const CoverLoading = () => (
  <StyledLoadingWrapper>
    <ActivityIndicator size={'small'} color={'#ffffff'} />
  </StyledLoadingWrapper>
);

export default CoverLoading;
