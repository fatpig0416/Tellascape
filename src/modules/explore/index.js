/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, Text, Alert, Keyboard, Platform } from 'react-native';
import * as geolib from 'geolib';
import _ from 'lodash';
import moment from 'moment';
import { MAP_TYPES } from 'react-native-maps';
import { connect } from 'react-redux';
import ExploreAction from '../home/reducers/index';
import ExperienceActions from '../experience/reducers/event/index';
import StationActions from '../experience/reducers/station';
import MemoryActions from '../experience/reducers/memory';
import AlertActions from '../tellasafe/reducers';
import { withNavigationFocus } from 'react-navigation'; // watch if this screen is focused
// Load components
import FilterInput from './components/FilterInput';
import EventPopup from './components/EventPopup';
import FilterPopup from './components/FilterPopup';
import AlertPopup from './components/AlertPopup';
import CircleButton from './components/CircleButton';
import DownButton from './components/DownButton';
import LocationAccess from '../home/components/organisms/LocationAccess';

import AndroidMapView from './shared/mapView/androidMapView';
import IOSMapView from './shared/mapView/iOSMapView';
import CustomGeoJson from './shared/mapView/components/customGeoJson';

// Load theme
import theme from '../core/theme';
// Load Temp Values && funcs && custom icons
import { Loading } from '../../utils';
import { getUserCurrentLocation, getValueFromObjectWithoutKey } from '../../utils/funcs';
import { EXPLORE } from '../../utils/vals';

import styles from './styles';

const { dimensions } = theme;

const { INTIAL_REGION, REGION_DELTA } = EXPLORE;

const RegionDelta = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const currentLocationDelta = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

const Explore = ({
  accessToken,
  explore,
  onGetMarkers,
  onGetPostEvent,
  onGetStation,
  onGetAlert,
  onGetMemory,
  isFocused,
  event_data,
  station_data,
  alert_data,
  memory_data,
  navigation,
}) => {
  const mapView = useRef(null);
  const eventPopupBottom = useRef(new Animated.Value(-220));
  const filterPopupBottom = useRef(new Animated.Value(60 - dimensions.height));

  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState(MAP_TYPES.STANDARD);
  const [isEventPopupVisible, setIsEventPopupVisible] = useState(false);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ ...INTIAL_REGION, ...REGION_DELTA });
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [isMarkerPress, setIsMarkerPress] = useState(false);
  const [inGeoFence, setInGeoFence] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  // All use for filter //
  const [searchTitle, setSearchTitle] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [stationCategories, setStationCategories] = useState([]);
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [isMemorySelected, setIsMemorySelected] = useState(false);
  const [isStationSelected, setIsStationSelected] = useState(false);
  const [isAlertPin, setIsAlertPin] = useState(false);
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      // Get the current position of the user
      const location = await getUserCurrentLocation();
      if (location) {
        setCurrentLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          ...RegionDelta,
        });
      }
    } catch (error) {}

    setIsLoading(false);
  }, []);

  const checkUserInGeoFence = useCallback(async (response) => {
    const location = await getUserCurrentLocation();
    const polygonCoordinate = [];
    response[0].fenceBuffer.coordinates[0].map((item) => {
      const obj = { latitude: item[1], longitude: item[0] };
      polygonCoordinate.push(obj);
    });

    let point = {
      lat: location.latitude,
      lng: location.longitude,
    };
    try {
      if (geolib.isPointInPolygon(point, polygonCoordinate)) {
        setInGeoFence(true);
      } else {
        setInGeoFence(false);
      }
    } catch (e) {
      Alert.alert(`unable to get location: ${JSON.stringify(e)}`);
    }
  }, []);

  // Select the Marker
  const onSelectMarker = useCallback(
    (newSelectedEventIndex) => {
      setInGeoFence(true);
      const experienceData = filteredData.filter(({ index }) => index === newSelectedEventIndex) || [];
      if (!experienceData.length) {
        return;
      }
      const { location, parentID, type } = experienceData[0];
      const req = {
        token: accessToken,
        parentID: parentID,
        onGetEventSuccess: (res) => {
          checkUserInGeoFence(res);
        },
        onSuccess: (res) => {
          checkUserInGeoFence(res);
        },
      };
      if (type === 'event') {
        onGetPostEvent(req);
      } else if (type === 'station') {
        onGetStation(req);
      } else if (type === 'alert') {
        onGetAlert(req);
      } else {
        onGetMemory(req);
      }

      setSelectedMarkerData(experienceData[0]);
      setIsMarkerPress(true);

      // Move to the selected marker
      onFocusMap(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        }
      );

      showEventPopup();
    },
    [
      accessToken,
      checkUserInGeoFence,
      filteredData,
      onFocusMap,
      onGetAlert,
      onGetMemory,
      onGetPostEvent,
      onGetStation,
      showEventPopup,
    ]
  );

  const showSpecificAlertPopup = useCallback(
    (routeData) => {
      const { parent_id } = routeData;
      const req = {
        token: accessToken,
        parentID: parent_id,
        onSuccess: (res) => {
          const { markers } = explore;
          setIsEventPopupVisible(true);
          setIsAlertPin(true);

          if (res?.length) {
            markers.map((item, index) => {
              const markerData = getValueFromObjectWithoutKey(item);
              const {
                category,
                childID,
                eDate,
                enddate,
                iUrl,
                lat,
                lng,
                parentID,
                rsvp_user,
                sDate,
                startdate,
                title,
                type,
              } = markerData;
              if (parentID === res[0].parentID) {
                const obj = {
                  id: parentID,
                  parentID,
                  childID,
                  location: {
                    latitude: lat,
                    longitude: lng,
                  },
                  title,
                  iUrl,
                  type,
                  category,
                  startdate,
                  enddate,
                  sDate,
                  eDate,
                  rsvp_user,
                  index,
                };
                setSelectedMarkerData(obj);
                setIsMarkerPress(true);
              }
            });

            let centerPoint = res[0].centerPoint;
            onFocusMap(
              {
                latitude: centerPoint.latitude,
                longitude: centerPoint.longitude,
              },
              {
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              }
            );
          }
        },
      };
      onGetAlert(req);
      navigation.setParams({ routeData: null });
    },
    [accessToken, explore, navigation, onFocusMap, onGetAlert]
  );

  // Show event popup
  const showEventPopup = useCallback(() => {
    setIsEventPopupVisible(true);

    Animated.timing(eventPopupBottom.current, {
      toValue: 0,
      duration: 1000,
    }).start();
  }, []);

  // Dismiss event popup
  const hideEventPopup = useCallback(() => {
    setIsEventPopupVisible(false);

    Animated.timing(eventPopupBottom.current, {
      toValue: -220,
      duration: 1000,
    }).start();
  }, []);

  // Show filter popup
  const showFilterPopup = useCallback(() => {
    Animated.timing(filterPopupBottom.current, {
      toValue: 0,
      duration: 1000,
    }).start();
  }, []);

  // Dismiss filter popup
  const hideFilterPopup = useCallback(() => {
    Animated.timing(filterPopupBottom.current, {
      toValue: 60 - dimensions.height,
      duration: 1000,
    }).start();
  }, []);

  /** Press filter icon button   */

  const onShowFilterPopup = useCallback(() => {
    setIsFilterPopupVisible(true);
    showFilterPopup();
  }, [showFilterPopup]);

  /** Dismiss the event popup  */

  const onDismissEventPopup = useCallback(async () => {
    const { state } = navigation;
    if (state?.params?.routeData) {
      showSpecificAlertPopup(state.params.routeData);
    } else {
      setIsEventPopupVisible(false);
      setIsMarkerPress(false);
      setSelectedMarkerData(null);
      // setIsAlertPin(false);
      hideEventPopup();
    }
  }, [hideEventPopup, showSpecificAlertPopup, navigation]);

  /*** Dismiss the filter popup  */

  const onDismissFilterPopup = useCallback(() => {
    setIsFilterPopupVisible(false);
    hideFilterPopup();
  }, [hideFilterPopup]);

  /*** Change the map mode   **/

  const onChangeMapMode = useCallback(() => {
    setMapMode((_mapMode) => (_mapMode === MAP_TYPES.STANDARD ? MAP_TYPES.HYBRID : MAP_TYPES.STANDARD));
  }, []);

  const onAlertPress = useCallback(() => {
    setIsAlertPin((_isAlertPin) => !_isAlertPin);
  }, []);

  /** * Press compass button  */

  const onFocusMap = useCallback((location, delta) => {
    if (mapView.current) {
      if (Platform.OS === 'android') {
        mapView.current.goToLocation(location);
      } else {
        mapView.current.getMapRef().animateToRegion({ ...location, ...delta });
      }
    }
  }, []);

  // const renderMarker = useCallback(
  //   pinItem => {
  //     const { id, parentID, childID, title, location, type, startdate, enddate, rsvp_user, category, index } = pinItem;
  //     let alertPin = theme.images.ALERT_PIN_ICON;

  //     if (location) {
  //       const markerDataForSelecting = {
  //         id,
  //         type,
  //         parentID,
  //         childID,
  //         location,
  //         currentLocation,
  //         startdate,
  //         enddate,
  //         title,
  //         rsvp_user,
  //         category,
  //         navigation,
  //       };
  //       if (category && type === 'alert') {
  //         let pinIndex = DANGER_CATEGORIES.findIndex(item => item.label === category);
  //         if (pinIndex !== -1) {
  //           alertPin = DANGER_CATEGORIES[pinIndex].pin;
  //         }
  //       }

  //       return (
  //         <Marker
  //           identifier={`pin-${id}`}
  //           key={id}
  //           coordinate={location}
  //           tracksViewChanges={Platform.OS === 'android' ? this.state.tracksViewChanges : true}
  //           onPress={() => onSelectMarker(markerDataForSelecting)}
  //           zIndex={index}
  //         >
  //           <Image
  //             source={
  //               type === 'station'
  //                 ? theme.images.STATION_PIN_ICON
  //                 : type === 'memory'
  //                 ? theme.images.MEMORY_PIN_ICON
  //                 : type === 'alert'
  //                 ? alertPin
  //                 : theme.images.EVENT_PIN_ICON
  //             }
  //             fadeDuration={0}
  //           />
  //         </Marker>
  //       );
  //     } else {
  //       return <View />;
  //     }
  //   },
  //   [currentLocation, onSelectMarker]
  // );

  const filterData = useCallback(
    (data) => {
      let _filteredData = data;
      let eventFilterData = [];
      let stationFilterData = [];
      let memoryFilterData = [];
      let finalArray = [];

      if (data?.length) {
        if (searchTitle.length) {
          _filteredData = data.filter((item) => {
            const itemData = (item.title || '').toUpperCase();
            const textData = searchTitle.toUpperCase();
            return itemData.includes(textData);
          });
        }
        if (isEventSelected) {
          if (!eventCategories.length) {
            eventFilterData = _.filter(_filteredData, { type: 'event' });
          } else {
            _.map(eventCategories, (category) => {
              _.map(_filteredData, (item) => item.category === category && eventFilterData.push(item));
            });
          }
        }
        if (isStationSelected) {
          if (!stationCategories.length) {
            stationFilterData = _.filter(_filteredData, { type: 'station' });
          } else {
            _.map(stationCategories, (category) => {
              _.map(_filteredData, (item) => item.category === category && stationFilterData.push(item));
            });
          }
        }
        if (isMemorySelected) {
          memoryFilterData = _.filter(_filteredData, { type: 'memory' });
        }
      }

      if (
        (eventCategories.length && isEventSelected) ||
        eventFilterData.length ||
        (stationCategories.length && isStationSelected) ||
        stationFilterData.length ||
        memoryFilterData.length
      ) {
        finalArray = [...eventFilterData, ...stationFilterData, ...memoryFilterData];
      } else {
        finalArray = _filteredData;
      }

      if (timeOptions.length > 0 && finalArray !== undefined) {
        let timeFilterData = [];
        _.map(timeOptions, (timeSelection) => {
          _.map(finalArray, (item) => {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            let startDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
            let endDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
            let weekStart = moment().startOf('isoweek').format('YYYY-MM-DD HH:mm:ss');
            let weekEnd = moment().endOf('isoweek').format('YYYY-MM-DD HH:mm:ss');
            let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

            // if (timeSelection === 'Past' && now > startDate) {
            //   if (_.filter(timeFilterData, { id: item.id }).length === 0)
            //     timeFilterData.push(item);
            // }
            if (timeSelection === 'Tomorrow' && moment(item.sDate).format('YYYY-MM-DD') === tomorrow) {
              if (_.filter(timeFilterData, { id: item.id }).length === 0) {
                timeFilterData.push(item);
              }
            } else if (timeSelection === 'Present' && now > startDate && now < endDate) {
              if (_.filter(timeFilterData, { id: item.id }).length === 0) {
                timeFilterData.push(item);
              }
            } else if (timeSelection === 'This Week' && startDate > weekStart && startDate < weekEnd) {
              if (_.filter(timeFilterData, { id: item.id }).length === 0) {
                timeFilterData.push(item);
              }
            } else if (timeSelection === 'Today' && moment(now).isSame(startDate, 'day')) {
              if (_.filter(timeFilterData, { id: item.id }).length === 0) {
                timeFilterData.push(item);
              }
            }
          });
        });
        if (timeFilterData.length) {
          finalArray = timeFilterData;
        }
      }
      return finalArray;
    },
    [eventCategories, isEventSelected, isMemorySelected, isStationSelected, searchTitle, stationCategories, timeOptions]
  );

  const onEventCategoryChange = useCallback((category) => {
    setEventCategories((_prevData) => {
      let newEventCategories = [];

      if (_prevData.includes(category)) {
        newEventCategories = _.filter(_prevData, (v) => v !== category);
      } else {
        newEventCategories = _.concat(_prevData, category);
      }

      return newEventCategories;
    });
  }, []);

  const onStationCategoryChange = useCallback((category) => {
    setStationCategories((_prevData) => {
      let newStationCategories = [];

      if (_prevData.includes(category)) {
        newStationCategories = _.filter(_prevData, (v) => v !== category);
      } else {
        newStationCategories = _.concat(_prevData, category);
      }

      return newStationCategories;
    });
  }, []);

  const onTimeOptionChange = useCallback((time) => {
    setTimeOptions((_prevData) => {
      let newTimeOptions = [];

      if (_prevData.includes(time)) {
        newTimeOptions = _.filter(_prevData, (v) => v !== time);
      } else {
        newTimeOptions = _.concat(_prevData, time);
      }
      return newTimeOptions;
    });
  }, []);

  /*** Memory selected **/
  const toggleMemorySelected = useCallback(() => {
    setIsMemorySelected((_prevData) => !_prevData);
  }, []);

  /*** Event selected **/
  const toggleEventSelected = useCallback(() => {
    setIsEventSelected((_prevData) => !_prevData);
  }, []);

  /*** Station selected **/
  const toggleStationSelected = useCallback(() => {
    setIsStationSelected((_prevData) => !_prevData);
  }, []);

  const resetFilter = useCallback(() => {
    setSearchTitle('');
    setTimeOptions([]);
    setEventCategories([]);
    setStationCategories([]);
    setIsEventSelected(false);
    setIsMemorySelected(false);
    setIsStationSelected(false);
    setIsFilterPopupVisible(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      onGetMarkers({ token: accessToken });
    }
  }, [accessToken, isFocused, onGetMarkers]);

  useEffect(() => {
    const { state } = navigation;
    if (state?.params?.routeData) {
      showSpecificAlertPopup(state.params.routeData);
    }
  }, [navigation, showSpecificAlertPopup]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    onFocusMap(currentLocation, RegionDelta);
  }, [currentLocation, onFocusMap]);

  useEffect(() => {
    const subs = [
      navigation.addListener('didFocus', async () => {
        const location = await getUserCurrentLocation();
        if (location?.code !== 'CANCELLED' && location?.code !== 'UNAVAILABLE' && !location) {
          setIsVisibleLocation(true);
        } else {
          setIsVisibleLocation(false);
        }
        onDismissEventPopup();
        getCurrentLocation();
      }),
    ];

    return () => {
      subs.forEach((sub) => sub.remove());
    };
  }, [onDismissEventPopup, getCurrentLocation, navigation]);

  useEffect(() => {
    if (Platform.OS === 'android' && mapReady) {
      mapView?.current?.goToCurrentLocation(currentLocation);
    }
  }, [mapReady, currentLocation]);

  const exploreData = useMemo(() => {
    if (!selectedMarkerData) {
      return [];
    }
    if (selectedMarkerData.type === 'event') {
      return event_data;
    }
    if (selectedMarkerData.type === 'station') {
      return station_data;
    }
    if (selectedMarkerData.type === 'alert') {
      return alert_data;
    }

    return memory_data;
  }, [alert_data, event_data, memory_data, selectedMarkerData, station_data]);

  const loc$coord$polygonCoordinate = useMemo(() => {
    const loc = [];
    const coord = [];
    const polygonCoordinate = [];
    if (isMarkerPress && Boolean(exploreData?.length)) {
      exploreData[0].fenceJson.coordinates[0].map((item) => {
        const obj = { latitude: item[1], longitude: item[0] };
        polygonCoordinate.push(obj);
        // loc.push([item[1], item[0]]);
      });
      // coord.push(loc);
      // const newShapePolygon = polygon(coord);
      // const scaledPoly = transformScale(newShapePolygon, 2);
      // const buffered = scaledPoly['geometry'];
      // polygonCoordinate = buffered.coordinates[0].map(item => ({
      //   latitude: item[0],
      //   longitude: item[1],
      // }));
    }

    return { loc, coord, polygonCoordinate };
  }, [exploreData, isMarkerPress]);

  const filteredData = useMemo(() => {
    let _locationPin = [];
    const { markers } = explore;
    markers.map((item, index) => {
      const markerData = getValueFromObjectWithoutKey(item);
      const {
        category,
        childID,
        eDate,
        enddate,
        lat,
        lng,
        parentID,
        rsvp_user,
        title,
        iUrl,
        sDate,
        startdate,
        type,
      } = markerData;

      const obj = {
        id: parentID,
        parentID,
        childID,
        location: {
          latitude: lat,
          longitude: lng,
        },
        title,
        iUrl,
        type,
        category,
        startdate,
        enddate,
        sDate,
        eDate,
        rsvp_user,
        index,
      };
      _locationPin.push(obj);
    });

    if (isAlertPin) {
      _locationPin = _locationPin.filter((item) => item.type === 'alert');
    } else {
      _locationPin = _locationPin.filter((item) => item.type !== 'alert');
    }

    const _filteredData = filterData(_locationPin);

    return _filteredData;
  }, [explore, filterData, isAlertPin]);

  const mapData = useMemo(() => {
    if (selectedMarkerData === null) {
      return filteredData;
    }

    return [selectedMarkerData];
  }, [filteredData, selectedMarkerData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  if (!currentLocation.latitude || !currentLocation.longitude) {
    return (
      <View style={styles.container}>
        <View style={styles.noLocationContainer}>
          <Text style={styles.noRequestText}>
            {'Allow Tellascape location permission to use feature of app. \n \n'}
            {'Step 1: Settings > Location > Turn on the location permission. \n\n'}
            {'Step 2: Restart the app .'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? (
        <AndroidMapView
          ref={mapView}
          data={mapData}
          mapType={mapMode}
          onMapReady={setMapReady}
          onSelectMarker={onSelectMarker}
        >
          {isMarkerPress && Boolean(exploreData?.length) && (
            <CustomGeoJson
              geoCoordinate={exploreData[0].fenceJson.coordinates}
              selectedMarkerDataType={selectedMarkerData?.type}
            />
          )}
        </AndroidMapView>
      ) : (
        <IOSMapView
          ref={mapView}
          data={mapData}
          mapMode={mapMode}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 12,
            longitudeDelta: 12,
          }}
          onSelectMarker={onSelectMarker}
        >
          {isMarkerPress && Boolean(exploreData?.length) && (
            <CustomGeoJson
              geoCoordinate={exploreData[0].fenceJson.coordinates}
              selectedMarkerDataType={selectedMarkerData?.type}
            />
          )}
        </IOSMapView>
      )}
      <View style={styles.buttonsContainer}>
        {isEventPopupVisible && <DownButton onPress={onDismissEventPopup} />}
        <View style={[styles.circleButtonsContainer, { top: isEventPopupVisible ? 64 : 120 }]}>
          {!isEventPopupVisible && (
            <CircleButton
              style={{
                backgroundColor: isAlertPin ? theme.tellasafe.text : 'rgba(0,0,0,0.3)',
              }}
              iconName="Map-Button_16x16px"
              onPress={onAlertPress}
            />
          )}
          <CircleButton iconName="earth-filled" onPress={onChangeMapMode} />
          <CircleButton
            iconName="my_location-24px"
            onPress={
              isEventPopupVisible ? onDismissEventPopup : () => onFocusMap(currentLocation, currentLocationDelta)
            }
          />
        </View>
        {!isEventPopupVisible && (
          <FilterInput
            onPress={onShowFilterPopup}
            onChangeText={setSearchTitle}
            value={searchTitle}
            isFilter={Boolean(searchTitle?.length)}
            filterData={filteredData}
            onPressClose={() => {
              setSearchTitle('');
              Keyboard.dismiss();
            }}
            onPressSearchItem={(index) => {
              setSearchTitle('');
              Keyboard.dismiss();
              onSelectMarker(index);
            }}
          />
        )}
      </View>
      {isEventPopupVisible && selectedMarkerData?.type !== 'alert' && !isAlertPin && (
        <EventPopup
          onDismissEventPopup={onDismissEventPopup}
          eventData={selectedMarkerData}
          navigation={navigation}
          inGeofence={inGeoFence}
          style={[styles.eventPopup, { bottom: eventPopupBottom.current }]}
        />
      )}

      {isFilterPopupVisible && (
        <FilterPopup
          onClose={onDismissFilterPopup}
          style={[styles.filterPopup, { bottom: filterPopupBottom.current }]}
          currentLocation={currentLocation}
          timeOptions={timeOptions}
          onTimeOptionChange={onTimeOptionChange}
          eventCategories={eventCategories}
          onEventCategoryChange={onEventCategoryChange}
          stationCategories={stationCategories}
          onStationCategoryChange={onStationCategoryChange}
          isEventSelected={isEventSelected}
          isMemorySelected={isMemorySelected}
          isStationSelected={isStationSelected}
          toggleMemorySelected={toggleMemorySelected}
          toggleEventSelected={toggleEventSelected}
          toggleStationSelected={toggleStationSelected}
          onResetPress={resetFilter}
          navigation={navigation}
        />
      )}

      {isEventPopupVisible && selectedMarkerData?.type === 'alert' && (
        <AlertPopup
          onDismissEventPopup={onDismissEventPopup}
          eventData={selectedMarkerData}
          navigation={navigation}
          inGeofence={inGeoFence}
          style={[styles.eventPopup, { bottom: eventPopupBottom.current }]}
        />
      )}
      <LocationAccess visible={isVisibleLocation} onClose={() => setIsVisibleLocation(false)} />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.access_token,
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

const mapDispatchToProps = (dispatch) => {
  return {
    onGetMarkers: (obj) => {
      dispatch(ExploreAction.getMarkersRequest(obj));
    },
    onGetPostEvent: (obj) => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
    onGetStation: (obj) => {
      dispatch(StationActions.getStation(obj));
    },
    onGetMemory: (obj) => {
      dispatch(MemoryActions.getMemory(obj));
    },
    onGetAlert: (obj) => {
      dispatch(AlertActions.getAlert(obj));
    },
    setLocalSendAlert: (obj) => {
      dispatch(ExploreAction.setLocalSendAlert(obj));
    },
    onSendAlert: (obj) => {
      dispatch(AlertActions.sendAlert(obj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Explore));
