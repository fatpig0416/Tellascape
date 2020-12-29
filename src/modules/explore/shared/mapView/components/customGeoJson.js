import React from 'react';
import { Geojson } from 'react-native-maps';

// load theme
import theme from '../../../../core/theme';

const CustomGeoJson = ({ geoCoordinate, selectedMarkerDataType }) => {
  return (
    <Geojson
      geojson={{
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: geoCoordinate,
            },
          },
        ],
      }}
      strokeColor={
        selectedMarkerDataType === 'event'
          ? theme.orange.text
          : selectedMarkerDataType === 'station'
          ? theme.blue.text
          : theme.cyan.text
      }
      fillColor="#8a8a8a5c"
      strokeWidth={2}
    />
  );
};

export default CustomGeoJson;
