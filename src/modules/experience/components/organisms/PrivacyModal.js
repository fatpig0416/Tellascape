import React from 'react';
import { Switch } from 'react-native-switch';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
// Import common styles
import { StyledWrapper, StyledSeparator, modalStyles } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { font, colors } = theme;

const StyledModalContainer = styled.View`
  flex: 1;
  padding-bottom: ${hp('7.5%')};
  justify-content: flex-end;
  align-items: center;
`;

const StyledModalBottom = styled.TouchableOpacity`
  width: ${wp('95.56%')};
  height: ${hp('8.75%')};
  background-color: #ffffff;
  border-radius: 14;
  justify-content: center;
  align-items: center;
`;

const StyledModalCancelText = styled.Text`
  font-size: ${hp('2.27%')};
  color: #007aff;
  font-family: ${font.MMedium};
`;

const StyledModalBody = styled.View`
  width: ${wp('95.56%')};
  height: ${hp('58%')};
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${hp('1.25%')};
  border-radius: 14;
  background-color: #ffffff;
`;

const StyledSectionWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: ${wp('8.89%')};
  padding-right: ${wp('8.89%')};
`;

const StyledPresenceText = styled.Text`
  font-size: ${hp('2.23%')};
  font-family: ${font.MMedium};
  line-height: ${hp('2.97%')};
  margin-top: ${hp('1.09%')};
  margin-top: ${hp('1.88%')};
  color: #000;
`;

const StyledPresenceDescription = styled.Text`
  text-align: center;
  /* font-size: ${hp('2.18%')}; */
  font-size: 17;
  font-family: ${font.MRegular};
  line-height: ${hp('2.81%')};
  margin-top: ${hp('1.72%')};
  color: #6c6c6c;
`;

const StyledSwitchText = styled.Text`
  /* font-size: ${hp('2.65%')}; */
  font-size: 18;
  font-family: ${font.MMedium};
  font-weight: 500;
  margin-right: ${props => (props.isLeft ? 7 : 0)};
  margin-left: ${props => (props.isLeft ? 0 : 7)};
  color: ${props => (props.isActive ? 'rgb(255, 163, 109)' : colors.WarmGrey)};
`;

const InfoSection = props => {
  const { isLocationInfo, value, onValueChange, title, description, switchLeftText, switchRightText } = props;

  return (
    <StyledSectionWrapper>
      <CustomIcon name={isLocationInfo ? 'my_location-24px' : 'emoji_happy'} size={hp('4.06%')} color={'#b1b1b1'} />
      <StyledPresenceText>{title}</StyledPresenceText>
      <StyledWrapper marginTop={10} row primary={'center'} secondary={'center'}>
        <StyledSwitchText isActive={!value} isLeft={true}>
          {switchLeftText}
        </StyledSwitchText>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={false}
          circleSize={hp('3.5%')}
          barHeight={hp('3.7%')}
          circleBorderWidth={0}
          backgroundActive={'rgb(254, 114, 133)'}
          backgroundInactive={'rgb(234, 234, 234)'}
          switchLeftPx={2.5}
          switchRightPx={2.5}
        />
        <StyledSwitchText isActive={value} isLeft={false}>
          {switchRightText}
        </StyledSwitchText>
      </StyledWrapper>
      <StyledPresenceDescription>{description}</StyledPresenceDescription>
    </StyledSectionWrapper>
  );
};

const PrivacyModal = props => {
  const {
    isModalVisible,
    onTogglePrivacyMoal,
    isGhostMode,
    onToggleGhostMode,
    isLocationOff,
    onToggleLocationOff,
  } = props;

  return (
    <Modal isVisible={isModalVisible} style={modalStyles.container}>
      <StyledModalContainer>
        <StyledModalBody>
          <InfoSection
            value={isGhostMode}
            onValueChange={onToggleGhostMode}
            title={'Your Presence'}
            description={'Your username is shown to all the users of the event'}
            switchLeftText={'Live Mode'}
            switchRightText={'Ghost Mode'}
          />

          <StyledSeparator bgColor={'rgba(17, 17, 17, 0.5)'} width={'100%'} height={0.5} />

          <InfoSection
            isLocationInfo
            value={isLocationOff}
            onValueChange={onToggleLocationOff}
            title={'Show Your Location'}
            description={'Event guests can see your location inside the event only'}
            switchLeftText={'On'}
            switchRightText={'Off'}
          />
        </StyledModalBody>

        <StyledModalBottom onPress={onTogglePrivacyMoal}>
          <StyledModalCancelText>{'Cancel'}</StyledModalCancelText>
        </StyledModalBottom>
      </StyledModalContainer>
    </Modal>
  );
};

export default PrivacyModal;
