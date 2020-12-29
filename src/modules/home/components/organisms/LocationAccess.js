import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Modal, TouchableOpacity, Platform, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../../../core/theme';
const { font } = theme;
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { StyledWrapper } from '../../../core/common.styles';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import AndroidOpenSettings from 'react-native-android-open-settings';

const StyledButtonContainer = styled.TouchableOpacity`
  width: ${wp('55.55%')};
  height: ${wp('8.88%')};
  align-items: center;
  justify-content: center;
  margin-top: ${wp('5.5%')};
  box-shadow: 0px 4px 8px rgba(106, 51, 124, 0.2);
`;
const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2 || 0};
`;

const CloseButtonContainer = styled.TouchableOpacity`
  width: ${wp('8%')};
  height: ${wp('8%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  align-self: flex-end;
`;

const CloseButton = props => (
  <CloseButtonContainer style={{ backgroundColor: '#3EC0BE' }} {...props}>
    <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
  </CloseButtonContainer>
);

const LocationButton = props => {
  return (
    <StyledButtonContainer {...props}>
      <StyledButtonOverlay
        height={wp('8.88%')}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#3EC0BE', '#3EC0BE']}
      />
      <StyledWrapper row primary={'center'} secondary={'center'}>
        <Text style={styles.buttonTextStyle}>{'ALLOW ACCESS'}</Text>
      </StyledWrapper>
    </StyledButtonContainer>
  );
};

class LocationAccess extends Component {
  onPressButton = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
    if (Platform.OS === 'android') {
      AndroidOpenSettings.locationSourceSettings();
    } else {
      Linking.openSettings();
    }
  };
  render() {
    const { onClose, visible } = this.props;
    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.mainStyle}>
          <View style={styles.containerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleText}>{`Location Warning`}</Text>
              <CloseButton onPress={onClose} />
            </View>
            <Text style={styles.bodyText}>{`Allow Tellascape location permission to use feature of app.`}</Text>
            <LocationButton onPress={this.onPressButton} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  containerStyle: {
    backgroundColor: 'white',
    marginHorizontal: wp('3%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    paddingTop: wp('3%'),
    paddingBottom: wp('3%'),
  },
  titleText: {
    flex: 1,
    fontFamily: font.MBold,
    color: 'black',
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
  bodyText: {
    fontFamily: font.MRegular,
    letterSpacing: 0.5,
    fontSize: wp('3.5%'),
    textAlign: 'center',
    color: '#000',
    marginVertical: hp('3%'),
  },
  buttonTextStyle: {
    color: '#ffffff',
    fontFamily: font.MBold,
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
});

export default LocationAccess;
