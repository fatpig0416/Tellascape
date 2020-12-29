import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
// Import Actions
import SafeActions from '../reducers/index';

// Import organism
import ExperienceHeader from '../../experience/components/organisms/ExperienceHeader';

// Load utils
import { getUserCurrentLocation } from '../../../utils/funcs';
import { EXPLORE } from '../../../utils/vals';
const { INTIAL_REGION } = EXPLORE;

const StyledContainerView = styled.View`
  flex: 1;
  background-color: rgb(238, 238, 238);
`;

class MapView extends Component {
  constructor(props) {
    super(props);

    // Set the intial position as INTIAL_REGION constant as considering the case that we can't get the current position
    this.state = {
      geofenceData: null,
      initialPosition: INTIAL_REGION,
    };

    // Get param to check update the event
    this.original = props.navigation.getParam('original');
    this.isUpdate = props.navigation.getParam('isUpdate');

    this.onMapViewMessage = this.onMapViewMessage.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get current position
      const currentLocation = await getUserCurrentLocation();
      this.setState({
        initialPosition: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      });
    } catch (error) {}
  };

  /**
   * Make map url based on the current position
   *
   */

  getMapURL = () => {
    const { initialPosition } = this.state;
    let url = 'https://production.tellascape.com/alert';
    if (initialPosition && initialPosition !== undefined && initialPosition.latitude) {
      url += '?lat=' + this.state.initialPosition.latitude;
    }
    if (initialPosition && initialPosition !== undefined && initialPosition.longitude) {
      url += '&lng=' + this.state.initialPosition.longitude;
    }
    return url;
  };

  handleDataReceived(msgData) {
    console.log('Message received from handle');
  }

  onMapViewMessage(event) {
    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
      if (msgData.data) {
        // this.setState({
        //   geofence: msgData.data,
        // });
        const obj = msgData.data;
        const centerPoint = {
          lat: this.state.initialPosition ? this.state.initialPosition.lat : '',
          lng: this.state.initialPosition ? this.state.initialPosition.lng : '',
        };
        Object.assign(obj, centerPoint);
        this.props.setGeofence(obj, this.original);
        let prevScreen = this.original ? 'CreateSafe' : 'AddAlert';
        this.props.navigation.navigate(prevScreen, {
          geofence: obj.data,
          fenceJson: obj.fenceJson,
          shape: obj.shape,
          centerPoint: {
            lat: this.state.initialPosition ? this.state.initialPosition.lat : '',
            lng: this.state.initialPosition ? this.state.initialPosition.lng : '',
          },
        });
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }

  /**
   * Go back
   *
   */
  onGoBack = () => {
    if (this.original === 'safe') {
      const data = this.props.navigation.getParam('data');
      this.props.navigation.navigate('CreateSafe', { data });
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    const url = this.getMapURL();
    const experienceType = this.original || 'safe';

    return (
      <StyledContainerView>
        <ExperienceHeader onPressBack={this.onGoBack} title={'Create a Geofence'} experienceType={experienceType} />

        <WebView
          ref={webview => {
            this.mapView = webview;
          }}
          scrollEnabled={false}
          source={{ uri: url }}
          onMessage={this.onMapViewMessage}
        />
      </StyledContainerView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGeofence: obj => {
      dispatch(SafeActions.setGeofence(obj));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MapView);
