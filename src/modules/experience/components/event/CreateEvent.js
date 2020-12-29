import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  BackHandler,
  Text,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import CodeInput from 'react-native-confirmation-code-field';
import ImagePicker from 'react-native-image-crop-picker';
import ExperienceActions from '../../reducers/event/index';
import Timeline from 'react-native-timeline-flatlist';
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Switch } from 'react-native-switch';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import theme from '../../../core/theme';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Geojson } from 'react-native-maps';
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { createStructuredSelector } from 'reselect';
import { selectAccessToken, selectUid } from '../../../auth/reducers';
import { selectGeofence, selectData, selectCurrent, selectCategoryLists } from '../../reducers/event';
import { StackActions, NavigationActions } from 'react-navigation';
import { Loading } from '../../../../utils';
import Categories from '../Categories';
import LocationAccess from '../../../home/components/organisms/LocationAccess';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import {
  StyledView,
  StyledText,
  StyledButton,
  StyledImage,
  StyledSeparator,
  StyledWrapper,
} from '../../../core/common.styles';
import { getUserCurrentLocation, getResizeImage } from '../../../../utils/funcs';
const moment = require('moment');
const { images, colors, font, gradients } = theme;

const StyledContainer = styled.View`
  flex: 1;
  padding-right: ${wp('4.3%')};
  padding-bottom: ${wp('10.0%')};
  margin-top: ${hp('14.9%')};
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2 || 0};
`;

const BackButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#ffffff'} />
  </StyledButton>
);

const StyledHeader = styled.View`
  position: absolute;
  width: ${wp('100%')};
`;

const Header = props => (
  <StyledHeader>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={gradients.Background}
      style={styles.headerContainer}
    >
      <SafeAreaView>
        <StyledWrapper row primary={'space-between'} secondary={'center'}>
          <BackButton onPress={props.onBack} />
          <StyledText color={colors.White} fontSize={hp('2.5%')} fontFamily={font.MMedium} fontWeight={'500'}>
            {'Create an Event'}
          </StyledText>
          <StyledWrapper width={wp('10%')} />
        </StyledWrapper>
      </SafeAreaView>
    </LinearGradient>
  </StyledHeader>
);

const StyledCard = styled.View`
  margin-top: 9;
  margin-bottom: ${props => (props.marginBottom === 0 ? 0 : hp('5.7%'))};
  width: 100%;
  border-radius: 15;
  padding-left: ${wp('7.3%')};
  padding-right: ${wp('7.3%')};
  padding-top: ${props => (props.paddingTop === 0 ? 0 : hp('2.7%'))};
  padding-bottom: ${props => (props.paddingBottom === 0 ? 0 : hp('2.7%'))};
  background-color: ${colors.White};
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.09);
  elevation: 1;
`;

const StyledEventImageWrapper = styled.View`
  width: 100%;
  height: ${hp('31%')};
  justify-content: center;
  align-items: center;
`;

const EventImage = ({ image, onPress }) => (
  <StyledButton onPress={onPress} marginBottom={8}>
    <StyledEventImageWrapper>
      {!image ? (
        <React.Fragment>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.Orange, fontSize: wp('4%'), zIndex: 1 }}>{`✷`}</Text>
            <CustomIcon
              name={'add_photo_alternate-24px'}
              size={120}
              color={'#cccccc'}
              style={{ marginTop: -hp('2.25%'), marginLeft: -wp('6%') }}
            />
          </View>
          <StyledText
            textAlign={'center'}
            color={'rgb(147, 147, 147)'}
            fontSize={hp('1.7%')}
            fontFamily={font.MMedium}
            fontWeight={'500'}
          >
            Select a Cover Photo
          </StyledText>
        </React.Fragment>
      ) : (
        <StyledImage width={'100%'} height={'100%'} source={{ uri: image }} resizeMode={'contain'} />
      )}
    </StyledEventImageWrapper>
  </StyledButton>
);

const InputText = props => (
  <TextField
    {...props}
    multiline={true}
    autoCorrect={false}
    enablesReturnKeyAutomatically={true}
    keyboardType={'default'}
    contentInset={{ input: 8, top: 0 }}
    tintColor={colors.WarmGrey}
    baseColor={colors.WarmGrey}
    activeLineWidth={hp('0.1%')}
    disabledLineWidth={hp('0.1%')}
    fontSize={hp('1.7%')} // the size of static label(initial lable || big label)
    labelFontSize={hp('1.2%')} // the size of top label(small label)
    inputContainerStyle={[styles.inputContainerStyle, { width: props.width || '100%' }]}
    labelTextStyle={styles.labelTextStyle}
    style={[styles.textInputStyle]}
    renderLeftAccessory={() => <Text style={{ color: colors.Orange, fontSize: wp('4%') }}>{`✷ `}</Text>}
  />
);

const StyledSelectWrapper = styled.View`
  width: 100%;
  height: ${hp('3.4%')};
  border-radius: ${hp('1.7%')};
  background-color: rgb(244, 244, 244);
  justify-content: center;
  border-width: ${hp('0.1%')};
  border-color: rgb(225, 225, 225);
`;

const SelectCategoryButton = props => (
  <StyledButton {...props}>
    <StyledSelectWrapper>
      <StyledText
        textAlign={'center'}
        color={colors.WarmGrey}
        fontSize={hp('1.7%')}
        fontFamily={font.MMedium}
        fontWeight={'500'}
      >
        {!props.isSelect && <Text style={{ color: colors.Orange }}>{`✷ `}</Text>}
        {props.title}
      </StyledText>
    </StyledSelectWrapper>
  </StyledButton>
);

const StyledPlusButton = styled.View`
  position: absolute;
  top: ${hp('0.5%')};
  right: ${-hp('0.5%')};
  width: ${hp('2.3%')};
  height: ${hp('2.3%')};
  border-radius: ${hp('1.15%')};
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

const PlusButton = props => (
  <StyledPlusButton {...props}>
    <StyledButtonOverlay
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.32, 1]}
      colors={['#fe7285', '#fe7285', '#fead67']}
    />
    <CustomIcon name={'add-24px'} size={hp('2.3%')} color={'#f4f4f4'} />
  </StyledPlusButton>
);

const SelectDateButton = props => (
  <StyledButton {...props}>
    <StyledSelectWrapper alignItems={'flex-start'}>
      <StyledText
        marginLeft={wp('10%')}
        color={colors.WarmGrey}
        fontSize={hp('1.7%')}
        fontFamily={font.MMedium}
        fontWeight={'500'}
      >
        <StyledText
          textAlign={'center'}
          color={'rgb(253, 141, 126)'}
          fontSize={hp('1.7%')}
          fontFamily={font.MMedium}
          fontWeight={'500'}
        >
          {!props.isSelect && `✷ `}
          {`${props.title} - `}
        </StyledText>
        {'Date and Time'}
      </StyledText>
      <PlusButton />
    </StyledSelectWrapper>
  </StyledButton>
);

const StyledMapButtonContainer = styled.View`
  position: absolute;
  left: ${wp('4.5%')};
  top: ${hp('10%')};
`;

const StyledMapButtonWrapper = styled.View`
  width: ${wp('71.5%')};
  height: ${hp('3.4%')};
  border-radius: ${hp('1.7%')};
  background-color: ${colors.White};
  justify-content: center;
  border-width: ${hp('0.1%')};
  border-color: rgb(225, 225, 225);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  elevation: 1;
`;

const MapButton = props => (
  <StyledButton {...props}>
    <StyledMapButtonWrapper>
      <StyledText
        textAlign={'center'}
        color={colors.WarmGrey}
        fontSize={hp('1.7%')}
        fontFamily={font.MMedium}
        fontWeight={'500'}
      >
        <Text style={{ color: colors.Orange }}>{`✷ `}</Text>
        {props.title}
      </StyledText>
    </StyledMapButtonWrapper>
  </StyledButton>
);

const StyledPrivacyItem = styled.View`
  margin-top: ${props => props.marginTop || 0};
`;

const StyledSwitchWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10;
`;

const PrivacyDivider = () => (
  <View
    style={{
      backgroundColor: '#ECEDED',
      width: '100%',
      height: wp('0.3%'),
      marginVertical: hp('3%'),
    }}
  />
);

const PrivacyItem = props => (
  <StyledPrivacyItem>
    <StyledText color={'rgb(59, 59, 59)'} fontSize={hp('2%')} fontFamily={font.MMedium} fontWeight={'500'}>
      {props.title}
    </StyledText>

    <StyledText
      color={'rgb(108, 108, 108)'}
      fontSize={hp('1.7%')}
      fontFamily={font.MRegular}
      marginTop={wp('2%')}
      marginLeft={0}
    >
      {props.description}
    </StyledText>

    <StyledSwitchWrapper>
      <StyledText
        color={colors.WarmGrey}
        fontSize={hp('1.8%')}
        fontFamily={font.MMedium}
        fontWeight={'500'}
        marginRight={7}
      >
        {props.inactiveText}
      </StyledText>

      <Switch
        value={props.value}
        onValueChange={props.onValueChange}
        disabled={false}
        circleSize={hp('3.5%')}
        barHeight={hp('3.7%')}
        circleBorderWidth={0}
        backgroundActive={'rgb(254, 114, 133)'}
        backgroundInactive={'rgb(234, 234, 234)'}
        switchLeftPx={2.5}
        switchRightPx={2.5}
      />

      <StyledText
        color={props.value ? 'rgb(255, 163, 109)' : colors.WarmGrey}
        fontSize={hp('1.8%')}
        fontFamily={props.value ? font.MMedium : font.MLight}
        fontWeight={props.value ? '500' : 'normal'}
        marginLeft={7}
      >
        {props.activeText}
      </StyledText>
    </StyledSwitchWrapper>
  </StyledPrivacyItem>
);

const StyledGradientButton = styled.TouchableOpacity`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: ${props => props.marginLeft || 0};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? gradients.Background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
      />
      {children}
    </StyledGradientButton>
  );
};

const StyledDeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 10;
  top: 10;
  border-radius: 5;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-color: #fe9274;
  border-width: ${hp('0.15%')};
`;
const DeleteButton = props => (
  <StyledDeleteButton {...props}>
    <CustomIcon name={'close-24px'} size={25} />
  </StyledDeleteButton>
);

const initialState = {
  isDateTimePickerVisible: false,
  isStarPickerSelected: false,
  startDateTime: '',
  isEndPickerSelected: false,
  endDateTime: '',
  isValidEventTime: false,
  timeLineData: [],
  isLiveEvent: false, // Post Live
  isPrivateEvent: false,
  eventPrivacyIndex: 0,
  isAnonymous: false,
  pincode: '',
  title: '',
  address: '',
  description: '',
  startDate: '',
  endDate: '',
  category: 'Business',
  coverPhoto: '',
  isActive: false,
  liveContent: 'Users that have access to this event can see live content',
  categoryData: [],
  selectedCategory: '',
  initialRegion: {
    latitude: -29.1482491,
    longitude: -51.1559028,
    latitudeDelta: 0.0922 * 1.5,
    longitudeDelta: 0.0421 * 1.5,
  },
  loading: false,
  coordinates: [],
  isCreated: false,
  isModalVisible: false,
  isSlectPhotoModalVisible: false,
  createEventSnapshot: null,
  minimumDate: new Date(),
  minDate: null,
  isEndDate: false,
  isVisibleLocation: false,
  isInvitePermission: false,
};

const CategoriesModal = ({ isModalVisible, toggleModal, onSelectCategory }) => {
  return (
    <Modal isVisible={isModalVisible} style={styles.modal} onRequestClose={toggleModal}>
      <Categories categoryType={'event'} toggleModal={toggleModal} onSelectCategory={onSelectCategory} />
    </Modal>
  );
};

const StyledPhotoModalContainer = styled.View`
  width: 90%;
  background-color: 'rgba(249,249,249,0.78)';
  border-radius: 14;
  justify-content: center;
  align-items: center;
`;

const StyledPhotoModalItem = styled.TouchableOpacity`
  width: 100%;
  height: 55;
  justify-content: center;
  align-items: center;
`;

const StyledPhotoModalText = styled.Text`
  font-size: 18;
  color: #007aff;
  text-align: center;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

const StyledCancelButton = styled.TouchableOpacity`
  border-radius: 14;
  margin-top: 7;
  margin-bottom: 48;
  width: 90%;
  height: 55;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const SelectPhotoModal = ({ isModalVisible, toggleModal, onSelectImage, onTakePhoto }) => {
  return (
    <Modal isVisible={isModalVisible} style={styles.modal}>
      <StyledPhotoModalContainer>
        <StyledPhotoModalItem onPress={onTakePhoto}>
          <StyledPhotoModalText>{'Take Photo...'}</StyledPhotoModalText>
        </StyledPhotoModalItem>
        <StyledSeparator bgColor={'rgba(17,17,17,0.5)'} opacity={0.5} />
        <StyledPhotoModalItem onPress={onSelectImage}>
          <StyledPhotoModalText>{'Choose from Library...'}</StyledPhotoModalText>
        </StyledPhotoModalItem>
      </StyledPhotoModalContainer>

      <StyledCancelButton onPress={toggleModal}>
        <StyledPhotoModalText fontWeight={'bold'}>{'Cancel'}</StyledPhotoModalText>
      </StyledCancelButton>
    </Modal>
  );
};

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.openMap = this.openMap.bind(this);
    this.goToInitialLocation = this.goToInitialLocation.bind(this);
    this._redirectViewEvent = this._redirectViewEvent.bind(this);
    // this.initialRegion = {
    //   latitude: -29.1482491,
    //   longitude: -51.1559028,
    //   latitudeDelta: 0.0922 * 1.5,
    //   longitudeDelta: 0.0421 * 1.5,
    // };
    // this.coordinates = [];
  }

  backAction = () => {
    Alert.alert('Hold on!', 'Do you really want to leave this form, your changes will be lost.', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => this.onBack() },
    ]);
    return true;
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onTogglePhotoModal = () => {
    this.setState(prevState => ({
      isSlectPhotoModalVisible: !prevState.isSlectPhotoModalVisible,
    }));
  };

  componentDidMount = async () => {
    let location = await getUserCurrentLocation();
    if (location !== null && location.code && location.code !== 'CANCELLED') {
      this.setState({ isVisibleLocation: true });
    }
    const dotIconImage = await this.getIconImageSource('circle');
    const timerIconImage = await this.getIconImageSource('access_time-24px');
    const locationIconImage = await this.getIconImageSource('my_location-24px');
    const privacyIconImage = await this.getIconImageSource('privacy-handshake-icon-wrapcopy');
    this.props.setGeofence(null);
    CustomIcon.getImageSource('circle', 10, '#EFEFEF').then(source =>
      this.setState({
        timeLineData: [
          {
            icon: dotIconImage,
            title: 'Event Details',
          },
          {
            icon: timerIconImage,
            title: 'Date and Time',
          },
          {
            icon: locationIconImage,
            title: 'Location',
          },
          {
            icon: privacyIconImage, // Replace with the lock icon
            title: 'Privacy',
          },
          {},
        ],
      })
    );
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backAction);

    // const reqObj = {
    //   token: this.props.access_token,
    // };
    // this.props.onGetCategoryLists(reqObj);
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  componentDidUpdate() {
    if (!this.state.isCreated) {
      if (this.props.geofence) {
        var coordinates = [];
        const geofence = this.props.geofence;

        if (geofence.shape === 'polygon') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        } else if (geofence.shape === 'rectangle') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        } else if (geofence.shape === 'circle') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        }

        const center = geolib.getCenterOfBounds(coordinates);
        const bounds = geolib.getBounds(coordinates);
        const latitudeDelta = Math.abs(center.latitude - bounds.minLat) * 2.6;
        const longitudeDelta = Math.abs(center.longitude - bounds.minLng) * 2.6;

        if (!_.isEqual(this.state.coordinates, coordinates)) {
          this.setState({
            coordinates: coordinates,
            initialRegion: {
              latitude: center.latitude,
              longitude: center.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            },
          });
        }
      }
      if (this.props.data) {
        // this.setState({loading: false});
      }
    } else {
      this.setState({
        isCreated: false,
      });
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {}

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  /**
   * Map manipulaion
   *
   */

  openMap = async () => {
    let location = await getUserCurrentLocation();
    if (location !== null) {
      this.props.navigation.push('Map', {
        isUpdate: false,
      });
    } else {
      this.setState({ isVisibleLocation: true });
    }
  };

  /**
   * Select Date Time logic
   *
   */

  showDateTimePicker = isStarPickerSelected => {
    this.setState({ minDate: new Date(moment().add(5, 'minutes')) });
    if (isStarPickerSelected) {
      this.setState({
        isEndDate: false,
        isDateTimePickerVisible: true,
        isStarPickerSelected: true,
      });
    } else {
      this.setState({
        isEndDate: true,
        isDateTimePickerVisible: true,
        isEndPickerSelected: true,
      });
    }
  };

  hideDateTimePicker = dateTime => {
    const { isStarPickerSelected, isEndPickerSelected, startDateTime, endDateTime } = this.state;

    let isValidEventTime = false;
    const formatedDateTime = moment(dateTime).format('ddd D MMM YYYY hh:mm A');
    const parsedDateTime = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

    if (isStarPickerSelected) {
      if (endDateTime) {
        //isValidEventTime = this.validateEventTime(formatedDateTime, endDateTime);
        isValidEventTime = true;
      }

      this.setState({
        isDateTimePickerVisible: false,
        isStarPickerSelected: false,
        startDateTime: formatedDateTime || '',
        startDate: parsedDateTime || '',
        minimumDate: new Date(moment(dateTime).add(5, 'minutes')),
        isValidEventTime,
        startDateSelected: true,
      });
    }

    if (isEndPickerSelected) {
      let sDate = moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss');
      let eDate = moment(parsedDateTime).format('YYYY-MM-DD HH:mm:ss');
      if (sDate > eDate) {
        this.setState({
          isDateTimePickerVisible: false,
          isEndPickerSelected: false,
          endDateTime: '',
          endDate: '',
          isValidEventTime: false,
        });
      } else {
        if (startDateTime) {
          //isValidEventTime = this.validateEventTime(startDateTime, formatedDateTime);
          isValidEventTime = true;
        }

        this.setState({
          isDateTimePickerVisible: false,
          isEndPickerSelected: false,
          endDateTime: formatedDateTime || '',
          endDate: parsedDateTime || '',
          isValidEventTime,
        });
      }
    }
  };

  handleDatePicked = dateTime => {
    this.hideDateTimePicker(dateTime);
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.state.initialRegion, 2000);
  };

  validateEventTime = (start, end) => {
    const now = new Date().getTime() / 1000;
    const startTime = moment(start, 'ddd D MMM YYYY HH:mm A').valueOf() / 1000;
    const endTime = moment(end, 'ddd D MMM YYYY HH:mm A').valueOf() / 1000;
    if (endTime - startTime < 0) {
      return false;
    }

    if (now > endTime) {
      return false;
    }

    return true;
  };

  /**
   * Switch public logic
   *
   */

  onSwitchPublic = value => {
    this.setState({ isPrivateEvent: value });
  };

  onChangeEventPrivacy = index => {
    this.setState({ eventPrivacyIndex: index });
  };

  onSwitchAnonymous = value => {
    this.setState({ isAnonymous: value });
  };

  onSwitchLive = value => {
    this.setState({ isLiveEvent: value });
    if (value) {
      this.setState({
        liveContent: 'Content of event will remain hidden until the event has ended',
      });
    } else {
      this.setState({
        liveContent: 'Users that have access to this event can see live content',
      });
    }
  };

  onSwitchInvitePermission = value => {
    this.setState({ isInvitePermission: value });
  };

  /**
   * OTP code part
   *
   */

  onFulfillCode = code => {
    this.setState({
      pincode: code,
    });
  };

  /**
   * Create Event
   *
   */

  onCreateEvent = async () => {
    let sDate = moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss');
    let eDate = moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss');
    if (sDate > eDate) {
      Alert.alert('Warning', 'End date must be after start date', [{ text: 'OK' }], {
        cancelable: false,
      });
    } else {
      let location = await getUserCurrentLocation();
      const { eventPrivacyIndex } = this.state;
      const eventObj = new FormData();
      eventObj.append('token', this.props.access_token);
      eventObj.append('uid', this.props.uid);
      eventObj.append('title', this.state.title);
      eventObj.append('description', this.state.description);
      eventObj.append('address', this.state.address);
      eventObj.append('category', this.state.selectedCategory);
      eventObj.append('public', eventPrivacyIndex === 0 ? true : false);
      eventObj.append('is_secret', eventPrivacyIndex === 2 ? true : false);
      eventObj.append('live', this.state.isLiveEvent);
      eventObj.append('hasAnonymous', this.state.isAnonymous);
      eventObj.append('can_guest_invite', this.state.isInvitePermission);
      eventObj.append('startDate', this.state.startDate);
      eventObj.append('endDate', this.state.endDate);
      eventObj.append('coverPhoto', {
        file: this.state.coverPhoto.uri,
        name: this.state.coverPhoto.fileName,
        type: this.state.coverPhoto.type !== undefined ? this.state.coverPhoto.type : 'image/jpeg',
        size: this.state.coverPhoto.size,
        mime: this.state.coverPhoto.mime,
        path: this.state.coverPhoto.path,
        uri: Platform.OS === 'android' ? this.state.coverPhoto.uri : this.state.coverPhoto.uri.replace('file://', ''),
      });
      let centerPoint;
      if (this.props.geofence.metadata.center) {
        centerPoint = {
          lat: this.props.geofence.metadata ? this.props.geofence.metadata.center.lat : '',
          lng: this.props.geofence.metadata ? this.props.geofence.metadata.center.lng : '',
        };
      } else {
        let coordinate = [];
        this.props.geofence.data.coordinates[0].map((item, index) => {
          let obj = { latitude: item[1], longitude: item[0] };
          coordinate.push(obj);
        });
        let point = geolib.getCenterOfBounds(coordinate);
        centerPoint = {
          lat: point.latitude ? point.latitude : '',
          lng: point.longitude ? point.longitude : '',
        };
      }
      eventObj.append('centerPoint', JSON.stringify(centerPoint));
      eventObj.append('fenceBuffer', JSON.stringify(this.props.geofence.fenceBuffer));
      eventObj.append('fenceJson', JSON.stringify(this.props.geofence.data));
      eventObj.append('metadata', JSON.stringify(this.props.geofence.metadata));
      eventObj.append('event_access_pin', this.state.pincode);
      eventObj.append('fenceType', this.props.geofence.shape);
      eventObj.append('event_status', true);
      try {
        let obj = {
          formData: eventObj,
          addEventSuccess: this.addEventSuccess,
          addEventFailure: this.addEventFailure,
          location: location,
        };
        await this.props.onAddEvent(obj);
        await this.props.setGeofence(null);

        const dotIconImage = await this.getIconImageSource('circle');
        const timerIconImage = await this.getIconImageSource('access_time-24px');
        const locationIconImage = await this.getIconImageSource('my_location-24px');
        const privacyIconImage = await this.getIconImageSource('privacy-handshake-icon-wrapcopy');
        this.setState({
          ...initialState,
          timeLineData: [
            {
              icon: dotIconImage,
              title: 'Event Details',
            },
            {
              icon: timerIconImage,
              title: 'Date and Time',
            },
            {
              icon: locationIconImage,
              title: 'Location',
            },
            {
              icon: privacyIconImage, // Replace with the lock icon
              title: 'Privacy',
            },
            {},
          ],
          coordinates: [],
          loading: true,
          isCreated: true,
        });
      } catch (error) {
        Alert.alert('Warning', 'Event creation unsuccessful', [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    }
  };

  addEventSuccess = response => {
    this._redirectViewEvent(response);
  };
  addEventFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Event creation unsuccessful', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  _redirectViewEvent = response => {
    Alert.alert('Event Created', 'When the event starts, you can begin adding content to the experience!', [
      {
        text: 'Dismiss',
        onPress: () => {
          this.props.setEventLoad(false);
          response.data.parentID &&
            this.props.navigation.navigate('ViewEvent', {
              parentID: response.data.parentID,
            });
        },
      },
    ]);
    this.setState({
      loading: false,
    });
  };

  /**
   * Show category lists from redux state and select category
   *
   */

  getCategoryData = () => {
    const events = this.props.categoryLists.Events;
    let categoryData = [];
    let index = 0;

    if (events) {
      Object.keys(events).forEach(parentCat => {
        const parentCatData = {
          key: index++,
          section: false,
          label: parentCat,
        };
        categoryData.push(parentCatData);
        // const subCatList = events[parentCat];
        // subCatList.forEach(subCat => {
        //   const subCatData = { key: index++, label: subCat };
        //   categoryData.push(subCatData);
        // });
      });
    }

    this.setState({
      categoryData,
    });
  };

  onShowCategoryList = () => {
    this.getCategoryData();
    // this.selector.open();
    this.toggleModal();
  };

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  /**
   * Select event cover photo
   *
   */

  onSelectImage = async () => {
    this.onTogglePhotoModal();

    setTimeout(() => {
      ImagePicker.openPicker({
        multiple: false,
      })
        .then(image => {
          let imageWidth = image.width;
          let imageHeight = image.height;
          getResizeImage(image.path, 600, 600, 100).then(res => {
            this.setState({
              coverPhoto: {
                uri: res.uri,
                fileName: res.name,
                size: res.size,
                // mime: image.mime,
                // type: image.type,
              },
              isActive: true,
            });
          });
        })
        .catch(() => {});
    }, 500);
  };

  /**
   * Take photo
   *
   */

  handleTakePhoto = async () => {
    try {
      // Get the info of taken image
      const image = await ImagePicker.openCamera({
        cropping: false,
      });

      // Save image to the Camera Roll ===> get uri like 'ph://...'
      const savedImageUri = await CameraRoll.saveToCameraRoll(image.path, 'photo');
      // Convert the access Platform === iOS
      let uploadngImageUri;
      if (Platform.OS === 'ios') {
        uploadngImageUri = 'ph-upload' + savedImageUri.substring(2);
      } else {
        uploadngImageUri = savedImageUri;
      }
      getResizeImage(uploadngImageUri, 600, 600, 100).then(res => {
        this.setState({
          coverPhoto: {
            uri: res.uri,
            fileName: res.name,
            size: res.size,
            // mime: image.mime,
            // type: image.type,
          },
          isActive: true,
        });
      });
    } catch (error) {}
  };

  onTakePhoto = () => {
    this.onTogglePhotoModal();

    setTimeout(() => {
      this.handleTakePhoto();
    }, 500);
  };

  /**
   * Back
   *
   */
  onBack = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
  };

  /**
   * Render Timeline
   *
   */

  renderDetail = (rowData, sectionID, rowID) => {
    let sectionTitleComp = (
      <StyledText
        marginTop={-10}
        fontSize={hp('2.7%')}
        color={'rgb(69, 69, 69)'}
        fontFamily={font.MMedium}
        fontWeight={'500'}
      >
        {rowData.title}
      </StyledText>
    );

    let content = null;
    const { eventPrivacyIndex } = this.state;
    switch (sectionID) {
      // Event Details Section
      case 0:
        content = (
          <StyledCard>
            <EventImage image={this.state.coverPhoto.uri} onPress={this.onTogglePhotoModal} />
            <InputText
              label={'Event Title'}
              value={this.state.title}
              onChangeText={value => {
                this.setState({ title: value });
              }}
            />
            <InputText
              label={'Description'}
              value={this.state.description}
              onChangeText={value => {
                this.setState({ description: value });
              }}
            />

            <InputText
              label={'Address (eg. Bothell, WA 98021)'}
              value={this.state.address}
              onChangeText={value => {
                this.setState({ address: value });
              }}
            />
            <ModalSelector
              data={this.state.categoryData}
              onChange={this.onSelectCategory}
              ref={selector => {
                this.selector = selector;
              }}
              customSelector={
                <SelectCategoryButton
                  marginTop={18}
                  title={this.state.selectedCategory || 'Select a Category'}
                  isSelect={this.state.selectedCategory}
                  onPress={this.onShowCategoryList}
                />
              }
              optionContainerStyle={{ height: hp('50%') }}
            />
          </StyledCard>
        );
        break;
      case 1:
        content = (
          <StyledCard>
            <SelectDateButton
              title={'Start'}
              isSelect={this.state.startDateTime}
              disabled={false}
              onPress={() => this.showDateTimePicker(true)}
            />
            {this.state.startDateTime ? (
              <StyledText
                marginTop={8}
                textAlign={'center'}
                color={colors.WarmGrey}
                fontSize={11}
                fontFamily={font.MMedium}
                fontWeight={'500'}
              >
                {this.state.startDateTime}
              </StyledText>
            ) : null}

            <SelectDateButton
              marginTop={hp('2.2%')}
              title={'End'}
              isSelect={this.state.endDateTime}
              onPress={() => {
                this.state.startDateSelected
                  ? this.showDateTimePicker(false)
                  : Alert.alert('Warning', 'Select start date and time to proceed', [{ text: 'OK' }], {
                      cancelable: false,
                    });
              }}
            />
            {this.state.endDateTime ? (
              <StyledText
                marginTop={8}
                textAlign={'center'}
                color={colors.WarmGrey}
                fontSize={11}
                fontFamily={font.MMedium}
                fontWeight={'500'}
              >
                {this.state.endDateTime}
              </StyledText>
            ) : null}
          </StyledCard>
        );
        break;

      case 2:
        content = (
          <StyledCard paddingTop={0} paddingBottom={0}>
            <StyledImage width={'100%'} height={hp('24.8%')} source={images.MAP} resizeMode={'cover'} />
            {!_.isEmpty(this.state.coordinates) ? (
              <View style={styles.container}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={this.state.initialRegion}
                  ref={mapView => (this.mapView = mapView)}
                  onMapReady={this.goToInitialLocation}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  mapType={'hybrid'}
                >
                  {this.props.geofence && (
                    <Geojson
                      geojson={{
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                              type: 'Polygon',
                              coordinates: this.props.geofence.data.coordinates,
                            },
                          },
                        ],
                      }}
                      strokeColor={theme.orange.text}
                      fillColor="#8a8a8a5c"
                      strokeWidth={2}
                    />
                  )}
                </MapView>
                {/* )} */}
                <DeleteButton
                  onPress={() => {
                    this.state.coordinates = [];
                    this.props.setGeofence(null);
                    this.state.createEventSnapshot = null;
                  }}
                />
              </View>
            ) : (
              <StyledMapButtonContainer>
                <MapButton title={'Select a Location'} onPress={this.openMap} />
              </StyledMapButtonContainer>
            )}
          </StyledCard>
        );
        break;

      case 3:
        content = (
          <StyledCard marginBottom={0}>
            <StyledText color={'rgb(59, 59, 59)'} fontSize={hp('2%')} fontFamily={font.MMedium} fontWeight={'500'}>
              {'Public Event'}
            </StyledText>

            <StyledText
              color={'rgb(108, 108, 108)'}
              fontSize={hp('1.7%')}
              fontFamily={font.MRegular}
              marginTop={wp('2%')}
              marginLeft={0}
            >
              {'Public events allow you to share the details of your event with the world. Anyone can RSVP and attend.'}
            </StyledText>

            <View style={styles.eventPrivacyContianer}>
              <TouchableOpacity
                onPress={() => this.onChangeEventPrivacy(0)}
                style={eventPrivacyIndex === 0 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
              >
                <Text style={eventPrivacyIndex === 0 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
                  {'Public'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onChangeEventPrivacy(1)}
                style={eventPrivacyIndex === 1 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
              >
                <Text style={eventPrivacyIndex === 1 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
                  {'Private'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onChangeEventPrivacy(2)}
                style={eventPrivacyIndex === 2 ? styles.activeEventPricacy : styles.inactiveEventPricacy}
              >
                <Text style={eventPrivacyIndex === 2 ? styles.activeEventPrivacyText : styles.inactiveEventPrivacyText}>
                  {'Secret'}
                </Text>
              </TouchableOpacity>
            </View>

            <PrivacyDivider />

            <PrivacyItem
              title={'Post Event Anonymously'}
              description={'Users that have access to this event can see live content.'}
              inactiveText={'Show Name'}
              activeText={'Anonymous'}
              value={this.state.isAnonymous}
              onValueChange={this.onSwitchAnonymous}
            />

            <PrivacyDivider />

            <PrivacyItem
              title={'Invite Permission'}
              description={'Allow guests to invite other members to the event'}
              inactiveText={'Deny'}
              activeText={'Allow'}
              value={this.state.isInvitePermission}
              onValueChange={this.onSwitchInvitePermission}
            />

            <PrivacyDivider />

            <PrivacyItem
              title={'Event Content'}
              description={this.state.liveContent}
              inactiveText={'Live Event'}
              activeText={'Delayed'}
              value={this.state.isLiveEvent}
              onValueChange={this.onSwitchLive}
            />
            {eventPrivacyIndex === 1 || eventPrivacyIndex === 2 ? (
              <View>
                <StyledText
                  fontSize={hp('1.7%')}
                  color={colors.WarmGrey}
                  fontFamily={font.MMedium}
                  fontWeight={'500'}
                  marginTop={hp('3.7%')}
                  textAlign={'center'}
                >
                  {'Enter an invite code'}
                </StyledText>

                {/**
                 * OTP input
                 * */}
                <CodeInput
                  ref={ref => {
                    this.field = ref;
                  }}
                  onFulfill={this.onFulfillCode}
                  inactiveColor={colors.LightBlack}
                  activeColor={'#5D5D5D'}
                  codeLength={4}
                  space={7}
                  size={wp('9.4%')}
                  cellProps={() => {
                    return {
                      style: {
                        marginTop: 8,
                        backgroundColor: '#EDEDED',
                        borderRadius: 7,
                        borderColor: '#E6E6E6',
                        borderWidth: 1,
                        fontFamily: font.MMedium,
                        fontSize: hp('1.4%'),
                      },
                    };
                  }}
                />
              </View>
            ) : null}
          </StyledCard>
        );
        break;

      case 4:
        const {
          isPrivateEvent,
          isValidEventTime,
          pincode,
          title,
          description,
          category,
          coverPhoto,
          selectedCategory,
        } = this.state;

        const publicPossibility =
          isValidEventTime && title && description && category && coverPhoto && selectedCategory;

        const isCreatePossible = !isPrivateEvent ? publicPossibility : publicPossibility && pincode;

        content = (
          <GradientButton
            width={wp('72%')}
            height={hp('3.9%')}
            marginLeft={wp('4.5%')}
            onPress={() => {
              this.onCreateEvent();
            }}
            isActive={isCreatePossible}
          >
            {!this.state.loading ? (
              <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
                {'Create Event'}
              </StyledText>
            ) : (
              <Loading />
            )}
          </GradientButton>
        );
        break;

      default:
        break;
    }

    return (
      <StyledView>
        {sectionTitleComp}
        {content}
      </StyledView>
    );
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            <KeyboardAwareScrollView scrollEnabled={true}>
              <StyledContainer>
                <Timeline
                  style={styles.list}
                  listViewStyle={styles.listViewStyle}
                  data={this.state.timeLineData}
                  renderDetail={this.renderDetail}
                  lineColor={'rgba(215, 215, 215, 0.5)'}
                  lineWidth={wp('0.7%')}
                  innerCircle={'icon'} // Timeline mode
                  showTime={false} // Disble time text
                  circleSize={20}
                  circleColor={'rgb(238, 238, 238)'}
                  iconStyle={styles.iconStyle}
                  options={{
                    showsVerticalScrollIndicator: false,
                  }}
                />

                <DateTimePicker
                  mode={'datetime'}
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={() => this.setState({ isDateTimePickerVisible: false })}
                  minimumDate={this.state.isEndDate ? this.state.minimumDate : this.state.minDate}
                  minuteInterval={5}
                  //is24Hour={true}
                  //locale="en_GB"
                  date={this.state.isEndDate ? new Date(this.state.minimumDate) : new Date(moment().add(5, 'minutes'))}
                />
                <CategoriesModal
                  isModalVisible={this.state.isModalVisible}
                  toggleModal={this.toggleModal}
                  onSelectCategory={this.onSelectCategory}
                />
                <SelectPhotoModal
                  isModalVisible={this.state.isSlectPhotoModalVisible}
                  toggleModal={this.onTogglePhotoModal}
                  onSelectImage={this.onSelectImage}
                  onTakePhoto={this.onTakePhoto}
                />
                <LocationAccess
                  visible={this.state.isVisibleLocation}
                  onClose={() => this.setState({ isVisibleLocation: false })}
                />
              </StyledContainer>
            </KeyboardAwareScrollView>
            <Header onBack={this.onBack} />
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listViewStyle: {
    paddingRight: 15,
  },
  headerContainer: {
    paddingVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  mapStyles: {
    flex: 1,
    height: 500,
  },
  labelTextStyle: { fontFamily: font.MMedium },
  textInputStyle: {
    fontFamily: font.MRegular,
    color: '#5E5E5E',
    fontSize: 14,
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
  },
  eventPrivacyContianer: {
    flexDirection: 'row',
    borderRadius: wp('10%'),
    borderColor: 'rgb(234, 234, 234)',
    borderWidth: wp('0.3%'),
    paddingHorizontal: wp('1%'),
    paddingVertical: wp('1%'),
    marginTop: 10,
  },
  activeEventPricacy: {
    flex: 1,
    backgroundColor: colors.Orange,
    paddingVertical: hp('1'),
    alignItems: 'center',
    borderRadius: wp('10%'),
  },
  inactiveEventPricacy: {
    flex: 1,
    paddingVertical: hp('1'),
    alignItems: 'center',
  },
  activeEventPrivacyText: {
    color: 'white',
    fontFamily: font.MMedium,
    letterSpacing: 0.5,
  },
  inactiveEventPrivacyText: {
    color: 'black',
    fontFamily: font.MRegular,
    letterSpacing: 0.5,
  },
});

const mapStateToProps = createStructuredSelector({
  access_token: selectAccessToken,
  uid: selectUid,
  geofence: selectGeofence,
  data: selectData,
  categoryLists: selectCategoryLists,
  current: selectCurrent,
});

const mapDispatchToProps = dispatch => {
  return {
    onGetCategoryLists: obj => {
      dispatch(ExperienceActions.getCategoryLists(obj));
    },
    onAddEvent: obj => {
      dispatch(ExperienceActions.addEvent(obj));
    },
    setGeofence: obj => {
      dispatch(ExperienceActions.setGeofence(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEvent);
