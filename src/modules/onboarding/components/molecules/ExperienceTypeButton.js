/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyledNormalText } from '../atoms';

// Load common components from common styles
import { StyledButton, StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const ExperienceTypeButton = props => (
  <StyledButton {...props}>
    <StyledWrapper row secondary={'center'}>
      <StyledNormalText color={'#3EC0BE'} style={{ marginRight: 10 }}>
        {'experience types.'}
      </StyledNormalText>
      <CustomIcon name={'Types_14x14px'} size={16} color={'#3EC0BE'} />
    </StyledWrapper>
  </StyledButton>
);

export default ExperienceTypeButton;
