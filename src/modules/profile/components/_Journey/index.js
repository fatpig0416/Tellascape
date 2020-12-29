import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, View } from 'react-native';
import { MAP_TYPES } from 'react-native-maps';
// Import actions and reselectors
import { connect } from 'react-redux';
import ExperienceActions from '../../../experience/reducers/event';
import AlertActions from '../../../tellasafe/reducers';

// load theme
import theme from '../../../core/theme';

// Load utils
import { Loading } from '../../../../utils';
import { getUserCurrentLocation } from '../../../../utils/funcs';

// Import organisms
import Filter from '../organisms/Filter';
import EventPopup from '../organisms/EventPopup';
import AlertPopup from '../organisms/AlertPopup';

import BackButton from './components/backButton';
import MapControlButton from './components/mapControlButton';

import CoverLoading from './components/coverLoading';
import AndroidMapView from '../../../explore/shared/mapView/androidMapView';
import IOSMapView from '../../../explore/shared/mapView/iOSMapView';
import CustomGeoJson from '../../../explore/shared/mapView/components/customGeoJson';

import { EXPLORE } from '../../../../utils/vals';
import { MARGIN_TOP_FLOAT, MARGIN_LEFT_FLOAT } from './constants';

import styles from './sharedStyles';

const { REGION_DELTA } = EXPLORE;

const RegionDelta = {
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const Journey = ({ accessToken, experience, profileData, onGetAlert, navigation }) => {
  const slideUpValue = useRef(new Animated.Value(0));
  const mapView = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [mapMode, setMapMode] = useState(MAP_TYPES.STANDARD);
  const [selectedFilterOption, setSelectedFilterOption] = useState(null);
  const [filteredEventData, setFilteredEventData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSelectedMarker, setIsSelectedMarker] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null); // the index of filteredEventData array data
  const [isFetchingEvent, setIsFetchingEvent] = useState(false);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [isAlertPin, setIsAlertPin] = useState(false);
  const [isMapShow, setIsMapShow] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Get event data for filtering
  const getFilteredEventData = useCallback(
    (filterValue) => {
      const { data } = profileData;
      let _filteredEventData = [];

      if (Array.isArray(data) && data.length > 0) {
        _filteredEventData = data.filter((ele) => {
          const isLocationExisted = !!ele.lat && !!ele.lng;
          if (filterValue === null && isLocationExisted) {
            return true;
          }
          return ele.type === filterValue && isLocationExisted;
        });
      }
      return _filteredEventData;
    },
    [profileData]
  );

  const getCurrentLocation = useCallback(async () => {
    try {
      // Get the current position of the user
      const location = await getUserCurrentLocation();
      if (location) {
        setCurrentLocation({
          ...REGION_DELTA,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        setIsMapShow(true);
      }
    } catch (error) {}
    setIsLoading(false);
  }, []);

  const onSelectFilterOption = useCallback(
    (_selectedFilterOption) => {
      // get filter event data
      const _filteredEventData = getFilteredEventData(_selectedFilterOption);

      setSelectedFilterOption(_selectedFilterOption);
      setFilteredEventData(_filteredEventData);
      setSelectedEventIndex(null);
    },
    [getFilteredEventData]
  );

  const onSelectMarker = useCallback(
    (newSelectedEventIndex) => {
      const { journeyData } = experience;
      const event = journeyData.data[newSelectedEventIndex];

      // Go to the selected event marker
      const eventLocation = {
        //...REGION_DELTA,
        latitude: event.lat,
        longitude: event.lng,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      };

      let obj = {
        id: event.postID,
        index: 0,
        location: {
          latitude: event.lat,
          longitude: event.lng,
        },
        type: event.type,
      };
      setSelectedMarkerData(obj);
      onGoToSpecificLocation(eventLocation);

      // check the selected mark
      if (newSelectedEventIndex === selectedEventIndex) {
        return;
      }

      if (newSelectedEventIndex !== selectedEventIndex && selectedEventIndex !== null) {
        dismissEventPopup();
        setTimeout(() => {
          handleShowEventPopup(newSelectedEventIndex);
        }, 500);
      } else {
        handleShowEventPopup(newSelectedEventIndex);
      }
    },
    [dismissEventPopup, experience, handleShowEventPopup, onGoToSpecificLocation, selectedEventIndex]
  );

  /**
   * Show the event popup
   *
   */

  const showEventPopup = useCallback(() => {
    Animated.timing(slideUpValue.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShowEventPopup = useCallback(
    (_selectedEventIndex) => {
      const { journeyData } = experience;
      if (journeyData.data[_selectedEventIndex].type === 'alert') {
        setSelectedEventIndex(_selectedEventIndex);
        setIsFetchingEvent(true);

        const req = {
          token: accessToken,
          parentID: journeyData.data[_selectedEventIndex].postID,
          onSuccess: (res) => {
            setIsSelectedMarker(true);
            setIsFetchingEvent(false);
            showEventPopup();
          },
        };
        onGetAlert(req);
      } else {
        setSelectedEventIndex(_selectedEventIndex);
        setIsFetchingEvent(true);
        setIsSelectedMarker(true);

        setTimeout(() => {
          setIsFetchingEvent(false);
          showEventPopup();
        }, 4000);
      }
    },
    [accessToken, experience, onGetAlert, showEventPopup]
  );

  /**
   * Dismiss the event popup
   *
   */

  const dismissEventPopup = useCallback(() => {
    Animated.timing(slideUpValue.current, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismissEventPopup = useCallback(() => {
    setIsSelectedMarker(false);
    setSelectedEventIndex(null);
    setSelectedMarkerData(null);

    dismissEventPopup();
  }, [dismissEventPopup]);

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressAlertToggle = useCallback(() => {
    setIsAlertPin((_isAlertPin) => !_isAlertPin);
  }, []);

  const onChangeMapMode = useCallback(() => {
    setMapMode((_mapMode) => (_mapMode === MAP_TYPES.STANDARD ? MAP_TYPES.HYBRID : MAP_TYPES.STANDARD));
  }, []);

  const onGoToSpecificLocation = useCallback((location) => {
    if (mapView.current) {
      if (Platform.OS === 'android') {
        mapView.current.goToLocation(location);
      } else {
        mapView.current.getMapRef().animateToRegion(location);
      }
    }
  }, []);

  // set initial filterEventData
  useEffect(() => {
    getFilteredEventData(null);
  }, [getFilteredEventData]);

  useEffect(() => {
    if (profileData?.data?.length) {
      setCurrentLocation({
        ...REGION_DELTA,
        latitude: profileData.data[0].lat,
        longitude: profileData.data[0].lng,
      });
    } else {
      getCurrentLocation();
    }
  }, [profileData, getCurrentLocation]);

  // move to current location for android
  useEffect(() => {
    if (Platform.OS === 'android' && mapReady) {
      mapView?.current?.goToCurrentLocation(currentLocation);
    }
  }, [mapReady, currentLocation]);

  const locationPin = useMemo(() => {
    const { journeyData } = experience;
    let _locationPin = [];

    if (journeyData?.data?.length) {
      journeyData.data.map((item, index) => {
        const obj = {
          id: item.postID,
          index: index,
          location: {
            latitude: item.lat,
            longitude: item.lng,
          },
          type: item.type,
          category: item.category,
        };
        _locationPin.push(obj);
      });
    }

    if (isAlertPin) {
      _locationPin = _locationPin.filter((item) => item.type === 'alert');
    } else {
      if (selectedFilterOption !== null) {
        _locationPin = _locationPin.filter((item) => item.type === selectedFilterOption);
      } else {
        _locationPin = _locationPin.filter((item) => item.type !== 'alert');
      }
    }

    return _locationPin;
  }, [experience, isAlertPin, selectedFilterOption]);

  const mapData = useMemo(() => {
    if (selectedMarkerData === null) {
      return locationPin;
    }
    return [selectedMarkerData];
  }, [locationPin, selectedMarkerData]);

  const loc$coord$polygonCoordinate = useMemo(() => {
    let loc = [];
    let coord = [];
    let polygonCoordinate = [];
    if (
      isSelectedMarker &&
      experience.viewMedia &&
      experience.viewMedia.trending_media &&
      experience.viewMedia.trending_media.length > 0
    ) {
      experience.viewMedia.fenceJson.coordinates[0].map((item, index) => {
        let obj = { latitude: item[1], longitude: item[0] };
        polygonCoordinate.push(obj);
        loc.push([item[1], item[0]]);
      });
      coord.push(loc);
    }

    return { coord, loc, polygonCoordinate };
  }, [experience.viewMedia, isSelectedMarker]);

  if (isLoading && currentLocation === null) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isMapShow &&
        (Platform.OS === 'android' ? (
          <AndroidMapView
            ref={mapView}
            data={mapData}
            mapType={mapMode}
            onMapReady={setMapReady}
            onSelectMarker={onSelectMarker}
          >
            {isSelectedMarker && Boolean(experience?.viewMedia?.fenceJson) && (
              <CustomGeoJson
                geoCoordinate={experience?.viewMedia?.fenceJson?.coordinates}
                selectedMarkerDataType={selectedMarkerData?.type}
              />
            )}
          </AndroidMapView>
        ) : (
          <IOSMapView
            ref={mapView}
            data={mapData}
            mapMode={mapMode}
            initialRegion={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude, ...RegionDelta }}
            onSelectMarker={onSelectMarker}
          >
            {isSelectedMarker && Boolean(experience?.viewMedia?.fenceJson) && (
              <CustomGeoJson
                geoCoordinate={experience?.viewMedia?.fenceJson?.coordinates}
                selectedMarkerDataType={selectedMarkerData?.type}
              />
            )}
          </IOSMapView>
        ))}
      <View style={styles.buttonsContainer}>
        {!isSelectedMarker ? (
          <BackButton name={`@${profileData.profile.user_name}`} onPress={onGoBack} />
        ) : (
          <MapControlButton
            iconName={'expand_more-24px'}
            backgroundColor={'rgba(0,0,0,0.4)'}
            iconColor={'#ffffff'}
            marginTop={MARGIN_TOP_FLOAT}
            marginLeft={MARGIN_LEFT_FLOAT}
            onPress={handleDismissEventPopup}
          />
        )}

        <View style={styles.rightWrapper}>
          {!isSelectedMarker ? <Filter onSelect={onSelectFilterOption} selected={selectedFilterOption} /> : null}
          {!isSelectedMarker && (
            <MapControlButton
              backgroundColor={isAlertPin ? theme.tellasafe.text : 'white'}
              iconColor={isAlertPin ? 'white' : '#6c6c6c'}
              iconName={'Map-Button_16x16px'}
              marginTop={!isSelectedMarker && 8}
              onPress={onPressAlertToggle}
            />
          )}

          <MapControlButton onPress={onChangeMapMode} iconName={'earth-filled'} marginTop={!isSelectedMarker && 8} />
          <MapControlButton
            onPress={() => onGoToSpecificLocation(currentLocation)}
            iconName={'my_location-24px'}
            iconColor={'#c2c2c2'}
            marginTop={8}
          />
        </View>
      </View>

      {selectedEventIndex !== null && isSelectedMarker && selectedMarkerData && selectedMarkerData.type !== 'alert' && (
        <EventPopup
          onPressLine={handleDismissEventPopup}
          slideUpValue={slideUpValue.current}
          currentLocation={currentLocation}
          eventData={experience.journeyData.data[selectedEventIndex]}
          navigation={navigation}
        />
      )}

      {selectedEventIndex !== null && isSelectedMarker && selectedMarkerData && selectedMarkerData.type === 'alert' && (
        <AlertPopup
          onDismissEventPopup={handleDismissEventPopup}
          slideUpValue={slideUpValue.current}
          currentLocation={currentLocation}
          eventData={experience.journeyData.data[selectedEventIndex]}
          navigation={navigation}
        />
      )}

      {isFetchingEvent && <CoverLoading />}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.access_token,
    profileData: state.experience.profileData,
    uid: state.auth.uid,
    experience: state.experience,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetProfileData: (obj) => {
      dispatch(ExperienceActions.getProfileData(obj));
    },
    onGetAlert: (obj) => {
      dispatch(AlertActions.getAlert(obj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Journey);
