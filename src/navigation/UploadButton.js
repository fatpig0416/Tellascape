import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Tooltip from 'react-native-walkthrough-tooltip';
import theme from '../modules/core/theme';
import CustomIcon from '../utils/icon/CustomIcon';
import { connect } from 'react-redux';
import ExperienceActions from '../modules/experience/reducers/event/index';
import StationActions from '../modules/experience/reducers/station';
import MemoryActions from '../modules/experience/reducers/memory';
import * as geolib from 'geolib';
import GetLocation from 'react-native-get-location';
const { colors, gradients, font, blue, orange, cyan } = theme;
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-community/cameraroll';
import ImageResizer from 'react-native-image-resizer';
import { getUserCurrentLocation } from '../utils/funcs';
import uuid from 'uuid';
import _ from 'lodash';
import ImagePickerVideo from 'react-native-image-picker';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { LatLng, computeOffset } from 'spherical-geometry-js';

import { StyledSeparator } from '../modules/core/common.styles';

const StyledArcView = styled.View`
  width: 75;
  height: 75;
  padding-top: 28;
  align-items: center;
  background-color: white;
  border-radius: 40;
`;

const StyledUploadButton = styled.TouchableOpacity`
  width: 65;
  height: 65;
  border-radius: 35;
  justify-content: center;
  align-items: center;
  margin-top: -22;
  background-color: #41cabf;
  overflow: hidden;
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const StyledSelectorContainer = styled.View`
  width: ${wp('100%')};
  height: ${hp('6.88%')};
  flex-direction: row;
  align-items: center;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  background-color: #666666;
`;

const StyledPhotoButtonText = styled.Text`
  font-size: ${hp('2.18%')};
  font-family: ${font.MBold};
  color: #fafeff;
`;

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PhotoButton = props => (
  <StyledButton {...props}>
    <StyledPhotoButtonText>{props.buttonText}</StyledPhotoButtonText>
  </StyledButton>
);

const ContentModal = ({ visible, onClose, onAddPhoto, onAddVideo, iconColor }) => {
  return (
    <Modal visible={visible} animationType={'fade'} transparent={true}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ alignItems: 'center' }}>
                <StyledSelectorContainer style={{ marginBottom: -28 }}>
                  <PhotoButton buttonText={'Add Photo'} onPress={onAddPhoto} />
                  <StyledSeparator width={1} height={'100%'} bgColor={'#f7fdff'} opacity={0.6} />
                  <PhotoButton buttonText={'Add Video'} onPress={onAddVideo} />
                </StyledSelectorContainer>
                <View style={styles.buttonMainStyle}>
                  <TouchableOpacity onPress={onClose} style={styles.buttonContainer}>
                    <CustomIcon name={'close-24px'} size={30} color={iconColor} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

class UploadButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      images: null,
      video: null,
      currentLocation: null,
    };
  }
  onToggle = async () => {
    const { activeStation } = this.props.station;
    const { activeExperience } = this.props.experience;
    const { activeMemory, memory_data, isQuickMemoryStarted } = this.props.memory;
    if (this.props.experience.joinEventClose !== null) {
      this.props.setJoinEventClose(null);
    } else {
      if (activeStation !== null) {
        if (this.props.station_data && this.props.station_data.length > 0) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              this.setState({ currentLocation: location });
              // this.checkUserLocation(location.latitude, location.longitude, this.props.station_data[0].fenceBuffer);
            })
            .catch(error => {
              const { code, message } = error;
              console.warn(code, message);
              // Alert.alert(
              //   'Location Privacy',
              //   'Allow Tellascape location permission to use feature of app. \n \n Step 1: Settings > Location > Turn on the location permission. \n\n Step 2: Restart the app .'
              // );
            });
          this.setState(prevState => ({
            isOpen: !prevState.isOpen,
          }));
        }
      } else if (activeMemory !== null) {
        if (this.props.memory_data && this.props.memory_data.length > 0) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              this.setState({ currentLocation: location });
              //  this.checkUserLocation(location.latitude, location.longitude, this.props.memory_data[0].fenceBuffer);

              /* Start Quick Memory */
              if (
                isQuickMemoryStarted === false &&
                memory_data.length > 0 &&
                memory_data[0].memory_type === 'QuickStart' &&
                memory_data[0].my_experience.length === 0
              ) {
                const { parentID, child_ID, type, myChildID } = this.props.memory_data[0];
                this.props.setStartQuickMemory(true);
                const memoryObj = new FormData();
                memoryObj.append('token', this.props.auth.access_token);
                let centerPoint = {
                  lat: location.latitude ? location.latitude : '',
                  lng: location.longitude ? location.longitude : '',
                };
                let meta = {
                  radius: 1,
                  center: {
                    lat: location.latitude ? location.latitude : '',
                    lng: location.longitude ? location.longitude : '',
                  },
                };
                const latlng = new LatLng(centerPoint.lat, centerPoint.lng);
                let numSides = 15;
                let coordinate = [];
                var points = [],
                  degreeStep = 360 / numSides;
                for (var ii = 0; ii < numSides; ii++) {
                  var gpos = computeOffset(latlng, 1, degreeStep * ii);
                  points.push([gpos.lng(), gpos.lat()]);
                }
                points.push(points[0]);
                coordinate.push(points);
                let fenceJson = {
                  type: 'Polygon',
                  coordinates: coordinate,
                };

                var points = [];
                let buffer_coords = [];
                for (var i = 0; i < numSides; i++) {
                  var gpos = computeOffset(latlng, 244, degreeStep * i);
                  // 800 feet to 121.92 * 2 meter
                  points.push([gpos.lng(), gpos.lat()]);
                }
                points.push(points[0]);
                buffer_coords.push(points);
                let fenceBuffer = {
                  type: 'Polygon',
                  coordinates: buffer_coords,
                };
                memoryObj.append('centerPoint', JSON.stringify(centerPoint));
                memoryObj.append('fenceBuffer', JSON.stringify(fenceBuffer));
                memoryObj.append('fenceJson', JSON.stringify(fenceJson));
                memoryObj.append('metadata', JSON.stringify(meta));
                memoryObj.append('fenceType', 'circle');
                memoryObj.append('parentID', parentID);
                memoryObj.append(
                  'childID',
                  myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID
                );

                try {
                  let MemoryFormObj = {
                    formData: memoryObj,
                    updateMemorySuccess: this.updateMemorySuccess,
                    updateMemoryFailure: this.updateMemoryFailure,
                    location: location,
                  };
                  this.props.updateQuickMemory(MemoryFormObj);
                } catch (error) {
                  Alert.alert('Warning', 'Memory creation failed.', [{ text: 'OK' }], {
                    cancelable: false,
                  });
                }
              } else {
                this.setState(prevState => ({
                  isOpen: !prevState.isOpen,
                }));
              }
              /* End Quick Memory */
            })
            .catch(error => {
              const { code, message } = error;
              console.warn(code, message);
              // Alert.alert(
              //   'Location Privacy',
              //   'Allow Tellascape location permission to use feature of app. \n \n Step 1: Settings > Location > Turn on the location permission. \n\n Step 2: Restart the app .'
              // );
            });
        }
      } else {
        if (this.props.event_data && this.props.event_data.length > 0) {
          const { is_blocked } = this.props.event_data[0];
          if (!is_blocked) {
            GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            })
              .then(location => {
                this.setState({ currentLocation: location });
                // this.checkUserLocation(location.latitude, location.longitude, this.props.event_data[0].fenceBuffer);
              })
              .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
                // Alert.alert(
                //   'Location Privacy',
                //   'Allow Tellascape location permission to use feature of app. \n \n Step 1: Settings > Location > Turn on the location permission. \n\n Step 2: Restart the app .'
                // );
              });
            this.setState(prevState => ({
              isOpen: !prevState.isOpen,
            }));
          } else {
            Alert.alert(
              'Tellascape',
              'You are blocked for this event by Host, so you are not able to continue upload your experience.',
              [
                {
                  text: 'Okay',
                },
              ],
              { cancelable: false }
            );
          }
        }
      }
    }
  };

  checkUserLocation(latitude, longitude, fenceBuffer) {
    let polygon = [];
    fenceBuffer.coordinates[0].map((item, index) => {
      let obj = { lat: item[1], lng: item[0] };
      polygon.push(obj);
    });

    let point = {
      lat: latitude,
      lng: longitude,
    };

    try {
      if (geolib.isPointInPolygon(point, polygon)) {
        this.setState(prevState => ({
          isOpen: !prevState.isOpen,
        }));
      } else {
        this.setState({ isOpen: false });
        Alert.alert(
          'KEEP IT REAL',
          'You must be inside of the geo-fence to add pictures or videos to this experience.'
        );
      }
    } catch (e) {
      console.log(`unable to get location: ${JSON.stringify(e)}`);
    }
  }

  isUserInGeofence = (latitude, longitude, fenceBuffer) => {
    let polygon = [];
    fenceBuffer.coordinates[0].map((item, index) => {
      let obj = { lat: item[1], lng: item[0] };
      polygon.push(obj);
    });

    let point = {
      lat: latitude,
      lng: longitude,
    };

    try {
      if (geolib.isPointInPolygon(point, polygon)) {
        return true;
      } else {
        Alert.alert(
          'KEEP IT REAL',
          'You must be inside of the geo-fence to add pictures or videos to this experience.'
        );
        return false;
      }
    } catch (e) {
      console.log(`unable to get location: ${JSON.stringify(e)}`);
    }
  };
  /**
   * Select photo
   *
   */
  onAddMedia = async (location, type) => {
    // if (type === 'photo') {
    //   this.onAddPhoto(location);
    // } else {
    //   this.onAddVideo(location);
    // }
    var crntLocation = await getUserCurrentLocation();
    let experienceData = null;
    const { activeStation } = this.props.station;
    const { activeExperience } = this.props.experience;
    const { activeMemory } = this.props.memory;
    if (activeStation !== null) {
      experienceData = this.props.station_data;
    } else if (activeMemory !== null) {
      experienceData = this.props.memory_data;
    } else {
      experienceData = this.props.event_data;
    }
    if (experienceData && experienceData.length > 0) {
      let isGeofence;
      let newLocation = location;
      if (crntLocation != null && crntLocation.latitude) {
        isGeofence = this.isUserInGeofence(
          crntLocation.latitude,
          crntLocation.longitude,
          experienceData[0].fenceBuffer
        );
        newLocation = crntLocation;
      } else {
        isGeofence = this.isUserInGeofence(location.latitude, location.longitude, experienceData[0].fenceBuffer);
      }
      if (isGeofence) {
        if (type === 'photo') {
          this.onAddPhoto(newLocation);
        } else {
          this.onAddVideo(newLocation);
        }
      } else {
        Alert.alert(
          'KEEP IT REAL',
          'You must be inside of the geo-fence to add pictures or videos to this experience.'
        );
      }
    } else {
      Alert.alert('Tellascape', 'Something went wrong. Please try again later.');
    }
    // } else {
    //   console.log(`unable to get location: ${JSON.stringify(e)}`);
    // }
  };
  onAddPhoto = async location => {
    ImagePicker.openCamera({
      cropping: false,
    })
      .then(async image => {
        const savedImageUri = await CameraRoll.saveToCameraRoll(image.path, 'photo');
        let uploadngImageUri;
        if (Platform.OS === 'ios') {
          uploadngImageUri = 'ph-upload' + savedImageUri.substring(2);
        } else {
          uploadngImageUri = savedImageUri;
        }
        let imageWidth = image.width;
        let imageHeight = image.height;
        let imageNewWidth = Math.ceil((imageWidth / 3.4) * 2);
        let imageNewHeight = Math.ceil((imageHeight / 3.4) * 2);
        this.setState({ isOpen: false });
        ImageResizer.createResizedImage(
          uploadngImageUri,
          imageNewWidth,
          imageNewHeight,
          'JPEG',
          Platform.OS === 'android' ? 100 : 1
        )
          .then(response => {
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
            const { uri } = response;
            const { activeStation } = this.props.station;
            const { activeMemory } = this.props.memory;

            if (location != null && location.code !== 'UNAVAILABLE') {
              if (activeStation !== null) {
                if (this.props.station_data && this.props.station_data.length > 0) {
                  this.uploadStationImage(uri, location);
                }
              } else if (activeMemory !== null) {
                if (this.props.memory_data && this.props.memory_data.length > 0) {
                  this.uploadMemoryImage(uri, location);
                }
              } else {
                if (this.props.event_data && this.props.event_data.length > 0) {
                  this.uploadEventImage(uri, location);
                }
              }
            } else {
              Alert.alert(
                'Media Upload Failed',
                'Tellascape unable to fetch the user current location. \n \n Step 1: Settings > Location > Turn on the location permission. \n\n Step 2: Restart the app .'
              );
            }
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
          });
      })
      .catch(error => {
        this.setState({ isOpen: false });
      });
  };

  uploadEventImage = async (uri, location) => {
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
        type: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);

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
    }
  };

  uploadStationImage = async (uri, location) => {
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
        type: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);
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
    }
  };

  uploadMemoryImage = async (uri, location) => {
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
        type: 'image/jpeg',
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });
      obj.append('parentID', parentID);
      obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
      obj.append('lat', location !== null ? location.latitude : null);
      obj.append('lng', location !== null ? location.longitude : null);
      obj.append('type', type);
      obj.append('req_media_id', imageID);

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
    }
  };

  updateMemorySuccess = response => {
    this.setState({
      loading: false,
    });
    let req = {
      token: this.props.auth.access_token,
      parentID: response.parentID,
      uid: '',
      onSuccess: response => console.log(`success`),
      onFail: (error, code) => {
        console.log(`Memory update failed.`);
      },
    };
    this.props.onGetMemory(req);
  };

  updateMemoryFailure = () => {
    this.setState({ loading: false });
  };

  /**
   * Select video
   *
   */
  onAddVideo = async location => {
    ImagePickerVideo.launchCamera({ mediaType: 'video', durationLimit: 9, videoQuality: 'high' }, async response => {
      this.setState({ isOpen: false });
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const { uri, width, path } = response;
        const { activeStation } = this.props.station;
        const { activeMemory } = this.props.memory;

        if (Platform.OS === 'ios') {
          const savedUri = await CameraRoll.save(uri, { type: 'video' });
        }
        if (location !== null) {
          if (activeStation !== null) {
            if (this.props.station_data && this.props.station_data.length > 0) {
              this.uploadStationVideo(Platform.OS === 'android' ? path : uri, location);
            }
          } else if (activeMemory !== null) {
            if (this.props.memory_data && this.props.memory_data.length > 0) {
              this.uploadMemoryVideo(Platform.OS === 'android' ? path : uri, location);
            }
          } else {
            if (this.props.event_data && this.props.event_data.length > 0) {
              this.uploadEventVideo(Platform.OS === 'android' ? path : uri, location);
            }
          }
        } else {
          Alert.alert(
            'Media Upload Failed',
            'Tellascape unable to fetch the user current location. \n \n Step 1: Settings > Location > Turn on the location permission. \n\n Step 2: Restart the app .'
          );
        }
      }
    });
  };

  uploadEventVideo = async (videoUri, location) => {
    const obj = new FormData();
    if (this.props.event_data && this.props.event_data.length > 0) {
      const { parentID, myChildID, child_ID, type } = this.props.event_data[0];
      let videoID = uuid.v4();
      if (videoUri) {
        obj.append('token', this.props.auth.access_token);
        obj.append('_method', 'POST');
        if (Platform.OS === 'android') {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            type: 'video/mp4',
            uri: videoUri,
          });
        } else {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            size: 1 * 1024 * 1024,
            mime: 'video/mp4',
            uri: videoUri.replace('file://', ''),
          });
        }
        obj.append('parentID', parentID);
        obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
        obj.append('lat', location !== null ? location.latitude : null);
        obj.append('lng', location !== null ? location.longitude : null);
        obj.append('type', type);
        obj.append('req_media_id', videoID);

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
          is_compresss: false,
        };
        tempData.push(localObj);
        let newArray = [...localExperience, ...tempData];
        this.props.setLocalExperience(newArray);
      }
    }
  };

  uploadStationVideo = async (videoUri, location) => {
    const obj = new FormData();
    if (this.props.station_data && this.props.station_data.length > 0) {
      const { parentID, myChildID, child_ID, type } = this.props.station_data[0];
      let videoID = uuid.v4();
      if (videoUri) {
        obj.append('token', this.props.auth.access_token);
        obj.append('_method', 'POST');
        if (Platform.OS === 'android') {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            type: 'video/mp4',
            uri: videoUri,
          });
        } else {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            size: 1 * 1024 * 1024,
            mime: 'video/mp4',
            uri: videoUri.replace('file://', ''),
          });
        }
        obj.append('parentID', parentID);
        obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
        obj.append('lat', location !== null ? location.latitude : null);
        obj.append('lng', location !== null ? location.longitude : null);
        obj.append('type', type);
        obj.append('req_media_id', videoID);

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
          is_compresss: false,
        };
        tempData.push(localObj);
        let newArray = [...localStation, ...tempData];
        this.props.setLocalStation(newArray);
      }
    }
  };

  uploadMemoryVideo = async (videoUri, location) => {
    const obj = new FormData();
    if (this.props.memory_data && this.props.memory_data.length > 0) {
      const { parentID, myChildID, child_ID, type } = this.props.memory_data[0];
      let videoID = uuid.v4();
      if (videoUri) {
        obj.append('token', this.props.auth.access_token);
        obj.append('_method', 'POST');
        if (Platform.OS === 'android') {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            type: 'video/mp4',
            uri: videoUri,
          });
        } else {
          obj.append('mediaID', {
            name: `${videoID}.mp4`,
            size: 1 * 1024 * 1024,
            mime: 'video/mp4',
            type: 'video/mp4',
            uri: videoUri.replace('file://', ''),
          });
        }
        obj.append('parentID', parentID);
        obj.append('childID', myChildID === -1 || _.isEmpty(myChildID) || myChildID === null ? child_ID : myChildID);
        obj.append('lat', location !== null ? location.latitude : null);
        obj.append('lng', location !== null ? location.longitude : null);
        obj.append('type', type);
        obj.append('req_media_id', videoID);

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
          is_compresss: false,
        };
        tempData.push(localObj);
        let newArray = [...localMemory, ...tempData];
        this.props.setLocalMemory(newArray);
      }
    }
  };

  render() {
    const { isOpen, currentLocation } = this.state;
    const { joinEventClose } = this.props.experience;
    const { activeStation } = this.props.station;
    const { activeMemory, memory_data, isQuickMemoryStarted } = this.props.memory;
    const specificTheme = activeStation !== null ? blue : activeMemory !== null ? cyan : orange;
    let closeTheme = ['#6C6C6C', '#6C6C6C'];
    return (
      <View style={{ alignItems: 'center' }}>
        <StyledArcView style={{ marginTop: -20 }}>
          <StyledUploadButton onPress={this.onToggle} ref={ref => (this.touchable = ref)}>
            <StyledButtonOverlay
              start={{ x: 0.28, y: 0 }}
              end={{ x: 0.72, y: 1 }}
              colors={joinEventClose !== null ? closeTheme : isOpen ? closeTheme : specificTheme.graident}
            />
            {memory_data.length > 0 &&
            activeMemory !== null &&
            memory_data[0].memory_type === 'QuickStart' &&
            isQuickMemoryStarted === false ? (
              <Image source={theme.images.MEMORY_WHITE_ICON} />
            ) : (
              <CustomIcon
                name={joinEventClose !== null ? 'close-24px' : isOpen ? 'close-24px' : 'Common-CamPlus-Navbar_40x40px'}
                size={30}
                color={joinEventClose !== null ? specificTheme.icon : isOpen ? specificTheme.icon : colors.White}
              />
            )}
          </StyledUploadButton>
        </StyledArcView>
        <ContentModal
          visible={isOpen}
          onClose={() => this.setState({ isOpen: false })}
          onAddPhoto={() => this.onAddMedia(currentLocation, 'photo')}
          onAddVideo={() => this.onAddMedia(currentLocation, 'video')}
          iconColor={joinEventClose !== null ? specificTheme.icon : isOpen ? specificTheme.icon : colors.White}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tootipContent: {
    marginTop: 3,
    padding: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tootipStyle: {
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  tooltipArrow: {
    width: 0,
    height: 0,
  },
  tooltopDisplayInsets: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonMainStyle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderColor: 'white',
    justifyContent: 'flex-end',
    marginBottom: -4,
  },
  buttonContainer: {
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 40,
    flex: 1,
    backgroundColor: '#6C6C6C',
    alignItems: 'center',
    justifyContent: 'center',
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
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },
    setLiveEventImage: obj => {
      dispatch(ExperienceActions.setLiveEventImage(obj));
    },
    setLocalExperience: obj => {
      dispatch(ExperienceActions.setLocalExperience(obj));
    },
    setLocalStation: obj => {
      dispatch(StationActions.setLocalStation(obj));
    },
    setLocalMemory: obj => {
      dispatch(MemoryActions.setLocalMemory(obj));
    },
    updateQuickMemory: obj => {
      dispatch(MemoryActions.updateMemory(obj));
    },
    onGetMemory: obj => {
      dispatch(MemoryActions.getMemory(obj));
    },
    setStartQuickMemory: obj => {
      dispatch(MemoryActions.setStartQuickMemory(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadButton);
