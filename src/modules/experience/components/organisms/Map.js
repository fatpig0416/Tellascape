import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { View, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
// Import Experience actions
import ExperienceActions from '../../reducers/event/index';

// Import Experience actions
import StationAction from '../../reducers/station/index';

// Import organism
import ExperienceHeader from './ExperienceHeader';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { getUserCurrentLocation } from '../../../../utils/funcs';
import { EXPLORE } from '../../../../utils/vals';
const { INTIAL_REGION } = EXPLORE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients } = theme;

// Load common components
import {
  StyledButton,
  StyledHorizontalContainer,
  StyledButtonOverlay,
  StyledWrapper,
} from '../../../core/common.styles';

//Sets configuration options that will be used in all location requests.

const StyledContainerView = styled.View`
  flex: 1;
  background-color: rgb(238, 238, 238);
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
  height: ${hp('11%')};
  justify-content: flex-end;
  padding-bottom: ${hp('1.1%')};
`;

const StyledHeaderText = styled.Text`
  text-align: center;
  color: #ffffff;
  font-size: ${hp('2.5%')};
  font-family: ${font.MMedium};
  font-weight: 500;
`;

const Header = props => {
  const { onGoback, headerTitle } = props;
  return (
    <StyledHeader>
      <StyledButtonOverlay start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={gradients.Background} />
      <StyledHorizontalContainer justifyContent={'space-between'}>
        <BackButton marginLeft={10} onPress={onGoback} />
        <StyledHeaderText>{headerTitle}</StyledHeaderText>
        <StyledWrapper />
      </StyledHorizontalContainer>
    </StyledHeader>
  );
};

const BackButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={hp('3.9%')} color={colors.White} />
  </StyledButton>
);

class MapView extends Component {
  constructor(props) {
    super(props);

    // Set the intial position as INTIAL_REGION constant as considering the case that we can't get the current position
    this.state = {
      geofenceData: null,
      initialPosition: null,
    };

    // Get param to check update the event
    this.original = props.navigation.getParam('original');
    this.isUpdate = props.navigation.getParam('isUpdate');
    this.onMapViewMessage = this.onMapViewMessage.bind(this);
    this.onSaveGeofence = this.onSaveGeofence.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get current position
      const currentLocation = await getUserCurrentLocation();
      if (currentLocation !== null) {
        this.setState({
          initialPosition: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        });
      }
    } catch (error) {}
  };

  /**
   * Make map url based on the current position
   *
   */

  getMapURL = () => {
    const { initialPosition } = this.state;
    let url;
    if (this.original && this.original === 'station') {
      url = 'https://production.tellascape.com/station';
    } else if (this.original && this.original === 'memory') {
      url = 'https://production.tellascape.com/memory';
    } else {
      url = 'https://production.tellascape.com/geo';
    }
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
        // this.setState({ geofenceData: obj });
        let prevScreen = 'CreateEvent';
        if (this.original === 'memory') {
          prevScreen = this.isUpdate ? 'UpdateMemory' : 'PlanMemory';
        } else if (this.original === 'event') {
          prevScreen = this.isUpdate ? 'EditEvent' : 'CreateEvent';
        } else if (this.original === 'station') {
          prevScreen = this.isUpdate ? 'EditStation' : 'CreateStation';
        } else if (this.original === 'safe') {
          prevScreen = 'AddAlert';
        }
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

  onSaveGeofence = () => {
    this.props.setGeofence(this.state.geofenceData, this.original);
    this.props.navigation.navigate('Trending');
  };

  /**
   * Go back
   *
   */
  onGoBack = () => {
    if (this.original === 'safe') {
      const data = this.props.navigation.getParam('data');
      this.props.navigation.navigate('AddAlert', { data });
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    const experienceType = this.original || 'event';
    const { initialPosition } = this.state;

    return (
      <StyledContainerView>
        <ExperienceHeader onPressBack={this.onGoBack} title={'Create a Geofence'} experienceType={experienceType} />
        {initialPosition !== null ? (
          <WebView
            ref={webview => {
              this.mapView = webview;
            }}
            scrollEnabled={false}
            source={{ uri: this.getMapURL() }}
            onMessage={this.onMapViewMessage}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={36} />
          </View>
        )}
      </StyledContainerView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGeofence: (obj, original) => {
      if (original === 'station') {
        dispatch(StationAction.setGeofence(obj));
      } else {
        dispatch(ExperienceActions.setGeofence(obj));
      }
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MapView);
