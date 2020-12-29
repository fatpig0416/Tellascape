import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Fontisto';
import { isIphoneX } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import theme from '../../core/theme';
import { StyledButton } from '../../core/common.styles';

const { colors, font } = theme;

const StyledContainerView = styled.View`
  flex: 1;
  padding-top: ${isIphoneX() ? 50 : 0};
  background-color: ${theme.gradients.BackgroundLightGreen[1]};
`;

const StyledHeader = styled.View`
  width: 100%;
  height: 50;
  justify-content: center;
`;

const StyledHeaderTextWrapper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const StyledHeaderText = styled.Text`
  font-family: ${font.MMedium};
  font-size: 20;
  color: ${colors.White};
  text-align: center;
`;

const BackButton = ({ onPress }) => (
  <StyledButton marginLeft={10} onPress={onPress}>
    <Icon name={'angle-left'} size={25} color={colors.White} />
  </StyledButton>
);

export default class WebviewScreen extends Component {
  constructor(props) {
    super(props);

    this.uri = this.props.navigation.getParam('uri');
    this.title = this.props.navigation.getParam('title');
    this.navKey = this.props.navigation.getParam('key');
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick = () => {
    if (this.navKey && this.navKey === 'home') {
      this.props.navigation.popToTop();
      this.props.navigation.navigate('HomeBottom');
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };

  render() {
    return (
      <StyledContainerView>
        <StyledHeader>
          <StyledHeaderTextWrapper>
            <StyledHeaderText>{this.title}</StyledHeaderText>
          </StyledHeaderTextWrapper>

          <BackButton
            onPress={() => {
              if (this.navKey && this.navKey === 'home') {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('HomeBottom');
              } else {
                this.props.navigation.goBack();
              }
            }}
          />
        </StyledHeader>
        <WebView source={{ uri: this.uri }} />
      </StyledContainerView>
    );
  }
}
