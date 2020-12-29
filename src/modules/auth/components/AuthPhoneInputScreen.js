/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Alert, View, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CountryPicker from 'react-native-country-picker-modal';
import styled from 'styled-components/native';
import firebase from 'react-native-firebase';
import {
  StyledView,
  StyledLogoInner,
  StyledLogoImage,
  StyledBoxView,
  StyledHorizontalContainer,
  StyledText,
  StyledButton,
  StyledActivityIndicator,
} from '../../core/common.styles';
import theme from '../../core/theme';
import GradientButton from '../../core/GradientButton';
import CustomIcon from '../../../utils/icon/CustomIcon';
import Constants from '../../core/Constants';

const { colors, images, font } = theme;

const StyledContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.PaleGrey};
`;

const StyledTermsWrapper = styled.View`
  position: absolute;
  bottom: 33;
  justify-content: center;
  align-items: center;
`;

const StyledPhoneWrapper = styled.View`
  flex: ${props => props.flex || 'none'};
  border-bottom-width: ${hp('0.1%')};
  border-color: ${'#E4E4E4'};
  margin-right: ${props => props.marginRight || 0};
`;

const CountryCodeInput = ({ countryCode, phoneCode, onSelectCountry }) => (
  <StyledPhoneWrapper marginRight={hp('2.2%')}>
    <StyledText color={'#939393'} fontSize={hp('1.2%')} fontWeight={'500'}>
      {'Country'}
    </StyledText>
    <StyledHorizontalContainer>
      <CountryPicker
        closeable
        style={{ marginLeft: 0 }}
        countryCode={countryCode}
        withCallingCode={true}
        onSelect={onSelectCountry}
        translation="eng"
      />
      <StyledText fontSize={hp('2.3%')} color={colors.LightGreySeven}>
        +{phoneCode}
      </StyledText>
    </StyledHorizontalContainer>
  </StyledPhoneWrapper>
);

const PhoneNumberInput = ({ onSetPhone, phone }) => (
  <StyledPhoneWrapper flex={1}>
    <StyledText color={'#939393'} fontSize={hp('1.2%')} fontWeight={'500'}>
      {'Phone Number'}
    </StyledText>
    <TextInputMask
      type={'custom'}
      options={{
        mask: '999-999-9999',
      }}
      value={phone}
      style={{
        height: Platform.OS === 'android' ? 28 : 37,
        fontSize: hp('2.3%'),
        color: colors.LightGreySeven,
        padding: 0,
      }}
      onChangeText={onSetPhone}
      keyboardType={'phone-pad'}
    />
  </StyledPhoneWrapper>
);

export default class AuthPhoneInputScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: 'US',
      phoneCode: '1',
      phone: '',
      loading: false,
    };
  }

  loginWithPhone = async () => {
    if (this.state.phone) {
      const phoneNumber = '+' + this.state.phoneCode + this.state.phone;
      this.setState({
        loading: true,
      });

      // const rawPhoneNumber = this.state.phoneCode + this.state.phone.replace(/-/g, '');
      const rawPhoneNumber = '+' + this.state.phoneCode + ' ' + this.state.phone;
      try {
        const confirmObj = await firebase.auth().signInWithPhoneNumber(phoneNumber);
        this.props.navigation.navigate('AuthOTP', {
          phoneNumber,
          rawPhoneNumber,
          confirmObj,
        });
      } catch (error) {
        if (error.message) {
          Alert.alert('Warning', error.message, [{ text: 'OK' }], {
            cancelable: false,
          });
        }
        this.showWarningAlert();
      }
      this.setState({
        loading: false,
      });
    }
  };

  showWarningAlert = () => {
    Alert.alert('Warning', 'Please enter the correct phone', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  onSelectCountry = country => {
    this.setState({
      countryCode: country.cca2,
      phoneCode: country.callingCode,
      phone: '',
    });
    this.forceUpdate();
  };

  onSetPhone = text => {
    this.setState({ phone: text });
  };

  onTerms = () => {
    this.props.navigation.navigate('Webview', {
      uri: Constants.development.termUrl,
      title: 'Terms',
    });
  };

  onPrivary = () => {
    this.props.navigation.navigate('Webview', {
      uri: Constants.development.privacyUrl,
      title: 'Privacy Policy',
    });
  };

  render() {
    const { countryCode, phoneCode, phone, loading } = this.state;

    return (
      <KeyboardAwareScrollView scrollEnabled={true} contentContainerStyle={{ flex: 1 }}>
        <StyledContainerView>
          <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
            <StyledBoxView elevation={1}>
              {/**
               * Logo
               *
               */}
              <StyledLogoInner />
              <StyledLogoImage source={images.LOGO} />

              {/**
               * Welcome Text and Graident Button Section
               *
               */}
              <StyledView primary={'space-between'}>
                <View>
                  <StyledText fontSize={hp('3.8%')} color={colors.Black} fontFamily={font.MSemiBold} fontWeight={'600'}>
                    {'Welcome'}
                  </StyledText>
                  <StyledText
                    fontSize={hp('1.8%')}
                    color={colors.LightGreyFive}
                    fontFamily={font.MMedium}
                    fontWeight={'500'}
                  >
                    {'Sign in using your phone'}
                  </StyledText>
                </View>

                {/**
                 * Phone number input
                 *
                 */}
                <StyledHorizontalContainer>
                  <CountryCodeInput
                    countryCode={countryCode}
                    phoneCode={phoneCode}
                    onSelectCountry={this.onSelectCountry}
                  />
                  <PhoneNumberInput onSetPhone={this.onSetPhone} phone={phone} />
                </StyledHorizontalContainer>
              </StyledView>
            </StyledBoxView>

            {/**
             * Gradient button
             *
             */}
            <GradientButton
              width={wp('42%')}
              height={hp('4.9%')}
              onPress={!loading ? () => this.loginWithPhone() : null}
            >
              {!loading ? (
                <StyledHorizontalContainer>
                  <StyledText
                    marginRight={wp('1.2%')}
                    fontSize={hp('1.7%')}
                    color={colors.White}
                    fontWeight={'500'}
                    fontFamily={font.MMedium}
                  >
                    {'Continue'}
                  </StyledText>
                  <CustomIcon name={'keyboard_arrow_right-24px'} size={hp('2.2%')} color={colors.White} />
                </StyledHorizontalContainer>
              ) : (
                <StyledActivityIndicator size={'small'} color={colors.White} />
              )}
            </GradientButton>
          </View>

          {/**
           * Terms Section
           *
           */}
          <View style={{ flex: 0.1 }}>
            <StyledText color={colors.BrownGrey}>{'By signing up for Tellascape, you agree to our'}</StyledText>
            <StyledHorizontalContainer>
              <StyledButton onPress={this.onTerms}>
                <StyledText color={colors.BrownGrey} fontWeight={'500'} fontFamily={font.MSemiBold}>
                  {'Terms of Service,'}
                </StyledText>
              </StyledButton>
              <StyledText color={colors.BrownGrey}>{'and have read our '}</StyledText>
              <StyledButton onPress={this.onPrivary}>
                <StyledText color={colors.BrownGrey} fontWeight={'500'} fontFamily={font.MSemiBold}>
                  {'Privacy Policy.'}
                </StyledText>
              </StyledButton>
            </StyledHorizontalContainer>
          </View>
        </StyledContainerView>
      </KeyboardAwareScrollView>
    );
  }
}
