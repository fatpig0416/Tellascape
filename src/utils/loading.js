import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components';

const StyledContainerView = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export default class Loading extends React.Component {
  render() {
    const { size = 'large' } = this.props;
    return (
      <StyledContainerView>
        <ActivityIndicator size={size} />
        <Text style={{ paddingTop: 10, fontWeight: 'bold' }}>Loading</Text>
      </StyledContainerView>
    );
  }
}
