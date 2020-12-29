import React, { PureComponent } from 'react';
import { Platform, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import CameraRoll from '@react-native-community/cameraroll';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ExperienceActions from '../reducers/event/index';
import StationActions from '../reducers/station';
import MemoryActions from '../reducers/memory';
import uuid from 'uuid';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomIcon from '../../../utils/icon/CustomIcon';
import _ from 'lodash';
import { getUserCurrentLocation, getResizeImage } from '../../../utils/funcs';
import {
  StyledCameraContainer,
  StyledCameraBottomContainer,
  StyledCameraShutterButton,
  StyledHorizontalContainer,
  CameraCancelButton,
} from '../../core/common.styles';
// Load utils
import { Loading } from '../../../utils';

// Load theme
import theme from '../../core/theme';
const { font } = theme;
import ImageResizer from 'react-native-image-resizer';
import { DEVICE_WIDTH } from '../../../utils';

const ShutterButton = props => (
  <StyledCameraShutterButton {...props}>
    <CustomIcon name={'Shutter_50x50px'} size={hp('7.5%')} color={'#f53332'} />
  </StyledCameraShutterButton>
);

const StyledFlashButton = styled.TouchableOpacity`
  position: absolute;
  left: ${wp('2.2%')};
  top: ${isIphoneX ? 41 : 11};
  width: ${wp('11%')};
  height: ${wp('5.5%')};
  background-color: #ffcc00;
  justify-content: center;
  align-items: center;
`;
const StyledCameraFlipButton = styled.TouchableOpacity`
  position: absolute;
  right: ${wp('2.2%')};
  top: ${isIphoneX ? 41 : 11};
  width: ${wp('15%')};
  height: ${wp('11%')};
  background-color: #ffcc00;
  justify-content: center;
  align-items: center;
`;
const FlashButton = props => (
  <StyledFlashButton {...props}>
    <CustomIcon name={props.isFlashOn ? 'flash-on_16x16px' : 'flash-off_16x16px'} size={wp('3.4%')} color={'#615c54'} />
  </StyledFlashButton>
);
const CameraFlipButton = props => (
  <TouchableOpacity onPress={props.onPress}>
    <CustomIcon name={'Flip_40x40px'} size={hp('4%')} color={'#ffffff'} />
  </TouchableOpacity>
);
const StyledPendingWrapper = styled.View`
  flex: 1;
  width: ${wp('100%')};
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const StyledPendingText = styled.Text`
  font-size: ${hp('2.4%')};
  font-family: ${font.MRegular};
  color: ${props => props.color || '#ffffff'};
  text-align: center;
`;

class TakeImage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFlashOn: false,
      loading: false,
      inGeoFence: false,
      cameraType: 'back',
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        format: 'jpg',
        quality: 1.0,
        base64: false,
        width: DEVICE_WIDTH,
      };
      // const { base64, width, height, ...imageObj } = await this.camera.takePictureAsync(options);
      const imgData = await this.camera.takePictureAsync(options);
      const { uri, width, height } = imgData;

      this.handleImageUpload(uri);
      this.props.setLiveEventImage(imgData);
      // this.props.navigation.replace('ImageFilter');
      // ImageResizer.createResizedImage(imageObj.uri, width, height, 'JPEG', 100)
      //   .then(response => {
      //     this.props.setLiveEventImage(response);
      //     this.props.navigation.replace('ImageFilter');
      //   })
      //   .catch(err => {
      //     console.log('ERROR === ', err);
      //   });

    }
  };

  handleImageUpload = async (uri) => {
    // const uri = await this.viewShot.capture().then(uri => {
    //   return uri;
    // });
    const savedImageUri = await CameraRoll.saveToCameraRoll(uri, 'photo');
    const { activeStation } = this.props.station;
    const { activeMemory } = this.props.memory;
    if (activeStation !== null) {
      if (this.props.station_data && this.props.station_data.length > 0) {
        this.uploadStationImage(uri);
      }
    } else if (activeMemory !== null) {
      if (this.props.memory_data && this.props.memory_data.length > 0) {
        this.uploadMemoryImage(uri);
      }
    } else {
      if (this.props.event_data && this.props.event_data.length > 0) {
        this.uploadEventImage(uri);
      }
    }
  };

  uploadEventImage = async uri => {
    let location = await getUserCurrentLocation();
    const { parentID, child_ID, type, myChildID } = this.props.event_data[0];
    const obj = new FormData();
    if (uri) {
      let imageID = uuid.v4();
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${imageID}.jpg`,
        size: 1 * 1024 * 1024,
        mime: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);

      //upload image data
      let imgObj = {
        formData: obj,
        type: type,
        reqMediaId: imageID,
        onSuccess: response => {
          const { localExperience } = this.props.experience;
          let newArray = [];
          localExperience.map((item, index) => {
            if (item.req_media_id === response.req_media_id) {
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalExperience(newArray);
        },
        onFail: (req_media_id, formData) => {
          const { localExperience } = this.props.experience;
          let newArray = [];
          localExperience.map((item, index) => {
            if (item.req_media_id === req_media_id) {
              let obj = {
                req_media_id: req_media_id,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'fail',
                percent: 0,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalExperience(newArray);
        },
        onProcess: (progressEvent, reqMediaId, formData) => {
          const percentFraction = progressEvent.loaded / progressEvent.total;
          const percent = Math.floor(percentFraction * 100);

          const { localExperience } = this.props.experience;
          let newArray = [];
          localExperience.map((item, index) => {
            if (item.req_media_id === reqMediaId) {
              let obj = {
                req_media_id: reqMediaId,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'pending',
                percent: percent,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });

          this.props.setLocalExperience(newArray);
        },
      };

      const { localExperience } = this.props.experience;
      let tempData = [];
      let localObj = {
        req_media_id: imageID,
        parentID: parentID,
        uri: uri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'image',
      };
      tempData.push(localObj);
      let newArray = [...localExperience, ...tempData];
      this.props.setLocalExperience(newArray);
      // this.props.uploadImage(imgObj);
      this._redirectLiveEvent();
    }
  };

  uploadStationImage = async uri => {
    let location = await getUserCurrentLocation();
    const obj = new FormData();
    const { parentID, child_ID, type, myChildID } = this.props.station_data[0];
    if (uri) {
      let imageID = uuid.v4();
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${imageID}.jpg`,
        size: 1 * 1024 * 1024,
        mime: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);

      //upload image data
      let imgObj = {
        formData: obj,
        type: type,
        reqMediaId: imageID,
        onSuccess: response => {
          const { localStation } = this.props.station;
          let newArray = [];
          localStation.map((item, index) => {
            if (item.req_media_id === response.req_media_id) {
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalStation(newArray);
        },
        onFail: (req_media_id, formData) => {
          const { localStation } = this.props.station;
          let newArray = [];
          localStation.map((item, index) => {
            if (item.req_media_id === req_media_id) {
              let obj = {
                req_media_id: req_media_id,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'fail',
                percent: 0,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalStation(newArray);
        },
        onProcess: (progressEvent, reqMediaId, formData) => {
          const percentFraction = progressEvent.loaded / progressEvent.total;
          const percent = Math.floor(percentFraction * 100);

          const { localStation } = this.props.station;
          let newArray = [];
          localStation.map((item, index) => {
            if (item.req_media_id === reqMediaId) {
              let obj = {
                req_media_id: reqMediaId,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'pending',
                percent: percent,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });

          this.props.setLocalStation(newArray);
        },
      };

      const { localStation } = this.props.station;
      let tempData = [];
      let localObj = {
        req_media_id: imageID,
        parentID: parentID,
        uri: uri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'image',
      };
      tempData.push(localObj);
      let newArray = [...localStation, ...tempData];
      this.props.setLocalStation(newArray);

      // this.props.uploadStationImage(imgObj);
      this._redirectLiveEvent();
    }
  };

  uploadMemoryImage = async uri => {
    let location = await getUserCurrentLocation();
    const obj = new FormData();
    const { parentID, child_ID, type, myChildID } = this.props.memory_data[0];
    if (uri) {
      let imageID = uuid.v4();
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${imageID}.jpg`,
        size: 1 * 1024 * 1024,
        mime: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);

      //upload image data
      let imgObj = {
        formData: obj,
        type: type,
        reqMediaId: imageID,
        onSuccess: response => {
          const { localMemory } = this.props.memory;
          let newArray = [];
          localMemory.map((item, index) => {
            if (item.req_media_id === response.req_media_id) {
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalMemory(newArray);
        },
        onFail: (req_media_id, formData) => {
          const { localMemory } = this.props.memory;
          let newArray = [];
          localMemory.map((item, index) => {
            if (item.req_media_id === req_media_id) {
              let obj = {
                req_media_id: req_media_id,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'fail',
                percent: 0,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });
          this.props.setLocalMemory(newArray);
        },
        onProcess: (progressEvent, reqMediaId, formData) => {
          const percentFraction = progressEvent.loaded / progressEvent.total;
          const percent = Math.floor(percentFraction * 100);

          const { localMemory } = this.props.memory;
          let newArray = [];
          localMemory.map((item, index) => {
            if (item.req_media_id === reqMediaId) {
              let obj = {
                req_media_id: reqMediaId,
                parentID: formData._parts[3][1],
                uri: formData._parts[2][1],
                lat: formData._parts[5][1],
                lng: formData._parts[6][1],
                formData: formData,
                status: 'pending',
                percent: percent,
                mediaType: 'image',
              };
              newArray.push(obj);
            } else {
              newArray.push(item);
            }
          });

          this.props.setLocalMemory(newArray);
        },
      };

      const { localMemory } = this.props.memory;
      let tempData = [];
      let localObj = {
        req_media_id: imageID,
        parentID: parentID,
        uri: uri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'image',
      };
      tempData.push(localObj);
      let newArray = [...localMemory, ...tempData];
      this.props.setLocalMemory(newArray);

      // this.props.uploadMemoryImage(imgObj);
      this._redirectLiveEvent();
    }
  };

  _redirectLiveEvent = () => {
    this.props.navigation.goBack();
    //this.props.navigation.navigate('JoinEvent', { parentID: this.props.event_data[0].parentID });
  };

  // _redirectLiveEvent = () => {
  //   this.props.navigation.navigate('JoinEvent', { parentID: this.props.event_data[0].parentID });

  //   this.setState({
  //     loading: false,
  //   });
  // };

  /**
   * Cancel taking photo
   *
   */
  onCancel = () => {
    this.props.navigation.goBack();
  };

  /**
   * Toggle flash button
   *
   */
  onToggleFlash = () => {
    this.setState(prevState => ({
      isFlashOn: !prevState.isFlashOn,
    }));
  };
  onToggleCameraFlip = () => {
    this.setState(prevState => ({
      cameraType: prevState.cameraType === 'back' ? 'front' : 'back',
    }));
  };
  render() {
    const { isFlashOn, cameraType } = this.state;
    const flashMode = isFlashOn ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off;
    return (
      <>
        {this.state.loading ? (
          <Loading />
        ) : (
            <StyledCameraContainer>
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={cameraType === 'back' ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                flashMode={flashMode}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  console.log(barcodes);
                }}
                zoom={0}
              >
                {({ camera, status, recordAudioPermissionStatus }) => {
                  if (status !== 'READY') {
                    return (
                      <>
                        {status === 'NOT_AUTHORIZED' ? (
                          <StyledPendingWrapper>
                            <StyledPendingText color={'#000'}>
                              {
                                "Camera access was not granted.\n Pleas go to your phone's settings\nand allow camera access"
                              }
                            </StyledPendingText>
                          </StyledPendingWrapper>
                        ) : null}
                        {/** Bottom Section */}
                        <StyledCameraBottomContainer>
                          <StyledHorizontalContainer marginTop={hp('2.75%')} marginLeft={16} marginRight={16}>
                            <CameraCancelButton onPress={this.onCancel} />
                          </StyledHorizontalContainer>
                        </StyledCameraBottomContainer>
                      </>
                    );
                  }
                  return (
                    <>
                      {/** Flash Button */}
                      <FlashButton isFlashOn={isFlashOn} onPress={this.onToggleFlash} />

                      {/** Bottom Section */}
                      <StyledCameraBottomContainer>
                        <ShutterButton onPress={this.takePicture.bind(this)} />
                        <StyledHorizontalContainer
                          marginTop={24}
                          marginLeft={16}
                          marginRight={16}
                          justifyContent={'space-between'}
                        >
                          <CameraCancelButton onPress={this.onCancel} />
                          <CameraFlipButton onPress={this.onToggleCameraFlip} />
                        </StyledHorizontalContainer>
                      </StyledCameraBottomContainer>
                    </>
                  );
                }}
              </RNCamera>
            </StyledCameraContainer>
          )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
    station: state.station,
    station_data: state.station.station_data,
    memory: state.memory,
    memory_data: state.memory.memory_data,
  };
};

// const mapDispatchToProps = dispatch => ({
//   uploadImage: obj => dispatch(ExperienceActions.uploadImage(obj)),
//   setLiveEventImage: obj => dispatch(ExperienceActions.setLiveEventImage(obj)),
//   setLocalExperience: ExperienceActions.setLocalExperience,

// });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      uploadImage: ExperienceActions.uploadImage,
      setLiveEventImage: ExperienceActions.setLiveEventImage,
      setLocalExperience: ExperienceActions.setLocalExperience,
      setLocalStation: StationActions.setLocalStation,
      uploadStationImage: StationActions.uploadStationImage,
      setLocalMemory: MemoryActions.setLocalMemory,
      uploadMemoryImage: MemoryActions.uploadMemoryImage,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeImage);
