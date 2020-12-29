import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

// Import common components
import { StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const StyledSendButton = styled.TouchableOpacity`
  width: ${44};
  height: ${44};
  border-radius: ${22};
  background-color: #d5d5d5;
  justify-content: center;
  align-items: center;
`;

const SendButton = props => (
  <StyledSendButton {...props} disabled={!props.isEdit}>
    <CustomIcon name={'PE-Send_20x20px'} size={16} color={!props.isEdit ? '#fefefe' : '#3ccfD1'} />
  </StyledSendButton>
);

export default class Send extends Component {
  static defaultProps = {
    text: '',
    onSend: () => {},
    label: 'Send',
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: true,
    disabled: false,
    sendButtonProps: null,
  };

  render() {
    const { text, onSend, alwaysShowSend } = this.props;
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        <StyledWrapper row secondary={'center'}>
          <SendButton
            isEdit={text && text.length > 0 ? true : false}
            onPress={() => {
              if (text && onSend) {
                onSend({ text: text.trim() }, true);
              }
            }}
          />
        </StyledWrapper>
      );
    }
    return <View />;
  }
}
