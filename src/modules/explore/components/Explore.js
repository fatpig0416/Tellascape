import React, { Component, PureComponent } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Geojson } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import ExploreAction from '../../home/reducers/index';
import ExperienceActions from '../../experience/reducers/event/index';
import StationActions from '../../experience/reducers/station';
import MemoryActions from '../../experience/reducers/memory';
import AlertActions from '../../tellasafe/reducers';
import * as geolib from 'geolib';
import _ from 'lodash';
import moment from 'moment';
import { withNavigationFocus } from 'react-navigation'; // watch if this screen is focussed
// Load components
import FilterInput from './FilterInput';
import EventPopup from './EventPopup';
import FilterPopup from './FilterPopup';
import AlertPopup from './AlertPopup';
import LocationAccess from '../../home/components/organisms/LocationAccess';

// Load theme
import theme from '../../core/theme';
const { dimensions, colors } = theme;

// Load Temp Values && funcs && custom icons
import { Loading } from '../../../utils';
import { getCustomMapMarkerIcon, getUserCurrentLocation, getValueFromObjectWithoutKey } from '../../../utils/funcs';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { EXPLORE } from '../../../utils/vals';
const { INTIAL_REGION, REGION_DELTA } = EXPLORE;
import { SAFE } from '../../../utils/vals';
const { DANGER_CATEGORIES } = SAFE;

// Load Constants from utils
import { DEVICE_WIDTH } from '../../../utils';

const StyledContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
`;

const StyledCircleButton = styled.TouchableOpacity`
  left: ${props => props.left || 0};
  top: ${props => props.top || 0};
  margin-bottom: 8;
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  background-color: 'rgba(0,0,0,0.3)';
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CircleButton = props => (
  <StyledCircleButton {...props}>
    <CustomIcon name={props.iconName} size={18} color={props.iconColor || '#fff'} />
  </StyledCircleButton>
);

const StyledDownButton = styled.TouchableOpacity`
  position: absolute;
  left: 12;
  top: 64;
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  background-color: #fff;
  box-shadow: 0px -3.5px 27px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DownButton = props => (
  <StyledDownButton {...props}>
    <CustomIcon name={'expand_more-24px'} size={36} color={'rgba(33, 33, 33, 0.6)'} />
  </StyledDownButton>
);

const AlertView = ({ onPressClose }) => {
  return (
    <View style={{ backgroundColor: theme.tellasafe.icon, width: wp('100%'), position: 'absolute', top: 0 }}>
      <SafeAreaView>
        <View
          style={{
            height: hp('8%'),
            paddingHorizontal: wp('4%'),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomIcon name={'Sent_24x24px'} size={24} color={'white'} />
            <Text
              style={{
                color: 'white',
                fontFamily: theme.font.MMedium,
                marginLeft: wp('4%'),
                letterSpacing: 0.4,
                fontSize: wp('4%'),
              }}
            >{`Alert has been sent\nsuccessfully`}</Text>
          </View>
          <TouchableOpacity onPress={onPressClose}>
            <CustomIcon name={'Close_16x16px'} size={18} color={'white'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const StyledMarkerImage = styled.Image`
  width: ${wp('9.5%')};
  height: ${wp('10.5%')};
`;

const RegionDelta = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const currentLocationDelta = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

class Explore extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mapMode: 'standard',
      isEventPopupVisible: false,
      isFilterPopupVisible: false,
      currentLocation: { ...INTIAL_REGION, ...REGION_DELTA },
      selectedMarkerData: null,
      isMarkerPress: false,
      inGeofence: false,

      // All use for filter //
      searchTitle: '',
      timeOptions: [],
      eventCategories: [],
      stationCategories: [],
      isEventSelected: false,
      isMemorySelected: false,
      isStationSelected: false,
      isReset: false,
      isAlertPin: false,
      isVisibleLocation: false,
      tracksViewChanges: true,
      // -------- //
    };

    this.renderMarker = this.renderMarker.bind(this);
    this.renderCluster = this.renderCluster.bind(this);
    this.stopRendering = this.stopRendering.bind(this);
    this.eventPopupBottom = new Animated.Value(-220);
    this.filterPopupBottom = new Animated.Value(60 - dimensions.height);
  }

  UNSAFE_componentWillMount() {
    this.getCurrentLocation();
  }

  stopRendering = () => {
    this.setState({ tracksViewChanges: false });
  };

  startRendering = () => {
    this.setState({ tracksViewChanges: true });
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', async () => {
        const location = await getUserCurrentLocation();
        if (location !== null && location.code && location.code !== 'CANCELLED' && location.code !== 'UNAVAILABLE') {
          this.setState({ isVisibleLocation: true });
        } else {
          this.setState({ isVisibleLocation: false });
        }
        this.onDismissEventPopup();
        this.getCurrentLocation();
      }),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isFocused && this.props.isFocused) {
      this.fetchAllMakers();
    }
    const { state } = this.props.navigation;
    if (state.params && state.params.routeData && state.params.routeData !== null) {
      this.showSpecificAlertPopup(state.params.routeData);
    }
  }

  // Get current location
  getCurrentLocation = async () => {
    try {
      // Get the current position of the user
      const location = await getUserCurrentLocation();
      if (location !== null) {
        this.setState(
          {
            currentLocation: {
              latitude: location.latitude,
              longitude: location.longitude,
              ...RegionDelta,
            },
          },
          () => {
            this.onFocusMap(RegionDelta);
          }
        );
      }
    } catch (error) {}
    this.setState({
      isLoading: false,
    });
  };

  // Fetch all makers
  fetchAllMakers = async () => {
    // Get all markers
    const exploreReqObj = {
      token: this.props.auth.access_token,
    };
    this.props.onGetMarkers(exploreReqObj);
  };

  checkUserInGeofence = async response => {
    const location = await getUserCurrentLocation();
    // let loc = [];
    // let coord = [];
    let polygonCoordinate = [];
    response[0].fenceBuffer.coordinates[0].map((item, index) => {
      let obj = { latitude: item[1], longitude: item[0] };
      polygonCoordinate.push(obj);
    });

    let point = {
      lat: location.latitude,
      lng: location.longitude,
    };
    try {
      if (geolib.isPointInPolygon(point, polygonCoordinate)) {
        this.setState({ inGeofence: true });
      } else {
        this.setState({ inGeofence: false });
      }
    } catch (e) {
      Alert.alert(`unable to get location: ${JSON.stringify(e)}`);
    }
  };

  // Select the Marker
  onSelectMarker = experienceData => {
    this.setState({ inGeofence: true });
    let req = {
      token: this.props.auth.access_token,
      parentID: experienceData.parentID,
      onGetEventSuccess: res => {
        this.checkUserInGeofence(res);
      },
      onSuccess: res => {
        this.checkUserInGeofence(res);
      },
    };
    if (experienceData.type === 'event') {
      this.props.onGetPostEvent(req);
    } else if (experienceData.type === 'station') {
      this.props.onGetStation(req);
    } else if (experienceData.type === 'alert') {
      this.props.onGetAlert(req);
    } else {
      this.props.onGetMemory(req);
    }

    this.showEventPopup();

    const { location } = experienceData;
    const { isEventPopupVisible, selectedMarkerData } = this.state;

    // Move to the selected marker
    if (Platform.OS === 'ios' && this.mapView && this.mapView.getMapRef) {
      this.mapView.getMapRef().animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        },
        1000
      );
    } else if (this.mapView) {
      this.mapView.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        },
        1000
      );
    }

    this.setState({
      selectedMarkerData: experienceData,
      isMarkerPress: true,
    });
  };

  showSpecificAlertPopup = routeData => {
    const { parent_id } = routeData;
    let req = {
      token: this.props.auth.access_token,
      parentID: parent_id,
      onSuccess: res => {
        const { markers } = this.props.explore;
        this.setState({ isEventPopupVisible: true, isAlertPin: true });
        if (res && res.length > 0) {
          markers.map((item, index) => {
            const markerData = getValueFromObjectWithoutKey(item);
            if (markerData.parentID === res[0].parentID) {
              let obj = {
                id: markerData.parentID,
                parentID: markerData.parentID,
                childID: markerData.childID,
                location: {
                  latitude: markerData.lat,
                  longitude: markerData.lng,
                },
                title: markerData.title,
                iUrl: markerData.iUrl,
                type: markerData.type,
                category: markerData.category,
                startdate: markerData.startdate,
                enddate: markerData.enddate,
                sDate: markerData.sDate,
                eDate: markerData.eDate,
                rsvp_user: markerData.rsvp_user,
                index: index,
              };
              this.setState({ selectedMarkerData: obj, isMarkerPress: true });
            }
          });

          let centerPoint = res[0].centerPoint;
          if (Platform.OS === 'ios' && this.mapView && this.mapView.getMapRef) {
            this.mapView.getMapRef().animateToRegion(
              {
                latitude: centerPoint.lat,
                longitude: centerPoint.lng,
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              },
              1000
            );
          } else if (this.mapView) {
            this.mapView.animateToRegion(
              {
                latitude: centerPoint.lat,
                longitude: centerPoint.lng,
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              },
              1000
            );
          }
        }
      },
    };
    this.props.onGetAlert(req);
    this.props.navigation.setParams({ routeData: null });
  };

  // Show event popup
  showEventPopup = () => {
    this.setState({
      isEventPopupVisible: true,
    });

    Animated.timing(this.eventPopupBottom, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  // Dismiss event popup
  hideEventPopup = () => {
    this.setState({
      isEventPopupVisible: false,
      tracksViewChanges: true,
    });

    Animated.timing(this.eventPopupBottom, {
      toValue: -220,
      duration: 1000,
    }).start();
  };

  // Show filter popup
  showFilterPopup = () => {
    Animated.timing(this.filterPopupBottom, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  // Dismiss filter popup
  hideFilterPopup = () => {
    Animated.timing(this.filterPopupBottom, {
      toValue: 60 - dimensions.height,
      duration: 1000,
    }).start();
  };

  /** Press filter icon button   */

  onShowFilterPopup = () => {
    this.setState({
      isFilterPopupVisible: true,
    });
    this.showFilterPopup();
  };

  /** Dismiss the event popup  */

  onDismissEventPopup = async () => {
    const { state } = this.props.navigation;
    if (state.params && state.params.routeData && state.params.routeData !== null) {
      this.showSpecificAlertPopup(state.params.routeData);
    } else {
      this.setState({
        isEventPopupVisible: false,
        isMarkerPress: false,
        selectedMarkerData: null,
        // isAlertPin: false,
      });
      this.hideEventPopup();
    }
  };

  /*** Dismiss the filter popup  */

  onDismissFilterPopup = () => {
    this.startRendering();
    this.setState({
      isFilterPopupVisible: false,
    });
    this.hideFilterPopup();
  };

  /*** Change the map mode   **/

  onChangeMapMode = () => {
    this.setState(prevState => ({
      mapMode: prevState.mapMode === 'standard' ? 'hybrid' : 'standard',
    }));
  };

  onAlertPress = () => {
    this.setState(prevState => ({
      isAlertPin: !prevState.isAlertPin,
    }));
  };

  /** * Press compass button  */

  onFocusMap = delta => {
    if (Platform.OS === 'ios' && this.mapView && this.mapView.getMapRef) {
      this.mapView.getMapRef().animateToRegion({
        ...this.state.currentLocation,
        ...delta,
      });
    } else if (this.mapView) {
      this.mapView.animateToRegion({
        ...this.state.currentLocation,
        ...delta,
      });
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
    const { id, parentID, childID, title, location, type, startdate, enddate, rsvp_user, category, index } = pinItem;
    const { currentLocation, isAlertPin } = this.state;
    let alertPin = theme.images.ALERT_PIN_ICON;

    if (location) {
      const markerDataforSelecting = {
        id,
        type,
        parentID,
        childID,
        location,
        currentLocation,
        startdate,
        enddate,
        title,
        rsvp_user,
        category,
        navigation: this.props.navigation,
      };
      if (category && type === 'alert') {
        let pinIndex = DANGER_CATEGORIES.findIndex(item => item.label === category);
        if (pinIndex !== -1) {
          alertPin = DANGER_CATEGORIES[pinIndex].pin;
        }
      }

      return (
        <Marker
          identifier={`pin-${id}`}
          key={id}
          coordinate={location}
          tracksViewChanges={Platform.OS === 'android' ? this.state.tracksViewChanges : true}
          onPress={() => this.onSelectMarker(markerDataforSelecting)}
          zIndex={index}
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
            onLoad={this.stopRendering}
            fadeDuration={0}
          />
        </Marker>
      );
    } else {
      return <View />;
    }
  };

  filterdData = data => {
    const {
      searchTitle,
      isEventSelected,
      isMemorySelected,
      isStationSelected,
      eventCategories,
      stationCategories,
      timeOptions,
    } = this.state;
    let filteredData = data,
      eventFilterData = [],
      stationFilterData = [],
      memoryFilterData = [];
    let finalArray = [];
    if (data !== undefined && data.length > 0) {
      if (searchTitle.length > 0) {
        filteredData = data.filter(function(item) {
          const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
          const textData = searchTitle.toUpperCase();
          return itemData.includes(textData);
        });
      }
      if (isEventSelected) {
        if (eventCategories.length === 0) {
          eventFilterData = _.filter(filteredData, { type: 'event' });
        } else {
          _.map(eventCategories, (category, index) => {
            _.map(filteredData, (item, index) => item.category === category && eventFilterData.push(item));
          });
        }
      }
      if (isStationSelected) {
        if (stationCategories.length === 0) {
          stationFilterData = _.filter(filteredData, { type: 'station' });
        } else {
          _.map(stationCategories, (category, index) => {
            _.map(filteredData, (item, index) => item.category === category && stationFilterData.push(item));
          });
        }
      }
      if (isMemorySelected) {
        memoryFilterData = _.filter(filteredData, { type: 'memory' });
      }
    }

    if (
      (eventCategories.length > 0 && isEventSelected) ||
      eventFilterData.length > 0 ||
      (stationCategories.length > 0 && isStationSelected) ||
      stationFilterData.length > 0 ||
      memoryFilterData.length > 0
    ) {
      finalArray = [...eventFilterData, ...stationFilterData, ...memoryFilterData];
    } else {
      finalArray = filteredData;
    }

    if (timeOptions.length > 0 && finalArray !== undefined) {
      let timeFilterData = [];
      _.map(timeOptions, (timeSelection, index) => {
        _.map(finalArray, (item, index) => {
          let now = moment().format('YYYY-MM-DD HH:mm:ss');
          let startDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
          let endDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
          let weekStart = moment()
            .startOf('isoweek')
            .format('YYYY-MM-DD HH:mm:ss');
          let weekEnd = moment()
            .endOf('isoweek')
            .format('YYYY-MM-DD HH:mm:ss');
          let tomorrow = moment()
            .add(1, 'days')
            .format('YYYY-MM-DD');

          // if (timeSelection === 'Past' && now > startDate) {
          //   if (_.filter(timeFilterData, { id: item.id }).length === 0)
          //     timeFilterData.push(item);
          // }
          if (timeSelection === 'Tomorrow' && moment(item.sDate).format('YYYY-MM-DD') === tomorrow) {
            if (_.filter(timeFilterData, { id: item.id }).length === 0) timeFilterData.push(item);
          } else if (timeSelection === 'Present' && now > startDate && now < endDate) {
            if (_.filter(timeFilterData, { id: item.id }).length === 0) timeFilterData.push(item);
          } else if (timeSelection === 'This Week' && startDate > weekStart && startDate < weekEnd) {
            if (_.filter(timeFilterData, { id: item.id }).length === 0) timeFilterData.push(item);
          } else if (timeSelection === 'Today' && moment(now).isSame(startDate, 'day')) {
            if (_.filter(timeFilterData, { id: item.id }).length === 0) timeFilterData.push(item);
          }
        });
      });
      if (timeFilterData.length > 0) {
        finalArray = timeFilterData;
      }
    }
    return finalArray;
  };
  onEventCategoryChange(category) {
    const { eventCategories } = this.state;
    let newEventCategories = [];

    if (eventCategories.includes(category)) {
      newEventCategories = _.filter(eventCategories, v => v !== category);
    } else {
      newEventCategories = _.concat(eventCategories, category);
    }

    this.setState({
      eventCategories: newEventCategories,
    });
    this.filterdData();
  }
  onStationCategoryChange = category => {
    const { stationCategories } = this.state;
    let newStationCategories = [];

    if (stationCategories.includes(category)) {
      newStationCategories = _.filter(stationCategories, v => v !== category);
    } else {
      newStationCategories = _.concat(stationCategories, category);
    }

    this.setState({ stationCategories: newStationCategories });
    this.filterdData();
  };

  onTimeOptionChange = time => {
    const { timeOptions } = this.state;
    let newTimeOptions = [];

    if (timeOptions.includes(time)) {
      newTimeOptions = _.filter(timeOptions, v => v !== time);
    } else {
      newTimeOptions = _.concat(timeOptions, time);
    }

    this.setState({ timeOptions: newTimeOptions });
    this.filterdData();
  };

  /*** Memory selected **/
  toggleMemorySelected = () => {
    this.setState(prevState => ({ isMemorySelected: !prevState.isMemorySelected }));
  };

  /*** Event selected **/
  toggleEventSelected = () => {
    this.setState(prevState => ({ isEventSelected: !prevState.isEventSelected }));
  };

  /*** Station selected **/
  toggleStationSelected = () => {
    this.setState(prevState => ({ isStationSelected: !prevState.isStationSelected }));
  };

  resetFilter() {
    this.setState({
      searchTitle: '',
      timeOptions: [],
      eventCategories: [],
      stationCategories: [],
      isEventSelected: false,
      isMemorySelected: false,
      isStationSelected: false,
      isReset: false,
      isFilterPopupVisible: false,
    });
  }
  render() {
    const {
      mapMode,
      isEventPopupVisible,
      isFilterPopupVisible,
      currentLocation,
      selectedMarkerData,
      isLoading,
      isMarkerPress,
      inGeofence,
      timeOptions,
      eventCategories,
      stationCategories,
      isEventSelected,
      isMemorySelected,
      isStationSelected,
      isReset,
      searchTitle,
      isAlertPin,
      isVisibleLocation,
    } = this.state;
    const { markers } = this.props.explore;
    // let loc = [];
    // let coord = [];
    let polygonCoordinate = [];
    let exploreData =
      selectedMarkerData !== null
        ? selectedMarkerData.type === 'event'
          ? this.props.event_data
          : selectedMarkerData.type === 'station'
          ? this.props.station_data
          : selectedMarkerData.type === 'alert'
          ? this.props.alert_data
          : this.props.memory_data
        : [];
    if (isMarkerPress && exploreData && exploreData.length > 0) {
      exploreData[0].fenceJson.coordinates[0].map((item, index) => {
        let obj = { latitude: item[1], longitude: item[0] };
        polygonCoordinate.push(obj);
        // loc.push([item[1], item[0]]);
      });
      // coord.push(loc);
      // var newShapePolygon = polygon(coord);
      // var scaledPoly = transformScale(newShapePolygon, 2);
      // var buffered = scaledPoly['geometry'];
      // polygonCoordinate = buffered.coordinates[0].map(item => ({
      //   latitude: item[0],
      //   longitude: item[1],
      // }));
    }
    let locationPin = [];
    markers.map((item, index) => {
      const markerData = getValueFromObjectWithoutKey(item);
      let obj = {
        id: markerData.parentID,
        parentID: markerData.parentID,
        childID: markerData.childID,
        location: {
          latitude: markerData.lat,
          longitude: markerData.lng,
        },
        title: markerData.title,
        iUrl: markerData.iUrl,
        type: markerData.type,
        category: markerData.category,
        startdate: markerData.startdate,
        enddate: markerData.enddate,
        sDate: markerData.sDate,
        eDate: markerData.eDate,
        rsvp_user: markerData.rsvp_user,
        index: index,
      };
      locationPin.push(obj);
    });
    let filterData = this.filterdData(locationPin);
    if (isAlertPin) {
      locationPin = locationPin.filter(item => item.type === 'alert');
    } else {
      locationPin = locationPin.filter(item => item.type !== 'alert');
    }
    return (
      <StyledContainer>
        {isLoading ? (
          <Loading />
        ) : currentLocation.latitude === undefined || currentLocation.longitude === undefined ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={styles.norequestText}>
              {'Allow Tellascape location permission to use feature of app. \n \n'}
              {'Step 1: Settings > Location > Turn on the location permission. \n\n'}
              {'Step 2: Restart the app .'}
            </Text>
          </View>
        ) : (
          <>
            {Platform.OS === 'android' ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                mapType={mapMode}
                ref={ref => (this.mapView = ref)}
                showsMyLocationButton={false}
                showsUserLocation={true}
                initialRegion={{
                  latitude: currentLocation !== undefined ? currentLocation.latitude : '',
                  longitude: currentLocation !== undefined ? currentLocation.longitude : '',
                  latitudeDelta: 12,
                  longitudeDelta: 12,
                }}
              >
                {(selectedMarkerData === null ? filterData : [selectedMarkerData]).map((item, index) => {
                  return this.renderMarker(item);
                })}
              </MapView>
            ) : (
              <ClusteredMapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                data={selectedMarkerData === null ? filterData : [selectedMarkerData]}
                renderMarker={this.renderMarker}
                renderCluster={this.renderCluster}
                showsUserLocation={true}
                animateClusters={false}
                showsMyLocationButton={false}
                mapType={mapMode}
                ref={ref => (this.mapView = ref)}
                initialRegion={{
                  latitude: currentLocation !== undefined ? currentLocation.latitude : '',
                  longitude: currentLocation !== undefined ? currentLocation.longitude : '',
                  latitudeDelta: 12,
                  longitudeDelta: 12,
                }}
              >
                {isMarkerPress && exploreData && exploreData.length > 0 && (
                  <Geojson
                    geojson={{
                      type: 'FeatureCollection',
                      features: [
                        {
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'Polygon',
                            coordinates: exploreData[0].fenceJson.coordinates,
                          },
                        },
                      ],
                    }}
                    strokeColor={
                      selectedMarkerData.type === 'event'
                        ? theme.orange.text
                        : selectedMarkerData.type === 'station'
                        ? theme.blue.text
                        : selectedMarkerData.type === 'alert'
                        ? theme.tellasafe.text
                        : theme.cyan.text
                    }
                    fillColor="#8a8a8a5c"
                    strokeWidth={2}
                  />
                )}
              </ClusteredMapView>
            )}

            <View style={{ position: 'absolute', left: 0, right: 0 }}>
              {isEventPopupVisible && <DownButton onPress={this.onDismissEventPopup} />}
              <View style={{ position: 'absolute', left: DEVICE_WIDTH - 48, top: isEventPopupVisible ? 64 : 120 }}>
                {!isEventPopupVisible && (
                  <CircleButton
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      backgroundColor: isAlertPin ? theme.tellasafe.text : 'rgba(0,0,0,0.3)',
                    }}
                    iconName={'Map-Button_16x16px'}
                    onPress={this.onAlertPress}
                  />
                )}
                <CircleButton iconName={'earth-filled'} onPress={this.onChangeMapMode} />
                <CircleButton
                  iconName={'my_location-24px'}
                  onPress={isEventPopupVisible ? this.onDismissEventPopup : () => this.onFocusMap(currentLocationDelta)}
                />
              </View>
              {!isEventPopupVisible && (
                <FilterInput
                  onPress={this.onShowFilterPopup}
                  onChangeText={text => {
                    this.setState({ searchTitle: text });
                  }}
                  value={searchTitle}
                  isFilter={searchTitle.length > 0 ? true : false}
                  filterData={filterData !== undefined && filterData !== null ? filterData : []}
                  onPressClose={() => {
                    this.setState({ searchTitle: '' });
                    Keyboard.dismiss();
                  }}
                  onPressSearchItem={item => {
                    this.setState({ searchTitle: '' });
                    Keyboard.dismiss();
                    let selectedItem = {
                      ...item,
                      navigation: this.props.navigation,
                    };
                    this.onSelectMarker(selectedItem);
                  }}
                />
              )}
            </View>
            {isEventPopupVisible && selectedMarkerData && selectedMarkerData.type !== 'alert' && !isAlertPin ? (
              <EventPopup
                onDismissEventPopup={this.onDismissEventPopup}
                eventData={selectedMarkerData}
                navigation={this.props.navigation}
                inGeofence={inGeofence}
                style={[styles.eventPopup, { bottom: this.eventPopupBottom }]}
              />
            ) : null}

            {isFilterPopupVisible ? (
              <FilterPopup
                onClose={this.onDismissFilterPopup}
                style={[styles.filterPopup, { bottom: this.filterPopupBottom }]}
                currentLocation={currentLocation}
                timeOptions={timeOptions}
                onTimeOptionChange={time => this.onTimeOptionChange(time)}
                eventCategories={eventCategories}
                onEventCategoryChange={category => this.onEventCategoryChange(category)}
                stationCategories={stationCategories}
                onStationCategoryChange={category => this.onStationCategoryChange(category)}
                isEventSelected={isEventSelected}
                isMemorySelected={isMemorySelected}
                isStationSelected={isStationSelected}
                toggleMemorySelected={this.toggleMemorySelected}
                toggleEventSelected={this.toggleEventSelected}
                toggleStationSelected={this.toggleStationSelected}
                onResetPress={() => this.resetFilter()}
                navigation={this.props.navigation}
              />
            ) : null}

            {isEventPopupVisible && selectedMarkerData && selectedMarkerData.type === 'alert' ? (
              <AlertPopup
                onDismissEventPopup={this.onDismissEventPopup}
                eventData={selectedMarkerData}
                navigation={this.props.navigation}
                inGeofence={inGeofence}
                style={[styles.eventPopup, { bottom: this.eventPopupBottom }]}
              />
            ) : null}
            <LocationAccess visible={isVisibleLocation} onClose={() => this.setState({ isVisibleLocation: false })} />
          </>
        )}
      </StyledContainer>
    );
  }
}

const styles = StyleSheet.create({
  norequestText: {
    fontFamily: theme.font.MMedium,
    letterSpacing: 0.5,
    alignSelf: 'center',
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
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

  eventPopup: {
    position: 'absolute',
    bottom: 0,
  },
  filterPopup: {
    position: 'absolute',
    bottom: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

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

const mapStateToProps = state => {
  return {
    auth: state.auth,
    explore: state.explore,
    event_data: state.experience.event_data,
    experience: state.experience,
    station: state.station,
    station_data: state.station.station_data,
    memory: state.memory,
    memory_data: state.memory.memory_data,
    tellasafe: state.tellasafe,
    alert_data: state.tellasafe.alert_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetMarkers: obj => {
      dispatch(ExploreAction.getMarkersRequest(obj));
    },
    onGetPostEvent: obj => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    onGetStation: obj => {
      dispatch(StationActions.getStation(obj));
    },
    onGetMemory: obj => {
      dispatch(MemoryActions.getMemory(obj));
    },
    onGetAlert: obj => {
      dispatch(AlertActions.getAlert(obj));
    },
    setLocalSendAlert: obj => {
      dispatch(ExploreAction.setLocalSendAlert(obj));
    },
    onSendAlert: obj => {
      dispatch(AlertActions.sendAlert(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Explore));
