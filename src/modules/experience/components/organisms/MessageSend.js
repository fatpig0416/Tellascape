import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';

// Import common components
import { StyledWrapper } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

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
    <CustomIcon name={'PE-Send_20x20px'} size={16} color={!props.isEdit ? '#fefefe' : '#ffa06d'} />
  </StyledSendButton>
);

const StyledPictureButton = styled.TouchableOpacity`
  margin-right: 8;
`;

const PictureButton = props => (
  <StyledPictureButton {...props}>
    <CustomIcon name={'add_photo_alternate-24px'} size={36} color={'#878787'} />
  </StyledPictureButton>
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
    const {
      text,
      containerStyle,
      onSend,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
      sendButtonProps,
    } = this.props;
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        // <TouchableOpacity
        //   testID="send"
        //   accessible
        //   accessibilityLabel="send"
        //   style={[styles.container, containerStyle]}
        //   onPress={() => {
        //     if (text && onSend) {
        //       onSend({ text: text.trim() }, true);
        //     }
        //   }}
        //   accessibilityTraits="button"
        //   disabled={disabled}
        //   {...sendButtonProps}
        // >
        //   <View>{children || <Text style={[styles.text, textStyle]}>{label}</Text>}</View>
        // </TouchableOpacity>
        <StyledWrapper row secondary={'center'}>
          {/* <PictureButton /> */}
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
