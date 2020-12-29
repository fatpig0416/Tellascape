import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import { TextField } from 'react-native-material-textfield';
import LinearGradient from 'react-native-linear-gradient';

import { StyledWrapper, StyledButton, StyledGradientOverlay } from '../../../core/common.styles';

// Load organisms
import TextAvatar from '../organisms/TextAvatar';

// Load theme
import theme from '../../../core/theme';
const { images, colors, font, sizes } = theme;

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

const StyledContainer = styled.View`
  flex: 1;
  background-color: ${props => props.bgColor || '#eaeaea'};
`;

const StyledHeader = styled.ImageBackground`
  position: absolute;
  width: ${wp('100%')};
  height: ${hp('27.5%')};
  justify-content: flex-end;
  padding-bottom: ${hp('3.68%')};
  padding-left: ${wp('4.72%')};
`;

const StyledHeaderTitle = styled.Text`
  color: #ffffff;
  font-family: ${font.MSemiBold};
  font-size: ${wp('6.66%')};
  margin-top: ${hp('3.8%')};
  margin-bottom: ${hp('1.84%')};
`;

const StyledHeaderContent = styled.Text`
  color: #ffffff;
  font-family: ${font.MRegular};
  font-weight: 500;
  font-size: ${wp('3.61%')};
  line-height: ${wp('5%')};
`;

const StyledBackButton = styled.TouchableOpacity`
  margin-left: -12;
`;

const BackButton = props => (
  <StyledBackButton {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={sizes.xlargeIconSize} color={'#fff'} />
  </StyledBackButton>
);

const Header = props => {
  return (
    <StyledHeader source={images.ALERT_BACKGROUND}>
      <BackButton onPress={props.onBack} />
      <StyledWrapper paddingLeft={wp('2.77%')}>
        <StyledHeaderTitle>{'TellaSafe'}</StyledHeaderTitle>
        <StyledHeaderContent>{'Stay Safe! Provide emergency\ninformation just in case'}</StyledHeaderContent>
      </StyledWrapper>
    </StyledHeader>
  );
};

const StyledBody = styled.View`
  flex: 1;
  height: ${hp('72.5%')};
  margin-top: ${hp('27.5%')};
  background-color: #eaeaea;
`;

const StyledBigText = styled.Text`
  font-size: ${wp('5%')};
  line-height: ${wp('6.66%')};
  color: #454545;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-top: -7;
`;

const StyledCard = styled.View`
  width: ${wp('83.7%')};
  padding-left: ${wp('3.15%')};
  padding-right: ${wp('4.51%')};
  padding-top: ${wp('2.01%')};
  padding-bottom: ${wp('2.01%')};
  background-color: #ffffff;
  border-width: 0.5;
  border-color: #9b9b9b;
  border-radius: 8;
  margin-top: ${wp('2.986%')};
`;

const StyledListText = styled.Text`
  font-size: ${wp('3.61%')};
  color: #212121;
  font-family: ${font.MRegular};
  margin-left: ${wp('4.44%')};
`;

const UserItem = props => {
  const { givenName, familyName } = props.data;
  const { onPress, onLongPress } = props;

  return (
    <StyledButton width={'100%'} onLongPress={onLongPress}>
      <StyledWrapper
        width={'100%'}
        row
        primary={'space-between'}
        secondary={'center'}
        paddingTop={wp('1.52%')}
        paddingBottom={wp('1.52%')}
      >
        <StyledWrapper row secondary={'center'}>
          {/* <StyledUserAvatar source={images.PROFILE} /> */}
          <TextAvatar {...props} />
          <StyledListText>{`${givenName} ${familyName}`}</StyledListText>
        </StyledWrapper>
        <StyledButton onPress={onPress}>
          <CustomIcon name={'Close_16x16px'} size={12} color={'#ff6c6f'} />
        </StyledButton>
      </StyledWrapper>
    </StyledButton>
  );
};

const StyledPlusButton = styled.TouchableOpacity`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(106, 51, 124, 0.2);
`;

const PlusButton = props => {
  return (
    <StyledPlusButton {...props}>
      <StyledGradientOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#ff6c6f', '#e14e55']}
        borderRadius={wp('4.44%')}
      />
      <CustomIcon name={'add-24px'} size={20} color={'#fff'} />
    </StyledPlusButton>
  );
};

const StyledDetailEditButton = styled.TouchableOpacity`
  width: 100%;
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
  justify-content: center;
  border-width: 1;
  border-color: ${props => props.borderColor};
  margin-top: ${wp('3.33%')};
`;

const StyledDetailEditText = styled.Text`
  font-size: ${wp('3.61%')};
  font-family: ${font.MRegular};
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
  const { buttonText } = props;

  return (
    <StyledDetailEditButton {...props} borderColor={'#f44d6c'}>
      <StyledDetailEditText>{buttonText}</StyledDetailEditText>
      <StyledPencilWrapper>
        <StyledGradientOverlay
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#ff6c6f', '#e14e55']}
          borderRadius={wp('3.19%')}
        />
        <CustomIcon name={'Edit_16x16'} size={12} color={'#fff'} />
      </StyledPencilWrapper>
    </StyledDetailEditButton>
  );
};

const StyledSaveButton = styled.TouchableOpacity`
  width: ${wp('83.7%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  justify-content: center;
  align-items: center;
  /* box-shadow: 0px 4px 8px rgba(106, 51, 124, 0.2); */
`;

const StyledSaveText = styled.Text`
  font-size: ${wp('4.16%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #ffffff;
`;

const RedButton = props => {
  const { isEnabled } = props;

  return (
    <StyledSaveButton {...props} disabled={!isEnabled}>
      <StyledGradientOverlay
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isEnabled ? ['#ff6c6f', '#e14e55'] : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
        borderRadius={wp('5%')}
        useAngle={true}
        angle={125}
        angleCenter={{ x: 0.5, y: 0.5 }}
      />
      <StyledSaveText>{props.buttonText || 'Save'}</StyledSaveText>
    </StyledSaveButton>
  );
};

const StyledContactHeader = styled.View`
  width: ${wp('100%')};
`;

const StyledContactHeaderTitle = styled.Text`
  font-size: ${wp('4.44%')};
  color: #fff;
  font-family: ${font.MBold};
  align-self: center;
`;

const ContactHeader = props => {
  const { onBack, onAddContacts } = props;

  return (
    <StyledContactHeader>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ff6c6f', '#e14e55']} style={styles.headerContainer}>
        <SafeAreaView>
          <StyledWrapper row primary={'space-between'} secondary={'center'}>
            <BackButton onPress={onBack} />
            <StyledContactHeaderTitle>{'Add Contact'}</StyledContactHeaderTitle>
            <StyledButton onPress={onAddContacts}>
              <CustomIcon name={'add-24px'} size={28} color={'#fff'} />
            </StyledButton>
          </StyledWrapper>
        </SafeAreaView>
      </LinearGradient>
    </StyledContactHeader>
  );
};

const StyledContactBody = styled.View`
  flex: 1;
`;

const StyledSearchInput = styled.TextInput`
  width: 100%;
  padding: 0;
  font-size: ${wp('3.88%')};
  opacity: 0.7;
  font-family: ${font.MRegular};
  color: #000;
`;

const StyledSearchIconWrapper = styled.View`
  margin-right: ${wp('3.9%')};
  align-items: center;
`;

const SearchInput = props => {
  return (
    <StyledWrapper
      row
      width={wp('95.56%')}
      height={wp('9.16%')}
      borderRadius={wp('4.58%')}
      marginTop={hp('1.45%')}
      marginBottom={hp('1.97%')}
      secondary={'center'}
      backgroundColor={'#f1f1f1'}
      alignSelf={'center'}
      paddingLeft={wp('5.83%')}
      paddingRight={wp('5.83%')}
    >
      <StyledSearchIconWrapper>
        <CustomIcon name={'Common-Search_20x20px'} size={20} color={'#6c6c6c'} />
      </StyledSearchIconWrapper>
      <StyledSearchInput placeholder={'Search Users'} placeholderTextColor={'#000'} onChangeText={props.onChangeText} />
    </StyledWrapper>
  );
};

const ContactUserItem = props => {
  const { givenName, familyName } = props.data;
  const { isSelected, onPress } = props;

  return (
    <StyledButton onPress={onPress}>
      <StyledWrapper
        width={'100%'}
        row
        primary={'space-between'}
        secondary={'center'}
        paddingBottom={5}
        paddingTop={5}
        paddingLeft={16}
        paddingRight={16}
        backgroundColor={isSelected ? '#ff8a80' : '#fff'}
      >
        <StyledWrapper row secondary={'center'}>
          <TextAvatar data={props.data} />
          <StyledListText>{`${givenName} ${familyName}`}</StyledListText>
        </StyledWrapper>
      </StyledWrapper>
    </StyledButton>
  );
};

const EmergencyItem = props => {
  const { isSelected, onPress } = props;

  return (
    <StyledButton onPress={onPress}>
      <StyledWrapper
        width={'100%'}
        row
        primary={'space-between'}
        secondary={'center'}
        paddingBottom={5}
        paddingTop={5}
        paddingLeft={16}
        paddingRight={16}
        backgroundColor={isSelected ? 'grey' : '#fff'}
      >
        <StyledWrapper row secondary={'center'}>
          <CustomIcon name={'keyboard_arrow_left-24px'} size={32.5} color={'#000'} />
          <StyledListText>{'911 Local Dept'}</StyledListText>
        </StyledWrapper>
      </StyledWrapper>
    </StyledButton>
  );
};

const StyledAlertContainer = styled.View`
  width: ${wp('95.83%')};
  border-radius: 20;
  background-color: ${colors.LightGreyTwo};
  padding-left: 12;
  padding-right: 12;
  padding-top: 16;
  padding-bottom: 16;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledAlertCard = styled.TouchableOpacity`
  flex: 1;
  padding-top: ${hp('2.1%')};
  padding-bottom: ${hp('2.1%')};
  border-radius: 20;
  background-color: ${colors.White};
  margin-left: 4;
  margin-right: 4;
  justify-content: center;
  align-items: center;
`;

const StyledAlertTitle = styled.Text`
  margin-top: 10;
  font-size: ${wp('3.88%')};
  line-height: ${wp('5%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #454545;
  align-self: center;
  text-align: center;
`;

const StyledAlertDescription = styled.Text`
  margin-top: 3;
  font-size: ${wp('3.05')};
  line-height: ${wp('3.88%')};
  font-family: ${font.MRegular};
  color: #676767;
  align-self: center;
  text-align: center;
`;

const StyledAlertIcon = styled.Image`
  width: ${wp('11.11%')};
  height: ${wp('11.11%')};
  resize-mode: contain;
`;

const AlertCard = props => {
  const { title, description, alertType } = props;

  return (
    <StyledAlertCard {...props}>
      <StyledAlertIcon source={alertType === 'safe' ? images.SAFE : images.DANGER} />
      <StyledAlertTitle>{title}</StyledAlertTitle>
      <StyledAlertDescription>{description}</StyledAlertDescription>
    </StyledAlertCard>
  );
};

const StyledCategoryContainer = styled.View`
  width: 100%;
  height: ${props => props.height || 'auto'};
  background-color: 'rgba(255,255,255,0.95)';
  border-top-left-radius: ${wp('5.5%')};
  border-top-right-radius: ${wp('5.5%')};
  overflow: hidden;
  padding-bottom: ${isIphoneX() ? hp('5.65%') : hp('2%')};
  align-items: center;
`;

const StyledCategoryWrapper = styled.View`
  width: 100%;
  margin-top: ${wp('3.88%')};
  margin-bottom: ${wp('3.88%')};
  align-items: center;
  justify-content: center;
`;

const StyledCardView = styled.TouchableOpacity`
  width: ${props => props.width || wp('43.08%')};
  border-radius: ${wp('2.22%')};
  align-items: center;
  background-color: ${props => (props.isSelected ? '#eaeaea' : '#fff')};
  padding-top: ${props => props.paddingTop || hp('2.1%')};
  padding-bottom: ${props => props.paddingBottom || hp('1.7%')};
  margin-left: ${props => props.marginLeft || wp('1.11%')};
  margin-right: ${props => props.marginRight || wp('1.11%')};
  margin-top: ${props => props.marginTop || wp('1.11%')};
  margin-bottom: ${props => props.marginBottom || wp('1.11%')};
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.1);
  elevation: 1;
`;

const StyledCategoryLabel = styled.Text`
  font-weight: 400;
  font-family: ${font.MLight};
  font-size: ${wp('3.6%')};
  padding-top: 3;
  color: #2c2c2c;
`;

const StyledCategoryIcon = styled.Image`
  width: ${wp('11.6%')};
  height: ${wp('11.6%')};
  resize-mode: contain;
`;

const CategoryItem = ({ item, onSelectCategory, isSelected }) => {
  return (
    <StyledCardView onPress={() => onSelectCategory(item)} isSelected={isSelected}>
      <StyledCategoryIcon source={item.icon} />
      <StyledCategoryLabel>{item.label}</StyledCategoryLabel>
    </StyledCardView>
  );
};

const StyledHandler = styled.View`
  width: ${wp('9.16%')};
  height: ${wp('0.83%')};
  border-radius: 2.5;
  background-color: #dcdcdc;
`;

const KnobButton = props => (
  <StyledButton paddingTop={5} paddingBottom={5} {...props}>
    <StyledHandler />
  </StyledButton>
);

const InputText = ({ marginTop, width, label, keyboardType, onChangeText, val, inputRef }) => (
  <TextField
    multiline={true}
    autoCorrect={false}
    enablesReturnKeyAutomatically={true}
    onChangeText={onChangeText}
    keyboardType={keyboardType || 'phone-pad'}
    label={label}
    value={val}
    contentInset={{ input: 4, top: 0 }}
    tintColor={'#9A999B'}
    baseColor={'#9A999B'}
    activeLineWidth={0.5}
    disabledLineWidth={2}
    fontSize={wp('3.61%')} // the size of static label(initial lable || big label)
    labelFontSize={wp('2.5%')} // the size of top label(small label)
    inputContainerStyle={[styles.inputContainerStyle, { width: width || '100%', marginTop: marginTop || 0 }]}
    labelTextStyle={styles.labelTextStyle}
    style={[styles.textInputStyle]}
    underlineColorAndroid={'transparent'}
    autoCapitalize={'none'}
    ref={inputRef}
  />
);

const styles = StyleSheet.create({
  labelTextStyle: {
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#9A999B',
  },
  textInputStyle: {
    fontSize: wp('3.61%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  inputContainerStyle: {
    width: '100%',
    overflow: 'hidden',
  },
  headerContainer: {
    paddingVertical: wp('2.2%'),
    paddingHorizontal: wp('2%'),
  },
});

export {
  // Create Safe Screen
  StyledContainer,
  Header,
  StyledBody,
  StyledBigText,
  StyledCard,
  UserItem,
  StyledListText,
  PlusButton,
  DetailEditButton,
  RedButton,
  InputText,
  // Add Contact Screen
  ContactHeader,
  SearchInput,
  StyledContactBody,
  ContactUserItem,
  EmergencyItem,
  // Safe Alert
  StyledAlertContainer,
  AlertCard,
  // Categories
  StyledCategoryContainer,
  KnobButton,
  StyledCategoryWrapper,
  CategoryItem,
};
