import React from 'react';
import { StyledCloseButton } from '../atoms';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
  </StyledCloseButton>
);

export default CloseButton;
