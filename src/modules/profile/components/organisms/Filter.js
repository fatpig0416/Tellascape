import React, { useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
// Load theme
import theme from '../../../core/theme';
const { font, gradients } = theme;

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { PROFILE } from '../../../../utils/vals';
const { FILTER_DATA } = PROFILE;

// Load common styles
import { StyledButton, StyledButtonOverlay, StyledWrapper } from '../../../core/common.styles';

const StyledFilterTriggerWrapper = styled.View`
  width: ${wp('11.1%')};
  height: ${wp('11.1%')};
  border-radius: ${wp('5.55%')};
  justify-content: center;
  align-items: center;
  border-width: ${wp('0.55%')};
  border-color: #ffffff;
`;

const FilterTrigger = () => (
  <StyledFilterTriggerWrapper>
    <StyledButtonOverlay
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      borderRadius={wp('5.55%')}
      colors={gradients.BackgroundGreen}
    />
    <CustomIcon name="filter_list-24px" size={24} color="#ffffff" />
  </StyledFilterTriggerWrapper>
);

const StyledMenuItemText = styled.Text`
  margin-top: ${props => props.marginTop};
  margin-right: ${props => props.marginRight || 0};
  font-size: ${hp('2%')};
  letter-spacing: 0.35;
  font-family: ${font.MSemiBold};
  color: ${props => (props.selected ? '#000' : '#999ba1')};
`;

const MenuItem = ({ id, value, option, selected, onSelect, menuRef }) => {
  return (
    <StyledButton
      onPress={() => {
        onSelect(value);
        menuRef.current.close();
      }}
    >
      <StyledMenuItemText marginTop={id === 0 ? 0 : hp('2.65%')} selected={selected === value}>
        {option}
      </StyledMenuItemText>
    </StyledButton>
  );
};

const Filter = props => {
  const menuRef = useRef();

  return (
    <Menu ref={menuRef}>
      <MenuTrigger customStyles={{ triggerTouchable: { underlayColor: 'transparent' } }}>
        {!props.FilterTrigger ? <FilterTrigger /> : props.FilterTrigger}
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={styles.optionsContainerStyle}>
        <StyledWrapper row secondary={'center'}>
          <StyledMenuItemText marginTop={0} marginRight={wp('16.4%')}>
            {'FILTER'}
          </StyledMenuItemText>
          <FilterTrigger />
        </StyledWrapper>
        <FlatList
          data={FILTER_DATA}
          renderItem={({ item, index }) => (
            <MenuItem
              id={index}
              option={item.option}
              value={item.value}
              selected={props.selected}
              onSelect={props.onSelect}
              menuRef={menuRef}
            />
          )}
          keyExtractor={(item, index) => '' + index}
        />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionsContainerStyle: {
    width: 'auto',
    borderRadius: 8,
    paddingLeft: 13,
    paddingBottom: 13,
  },
});

export default Filter;
