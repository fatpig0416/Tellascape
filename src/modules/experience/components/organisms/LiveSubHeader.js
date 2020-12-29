import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes, blue, orange, cyan } = theme;

// Import common components
import { StyledWrapper, StyledButton } from '../../../core/common.styles';

const StyledMediaButtonText = styled.Text`
  font-family: ${font.MRegular};
  font-size: ${wp('2.78%')};
  color: ${props => props.color};
  margin-top: ${sizes.xxsmallPadding};
`;

const MediaButton = props => {
  const { buttonType, isFocused, activeColor } = props;
  let iconName = '';
  let buttonText = '';
  const iconColor = !isFocused ? '#b1b1b1' : activeColor;
  const textColor = !isFocused ? '#b8b8b8' : activeColor;

  switch (buttonType) {
    case 'media':
      iconName = 'PE-Media_40x20px';
      buttonText = 'Media';
      break;
    case 'guests':
      iconName = 'PE-GuestList_40x20px';
      buttonText = 'Guests';
      break;
    case 'details':
      iconName = 'PE-Details_40x20px';
      buttonText = 'Details';
      break;
    default:
      break;
  }

  return (
    <StyledButton {...props}>
      <StyledWrapper secondary={'center'}>
        <CustomIcon name={iconName} size={18} color={iconColor} />
        <StyledMediaButtonText color={textColor}>{buttonText}</StyledMediaButtonText>
      </StyledWrapper>
    </StyledButton>
  );
};

const LiveSubHeader = props => {
  const { buttonType, onPress, experienceType } = props;
  const specificTheme = experienceType === 'station' ? blue : experienceType === 'memory' ? cyan :  orange;

  return (
    <StyledWrapper
      row
      primary={'space-between'}
      paddingLeft={wp('12.36%')}
      paddingRight={wp('12.36%')}
      paddingBottom={sizes.smallPadding}
      paddingTop={sizes.smallPadding}
      backgroundColor={colors.White}
    >
      <MediaButton
        activeColor={specificTheme.icon}
        buttonType={'media'}
        onPress={() => onPress(0)}
        isFocused={buttonType === 0 ? true : false}
      />
      <MediaButton
        activeColor={specificTheme.icon}
        buttonType={'guests'}
        onPress={() => onPress(1)}
        isFocused={buttonType === 1 ? true : false}
      />
      <MediaButton
        activeColor={specificTheme.icon}
        buttonType={'details'}
        onPress={() => onPress(2)}
        isFocused={buttonType === 2 ? true : false}
      />
    </StyledWrapper>
  );
};

export default LiveSubHeader;
