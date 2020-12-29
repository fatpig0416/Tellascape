// Load theme
import theme from '../modules/core/theme';
const { images } = theme;

const EXPLORE = {
  EVENT_DATA: [
    {
      id: 0,
      title: 'Tidewater College',
      type: 'event',
      likes: 156,
      comments: 28,
      coordinate: { latitude: 37.8025259, longitude: -122.4351431 },
      media: [
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
      ],
    },
    {
      id: 1,
      title: 'Tidewater College',
      type: 'station',
      likes: 156,
      comments: 28,
      coordinate: { latitude: 37.7946386, longitude: -122.421646 },
      media: [
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
      ],
    },
    {
      id: 2,
      title: 'Tidewater College',
      type: 'event',
      likes: 156,
      comments: 28,
      coordinate: { latitude: 37.8025259, longitude: -122.4351431 },
      media: [
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
      ],
    },
    {
      id: 3,
      title: 'Tidewater College',
      type: 'memory',
      likes: 156,
      comments: 28,
      coordinate: { latitude: 37.7834153, longitude: -122.4527787 },
      media: [
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
      ],
    },
    {
      id: 4,
      title: 'Tidewater College',
      type: 'memory',
      likes: 156,
      comments: 28,
      coordinate: { latitude: 37.7948105, longitude: -122.4596065 },
      media: [
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
        {
          url:
            'https://media.newyorker.com/photos/59096e8d1c7a8e33fb38e760/master/w_2560%2Cc_limit/Brody-The-Curse-of-The-Pixar-Universe.jpg',
        },
      ],
    },
  ],
  INTIAL_REGION: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
  REGION_DELTA: {
    latitudeDelta: 0.0043, // 0.0922,
    longitudeDelta: 0.0034, // 0421,
  },
  AMAZING_THINGS: [
    {
      imageUrl: 'https://avatarfiles.alphacoders.com/695/69544.jpg',
      title: 'Inside Out',
    },
    {
      imageUrl: 'https://avatarfiles.alphacoders.com/695/69544.jpg',
      title: 'Inside Out',
    },
    {
      imageUrl: 'https://avatarfiles.alphacoders.com/695/69544.jpg',
      title: 'Inside Out',
    },
    {
      imageUrl: 'https://avatarfiles.alphacoders.com/695/69544.jpg',
      title: 'Inside Out',
    },
    {
      imageUrl: 'https://avatarfiles.alphacoders.com/695/69544.jpg',
      title: 'Inside Out',
    },
  ],
  // TIME_OPTIONS: ['Past', 'Present', 'Future', 'This Week', 'Today', 'Tomorrow'],
  TIME_OPTIONS: ['Tomorrow', 'Present', 'This Week', 'Today'],

  EVENT_CATEGORIES: [
    'Family',
    'Political',
    'Business',
    'Celebrations',
    'Charity',
    'Academic',
    'Entertainment',
    'Outdoor',
  ],
  STATION_CATEGORIES: ['Food & Drink', 'Entertainment', 'Landmark', 'Outdoor', 'Haunted', 'Abandoned'],
};

const EXPERIENCE = {
  EVENT_CATEGORIES: [
    {
      icon: images.FAMILY,
      label: 'Family',
    },
    {
      icon: images.POLITICAL,
      label: 'Political',
    },
    {
      icon: images.BUSINESS,
      label: 'Business',
    },
    {
      icon: images.CELEBRATIONS,
      label: 'Celebrations',
    },
    {
      icon: images.CHARITY,
      label: 'Charity',
    },
    {
      icon: images.ACADEMIC,
      label: 'Academic',
    },
    {
      icon: images.ENTERTAINMENT,
      label: 'Entertainment',
    },
    {
      icon: images.OUTDOOR,
      label: 'Outdoor',
    },
  ],
  STATION_CATEGORIES: [
    {
      icon: images.CA_STATION_FOOD,
      label: 'Food & Drink',
    },
    {
      icon: images.CA_STATION_ENTERTAINMENT,
      label: 'Entertainment',
    },
    {
      icon: images.CA_STATION_LANDMARK,
      label: 'Landmark',
    },
    {
      icon: images.CA_STATION_OUTDOOR,
      label: 'Outdoor',
    },
    {
      icon: images.CA_STATION_HUNTED,
      label: 'Haunted',
    },
    {
      icon: images.CA_STATION_ABANDONED,
      label: 'Abandoned',
    },
  ],
  MEMORY_CATEGORIES: [
    {
      icon: images.CA_MEMORY_ACADEMIC,
      label: 'Academic',
    },
    {
      icon: images.CA_MEMORY_BUSINESS,
      label: 'Business',
    },
    {
      icon: images.CA_MEMORY_CELEBRATIONS,
      label: 'Celebrations',
    },
    {
      icon: images.CA_MEMORY_CHARITY,
      label: 'Charity',
    },
    {
      icon: images.CA_MEMORY_ENTERTAINMENT,
      label: 'Entertainment',
    },
    {
      icon: images.CA_MEMORY_FAMILY,
      label: 'Family',
    },
    {
      icon: images.CA_MEMORY_OUTDOOR,
      label: 'Outdoor',
    },
    {
      icon: images.CA_MEMORY_POLITICAL,
      label: 'Political',
    },
  ],
  MEDIA_FILTER_DATA: [
    { id: 0, label: 'TRENDING', value: 'trending' },
    { id: 1, label: 'MY EXPERIENCE', value: 'experience' },
    { id: 2, label: 'MY UPLOADS', value: 'uploads' },
  ],
};

const PROFILE = {
  FILTER_DATA: [
    {
      option: 'All',
      value: null,
    },
    {
      option: 'Events',
      value: 'event',
    },
    {
      option: 'Memories',
      value: 'memory',
    },
    {
      option: 'Stations',
      value: 'station',
    },
  ],
};

const SAFE = {
  DANGER_CATEGORIES: [
    {
      icon: images.CA_SAFE_GENERAL,
      label: 'General',
      pin: images.ALERT_PIN_ICON,
      pinIconName: 'icon_pin_alert',
    },
    {
      icon: images.CA_SAFE_WEATHER,
      label: 'Weather',
      pin: images.WEATHER_PIN_ICON,
      pinIconName: 'icon_pin_weather',
    },
    {
      icon: images.CA_SAFE_WEAPON,
      label: 'Weapon',
      pin: images.WEAPON_PIN_ICON,
      pinIconName: 'icon_pin_weapon',
    },
    {
      icon: images.CA_SAFE_ROAD,
      label: 'Road',
      pin: images.ROAD_PIN_ICON,
      pinIconName: 'icon_pin_road',
    },
    {
      icon: images.CA_SAFE_ANIMALS,
      label: 'Animals',
      pin: images.ANIMAL_PIN_ICON,
      pinIconName: 'icon_pin_animal',
    },
    {
      icon: images.CA_SAFE_COVID_19,
      label: 'COVID­­‑19',
      pin: images.COVID_PIN_ICON,
      pinIconName: 'icon_pin_covid',
    },
  ],
};
const DEFAULT_FOUNDER_ID = '5ee09fac2a83121fcb1d73e2';

export { EXPLORE, EXPERIENCE, PROFILE, SAFE, DEFAULT_FOUNDER_ID };
