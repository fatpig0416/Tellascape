/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyledNextButtton, StyledNextButtonText } from '../atoms';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load common components from common styles
import { StyledWrapper } from '../../../core/common.styles';

const NextButton = props => (
  <StyledNextButtton {...props}>
    <StyledWrapper row secondary={'center'}>
      <StyledNextButtonText style={{ marginRight: !props.noneIcon ? 10 : 0 }}>
        {props.buttonText || 'Next'}
      </StyledNextButtonText>
      {!props.noneIcon ? <CustomIcon name={'Arrow-Right_8x8px'} size={12} color={'#3EC0BE'} /> : null}
    </StyledWrapper>
  </StyledNextButtton>
);

export default NextButton;
