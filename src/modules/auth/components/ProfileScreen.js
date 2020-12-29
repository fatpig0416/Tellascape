import React, { Component } from 'react';
import { View, StyleSheet, Alert, Platform, Linking, ActivityIndicator, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-community/cameraroll';
import RNPickerSelect from 'react-native-picker-select';
import { TextField } from 'react-native-material-textfield';
import _ from 'lodash';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomIcon from '../../../utils/icon/CustomIcon';
import AsyncStorage from '@react-native-community/async-storage';

import AuthActions from '../reducers/index';
import { createStructuredSelector } from 'reselect';
import {
  selectProvider,
  selectAccessToken,
  selectFirstName,
  selectLastName,
  selectUserName,
  selectEmail,
  selectPhoneNumber,
  selectPhoto,
  selectGender,
  selectAge,
} from '../reducers';
import theme from '../../core/theme';
import Constants from '../../core/Constants';
import { validateEmail, getResizeImage } from '../../../utils/funcs';
const moment = require('moment');

import {
  StyledView,
  StyledLogoInner,
  StyledLogoImage,
  StyledHorizontalContainer,
  StyledCenterContainer,
  StyledText,
  StyledButton,
  StyledActivityIndicator,
  SelectPhotoModal,
  StyledWrapper,
} from '../../core/common.styles';
import GradientButton from '../../core/GradientButton';

const { font, colors, images } = theme;

const GENDERS_DATA = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

const StyledContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.PaleGrey};
`;

const StyledButtonWrapper = styled.View`
  width: ${wp('28%')};
  height: ${wp('28%')};
  border-radius: ${wp('15.1%')};
  background-color: ${colors.White};
  box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.32);
  elevation: 10;
`;

const StyledAvatar = styled.Image`
  width: ${wp('28%')};
  height: ${wp('28%')};
  border-radius: ${wp('15.1%')};
  resize-mode: cover;
`;

const InputText = ({ marginTop, width, label, keyboardType, onChangeText, val }) => (
  <TextField
    autoCorrect={false}
    enablesReturnKeyAutomatically={true}
    onChangeText={onChangeText}
    keyboardType={keyboardType || 'phone-pad'}
    label={label}
    value={val}
    contentInset={{ input: 4, top: 0 }}
    tintColor={'#5E5E5E'}
    baseColor={'#9A999B'}
    activeLineWidth={0.5}
    disabledLineWidth={2}
    fontSize={hp('1.4%')} // the size of static label(initial lable || big label)
    labelFontSize={hp('1.3%')} // the size of top label(small label)
    inputContainerStyle={[styles.inputContainerStyle, { width: width || '100%', marginTop: marginTop || 0 }]}
    labelTextStyle={styles.labelTextStyle}
    style={[styles.textInputStyle]}
    underlineColorAndroid={'transparent'}
    autoCapitalize={'none'}
    renderLeftAccessory={() => <Text style={{ color: theme.colors.aquaColor, fontSize: wp('4%') }}>{`✷ `}</Text>}
  />
);

const StyleBirthdayTitleText = styled.Text`
  font-size: ${hp('1.3%')};
  color: #9a999b;
  font-family: ${font.MRegular};
  margin-bottom: 8;
`;

const SelectGender = ({ gender, onChangeGender, val }) => (
  <StyledWrapper>
    <StyleBirthdayTitleText>
      <Text style={{ color: theme.colors.aquaColor, fontSize: wp('4%') }}>{`✷ `}</Text>
      {'Gender'}
    </StyleBirthdayTitleText>
    <RNPickerSelect
      placeholder={{
        label: 'Select',
        value: { val },
      }} // Placeholder of the TextInput
      items={GENDERS_DATA} // Array constant for genders
      onValueChange={onChangeGender}
      style={pickerSelectStyles}
      value={gender}
      useNativeAndroidPickerStyle={false}
      Icon={() => {
        return <CustomIcon name={'expand_more-24px'} size={20} color={'#2f2f2f'} />;
      }}
    />
  </StyledWrapper>
);

const StyleBirthdayButton = styled.TouchableOpacity`
  width: ${wp('36%')};
  height: ${wp('10%')};
  padding-left: ${wp('5.4%')};
  padding-right: ${wp('5.4%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: ${wp('5%')};
  background-color: #f8f8f8;
  border-width: ${props => (props.isValidated ? 0 : 0.5)};
  border-color: #ff2525;
`;

const StyledBithdayText = styled.Text`
  font-size: ${hp('1.5%')};
  color: #2f2f2f;
  font-family: ${font.MRegular};
`;

const BirthdayButton = props => (
  <StyleBirthdayButton {...props}>
    <StyledBithdayText>{props.birthday}</StyledBithdayText>
    <CustomIcon name={'expand_more-24px'} size={20} color={'#2f2f2f'} />
  </StyleBirthdayButton>
);

const StyledBirthdayErrorText = styled.Text`
  font-size: ${hp('1.2%')};
  color: #ff7c78;
  width: ${wp('47%')};
  margin-top: 8;
`;

const SelectBithday = props => (
  <StyledWrapper>
    <StyleBirthdayTitleText>
      <Text style={{ color: theme.colors.aquaColor, fontSize: wp('4%') }}>{`✷ `}</Text>
      {'Birthday'}
    </StyleBirthdayTitleText>
    <BirthdayButton {...props} isValidated={props.isValidated} />
  </StyledWrapper>
);

const StyledBoxView = styled.View`
  width: ${wp('84.5%')};
  align-items: center;
  justify-content: center;
  background-color: ${colors.White};
  border-radius: 15;
  padding-left: ${wp('4%')};
  padding-right: ${wp('4%')};
  padding-top: ${wp('10.5%')};
  padding-bottom: ${wp('10.5%')};
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.23);
`;

const StyledStartedText = styled.Text`
  font-size: ${hp('3.8%')};
  color: ${colors.Black};
  font-family: ${font.MSemiBold};
  font-weight: 600;
  text-align: center;
`;

const StyledProfleText = styled.Text`
  font-size: ${hp('1.7%')};
  font-family: ${font.MMedium};
  font-weight: 500;
  color: #4d4d4d;
  margin-top: ${hp('1.1%')};
`;

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.inputGenderRef = null;
    this.state = {
      avatarSource: '',
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      gender: '',
      birthday: undefined,
      formattedBirthday: undefined,
      isValidatedDOB: true,
      isCheckingUsername: false,
      isNewProfile: true,
      isSlectPhotoModalVisible: false,
      isDateTimePickerVisible: false,
      access_token: false,
    };
  }

  componentDidMount() {
    const isNewProfile =
      _.isEmpty(this.props.userPhoto) &&
      _.isEmpty(this.props.userName) &&
      _.isEmpty(this.props.firstName) &&
      _.isEmpty(this.props.lastName) &&
      _.isEmpty(this.props.email) &&
      _.isEmpty(this.props.gender) &&
      _.isEmpty(this.props.age);

    if (!isNewProfile)
      this.setState({
        avatarSource: { uri: this.props.userPhoto },
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        userName: this.props.userName,
        email: this.props.email,
        gender: this.props.gender,
        birthday: this.props.age,
        formattedBirthday: this.props.age !== null ? moment(this.props.age).format('DD.MM.YYYY') : '',
        isNewProfile,
      });
  }

  onChangeFirstName = text => {
    this.setState({
      firstName: text,
    });
  };

  onChangeLastName = text => {
    this.setState({
      lastName: text,
    });
  };

  onChangeUserName = text => {
    this.setState({
      userName: text,
    });
  };

  onChangeEmail = text => {
    this.setState({
      email: text,
    });
  };

  onChangeGender = value => {
    this.setState({
      gender: _.isEmpty(value) ? null : value,
    });
  };

  validateInfo = () => {
    const { firstName, lastName, userName, email, gender, birthday, isValidatedDOB } = this.state;

    if (
      firstName !== '' &&
      lastName !== '' &&
      userName !== '' &&
      validateEmail(email) &&
      !!gender &&
      isValidatedDOB &&
      birthday
    ) {
      return true;
    }

    return false;
  };

  verifyUsername = () => {
    if (this.validateInfo()) {
      this.setState({
        isCheckingUsername: true,
      });

      let obj = {
        token: this.props.accessToken,
        user_name: this.state.userName,
        verifyUsernameSucess: this.verifyUsernameSucess,
        verifyUsernameFailure: this.verifyUsernameFailure,
      };

      this.props.onVerifyUsername(obj);
    } else {
      Alert.alert('Warning', 'Please type the correct infos.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  verifyUsernameSucess = () => {
    const { userName } = this.state;
    this.setState({
      access_token: this.props.accessToken,
    });
    AsyncStorage.setItem('user_name', userName);
    setTimeout(() => {
      this.onStartJourney();
    }, 100);
  };

  verifyUsernameFailure = () => {
    Alert.alert('Warning', 'The username you entered is not valid.', [{ text: 'OK' }], {
      cancelable: false,
    });

    this.setState({
      isCheckingUsername: false,
    });
  };

  onStartJourney = async () => {
    const { firstName, lastName, userName, gender, avatarSource, email, birthday } = this.state;
    const data = new FormData();
    data.append('token', this.state.access_token);
    data.append('_method', 'PUT');
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    data.append('user_name', userName);
    data.append('email', email);
    data.append('gender', gender);
    data.append('age', birthday);
    try {
      data.append('profile_img', {
        file: avatarSource.uri,
        name: avatarSource.fileName,
        type: avatarSource.type !== undefined ? avatarSource.type : 'image/jpeg',
        size: avatarSource.size,
        mime: avatarSource.mime,
        path: avatarSource.path,
        uri: Platform.OS === 'android' ? avatarSource.uri : avatarSource.uri.replace('file://', ''),
      });
    } catch (e) {
      console.log(`Error with Profile Photo ${JSON.stringify(e)}`);
    }

    await this.props.onUpdateProfile(data);
  };

  /**
   * Open and close Photo modal
   *
   */

  onOpenPhotoModal = () => {
    this.setState({
      isSlectPhotoModalVisible: true,
    });
  };

  onCanclePhotoModal = () => {
    this.setState({
      isSlectPhotoModalVisible: false,
    });
  };

  /**
   * Select profile photo
   *
   */

  onSelectImage = () => {
    this.onCanclePhotoModal();

    setTimeout(() => {
      ImagePicker.openPicker({
        multiple: false,
        cropping: true,
      })
        .then(image => {
          getResizeImage(image.path).then(res => {
            this.setState({
              avatarSource: {
                uri: res.uri,
                fileName: res.name,
                size: res.size,
              },
              isActive: true,
            });
          });
        })
        .catch(error => {
          Alert.alert('Tellascape', error.message, [
            {
              text: 'OK',
            },
            {
              text: 'Open Setting',
              onPress: () => Linking.openSettings(),
            },
          ]);
        });
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
        cropping: true,
      }).catch(error => {
        Alert.alert('Tellascape', error.message, [
          {
            text: 'OK',
          },
          {
            text: 'Open Setting',
            onPress: () => Linking.openSettings(),
          },
        ]);
      });
      if (image && image !== null) {
        // Save image to the Camera Roll ===> get uri like 'ph://...'
        const savedImageUri = await CameraRoll.saveToCameraRoll(image.path, 'photo');
        // Convert the access Platform === iOS
        let uploadngImageUri;
        if (Platform.OS === 'ios') {
          uploadngImageUri = 'ph-upload' + savedImageUri.substring(2);
        } else {
          uploadngImageUri = savedImageUri;
        }
        getResizeImage(uploadngImageUri).then(res => {
          this.setState({
            avatarSource: {
              uri: res.uri,
              fileName: res.name,
              size: res.size,
            },
            isActive: true,
          });
        });
      }
    } catch (error) {}
  };

  onTakePhoto = () => {
    this.onCanclePhotoModal();

    setTimeout(() => {
      this.handleTakePhoto();
    }, 500);
  };

  onShowDatePicker = () => {
    this.setState({
      isDateTimePickerVisible: true,
    });
  };

  hideDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: false,
    });
  };

  handleDatePicked = date => {
    const parsedDate = moment(date).format('YYYY-MM-DD');
    const formattedDate = moment(date).format('DD.MM.YYYY');
    const now = new Date();
    const currentYear = now.getFullYear();
    const bornYear = moment(date).year();
    const isValidatedDOB = currentYear - bornYear > 18;
    this.setState({
      birthday: parsedDate,
      formattedBirthday: formattedDate,
      isValidatedDOB,
    });
    this.hideDateTimePicker();
  };

  render() {
    const { avatarSource, gender, isCheckingUsername, formattedBirthday, isValidatedDOB } = this.state;
    const initialDate = formattedBirthday ? moment(formattedBirthday, 'DD.MM.YYYY').valueOf() : moment();
    return (
      <KeyboardAwareScrollView scrollEnabled={true} contentContainerStyle={styles.scrollConatiner}>
        <StyledContainerView>
          {/** Login box */}
          <StyledBoxView elevation={1}>
            <StyledLogoInner />
            <StyledLogoImage source={images.LOGO} />

            <StyledStartedText>{'Get Started'}</StyledStartedText>

            <StyledWrapper row primary={'center'} marginTop={hp('2.1875%')}>
              <StyledButton
                onPress={this.onOpenPhotoModal}
                style={[avatarSource.uri == null ? { borderRadius: wp('15.1%') } : null]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: theme.colors.aquaColor, fontSize: wp('4%') }}>{`✷`}</Text>
                  <View style={[styles.avtarContainer, { marginLeft: -wp('4%') }]}>
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator />
                    </View>
                    <StyledAvatar
                      source={_.isEmpty(avatarSource) || avatarSource.uri === null ? images.PROFILE : avatarSource}
                      // source={images.PROFILE}
                    />
                  </View>
                </View>
              </StyledButton>
            </StyledWrapper>

            <StyledProfleText>{'Select a Profile Picture'}</StyledProfleText>

            <StyledWrapper row width={'100%'} primary={'space-between'} marginTop={hp('3.2%')}>
              <InputText
                width={wp('36.1%')}
                label={'First Name'}
                keyboardType={'default'}
                onChangeText={this.onChangeFirstName}
                val={this.props.firstName || this.state.firstName}
              />
              <InputText
                width={wp('36.1%')}
                label="Last Name"
                onChangeText={this.onChangeLastName}
                keyboardType={'default'}
                val={this.props.lastName || this.state.lastName}
              />
            </StyledWrapper>
            <InputText
              label="Choose a Username"
              onChangeText={this.onChangeUserName}
              keyboardType={'default'}
              val={this.props.userName || this.state.userName}
              marginTop={hp('2.5%')}
            />
            <InputText
              label="Email"
              onChangeText={this.onChangeEmail}
              keyboardType={'email-address'}
              val={this.props.email || this.state.email}
              marginTop={hp('2.5%')}
            />
            <StyledWrapper row width={'100%'} primary={'space-between'} marginTop={hp('2.5%')}>
              <SelectBithday
                birthday={formattedBirthday || 'Age'}
                onPress={this.onShowDatePicker}
                isValidated={isValidatedDOB}
              />
              <SelectGender
                gender={this.state.gender}
                onChangeGender={this.onChangeGender}
                // val={this.state.gender}
              />
            </StyledWrapper>

            {!isValidatedDOB ? (
              <StyledWrapper width={'100%'}>
                <StyledBirthdayErrorText>
                  {"Oops. You aren't quite 18 years old. Keep living life and and join us soon!"}
                </StyledBirthdayErrorText>
              </StyledWrapper>
            ) : null}
          </StyledBoxView>

          {/**
           * Gradient button
           *
           */}
          <GradientButton
            width={avatarSource === images.PROFILE ? wp('41.5%') : wp('71.5%')}
            height={hp('4.9%')}
            onPress={!isCheckingUsername ? this.verifyUsername : null}
            isActive={
              this.state.avatarSource &&
              this.state.firstName &&
              this.state.lastName &&
              this.state.userName &&
              this.state.gender &&
              this.state.email
            }
          >
            {isCheckingUsername ? (
              <StyledActivityIndicator size={'small'} color={colors.White} />
            ) : (
              <StyledText fontSize={hp('1.7%')} color={colors.White} fontWeight={'500'} fontFamily={font.MMedium}>
                {this.state.isNewProfile ? 'Get Started' : 'Sign In'}
              </StyledText>
            )}
          </GradientButton>

          <SelectPhotoModal
            isModalVisible={this.state.isSlectPhotoModalVisible}
            onCancelModal={this.onCanclePhotoModal}
            onSelectImage={this.onSelectImage}
            onTakePhoto={this.onTakePhoto}
          />
        </StyledContainerView>

        <DateTimePicker
          mode={'date'}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          locale="en_GB"
          date={new Date(initialDate)}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: wp('36%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    fontSize: hp('1.5%'),
    color: '#2f2f2f',
    fontFamily: font.MRegular,
    backgroundColor: '#f8f8f8',
    paddingLeft: wp('5.4%'),
  },
  inputAndroid: {
    width: wp('36%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    fontSize: hp('1.5%'),
    color: '#2f2f2f',
    fontFamily: font.MRegular,
    backgroundColor: '#f8f8f8',
    paddingLeft: wp('5.4%'),
  },
  iconContainer: {
    top: hp('1.25'),
    right: wp('5.4%'),
  },
});

const styles = StyleSheet.create({
  scrollConatiner: {
    flex: 1,
  },
  labelTextStyle: { fontFamily: font.MRegular },
  textInputStyle: {
    fontFamily: font.MRegular,
    color: '#2f2f2f',
    fontSize: hp('1.7%'),
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
  avtarContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: wp('16%'),
    marginTop: -hp('1%'),
    zIndex: -1,
  },
  loaderContainer: {
    position: 'absolute',
  },
});

const mapStateToProps = createStructuredSelector({
  provider: selectProvider,
  accessToken: selectAccessToken,
  phone: selectPhoneNumber,
  email: selectEmail,
  firstName: selectFirstName,
  lastName: selectLastName,
  userName: selectUserName,
  userPhoto: selectPhoto,
  gender: selectGender,
  age: selectAge,
});

const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: obj => {
      dispatch(AuthActions.updateProfile(obj));
    },
    onVerifyUsername: obj => {
      dispatch(AuthActions.verifyUsername(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
