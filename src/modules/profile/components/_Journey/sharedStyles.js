import { StyleSheet } from 'react-native';

import { MARGIN_TOP_FLOAT, MARGIN_LEFT_FLOAT } from './constants';

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
  rightWrapper: {
    position: 'absolute',
    top: MARGIN_TOP_FLOAT,
    right: MARGIN_LEFT_FLOAT,
  },
});

export default styles;
