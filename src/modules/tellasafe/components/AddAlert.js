import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Geojson } from 'react-native-maps';
import * as geolib from 'geolib';
import _ from 'lodash/fp';
import styled from 'styled-components/native';

// Import reducers and selecotrs
import { connect } from 'react-redux';
import AlertActions from '../reducers/index';
import { createStructuredSelector } from 'reselect';
import { selectAccessToken, selectUid } from '../../auth/reducers';
import { selectGeofence, selectData, selectCurrent, selectCategoryLists } from '../../experience/reducers/event';
import { selectSettings } from '../reducers/index';

// Load theme
import theme from '../../core/theme';
const { images, colors, font, gradients } = theme;

// Import Categories
import AlertCategories from './organisms/AlertCategories';

// Load styles
import { timelineStyles, mapStyles, modalStyles } from '../../core/common.styles';
import { StyledContainer, GradientButton, StyledWrapper } from '../../../styles/Common.styles';
import {
  Header,
  StyledBigText,
  StyledCard,
  DetailCard,
  PostCard,
  StyledMapPlaceholderImage,
  MapSelectButton,
  MapEditButton,
} from '../../experience/components/memory/molecules/Form';

// Import organisms
import ExperienceHeader from '../../experience/components/organisms/ExperienceHeader';
const moment = require('moment');

// Load utils
import CustomIcon from '../../../utils/icon/CustomIcon';
import { getUserCurrentLocation } from '../../../utils/funcs';
import { Loading } from '../../../utils';

const StyledDeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 10;
  top: 10;
  border-radius: 5;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-color: #e14e55;
  border-width: ${hp('0.15%')};
`;
const DeleteButton = props => (
  <StyledDeleteButton {...props}>
    <CustomIcon name={'close-24px'} size={25} />
  </StyledDeleteButton>
);

const CategoriesModal = ({ isModalVisible, toggleModal, onSelectCategory }) => {
  return (
    <Modal isVisible={isModalVisible} style={modalStyles.container}>
      <AlertCategories categoryType={'safe'} toggleModal={toggleModal} onSelectCategory={onSelectCategory} />
    </Modal>
  );
};

const INITIAL_STATE = {
  timeLineData: [],
  title: '',
  description: '',
  category: 'General',
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
};

class AddAlert extends Component {
  inputRef = React.createRef();
  constructor(props) {
    super(props);

    const dataFromMapView = this.props.navigation.getParam('data');
    let title = 'Tellasafe Alert';
    let description = 'There is danger in this area.';
    let selectedCategory = '';
    let isCreated = false;
    if (dataFromMapView) {
      title = dataFromMapView.title;
      description = dataFromMapView.description;
      selectedCategory = dataFromMapView.selectedCategory;
      isCreated = dataFromMapView.isCreated;
    }

    this.state = {
      timeLineData: [],
      title: title,
      description: description,
      selectedCategory: selectedCategory,
      initialRegion: {
        latitude: -29.1482491,
        longitude: -51.1559028,
        latitudeDelta: 0.0922 * 1.5,
        longitudeDelta: 0.0421 * 1.5,
      },
      loading: false,
      coordinates: [],
      isCreated: isCreated,
      isModalVisible: false,
    };
    this.openMap = this.openMap.bind(this);
    this.goToInitialLocation = this.goToInitialLocation.bind(this);
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

  componentDidMount = async () => {
    const dotIconImage = await this.getIconImageSource('circle');
    const locationIconImage = await this.getIconImageSource('my_location-24px');
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
          {},
        ],
      })
    );
  };

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.state.initialRegion, 2000);
  };

  openMap = () => {
    const { title, description, selectedCategory, isCreated } = this.state;

    this.props.navigation.push('SafeMap', {
      isUpdate: false,
      data: { title, description, selectedCategory, isCreated },
    });
  };

  onAddAlert = async () => {
    let location = await getUserCurrentLocation();
    const alertObj = new FormData();
    alertObj.append('token', this.props.access_token);
    alertObj.append('uid', this.props.uid);
    alertObj.append('title', this.state.title);
    alertObj.append('description', this.state.description);
    alertObj.append('category', this.state.selectedCategory);
    alertObj.append('live', true);
    alertObj.append('public', true);
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
    alertObj.append('centerPoint', JSON.stringify(centerPoint));
    alertObj.append('fenceBuffer', JSON.stringify(this.props.geofence.fenceBuffer));
    alertObj.append('fenceJson', JSON.stringify(this.props.geofence.data));
    alertObj.append('metadata', JSON.stringify(this.props.geofence.metadata));
    alertObj.append('fenceType', this.props.geofence.shape);
    try {
      let obj = {
        formData: alertObj,
        addAlertSuccess: this.addAlertSuccess,
        addAlertFailure: this.addAlertFailure,
        location: location,
      };
      await this.props.onAddAlert(obj);
      await this.props.setGeofence(null);
      const dotIconImage = await this.getIconImageSource('circle');
      const locationIconImage = await this.getIconImageSource('my_location-24px');
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
          {},
        ],
        coordinates: [],
        loading: true,
        isCreated: true,
      });
    } catch (error) {
      Alert.alert('Warning', 'Alert creation failed.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  addAlertSuccess = response => {
    Alert.alert('Success', 'Alert successfully created.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.props.navigation.navigate('Explore', { routeData: { parent_id: response.data.parentID } });
        },
      },
    ]);
    this.setState({
      loading: false,
    });
  };

  addAlertFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Alert creation failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  onToggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  renderDetail = (rowData, sectionID, rowID) => {
    const { title, description, selectedCategory, coordinates } = this.state;
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
            experienceType={'safe'}
            inputRef={this.inputRef}
          />
        );
        break;
      case 1:
        content = (
          <StyledCard
            height={wp('47.22%')}
            alignItems={'center'}
            paddingTop={0}
            paddingBottom={0}
            marginBottom={wp('5%')}
          >
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
                        strokeColor={theme.tellasafe.text}
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
                {/* <MapEditButton onPress={this.openMap} /> */}
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
        const isValidated = title && description && selectedCategory && coordinates.length > 0;
        content = (
          <StyledWrapper paddingBottom={wp('18.33%')}>
            <GradientButton
              onPress={() => {
                this.onAddAlert();
              }}
              buttonText={'Post Alert'}
              isValidated={isValidated}
              experienceType={'safe'}
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

  onBack = () => {
    this.props.navigation.navigate('Trending');
  };

  render() {
    const { isModalVisible, loading } = this.state;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <StyledContainer backgroundColor={'#eaeaea'}>
            <ExperienceHeader title={'Add Alert'} onPressBack={this.onBack} experienceType={'safe'} />

            <Timeline
              style={timelineStyles.list}
              listViewStyle={[timelineStyles.listViewStyle, { paddingTop: wp('9.44%') }]}
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
  settings: selectSettings,
});

const mapDispatchToProps = dispatch => {
  return {
    onAddAlert: obj => {
      dispatch(AlertActions.addAlert(obj));
    },
    setGeofence: obj => {
      dispatch(AlertActions.setGeofence(obj));
    },
    onGetSettings: obj => {
      dispatch(AlertActions.getSettings(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAlert);
