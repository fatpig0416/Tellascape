import React, { forwardRef, useRef } from 'react';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { PROVIDER_GOOGLE } from 'react-native-maps';

import CustomMapMarker from './components/customMapMarker';
import CustomMapCluster from './components/customMapCluster';

import { useCombinedRefs } from '../../../../utils/useCombinedRefs';

import styles from './sharedStyles';

const IOSMapView = forwardRef(({ data, mapMode, initialRegion, onSelectMarker, children }, ref) => {
  const mapView = useRef();
  const combinedRef = useCombinedRefs(ref, mapView);

  return (
    <ClusteredMapView
      ref={combinedRef}
      provider={PROVIDER_GOOGLE}
      style={styles.mapContainer}
      data={data}
      renderMarker={pinItem => (
        <CustomMapMarker pinItem={pinItem} key={pinItem.index} tracksViewChanges onSelectMarker={onSelectMarker} />
      )}
      renderCluster={(cluster, onPress) => <CustomMapCluster cluster={cluster} onPress={onPress} />}
      animateClusters={false}
      mapType={mapMode}
      initialRegion={initialRegion}
      showsUserLocation={true}
    >
      {children}
    </ClusteredMapView>
  );
});

export default IOSMapView;
