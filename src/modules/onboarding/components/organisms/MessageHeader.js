import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { StyledMessageHeader, StyledMessageHeaderText } from '../atoms';
import { CloseButton } from '../molecules';

const StyledCloseWrapper = styled.View`
  position: absolute;
  right: ${wp('2.22%')};
  top: ${wp('2.22%')};
`;

const MessageHeader = props => {
  return (
    <StyledMessageHeader source={props.source}>
      <StyledCloseWrapper>
        <CloseButton {...props} />
      </StyledCloseWrapper>
      <StyledMessageHeaderText>{props.headerText || ''}</StyledMessageHeaderText>
    </StyledMessageHeader>
  );
};
export default MessageHeader;
