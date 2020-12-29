import React from 'react';
import styled from 'styled-components/native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Auth from '../modules/auth/components/Auth';
import AuthLoadingScreen from '../modules/auth/components/AuthLoadingScreen';
import AuthPhoneInputScreen from '../modules/auth/components/AuthPhoneInputScreen';
import AuthOTPScreen from '../modules/auth/components/AuthOTPScreen';
import ProfileScreen from '../modules/auth/components/ProfileScreen';
import WebviewScreen from '../modules/auth/components/WebviewScreen';
import CustomIcon from '../utils/icon/CustomIcon';
import theme from '../modules/core/theme';
import PlusButton from './PlusButton';
import UploadButton from './UploadButton';
import BadgeIcon from './BadgeIcon';

/* Home Page Components */
import Trending from '../modules/home/components/Trending';
import Myfeed from '../modules/home/components/Myfeed';
import Local from '../modules/home/components/Local';

/* Experience (Event) */
import Experience from '../modules/experience/components/Experience';
import CreateEvent from '../modules/experience/components/event/CreateEvent';
import EditEvent from '../modules/experience/components/event/EditEvent';
import ViewEvent from '../modules/experience/components/event/ViewEvent';
import MapView from '../modules/experience/components/organisms/Map';
import GuestList from '../modules/experience/components/event/GuestList';
import InviteFriend from '../modules/experience/components/event/InviteFriend';
import VerifyPin from '../modules/experience/components/event/VerifyPin';
import LiveEvent from '../modules/experience/components/event/LiveEvent';
import JoinEvent from '../modules/experience/components/event/JoinEvent';
import TakeImage from '../modules/experience/components/TakeImage';
import RecordVideo from '../modules/experience/components/RecordVideo';
import PostEvent from '../modules/experience/components/event/PostEvent';
import MapDisplay from '../modules/experience/components/event/MapDisplay';
import ImageFilter from '../modules/experience/components/ImageFilter';
import Categories from '../modules/experience/components/Categories';
import OtherUserExperience from '../modules/experience/components/event/OtherUserExperience';
import OpenChat from '../modules/experience/components/event/OpenChat';
import InviteGuestList from '../modules/experience/components/event/InviteGuestList';
import AddInvite from '../modules/experience/components/event/AddInvite';
import UpdateEvent from '../modules/experience/components/event/UpdateEvent';

/** Experience (Station) */
import CreateStation from '../modules/experience/components/station/CreateStation';
import EditStation from '../modules/experience/components/station/EditStation';
import LiveStation from '../modules/experience/components/station/LiveStation';
import JoinStation from '../modules/experience/components/station/JoinStation';
import PostStation from '../modules/experience/components/station/PostStation';

/** Experience (Memory) */
import PlanMemory from '../modules/experience/components/memory/PlanMemory';
import JoinMemory from '../modules/experience/components/memory/JoinMemory';
import PostMemory from '../modules/experience/components/memory/PostMemory';
import LiveMemory from '../modules/experience/components/memory/LiveMemory';
import UpdateMemory from '../modules/experience/components/memory/UpdateMemory';

/** Profile */
import ViewProfile from '../modules/profile/components/ViewProfile';
import Journey from '../modules/profile/components/_Journey';

import Header from './HeaderLogo';
import UserAvatar from './UserAvatar';
import { StyledText } from '../modules/core/common.styles';
import CustomHeader from './Header';
import EventMedia from '../modules/experience/components/event/EventMedia';
import ViewEventMedia from '../modules/experience/components/event/ViewEventMedia';

/* Explore Components */
// import Explore from '../modules/explore/components/Explore';
import Explore from '../modules/explore/';

/* Notification Components */
import Notification from '../modules/notification/components/Notification';

/* Chat Components*/
import Message from '../modules/message/components/Message';
import Chat from '../modules/message/components/Chat';
import EditProfile from '../modules/profile/components/EditProfile';

/** Safe Components */
import CreateSafe from '../modules/tellasafe/components/CreateSafe';
import AddContact from '../modules/tellasafe/components/AddContact';
import AddAlert from '../modules/tellasafe/components/AddAlert';
import SafeMap from '../modules/tellasafe/components/SafeMap';
import EditAlert from '../modules/tellasafe/components/EditAlert';

/** Onboarding Components */
import Welcome from '../modules/onboarding/components/Welcome';
import MagicPlusIntro from '../modules/onboarding/components/MagicPlusIntro';
import ExploreIntro from '../modules/onboarding/components/ExploreIntro';
import HomeIntro from '../modules/onboarding/components/HomeIntro';
import FeedbackIntro from '../modules/onboarding/components/FeedbackIntro';
import ExperienceTypeIntro from '../modules/onboarding/components/ExperienceTypeIntro';

const { colors, font } = theme;

var currentTab = 'HomeBottom';
var currentRouteName = '';

const StyledTopTabLable = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('3.88%')};
  color: ${props => props.color};
  font-family: ${font.MBold};
  letter-spacing: 0.3;
`;

const SafeStack = createStackNavigator(
  {
    CreateSafe: {
      screen: CreateSafe,
      path: 'createsafe',
    },
    AddContact: {
      screen: AddContact,
      path: 'addcontact',
    },
    AddAlert: {
      screen: AddAlert,
      path: 'addalert',
    },
    EditAlert: {
      screen: EditAlert,
      path: 'editalert',
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    SafeMap: {
      screen: SafeMap,
      path: 'safemap',
    },
  },
  {
    headerMode: 'none',
  }
);

const OnboardingMainStack = createStackNavigator(
  {
    MagicPlusIntro: {
      screen: MagicPlusIntro,
      path: 'magicplusintro',
    },
    ExploreIntro: {
      screen: ExploreIntro,
      path: 'exploreintro',
    },
    HomeIntro: {
      screen: HomeIntro,
      path: 'homeintro',
    },
    FeedbackIntro: {
      screen: FeedbackIntro,
      path: 'feedbackintro',
    },
  },
  {
    headerMode: 'none',
    // mode: 'modal',
    // initialRouteName: 'Welcome',
  }
);

const OnboardingStack = createStackNavigator(
  {
    OnboardingMain: {
      screen: OnboardingMainStack,
    },
    Welcome: {
      screen: Welcome,
      path: 'welcome',
    },
    ExperienceTypeIntro: {
      screen: ExperienceTypeIntro,
      path: 'experiencetypeintro',
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: 'OnboardingMain',
  }
);

const HomeTabs = createMaterialTopTabNavigator(
  {
    Trending: {
      screen: Trending,
      path: 'trending',
      navigationOptions: ({ navigation }) => ({
        title: 'Trending',
        headerBackTitle: null,
      }),
    },
    Myfeed: {
      screen: Myfeed,
      path: 'trending',
      navigationOptions: ({ navigation }) => ({
        title: 'My feed',
        headerBackTitle: null,
      }),
    },
    Local: {
      screen: Local,
      path: 'trending',
      navigationOptions: ({ navigation }) => ({
        title: 'Local',
        headerBackTitle: null,
      }),
    },
  },
  {
    initialRouteName: 'Trending',
    defaultNavigationOptions: ({ navigation }) => ({
      swipeEnabled: false,
      tabBarLabel: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let label = '';
        let activeColor = '#323643';
        let labelColor = '';
        switch (routeName) {
          case 'Trending':
            label = 'TRENDING';
            labelColor = focused ? activeColor : '#999BA1';
            break;
          case 'Myfeed':
            label = 'MY FEED';
            labelColor = focused ? activeColor : '#999BA1';
            break;
          case 'Local':
            label = 'LOCAL';
            labelColor = focused ? activeColor : '#999BA1';
            break;

          default:
            break;
        }
        // currentRouteName = navigation.state.routeName;
        return <StyledTopTabLable color={labelColor}>{label}</StyledTopTabLable>;
      },
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Myfeed') {
          if (navigation.state.params && navigation.state.params.scrollToTop) {
            navigation.state.params.scrollToTop();
          }
        } else if (routeName === 'Local') {
          if (navigation.state.params && navigation.state.params.scrollToTop) {
            navigation.state.params.scrollToTop();
          }
        } else if (routeName === 'Trending') {
          if (navigation.state.params && navigation.state.params.scrollToTop) {
            navigation.state.params.scrollToTop();
          }
        }
        defaultHandler();
      },
    }),
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
        color: '#999BA1',
      },
      style: {
        backgroundColor: colors.White,
        shadowColor: 'rgba(90,97,105)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 1,
        // borderTopColor: '#C2C2C2',
        // borderTopWidth: wp('0.1%'),
      },
      indicatorStyle: {
        width: wp('8.6%'),
        marginLeft: wp('11.6%'),
        borderBottomColor: '#45D8BF',
        borderBottomWidth: 3,
        backgroundColor: '#45D8BF',
        marginBottom: 10,
      },
    },
  }
);

const ExperienceStack = createStackNavigator(
  {
    CreateEvent: {
      screen: CreateEvent,
      path: 'createevent',
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      navigationOptions: {
        headerShown: true,
      },
    },
    EditEvent: {
      screen: EditEvent,
      path: 'editevent',
      navigationOptions: {
        header: null,
      },
    },
    Experience: {
      screen: Experience,
      path: 'experience',
      navigationOptions: {
        header: null,
      },
    },
    ViewProfile: {
      screen: ViewProfile,
      navigationOptions: {
        header: null,
      },
    },
    Journey: {
      screen: Journey,
      path: 'journey',
      navigationOptions: {
        header: null,
      },
    },
    InviteFriend: {
      screen: InviteFriend,
      path: 'home/:invitefriend',
      navigationOptions: {
        title: 'Invite Friend',
        header: null,
      },
    },
    InviteGuestList: {
      screen: InviteGuestList,
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    AddInvite: {
      screen: AddInvite,
      navigationOptions: {
        title: 'Add Invite',
        header: null,
      },
    },
    GuestList: {
      screen: GuestList,
      path: 'home/:guestlist',
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    OtherUserExperience: {
      screen: OtherUserExperience,
      path: 'home/:otheruserexperience',
      navigationOptions: {
        title: 'Other user experience',
        header: null,
      },
    },
    Map: {
      screen: MapView,
      path: 'home/:map',
      navigationOptions: {
        title: 'Map',
        header: null,
      },
    },
    ViewEvent: {
      screen: ViewEvent,
      path: 'viewevent',
      navigationOptions: {
        header: null,
      },
    },
    PostEvent: {
      screen: PostEvent,
      path: 'postevent',
      navigationOptions: {
        header: null,
      },
    },
    LiveEvent: {
      screen: LiveEvent,
      path: 'liveevent',
      navigationOptions: {
        header: null,
      },
    },
    JoinEvent: {
      screen: JoinEvent,
      path: 'joinevent',
      navigationOptions: {
        header: null,
      },
    },
    UpdateEvent: {
      screen: UpdateEvent,
      path: 'updateevent',
      navigationOptions: {
        header: null,
      },
    },
    OpenChat: {
      screen: OpenChat,
      path: 'openchat',
      navigationOptions: {
        header: null,
      },
    },
    MapDisplay: {
      screen: MapDisplay,
      path: 'mapdisplay',
      navigationOptions: {
        header: null,
      },
    },
    TakeImage: {
      screen: TakeImage,
      navigationOptions: {
        header: null,
      },
    },
    RecordVideo: {
      screen: RecordVideo,
      path: 'recordvideo',
      navigationOptions: {
        header: null,
      },
    },
    ViewMedia: {
      screen: EventMedia,
      path: 'viewmedia',
      navigationOptions: {
        header: null,
      },
    },
    ViewMediaEvent: {
      screen: ViewEventMedia,
      navigationOptions: {
        header: null,
      },
    },
    EditProfile: {
      screen: EditProfile,
      path: 'editprofile',
      navigationOptions: {
        header: null,
      },
    },
    CreateStation: {
      screen: CreateStation,
      path: 'createstation',
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    LiveStation: {
      screen: LiveStation,
      path: 'livestation',
      navigationOptions: {
        header: null,
      },
    },
    JoinStation: {
      screen: JoinStation,
      path: 'joinstation',
      navigationOptions: {
        header: null,
      },
    },
    PostStation: {
      screen: PostStation,
      path: 'poststation',
      navigationOptions: {
        header: null,
      },
    },
    EditStation: {
      screen: EditStation,
      path: 'editstation',
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    ImageFilter: {
      screen: ImageFilter,
      navigationOptions: {
        header: null,
      },
    },
    PlanMemory: {
      screen: PlanMemory,
      path: 'planmemory',
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    JoinMemory: {
      screen: JoinMemory,
      path: 'joinmemory',
      navigationOptions: {
        header: null,
      },
    },
    PostMemory: {
      screen: PostMemory,
      path: 'postmemory',
      navigationOptions: {
        header: null,
      },
    },
    LiveMemory: {
      screen: LiveMemory,
      path: 'livememory',
      navigationOptions: {
        header: null,
      },
    },
    UpdateMemory: {
      screen: UpdateMemory,
      path: 'updatememory',
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Experience',
    headerMode: 'none',
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      currentRouteName = navigation.state.routeName;
    },
    navigationOptions: ({ navigation }) => {
      const { routeName, params } = navigation.state.routes[navigation.state.index];
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          if (
            (currentTab === 'HomeBottom' || currentTab === 'ExperienceTab' || currentTab === 'ExploreTab') &&
            (currentRouteName === 'JoinEvent' ||
              currentRouteName === 'JoinStation' ||
              currentRouteName === 'JoinMemory')
          ) {
            return <UploadButton navigation={navigation} />;
          } else if (
            currentRouteName === 'CreateEvent' ||
            currentRouteName === 'EditEvent' ||
            currentRouteName === 'CreateStation' ||
            currentRouteName === 'EditStation' ||
            currentRouteName === 'Map' ||
            currentRouteName === 'PlanMemory' ||
            routeName === 'CreateEvent' ||
            routeName === 'EditEvent' ||
            routeName === 'Map'
          ) {
            return <PlusButton showClose={true} route={routeName} navigation={navigation} />;
          }
          return <PlusButton showClose={false} route={currentRouteName} navigation={navigation} />;
        },
        tabBarVisible: routeName !== 'TakeImage' && routeName !== 'RecordVideo',
      };
    },
  }
);

const NotificationStack = createStackNavigator(
  {
    Notification: {
      screen: Notification,
      path: 'notification',
    },
  },
  {
    headerMode: 'none',
  }
);

const ExploreStack = createStackNavigator(
  {
    Explore: {
      screen: Explore,
      path: 'explore',
      // navigationOptions: ({navigation}) => ({
      //   title: 'Explore',
      //   headerBackTitle: null,
      // }),
    },
    // CreateEvent: {
    //   screen: CreateEvent,
    //   path: 'createevent',
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
    EditEvent: {
      screen: EditEvent,
      path: 'editevent',
      navigationOptions: {
        header: null,
      },
    },
    ViewProfile: {
      screen: ViewProfile,
      navigationOptions: {
        header: null,
      },
    },
    Journey: {
      screen: Journey,
      path: 'journey',
      navigationOptions: {
        header: null,
      },
    },
    InviteFriend: {
      screen: InviteFriend,
      path: 'home/:invitefriend',
      navigationOptions: {
        title: 'Invite Friend',
        header: null,
      },
    },
    InviteGuestList: {
      screen: InviteGuestList,
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    AddInvite: {
      screen: AddInvite,
      navigationOptions: {
        title: 'Add Invite',
        header: null,
      },
    },
    GuestList: {
      screen: GuestList,
      path: 'home/:guestlist',
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    ImageFilter: {
      screen: ImageFilter,
      navigationOptions: {
        header: null,
      },
    },
    Map: {
      screen: MapView,
      path: 'home/:map',
      navigationOptions: {
        title: 'Map',
        header: null,
      },
    },
    ViewEvent: {
      screen: ViewEvent,
      path: 'viewevent',
      navigationOptions: {
        header: null,
      },
    },
    PostEvent: {
      screen: PostEvent,
      path: 'postevent',
      navigationOptions: {
        header: null,
      },
    },
    LiveEvent: {
      screen: LiveEvent,
      path: 'liveevent',
      navigationOptions: {
        header: null,
      },
    },
    JoinEvent: {
      screen: JoinEvent,
      path: 'joinevent',
      navigationOptions: {
        header: null,
      },
    },
    UpdateEvent: {
      screen: UpdateEvent,
      path: 'updateevent',
      navigationOptions: {
        header: null,
      },
    },
    OpenChat: {
      screen: OpenChat,
      path: 'openchat',
      navigationOptions: {
        header: null,
      },
    },
    VerifyPin: {
      screen: VerifyPin,
      navigationOptions: {
        header: null,
      },
    },
    MapDisplay: {
      screen: MapDisplay,
      path: 'mapdisplay',
      navigationOptions: {
        header: null,
      },
    },
    TakeImage: {
      screen: TakeImage,
      navigationOptions: {
        header: null,
      },
    },
    RecordVideo: {
      screen: RecordVideo,
      path: 'recordvideo',
      navigationOptions: {
        header: null,
      },
    },
    ViewMedia: {
      screen: EventMedia,
      path: 'viewmedia',
      navigationOptions: {
        header: null,
      },
    },
    ViewMediaEvent: {
      screen: ViewEventMedia,
      navigationOptions: {
        header: null,
      },
    },
    EditProfile: {
      screen: EditProfile,
      path: 'editprofile',
      navigationOptions: {
        header: null,
      },
    },
    JoinStation: {
      screen: JoinStation,
      path: 'joinstation',
      navigationOptions: {
        header: null,
      },
    },
    LiveStation: {
      screen: LiveStation,
      path: 'livestation',
      navigationOptions: {
        header: null,
      },
    },
    PostStation: {
      screen: PostStation,
      path: 'poststation',
      navigationOptions: {
        header: null,
      },
    },
    JoinMemory: {
      screen: JoinMemory,
      path: 'joinmemory',
      navigationOptions: {
        header: null,
      },
    },
    EditStation: {
      screen: EditStation,
      path: 'editstation',
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    PostMemory: {
      screen: PostMemory,
      path: 'postmemory',
      navigationOptions: {
        header: null,
      },
    },
    LiveMemory: {
      screen: LiveMemory,
      path: 'livememory',
      navigationOptions: {
        header: null,
      },
    },
    UpdateMemory: {
      screen: UpdateMemory,
      path: 'updatememory',
      navigationOptions: {
        header: null,
      },
    },
    // PostEvent: {
    //   screen: PostEvent,
    //   path: 'explore',
    //   // navigationOptions: ({navigation}) => ({
    //   //   title: 'Explore',
    //   //   headerBackTitle: null,
    //   // }),
    // },
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      currentRouteName = navigation.state.routeName;
      if (currentRouteName == 'TakeImage') {
        tabBarVisible = false;
      }
      return {
        header: <CustomHeader navigation={navigation} />,
      };
    },
    navigationOptions: ({ navigation }) => {
      const { routeName, params } = navigation.state.routes[navigation.state.index];
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          // if(currentRouteName === 'JoinEvent' || currentRouteName === 'LiveEvent' || currentRouteName === 'PostEvent' || currentRouteName === 'ViewEvent' || currentRouteName === 'VerifyPin' || currentRouteName === 'OpenChat' || currentRouteName === 'ViewProfile' ||
          // routeName === 'JoinEvent' || routeName === 'LiveEvent' || routeName === 'PostEvent' || routeName === 'ViewEvent' || routeName === 'VerifyPin' || routeName === 'OpenChat' || routeName === 'ViewProfile'){
          //   return <CustomIcon name={'Navbar_Explore_32px'} size={30} color={'#777879'} />;
          // }
          if (routeName !== 'Explore') {
            return <CustomIcon name={'Navbar_Explore_32px'} size={30} color={'#777879'} />;
          }
          return <CustomIcon name={'Navbar_Explore_32px'} size={30} color={tintColor} />;
        },
        tabBarVisible: routeName !== 'TakeImage' && routeName !== 'RecordVideo',
      };
    },
  }
);

const MessageStack = createStackNavigator(
  {
    Message: {
      screen: Message,
      path: 'message',
    },
    Chat: {
      screen: Chat,
      path: 'chat',
    },
  },
  {
    headerMode: 'none',
  }
);

const AuthStack = createStackNavigator(
  {
    Auth: {
      screen: Auth,
      path: 'auth',
    },
    AuthPhoneInput: {
      screen: AuthPhoneInputScreen,
      path: 'authPhoneInput',
    },
    AuthOTP: {
      screen: AuthOTPScreen,
      path: 'authOTP',
    },
    Profile: {
      screen: ProfileScreen,
      path: 'profileScreen',
    },
    Webview: {
      screen: WebviewScreen,
      path: 'webviewScreen',
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
  }
);

const HomeStack = createStackNavigator(
  {
    HomeTabs: {
      screen: HomeTabs,
    },
    ViewProfile: {
      screen: ViewProfile,
      navigationOptions: {
        header: null,
      },
    },
    Journey: {
      screen: Journey,
      path: 'journey',
      navigationOptions: {
        header: null,
      },
    },
    InviteFriend: {
      screen: InviteFriend,
      path: 'home/:invitefriend',
      navigationOptions: {
        title: 'Invite Friend',
        header: null,
      },
    },
    InviteGuestList: {
      screen: InviteGuestList,
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    AddInvite: {
      screen: AddInvite,
      navigationOptions: {
        title: 'Add Invite',
        header: null,
      },
    },
    GuestList: {
      screen: GuestList,
      path: 'home/:guestlist',
      navigationOptions: {
        title: 'Guest List',
        header: null,
      },
    },
    ImageFilter: {
      screen: ImageFilter,
      navigationOptions: {
        header: null,
      },
    },
    Map: {
      screen: MapView,
      path: 'home/:map',
      navigationOptions: {
        title: 'Map',
        header: null,
      },
    },
    ViewEvent: {
      screen: ViewEvent,
      path: 'viewevent',
      navigationOptions: {
        header: null,
      },
    },
    PostEvent: {
      screen: PostEvent,
      path: 'postevent',
      navigationOptions: {
        header: null,
      },
    },
    LiveEvent: {
      screen: LiveEvent,
      path: 'liveevent',
      navigationOptions: {
        header: null,
      },
    },
    JoinEvent: {
      screen: JoinEvent,
      path: 'joinevent',
      navigationOptions: {
        header: null,
      },
    },
    UpdateEvent: {
      screen: UpdateEvent,
      path: 'updateevent',
      navigationOptions: {
        header: null,
      },
    },
    OpenChat: {
      screen: OpenChat,
      path: 'openchat',
      navigationOptions: {
        header: null,
      },
    },
    VerifyPin: {
      screen: VerifyPin,
      navigationOptions: {
        header: null,
      },
    },
    // CreateEvent: {
    //   screen: CreateEvent,
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
    EditEvent: {
      screen: EditEvent,
      path: 'editevent',
      navigationOptions: {
        header: null,
      },
    },
    MapDisplay: {
      screen: MapDisplay,
      path: 'mapdisplay',
      navigationOptions: {
        header: null,
      },
    },
    TakeImage: {
      screen: TakeImage,
      navigationOptions: {
        header: null,
      },
    },
    RecordVideo: {
      screen: RecordVideo,
      path: 'recordvideo',
      navigationOptions: {
        header: null,
      },
    },
    ViewMedia: {
      screen: EventMedia,
      path: 'viewmedia',
      navigationOptions: {
        header: null,
      },
    },
    ViewMediaEvent: {
      screen: ViewEventMedia,
      navigationOptions: {
        header: null,
      },
    },
    EditProfile: {
      screen: EditProfile,
      path: 'editprofile',
      navigationOptions: {
        header: null,
      },
    },
    JoinStation: {
      screen: JoinStation,
      path: 'joinstation',
      navigationOptions: {
        header: null,
      },
    },
    LiveStation: {
      screen: LiveStation,
      path: 'livestation',
      navigationOptions: {
        header: null,
      },
    },
    PostStation: {
      screen: PostStation,
      path: 'poststation',
      navigationOptions: {
        header: null,
      },
    },
    EditStation: {
      screen: EditStation,
      path: 'editstation',
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    JoinMemory: {
      screen: JoinMemory,
      path: 'joinmemory',
      navigationOptions: {
        header: null,
      },
    },
    PostMemory: {
      screen: PostMemory,
      path: 'postmemory',
      navigationOptions: {
        header: null,
      },
    },
    LiveMemory: {
      screen: LiveMemory,
      path: 'livememory',
      navigationOptions: {
        header: null,
      },
    },
    UpdateMemory: {
      screen: UpdateMemory,
      path: 'updatememory',
      navigationOptions: {
        header: null,
      },
    },
    // Webview: {
    //   screen: WebviewScreen,
    //   path: 'webviewScreen',
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
  },
  {
    initialRouteName: 'HomeTabs',
    defaultNavigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      currentRouteName = navigation.state.routeName;
      if (currentRouteName == 'TakeImage') {
        tabBarVisible = false;
      }
      return {
        header: <CustomHeader navigation={navigation} />,
      };
    },
    navigationOptions: ({ navigation }) => {
      const { routeName, params } = navigation.state.routes[navigation.state.index];
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          // if(currentRouteName === 'JoinEvent' || currentRouteName === 'LiveEvent' || currentRouteName === 'PostEvent' || currentRouteName === 'ViewEvent' || currentRouteName === 'VerifyPin' || currentRouteName === 'OpenChat' || currentRouteName === 'ViewProfile' ||
          //   routeName === 'JoinEvent' || routeName === 'LiveEvent' || routeName === 'PostEvent' || routeName === 'ViewEvent' || routeName === 'VerifyPin' || routeName === 'OpenChat' || routeName === 'ViewProfile'
          // ){
          //   return <CustomIcon name={'Navbar_Home_32px'} size={30} color={'#777879'} />;
          // }
          if (routeName !== 'HomeTabs') {
            return <CustomIcon name={'Navbar_Home_32px'} size={30} color={'#777879'} />;
          }
          return <CustomIcon name={'Navbar_Home_32px'} size={30} color={tintColor} />;
        },
        tabBarVisible: routeName !== 'TakeImage' && routeName !== 'RecordVideo',
      };
    },
  }
);

const getActiveRouteState = route => {
  if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
    return route;
  }

  const childActiveRoute = route.routes[route.index];
  return getActiveRouteState(childActiveRoute);
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const tabStack = createBottomTabNavigator(
  {
    HomeBottom: HomeStack, //route: stack
    ExploreTab: ExploreStack,
    ExperienceTab: ExperienceStack,
    Notification: NotificationStack,
    Message: MessageStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        let iconName;
        if (routeName === 'HomeBottom') {
          iconName = 'Navbar_Home_32px';
        } else if (routeName === 'ExploreTab') {
          iconName = 'Navbar_Explore_32px';
        } else if (routeName === 'Experience') {
          return <PlusButton navigation={navigation} />;
        } else if (routeName === 'Notification') {
          return <BadgeIcon navigation={navigation} tintColor={tintColor} />;
          // iconName = 'Navbar_Notifications_32px';
        } else if (routeName === 'Message') {
          iconName = 'Navbar_Messages_32px';
        }
        return <CustomIcon name={iconName} size={30} color={tintColor} />;
      },
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        const { routeName } = navigation.state;
        if (routeName === 'HomeBottom') {
          currentRouteName = 'HomeBottom';
          navigation.popToTop();
          defaultHandler();
        } else if (routeName === 'ExploreTab') {
          currentRouteName = 'ExploreTab';
          navigation.popToTop();
          defaultHandler();
        } else if (routeName === 'Notification') {
          currentRouteName = 'Notification';
          navigation.popToTop();
          defaultHandler();
        } else if (routeName === 'Message') {
          currentRouteName = 'Message';
          navigation.popToTop();
          defaultHandler();
        }
      },
    }),
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      currentTab = routeName;
    },
    tabBarOptions: {
      initialRouteName: 'HomeBottom',
      activeTintColor: '#45D8BF',
      inactiveTintColor: '#777879',
      showLabel: false,
      style: {
        backgroundColor: '#fff',
      },
    },
  }
);

// const AppNavigator = createAppContainer(tabStack);
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: tabStack,
    },
  },
  {
    drawerWidth: 300,
    drawerPosition: 'left',
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      App: tabStack,
      SafeStack: SafeStack,
      Onboarding: OnboardingStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
