import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

export default prop => {
  var markers = [
    {
      latitude: 37.785834,
      longitude: -122.406417,
      title: 'Foo Place',
      subtitle: '1234 Foo Drive',
    },
  ];
  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <MapView.Marker
          coordinate={{ latitude: 37.785834, longitude: -122.406417 }}
          title={'title'}
          description={'description'}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
