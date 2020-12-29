import React from 'react';
import { StyledNormalText } from '../atoms';

// Load common components from common styles
import { StyledButton } from '../../../core/common.styles';

const SkipButton = props => (
  <StyledButton {...props}>
    <StyledNormalText>{'skip'}</StyledNormalText>
  </StyledButton>
);

export default SkipButton;
