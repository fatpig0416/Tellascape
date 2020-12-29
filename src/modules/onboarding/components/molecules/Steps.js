import React from 'react';
import { FlatList } from 'react-native';
import { StyledDot } from '../atoms';

const Steps = props => {
  const { activeIndex } = props;

  return (
    <FlatList
      data={[0, 1, 2, 3]}
      renderItem={({ item, index }) => <StyledDot isActive={activeIndex === index} />}
      keyExtractor={(item, index) => ' ' + index}
      horizontal={true}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Steps;
