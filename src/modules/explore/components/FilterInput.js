import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, StyleSheet, FlatList, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomIcon from '../../../utils/icon/CustomIcon';
import styled from 'styled-components/native';

// Load theme
import theme from '../../core/theme';
const { font, gradients } = theme;

// Load common components from common styles
import { StyledButtonOverlay } from '../../core/common.styles';

const StyledContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 36;
  border-radius: 18;
  background-color: #ffffff;

  /** Margin from props */
  margin-top: 64;
  margin-left: 12;
  margin-right: 12;
`;

const StyledFilterIconWrapper = styled.View`
  width: 32;
  height: 32;
  border-radius: 16;
  /* background-color: #45d8bf; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2;
`;

const FilterIconButton = props => (
  <TouchableWithoutFeedback {...props}>
    <StyledFilterIconWrapper>
      <StyledButtonOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        borderRadius={16}
        colors={gradients.BackgroundGreen}
      />
      <CustomIcon name="filter_list-24px" size={20} color="#ffffff" />
    </StyledFilterIconWrapper>
  </TouchableWithoutFeedback>
);

const StyledFilterInput = styled.TextInput`
  flex: 1;
  height: 100%;
  font-family: ${font.MMedium};
  font-size: 16;
  line-height: 20;
  padding: 0;
  padding-left: 8;
`;

const StyledSearchIconWrapper = styled.View`
  width: 32;
  height: 32;
  border-radius: 16;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2;
`;

const StyledCloseIconWrapper = styled.TouchableOpacity`
  width: 32;
  height: 32;
  border-radius: 16;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2;
`;

const SearchIcon = () => (
  <StyledSearchIconWrapper>
    <CustomIcon name="search-24px1" size={20} color="#c2c2c2" />
  </StyledSearchIconWrapper>
);

const CloseIcon = props => (
  <StyledCloseIconWrapper {...props}>
    <CustomIcon name="close-24px" size={20} color="#c2c2c2" />
  </StyledCloseIconWrapper>
);

class FilterInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }
  render() {
    const {
      filterData = [],
      isFilter = false,
      onPressClose,
      onPressSearchItem,
      onPress,
      onChangeText,
      value,
    } = this.props;
    const { isFocus } = this.state;
    return (
      <View>
        <StyledContainer>
          <FilterIconButton onPress={onPress} />
          <StyledFilterInput
            placeholder="Find experiences..."
            onChangeText={onChangeText}
            value={value}
            onFocus={() => this.setState({ isFocus: true })}
            onBlur={() => this.setState({ isFocus: false })}
          />
          {value.length > 0 || isFocus ? <CloseIcon onPress={onPressClose} /> : <SearchIcon />}
        </StyledContainer>
        {isFilter && filterData.length > 0 && (
          <View style={styles.containerStyle}>
            <View style={styles.arrowStyle} />
            <View style={styles.itemContainer}>
              <FlatList
                data={filterData}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps={'handled'}
                renderItem={({ item, index }) => (
                  <TouchableWithoutFeedback onPress={() => onPressSearchItem(item.index)}>
                    <View
                      style={[
                        styles.textContainer,
                        { borderBottomWidth: filterData.length - 1 === index ? 0 : wp('0.1%') },
                      ]}
                    >
                      <Text style={styles.searchTextStyle}>{item.title}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  arrowStyle: {
    backgroundColor: 'transparent',
    borderLeftWidth: wp('2.8%'),
    borderRightWidth: wp('2.8%'),
    borderBottomWidth: hp('1.5%'),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    marginRight: wp('12%'),
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  containerStyle: {
    marginHorizontal: 12,
    marginTop: hp('0.5%'),
  },
  itemContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: hp('30%'),
    borderRadius: wp('1.2%'),
    paddingVertical: wp('1%'),
  },
  searchTextStyle: {
    fontFamily: font.MMedium,
    letterSpacing: 0.3,
    fontSize: wp('3.4%'),
  },
  textContainer: {
    paddingVertical: wp('2.6%'),
    borderBottomColor: '#DBDBDC',
    paddingHorizontal: wp('3%'),
  },
});

export default FilterInput;
