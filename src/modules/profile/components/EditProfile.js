import React from 'react';
import { Platform, Alert, StyleSheet, SafeAreaView, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import CameraRoll from '@react-native-community/cameraroll';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
const moment = require('moment');
// Import actions
import { connect } from 'react-redux';
import ExperienceActions from '../../experience/reducers/event';
// Load theme
import theme from '../../core/theme';
const { images, font, gradients } = theme;
// Load utils
import { Loading } from '../../../utils';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { getResizeImage } from '../../../utils/funcs';
// Load common styles
import { SelectPhotoModal, StyledButtonOverlay, StyledButton, StyledWrapper } from '../../core/common.styles';

const COMPONENT_WIDTH = wp('41.66%');

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

const StyledContainer = styled.View`
  flex: 1;
`;

const StyledCoverImage = styled(FastImage)`
  width: 100%;
  height: ${hp('31.25%')};
`;

const StyledInputsWrapper = styled.View`
  padding-left: ${wp('6.66%')};
  padding-right: ${wp('6.66%')};
`;

const StyledHeader = styled.View`
  width: 100%;
`;

const BackButton = props => (
  <StyledButton marginLeft={-12} {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#ffffff'} />
  </StyledButton>
);

const StyledSaveText = styled.Text`
  font-size: ${wp('3.8%')};
  color: #ffffff;
  font-family: ${font.MBold};
`;

const SaveButton = props => (
  <StyledButton {...props}>
    <StyledSaveText>{'Save'}</StyledSaveText>
  </StyledButton>
);

const StyledEidtText = styled.Text`
  font-size: ${wp('5%')};
  color: #ffffff;
  font-family: ${font.MSemiBold};
`;

const Header = props => (
  <StyledHeader>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={gradients.BackgroundLightGreen}
      style={styles.headerContainer}
    >
      <SafeAreaView>
        <StyledWrapper row primary={'space-between'} secondary={'center'}>
          <BackButton onPress={props.onGoBack} />
          <StyledEidtText>{'Edit Profile'}</StyledEidtText>
          <SaveButton onPress={props.onSave} />
        </StyledWrapper>
      </SafeAreaView>
    </LinearGradient>
  </StyledHeader>
);

const StyledCoverImageCameraButton = styled.TouchableOpacity`
  position: absolute;
  right: 4;
  bottom: 4;
`;

const CoverImageCameraButton = props => (
  <StyledCoverImageCameraButton {...props}>
    <CustomIcon name={'Common-CamPlus-Navbar_40x40px'} size={36} color={'#fff'} />
  </StyledCoverImageCameraButton>
);

const StyledAvatarButton = styled.TouchableOpacity`
  position: absolute;
  width: ${wp('27.6%')};
  height: ${wp('27.6%')};
  border-radius: ${wp('14.8%')};
  bottom: ${-wp('13.8%')};
  align-self: center;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
`;

const StyledAvatar = styled(FastImage)`
  width: ${wp('25.6%')};
  height: ${wp('25.6%')};
  border-radius: ${wp('12.8%')};
`;

const StyledAvatarCameraWrapper = styled.View`
  position: absolute;
  height: 100%;
  justify-content: flex-end;
  padding-bottom: 10;
`;

const AvatarButton = props => (
  <StyledAvatarButton onPress={props.onPress}>
    <StyledAvatar source={{ uri: props.uri }} />
    <StyledAvatarCameraWrapper>
      <CustomIcon name={'Common-CamPlus-Navbar_40x40px'} size={24} color={'#fff'} />
    </StyledAvatarCameraWrapper>
    <Text
      style={{ color: theme.colors.aquaColor, fontSize: wp('4%'), position: 'absolute', top: 0, left: wp('5%') }}
    >{`✷`}</Text>
  </StyledAvatarButton>
);

const StyleBirthdayTitleText = styled.Text`
  font-size: ${wp('2.5%')};
  color: #9a999b;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-bottom: 8;
`;

const StyleBirthdayButton = styled.TouchableOpacity`
  width: ${COMPONENT_WIDTH};
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
  font-size: ${wp('3.61%')};
  color: #2f2f2f;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const BirthdayButton = props => (
  <StyleBirthdayButton {...props}>
    <StyledBithdayText>{props.birthday}</StyledBithdayText>
    <CustomIcon name={'expand_more-24px'} size={20} color={'#2f2f2f'} />
  </StyleBirthdayButton>
);

const SelectBithday = props => (
  <StyledWrapper>
    <StyleBirthdayTitleText>{'Birthday*'}</StyleBirthdayTitleText>
    <BirthdayButton {...props} isValidated={props.isValidated} />
  </StyledWrapper>
);

const InputText = ({ marginTop, width, label, keyboardType, onChangeText, val }) => (
  <TextField
    autoCorrect={false}
    enablesReturnKeyAutomatically={true}
    onChangeText={onChangeText}
    keyboardType={keyboardType || 'phone-pad'}
    label={label}
    value={val}
    contentInset={{ input: 4, top: 0 }}
    tintColor={'#9A999B'}
    baseColor={'#9A999B'}
    activeLineWidth={0.5}
    disabledLineWidth={2}
    fontSize={wp('3.61%')} // the size of static label(initial lable || big label)
    labelFontSize={wp('2.5%')} // the size of top label(small label)
    inputContainerStyle={[styles.inputContainerStyle, { width: width || '100%', marginTop: marginTop || 0 }]}
    labelTextStyle={styles.labelTextStyle}
    style={[styles.textInputStyle]}
    underlineColorAndroid={'transparent'}
    autoCapitalize={'none'}
  />
);

const SelectGender = ({ gender, onChangeGender, val }) => (
  <StyledWrapper>
    <StyleBirthdayTitleText>{'Gender*'}</StyleBirthdayTitleText>
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

const StyledBirthdayErrorText = styled.Text`
  font-size: ${hp('1.2%')};
  color: #ff7c78;
  width: ${wp('47%')};
  margin-top: ${wp('2.22%')};
`;

class EditProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.profileData = this.props.navigation.getParam('data', 'default');
    const {
      first_name,
      last_name,
      user_name,
      profile_img,
      coverPhoto,
      tellus,
      age,
      gender,
      profile_img_la,
    } = this.profileData;

    this.state = {
      name: '',
      about: '',
      coverPhoto: coverPhoto ? { uri: coverPhoto } : '',
      profile_img: profile_img_la ? { uri: profile_img_la } : '',
      first_name: first_name || '',
      last_name: last_name || '',
      tellus: tellus || '',
      user_name: user_name || '',
      loading: false,
      isSlectPhotoModalVisible: false,
      imageType: 'coverPhoto',

      isDateTimePickerVisible: false,
      birthday: age,
      formattedBirthday: age ? moment(age).format('DD.MM.YYYY') : '',
      gender: gender || '',
      isValidatedDOB: true,
    };
  }

  componentDidMount() {
    // this.saveProfileData();
  }

  // saveProfileData = () => {
  //   const { first_name, last_name, user_name, profile_img, coverPhoto, tellus } = this.profileData;
  //   this.setState({
  //     profile_img: { uri: profile_img },
  //     first_name: first_name,
  //     last_name: last_name,
  //     user_name: user_name,
  //     coverPhoto: { uri: coverPhoto },
  //     tellus: tellus,
  //   });
  // };

  /**
   * Take photo
   *
   */

  onTakePhoto = () => {
    this.onCanclePhotoModal();
    setTimeout(() => {
      this.handleTakephoto();
    }, 500);
  };

  handleTakephoto = async () => {
    const { imageType } = this.state;
    try {
      // Get the info of taken image
      let options = {
        mediaType: 'image',
        cropping: true,
      };
      if (imageType === 'coverPhoto') {
        options = {
          mediaType: 'image',
          cropping: true,
          width: 400,
          height: 300,
        };
      }

      const image = await ImagePicker.openCamera(options);

      // Save image to the Camera Roll ===> get uri like 'ph://...'
      const savedImageUri = await CameraRoll.saveToCameraRoll(image.path, 'photo');
      // Convert the access Platform === iOS
      let imageWidth = image.width;
      let imageHeight = image.height;
      let uploadngImageUri;
      if (Platform.OS === 'ios') {
        uploadngImageUri = 'ph-upload' + savedImageUri.substring(2);
      } else {
        uploadngImageUri = savedImageUri;
      }
      getResizeImage(uploadngImageUri, imageWidth, imageHeight, 100).then(res => {
        this.setState({
          [imageType]: {
            uri: res.uri,
            fileName: res.name,
            size: res.size,
          },
          isActive: true,
        });
      });
    } catch (error) {}
  };

  onUpdate = async () => {
    const obj = new FormData();
    obj.append('first_name', this.state.first_name);
    obj.append('last_name', this.state.last_name);
    obj.append('tellus', this.state.tellus);
    obj.append('gender', this.state.gender);
    obj.append('age', this.state.birthday);
    obj.append('token', this.props.auth.access_token);
    obj.append('uid', this.props.auth.uid);
    if (this.state.profile_img) {
      obj.append('profile_img', {
        file: this.state.profile_img.uri,
        name: this.state.profile_img.fileName,
        type: this.state.profile_img.type != undefined ? this.state.profile_img.type : 'image/jpeg',
        size: this.state.profile_img.size,
        mime: this.state.profile_img.mime,
        path: this.state.profile_img.path,
        uri: Platform.OS === 'android' ? this.state.profile_img.uri : this.state.profile_img.uri.replace('file://', ''),
      });
    }
    if (this.state.coverPhoto) {
      obj.append('coverPhoto', {
        file: this.state.coverPhoto.uri,
        name: this.state.coverPhoto.fileName,
        type: this.state.coverPhoto.type !== undefined ? this.state.coverPhoto.type : 'image/jpeg',
        size: this.state.coverPhoto.size,
        mime: this.state.coverPhoto.mime,
        path: this.state.coverPhoto.path,
        uri: Platform.OS === 'android' ? this.state.coverPhoto.uri : this.state.coverPhoto.uri.replace('file://', ''),
      });
    }
    this.setState({ loading: true });
    let profileObj = {
      formData: obj,
      onSuccess: () => this._redirectViewProfile(),
      onFail: () => {
        this.setState({ loading: false });
        Alert.alert('Warning', 'Profile update unsuccessful', [{ text: 'OK' }], {
          cancelable: false,
        });
      },
    };
    this.props.onUpdateProfile(profileObj);
  };

  _redirectViewProfile = () => {
    this.setState({ loading: false });
    Alert.alert(
      'Success',
      'Profile update successful',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
      {
        cancelable: false,
      }
    );
  };

  onSave = () => {
    const { tellus } = this.state;
    // if (!tellus) {
    //   return Alert.alert('Warning', 'Tell us field cannot be empty', [{ text: 'OK' }], {
    //     cancelable: false,
    //   });
    // }
    this.onUpdate();
  };

  /**
   * Open and close Photo modal
   *
   */

  onOpenPhotoModal = option => {
    this.setState(prevState => ({
      isSlectPhotoModalVisible: true,
      imageType: option,
    }));
  };

  onCanclePhotoModal = () => {
    this.setState({
      isSlectPhotoModalVisible: false,
    });
  };

  /**
   * Select cover photo
   *
   */

  onSelectImage = () => {
    const { imageType } = this.state;
    this.onCanclePhotoModal();
    let options = {
      multiple: false,
      cropping: true,
    };
    if (imageType === 'coverPhoto') {
      options = {
        multiple: false,
        cropping: true,
        width: 400,
        height: 300,
      };
    }

    setTimeout(() => {
      ImagePicker.openPicker(options)
        .then(image => {
          getResizeImage(image.path).then(res => {
            this.setState({
              [imageType]: {
                uri: res.uri,
                fileName: res.name,
                size: res.size,
              },
              isActive: true,
            });
          });
        })
        .catch(() => {});
    }, 500);
  };

  onGoback = () => {
    this.props.navigation.goBack();
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

  onChangeGender = value => {
    this.setState({
      gender: _.isEmpty(value) ? null : value,
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
    const {
      loading,
      profile_img,
      coverPhoto,
      first_name,
      last_name,
      tellus,
      birthday,
      formattedBirthday,
      gender,
      isValidatedDOB,
      isSlectPhotoModalVisible,
      isDateTimePickerVisible,
    } = this.state;

    const initialDate = formattedBirthday ? moment(formattedBirthday, 'DD.MM.YYYY').valueOf() : moment();

    return (
      <>
        {!loading ? (
          <StyledContainer>
            <Header onGoBack={this.onGoback} onSave={this.onSave} />
            <KeyboardAwareScrollView scrollEnabled={true}>
              <StyledWrapper width={wp('100%')} zIndex={1}>
                <StyledCoverImage source={coverPhoto.uri ? { uri: coverPhoto.uri } : images.PROFILE_COVER} />
                <AvatarButton
                  iconSize={25}
                  uri={profile_img.uri}
                  onPress={() => this.onOpenPhotoModal('profile_img')}
                />
                <CoverImageCameraButton onPress={() => this.onOpenPhotoModal('coverPhoto')} />
              </StyledWrapper>

              <StyledInputsWrapper>
                <StyledWrapper row width={'100%'} primary={'space-between'} marginTop={wp('15.605%')}>
                  <InputText
                    width={COMPONENT_WIDTH}
                    label={'First Name*'}
                    keyboardType={'default'}
                    onChangeText={text =>
                      this.setState({
                        first_name: text,
                      })
                    }
                    val={first_name}
                  />
                  <InputText
                    width={COMPONENT_WIDTH}
                    label="Last Name*"
                    onChangeText={text =>
                      this.setState({
                        last_name: text,
                      })
                    }
                    val={last_name}
                    keyboardType={'default'}
                  />
                </StyledWrapper>

                <StyledWrapper row width={'100%'} primary={'space-between'} marginTop={wp('4.44%')}>
                  <SelectBithday
                    birthday={formattedBirthday || 'Age'}
                    onPress={this.onShowDatePicker}
                    isValidated={isValidatedDOB}
                  />
                  <SelectGender
                    gender={gender}
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

                <StyledWrapper width={'100%'} marginTop={wp('4.44%')}>
                  <InputText
                    width={'100%'}
                    label={'Tell us about yourself'}
                    keyboardType={'default'}
                    onChangeText={text =>
                      this.setState({
                        tellus: text,
                      })
                    }
                    val={tellus}
                  />
                </StyledWrapper>
              </StyledInputsWrapper>

              <SelectPhotoModal
                isModalVisible={isSlectPhotoModalVisible}
                onCancelModal={this.onCanclePhotoModal}
                onSelectImage={this.onSelectImage}
                onTakePhoto={this.onTakePhoto}
              />
              <DateTimePicker
                mode={'date'}
                isVisible={isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                locale="en_GB"
                date={new Date(initialDate)}
              />
            </KeyboardAwareScrollView>
          </StyledContainer>
        ) : (
          <Loading />
        )}
      </>
    );
  }
}

const mapStateTopProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: obj => {
      dispatch(ExperienceActions.profileUpdate(obj));
    },
  };
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: COMPONENT_WIDTH,
    height: wp('10%'),
    borderRadius: wp('5%'),
    fontSize: wp('3.61%'),
    color: '#2f2f2f',
    fontFamily: font.MRegular,
    fontWeight: '500',
    backgroundColor: '#f8f8f8',
    paddingLeft: wp('5.4%'),
  },
  inputAndroid: {
    width: COMPONENT_WIDTH,
    height: wp('10%'),
    borderRadius: wp('5%'),
    fontSize: wp('3.61%'),
    color: '#2f2f2f',
    fontFamily: font.MRegular,
    fontWeight: '500',
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
  headerContainer: {
    paddingVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
  labelTextStyle: {
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#9A999B',
  },
  textInputStyle: {
    fontSize: wp('3.61%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(EditProfile);
