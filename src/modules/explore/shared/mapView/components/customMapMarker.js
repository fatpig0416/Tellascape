import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

// load theme
import theme from '../../../../core/theme';

import { SAFE } from '../../../../../utils/vals';

import styles from '../sharedStyles';

const CustomMapMarker = ({ pinItem, tracksViewChanges, onSelectMarker }) => {
  const { id, location, type, index, category } = pinItem;
  const alertPin = useMemo(() => {
    let _alertPin = theme.images.ALERT_PIN_ICON;

    if (category && type === 'alert') {
      let pinIndex = SAFE.DANGER_CATEGORIES.findIndex(item => item.label === category);
      if (pinIndex !== -1) {
        _alertPin = SAFE.DANGER_CATEGORIES[pinIndex].pin;
      }
    }

    return _alertPin;
  }, [category, type]);

  if (!location) {
    return null;
  }

  return (
    <Marker
      identifier={`pin-${id}`}
      coordinate={location}
      zIndex={index}
      tracksViewChanges={tracksViewChanges}
      onPress={() => onSelectMarker(index)}
    >
      <Image
        source={
          type === 'station'
            ? theme.images.STATION_PIN_ICON
            : type === 'memory'
            ? theme.images.MEMORY_PIN_ICON
            : type === 'alert'
            ? alertPin
            : theme.images.EVENT_PIN_ICON
        }
        style={styles.markerImage}
      />
      {/* <Image source={type === 'event' && theme.images.EVENT_PIN_ICON} resizeMode={'contain'} /> */}
      {/* <Image source={type === 'station' && theme.images.STATION_PIN_ICON} resizeMode={'contain'} /> */}
      {/* <Image source={type === 'memory' && theme.images.MEMORY_PIN_ICON} resizeMode={'contain'} /> */}
    </Marker>
  );
};

export default CustomMapMarker;
