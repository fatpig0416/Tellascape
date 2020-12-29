import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
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
  mapContainer: {
    flex: 1,
  },
  markerImage: {
    height: wp('10.5%'),
    resizeMode: 'contain',
    width: wp('9.5%'),
  },
});

export default styles;
