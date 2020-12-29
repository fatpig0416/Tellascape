import React, { Component } from 'react';
import { Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { GoogleSignin } from '@react-native-community/google-signin';
import styled from 'styled-components/native';
import theme from '../../core/theme';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { constants, Loading } from '../../../utils';
import { StyledBackgroundImage, StyledButton } from '../../core/common.styles';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
// import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

const { images, colors } = theme;

const StyledContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-top: ${!isIphoneX() ? hp('25.6%') : hp('25.6%') + 20};
  padding-bottom: ${hp('6%')};
`;

const StyledLoginLogoImage = styled.Image`
  width: ${wp('59.7%')};
  height: ${hp('27.6%')};
  resize-mode: contain;
`;

const StyledDownWrapper = styled.View`
  width: ${wp('15%')};
  height: ${wp('15%')};
  background-color: ${colors.White};
  border-radius: ${wp('7.5%')};
  align-items: center;
  justify-content: center;
`;

const DownButton = props => (
  <StyledButton {...props}>
    <StyledDownWrapper>
      <CustomIcon name={'expand_more-24px'} size={hp('5%')} color={colors.LightGreyFour} />
    </StyledDownWrapper>
  </StyledButton>
);

async function bootstrap() {
  await GoogleSignin.configure({
    webClientId: constants.firebase.android.clientId,
  });
}

class Auth extends Component {
  static navigationOptions = { title: '', header: null };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
    bootstrap();
    /*
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken();
        } else {
          this.requestPermission();
        }
      });
  }

  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('tel-fcm-token');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('tel-fcm-token', fcmToken);
      }
    }
  }
*/

    try {
      await firebase.messaging().requestPermission();
      const fcmToken = await firebase.messaging().getToken();
      AsyncStorage.setItem('tel-fcm-token', fcmToken);
    } catch (error) {
      console.log('User has rejected the push notification permission.');
    }
  }

  loginWithPhone = async () => {
    this.props.navigation.navigate('AuthPhoneInput');
  };

  loginWithFacebook = async () => {
    /*
    try {
      // Login to Facebook with permissions.
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Read the users AccessToken.
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Create a Firebase credential with the token.
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign in to Firebase with the created credential.
      await firebase.auth().signInWithCredential(credential);

      // Login Success
      console.log('Login success');
    } catch (error) {
      // Login Failure
      console.log('Login Failure');
    } */
  };

  loginWithGoogle = async () => {
    /*
    try {
      const {accessToken, idToken} = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await firebase.auth().signInWithCredential(credential);
      // console.log('Login Success--->>>');
    } catch (error) {
      // console.log('Login Fail--->>>');
    }
    */
  };

  render = () =>
    this.state.loading && Platform.OS === 'ios' ? (
      <Loading />
    ) : (
      <StyledContainerView>
        {/**
         * Full background image
         *
         * */}
        <StyledBackgroundImage source={images.LOGIN_BACKGROUND} />

        {/**
         * Login logo image
         *
         * */}
        <StyledLoginLogoImage source={images.LOGIN_LOGO} />

        {/**
         * Down arrow button
         *
         * */}
        <DownButton onPress={this.loginWithPhone} />
      </StyledContainerView>
    );
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Auth);
