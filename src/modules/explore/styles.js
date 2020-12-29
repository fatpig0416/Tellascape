import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import theme from '../core/theme';
// Load Constants from utils
import { DEVICE_WIDTH } from '../../utils';

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  circleButtonsContainer: {
    left: DEVICE_WIDTH - 48,
    position: 'absolute',
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
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#e8e8e8',
  },
  noLocationContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noRequestText: {
    fontFamily: theme.font.MMedium,
    letterSpacing: 0.5,
    alignSelf: 'center',
    marginLeft: 20,
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

export default styles;
