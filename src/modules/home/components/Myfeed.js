import React, { Component, Fragment } from 'react';
import {
  Platform,
  Linking,
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import ModalSelector from 'react-native-modal-selector';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Heatmap } from 'react-native-maps';
import uuid from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import ProgressiveImage from '../../experience/components/organisms/ProgressiveImage';
import FastImage from 'react-native-fast-image';
import Image from 'react-native-image-progress';

import { StyledText, StyledButton, StyledTextArea, StyledCardView, StyledWrapper } from '../../core/common.styles';
import theme from '../../core/theme';
import ExploreAction from '../reducers/index';
import EventAction from '../../experience/reducers/event/index';
import ExperienceActions from '../../experience/reducers/event/index';
import StationActions from '../../experience/reducers/station';
import MemoryActions from '../../experience/reducers/memory';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomIcon from '../../../utils/icon/CustomIcon';
import Filter from './Filter';
import PostFooter from './PostFooter';
import ImageGrid from './ImageGrid';
import { MapSnapshotImage } from './styles';
import { DEVICE_WIDTH, MAP_CONTAINER_HEIGHT, Loading } from '../../../utils';
import { isJoinedEvent, getUserCurrentLocation, isJoinedStation, isJoinedMemory } from '../../../utils/funcs';
import { EXPLORE, DEFAULT_FOUNDER_ID } from '../../../utils/vals';
import CardView from './organisms/CardView';
import FeedLoader from './organisms/FeedLoader';
import LocationAccess from './organisms/LocationAccess';

const { INTIAL_REGION, REGION_DELTA } = EXPLORE;
const moment = require('moment');
const { images, font, gradients, colors } = theme;
const { width, height } = Dimensions.get('window');

const StyledView = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  font-size: 25;
  font-family: ${font.MSemiBoldItalic};
  background-color: #e8e8e8;
`;

const StyledContainerView = styled.ScrollView`
  flex: 1;
  background-color: #e8e8e8;
`;

const StyledRow = styled.View`
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
`;

const StyledTrendingExperienceWrapper = styled.View`
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
  padding-top: ${wp('2.5%')};
  padding-bottom: ${wp('2.5%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
`;

const StyleCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyleCardHeaderImage = styled.Image`
  width: 42;
  height: 42;
  border-radius: 21;
  resize-mode: cover;
`;

const StyleUsername = styled.Text`
  padding-top: 2;
  padding-bottom: 2;
  padding-right: 2;
  text-align-vertical: center;
  margin-left: 5;
  color: #212121;
  font-size: ${wp('4.0%')};
  font-weight: 600;
`;

const StyledTimeStamp = styled.Text`
  padding-top: 2;
  padding-bottom: 2;
  padding-right: 2;
  text-align-vertical: center;
  margin-left: 5;
  color: #8f8f8f;
`;

const StyledCardImage = styled.Image`
  width: 100%;
  height: 480;
`;

const StyledAbsoluteView = styled.View`
  width: 100%;
  flex-direction: row;
  position: absolute;
  bottom: ${hp('15.5%')};
  padding-left: 30;
  padding-right: 30;
  justify-content: space-between;
`;

const StyledLabel = styled.Text`
  color: #ffffff;
  padding-top: 5;
  font-size: 20;
`;

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [
      {
        saturation: '-100',
      },
    ],
  },

  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: 65,
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: '50',
      },
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        saturation: '-100',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'all',
    stylers: [
      {
        lightness: '30',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
      {
        lightness: '40',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colors.aquaColor,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [
      {
        lightness: -25,
      },
      {
        saturation: -100,
      },
    ],
  },
];

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2 || 0};
`;

const StyledGradientButton = styled.TouchableOpacity`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: ${props => props.marginLeft || 0};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? gradients.Background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
      />
      {children}
    </StyledGradientButton>
  );
};

const StyledModalBodyWrapper = styled.View`
  background-color: ${colors.White};
  padding-top: 20;
  padding-right: 20;
  padding-bottom: 20;
  padding-left: 20;
  border-radius: 10;
`;

const StyledModalHeader = styled.Text`
  text-align: center;
  font-size: 20;
  font-weight: 600;
  color: rgb(167, 167, 167);
`;

const StyledSwitchWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10;
`;

const StyledModalContainer = styled.View`
  flex: 1;
  padding-bottom: ${hp('7.5%')};
  justify-content: flex-end;
  align-items: center;
`;

const StyledModalBottomContainer = styled.TouchableOpacity`
  width: ${wp('95.56%')};
  height: ${hp('8.75%')};
  background-color: #ffffff;
  border-radius: 14;
  justify-content: center;
  align-items: center;
`;

const StyledModalCancelText = styled.Text`
  font-size: ${hp('2.27%')};
  color: #007aff;
  font-family: ${font.MMedium};
`;

const StyledModalBodyContainer = styled.View`
  width: ${wp('95.56%')};
  height: ${hp('58%')};
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${hp('1.25%')};
  border-radius: 14;
  background-color: #ffffff;
`;

const StyledUserAvatarWrapper = styled.View`
  width: ${hp('4.9%')};
  height: ${hp('4.9%')};
  border-radius: ${hp('3.45%')};
  justify-content: center;
  align-items: center;
  padding: 2px 2px 2px 2px;
  border-color: #fe7f7e;
  border-width: ${wp('0.2%')};
`;
const MoreIconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={36} color={'#626262'} />
  </StyledButton>
);

const StyledTrendingText = styled.Text`
  font-size: ${wp('4.16%')};
  line-height: ${wp('5.27%')};
  color: #000000;
  font-family: ${font.MBold};
  letter-spacing: 1;
`;

// MyFeed class component
class MyFeed extends Component {
  static navigationOptions = { title: '', header: null };
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      componentIsFocused: false,
      feedSnapshot: null,
      isModalVisible: false,
      reportDescription: '',
      parentID: '',
      childID: '',
      eventType: '',
      currentLocation: { ...INTIAL_REGION },
      isLoading: false,
      isStop: false,
      isRefresh: false,
      pausedVideo: false,
      isShimmer: false,
      isVisibleLocation: false,
    };
    this.page = 0;
    this.moreList = [
      {
        key: 0,
        label: 'Report Event',
      },
    ];

    this.tabFocusedListener = () => null;
    this.tabBlurListener = () => null;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      scrollToTop: this.scrollToTop,
    });

    this.loadData(0, false);
    this.tabFocusedListener = this.props.navigation.addListener('willFocus', this.setComponentIsFocused);
    this.tabBlurListener = this.props.navigation.addListener('willBlur', this.setComponentIsBlur);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      feed: nextProps.explore.feed,
    });
  }

  componentWillUnmount() {
    this.tabFocusedListener.remove();
    this.tabBlurListener.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    /**
     * generate map snapshot when heatmap data has fully loaded
     */
    if (
      this.props.explore &&
      this.props.explore.data &&
      this.props.explore.data.length &&
      prevState.componentIsFocused !== this.state.componentIsFocused
    ) {
      /** wait for 2seconds to make sure heatmap has fully loaded on mapview */
    }
  }

  setComponentIsBlur = () => {
    this.setState({ pausedVideo: true });
  };

  setComponentIsFocused = async () => {
    this.setState({ pausedVideo: false });
    this.setState({ componentIsFocused: true });
    this.scrollToTop();
    let location = await getUserCurrentLocation();

    if (location !== null && location.latitude) {
      this.setState(
        {
          currentLocation: { latitude: location.latitude, longitude: location.longitude },
        },
        () => {
          this.onFocusMap();
        }
      );
    } else {
      if (location !== null && location.code !== 'CANCELLED') {
        this.setState({ isShimmer: false, isVisibleLocation: true });
      } else {
        this.setState({ isShimmer: false });
      }
    }
  };

  scrollToTop = () => {
    if (this.refs && this.refs.flatListRef) {
      this.refs.flatListRef.scrollToOffset({ x: 0, y: 0, animated: false });
    }
  };

  onSelect = option => {
    this.setState({
      selected: option,
    });
  };

  onShowMoreList = item => {
    this.setState({
      parentID: item.postID,
      childID: item.childID,
    });
    this.selector.open();
  };

  onEventPress = async item => {
    this.setState({ pausedVideo: true });
    if (item.type === 'event') {
      this.props.setEventLoad(false);
      let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, item.postID, item.childID);
      if (!isJoin) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        let sDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
        let eDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
        if (now > eDate || item.is_deleted === 1) {
          // Post Event
          this.props.navigation.navigate('PostEvent', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        } else if (now > sDate && now < eDate) {
          // Live Event
          this.props.navigation.navigate('LiveEvent', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        } else {
          // View EVent
          this.props.navigation.navigate('ViewEvent', {
            parentID: item.postID,
            childID: item.childID,
          });
        }
      }
    } else if (item.type === 'station') {
      this.props.setStationLoad(false);
      let isJoin = await isJoinedStation(this.props.navigation, this.props.station, item.postID, item.childID);
      if (!isJoin) {
        if (item.is_deleted === 1) {
          this.props.navigation.navigate('PostStation', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        } else {
          this.props.navigation.navigate('LiveStation', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        }
      }
    } else if (item.type === 'memory') {
      this.props.setMemoryLoad(false);
      let isJoin = await isJoinedMemory(this.props.navigation, this.props.memory, item.postID, item.childID);
      if (!isJoin) {
        if (item.is_deleted === 1) {
          this.props.navigation.navigate('PostMemory', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        } else {
          this.props.navigation.navigate('LiveMemory', {
            parentID: item.postID,
            childID: item.childID,
            route_type: 'user_experience',
            user_id: item.userID,
            first_name: item.name,
          });
        }
      }
    }
  };

  feedEventPost = (item, index) => {
    return (
      <StyledCardView marginTop={index === 0 ? 16 : undefined}>
        <StyleCardHeader>
          <StyledWrapper row secondary={'center'} paddingLeft={10} paddingRight={10} paddingBottom={6} paddingTop={10}>
            <StyledUserAvatarWrapper>
              <FastImage
                source={{ uri: item.uUrl }}
                style={{ width: hp('4.25%'), height: hp('4.25%'), borderRadius: hp('3.125%') }}
              />
            </StyledUserAvatarWrapper>
            <StyledRow flexDirection={'column'}>
              <StyleUsername>{item.name}</StyleUsername>
              <StyledTimeStamp>
                {moment(item.created_at * 1000)
                  .endOf('day')
                  .fromNow()}
              </StyledTimeStamp>
            </StyledRow>
          </StyledWrapper>

          <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={10} paddingTop={10}>
            {
              // <CustomIcon
              //   name={'bookmark_border-24px'}
              //   size={30}
              //   color={'#626262'}
              // />
            }
            <MoreIconButton onPress={() => this.toggleReportModal(item)} />
          </StyledRow>
        </StyleCardHeader>
        <TouchableWithoutFeedback onPress={() => this.onEventPress(item)}>
          <View>
            <ProgressiveImage source={{ uri: item.iUrl }} width={'100%'} height={hp('55%')} backgroundColor={'white'} />
          </View>
        </TouchableWithoutFeedback>

        <StyledAbsoluteView>
          {/* <StyledLabel>{item.title}</StyledLabel> */}
          {/* <StyledRow>
            <CustomIcon name={'bookmark_border-24px'} size={30} color={'#fff'} />
            <StyledLabel>{item.like_count}</StyledLabel>
          </StyledRow> */}
        </StyledAbsoluteView>
        <PostFooter data={item} />
      </StyledCardView>
    );
  };

  toggleReportModal = item => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      parentID: item.postID,
      childID: item.childID,
      eventType: item.type,
    });
  };

  onSubmitReport = async () => {
    this.setState({ loading: true });
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parent_id', this.state.parentID);
    obj.append('child_id', this.state.childID);
    obj.append('message', this.state.reportDescription);
    obj.append('type', this.state.eventType);

    await this.props.onReportEvent(obj);
    this.setState({
      loading: false,
      isModalVisible: false,
      parentID: '',
      childID: '',
      eventType: '',
    });
  };

  onPressLike = async item => {
    const { type, media, postID, childID } = item;
    let onLikeApi = this.props.onLikeEvent;
    if (type === 'station') {
      onLikeApi = this.props.onLikeStation;
    } else if (type === 'memory') {
      onLikeApi = this.props.onLikeMemory;
    }
    let location = await getUserCurrentLocation();
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('parentID', postID);
    obj.append('childID', childID);
    obj.append('mediaID', media);
    let likeObj = {
      formData: obj,
      location: location,
      onSuccess: response => {},
      onFailure: () => {},
    };
    onLikeApi(likeObj);
  };

  reportModalView = () => (
    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>
      <StyledModalBodyWrapper>
        <StyledModalHeader>Report Event</StyledModalHeader>
        <StyledTextArea
          placeholder="Report description"
          placeholderTextColor={'rgb(167, 167, 167)'}
          numberOfLines={10}
          multiline={true}
          onChangeText={text =>
            this.setState({
              reportDescription: text,
            })
          }
          value={this.state.reportDescription}
        />
        <GradientButton
          width={wp('72%')}
          height={hp('3.9%')}
          marginLeft={wp('4.5%')}
          onPress={() => {
            this.onSubmitReport();
          }}
          isActive={this.state.reportDescription}
        >
          {!this.state.loading ? (
            <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
              {'Submit'}
            </StyledText>
          ) : (
            <Loading />
          )}
        </GradientButton>
      </StyledModalBodyWrapper>
    </Modal>
  );

  onSelectMoreData = option => {
    if (option.label === 'Report Event') {
      this.toggleReportModal();
    }
  };

  onFocusMap = () => {
    const { currentLocation } = this.state;
    if (this.feedMap) {
      this.feedMap.animateToRegion({
        ...currentLocation,
        latitudeDelta: 8.4,
        longitudeDelta: 6.4,
      });
    }
  };

  // onBookmark = (is_bookmark, postID) => {
  //   const obj = new FormData();
  //   obj.append('token', this.props.auth.access_token);
  //   obj.append('_method', 'POST');
  //   obj.append('parentID', postID);
  //   obj.append('is_bookmark', is_bookmark);
  //   this.props.onBookmarkPost(obj);
  // };

  loadData = (page, refresh) => {
    if (this.props.explore.feed && this.props.explore.feed.length === 0) {
      this.setState({ isShimmer: true });
    }
    this.setState({ isLoading: true, isRefresh: refresh });
    const feedReqObj = {
      token: this.props.auth.access_token,
      index: page,
      uid: this.props.auth.uid,
      onSuccess: data => {
        if (data.length === 0) {
          this.setState({ isStop: true });
        }
        this.setState({ isLoading: false, isRefresh: false, isShimmer: false });
        this.page = this.page + 10;
      },
      onFail: () => {
        this.setState({ isLoading: false, isRefresh: false, isShimmer: false });
      },
    };
    this.props.onGetFeed(feedReqObj);
  };

  onLoadMore = () => {
    if (!this.state.isLoading && !this.state.isStop) {
      this.loadData(this.page, false);
    }
  };

  renderHeader = () => {
    const { currentLocation } = this.state;
    return (
      <View style={{ marginBottom: 8, width: width }}>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType={'standard'}
            scrollEnabled={false}
            customMapStyle={mapStyle}
            maxZoomLevel={6.5}
            minZoomLevel={6.5}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: 8.4,
              longitudeDelta: 6.4,
            }}
            ref={feedMap => {
              this.feedMap = feedMap;
            }}
          >
            {this.props.explore.feed && this.props.explore.feed.length > 0 && (
              <MapView.Heatmap
                points={this.props.explore.feed.map(item => ({
                  latitude: item.lat,
                  longitude: item.lng,
                  weight: Math.random() * 100,
                }))}
                gradient={{
                  colors: ['#8FB0F2', '#A8F4B5', '#F6FA68', '#E0C557', '#C53733', '#3EC0BE'],
                  startPoints: [0.22, 0.24, 0.48, 0.72, 0.87, 0.96],
                  colorMapSize: 256,
                }}
                heatmapMode={'POINTS_WEIGHT'}
                maxIntensity={100}
                gradientSmoothing={5}
                radius={30}
                opacity={1}
              />
            )}
          </MapView>
          <View style={{ height: MAP_CONTAINER_HEIGHT, width: '100%', position: 'absolute' }} />
        </View>
        <StyledTrendingExperienceWrapper>
          <StyledTrendingText>Trending Experiences</StyledTrendingText>
          <Filter onSelect={this.onSelect} selected={this.state.selected} />
        </StyledTrendingExperienceWrapper>
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.isLoading) return null;
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  renderEmptyView = () => (
    <>
      <View style={styles.notFoundWrapper}>
        <Text style={styles.notFoundText}>No experience found</Text>
      </View>
    </>
  );
  render = () => {
    let filteredData = [];
    const { isShimmer } = this.state;
    if (this.props.explore.feed) {
      const userData = this.props.explore.feed;

      filteredData = userData.filter(event => {
        if (this.state.selected !== null) {
          return event.type === this.state.selected;
        }
        return event;
      });
      const imageInfos = filteredData.map(item => ({
        id: uuid.v4(),
        url: item.iUrl,
        width: item.width,
        height: item.height,
        ratio: item.width / item.height,
        size: item.width * item.height,
      }));
    }
    const { isRefresh, pausedVideo, isVisibleLocation } = this.state;
    if (!isShimmer) {
      return (
        <>
          <StyledView>
            {
              <StyledWrapper>
                <FlatList
                  ref="flatListRef"
                  data={filteredData}
                  contentContainerStyle={{ paddingBottom: wp('8.33%') }}
                  ListHeaderComponent={this.renderHeader}
                  renderItem={({ item, index }) => (
                    <CardView
                      data={item}
                      onPressEvent={this.onEventPress}
                      experience_type={'my_feed'}
                      navigation={this.props.navigation}
                      pausedVideo={pausedVideo}
                      onPressAvatar={uID => {
                        if (uID !== DEFAULT_FOUNDER_ID) {
                          this.props.setProfileLoad(false);
                          this.props.navigation.push('ViewProfile', { uid: uID });
                        }
                      }}
                      onPressLike={() => this.onPressLike(item)}
                    />
                  )}
                  keyExtractor={(item, index) => '' + index}
                  showsVerticalScrollIndicator={false}
                  onEndReached={this.onLoadMore}
                  onEndReachedThreshold={0.4}
                  ListFooterComponent={this.renderFooter}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefresh}
                      onRefresh={() => {
                        this.setState({ isStop: false });
                        this.loadData(0, true);
                        this.page = 0;
                      }}
                    />
                  }
                  ListEmptyComponent={this.renderEmptyView}
                />
              </StyledWrapper>
            }
          </StyledView>
          {this.reportModalView()}
          <LocationAccess visible={isVisibleLocation} onClose={() => this.setState({ isVisibleLocation: false })} />
        </>
      );
    } else {
      return <FeedLoader />;
    }
  };
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    explore: state.explore,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetFeed: obj => {
      dispatch(ExploreAction.getFeedRequest(obj));
    },
    onReportEvent: obj => {
      dispatch(EventAction.reportEvent(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
    onLikeStation: obj => {
      dispatch(StationActions.likeStation(obj));
    },
    onLikeMemory: obj => {
      dispatch(MemoryActions.likeMemory(obj));
    },
    onLikeEvent: obj => {
      dispatch(ExperienceActions.likeEvent(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyFeed);

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#e8e8e8',
    flexGrow: 1,
  },
  imageContainer: {
    borderRadius: 23,
    padding: wp('1.8%'),
  },
  container: {
    height: MAP_CONTAINER_HEIGHT,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  notFoundWrapper: {
    justifyContent: 'center',
    flex: 1,
    height: height * 0.3,
  },
  notFoundText: {
    alignSelf: 'center',
    fontSize: wp('5%'),
  },
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  optionContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  optionStyle: {
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
  },
  cancelStyle: {
    backgroundColor: 'white',
    height: hp('8%'),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
    fontFamily: font.MSemiBold,
  },
  sectionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTextStyle: {
    fontSize: hp('2%'),
    color: '#8f8f8f',
    fontFamily: font.MMedium,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  modalStyle: {
    margin: 0,
  },
  avatarStyle: {
    width: hp('4.25%'),
    height: hp('4.25%'),
    borderRadius: hp('3.125%'),
  },
  cardImageStyle: {
    width: '100%',
    height: hp('55%'),
  },
});
