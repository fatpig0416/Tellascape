import React, { PureComponent } from 'react';
import { ActivityIndicator, Platform, View, SafeAreaView, StyleSheet, Text, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components/native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import _ from 'lodash';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { iosFonts } from '../../core/theme';
import { Surface } from 'gl-react-native';
import { Loading } from '../../../utils';
import CameraRoll from '@react-native-community/cameraroll';
import {
  Amaro,
  Brannan,
  Earlybird,
  Hefe,
  Hudson,
  Inkwell,
  Lokofi,
  LordKelvin,
  Nashville,
  Normal,
  Rise,
  Sierra,
  Sutro,
  Toaster,
  Valencia,
  Walden,
  Xproll,
  Saturate,
} from '../../core/Filters';
import { DEVICE_WIDTH } from '../../../utils';
import ExperienceActions from '../reducers/event/index';
import StationActions from '../reducers/station';
import MemoryActions from '../reducers/memory';
import { BackButtonHandler, RightButtonHandler, CheckIcon } from '../../core/common.styles';
import ViewShot from 'react-native-view-shot';
import uuid from 'uuid';
import { getUserCurrentLocation } from '../../../utils/funcs';

export const Container = styled.View`
  flex: 1;
`;

export const ContentView = styled.View`
  width: ${wp('100%')};
  height: ${hp('70%')};
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ScrollHorizontal = styled.ScrollView.attrs({
  contentContainerStyle: { alignItems: 'center' },
})`
  background: #525252;
  display: flex;
  flex-direction: row;
  padding-right: 10px;
`;

export const FilterView = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export const FilterImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;

export const FilterName = styled.Text`
  font-size: 11px;
  line-height: 12px;
  color: ${props => (props.isActive ? '#fff' : '#eee')};
  font-family: ${props => (props.isActive ? iosFonts.MSemiBold : iosFonts.MRegular)};
`;

export const Loader = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

class ImageFilterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: DEVICE_WIDTH,
      height: 400,
      filtersDrawn: [],
      mainSurfaceLoaded: false,
      isLoading: false,
    };
  }

  getFilterComponent = filter => {
    const filtersAndComps = {
      Amaro,
      Brannan,
      Earlybird,
      Hefe,
      Hudson,
      Inkwell,
      Lokofi,
      LordKelvin,
      Nashville,
      Normal,
      Rise,
      Sierra,
      Sutro,
      Toaster,
      Valencia,
      Walden,
      Xproll,
    };
    return filtersAndComps[filter] || Normal;
  };

  handleFilterChange = filter => {
    this.props.updateImageFilter(filter);
  };

  handleImageUpload = async () => {
    const uri = await this.viewShot.capture().then(uri => {
      return uri;
    });
    // const savedImageUri = await CameraRoll.saveToCameraRoll(uri, 'photo');
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

  renderFilterLoader = key => {
    return (
      <Loader key={key}>
        <ActivityIndicator animating />
      </Loader>
    );
  };

  onFilterDraw = filterIndex => {
    const _this = this;
    _this.setState(prevState => ({
      filtersDrawn: [...prevState.filtersDrawn, filterIndex],
    }));
  };

  omMainSurfaceLoad = () => {
    const _this = this;
    const { mainSurfaceLoaded } = this.state;
    if (!mainSurfaceLoaded) {
      _this.setState({ mainSurfaceLoaded: true });
    }
  };

  renderLoader = () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <View style={styles.loaderMainStyle}>
          <View style={styles.loaderContainerStyle}>
            <ActivityIndicator size={'large'} />
            <Text style={styles.loadingTextStyle}>Loading</Text>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  renderHeader = () => {
    return (
      <View style={styles.headerStyle}>
        <BackButtonHandler onPress={() => this.props.navigation.goBack()} color="#FFF" />

        <RightButtonHandler onPress={() => this.handleImageUpload()}>
          <CheckIcon color="#FFF" />
        </RightButtonHandler>
      </View>
    );
  };

  render() {
    const filterValues = {
      contrast: 1,
      saturation: 1,
      brightness: 1,
    };
    const { filtersDrawn, mainSurfaceLoaded, isLoading } = this.state;
    const { image, imageFilter, imageFilters } = this.props;
    const { uri, width, height } = image;

    /** set filter component by the selected Filter. Default to *Normal* */
    const Filter = this.getFilterComponent(imageFilter);

    const imageURI = uri;
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height * 0.7);

    return (
      <Container>
        <ContentView>
          <ViewShot
            ref={ref => {
              this.viewShot = ref;
            }}
            options={{
              format: 'jpg',
              quality: 1.0,
              width: screenWidth,
              height: screenHeight,
            }}
          >
            <Surface
              ref={ref => {
                this.mainSurface = ref;
              }}
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
              onLoad={this.omMainSurfaceLoad}
            >
              <Filter {...filterValues}>{{ uri: imageURI }}</Filter>
            </Surface>
          </ViewShot>
        </ContentView>

        {mainSurfaceLoaded && (
          <ScrollHorizontal horizontal={true}>
            {imageFilters.map((filter, index) => {
              const ImageFilter = this.getFilterComponent(filter);
              const lastIndex = imageFilters.length - 1;
              if (index > 0 && !filtersDrawn.includes(index - 1)) {
                return this.renderFilterLoader(index);
              }
              return (
                <FilterView key={index} onPress={() => this.handleFilterChange(filter)}>
                  <Surface
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    onLoad={() => this.onFilterDraw(index)}
                  >
                    <ImageFilter {...filterValues}>{{ uri: imageURI }}</ImageFilter>
                  </Surface>

                  <FilterName isActive={filter == imageFilter}>{filter}</FilterName>
                </FilterView>
              );
            })}
          </ScrollHorizontal>
        )}
        {this.renderHeader()}
        {this.renderLoader()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    width: wp('100%'),
    paddingTop: isIphoneX() ? 48 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#38e0cc',
  },
  loaderMainStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  loaderContainerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingTextStyle: {
    paddingTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  experience: state.experience,
  image: state.experience.liveEventImage,
  imageFilter: state.experience.currentImageFilter,
  imageFilters: state.experience.imageFilters,
  uploadSuccessful: state.experience.uploadSuccessful,
  selectedLiveEventData: state.experience.selectedLiveEventData,
  event_data: state.experience.event_data,
  station: state.station,
  station_data: state.station.station_data,
  memory: state.memory,
  memory_data: state.memory.memory_data,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      uploadImage: ExperienceActions.uploadImage,
      uploadImageReset: ExperienceActions.uploadImageReset,
      updateImageFilter: ExperienceActions.updateCurrentImageFilter,
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
)(ImageFilterScreen);
