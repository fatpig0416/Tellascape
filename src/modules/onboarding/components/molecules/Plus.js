import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load common components from common styles
import { StyledGradientOverlay } from '../../../core/common.styles';
import { StyledPlusOuter, StyledIconWrapper } from '../atoms';

const Plus = props => {
  const gradientColors = ['#44D6BF', '#3BB4BE'];

  return (
    <StyledPlusOuter {...props}>
      <StyledIconWrapper>
        <StyledGradientOverlay
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={gradientColors}
          borderRadius={wp('8.33%')}
          useAngle={true}
        />
        <CustomIcon name={'Navbar_Plus_32px'} size={24} color={'white'} />
      </StyledIconWrapper>
    </StyledPlusOuter>
  );
};

export default Plus;
