import React, { Component } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Modal from 'react-native-modal';
import _ from 'lodash/fp';
import styled from 'styled-components/native';

// Import reducers and selecotrs
import { connect } from 'react-redux';
import EventActions from '../../reducers/event/index';

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

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { getUserCurrentLocation } from '../../../../utils/funcs';
import { Loading } from '../../../../utils';

// Import organisms
import ExperienceHeader from '../organisms/ExperienceHeader';

const StyledDeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 10;
  top: 10;
  border-radius: 5;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-color: #43cfb9;
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
      <Categories categoryType={'event'} toggleModal={toggleModal} onSelectCategory={onSelectCategory} />
    </Modal>
  );
};

const INITIAL_STATE = {
  timeLineData: [],
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
  isModalVisible: false,
  isSlectPhotoModalVisible: false,
};

class UpdateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.event_data[0].title,
      description: this.props.event_data[0].description,
      selectedCategory: this.props.event_data[0].category,
    };
  }

  componentDidMount = async () => {
    const dotIconImage = await this.getIconImageSource('circle');
    this.props.setGeofence(null);
    CustomIcon.getImageSource('circle', 10, '#EFEFEF').then(source =>
      this.setState({
        timeLineData: [
          {
            icon: dotIconImage,
            title: 'Details',
          },
          {},
        ],
      })
    );
  };

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  /**
   * Update Event
   *
   */

  onUpdateEventPress = async () => {
    const { navigation } = this.props;
    let location = await getUserCurrentLocation();
    if (
      navigation.getParam('parentID') &&
      navigation.getParam('parentID') !== undefined &&
      navigation.getParam('childID') &&
      navigation.getParam('childID') !== undefined
    ) {
      const eventObj = new FormData();
      eventObj.append('token', this.props.auth.access_token);
      eventObj.append('parentID', navigation.getParam('parentID'));
      eventObj.append('childID', navigation.getParam('childID'));
      eventObj.append('title', this.state.title);
      eventObj.append('description', this.state.description);
      eventObj.append('category', this.state.selectedCategory);

      try {
        let obj = {
          formData: eventObj,
          updateEventSuccess: this.updateEventSuccess,
          updateEventFailure: this.updateEventFailure,
          location: location,
        };
        await this.props.onUpdateEvent(obj);
        this.setState({ loading: true });
      } catch (error) {
        Alert.alert('Warning', 'Update Event failed.', [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    }
  };

  updateEventSuccess = response => {
    Alert.alert('Update Event', 'Event information has been updated.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.onBack();
        },
      },
    ]);
    this.setState({
      loading: false,
    });
  };

  updateEventFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Event update failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  onToggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  renderDetail = (rowData, sectionID, rowID) => {
    const { title, description, selectedCategory } = this.state;
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
            experienceType={'event'}
          />
        );
        break;
      case 1:
        const isValidated = title && description && selectedCategory;
        content = (
          <StyledWrapper paddingBottom={wp('18%')}>
            <GradientButton
              onPress={() => {
                this.onUpdateEventPress();
              }}
              buttonText={'Update Event'}
              isValidated={isValidated}
              experienceType={'event'}
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
    const { isModalVisible, loading } = this.state;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <StyledContainer backgroundColor={'#eaeaea'}>
            <ExperienceHeader title={'Update Event'} onPressBack={this.onBack} experienceType={'event'} />
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
          </StyledContainer>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    event: state.experience,
    event_data: state.experience.event_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateEvent: obj => {
      dispatch(EventActions.updateQuickEvent(obj));
    },
    setGeofence: obj => {
      dispatch(EventActions.setGeofence(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateEvent);
