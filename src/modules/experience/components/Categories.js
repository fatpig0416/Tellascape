import React, { Component } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Load theme
import theme from '../../core/theme';
const { colors, font } = theme;

// Load utils
import CustomIcon from '../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../utils/vals';
const { EVENT_CATEGORIES, STATION_CATEGORIES, MEMORY_CATEGORIES } = EXPERIENCE;

const StyledContainer = styled.View`
  width: 100%;
  background-color: 'rgba(255,255,255,0.94)';
  border-top-left-radius: ${wp('5.5%')};
  border-top-right-radius: ${wp('5.5%')};
  padding-left: ${wp('4.7%')};
  padding-right: ${wp('4.7%')};
  padding-top: ${hp('2.3%')};
  padding-bottom: ${isIphoneX() ? hp('6.7%') : hp('2%')};
`;

const StyledCloseButton = styled.TouchableOpacity`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  border-width: 2;
  border-color: #878787;
`;

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <CustomIcon name={'close-24px'} size={20} color={colors.Grey} />
  </StyledCloseButton>
);

const StyledCategoryHeader = styled.Text`
  color: #212121;
  font-family: Montserrat;
  font-size: 22;
  font-weight: 600;
  margin-top: ${wp('3.5%')};
`;

const StyledFlatListWrapper = styled.View`
  width: 100%;
  margin-top: ${hp('3%')};
  align-items: center;
  justify-content: center;
`;

const StyledCardView = styled.TouchableOpacity`
  width: ${props => props.width || wp('43.08%')};
  border-radius: ${wp('2.22%')};
  align-items: center;
  background-color: #ffffff;
  padding-top: ${props => props.paddingTop || hp('2.1%')};
  padding-bottom: ${props => props.paddingBottom || hp('2.1%')};
  margin-left: ${props => props.marginLeft || wp('1.11%')};
  margin-right: ${props => props.marginRight || wp('1.11%')};
  margin-top: ${props => props.marginTop || wp('1.11%')};
  margin-bottom: ${props => props.marginBottom || wp('1.11%')};
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.1);
  elevation: 1;
`;

const StyledCategoryLabel = styled.Text`
  font-weight: 400;
  font-family: ${font.MLight};
  font-size: ${wp('3.6%')};
  padding-top: ${props => props.paddingTop || hp('1.5%')};
  color: #2c2c2c;
`;

const StyledCategoryIcon = styled.Image`
  width: ${wp('11.6%')};
  height: ${wp('11.6%')};
  resize-mode: contain;
`;

const CategoryItem = ({ item, onSelectCategory }) => {
  return (
    <StyledCardView onPress={() => onSelectCategory(item)}>
      <StyledCategoryIcon source={item.icon} />
      <StyledCategoryLabel>{item.label}</StyledCategoryLabel>
    </StyledCardView>
  );
};

const CategoryFooter = ({ onSelectCategory }) => {
  const item = {
    label: 'Other',
  };
  return (
    <StyledCardView
      width={wp('88.38%')}
      paddingTop={hp('1.7%')}
      paddingBottom={hp('1.7%')}
      onPress={() => onSelectCategory(item)}
    >
      <StyledCategoryLabel paddingTop={0.1}>{'Other'}</StyledCategoryLabel>
    </StyledCardView>
  );
};

class Categories extends Component {
  onSelect = item => {
    this.props.onSelectCategory(item);
    this.props.toggleModal();
  };
  render() {
    const { categoryType } = this.props;
    const categoryData =
      categoryType === 'event' ? EVENT_CATEGORIES : categoryType === 'station' ? STATION_CATEGORIES : MEMORY_CATEGORIES;

    return (
      <StyledContainer>
        <CloseButton onPress={this.props.toggleModal} />

        <StyledCategoryHeader>{'Choose a Category'}</StyledCategoryHeader>

        <StyledFlatListWrapper>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={categoryData}
            renderItem={({ item }) => <CategoryItem item={item} onSelectCategory={this.onSelect} />}
            keyExtractor={item => item.label}
            numColumns={2}
            ListFooterComponent={() => <CategoryFooter onSelectCategory={this.onSelect} />}
          />
        </StyledFlatListWrapper>
      </StyledContainer>
    );
  }
}

export default Categories;
