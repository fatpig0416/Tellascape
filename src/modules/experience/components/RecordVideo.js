import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera';
import { isIphoneX } from 'react-native-iphone-x-helper';
import _ from 'lodash';
import uuid from 'uuid';

// Import Actions
import { connect } from 'react-redux';
import ExperienceActions from '../reducers/event/index';
import StationActions from '../reducers/station';
import MemoryActions from '../reducers/memory';
import CameraRoll from '@react-native-community/cameraroll';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

// Load theme
import theme from '../../core/theme';
const { font } = theme;

// Load utils
import { formatTime } from '../../../utils/funcs';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { Loading } from '../../../utils';

// Load common components
import {
  StyledCameraContainer,
  StyledCameraBottomContainer,
  StyledCameraShutterButton,
  StyledHorizontalContainer,
  CameraCancelButton,
} from '../../core/common.styles';

import { getUserCurrentLocation } from '../../../utils/funcs';
import * as geolib from 'geolib';
import ZoomView from './ZoomView';

const StyledPendingWrapper = styled.View`
  flex: 1;
  width: ${wp('100%')};
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const ShutterButton = props => (
  <StyledCameraShutterButton {...props}>
    {!props.isRecording ? (
      <CustomIcon name={'Shutter_50x50px'} size={hp('7.4%')} color={'#f53332'} />
    ) : (
      <CustomIcon name={'Stop_26x26px'} size={hp('4.76%')} color={'#f53332'} />
    )}
  </StyledCameraShutterButton>
);

const StyledTimerText = styled.Text`
  font-size: ${hp('2.4%')};
  font-family: ${font.MRegular};
  color: ${props => props.color || '#ffffff'};
  text-align: center;
`;

const StyledMuteButton = styled.TouchableOpacity`
  width: ${wp('11%')};
  justify-content: center;
  align-items: center;
`;

const MuteButton = props => (
  <StyledMuteButton {...props}>
    <CustomIcon name={props.isMute ? 'Icon_Mute_32x32' : 'Icon_Sound_32x32'} size={wp('8.4%')} color={'#ffffff'} />
  </StyledMuteButton>
);

const MAX_RECORDING_TIME = 10000; //  10 seconds
const MAX_ZOOM = 7;
const ZOOM_F = Platform.OS === 'ios' ? 0.007 : 0.08;

class RecordVideo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      isRecordingAudio: true,
      currentTime: 0,
      loading: false,
      isMute: false,
      zoom: 0.0,
    };
  }

  _onPinchStart = () => {
    this._prevPinch = 1
  }

  _onPinchEnd = () => {
    this._prevPinch = 1
  }

  _onPinchProgress = (p) => {
    let p2 = p - this._prevPinch
    if(p2 > 0 && p2 > ZOOM_F) {
      this._prevPinch = p
      this.setState({zoom: Math.min(this.state.zoom + ZOOM_F, 1)}, () => {
      })
    }
    else if (p2 < 0 && p2 < -ZOOM_F) {
      this._prevPinch = p
      this.setState({zoom: Math.max(this.state.zoom - ZOOM_F, 0)}, () => {
      })
    }
  }

  /**
   * Start Recording
   *
   */

  onStartRecording = async () => {
    if (this.camera && !this.state.isRecording) {
      const options = {
        quality: RNCamera.Constants.VideoQuality['480p'],
        orientation: 'portrait',
        mute: this.state.isMute,
      };
      try {
        const promise = this.camera.recordAsync(options);
        if (promise) {
          this.setState({
            isRecording: true,
          });

          // Start counter
          this.countTimeId = setInterval(() => {
            this.setState(prevState => ({
              currentTime: prevState.currentTime + 1,
            }));
          }, 1000);

          // Set time limit of recording as 2 mintue
          this.cancelTimeId = setTimeout(this.onStopRecording, MAX_RECORDING_TIME);

          // Wait stopping recording
          const { uri, codec = 'mp4' } = await promise;
          const savedUri = await CameraRoll.saveToCameraRoll(uri, 'video');
          // Get the recorded video uri && upload the video
          const { activeStation } = this.props.station;
          const { activeMemory } = this.props.memory;
          if (activeStation !== null) {
            this.uploadStationVideo(uri);
          } else if (activeMemory !== null) {
            this.uploadMemoryVideo(uri);
          } else {
            this.uploadRecordingVideo(uri);
          }
        }
      } catch (e) {
        // console.error(e);
      }
    }
  };

  /**
   * Stop recording
   *
   */

  onStopRecording = () => {
    if (this.camera && this.state.isRecording) {
      this.camera.stopRecording();
      clearInterval(this.countTimeId);
      clearInterval(this.cancelTimeId);

      // initialize the states
      this.setState({
        isRecording: false,
        currentTime: 0,
      });
    }
  };

  /**
   * Upload the recording video
   *
   */

  uploadRecordingVideo = async videoUri => {
    const location = await getUserCurrentLocation();
    const obj = new FormData();
    let videoID = uuid.v4();
    if (videoUri) {
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${videoID}.mp4`,
        size: 1 * 1024 * 1024,
        mime: 'video/mp4',
        uri: Platform.OS === 'android' ? videoUri : videoUri.replace('file://', ''),
      });
      obj.append('parentID', this.props.event_data[0].parentID);
      obj.append(
        'childID',
        this.props.event_data[0].myChildID === -1 ||
          _.isEmpty(this.props.event_data[0].myChildID) ||
          this.props.event_data[0].myChildID === null
          ? this.props.event_data[0].child_ID
          : this.props.event_data[0].myChildID
      );
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', this.props.event_data[0].type);
      obj.append('req_media_id', videoID);

      let videoData = {
        formData: obj,
        reqMediaId: videoID,
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
                mediaType: 'video',
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
                mediaType: 'video',
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
        req_media_id: videoID,
        parentID: this.props.event_data[0].parentID,
        uri: videoUri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'video',
      };
      tempData.push(localObj);
      let newArray = [...localExperience, ...tempData];
      this.props.setLocalExperience(newArray);
      // this.props.uploadVideo(videoData);
    }
    this.setState({ loading: true });

    this._redirectLiveEvent();
    // setTimeout(this._redirectLiveEvent, 12000);
  };

  uploadStationVideo = async videoUri => {
    const location = await getUserCurrentLocation();
    const obj = new FormData();
    let videoID = uuid.v4();
    if (videoUri) {
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${videoID}.mp4`,
        size: 1 * 1024 * 1024,
        mime: 'video/mp4',
        uri: Platform.OS === 'android' ? videoUri : videoUri.replace('file://', ''),
      });
      obj.append('parentID', this.props.station_data[0].parentID);
      obj.append(
        'childID',
        this.props.station_data[0].myChildID === -1 ||
          _.isEmpty(this.props.station_data[0].myChildID) ||
          this.props.station_data[0].myChildID === null
          ? this.props.station_data[0].child_ID
          : this.props.station_data[0].myChildID
      );
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', this.props.station_data[0].type);
      obj.append('req_media_id', videoID);

      let videoData = {
        formData: obj,
        reqMediaId: videoID,
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
                mediaType: 'video',
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
                mediaType: 'video',
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
        req_media_id: videoID,
        parentID: this.props.station_data[0].parentID,
        uri: videoUri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'video',
      };
      tempData.push(localObj);
      let newArray = [...localStation, ...tempData];
      this.props.setLocalStation(newArray);

      // this.props.uploadStationVideo(videoData);
    }
    this._redirectLiveEvent();
    // setTimeout(this._redirectLiveEvent, 12000);
  };

  uploadMemoryVideo = async videoUri => {
    const location = await getUserCurrentLocation();
    const obj = new FormData();
    let videoID = uuid.v4();
    if (videoUri) {
      obj.append('token', this.props.auth.access_token);
      obj.append('_method', 'POST');
      obj.append('mediaID', {
        name: `${videoID}.mp4`,
        size: 1 * 1024 * 1024,
        mime: 'video/mp4',
        uri: Platform.OS === 'android' ? videoUri : videoUri.replace('file://', ''),
      });
      obj.append('parentID', this.props.memory_data[0].parentID);
      obj.append(
        'childID',
        this.props.memory_data[0].myChildID === -1 ||
          _.isEmpty(this.props.memory_data[0].myChildID) ||
          this.props.memory_data[0].myChildID === null
          ? this.props.memory_data[0].child_ID
          : this.props.memory_data[0].myChildID
      );
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', this.props.memory_data[0].type);
      obj.append('req_media_id', videoID);

      let videoData = {
        formData: obj,
        reqMediaId: videoID,
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
                mediaType: 'video',
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
                mediaType: 'video',
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
        req_media_id: videoID,
        parentID: this.props.memory_data[0].parentID,
        uri: videoUri,
        formData: obj,
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
        status: 'pending',
        percent: 0,
        mediaType: 'video',
      };
      tempData.push(localObj);
      let newArray = [...localMemory, ...tempData];
      this.props.setLocalMemory(newArray);

      // this.props.uploadMemoryVideo(videoData);
    }
    this._redirectLiveEvent();
  };

  _redirectLiveEvent = () => {
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    clearTimeout(this._redirectLiveEvent);
  }
  /**
   * Handle recording control
   *
   */

  onRecordVideo = () => {
    if (this.state.isRecording) {
      this.onStopRecording();
    } else {
      this.onStartRecording();
    }
  };

  /**
   * Cancel recording video
   *
   */

  onCancel = () => {
    this.props.navigation.goBack();
  };

  /**
   * Camera permission changed
   *
   */

  onCameraStatusChange = status => {
    if (status.cameraStatus === 'READY') {
      let isRecordingAudio = false;
      if (status.recordAudioPermissionStatus === 'AUTHORIZED') {
        isRecordingAudio = true;
      }
      this.setState(
        {
          isRecordingAudio,
        }
        // this.onStartRecording
      );
    }
  };

  onToggleMute = () => {
    this.setState(prevState => ({
      isMute: !prevState.isMute,
      isRecordingAudio: !prevState.isRecordingAudio,
    }));
  };

  render() {
    const { isRecording, isRecordingAudio, currentTime, loading, isMute } = this.state;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <StyledCameraContainer>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              fixOrientation={true}
              forceUpOrientation={true}
              zoom={this.state.zoom}
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
              onStatusChange={this.onCameraStatusChange}
              captureAudio={isRecordingAudio}
              maxZoom={MAX_ZOOM}
            >
              <ZoomView 
                onPinchEnd={this._onPinchEnd}
                onPinchStart={this._onPinchStart}
                onPinchProgress={this._onPinchProgress}>
               
              </ZoomView>
               <View>
                  {({ camera, status, recordAudioPermissionStatus }) => {
                    if (status !== 'READY') {
                      return (
                        <>
                          {status === 'NOT_AUTHORIZED' ? (
                            <StyledPendingWrapper>
                              <StyledTimerText color={'#000'}>
                                {
                                  "Camera access was not granted.\n Pleas go to your phone's settings\nand allow camera access"
                                }
                              </StyledTimerText>
                            </StyledPendingWrapper>
                          ) : null}
                          <StyledCameraBottomContainer>
                            <StyledHorizontalContainer marginTop={hp('2.75%')} marginLeft={16} marginRight={16}>
                              <CameraCancelButton onPress={this.onCancel} />
                            </StyledHorizontalContainer>
                          </StyledCameraBottomContainer>
                        </>
                      );
                    }
                  }}
                  {!isRecording || isRecording ? (
                    <View
                      style={{ position: 'absolute', height: hp('100%'), bottom: isIphoneX() ? -48 : -20, left: 16 }}
                    >
                      <MuteButton isMute={isMute} onPress={this.onToggleMute} />
                    </View>
                  ) : null}

                  <StyledCameraBottomContainer>
                    <ShutterButton onPress={this.onRecordVideo} isRecording={isRecording} />
                    <StyledHorizontalContainer marginTop={hp('2.75%')} marginLeft={16} marginRight={16}>
                      {isRecording ? (
                        <StyledTimerText>{formatTime(currentTime)}</StyledTimerText>
                      ) : (
                        <CameraCancelButton onPress={this.onCancel} />
                      )}
                    </StyledHorizontalContainer>
                  </StyledCameraBottomContainer>
                </View>
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
        // height: Dimensions.get('window').height,
          // width: "100%",

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

const mapDispatchToProps = dispatch => {
  return {
    uploadVideo: obj => {
      dispatch(ExperienceActions.uploadVideo(obj));
    },
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    uploadStationVideo: obj => {
      dispatch(StationActions.uploadStationVideo(obj));
    },
    setLocalStation: obj => {
      dispatch(StationActions.setLocalStation(obj));
    },
    uploadMemoryVideo: obj => {
      dispatch(MemoryActions.uploadMemoryVideo(obj));
    },
    setLocalMemory: obj => {
      dispatch(MemoryActions.setLocalMemory(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordVideo);
