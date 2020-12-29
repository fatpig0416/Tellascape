import React from 'react';
import styled from 'styled-components/native';
import { View, TouchableOpacity, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
// Load common components
import { StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { images, font, colors } = theme;

const StyledCardAvatar = styled(FastImage)`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
`;

const StyledTitleText = styled.Text`
  font-size: ${wp('3.88%')};
  color: #ffa06d;
  font-family: ${font.MExtraBold};
`;

const StyledDescription = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.72%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #8f8f8f;
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledEventTypeImage = styled(FastImage)`
  width: ${wp('7.22%')};
  height: ${wp('7.22%')};
`;

const ViewEventCardHeader = props => {
  const { title, name, isPublic, eventType, photoUrl, is_secret } = props;
  const eventIcon =
    eventType === 'event'
      ? images.MARKER_EVENT
      : eventType === 'station'
      ? images.MARKER_STATION
      : images.MARKER_MEMORY;

  return (
    <StyledWrapper
      row
      primary={'space-between'}
      secondary={'center'}
      paddingLeft={wp('2.22%')}
      paddingRight={wp('2.22%')}
      paddingTop={wp('2.22%')}
      marginBottom={wp('3.61%')}
    >
      <StyledWrapper row secondary={'center'} style={{ flex: 1 }}>
        <StyledCardAvatar source={{ uri: photoUrl }} />
        <StyledWrapper marginLeft={wp('2.22%')} style={{ flex: 1 }}>
          <StyledTitleText style={{ flex: 1 }}>{title}</StyledTitleText>
          <StyledWrapper row secondary={'center'} marginTop={2}>
            {!isPublic ? <CustomIcon name={'Common-Lock_20x20px'} size={12} color={'#8F8F8F'} /> : null}
            <StyledDescription marginLeft={4}>{`${name} ${
              is_secret ? '∙ SECRET EVENT' : !isPublic ? ' ∙ PRIVATE EVENT' : ''
            }`}</StyledDescription>
          </StyledWrapper>
        </StyledWrapper>
      </StyledWrapper>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp('3%') }}>
        {props.isEdit !== undefined && props.isEdit ? (
          <TouchableOpacity style={{ marginRight: 6 }} onPress={props.onEditPress}>
            <Text style={{ fontFamily: font.MBold, fontSize: 16, color: colors.Orange }}>EDIT</Text>
          </TouchableOpacity>
        ) : null}
        <StyledEventTypeImage source={eventIcon} />
      </View>
    </StyledWrapper>
  );
};

export default ViewEventCardHeader;
