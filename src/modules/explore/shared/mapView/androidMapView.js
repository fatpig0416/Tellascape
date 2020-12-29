import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DeviceEventEmitter, findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import { MAP_TYPES } from 'react-native-maps';
import { isEqual } from 'lodash';

import { SAFE } from '../../../../utils/vals';
import styles from './sharedStyles';

const GMap = requireNativeComponent('GMap');

const AndroidMapView = forwardRef(({ data, mapType, onMapReady, onSelectMarker, children }, ref) => {
  const mapView = useRef();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapReady) {
      const mapTypes = { [MAP_TYPES.STANDARD]: 1, [MAP_TYPES.HYBRID]: 4 };
      // change map type
      UIManager.dispatchViewManagerCommand(findNodeHandle(mapView.current), 2, [mapTypes[mapType] || 0]);
    }
  }, [mapReady, mapType]);

  useImperativeHandle(
    ref,
    () => ({
      goToLocation(location) {
        // goto specific location
        UIManager.dispatchViewManagerCommand(findNodeHandle(mapView.current), 1, [
          location.latitude,
          location.longitude,
        ]);
      },
      goToCurrentLocation(location) {
        // show initial region
        UIManager.dispatchViewManagerCommand(findNodeHandle(mapView.current), 4, [
          location.latitude,
          location.longitude,
        ]);
      },
    }),
    []
  );

  const getMarkerIcon = useCallback((type, category) => {
    const getAlertPinIcon = () => {
      let _alertPin = 'icon_pin_alert';
      if (category && type === 'alert') {
        let pinIndex = SAFE.DANGER_CATEGORIES.findIndex((item) => item.label === category);
        if (pinIndex !== -1) {
          _alertPin = SAFE.DANGER_CATEGORIES[pinIndex].pinIconName;
        }
      }

      return _alertPin;
    };

    let markerIcon =
      type === 'station'
        ? 'icon_pin_station'
        : type === 'memory'
        ? 'icon_pin_memory'
        : type === 'alert'
        ? getAlertPinIcon()
        : 'icon_pin_event';

    return markerIcon;
  }, []);

  const displayMarkers = useCallback(
    (mapData) => {
      // refresh map data
      UIManager.dispatchViewManagerCommand(findNodeHandle(mapView.current), 3, null); // refresh map

      const _data = (mapData || []).filter(({ location }) => Boolean(location.latitude) && Boolean(location.longitude));

      _data.map((pinItem) => {
        // display map data
        UIManager.dispatchViewManagerCommand(findNodeHandle(mapView.current), 0, [
          `marker_${pinItem.index}`,
          pinItem.location.latitude,
          pinItem.location.longitude,
          getMarkerIcon(pinItem.type, pinItem.category), // icon name
          9.5, // icon dimension in percentage of screen width
          pinItem.index,
        ]);
      });
      setMapReady(true);
    },
    [getMarkerIcon]
  );

  const onMarkerPress = useCallback(
    (_data) => {
      let markerIndex = -1;
      data.forEach((datum) => {
        if (isEqual(datum.location, _data)) {
          markerIndex = datum.index;
        }
      });
      if (markerIndex > -1) {
        onSelectMarker(markerIndex);
      }
    },
    [data, onSelectMarker]
  );

  useEffect(() => {
    if (mapReady) {
      displayMarkers(data);
    }
  }, [data, mapReady, displayMarkers]);

  // attach listener to native module
  useEffect(() => {
    DeviceEventEmitter.addListener('onMapReady', () => {
      setMapReady(true);
      onMapReady(true);
    });
    DeviceEventEmitter.addListener('onMarkerPress', onMarkerPress);
  }, [onMarkerPress, onMapReady]);

  return (
    <GMap ref={mapView} style={styles.mapContainer}>
      {children}
    </GMap>
  );
});

export default AndroidMapView;
