import React, { useState, useCallback, useEffect } from 'react';
import { Platform, UIManager, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Load theme
import theme from '../../../core/theme';
const { font, sizes } = theme;
// Lod common components
import { StyledButton, StyledSeparator } from '../../../core/common.styles';
// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const StyledFilterContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
`;

const StyledFocusedButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${wp('2.22%')};
  margin-top: ${wp('2.22%')};
`;

const SytledFocusedText = styled.Text`
  font-size: ${wp('3.055%')};
  font-family: ${font.MBold};
  color: ${props => props.color || '#515151'};
`;

const SytledOptionText = styled.Text`
  font-size: ${wp('3.055%')};
  font-family: ${font.MBold};
  color: ${props => props.color || '#515151'};
  text-align: center;
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('2.22%')};
`;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ExperienceFilter = props => {
  const { optionsData, savedFilterId, onChangeFilterOption, textColor, iconColor, isSeparatorExisted } = props;
  const [expanded, setExpanded] = useState(false);
  const [slecedFilterId, setSlecedFilterIndex] = useState(0);
  const [filterOptions, setFilterOptions] = useState(optionsData);

  useEffect(() => {
    setSlecedFilterIndex(savedFilterId);
    let newArray = [];
    optionsData.map((item,index)=>{
      if(index !== savedFilterId){
        newArray.push(item);
      }
    })
    setFilterOptions(newArray);
  }, [savedFilterId]);

  const onToggleExpanded = useCallback(() => {
    // toggle expanded
    setExpanded(prevState => !prevState);
  }, [optionsData, slecedFilterId]);

  const onSelectOption = useCallback(
    id => {
      // updatet the filter option of parent component
      let newID = 0;
      optionsData.map((item, index) => {
        if (item.id === id) {
          newID = index;
        }
      });
      setSlecedFilterIndex(newID);
      onChangeFilterOption(optionsData[newID].value);
      // toggle expanded
      onToggleExpanded();
    },
    [onChangeFilterOption, onToggleExpanded, optionsData]
  );
  return (
    <StyledFilterContainer>
      <StyledFocusedButton onPress={onToggleExpanded}>
        <SytledFocusedText color={textColor}>
          {slecedFilterId !== -1 && optionsData.length >= slecedFilterId + 1
            ? optionsData[slecedFilterId].label
            : optionsData[0].label}
        </SytledFocusedText>
        <CustomIcon
          name={!expanded ? 'expand_more-24px' : 'expand_less-24px'}
          size={20}
          color={iconColor || '#707070'}
        />
      </StyledFocusedButton>

      {expanded && (
        <FlatList
          data={filterOptions}
          renderItem={({ item, index }) => (
            <StyledButton onPress={() => onSelectOption(item.id)}>
              <SytledOptionText color={textColor}>{item.label}</SytledOptionText>
            </StyledButton>
          )}
          keyExtractor={(item, index) => '' + index}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() =>
            isSeparatorExisted ? <StyledSeparator width={wp('100%')} bgColor={'#000'} opacity={0.3} height={1} /> : null
          }
          ListHeaderComponent={() =>
            isSeparatorExisted ? <StyledSeparator width={wp('100%')} bgColor={'#000'} opacity={0.3} height={1} /> : null
          }
          scrollEnabled={false}
        />
      )}
    </StyledFilterContainer>
  );
};

export default ExperienceFilter;
