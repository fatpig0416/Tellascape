import React, { Component } from 'react';
import { FlatList } from 'react-native';

// Load utils
import { SAFE } from '../../../../utils/vals';
const { DANGER_CATEGORIES } = SAFE;

import { StyledCategoryContainer, KnobButton, StyledCategoryWrapper, CategoryItem } from '../molecules/Forms';

class AlertCategories extends Component {
  constructor(props) {
    super(props);
  }

  onSelect = item => {
    this.props.onSelectCategory(item);
    this.props.toggleModal();
  };

  render() {
    return (
      <StyledCategoryContainer>
        <KnobButton onPress={this.props.toggleModal} />

        <StyledCategoryWrapper>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={DANGER_CATEGORIES}
            renderItem={({ item }) => <CategoryItem item={item} onSelectCategory={this.onSelect} />}
            keyExtractor={item => item.label}
            numColumns={2}
            scrollEnabled={false}
          />
        </StyledCategoryWrapper>
      </StyledCategoryContainer>
    );
  }
}

export default AlertCategories;
