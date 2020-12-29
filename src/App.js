/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import type { Notification } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import { MenuProvider } from 'react-native-popup-menu';
import NavigationService from './navigation/NavigationService';
import _ from 'lodash';
import { Platform, PermissionsAndroid, YellowBox } from 'react-native';
const prefix = 'tellascape://';

let persistor = persistStore(store);

class App extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(['Setting a timer']);
  }

  componentDidMount() {
    // setTimeout(() => SplashScreen.hide() , 2000);
    SplashScreen.hide();
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    // firebase.crashlytics().enableCrashlyticsCollection();

    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Tellascape',
          message:
            'In order to track the path of your routes, or build a geofence around an experience, we need access to your GPS.',
        });
      } catch (err) {
        console.warn(err);
      }
    }
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
  }

  render() {
    return (
      <MenuProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigator
              uriPrefix={prefix}
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
              screenProps={this.props}
            />
          </PersistGate>
        </Provider>
      </MenuProvider>
    );
  }
}
export default App;
