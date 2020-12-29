import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { Loading } from '../../../../utils';

// Load theme
import theme from '../../../core/theme';
const { font, sizes, colors, gradients, orange, blue, cyan, tellasafe } = theme;

// Import common components
import { StyledButtonOverlay } from '../../../core/common.styles';

const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: ${16};
  top: ${16};
`;

const ModalCloseButton = props => (
  <StyledModalCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={16} color={props.color} />
  </StyledModalCloseButton>
);

const StyledBody = styled.View`
  width: ${wp('75%')};
  background-color: ${colors.White};
  padding-top: 20;
  padding-right: 20;
  padding-bottom: 20;
  padding-left: 20;
  border-radius: 10;
  align-items: center;
`;

const StyledHeader = styled.Text`
  text-align: center;
  font-size: 20;
  font-weight: 600;
  color: rgb(167, 167, 167);
  font-family: ${font.MRegular};
`;

const StyledInput = styled.TextInput`
  width: 100%;
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-bottom: ${hp('1%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-right: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
  padding-bottom: ${hp('1.4%')};
  font-family: ${font.MRegular};
`;

const StyledGradientButton = styled.TouchableOpacity`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: ${props => props.marginLeft || 0};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft, background }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
        borderRadius={height / 2}
      />
      {children}
    </StyledGradientButton>
  );
};

const StyledButtonText = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: ${colors.White};
  font-family: ${font.MMedium};
  font-weight: 500;
`;

const DescriptionInputModal = props => {
  const {
    isModalVisible,
    onToggleModal,
    loading,
    title,
    placeholder,
    onSubmit,
    mediaTitle,
    onChangeText,
    experienceType,
  } = props;
  const [description, setDescription] = useState('');
  const specificTheme =
    experienceType !== undefined
      ? experienceType === 'station'
        ? blue
        : experienceType === 'memory'
        ? cyan
        : experienceType === 'safe'
        ? tellasafe
        : orange
      : orange;

  const onChangeDescription = useCallback(text => {
    setDescription(text);
  }, []);

  const onSubmitDescription = useCallback(() => {
    onSubmit(description, onChangeDescription);
  }, [description, onChangeDescription, onSubmit]);

  return (
    <Modal
      isVisible={isModalVisible}
      avoidKeyboard={true}
      onBackdropPress={onToggleModal}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.keyboardAwareContentContainer}
      >
        <StyledBody>
          <ModalCloseButton color={specificTheme.icon} onPress={onToggleModal} />
          <StyledHeader>{title || ''}</StyledHeader>
          <StyledInput
            value={mediaTitle || description}
            editable
            multiline
            numberOfLines={4}
            placeholder={placeholder || ''}
            placeholderTextColor={'rgb(167, 167, 167)'}
            onChangeText={val => {
              onChangeDescription(val);
              if (onChangeText) {
                onChangeText(val);
              }
            }}
          />
          <GradientButton
            width={'75%'}
            height={hp('4.2%')}
            onPress={onSubmitDescription}
            isActive={description}
            background={specificTheme.graident}
          >
            {!loading ? <StyledButtonText>{'Submit'}</StyledButtonText> : <Loading />}
          </GradientButton>
        </StyledBody>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAwareContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DescriptionInputModal;
