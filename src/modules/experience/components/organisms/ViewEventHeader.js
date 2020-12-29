import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Load common components
import { StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { colors } = theme;

const StyledIconButtonWrapper = styled.TouchableOpacity`
  margin-left: ${props => props.marginLeft || wp('5.2%')};
`;

const IconButton = props => {
  const { iconName, iconSize } = props;
  return (
    <StyledIconButtonWrapper {...props}>
      <CustomIcon name={iconName} size={iconSize || 24} color={colors.White} />
    </StyledIconButtonWrapper>
  );
};

const ViewEventHeader = props => {
  const { onBack, onShare } = props;

  return (
    <StyledWrapper
      row
      width={wp('100%')}
      height={wp('24.44%')}
      paddingLeft={wp('3.33%')}
      paddingRight={wp('3.33')}
      primary={'space-between'}
      secondary={'center'}
    >
      <IconButton onPress={onBack} iconName={'keyboard_arrow_left-24px'} iconSize={36} marginLeft={-12} />
      <StyledWrapper row secondary={'center'}>
        {props.hideShare !== undefined && props.hideShare ? null : (
          <IconButton onPress={onShare} iconName={'PE-Share_20x20px'} />
        )}
        {/* <IconButton iconName={'more_horiz-24px'} iconSize={32} /> */}
      </StyledWrapper>
    </StyledWrapper>
  );
};

export default ViewEventHeader;
