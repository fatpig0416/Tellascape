import React, { Component } from 'react';
import { StyleSheet, View, Alert, Platform, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Geojson } from 'react-native-maps';
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import styled from 'styled-components/native';

// Import reducers and selecotrs
import { connect } from 'react-redux';
import StationActions from '../../reducers/station/index';
import { createStructuredSelector } from 'reselect';
import { selectAccessToken, selectUid } from '../../../auth/reducers';
import { selectGeofence, selectData, selectCurrent, selectCategoryLists } from '../../reducers/event';

// Import Categories
import Categories from '../Categories';

// Load styles
import { timelineStyles, mapStyles, modalStyles } from '../../../core/common.styles';
import { StyledContainer, GradientButton, StyledWrapper } from '../../../../styles/Common.styles';
import {
  Header,
  StyledBigText,
  StyledCard,
  DetailCard,
  PostCard,
  StyledMapPlaceholderImage,
  MapSelectButton,
  MapEditButton,
} from './molecules/Form';

// Load theme
import theme from '../../../core/theme';
const { images, colors, font, gradients } = theme;

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { getUserCurrentLocation } from '../../../../utils/funcs';
import { Loading } from '../../../../utils';

// Import organisms
import ExperienceHeader from '../organisms/ExperienceHeader';
import LocationAccess from '../../../home/components/organisms/LocationAccess';

const moment = require('moment');

const StyledDeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 10;
  top: 10;
  border-radius: 5;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-color: #65a8fb;
  border-width: ${hp('0.15%')};
`;
const DeleteButton = props => (
  <StyledDeleteButton {...props}>
    <CustomIcon name={'close-24px'} size={25} />
  </StyledDeleteButton>
);

const CategoriesModal = ({ isModalVisible, toggleModal, onSelectCategory }) => {
  return (
    <Modal isVisible={isModalVisible} style={modalStyles.container} onRequestClose={toggleModal}>
      <Categories categoryType={'station'} toggleModal={toggleModal} onSelectCategory={onSelectCategory} />
    </Modal>
  );
};

const INITIAL_STATE = {
  timeLineData: [],
  isAfter: false,
  title: '',
  description: '',
  category: 'Entertainment',
  coverPhoto: '',
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
  isVisibleLocation: false,
};

class CreateStation extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

    this.openMap = this.openMap.bind(this);
    this.goToInitialLocation = this.goToInitialLocation.bind(this);
    this._redirectLiveStation = this._redirectLiveStation.bind(this);
  }

  componentDidMount = async () => {
    const dotIconImage = await this.getIconImageSource('circle');
    const locationIconImage = await this.getIconImageSource('my_location-24px');
    const flashIconImage = await this.getIconImageSource('privacy-handshake-icon-wrapcopy');
    this.props.setGeofence(null);
    CustomIcon.getImageSource('circle', 10, '#EFEFEF').then(source =>
      this.setState({
        timeLineData: [
          {
            icon: dotIconImage,
            title: 'Details',
          },
          {
            icon: locationIconImage,
            title: 'Location',
          },
          {
            icon: flashIconImage,
            title: 'When to post',
          },
          {},
        ],
      })
    );

    let location = await getUserCurrentLocation();
    if (location !== null && location.code && location.code !== 'CANCELLED') {
      this.setState({ isVisibleLocation: true });
    }
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };

  componentWillUnmount() {
    this.backHandler.remove();
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

  openMap = async () => {
    let location = await getUserCurrentLocation();
    if (location !== null) {
      this.props.navigation.push('Map', {
        isUpdate: false,
        original: 'station',
      });
    } else {
      this.setState({ isVisibleLocation: true });
    }
  };

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.state.initialRegion, 2000);
  };

  _redirectLiveStation = data => {
    Alert.alert(
      'Station Created',
      'You have planned a station of "' + data.title + '" , Click Okay to continue upload the photos and videos.',
      [
        {
          text: 'Okay, Thanks',
          onPress: () => {
            this.onBack();
            //   let expObj = {
            //     parentID: data.parentID,
            //     childID: data.child_ID,
            //   };
            //   this.props.setActiveStation(expObj);
            //   this.props.setStationLoad(false);
            //   data.parentID &&
            //     this.props.navigation.navigate('JoinStation', {
            //       parentID: data.parentID,
            //       childID: data.childID,
            //     });
          },
        },
      ]
    );
    this.setState({
      loading: false,
    });
  };
  onBack = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
  };
  /**
   * Create Station
   *
   */

  onCreateStation = async () => {
    let location = await getUserCurrentLocation();
    const stationObj = new FormData();
    stationObj.append('token', this.props.access_token);
    stationObj.append('uid', this.props.uid);
    stationObj.append('title', this.state.title);
    stationObj.append('description', this.state.description);
    stationObj.append('category', this.state.selectedCategory);
    stationObj.append('live', !this.state.isAfter);
    stationObj.append('public', true);
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
    const sDate = moment().format('YYYY-MM-DD H:m:s');
    stationObj.append('centerPoint', JSON.stringify(centerPoint));
    stationObj.append('fenceBuffer', JSON.stringify(this.props.geofence.fenceBuffer));
    stationObj.append('fenceJson', JSON.stringify(this.props.geofence.data));
    stationObj.append('metadata', JSON.stringify(this.props.geofence.metadata));
    stationObj.append('fenceType', this.props.geofence.shape);
    stationObj.append('startDate', sDate);
    try {
      let obj = {
        formData: stationObj,
        addStationSuccess: this.addStationSuccess,
        addStationFailure: this.addStationFailure,
        location: location,
      };
      await this.props.onAddStation(obj);
      await this.props.setGeofence(null);
      const dotIconImage = await this.getIconImageSource('circle');
      const locationIconImage = await this.getIconImageSource('my_location-24px');
      const flashIconImage = await this.getIconImageSource('privacy-handshake-icon-wrapcopy');
      this.setState({
        ...INITIAL_STATE,
        timeLineData: [
          {
            icon: dotIconImage,
            title: 'Details',
          },
          {
            icon: locationIconImage,
            title: 'Location',
          },
          {
            icon: flashIconImage,
            title: 'When to post',
          },
          {},
        ],
        coordinates: [],
        loading: true,
        isCreated: true,
      });
    } catch (error) {
      Alert.alert('Warning', 'Station creation failed.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  addStationSuccess = response => {
    this._redirectLiveStation(response.data);
  };

  addStationFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Station creation failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  onSwitchLive = value => {
    this.setState({ isAfter: value });
  };

  onToggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  onBack = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('HomeBottom');
  };

  renderDetail = (rowData, sectionID, rowID) => {
    const { title, description, selectedCategory, isAfter, coordinates } = this.state;
    const sectionTitleComp = <StyledBigText>{rowData.title}</StyledBigText>;

    let content = null;
    switch (sectionID) {
      case 0:
        content = (
          <DetailCard
            title={title}
            onChangeTitle={value => {
              this.setState({ title: value });
            }}
            description={description}
            onChangeDescription={value => {
              this.setState({ description: value });
            }}
            onToggleModal={this.onToggleModal}
            category={selectedCategory}
          />
        );
        break;
      case 1:
        content = (
          <StyledCard height={wp('47.22%')} alignItems={'center'} paddingTop={0} paddingBottom={0}>
            {!_.isEmpty(this.state.coordinates) ? (
              <>
                <View style={mapStyles.container}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={mapStyles.map}
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
                        strokeColor={theme.blue.text}
                        fillColor="#8a8a8a5c"
                        strokeWidth={2}
                      />
                    )}
                  </MapView>
                  <DeleteButton
                    onPress={() => {
                      this.state.coordinates = [];
                      this.props.setGeofence(null);
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <StyledMapPlaceholderImage source={images.MAP} />
                <MapSelectButton onPress={this.openMap} />
              </>
            )}
          </StyledCard>
        );
        break;
      case 2:
        content = <PostCard marginBottom={0} isAfter={isAfter} onSwitchLive={this.onSwitchLive} />;
        break;
      case 3:
        const isValidated = title && description && selectedCategory && coordinates !== INITIAL_STATE.coordinates;

        content = (
          <StyledWrapper paddingBottom={wp('18%')}>
            <GradientButton
              onPress={() => {
                this.onCreateStation();
              }}
              buttonText={'Create Station'}
              isValidated={isValidated}
            />
          </StyledWrapper>
        );
        break;
      default:
        break;
    }
    return (
      <View>
        {sectionTitleComp}
        {content}
      </View>
    );
  };

  render() {
    const { isModalVisible, loading, isVisibleLocation } = this.state;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <StyledContainer backgroundColor={'#eaeaea'}>
            <ExperienceHeader title={'Add Station'} onPressBack={this.onBack} experienceType={'station'} />
            <Timeline
              style={timelineStyles.list}
              listViewStyle={timelineStyles.listViewStyle}
              data={this.state.timeLineData}
              renderDetail={this.renderDetail}
              lineColor={'rgba(215, 215, 215, 0.5)'}
              lineWidth={2}
              innerCircle={'icon'}
              showTime={false}
              circleSize={34}
              circleColor={'#eaeaea'}
              iconStyle={timelineStyles.iconStyle}
              options={{
                showsVerticalScrollIndicator: false,
              }}
            />
            <CategoriesModal
              isModalVisible={isModalVisible}
              toggleModal={this.onToggleModal}
              onSelectCategory={this.onSelectCategory}
            />
            <LocationAccess visible={isVisibleLocation} onClose={() => this.setState({ isVisibleLocation: false })} />
          </StyledContainer>
        )}
      </>
    );
  }
}

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
    onAddStation: obj => {
      dispatch(StationActions.addStation(obj));
    },
    setGeofence: obj => {
      dispatch(StationActions.setGeofence(obj));
    },
    setActiveStation: obj => {
      dispatch(StationActions.setActiveStation(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateStation);
