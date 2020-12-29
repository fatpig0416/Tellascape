import React, { PureComponent } from 'react';
import { StyleSheet, Animated, ActivityIndicator, View, Text, Platform } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ClusteredMapView from 'react-native-maps-super-cluster';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Heatmap, Geojson } from 'react-native-maps';
// Import actions and reselectors
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ExperienceActions from '../../experience/reducers/event';
import AlertActions from '../../tellasafe/reducers';
import { selectAccessToken, selectUid } from '../../auth/reducers';
import { selectProfile } from '../../experience/reducers/event';

// load theme
import theme from '../../core/theme';
const { font, gradients, colors } = theme;

// Load utils
import { Loading } from '../../../utils';
import { getCustomMapMarkerIcon, getUserCurrentLocation } from '../../../utils/funcs';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { EXPLORE, SAFE } from '../../../utils/vals';
const { INTIAL_REGION, REGION_DELTA } = EXPLORE;
const { DANGER_CATEGORIES } = SAFE;

// Load common styles
import { StyledWrapper } from '../../core/common.styles';

// Import organisms
import Filter from './organisms/Filter';
import EventPopup from './organisms/EventPopup';
import AlertPopup from './organisms/AlertPopup';

const MARGIN_TOP_FLOAT = hp('6.7%');
const MARGIN_LEFT_FLOAT = wp('3.22%');

const StyledContainer = styled.View`
  flex: 1;
`;

const StyledRightWrapper = styled.View`
  position: absolute;
  top: ${MARGIN_TOP_FLOAT};
  right: ${MARGIN_LEFT_FLOAT};
`;

const StyledBackButton = styled.TouchableOpacity`
  max-width: ${wp('82%')};
  height: ${hp('5.6%')};
  margin-top: ${MARGIN_TOP_FLOAT};
  margin-left: ${MARGIN_LEFT_FLOAT};
  padding-left: ${wp('1.2%')}; /** Arrow icon issue */
  padding-right: ${wp('3.6%')};
  border-radius: ${hp('2.8%')};
  background-color: 'rgba(0,0,0,0.4)';
  flex-direction: row;
  justify-content: space-between;
  align-self: flex-start;
  align-items: center;
`;

const StyledBackButtonText = styled.Text`
  font-size: ${hp('1.875%')};
  font-family: ${font.MSemiBold};
  color: #ffffff;
`;

const BackButton = props => (
  <StyledBackButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={24} color={'#ffffff'} />
    <StyledBackButtonText>{props.name}</StyledBackButtonText>
  </StyledBackButton>
);

const StyledMapControlButton = styled.TouchableOpacity`
  width: ${wp('11.1%')};
  height: ${wp('11.1%')};
  border-radius: ${wp('5.55%')};
  background-color: ${props => props.backgroundColor || '#ffffff'};
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.marginTop || 0};
  margin-left: ${props => props.marginLeft || 0};
`;

const MapControlButton = props => (
  <StyledMapControlButton {...props}>
    <CustomIcon name={props.iconName} size={24} color={props.iconColor || '#6c6c6c'} />
  </StyledMapControlButton>
);

const StyledMarkerImage = styled.Image`
  width: ${wp('9.5%')};
  height: ${wp('10.5%')};
`;

const StyledLoadingWrapper = styled.View`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('100%')};
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0, 0, 0, 0.5)';
`;

const CoverLoading = props => (
  <StyledLoadingWrapper>
    <ActivityIndicator size={'small'} color={'#ffffff'} />
  </StyledLoadingWrapper>
);

const RegionDelta = {
  latitudeDelta: 12,
  longitudeDelta: 12,
};

class Journey extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mapMode: 'standard',
      selectedFilterOption: null,
      filteredEventData: this.getFilteredEventData(null),
      slideUpValue: new Animated.Value(0),
      currentLocation: null,

      isSelectedMarker: false,
      selectedEventIndex: null, // the index of filteredEventData array data
      isFetchingEvent: false,
      selectedMarkerData: null,
      isAlertPin: false,
      tracksViewChanges: true,
      // for testing...
      // isMapShow: false,
      isMapShow: true,
    };
    this.renderMarker = this.renderMarker.bind(this);
    this.renderCluster = this.renderCluster.bind(this);
  }

  componentDidMount() {
    let profileData = this.props.profileData;
    if (profileData && profileData !== null && profileData.data && profileData.data.length > 0) {
      this.setState({
        currentLocation: {
          ...REGION_DELTA,
          latitude: profileData.data[0].lat,
          longitude: profileData.data[0].lng,
        },
      });
    } else {
      this.getCurrentLocation();
    }
  }

  stopRendering = () => {
    this.setState({ tracksViewChanges: false });
  };

  getFilteredEventData = filterValue => {
    const { data } = this.props.profileData;
    let filteredEventData = [];

    if (Array.isArray(data) && data.length > 0) {
      filteredEventData = data.filter(ele => {
        const isLocationExisted = !!ele.lat && !!ele.lng;
        if (filterValue === null && isLocationExisted) {
          return true;
        }
        return ele.type === filterValue && isLocationExisted;
      });
    }
    return filteredEventData;
  };

  getCurrentLocation = async () => {
    try {
      // Get the current position of the user
      const location = await getUserCurrentLocation();
      if (location !== null) {
        this.setState({
          currentLocation: {
            ...REGION_DELTA,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          isMapShow: true,
        });
      }
    } catch (error) {}
    this.setState({
      isLoading: false,
    });
  };

  onSelectFilterOption = selectedFilterOption => {
    // get filter event data
    let filteredEventData = this.getFilteredEventData(selectedFilterOption);

    // update the states
    this.setState({
      selectedFilterOption,
      filteredEventData,
      selectedEventIndex: null,
    });
  };

  onSelectMarker = newSelectedEventIndex => {
    const { selectedEventIndex, filteredEventData } = this.state;
    const { journeyData } = this.props.experience;
    const event = journeyData.data[newSelectedEventIndex];

    // Go to the selected event marker
    const eventLocation = {
      //...REGION_DELTA,
      latitude: event.lat,
      longitude: event.lng,
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0034,
    };
    this.setState({ selectedMarkerData: event });
    this.onGoToSpecificLocation(eventLocation);

    // check the selected mark
    if (newSelectedEventIndex === selectedEventIndex) {
      return;
    } else if (newSelectedEventIndex !== selectedEventIndex && selectedEventIndex !== null) {
      this.dismissEventPopup();
      setTimeout(() => {
        this.handleShowEventPopup(newSelectedEventIndex);
      }, 500);
    } else {
      this.handleShowEventPopup(newSelectedEventIndex);
    }
  };

  /**
   * Show the event popup
   *
   */

  showEventPopup = () => {
    Animated.timing(this.state.slideUpValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  handleShowEventPopup = selectedEventIndex => {
    const { journeyData } = this.props.experience;
    if (journeyData.data[selectedEventIndex].type === 'alert') {
      this.setState({
        selectedEventIndex,
        isFetchingEvent: true,
      });
      let req = {
        token: this.props.access_token,
        parentID: journeyData.data[selectedEventIndex].postID,
        onSuccess: res => {
          this.setState({ isSelectedMarker: true, isFetchingEvent: false });
          this.showEventPopup();
        },
      };
      this.props.onGetAlert(req);
    } else {
      this.setState({
        selectedEventIndex,
        isFetchingEvent: true,
        isSelectedMarker: true,
      });

      setTimeout(() => {
        this.setState({
          isFetchingEvent: false,
        });

        this.showEventPopup();
      }, 4000);
    }
  };

  /**
   * Dismiss the event popup
   *
   */

  dismissEventPopup = () => {
    Animated.timing(this.state.slideUpValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  handleDismissEventPopup = () => {
    this.setState({
      isSelectedMarker: false,
      selectedEventIndex: null,
      selectedMarkerData: null,
      tracksViewChanges: true,
    });
    this.dismissEventPopup();
  };

  onGoback = () => {
    this.props.navigation.goBack();
  };

  onPressAlertToggle = () => {
    this.setState(prevState => ({
      isAlertPin: !prevState.isAlertPin,
    }));
  };

  onChangeMapMode = () => {
    this.setState(prevState => ({
      mapMode: prevState.mapMode === 'standard' ? 'hybrid' : 'standard',
    }));
  };

  onGoToSpecificLocation = location => {
    if (Platform.OS === 'android') {
      if (this.mapView) {
        this.mapView.animateToRegion(location);
      }
    } else {
      this.mapView.getMapRef().animateToRegion(location);
    }
  };

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    return (
      <Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  renderMarker = pinItem => {
    const { id, location, type, index, category } = pinItem;
    let alertPin = theme.images.ALERT_PIN_ICON;

    if (category && type === 'alert') {
      let pinIndex = DANGER_CATEGORIES.findIndex(item => item.label === category);
      if (pinIndex !== -1) {
        alertPin = DANGER_CATEGORIES[pinIndex].pin;
      }
    }

    if (location) {
      return (
        <Marker
          identifier={`pin-${id}`}
          key={index}
          coordinate={location}
          zIndex={index}
          tracksViewChanges={Platform.OS === 'android' ? this.state.tracksViewChanges : true}
          onPress={() => this.onSelectMarker(index)}
        >
          <StyledMarkerImage
            source={
              type === 'station'
                ? theme.images.STATION_PIN_ICON
                : type === 'memory'
                ? theme.images.MEMORY_PIN_ICON
                : type === 'alert'
                ? alertPin
                : theme.images.EVENT_PIN_ICON
            }
            style={{ resizeMode: 'contain' }}
          />
          {/* {<StyledMarkerImage source={type === 'event' && theme.images.EVENT_PIN_ICON} resizeMode={'contain'} />}
          {<StyledMarkerImage source={type === 'station' && theme.images.STATION_PIN_ICON} resizeMode={'contain'} />}
          {<StyledMarkerImage source={type === 'memory' && theme.images.MEMORY_PIN_ICON} resizeMode={'contain'} />} */}
        </Marker>
      );
    } else {
      return <View key={index}/>;
    }
  };

  render() {
    const {
      isLoading,
      mapMode,
      selectedFilterOption,
      isSelectedMarker,
      slideUpValue,
      currentLocation,
      filteredEventData,
      selectedEventIndex,
      isFetchingEvent,
      selectedMarkerData,
      isMapShow,
      isAlertPin,
    } = this.state;
    const { journeyData } = this.props.experience;

    const { profileData } = this.props;

    let locationPin = [];
    if (journeyData && journeyData.data && journeyData.data.length > 0) {
      journeyData.data.map((item, index) => {
        let obj = {
          id: item.postID,
          index: index,
          location: {
            latitude: item.lat,
            longitude: item.lng,
          },
          type: item.type,
          category: item.category,
        };
        locationPin.push(obj);
      });
    }

    if (isAlertPin) {
      locationPin = locationPin.filter(item => item.type === 'alert');
    } else {
      if (selectedFilterOption !== null) {
        locationPin = locationPin.filter(item => item.type === selectedFilterOption);
      } else {
        locationPin = locationPin.filter(item => item.type !== 'alert');
      }
    }

    let selectedPin = [];
    if (selectedMarkerData !== null) {
      [selectedMarkerData].map((item, index) => {
        let obj = {
          id: item.postID,
          index: index,
          location: {
            latitude: item.lat,
            longitude: item.lng,
          },
          type: item.type,
        };
        selectedPin.push(obj);
      });
    }
    const { experience } = this.props;
    // let loc = [];
    // let coord = [];
    // let polygonCoordinate = [];
    // if (
    //   isSelectedMarker &&
    //   experience.viewMedia &&
    //   experience.viewMedia.trending_media &&
    //   experience.viewMedia.trending_media.length > 0
    // ) {
    //   experience.viewMedia.fenceJson.coordinates[0].map((item, index) => {
    //     let obj = { latitude: item[1], longitude: item[0] };
    //     polygonCoordinate.push(obj);
    //     // loc.push([item[1], item[0]]);
    //   });
    //   // coord.push(loc);
    // }
    return (
      <StyledContainer>
        {isLoading && currentLocation === null ? (
          <Loading />
        ) : (
          <>
            {isMapShow ? (
              Platform.OS === 'android' ? (
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={{ flex: 1 }}
                  mapType={mapMode}
                  ref={ref => (this.mapView = ref)}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    ...RegionDelta,
                  }}
                  showsUserLocation={true}
                >
                  {(selectedMarkerData === null ? locationPin : [selectedMarkerData]).map((item, index) => {
                    return this.renderMarker(item);
                  })}
                </MapView>
              ) : (
                <ClusteredMapView
                  provider={PROVIDER_GOOGLE}
                  style={{ flex: 1 }}
                  data={selectedMarkerData === null ? locationPin : selectedPin}
                  renderMarker={this.renderMarker}
                  renderCluster={this.renderCluster}
                  animateClusters={false}
                  mapType={mapMode}
                  ref={ref => (this.mapView = ref)}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    ...RegionDelta,
                  }}
                  showsUserLocation={true}
                >
                  {isSelectedMarker && experience.viewMedia.fenceJson !== undefined && (
                    <Geojson
                      geojson={{
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                              type: 'Polygon',
                              coordinates: experience.viewMedia.fenceJson.coordinates,
                            },
                          },
                        ],
                      }}
                      strokeColor={
                        selectedMarkerData.type === 'event'
                          ? theme.orange.text
                          : selectedMarkerData.type === 'station'
                          ? theme.blue.text
                          : theme.cyan.text
                      }
                      fillColor="#8a8a8a5c"
                      strokeWidth={2}
                    />
                  )}
                </ClusteredMapView>
              )
            ) : (
              <View />
            )}
            <View style={{ position: 'absolute', left: 0, right: 0 }}>
              {!isSelectedMarker ? (
                <BackButton name={`@${profileData.profile.user_name}`} onPress={this.onGoback} />
              ) : (
                <MapControlButton
                  iconName={'expand_more-24px'}
                  backgroundColor={'rgba(0,0,0,0.4)'}
                  iconColor={'#ffffff'}
                  marginTop={MARGIN_TOP_FLOAT}
                  marginLeft={MARGIN_LEFT_FLOAT}
                  onPress={this.handleDismissEventPopup}
                />
              )}

              <StyledRightWrapper>
                {!isSelectedMarker ? (
                  <Filter onSelect={this.onSelectFilterOption} selected={selectedFilterOption} />
                ) : null}
                {!isSelectedMarker && (
                  <MapControlButton
                    onPress={this.onPressAlertToggle}
                    style={{
                      backgroundColor: isAlertPin ? theme.tellasafe.text : 'white',
                    }}
                    iconColor={isAlertPin ? 'white' : '#6c6c6c'}
                    iconName={'Map-Button_16x16px'}
                    marginTop={!isSelectedMarker && 8}
                  />
                )}

                <MapControlButton
                  onPress={this.onChangeMapMode}
                  iconName={'earth-filled'}
                  marginTop={!isSelectedMarker && 8}
                />
                <MapControlButton
                  onPress={() => this.onGoToSpecificLocation(currentLocation)}
                  iconName={'my_location-24px'}
                  iconColor={'#c2c2c2'}
                  marginTop={8}
                />
              </StyledRightWrapper>
            </View>

            {selectedEventIndex !== null &&
            isSelectedMarker &&
            selectedPin.length > 0 &&
            selectedPin[0].type !== 'alert' ? (
              <EventPopup
                onPressLine={this.handleDismissEventPopup}
                slideUpValue={slideUpValue}
                currentLocation={currentLocation}
                eventData={journeyData.data[selectedEventIndex]}
                navigation={this.props.navigation}
              />
            ) : null}

            {selectedEventIndex !== null &&
            isSelectedMarker &&
            selectedPin.length > 0 &&
            selectedPin[0].type === 'alert' ? (
              <AlertPopup
                onDismissEventPopup={this.handleDismissEventPopup}
                slideUpValue={slideUpValue}
                currentLocation={currentLocation}
                eventData={journeyData.data[selectedEventIndex]}
                navigation={this.props.navigation}
              />
            ) : null}

            {isFetchingEvent ? <CoverLoading /> : null}
          </>
        )}
      </StyledContainer>
    );
  }
}

const mapStyle = [
  {
    featureType: 'administrative',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clusterContainer: {
    width: wp('9%'),
    height: wp('9%'),
    borderWidth: 4,
    borderRadius: wp('5%'),
    alignItems: 'center',
    borderColor: 'white',
    justifyContent: 'center',
    backgroundColor: '#8A8A8A',
  },
  clusterText: {
    fontSize: wp('4%'),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    access_token: state.auth.access_token,
    profileData: state.experience.profileData,
    uid: state.auth.uid,
    experience: state.experience,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetProfileData: obj => {
      dispatch(ExperienceActions.getProfileData(obj));
    },
    onGetAlert: obj => {
      dispatch(AlertActions.getAlert(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journey);
