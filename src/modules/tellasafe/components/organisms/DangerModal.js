import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Swiper from 'react-native-swiper';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createStructuredSelector } from 'reselect';
import { selectGeofence, selectSettings } from '../../reducers';
import { selectAccessToken, selectUid } from '../../../auth/reducers';
import { connect } from 'react-redux';
import SafeActions from '../../reducers';

// Load theme
import theme from '../../../core/theme';
const { font } = theme;

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { SAFE } from '../../../../utils/vals';
import { StyledWrapper } from '../../../core/common.styles';
const { DANGER_CATEGORIES } = SAFE;
import {
  StyledCategoryContainer,
  KnobButton,
  StyledCategoryWrapper,
  CategoryItem,
  RedButton,
  InputText,
} from '../molecules/Forms';

const StyledCategoryHeader = styled.Text`
  color: ${props => props.color || '#212121'};
  font-family: ${font.MSemiBold};
  font-size: ${wp('4.44%')};
  margin-top: ${wp('3.61%')};
  text-align: center;
`;

const StyledFlexBox = styled.View`
  flex: 1;
  align-items: center;
`;

const FirstSlide = props => {
  const { selectedCategory, onSelectCategory } = props;

  return (
    <StyledFlexBox>
      <StyledCategoryHeader>{'Kind of Danger'}</StyledCategoryHeader>

      <StyledCategoryWrapper>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={DANGER_CATEGORIES}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              onSelectCategory={onSelectCategory}
              isSelected={selectedCategory === item.label}
            />
          )}
          keyExtractor={item => item.label}
          numColumns={2}
          scrollEnabled={false}
        />
      </StyledCategoryWrapper>
    </StyledFlexBox>
  );
};

const StyledDetailsContainer = styled.View`
  width: ${wp('86.66%')};
  height: ${hp('37%')};
  padding-top: ${wp('5.83%')};
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
  padding-bottom: ${wp('2.01%')};
  background-color: #ffffff;
  border-width: 0.5;
  border-color: #9b9b9b;
  border-radius: 8;
  margin-top: ${wp('2.986%')};
`;

const SecondSlide = props => {
  const { dangerTitle, dangerDescription, onChangeDangerTitle, onChangeDangerDescription, inputRef } = props;
  return (
    <StyledFlexBox>
      <StyledWrapper row>
        <StyledCategoryHeader>{'Details'}</StyledCategoryHeader>
        <StyledCategoryHeader color={'#9a999b'}>{' / Optional'}</StyledCategoryHeader>
      </StyledWrapper>

      <StyledDetailsContainer>
        <InputText
          width={'100%'}
          label={'Title'}
          keyboardType={'default'}
          onChangeText={text => onChangeDangerTitle(text)}
          val={dangerTitle}
        />
        <InputText
          inputRef={inputRef}
          width={'100%'}
          label="Description"
          onChangeText={text => onChangeDangerDescription(text)}
          val={dangerDescription}
          keyboardType={'default'}
        />
      </StyledDetailsContainer>
    </StyledFlexBox>
  );
};

const StyledCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: ${wp('4.44%')};
  top: 8;
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0,0,0,0.3)';
`;

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
  </StyledCloseButton>
);

class AlertCategories extends Component {
  inputRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      dangerTitle: 'Tellasafe Alert',
      dangerDescription: 'I need help right now',
      selectedCategory: '',
    };
  }

  onChangeDangerTitle = text => {
    this.setState({
      dangerTitle: text,
    });
  };

  onChangeDangerDescription = text => {
    this.setState({
      dangerDescription: text,
    });
  };

  onSendAlert = () => {
    const { dangerTitle, dangerDescription, selectedCategory } = this.state;

    this.props.onHandleSendAlert(dangerTitle, dangerDescription, selectedCategory);
    this.props.toggleModal();
  };

  onSelectCategory = option => {
    this.setState({ selectedCategory: option.label });
  };

  componentDidMount() {
    const obj = {
      token: this.props.access_token,
      onSuccess: response => {
        if (response.data && response.data.message) {
          this.inputRef.current.setValue(response.data.message);
          this.setState({
            dangerDescription: response.data.message,
          });
        } else {
          this.inputRef.current.setValue('I need help right now.');
        }
      },
    };
    this.props.onGetSettings(obj);
  }

  render() {
    const { dangerTitle, dangerDescription, selectedCategory } = this.state;

    return (
      <StyledCategoryContainer height={hp('65%')}>
        <KnobButton onPress={this.props.toggleModal} />

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          paginationStyle={{ bottom: hp('1.23%') }}
          activeDotColor={'#f7626c'}
          loop={false}
        >
          <FirstSlide {...this.props} onSelectCategory={this.onSelectCategory} selectedCategory={selectedCategory} />
          <SecondSlide
            onChangeDangerTitle={this.onChangeDangerTitle}
            dangerTitle={dangerTitle}
            onChangeDangerDescription={this.onChangeDangerDescription}
            dangerDescription={dangerDescription}
            inputRef={this.inputRef}
          />
        </Swiper>

        <RedButton buttonText={'Send Alert'} onPress={this.onSendAlert} isEnabled={true} />
        <CloseButton onPress={this.props.toggleModal} />
      </StyledCategoryContainer>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  scrollConatiner: {
    flex: 1,
  },
});

const mapStateToProps = createStructuredSelector({
  geofence: selectGeofence,
  settings: selectSettings,
  access_token: selectAccessToken,
  uid: selectUid,
});

const mapDispatchToProps = dispatch => {
  return {
    onGetSettings: data => {
      dispatch(SafeActions.getSettings(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertCategories);
