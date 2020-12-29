import { firebase } from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { constants } from './index';
const moment = require('moment');

const iosConfig = {
  clientId: constants.firebase.ios.clientId,
  appId: constants.firebase.ios.appId,
  apiKey: constants.firebase.ios.apiKey,
  databaseURL: constants.firebase.ios.databaseURL,
  storageBucket: constants.firebase.ios.storageBucket,
  messagingSenderId: constants.firebase.ios.messagingSenderId,
  projectId: constants.firebase.ios.projectId,
  persistence: true,
};

const androidConfig = {
  clientId: constants.firebase.android.clientId,
  appId: constants.firebase.android.appId,
  apiKey: constants.firebase.android.apiKey,
  databaseURL: constants.firebase.android.databaseURL,
  storageBucket: constants.firebase.android.storageBucket,
  messagingSenderId: constants.firebase.android.messagingSenderId,
  projectId: constants.firebase.android.projectId,
  persistence: true,
};

class Firebase {
  constructor() {
    this.TellascapeApp = false;
    this.confirmObj = false;
    this.init();
  }

  init() {
    this.TellascapeApp = firebase.initializeApp(
      Platform.OS === 'ios' ? iosConfig : androidConfig,
      constants.firebase.appName
    );
  }
  analytics(event, obj) {
    firebase.analytics().logEvent(event, obj);
  }

  loginWithPhone(contactNumber) {
    return this.TellascapeApp.auth()
      .signInWithPhoneNumber(contactNumber)
      .then(confirmResult => {
        this.confirmObj = confirmResult;
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async authConfirm(otp, phoneNumber) {
    try {
      // eslint-disable-next-line no-undef
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      let result = await confirmation.confirm(otp);
    } catch (e) {
      // Login Failure
      console.log(`Login error is: ${JSON.stringify(e)}`);
    }
  }

  saveFBUserToFirebase(data) {
    try {
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      return this.TellascapeApp.auth()
        .signInWithCredential(credential)
        .then(result => {
          return AsyncStorage.getItem('authToken')
            .then(token => {
              let response = {
                authToken: credential.token,
                provider: 'Facebook',
                email: result.user.email,
                name: result.user.displayName,
                phone: result.user.phoneNumber ? result.user.phoneNumber : '',
                photo: result.user.photoURL ? result.user.photoURL : '',
                refreshToken: '', // result.user.refreshToken
                joined: moment().format('DD MMM YYYY'),
                device_token: token,
              };
              return response;
            })
            .catch(e => {
              console.log(`error in firebase facebook notification token : ${JSON.stringify(e)}`);
            });
        })
        .catch(error => {
          console.log(`Error with Facebook authentication is: ${JSON.stringify(error)}`);
        });
    } catch (e) {
      console.log('Facebook Login error : ', console.log(e));
    }
    return true;
  }

  saveGoogleUserToFirebase(data) {
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      return this.RailSathiApp.auth()
        .signInWithCredential(credential)
        .then(result => {
          return AsyncStorage.getItem('authToken')
            .then(token => {
              let response = {
                authToken: credential.token,
                provider: 'Google',
                email: result.user.email,
                name: result.user.displayName,
                phone: result.user.phoneNumber ? result.user.phoneNumber : '',
                photo: result.user.photoURL ? result.user.photoURL : '',
                refreshToken: '',
                joined: moment().format('DD MMM YYYY'),
                device_token: token,
              };
              return response;
            })
            .catch(e => {
              console.log(`error is google push notification token : ${JSON.stringify(e)} `);
            });
        })
        .catch(error => {
          console.log(`Error with google logged in is : ${JSON.stringify(error)}`);
        });
    } catch (e) {
      console.log('Google Login error : ', console.log(e));
    }
    return true;
  }

  async signOut() {
    try {
      await this.TellascapeApp.auth().signOut();
    } catch (e) {
      console.log(`Firebase Signout Error: ${JSON.stringify(e)}`);
    }
  }

  async getToken() {
    let authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      authToken = await firebase.messaging().getToken();
      if (authToken) {
        await AsyncStorage.setItem('authToken', authToken);
      }
    }
  }

  async requestPermission() {
    this.TellascapeApp.messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('Request for Permission Firebase Message Failed.');
      });
  }

  async checkPermission() {
    this.TellascapeApp.messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken();
        } else {
          this.requestPermission();
        }
      });
  }
}
const instance = new Firebase();
export default instance;
