import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ExploreAction from '../../home/reducers';
import { connect } from 'react-redux';

class AuthLoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('accessToken');
    const username = await AsyncStorage.getItem('user_name');
    this.props.onGetTrending();
    let routeName = 'Auth';
    if (userToken) {
      if (username) {
        routeName = 'App';
      } else {
        routeName = 'Profile';
      }
    } else {
      routeName = 'Auth';
    }
    this.props.navigation.navigate(routeName);
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetTrending: obj => {
      dispatch(ExploreAction.getTrendingRequest());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);
