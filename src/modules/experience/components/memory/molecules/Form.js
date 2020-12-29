import React from 'react';
import { StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Switch } from 'react-native-switch';
import FastImage from 'react-native-fast-image';
import { TextField } from 'react-native-material-textfield';
// Import common styles
import { StyledGradientOverlay, IconButton, StyledButton } from '../../../../../styles/Common.styles';

// Load theme
import theme from '../../../../core/theme';
import CustomIcon from '../../../../../utils/icon/CustomIcon';
const { colors, font, gradients, sizes, icons } = theme;

const CARD_WIDTH = wp('81.66%');

const StyledHeader = styled.View`
  width: ${wp('100%')};
  height: ${wp('25.83%')};
  justify-content: flex-end;
  padding-bottom: ${wp('3.61%')};
`;

const StyledBigText = styled.Text`
  font-size: ${wp('5.55%')};
  line-height: ${wp('6.66%')};
  color: #454545;
  font-family: ${font.MSemiBold};
  margin-top: -5;
`;

const StyledMediumText = styled.Text`
  font-size: ${wp('5%')};
  color: #fff;
  font-family: ${font.MSemiBold};
  align-self: center;
`;

const StyledPostTitle = styled.Text`
  font-size: ${wp('5%')};
  color: #000;
  font-family: ${font.MMedium};
`;

const StyledPostDescription = styled.Text`
  font-size: ${wp('3.88%')};
  color: #6c6c6c;
  font-family: ${font.MRegular};
  font-weight: 400;
  margin-top: 2;
`;

const StyledBackWrapper = styled.View`
  position: absolute;
  bottom: ${wp('2.64%')};
`;

const Header = props => {
  const { onPressBack, title } = props;
  return (
    <StyledHeader>
      <StyledGradientOverlay
        start={{ x: 0.5, y: 0 }}
        end={{ x: 1, y: 0.77 }}
        locations={[0, 0.5, 1]}
        colors={['#5ebfef', '#75b9fa', '#87a7ff']}
      />
      <StyledBackWrapper>
        <IconButton onPress={onPressBack} iconName={icons.ARROW_LEFT} iconSize={sizes.xlargeIconSize} />
      </StyledBackWrapper>
      <StyledMediumText>{title}</StyledMediumText>
    </StyledHeader>
  );
};

const StyledCard = styled.View`
  width: ${CARD_WIDTH};
  margin-top: ${wp('3.88%')};
  margin-bottom: ${props => (props.marginBottom === 0 ? 0 : props.marginBottom ? props.marginBottom : wp('11.94%'))};
  border-radius: 15;
  padding-left: ${wp('6.38%')};
  padding-right: ${wp('6.38%')};
  padding-top: ${props => (props.paddingTop === 0 ? 0 : wp('6.66%'))};
  padding-bottom: ${props => (props.paddingBottom === 0 ? 0 : wp('6.66%'))};
  background-color: ${colors.White};
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.125);
`;

const StyledDetailEditButton = styled.TouchableOpacity`
  width: 100%;
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
  justify-content: center;
  border-width: 1;
  border-color: ${props => props.borderColor};
  margin-top: ${wp('5%')};
`;

const StyledDetailEditText = styled.Text`
  font-size: ${wp('3.61%')};
  font-family: ${font.MMedium};
  color: #2c2c2c;
  align-self: center;
`;

const StyledPencilWrapper = styled.View`
  position: absolute;
  right: 3;
  width: ${wp('6.38%')};
  height: ${wp('6.38%')};
  border-radius: ${wp('3.19%')};
  align-self: flex-end;
  justify-content: center;
  align-items: center;
`;

const DetailEditButton = props => {
  const { category, experienceType } = props;
  let borderColor = experienceType === 'memory' ? '#44D6BF' : experienceType === 'safe' ? '#ff6c6f' : '#669afd';
  return (
    <StyledDetailEditButton {...props} borderColor={borderColor}>
      <StyledDetailEditText>
        {!category && <Text style={{ color: borderColor }}>{`✷ `}</Text>}
        {category || 'Select category'}
      </StyledDetailEditText>
      <StyledPencilWrapper>
        <StyledGradientOverlay
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={
            experienceType === 'memory'
              ? gradients.BackgroundGreen
              : experienceType === 'safe'
              ? gradients.BackgroundRed
              : gradients.BackgroundBlue
          }
          borderRadius={wp('3.19%')}
        />
        <CustomIcon name={'Edit_16x16'} size={12} color={'#fff'} />
      </StyledPencilWrapper>
    </StyledDetailEditButton>
  );
};

const DetailCard = props => {
  const {
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    category,
    onToggleModal,
    experienceType,
    marginBottom,
    inputRef,
  } = props;
  return (
    <StyledCard marginBottom={marginBottom}>
      <StyledTextField label={'Title'} value={title} onChangeText={onChangeTitle} />
      <StyledTextField
        label={'Description'}
        value={description}
        onChangeText={onChangeDescription}
        inputRef={inputRef}
      />
      <DetailEditButton category={category} onPress={onToggleModal} experienceType={experienceType} />
    </StyledCard>
  );
};

const PostCard = props => {
  const { isAfter, onSwitchLive, marginBottom, experienceType } = props;
  return (
    <StyledCard marginBottom={marginBottom}>
      <StyledPostTitle>{'Live'}</StyledPostTitle>
      <StyledPostDescription>{'Share your Memory with the World Right Now! '}</StyledPostDescription>
      <PostSwitch
        marginTop={20}
        inactiveText={'Live'}
        activeText={'After'}
        value={isAfter}
        onValueChange={onSwitchLive}
        experienceType={experienceType}
      />
    </StyledCard>
  );
};

const StyledTextField = props => (
  <TextField
    {...props}
    multiline={true}
    autoCorrect={false}
    enablesReturnKeyAutomatically={true}
    keyboardType={'default'}
    contentInset={{ input: 8, top: 0 }}
    tintColor={colors.WarmGrey}
    baseColor={colors.WarmGrey}
    activeLineWidth={hp('0.1%')}
    disabledLineWidth={hp('0.1%')}
    fontSize={hp('1.7%')} // the size of static label(initial lable || big label)
    labelFontSize={hp('1.2%')} // the size of top label(small label)
    inputContainerStyle={[styles.inputContainerStyle, { width: props.width || '100%' }]}
    labelTextStyle={styles.labelTextStyle}
    style={[styles.textInputStyle]}
    renderFullLine={true}
    ref={props.inputRef}
    renderLeftAccessory={() => <Text style={{ color: theme.cyan.text, fontSize: wp('4%') }}>{`✷ `}</Text>}
  />
);

const StyledMapPlaceholderImage = styled(FastImage)`
  position: absolute;
  left: 0;
  top: 0;
  width: ${CARD_WIDTH};
  height: ${wp('47.22%')};
  justify-content: center;
  align-items: center;
`;

const StyledMapSelectButtonText = styled.Text`
  font-size: ${wp('3.61%')};
  color: #9a999b;
  font-family: ${font.MMedium};
  text-align: center;
`;

const StyledMapButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${wp('6.67%')};
  width: ${wp('73.61%')};
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
  background-color: #f6f6f6;
  justify-content: center;
  align-items: center;
  border-color: #a7a7a7;
  border-width: 0.5;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const MapSelectButton = props => (
  <StyledMapButton {...props}>
    <StyledMapSelectButtonText>
      <Text style={{ color: theme.cyan.text }}>{`✷ `}</Text>
      {'Select a Location'}
    </StyledMapSelectButtonText>
  </StyledMapButton>
);

const StyledMapButtonContainer = styled.View`
  position: absolute;
  left: ${wp('4.5%')};
  top: ${hp('10%')};
`;

const StyledSwitchWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${wp('5.55%')};
`;

const StyledSwitchText = styled.Text`
  font-size: ${wp('4.72%')};
  color: ${props => props.color || '#6C6C6C'};
  font-family: ${font.MRegular};
  font-weight: 400;
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const PostSwitch = props => {
  return (
    <StyledSwitchWrapper>
      <StyledSwitchText
        color={
          !props.value ? (props.experienceType === 'memory' ? '#44D6BF' : 'rgba(110,205,249,0.93)') : colors.WarmGrey
        }
        marginRight={wp('6.8%')}
      >
        {props.inactiveText}
      </StyledSwitchText>
      <Switch
        value={props.value}
        onValueChange={props.onValueChange}
        disabled={false}
        circleSize={wp('8.61%')}
        barHeight={wp('9.16%')}
        circleBorderWidth={0}
        backgroundActive={props.experienceType === 'memory' ? '#44D6BF' : 'rgba(110,205,249,0.93)'}
        backgroundInactive={'rgb(234, 234, 234)'}
        switchLeftPx={2.5}
        switchRightPx={2.5}
      />
      <StyledSwitchText
        color={
          props.value ? (props.experienceType === 'memory' ? '#44D6BF' : 'rgba(110,205,249,0.93)') : colors.WarmGrey
        }
        marginLeft={wp('6.8%')}
      >
        {props.activeText}
      </StyledSwitchText>
    </StyledSwitchWrapper>
  );
};

const StyledMapEditButton = styled.TouchableOpacity`
  position: absolute;
  bottom: -${wp('4.165%')};
  align-self: center;
  width: 84.93%;
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
  justify-content: center;
  background-color: #fff;
`;

const MapEditButton = props => {
  return (
    <StyledMapEditButton {...props}>
      <StyledDetailEditText>{'Durham Park, MI 48237'}</StyledDetailEditText>
      <StyledPencilWrapper>
        <StyledGradientOverlay
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={gradients.BackgroundBlue}
          borderRadius={wp('3.19%')}
        />
        <CustomIcon name={'Edit_16x16'} size={12} color={'#fff'} />
      </StyledPencilWrapper>
    </StyledMapEditButton>
  );
};

const styles = StyleSheet.create({
  labelTextStyle: { fontFamily: font.MMedium },
  textInputStyle: {
    fontFamily: font.MRegular,
    color: '#5E5E5E',
    fontSize: 14,
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
});

export {
  StyledBigText,
  StyledPostTitle,
  StyledPostDescription,
  StyledCard,
  StyledMapPlaceholderImage,
  StyledMapButtonContainer,
  Header,
  DetailCard,
  PostCard,
  StyledTextField,
  DetailEditButton,
  MapEditButton,
  MapSelectButton,
};
