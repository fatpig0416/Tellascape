import React, { Component } from 'react';
import { StyledAlertContainer, AlertCard } from './molecules/Forms';
import DangerModal from './organisms/DangerModal';
import Modal from 'react-native-modal';
import { Alert, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { modalStyles } from '../../core/common.styles';
import { selectAccessToken, selectUid } from '../../auth/reducers/index';
import { selectGeofence, selectSettings } from '../reducers/index';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserCurrentLocation } from '../../../utils/funcs';
import SafeActions from '../reducers/index';
const moment = require('moment');
import * as geolib from 'geolib';
import { LatLng, computeOffset } from 'spherical-geometry-js';

const CategoriesModal = ({ isModalVisible, toggleModal, onHandleSendAlert }) => {
  return (
    <Modal isVisible={isModalVisible} style={modalStyles.container}>
      <DangerModal toggleModal={toggleModal} onHandleSendAlert={onHandleSendAlert} />
    </Modal>
  );
};

class SafeAlert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      selectedCategory: '',
    };
    this._redirectExplorePage = this._redirectExplorePage.bind(true);
  }

  onToggleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  toAddAlert = () => {
    this.props.navigation.navigate('AddAlert');
  };
  alertOnInterval = response => {
    let obj = {
      token: this.props.access_token,
      parentID: response.parentID,
      onSuccess: () => {},
      onFail: () => {},
    };
    try {
      // setTimeout(() => this.props.onSendAlert(obj), 1000);
    } catch (e) {}
    // let interval = setInterval(() => {
    //   this.props.onSendAlert(obj);
    // }, 60000);
    // setTimeout(() => {
    //   this.props.onSendAlert(obj);
    //   clearInterval(interval);
    // }, 180000);
  };
  onHandleSendAlert = async (dangerTitle, dangerDescription, selectedCategory) => {
    let location = await getUserCurrentLocation();
    const alertObj = new FormData();
    alertObj.append('token', this.props.access_token);
    alertObj.append('uid', this.props.uid);
    alertObj.append('title', dangerTitle);
    alertObj.append('description', dangerDescription);
    alertObj.append('category', selectedCategory);
    alertObj.append('live', true);
    alertObj.append('public', true);
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
      var gpos = computeOffset(latlng, 8, degreeStep * ii);
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
      var gpos = computeOffset(latlng, 4828, degreeStep * i); // 5 miles to 8046.72 meter
      points.push([gpos.lng(), gpos.lat()]);
    }
    points.push(points[0]);
    buffer_coords.push(points);

    let fenceBuffer = {
      type: 'Polygon',
      coordinates: buffer_coords,
    };
    alertObj.append('centerPoint', JSON.stringify(centerPoint));
    alertObj.append('fenceBuffer', JSON.stringify(fenceBuffer));
    alertObj.append('fenceJson', JSON.stringify(fenceJson));
    alertObj.append('metadata', JSON.stringify(meta));
    alertObj.append('fenceType', 'circle');
    try {
      let obj = {
        formData: alertObj,
        addAlertSuccess: this.addAlertSuccess,
        addAlertFailure: this.addAlertFailure,
        location: location,
      };
      await this.props.onAddAlert(obj);
      this.setState({
        loading: true,
      });
    } catch (error) {
      Alert.alert('Warning', 'Alert Creation failed.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  addAlertSuccess = response => {
    // this.alertOnInterval(response.data);
    this._redirectExplorePage(response.data);
  };

  _redirectExplorePage = data => {
    this.setState({
      loading: false,
    });
    this.setState({ loading: false });
    Alert.alert(
      'Success',
      'Alert created successfully, Notification sent to the emergency contacts.',
      [
        {
          text: 'OK',
          onPress: () => {
            this.props.onCloseToggle();
            this.props.navigation.navigate('Explore', { routeData: { parent_id: data.parentID } });
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  addAlertFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Alert creation failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  render() {
    const { isModalVisible } = this.state;

    return (
      <>
      <View style={styles.mainstyle}/>
        <View style={{height:hp('50%'),justifyContent:'flex-end'}}>
          <StyledAlertContainer style={{ height: hp('23%') }}>
            <AlertCard
              onPress={this.onToggleModal}
              title={'I am in Danger'}
              description={'send emergency alert\nand location'}
              alertType={'danger'}
            />
            <AlertCard
              onPress={this.toAddAlert}
              title={'I am Safe'}
              description={'notify others about\nan issue'}
              alertType={'safe'}
            />
          </StyledAlertContainer>
        </View>

        <CategoriesModal
          isModalVisible={isModalVisible}
          toggleModal={this.onToggleModal}
          onHandleSendAlert={this.onHandleSendAlert}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainstyle: {
    width: wp('95.83%'),
    height: hp('29.72%'),
    backgroundColor: 'rgba(0,0,0,0)',
  },
})

const mapStateToProps = createStructuredSelector({
  access_token: selectAccessToken,
  uid: selectUid,
  geofence: selectGeofence,
  settings: selectSettings,
});

const mapDispatchToProps = dispatch => {
  return {
    onAddAlert: obj => {
      dispatch(SafeActions.addAlert(obj));
    },
    onSendAlert: obj => {
      dispatch(SafeActions.sendAlert(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SafeAlert);
