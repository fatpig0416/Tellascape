import React, { Component } from 'react';
import { Alert, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CodeInput from 'react-native-confirmation-code-field';
import styled from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import theme from '../../core/theme';
import GradientButton from '../../core/GradientButton';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyledView,
  StyledLogoInner,
  StyledLogoImage,
  StyledBoxView,
  StyledText,
  StyledButton,
  StyledActivityIndicator,
} from '../../core/common.styles';
import AuthActions from '../reducers/index';

// Load colors, images, font from Theme
const { colors, images, font, sizes } = theme;

const StyledContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.PaleGrey};
`;

class AuthOTPScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isVerifyPossible: false,
      isOTPCorrect: true,
      otp: '',
      isLoading: true,
    };

    this.rawPhoneNumber = this.props.navigation.getParam('rawPhoneNumber');
    this.phoneNumber = this.props.navigation.getParam('phoneNumber');
    this.confirmObj = this.props.navigation.getParam('confirmObj');
  }

  componentDidMount() {
    this.unSubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
  componentWillUnmount() {
    this.unSubscribe();
  }
  onAuthStateChanged = async user => {
    if (user && user.uid) {
      const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
      let userId = user.uid;
      const enabled = await firebase.messaging().hasPermission();
      let telfcmToken;
      if (enabled) {
        telfcmToken = await AsyncStorage.getItem('tel-fcm-token');
      }

      DeviceInfo.isEmulator().then(device => {
        if (device) {
          let authObj = {
            uid: userId.toString(),
            firebase_token: idTokenResult.token,
            fcm_token: telfcmToken,
          };
          this.props.onAuthVerify(authObj);
        } else {
          let authObj = {
            uid: userId.toString(),
            firebase_token: idTokenResult.token,
            model: DeviceInfo.getDeviceId(),
            uuid: DeviceInfo.getUniqueId(),
            os: DeviceInfo.getSystemVersion(),
            fcm_token: telfcmToken,
          };
          this.props.onAuthVerify(authObj);
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  };

  onFulfill = code => {
    this.setState({
      isVerifyPossible: true,
      otp: code,
    });
  };

  confirmCode = async confirmObj => {
    if (this.phoneNumber && this.state.isVerifyPossible) {
      this.setState({
        loading: true,
      });

      const { otp } = this.state;
      let isOTPCorrect = true;
      try {
        let result = await confirmObj.confirm(otp.toString());
        const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
        let userId = result.uid;
        const enabled = await firebase.messaging().hasPermission();
        let telfcmToken;
        if (enabled) {
          telfcmToken = await AsyncStorage.getItem('tel-fcm-token');
        }
        // Render
        DeviceInfo.isEmulator().then(device => {
          if (device) {
            let authObj = {
              uid: userId.toString(),
              firebase_token: idTokenResult.token,
              fcm_token: telfcmToken,
            };
            this.props.onAuthVerify(authObj);
          } else {
            /*
            timezone: DeviceInfo.getTimezone(),
            lanaguage: DeviceInfo.getDeviceLocale(),
            */
            let authObj = {
              uid: userId.toString(),
              firebase_token: idTokenResult.token,
              model: DeviceInfo.getDeviceId(),
              uuid: DeviceInfo.getUniqueId(),
              os: DeviceInfo.getSystemVersion(),
              fcm_token: telfcmToken,
            };
            this.props.onAuthVerify(authObj);
          }
        });
        // Login Success
        //  this.props.navigation.navigate('Profile', { result });
      } catch (e) {
        // Login Failure
        Alert.alert('Tellascape - Authentication', e.message, [
          {
            text: 'OK',
          },
        ]);
        this.field.clear();
        isOTPCorrect = false;
        // Alert.alert('Login Fail', '', [{ text: 'OK' }], {
        //   cancelable: false,
        // });
      }

      this.setState({
        loading: false,
        isVerifyPossible: false,
        otp: '',
        isOTPCorrect,
      });
      // try {

      //   let response = await Firebase.authConfirm(
      //     code.toString(),
      //     this.phoneNumber,
      //   );
      //   if (!response.authToken) {
      //     Alert.alert('Please enter the valid OTP Code.');
      //     this.setState({
      //       loading: false,
      //       otp: '',
      //     });
      //   } else {
      //     this.setState({loading: false, otp: ''});
      //     let record = Object.assign(response, {phone: this.phoneNumber});
      //     console.log(`records for phone login is: ${JSON.stringify(record)}`);
      //   }
      // } catch (error) {
      //   console.log('error--->>>', error);
      // }
    }

    /*
    try {
      auth()
        .signInWithPhoneNumber(phoneNumber)
        .then(confirmResult => {
          //this.confirmObj = confirmResult;
          var credential = auth().PhoneAuthProvider.credential(
            confirmResult.verificationId,
            code.toString(),
          );
          console.log(`crediential is: ${JSON.stringify(credential)}`);
          auth()
            .signInWithCredential(credential)
            .then(result => {
              console.log(`result is: ${JSON.stringify(result)}`);
              console.log(`credientials is: ${JSON.stringify(credential)}`);
            });
        });
      // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      //  let result = await confirmation.confirm(code.toString());
      //  console.log(`result for phone login is: ${JSON.stringify(result)}`);

      // Login Success - onAuthStateChanged is triggered
      // this.props.navigation.navigate('App');
      Alert.alert('Login Success', '', [{text: 'OK'}], {
        cancelable: false,
      });
    } catch (e) {
      // Login Failure
    }

    this.setState({
      loading: false,
    }); */
  };

  onResendCode = async () => {
    try {
      const confirmObj = await firebase.auth().signInWithPhoneNumber(this.phoneNumber, true);
      await this.confirmCode(confirmObj);
    } catch (error) {}
  };

  onGoBack = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'AuthPhoneInput' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    const { isVerifyPossible, loading, isLoading } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} bounces={false}>
        <StyledContainerView>
          {/** Login box */}
          <View style={styles.containerStyle}>
            {/**
             * Logo
             *
             */}
            <StyledLogoInner />
            <StyledLogoImage source={images.LOGO} />

            <View>
              {/**
               * Welcome Text and OTP
               *
               */}
              <StyledText fontSize={hp('3.8%')} color={colors.Black} fontFamily={font.MSemiBold} fontWeight={'600'}>
                {'Sent!'}
              </StyledText>
              <StyledText
                fontSize={hp('1.7%')}
                color={colors.LightGreyFive}
                fontFamily={font.MMedium}
                fontWeight={'500'}
              >
                {`We sent a code to ${this.rawPhoneNumber}.`}
              </StyledText>
              <StyledText marginTop={hp('2.7%')} fontSize={hp('1.6%')} color={'#A2A2A2'} textAlign={'center'}>
                {'Please enter the code below:'}
              </StyledText>

              {/**
               * OTP input
               * */}
              <CodeInput
                ref={ref => {
                  this.field = ref;
                }}
                onFulfill={this.onFulfill}
                inactiveColor={colors.LightBlack}
                activeColor={'#5D5D5D'}
                codeLength={6}
                space={7}
                size={wp('11%')}
                cellProps={() => {
                  return {
                    style: {
                      marginTop: hp('4.4%'),
                      backgroundColor: '#EDEDED',
                      borderRadius: 9,
                      borderColor: '#E6E6E6',
                      borderWidth: 1,
                      fontFamily: font.MMedium,
                      fontSize: 15,
                    },
                  };
                }}
                inputProps={{
                  // Handle onTextChange events
                  onChangeText: text => {
                    this.setState({
                      isVerifyPossible: text.length === 6 ? true : false,
                    });
                  },
                }}
              />

              {/**
               * Resend button
               *
               */}
              <StyledButton onPress={this.onResendCode} marginTop={7}>
                <StyledText
                  fontSize={hp('1.5%')}
                  color={'#A2A2A2'}
                  fontFamily={font.MMedium}
                  fontWeight={'500'}
                  textAlign={'center'}
                >
                  {'RESEND CODE'}
                </StyledText>
              </StyledButton>
              <StyledButton onPress={this.onGoBack} marginTop={sizes.smallPadding}>
                <StyledText
                  fontSize={hp('1.8%')}
                  color={'rgb(69, 216, 191)'}
                  fontFamily={font.MMedium}
                  fontWeight={'600'}
                  textAlign={'center'}
                >
                  {'Edit Phone Number'}
                </StyledText>
              </StyledButton>
            </View>
          </View>
          {/**
           * Gradient button
           *
           */}
          <GradientButton
            width={wp('42%')}
            height={hp('4.9%')}
            isActive={isVerifyPossible}
            onPress={!loading ? () => this.confirmCode(this.confirmObj) : null}
          >
            {!loading ? (
              <StyledText height={hp('4.9%')} color={colors.White} fontWeight={'500'} fontFamily={font.MMedium}>
                {'Sign In'}
              </StyledText>
            ) : (
              <StyledActivityIndicator size={'small'} color={colors.White} />
            )}
          </GradientButton>
        </StyledContainerView>

        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={36} color={'white'} />
            <Text style={styles.loaderText}>{`Processing...`}</Text>
          </View>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('84.5%'),
    backgroundColor: colors.White,
    borderRadius: 15,
    paddingLeft: wp('9.5%'),
    paddingRight: wp('9.5%'),
    paddingTop: hp('9%'),
    paddingBottom: hp('9%'),
    shadowColor: 'rgba(0, 0, 0, 0.23)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 50,
    elevation: 10,
    shadowOpacity: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  loaderText: {
    fontFamily: font.MMedium,
    marginTop: wp('3%'),
    letterSpacing: 0.5,
    fontSize: wp('4%'),
    color: 'white',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuthVerify: obj => {
      dispatch(AuthActions.verifyToken(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthOTPScreen);
