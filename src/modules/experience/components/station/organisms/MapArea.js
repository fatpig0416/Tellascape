import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Linking, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Geojson } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import uuid from 'uuid';
import theme from '../../../../core/theme';

// Load Constants from utils
import { DEVICE_WIDTH } from '../../../../../utils';
import { Loading } from '../../../../../utils';
import { getUserCurrentLocation, getUrlForDirection } from '../../../../../utils/funcs';
import CustomIcon from '../../../../../utils/icon/CustomIcon';
import { EXPLORE } from '../../../../../utils/vals';
const { INTIAL_REGION, REGION_DELTA } = EXPLORE;

const StyledContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
`;

const StyledCircleButton = styled.TouchableOpacity`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  background-color: 'rgba(0,0,0,0.3)';
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.marginTop || 0};
`;

const MapSnapshotImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const StyledWeatherWrapper = styled.View`
  position: absolute;
  right: ${wp('2.5%')};
  top: ${wp('5%')};
  height: ${hp('4%')};
  flex-direction: row;
  border-radius: ${hp('2%')};
  justify-content: center;
  align-items: center;
  padding-left: 10;
  padding-right: 10;
  background-color: #ffffff;
`;

const StyledWeatherText = styled.Text`
  font-size: ${hp('1.5625%')};
  color: #000000;
  font-family: ${theme.font.MRegular};
  font-weight: 500;
  margin-left: 3;
`;

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listViewStyle: {
    paddingRight: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  mapStyles: {
    flex: 1,
    height: 500,
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
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

const CircleButton = props => (
  <StyledCircleButton {...props}>
    <CustomIcon name={props.iconName} size={props.iconSize || 18} color={props.iconColor || '#ffffff'} />
  </StyledCircleButton>
);

const StyledCircleButtonWrapper = styled.View`
  position: absolute;
  left: ${DEVICE_WIDTH - 40};
  top: ${props => props.top || 0};
`;
const StyledMarkerImage = styled.Image`
  width: ${wp('12.5%')};
  height: ${wp('12.5%')};
`;
const MarkerImage = styled.Image`
  width: ${wp('8.5%')};
  height: ${wp('8.5%')};
`;

class MapArea extends Component {
  constructor(props) {
    super(props);
    this.goToInitialLocation = this.goToInitialLocation.bind(this);
    this.coordinates = [];
    this.state = {
      mapMode: this.props.eventType !== 'Post' ? 'standard' : 'hybrid',
      currentLocation: { ...INTIAL_REGION, ...REGION_DELTA },
      isMapReady: false,
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  componentDidUpdate() {
    if (this.props.eventType === 'Live') {
      this.onGeofenceCenter();
    }
  }

  /**
   * Get current location
   *
   */

  getCurrentLocation = async () => {
    try {
      // Get the current position of the user
      const location = await getUserCurrentLocation();
      this.setState({
        currentLocation: {
          ...REGION_DELTA,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    } catch (error) {}
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.initialRegion, 2000);
  };

  /**
   * Change the map mode
   *
   */

  onChangeMapMode = () => {
    this.setState(prevState => ({
      mapMode: prevState.mapMode === 'standard' ? 'hybrid' : 'standard',
    }));
  };

  /**
   * Press compass button
   *
   */

  onFocusMap = () => {
    this.mapView.getMapRef().animateToRegion(this.state.currentLocation);
  };

  onGeofenceCenter = () => {
    if (this.state.isMapReady) {
      this.mapView.getMapRef().animateToRegion(this.initialRegion);
    }
  };

  /**
   * Press direction button
   *
   */

  onGetDirection = () => {
    const url = getUrlForDirection(this.state.currentLocation, this.initialRegion);
    Linking.openURL(url);
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

  renderMarker = item => {
    const { location, id, index } = item;
    if (location) {
      return (
        <Marker identifier={`pin-${id}`} key={id} coordinate={location} zIndex={index}>
          <MarkerImage
            source={
              index - 1 === this.props.activeIndex ? theme.images.MEDIA_STATION_ACTIVE : theme.images.MEDIA_INACTIVE
            }
            style={{ resizeMode: 'contain' }}
          />
        </Marker>
      );
    } else {
      return <View />;
    }
  };

  render() {
    let markers = [];
    let centerObj = null;
    if (this.props.parentID) {
      try {
        const EventPostId = new RegExp(this.props.parentID, 'i');
        if (this.props.eventType === 'Live' || this.props.eventType === 'Post') {
          const eventData = this.props.station.station_data;
          if (eventData[0].fenceJson) {
            const geofence = eventData[0].fenceJson;
            if (eventData[0].shape === 'polygon') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            } else if (eventData[0].shape === 'rectangle') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            } else if (eventData[0].shape === 'circle') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            }
          }
        } else {
          const eventData = this.props.station.station_data.filter(exp => exp.parentID.search(EventPostId) >= 0);
          if (eventData[0].fenceJson) {
            const geofence = eventData[0].fenceJson;
            if (eventData[0].shape === 'polygon') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            } else if (eventData[0].shape === 'rectangle') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            } else if (eventData[0].shape === 'circle') {
              this.coordinates = geofence.coordinates[0].map(item => ({
                latitude: item[1],
                longitude: item[0],
              }));
            }
          }
        }
      } catch (e) {
        console.log(`error is : ${JSON.stringify(e)}`);
      }
      if (!_.isEmpty(this.coordinates)) {
        const center = geolib.getCenterOfBounds(this.coordinates);
        const bounds = geolib.getBounds(this.coordinates);
        const latitudeDelta = Math.abs(center.latitude - bounds.minLat) * 3.6;
        const longitudeDelta = Math.abs(center.longitude - bounds.minLng) * 3.6;

        this.initialRegion = {
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        };
      }
      if (this.props.markerCoordinate !== undefined && this.props.station.station_data.length > 0) {
        centerObj = {
          latitude: this.props.station.station_data[0].centerPoint.lat,
          longitude: this.props.station.station_data[0].centerPoint.lng,
        };

        this.props.markerCoordinate.map(item => {
          let obj = {
            id: item.mediaId,
            index: markers.length + 1,
            location: {
              latitude: item.lat,
              longitude: item.lng,
            },
          };
          markers.push(obj);
        });
      }
    }

    const { mapMode } = this.state;
    const circleWrapperTop =
      this.props.eventType === 'Live' ? hp('20.75%') : this.props.eventType === 'Post' ? hp('8.75%') : 0;
    let i = 0;
    return (
      <View style={styles.container}>
        {!_.isEmpty(this.coordinates) ? (
          <React.Fragment>
            {this.props.eventType === 'View' ? (
              <>
                <MapView
                  ref={ref => (this.mapView = ref)}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  // minZoomLevel={12}
                  initialRegion={this.initialRegion}
                  followUserLocation={true}
                  scrollEnabled={false}
                  showsUserLocation={this.props.eventType === 'Live' || this.props.eventType === 'Post' ? true : false}
                  onMapReady={this.goToInitialLocation}
                  zoomEnabled={this.props.eventType === 'Live' || this.props.eventType === 'Post' ? true : false}
                  mapType={this.props.eventType === 'View' ? 'hybrid' : mapMode}
                >
                  <Geojson
                    geojson={{
                      type: 'FeatureCollection',
                      features: [
                        {
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'Polygon',
                            coordinates: this.props.station.station_data[0].fenceJson.coordinates,
                          },
                        },
                      ],
                    }}
                    strokeColor={theme.blue.text}
                    fillColor="#8a8a8a5c"
                    strokeWidth={2}
                  />
                  {!_.isEmpty(this.props.coordinates) &&
                    this.props.eventType !== 'Live' &&
                    this.props.eventType !== 'Post' &&
                    this.props.coordinates.map((coordinate, index) => (
                      <Marker
                        image={
                          index === this.props.activeIndex ? theme.images.CAMERA_MARKER : theme.images.CAMERA_MARKER
                        }
                        coordinate={coordinate}
                        centerOffset={index === this.props.activeIndex ? { x: 0, y: -25 } : { x: 0, y: 0 }}
                        key={uuid.v4()}
                      />
                    ))}
                </MapView>
              </>
            ) : (
              <>
                <ClusteredMapView
                  provider={PROVIDER_GOOGLE}
                  style={{ flex: 1 }}
                  data={markers}
                  renderMarker={this.renderMarker}
                  renderCluster={this.renderCluster}
                  showsUserLocation={this.props.isUserLocation !== undefined ? this.props.isUserLocation : true}
                  animateClusters={false}
                  mapType={mapMode}
                  ref={ref => (this.mapView = ref)}
                  initialRegion={this.initialRegion}
                  onLayout={() => this.setState({ isMapReady: true })}
                >
                  <Geojson
                    geojson={{
                      type: 'FeatureCollection',
                      features: [
                        {
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'Polygon',
                            coordinates: this.props.station.station_data[0].fenceJson.coordinates,
                          },
                        },
                      ],
                    }}
                    strokeColor={theme.blue.text}
                    fillColor="#8a8a8a5c"
                    strokeWidth={2}
                  />
                  {/* {!_.isEmpty(this.props.coordinates) && this.props.eventType === 'Post' ? (
                    <Marker
                      image={theme.images.EVENT_ICON}
                      coordinate={this.props.coordinates}
                      centerOffset={{ x: 0, y: 0 }}
                      key={uuid.v4()}
                    />
                  ) : null}
                  {!_.isEmpty(this.props.coordinates) &&
                    this.props.eventType !== 'Live' &&
                    this.props.eventType !== 'Post' &&
                    this.props.coordinates.map((coordinate, index) => (
                      <Marker
                        image={
                          index === this.props.activeIndex ? theme.images.CAMERA_MARKER : theme.images.CAMERA_MARKER
                        }
                        coordinate={coordinate}
                        centerOffset={index === this.props.activeIndex ? { x: 0, y: -25 } : { x: 0, y: 0 }}
                        key={uuid.v4()}
                      />
                    ))} */}
                  {centerObj !== null && (
                    <Marker coordinate={centerObj} zIndex={0}>
                      <StyledMarkerImage source={theme.images.STATION_PIN_ICON} style={{ resizeMode: 'contain' }} />
                    </Marker>
                  )}
                </ClusteredMapView>

                {this.props.eventType === 'Post' ? (
                  <StyledWeatherWrapper>
                    <CustomIcon name={'PE-Weather_20x20px'} size={12} color={'#000000'} />
                    <StyledWeatherText>{`${this.props.weather}°F`}</StyledWeatherText>
                  </StyledWeatherWrapper>
                ) : null}

                <StyledCircleButtonWrapper top={circleWrapperTop}>
                  <CircleButton
                    iconSize={16}
                    iconColor={'#ffffff'}
                    iconName={'earth-filled'}
                    onPress={this.onChangeMapMode}
                  />
                  {this.props.eventType === 'Post' ? (
                    <CircleButton
                      iconColor={'#ffffff'}
                      iconName={'right-turn'}
                      marginTop={8}
                      onPress={this.onGetDirection}
                    />
                  ) : null}
                  {this.props.eventType === 'Live' ? (
                    <CircleButton
                      iconColor={'#ffffff'}
                      iconName={'Get-Directions_20x20'}
                      marginTop={8}
                      onPress={this.onGetDirection}
                    />
                  ) : null}
                  {this.props.eventType === 'Live' || this.props.eventType === 'Post' ? (
                    <CircleButton
                      iconColor={'#ffffff'}
                      iconName={'Events_16px'}
                      marginTop={8}
                      onPress={this.onGeofenceCenter}
                    />
                  ) : null}
                  {this.props.eventType === 'Live' || this.props.eventType === 'Post' ? (
                    <CircleButton
                      iconColor={'#ffffff'}
                      // iconName={'Get-Directions_20x20'}
                      iconName={'my_location-24px'}
                      marginTop={8}
                      onPress={this.onFocusMap}
                    />
                  ) : null}
                  {/* {this.props.eventType !== 'Live' ? (
                    <CircleButton
                      iconSize={16}
                      iconColor={'#ffffff'}
                      iconName={'PE-Send_20x20px'}
                      marginTop={8}
                      onPress={this.onGeofenceCenter}
                    />
                  ) : null} */}
                </StyledCircleButtonWrapper>
              </>
            )}
          </React.Fragment>
        ) : (
          <Loading />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    explore: state.explore,
    station: state.station,
  };
};

export default connect(
  mapStateToProps,
  null
)(MapArea);
