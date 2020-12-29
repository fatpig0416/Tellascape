import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';

// Load theme
import theme from '../../../core/theme';
const { font } = theme;

const StyledMessageContainer = styled.View`
  width: ${wp('100%')};
  height: ${hp('100%')};
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
  padding-top: ${isIphoneX() ? hp('5.7%') : hp('4%')};
  padding-bottom: ${isIphoneX() ? hp('5.7%') : hp('4%')};
  background-color: 'rgba(10,18,19,0.85)';
`;

const StyledMessageContentView = styled.View`
  flex: 1;
  border-radius: 15;
  overflow: hidden;
  background-color: #fff;
`;

const StyledMessageHeader = styled.ImageBackground`
  width: 100%;
  height: ${hp('25.4%')};
`;

const StyledMessageHeaderText = styled.Text`
  position: absolute;
  left: ${wp('4.44%')};
  bottom: ${wp('4.44%')};
  font-size: ${wp('7.77%')};
  line-height: ${wp('8.33%')};
  color: #ffffff;
  font-family: ${font.MBlack};
  text-transform: uppercase;
`;

const StyledCloseButton = styled.TouchableOpacity`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0,0,0,0.3)';
`;

const StyledMessageTitle = styled.Text`
  font-size: ${wp('3.88%')};
  color: #121212;
  font-family: ${font.MBold};
  line-height: ${wp('8.33%')};
`;

const StyledMessageContent = styled.Text`
  font-size: ${wp('3.88%')};
  color: #272727;
  font-family: ${font.MRegular};
  line-height: ${wp('6.66%')};
  margin-bottom: ${wp('1.447%')};
`;

const StyledMessageGradientButton = styled.TouchableOpacity`
  width: ${wp('71.66%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  box-shadow: 4px 8px 13px rgba(40, 76, 98, 0.19);
`;

const StyledMessageGradientButtonText = styled.Text`
  font-size: ${wp('3.88%')};
  color: #fcfdfd;
  font-family: ${font.MBold};
`;

const StyledContainer = styled.ImageBackground`
  width: ${wp('100%')};
  height: ${hp('100%')};
  padding-left: ${wp('8.88%')};
  padding-right: ${wp('8.88%')};
  padding-top: ${isIphoneX() ? hp('6.84%') : hp('4%')};
  padding-bottom: ${isIphoneX() ? hp('6.7%') : hp('4%')};
  background-color: 'rgba(10,18,19,0.85)';
`;

const StyledDot = styled.View`
  width: ${wp('2.22%')};
  height: ${wp('2.22%')};
  border-radius: ${wp('1.11%')};
  background-color: ${props => (props.isActive ? '#3BB4BE' : '#fff')};
  opacity: ${props => (props.isActive ? 1 : 0.7)};
  margin-right: ${wp('2.77%')};
`;

const StyledNormalText = styled.Text`
  font-size: ${wp('4.44%')};
  color: ${props => props.color || '#ffffff'};
  opacity: 0.8;
  font-family: ${font.MMedium};
`;

const StyledTitle = styled.Text`
  font-size: ${wp('10%')};
  color: #ffffff;
  font-family: ${font.MBold};
  line-height: ${wp('11.38%')};
`;

const StyledNextButtton = styled.TouchableOpacity`
  width: ${wp('38.88%')};
  height: ${wp('11.11%')};
  border-radius: ${wp('5.555%')};
  justify-content: center;
  align-items: center;
  border-width: 2;
  border-color: #3dbbbe;
`;

const StyledNextButtonText = styled.Text`
  font-size: ${wp('4.44%')};
  color: #3dbbbe;
  font-family: ${font.MExtraBold};
`;

const StyledPlusWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: ${props => props.alignItems || 'center'};
`;

const StyledPlusOuter = styled.View`
  width: ${wp('25%')};
  height: ${wp('25%')};
  border-radius: ${wp('12.5%')};
  background-color: 'rgba(255,255,255,0.23)';
  justify-content: center;
  align-items: center;
`;

const StyledIconWrapper = styled.View`
  width: ${wp('16.66%')};
  height: ${wp('16.66%')};
  border-radius: ${wp('8.33%')};
  justify-content: center;
  align-items: center;
`;

export {
  // Modal
  StyledCloseButton,
  StyledMessageContainer,
  StyledMessageContentView,
  StyledMessageHeader,
  StyledMessageTitle,
  StyledMessageContent,
  StyledMessageGradientButton,
  StyledMessageGradientButtonText,
  // Onboarding Screens
  StyledContainer,
  StyledDot,
  StyledNormalText,
  StyledTitle,
  StyledNextButtton,
  StyledNextButtonText,
  StyledPlusWrapper,
  StyledPlusOuter,
  StyledIconWrapper,
  StyledMessageHeaderText,
};
