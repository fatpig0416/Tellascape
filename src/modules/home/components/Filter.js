import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomIcon from '../../../utils/icon/CustomIcon';
import theme from '../../core/theme';
import { StyledText } from '../../core/common.styles';

const { font, colors } = theme;

const DATA = [
  {
    option: 'All',
    value: null,
  },
  {
    option: 'Events',
    value: 'event',
  },
  {
    option: 'Memories',
    value: 'memory',
  },
  {
    option: 'Stations',
    value: 'station',
  },
];

const MenuItem = ({ value, option, selected, onSelect }) => {
  return (
    <Text
      style={{
        ...styles.selectedOption,
        color: selected === value ? '#000' : 'rgba(0,0,0,0.33)',
      }}
      onPress={() => onSelect(value)}
    >
      {option}
      {
        <CustomIcon
          onPress={() => onSelect(value)}
          name={selected === value ? 'check_circle-24px' : 'check_circle_outline-24px'}
          size={hp('1.4%')}
          color={selected === value ? '#41cabf' : 'rgba(0,0,0,0.33)'}
        />
      }
    </Text>
  );
};

const Filter = props => {
  return (
    <Menu>
      <MenuTrigger>
        <Text style={styles.triggerText}>
          FILTER{' '}
          {
            <CustomIcon
              // onPress={props.show}
              name={'filter_list-24px'}
              size={12}
              color={'#999BA1'}
            />
          }
        </Text>
      </MenuTrigger>
      <MenuOptions style={styles.menuOptions}>
        <Text style={styles.menuDialogHeader}>
          FILTER{' '}
          {<CustomIcon onPress={props.show} name={'filter_list-24px'} size={hp('1.6%')} color={'rgba(0,0,0,0.33)'} />}
        </Text>
        <FlatList
          data={DATA}
          renderItem={({ item, index }) => (
            <MenuItem
              id={index}
              option={item.option}
              value={item.value}
              selected={props.selected}
              onSelect={props.onSelect}
            />
          )}
          keyExtractor={(item, index) => '' + index}
          // extraData={props.selected}
        />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  triggerText: {
    fontSize: wp('3.05%'),
    fontFamily: font.MBold,
    letterSpacing: 0.3,
    color: '#999BA1',
  },
  menuDialogHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 2,
    fontFamily: font.MRegular,
  },
  menuOptions: {
    justifyContent: 'flex-end',
    padding: 10,
  },
  optionsText: {
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 2,
    color: '#999BA1',
    fontFamily: font.MRegular,
  },
  selectedOption: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 2,
    fontFamily: font.MRegular,
    alignSelf: 'flex-end',
    padding: 8,
  },
  menuOptionsContentWrapper: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  optionsTextWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 15,
  },
});

export default Filter;
