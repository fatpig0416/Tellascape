import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledGradientOverlay, IconButton } from '../../../core/common.styles';
import LinearGradient from 'react-native-linear-gradient';

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes, icons, gradients } = theme;

const StyledHeader = styled.View`
  width: ${wp('100%')};
`;

const StyledBackWrapper = styled.View`
  position: absolute;
  bottom: ${wp('2.64%')};
`;

const StyledMediumText = styled.Text`
  font-size: ${wp('5%')};
  color: #fff;
  font-family: ${font.MSemiBold};
  align-self: center;
`;

const ExperienceHeader = props => {
  const { onPressBack, title, experienceType } = props;
  const gradient =
    experienceType === 'event'
      ? gradients.OrangeHeader
      : experienceType === 'station'
      ? gradients.BlueHeader
      : experienceType === 'safe'
      ? gradients.RedHeader
      : gradients.GreenHeader;

  const startPoint = experienceType === 'station' ? { x: 0.5, y: 0 } : { x: 0, y: 0 };
  const locations = experienceType === 'station' ? [0, 0.5, 1] : [0, 1];
  const endPoint = { x: 1, y: 0.77 };

  return (
    <StyledHeader>
      <LinearGradient
        start={startPoint}
        end={endPoint}
        locations={locations}
        colors={gradient}
        style={styles.headerContainer}
      >
        <SafeAreaView>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <StyledMediumText>{title}</StyledMediumText>
            </View>
            <View style={{ position: 'absolute' }}>
              <IconButton onPress={onPressBack} iconName={icons.ARROW_LEFT} iconSize={sizes.xlargeIconSize} />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </StyledHeader>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: wp('3%'),
    paddingHorizontal: wp('2%'),
  },
});

export default ExperienceHeader;
