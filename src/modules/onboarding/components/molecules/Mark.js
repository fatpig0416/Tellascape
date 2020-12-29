/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load common components from common styles
import { StyledIconWrapper } from '../atoms';

const Mark = props => {
  const { type } = props;

  return (
    <StyledIconWrapper style={{ backgroundColor: 'rgba(255,255,255,0.23)' }}>
      <CustomIcon name={type === 'home' ? 'Navbar_Home_32px' : 'Navbar_Explore_32px'} size={30} color={'#3EC0BE'} />
    </StyledIconWrapper>
  );
};

export default Mark;
