import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
// Load theme
import theme from './theme';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { colors, images, font } = theme;

// Import utils
import CustomIcon from '../../utils/icon/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const StyledView = styled.View`
  flex: 1;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  justify-content: ${props => props.primary || 'flex-start'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
`;

const StyledHorizontalContainer = styled.View`
  flex-direction: row;
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'center'};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  margin-top: ${props => props.marginTop || 0};
`;

const StyledCenterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledBoxView = styled.View`
  width: ${props => props.width || wp('84.5%')};
  height: ${props => props.height || DEVICE_HEIGHT * 0.464};
  align-items: center;
  justify-content: center;
  background-color: ${colors.White};
  border-radius: 15;
  padding-left: ${props => props.paddingLeft || wp('9.5%')};
  padding-right: ${props => props.paddingRight || wp('9.5%')};
  padding-top: ${hp('9%')};
  padding-bottom: ${props => (props.paddingBottom === 0 ? 0 : hp('14.7%'))};
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.23);
  elevation: 10;
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const StyledButton = styled.TouchableOpacity`
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`;
const StyledTextArea = styled.TextInput`
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-left: ${wp('4.5%')};
  margin-right: ${hp('2%')};
  margin-bottom: ${hp('1%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
`;

const StyledCardView = styled.View`
  background-color: ${colors.White};
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.1);
  elevation: 1;
  margin-bottom: ${props => props.marginBottom || 8};
  margin-left: ${props => props.marginLeft || 8};
  margin-top: ${props => props.marginTop || 0};
  margin-right: ${props => props.marginRight || 8};
  border-radius: ${props => props.borderRadius || 15};
`;

const StyledText = styled.Text`
  color: ${props => props.color || colors.White};
  font-size: ${props => props.fontSize || hp('1.5%')};
  font-family: ${props => props.fontFamily || font.MRegular};
  font-weight: ${props => props.fontWeight || 'normal'};
  text-align: ${props => props.textAlign || 'left'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
  letter-spacing: ${props => props.letterSpacing || 0};
`;

const StyledImage = styled.Image`
  width: ${props => props.width};
  height: ${props => props.height};
  resize-mode: ${props => props.resizeMode || 'contain'};
  border-radius: ${props => props.borderRadius || 0};
`;

const StyledLogoInner = styled.View`
  position: absolute;
  width: ${wp('18%')};
  height: ${wp('18%')};
  border-radius: ${wp('9%')};
  top: ${-wp('9%')};
  background-color: ${colors.White};
`;

const StyledLogoImage = styled.Image`
  position: absolute;
  width: ${wp('21%')};
  height: ${wp('21%')};
  top: ${-wp('10.5%')};
  resize-mode: contain;
`;

const StyledBackgroundImage = styled.Image`
  position: absolute;
  width: ${DEVICE_WIDTH};
  height: ${DEVICE_HEIGHT};
  resize-mode: cover;
`;

const StyledActivityIndicator = styled.ActivityIndicator``;

const StyledCameraContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;

const StyledCameraBottomContainer = styled.View`
  width: ${wp('100%')};
  height: ${hp('12%')};
  background-color: #000000;
`;

const StyledCameraShutterButton = styled.TouchableOpacity`
  align-self: center;
  position: absolute;
  top: -${hp('4%')};
  width: ${hp('10.31%')};
  height: ${hp('10.31%')};
  border-radius: ${hp('5.155%')};
  background-color: transparent;
  border-color: #ffffff;
  border-width: ${wp('2%')};
  justify-content: center;
  align-items: center;
`;

const StyledCancelText = styled.Text`
  font-size: 18;
  font-family: ${font.MMedium};
  color: #ffffff;
`;

const CameraCancelButton = props => (
  <StyledButton {...props}>
    <StyledCancelText>{'Cancel'}</StyledCancelText>
  </StyledButton>
);

const StyledSeparator = styled.View`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || hp('0.16%')};
  background-color: ${props => props.bgColor};
  opacity: ${props => props.opacity || 1};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.borderRadius || 0};
`;

const StyledWrapper = styled.View`
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  justify-content: ${props => props.primary || 'flex-start'};
  align-items: ${props => props.secondary || 'flex-start'};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || 0};
`;

// Choosing Modal for Selecting and taking photo
const StyledPhotoModalContainer = styled.View`
  width: 90%;
  background-color: 'rgba(249,249,249,0.78)';
  border-radius: 14;
  justify-content: center;
  align-items: center;
`;

const StyledPhotoModalItem = styled.TouchableOpacity`
  width: 100%;
  height: 55;
  justify-content: center;
  align-items: center;
`;

const StyledPhotoModalText = styled.Text`
  font-size: 18;
  color: #007aff;
  text-align: center;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

const StyledCancelButton = styled.TouchableOpacity`
  border-radius: 14;
  margin-top: 7;
  margin-bottom: 48;
  width: 90%;
  height: 55;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const SelectPhotoModal = ({ isModalVisible, onCancelModal, onSelectImage, onTakePhoto }) => {
  return (
    <Modal isVisible={isModalVisible} style={styles.modal}>
      <StyledPhotoModalContainer>
        <StyledPhotoModalItem onPress={onTakePhoto}>
          <StyledPhotoModalText>{'Take Photo...'}</StyledPhotoModalText>
        </StyledPhotoModalItem>
        <StyledSeparator bgColor={'rgba(17,17,17,0.5)'} opacity={0.5} />
        <StyledPhotoModalItem onPress={onSelectImage}>
          <StyledPhotoModalText>{'Choose from Library...'}</StyledPhotoModalText>
        </StyledPhotoModalItem>
      </StyledPhotoModalContainer>

      <StyledCancelButton onPress={onCancelModal}>
        <StyledPhotoModalText fontWeight={'bold'}>{'Cancel'}</StyledPhotoModalText>
      </StyledCancelButton>
    </Modal>
  );
};

const StyledGradientOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.borderRadius || 0};
`;

const IconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={props.iconName} size={props.iconSize} color={props.iconColor || '#fff'} />
  </StyledButton>
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
  },
});
export const ChevronLeft = styled(Feather).attrs({
  name: 'chevron-left',
  size: 25,
  containerStyle: {},
})``;

export const CheckIcon = styled(Feather).attrs({
  name: 'check',
  size: 25,
  containerStyle: {},
})``;

export const PlayIcon = styled(FontAwesome).attrs({
  name: 'play',
  size: 22,
  color: '#ffffff',
  containerStyle: {},
})``;

export const PauseIcon = styled(FontAwesome).attrs({
  name: 'pause',
  size: 22,
  color: '#ffffff',
  containerStyle: {},
})``;

export const BackButtonHandler = ({ onPress, color = '#FFF' }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
      style={{ marginLeft: 20 }}
    >
      <ChevronLeft color={color} />
    </TouchableOpacity>
  );
};

export const RightButtonHandler = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
      style={{ marginRight: 20 }}
    >
      {children}
    </TouchableOpacity>
  );
};

const timelineStyles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listViewStyle: {
    paddingRight: 0,
    paddingTop: wp('10.55%'),
  },
  iconStyle: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  mapStyles: {
    flex: 1,
    height: 500,
  },
  labelTextStyle: { fontFamily: font.MMedium },
});

const modalStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
  },
});

const mapStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export {
  StyledView,
  StyledHorizontalContainer,
  StyledCenterContainer,
  StyledBoxView,
  StyledBackgroundImage,
  StyledImage,
  StyledLogoInner,
  StyledLogoImage,
  StyledButton,
  StyledText,
  StyledActivityIndicator,
  // Styles of screen for taking photo and video
  StyledCameraContainer,
  StyledCameraBottomContainer,
  StyledCameraShutterButton,
  StyledTextArea,
  StyledCardView,
  StyledSeparator,
  StyledButtonOverlay,
  StyledWrapper,
  CameraCancelButton,
  SelectPhotoModal,
  timelineStyles,
  modalStyles,
  mapStyles,
  StyledGradientOverlay,
  IconButton,
};
