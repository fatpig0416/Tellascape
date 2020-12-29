import constModule from '../modules/core/Constants';
import { Dimensions } from 'react-native';
//export const constants = __DEV__ ? constModule.development : constModule.production;
export { default as Loading } from './loading';
export const constants = constModule.development;
export { default as api } from './api';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const MAP_CONTAINER_HEIGHT = 195;
export const IMAGE_FILTERS = [
  'Normal',
  'Amaro',
  'Brannan',
  'Earlybird',
  'Hefe',
  'Hudson',
  'Inkwell',
  'Lokofi',
  'LordKelvin',
  'Nashville',
  'Rise',
  'Sierra',
  'Sutro',
  'Toaster',
  'Valencia',
  'Walden',
  'Xproll',
];
