import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import theme from '../../../core/theme';
import ExperienceActions from '../../reducers/event/index';
import { StyledHorizontalContainer, StyledButton, StyledText } from '../../../core/common.styles';
import CustomIcon from '../../../../utils/icon/CustomIcon';
const { colors, font, gradients } = theme;
import { connect } from 'react-redux';
import _ from 'lodash/fp';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import { getCustomMapMarkerIcon } from '../../../../utils/funcs';
import { createStructuredSelector } from 'reselect';
import { EXPLORE } from '../../../../utils/vals';
import { selectAuth } from '../../../auth/reducers';
import { selectOtherUserMediaData } from '../../reducers/event';
const { EVENT_DATA, INTIAL_REGION } = EXPLORE;
import { Loading } from '../../../../utils';
import MapArea from '../organisms/MapArea';
import * as geolib from 'geolib';

const StyledContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: ${colors.LightGreyTwo};
`;

const ArrowButton = props => (
  <StyledButton {...props} marginLeft={-10} marginRight={wp('2.22%')}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#D9D8D4'} />
  </StyledButton>
);

const StyledTitleText = styled.Text`
  font-size: ${hp('2.1875%')};
  line-height: ${hp('2.81%')};
  font-family: ${font.MRegular};
  font-weight: 600;
  color: #fbfbfb;
`;

const StyledBottomCard = styled.View`
  width: 100%;
  padding-bottom: ${hp('1.25%')};
`;

const StyledMapContainer = styled.View`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('100%')};
  border-radius: 15;
  border-width: 0;
`;

const StyledMediaButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledPhotoInfoWrapper = styled.View`
  position: absolute;
  left: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  width: ${wp('30%')};
  height: ${hp('4.06%')};
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: ${hp('2.03%')};
  background-color: rgba(0, 0, 0, 0.4);
`;

const StyledPhotoText = styled.Text`
  font-size: ${hp('1.56%')};
  font-family: ${font.MSemiBold};
  margin-left: ${wp('1.39%')};
  color: #fefefe;
`;

const PhotoInfo = props => (
  <StyledPhotoInfoWrapper>
    <StyledPhotoText>{`🔥 ${props.likes}`}</StyledPhotoText>
    <StyledPhotoText>{`💬 ${props.msgCounts}`}</StyledPhotoText>
  </StyledPhotoInfoWrapper>
);

class MapDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: EVENT_DATA,
      mapMode: 'standard',
    };
  }

  componentDidMount() {
    const parentID = this.props.navigation.getParam('parentID');
    const userID = this.props.navigation.getParam('userID');
    const obj = {
      parentID: parentID,
      userID: userID,
      token: this.props.auth.access_token,
    };
    this.props.onGetOtherUserMedia(obj);
  }
  _renderItem = ({ item, index }) => {
    return (
      <StyledButton marginTop={hp('1.25%')}>
        <View style={styles.image}>
          <Image source={{ uri: item.url }} style={styles.imageStyle} imageStyle={{ borderRadius: 15 }} />
        </View>
        <PhotoInfo likes={item.likes} msgCounts={item.comments} />
      </StyledButton>
    );
  };
  onChangeMapMode = () => {
    this.setState(prevState => ({
      mapMode: prevState.mapMode === 'standard' ? 'satellite' : 'standard',
    }));
  };

  goToInitialLocation = () => {
    this.mapView.animateToRegion(this.initialRegion, 2000);
    this.polygon.setNativeProps({ coordinates: this.coordinates });
  };
  onSelectEvent=selectItem=>{
    const { data } = this.props.other_user_media;
    data.other_user_media.map((item,index)=>{
      if(selectItem.mediaId===item.mediaId){
        this._carousel.snapToItem(index);
      }
    })
  }

  render() {
    if (this.props.other_user_media != undefined) {
      const { mapMode, mapData } = this.state;
      const { data } = this.props.other_user_media;

      let coordinate = [];
      data.fenceBuffer.coordinates[0].map((item, index) => {
        let obj = { latitude: item[1], longitude: item[0] };
        coordinate.push(obj);
      });
      this.coordinates = coordinate;
      let markerCoordinate = [];
      let carouselData = [];
      data.other_user_media.map((item, index) => {
        let obj = { mediaId: item.mediaId, latitude: item.lat, longitude: item.lng };
        markerCoordinate.push(obj);
      });

      carouselData = data.other_user_media;
      const center = geolib.getCenterOfBounds(coordinate);
      const bounds = geolib.getBounds(coordinate);
      const latitudeDelta = Math.abs(center.latitude - bounds.minLat) * 2.6;
      const longitudeDelta = Math.abs(center.longitude - bounds.minLng) * 2.6;
      this.initialRegion = {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      };

      return (
        <StyledContainer>
          <View>
            <StyledMapContainer>
              <MapView
                style={styles.map}
                initialRegion={this.initialRegion}
                followUserLocation={true}
                ref={ref => (this.mapView = ref)}
                showsUserLocation={false}
                onMapReady={this.goToInitialLocation}
                zoomEnabled={true}
                mapType={mapMode}
              >
                <Polygon
                  ref={el => (this.polygon = el)}
                  coordinates={this.coordinates}
                  strokeColor="#FFA06D"
                  fillColor="rgba(138,138,92,0.1)"
                  strokeWidth={2}
                />
                {/* <Marker
                  coordinate={{ latitude: center.latitude, longitude: center.longitude }}
                  image={theme.images.CAMERA_MARKER}
                /> */}
                {markerCoordinate &&
                  markerCoordinate.map((item, index) => {
                    return (
                      <Marker
                        key={index}
                        coordinate={item}
                        image={theme.images.CAMERA_MARKER}
                         onPress={() => this.onSelectEvent(item)}
                      />
                    );
                  })}
              </MapView>
            </StyledMapContainer>
          </View>

          <View style={styles.topContainerStyle}>
            <View style={{ flex: 0.8, paddingRight: 10 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.backButtonStyle}>
                  <View style={{ marginLeft: -10 }}>
                    <CustomIcon name={'keyboard_arrow_left-24px'} size={36} color={'#D9D8D4'} />
                  </View>
                  <StyledTitleText>{data.title}</StyledTitleText>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.iconContainerStyle} onPress={this.onChangeMapMode}>
                <CustomIcon name={'earth-filled'} size={20} color={'#7F7F7F'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainerStyle} onPress={this.goToInitialLocation}>
                <CustomIcon name={'my_location-24px'} size={20} color={'#7F7F7F'} />
              </TouchableOpacity>
            </View>
          </View>
          <StyledBottomCard>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={carouselData}
              renderItem={this._renderItem}
              sliderWidth={wp('100%')}
              itemWidth={wp('72.22%')}
              activeSlideAlignment={'center'}
              firstItem={1}
              inactiveSlideScale={0.82}
              removeClippedSubviews={false}
              inactiveSlideOpacity={1}
              onSnapToItem={slideIndex => {
                this.setState({
                  selectedEntryIndex: slideIndex,
                });
              }}
            />
          </StyledBottomCard>
        </StyledContainer>
      );
    } else {
      return <Loading />;
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
  },
  imageStyle: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topContainerStyle: {
    position: 'absolute',
    left: 0,
    top: hp('10%'),
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  backButtonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#8A8983',
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },
  iconContainerStyle: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStateToProps = createStructuredSelector({
  auth: selectAuth,
  other_user_media: selectOtherUserMediaData,
});

const mapDispatchToProps = dispatch => {
  return {
    onGetOtherUserMedia: obj => {
      dispatch(ExperienceActions.getOtherUserMedia(obj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapDisplay);
