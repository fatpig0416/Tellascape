import { Platform, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height, width } = Dimensions.get('window');
const dimensions = {
  height,
  width,
};

const PATH = '../../assets/images/';

export const iosFonts = {
  MBlack: 'Montserrat-Black',
  MBlackItalic: 'Montserrat-BlackItalic',
  MExtraLight: 'Montserrat-ExtraLight',
  MLight: 'Montserrat-Light',
  MMedium: 'Montserrat-Medium',
  MRegular: 'Montserrat-Regular',
  MExtraLightItalic: 'Montserrat-ExtraLightItalic',
  MItalic: 'Montserrat-Italic',
  MLightItalic: 'Montserrat-LightItalic',
  MMediumItalic: 'Montserrat-MediumItalic',
  MBold: 'Montserrat-Bold',
  MExtraBold: 'Montserrat-ExtraBold',
  MSemiBold: 'Montserrat-SemiBold',
  MBoldItalic: 'Montserrat-BoldItalic',
  MExtraBoldItalic: 'Montserrat-ExtraBoldItalic',
  MSemiBoldItalic: 'Montserrat-SemiBoldItalic',
  MThin: 'Montserrat-Thin',
  MThinItalic: 'Montserrat-ThinItalic',
};

export const androidFonts = {
  MBlack: 'Montserrat-Black',
  MBlackItalic: 'Montserrat-BlackItalic',
  MExtraLight: 'Montserrat-ExtraLight',
  MLight: 'Montserrat-Light',
  MMedium: 'Montserrat-Medium',
  MRegular: 'Montserrat-Regular',
  MExtraLightItalic: 'Montserrat-ExtraLightItalic',
  MItalic: 'Montserrat-Italic',
  MLightItalic: 'Montserrat-LightItalic',
  MMediumItalic: 'Montserrat-MediumItalic',
  MBold: 'Montserrat-Bold',
  MExtraBold: 'Montserrat-ExtraBold',
  MSemiBold: 'Montserrat-SemiBold',
  MBoldItalic: 'Montserrat-BoldItalic',
  MExtraBoldItalic: 'Montserrat-ExtraBoldItalic',
  MSemiBoldItalic: 'Montserrat-SemiBoldItalic',
  MThin: 'Montserrat-Thin',
  MThinItalic: 'Montserrat-ThinItalic',
};

const colors = {
  White: '#ffffff',
  DarkWhite: '#e8e8e8',
  Black: '#262626',
  LightBlack: '#333',
  LightBlackTwo: '#252526',
  LightBlackThree: '#202020',
  LightBlackFour: '#0F0F0F',
  VeryDarkGray: '#020202',
  Grey: '#888',
  WarmGrey: '#939393',
  PaleGrey: '#f7f8fa',
  LightGrey: '#919191',
  LightGreyTwo: '#D7D7D7',
  LightGreyThree: '#737373',
  LightGreyFour: '#444444',
  LightGreyFive: '#4D4D4D',
  BrownGrey: '#a8a8a8',
  LightGreySeven: '#5E5E5E',
  LightGreyEight: '#cacaca',
  DarkGrey: '#353535',
  ColdGray: '#434447',
  Red: '#ff0000',
  LightGreen: '#4BCE66',
  Orange: '#FFA06D',
  placeholderColor: '#ccc',
  shimmerbgColor: '#ddd',
  shimmerfgColor: '#eee',
  aquaColor: '#3EC0BE',
};

const gradients = {
  Background: ['#fe7f73', '#ffa06d'],
  BackgroundGreen: ['#45d8bf', '#3ab1be'],
  BackgroundDisable: ['grey', 'grey'],
  BackgroundLightGreen: ['#38e0cc', '#3ccfD1'],
  BackgroundBlue: ['rgba(110,205,249,0.93)', '#669AFD'],
  BackgroundRed: ['#ff6c6f', '#e14e55'],
  BackgroundMaroon: ['#FF6C6F', '#E14E55'],
  OrangeHeader: ['#fe7f7e', '#ffa06d'],
  BlueHeader: ['#5ebfef', '#75b9fa', '#87a7ff'],
  GreenHeader: ['#43cfb9', '#3bb4be'],
  RedHeader: ['#fe6b6f', '#f9666a'],
};

const images = {
  // Login
  LOGIN_BACKGROUND: require(`${PATH}login/login-background.png`),
  LOGIN_LOGO: require(`${PATH}login/login-logo.png`),
  LOGO: require(`${PATH}login/logo.png`),

  // Profile
  PROFILE: require(`${PATH}profile/avatar.png`),
  PROFILE_COVER: require(`${PATH}profile/profile-cover.png`),
  PROFILE_CARD_DEFAULT: require(`${PATH}profile/profile_card_default.png`),

  // Experience
  CLOCK: require(`${PATH}experience/clock.png`),
  LOCATION: require(`${PATH}experience/location.png`),
  DOT: require(`${PATH}experience/dot.png`),
  MAP: require(`${PATH}experience/map.png`),
  EVENT_ICON: require(`${PATH}experience/icon-event.png`),
  EVENT_WHITE_ICON: require(`${PATH}experience/icon-event-white.png`),
  MEMORY_ICON: require(`${PATH}experience/icon-memory.png`),
  MEMORY_WHITE_ICON: require(`${PATH}experience/icon-memory-white.png`),
  STATION_ICON: require(`${PATH}experience/icon-station.png`),
  STATION_WHITE_ICON: require(`${PATH}experience/icon-station-white.png`),
  CAMERA_MARKER: require(`${PATH}experience/Pin+Camera_small.png`),
  SELECTED_CAMERA_MARKER: require(`${PATH}experience/Pin+Camera_Sel.png`),
  JELLY_EVENT: require(`${PATH}experience/icon-jelly-event.png`),
  JELLY_MEMORY: require(`${PATH}experience/icon-jelly-memory.png`),
  JELLY_STATION: require(`${PATH}experience/icon-jelly-station.png`),
  JELLY_ALERT: require(`${PATH}experience/icon-jelly-alert.png`),
  MEDIA_ACTIVE: require(`${PATH}experience/icon-media-active.png`),
  MEDIA_EVENT_ACTIVE: require(`${PATH}experience/icon-event-active.png`),
  MEDIA_STATION_ACTIVE: require(`${PATH}experience/icon-station-active.png`),
  MEDIA_MEMORY_ACTIVE: require(`${PATH}experience/icon-memory-active.png`),
  MEDIA_INACTIVE: require(`${PATH}experience/icon-media-inactive.png`),
  INVITE_ICON: require(`${PATH}experience/icon-invite.png`),

  // Explore
  PLACEHOLDER: require(`${PATH}explore/placeholder.png`),

  // Home
  MARKER_EVENT: require(`${PATH}home/marker_event.png`),
  MARKER_MEMORY: require(`${PATH}home/marker_memory.png`),
  MARKER_STATION: require(`${PATH}home/marker_station.png`),
  MARKER_CLUSTER: require(`${PATH}home/marker_cluster.png`),
  EVENT_PIN_ICON: require(`${PATH}home/icon_pin_event.png`),
  STATION_PIN_ICON: require(`${PATH}home/icon_pin_station.png`),
  MEMORY_PIN_ICON: require(`${PATH}home/icon_pin_memory.png`),
  ALERT_PIN_ICON: require(`${PATH}home/icon_pin_alert.png`),
  WEATHER_PIN_ICON: require(`${PATH}home/icon_pin_weather.png`),
  WEAPON_PIN_ICON: require(`${PATH}home/icon_pin_weapon.png`),
  ROAD_PIN_ICON: require(`${PATH}home/icon_pin_road.png`),
  ANIMAL_PIN_ICON: require(`${PATH}home/icon_pin_animal.png`),
  COVID_PIN_ICON: require(`${PATH}home/icon_pin_covid.png`),

  // Categories (Event)
  FAMILY: require(`${PATH}experience/ca-family.png`),
  POLITICAL: require(`${PATH}experience/ca-political.png`),
  BUSINESS: require(`${PATH}experience/ca-business.png`),
  CELEBRATIONS: require(`${PATH}experience/ca-celebrations.png`),
  CHARITY: require(`${PATH}experience/ca-charity.png`),
  ACADEMIC: require(`${PATH}experience/ca-academic.png`),
  ENTERTAINMENT: require(`${PATH}experience/ca-entertainment.png`),
  OUTDOOR: require(`${PATH}experience/ca-outdoor.png`),

  // Categories (Station)
  CA_STATION_ENTERTAINMENT: require(`${PATH}experience/ca-station-entertainment.png`),
  CA_STATION_FOOD: require(`${PATH}experience/ca-station-food.png`),
  CA_STATION_LANDMARK: require(`${PATH}experience/ca-station-landmark.png`),
  CA_STATION_OUTDOOR: require(`${PATH}experience/ca-station-outdoor.png`),
  CA_STATION_HUNTED: require(`${PATH}experience/ca-station-hunted.png`),
  CA_STATION_ABANDONED: require(`${PATH}experience/ca-station-abandoned.png`),

  // Categories (Memory)
  CA_MEMORY_ACADEMIC: require(`${PATH}experience/ca-memory-academic.png`),
  CA_MEMORY_BUSINESS: require(`${PATH}experience/ca-memory-business.png`),
  CA_MEMORY_CELEBRATIONS: require(`${PATH}experience/ca-memory-celebrations.png`),
  CA_MEMORY_CHARITY: require(`${PATH}experience/ca-memory-charity.png`),
  CA_MEMORY_ENTERTAINMENT: require(`${PATH}experience/ca-memory-entertainment.png`),
  CA_MEMORY_FAMILY: require(`${PATH}experience/ca-memory-family.png`),
  CA_MEMORY_OUTDOOR: require(`${PATH}experience/ca-memory-outdoor.png`),
  CA_MEMORY_POLITICAL: require(`${PATH}experience/ca-memory-political.png`),

  // Safe
  ALERT_BACKGROUND: require(`${PATH}safe/alerts-background.png`),
  DANGER: require(`${PATH}safe/danger.png`),
  SAFE: require(`${PATH}safe/safe.png`),

  CA_SAFE_ANIMALS: require(`${PATH}safe/animals.png`),
  CA_SAFE_COVID_19: require(`${PATH}safe/covid-19.png`),
  CA_SAFE_GENERAL: require(`${PATH}safe/general.png`),
  CA_SAFE_ROAD: require(`${PATH}safe/road.png`),
  CA_SAFE_WEAPON: require(`${PATH}safe/weapon.png`),
  CA_SAFE_WEATHER: require(`${PATH}safe/weather.png`),

  // Onboarding
  EXPERIENCE_TYPES: require(`${PATH}onboarding/experience-types.png`),
  WELCOME_IMAGE: require(`${PATH}onboarding/welcome-image.png`),
  ONBOARDING_BACKGROUND: require(`${PATH}onboarding/onboarding-bg.png`),
};

const sizes = {
  // global sizes
  containerPadding: wp('2.22%'),
  largePadding: 20,
  normalPadding: 12,
  smallPadding: 8,
  xsmallPadding: 4,
  xxsmallPadding: 2,

  // font sizes
  smallFontSize: hp('1.40625%'),
  middleFontSize: hp('1.5625%'),
  normalFontSize: hp('1.71%'),
  middleLargeFontSize: hp('1.875%'),
  largeFontSize: hp('2.5%'),

  // icon sizes
  xsmallIconSize: 12,
  smallIconSize: 16,
  normalIconSize: 24,
  largeIconSize: 32,
  xlargeIconSize: 36,
};

const icons = {
  ARROW_LEFT: 'keyboard_arrow_left-24px',
};

// orange theme
const orange = {
  graident: gradients.Background,
  icon: '#ff9076',
  text: '#ffa06d',
};

// Red theme
const blue = {
  graident: gradients.BackgroundBlue,
  icon: '#65a8fb',
  text: '#65a8fb',
};

// Cyan theme
const cyan = {
  graident: gradients.BackgroundGreen,
  icon: '#43cfb9',
  text: '#43cfb9',
};

// Tellasafe theme
const tellasafe = {
  graident: gradients.BackgroundMaroon,
  icon: '#FF6C6F',
  text: '#FF6C6F',
};

export default {
  dimensions,
  colors,
  images,
  gradients,
  font: Platform.OS === 'ios' ? iosFonts : androidFonts,
  sizes,
  icons,

  // themes for LiveEvent, LiveStation
  orange,
  blue,
  cyan,
  tellasafe,
  PATH,
};
