import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Modal from 'react-native-modal';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import * as geolib from 'geolib';
import _ from 'lodash/fp';

// Import reducers and selecotrs
import { connect } from 'react-redux';
import { TextField } from 'react-native-material-textfield';

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
import AlertCategories from './organisms/AlertCategories';

// Load theme
import theme from '../../core/theme';
const { images, colors, font, gradients } = theme;

// Load utils
import CustomIcon from '../../../utils/icon/CustomIcon';
import AlertActions from '../reducers';
import { Loading } from '../../../utils';
import { getUserCurrentLocation } from '../../../utils/funcs';

// Import organisms
import ExperienceHeader from '../../experience/components/organisms/ExperienceHeader';

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
  isLoading: false,
  selectedCategory: '',
  isModalVisible: false,
};
class EditStation extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount = async () => {
    const { state } = this.props.navigation;
    if (state.params && state.params.title && state.params.description && state.params.category) {
      const { title, description, category } = state.params;
      this.setState({
        title: title,
        description: description,
        selectedCategory: category,
      });
    }

    const dotIconImage = await this.getIconImageSource('circle');
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

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  onToggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  onEditAlert = async () => {
    const { state } = this.props.navigation;
    if (state.params && state.params.parentID && state.params.childID) {
      const { parentID, childID } = state.params;
      this.setState({ isLoading: true });
      let location = await getUserCurrentLocation();
      const alertObj = new FormData();
      alertObj.append('token', this.props.auth.access_token);
      alertObj.append('uid', this.props.auth.uid);
      alertObj.append('parentID', parentID);
      alertObj.append('childID', childID);
      alertObj.append('title', this.state.title);
      alertObj.append('description', this.state.description);
      alertObj.append('category', this.state.selectedCategory);
      alertObj.append('_method', 'PUT');
      try {
        let obj = {
          formData: alertObj,
          onSuccess: () => {
            this.setState({ isLoading: false });
            this.onBack();
          },
          onFail: error => {
            this.setState({ isLoading: false });
            Alert.alert('Warning', error, [{ text: 'OK' }], {
              cancelable: false,
            });
          },
          location: location,
        };
        this.props.onEditAlert(obj);
        const dotIconImage = await this.getIconImageSource('circle');
      } catch (error) {
        Alert.alert('Warning', 'Update alertn failed.', [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    }
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
            experienceType={'safe'}
          />
        );
        break;
      case 1:
        const isValidated = title && description && selectedCategory;
        content = (
          <StyledWrapper paddingBottom={wp('18%')}>
            <GradientButton
              onPress={() => {
                this.onEditAlert();
              }}
              buttonText={'Submit'}
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
    const { state } = this.props.navigation;
    if (state.params && state.params.parentID && state.params.routeName) {
      const { parentID, routeName } = state.params;

      setTimeout(() => {
        this.props.navigation.popToTop();
        this.props.navigation.navigate(routeName, {
          routeData: { parent_id: parentID },
        });
      }, 1);
    } else {
      this.props.navigation.popToTop();
      this.props.navigation.navigate(routeName);
    }
  };

  render() {
    const { isLoading, isModalVisible } = this.state;
    return (
      <>
        <StyledContainer backgroundColor={'#eaeaea'}>
          <ExperienceHeader title={'Edit Alert'} onPressBack={this.onBack} experienceType={'safe'} />
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
        {isLoading && (
          <View style={{ position: 'absolute', width: wp('100%'), height: hp('100%') }}>
            <Loading />
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  labelTextStyle: { fontFamily: font.MMedium },
  textInputStyle: {
    fontFamily: font.MRegular,
    color: '#5E5E5E',
    fontSize: 14,
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    explore: state.explore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEditAlert: obj => {
      dispatch(AlertActions.editAlert(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStation);
