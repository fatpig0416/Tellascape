import React from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import styles from '../sharedStyles';

const CustomMapCluster = ({ cluster, onPress }) => {
  const { clusterId, pointCount, coordinate } = cluster;

  return (
    <Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
      <View style={styles.clusterContainer}>
        <Text style={styles.clusterText}>{pointCount}</Text>
      </View>
    </Marker>
  );
};

export default CustomMapCluster;
