import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { DEFAULT_FOUNDER_ID } from '../../../../utils/vals';

// Load theme
import theme from '../../../core/theme';
const { font, sizes } = theme;

// Import common components
import { StyledWrapper, StyledSeparator, StyledButton } from '../../../core/common.styles';

const StyledModalBody = styled.View`
  width: ${wp('100%')};
  flex: 1;
  border-top-left-radius: ${wp('5.5%')};
  border-top-right-radius: ${wp('5.5%')};
  padding-top: ${wp('4.44%')};
  padding-bottom: ${wp('4.44%')};
  background-color: #fff;
`;

const StyledCloseButtonWrapper = styled.TouchableOpacity`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
  border-color: #878787;
  border-width: 1;
  top: ${wp('10%')}
  left: ${wp('80%')}
  justify-content: center;
  align-items: center;
`;

const CloseButton = props => (
  <StyledCloseButtonWrapper {...props}>
    <CustomIcon name={'close-24px'} size={sizes.normalIconSize} color={'#878787'} />
  </StyledCloseButtonWrapper>
);

const StyledFollowrsTitle = styled.Text`
  font-size: ${hp('2.5%')};
  font-family: ${font.MSemiBold};
  color: #212121;
  margin-top: ${hp('3.6%')};
`;

const StyledSearchIconWrapper = styled.View`
  width: ${hp('6.25%')};
  margin-right: ${wp('3.9%')};
  align-items: center;
`;

const StyledSearchInput = styled.TextInput`
  width: 100%;
  padding: 0;
  font-size: ${hp('2.34%')};
  font-family: ${font.MRegular};
  color: #000;
`;

const SearchInput = props => {
  return (
    <StyledWrapper
      row
      width={'100%'}
      height={wp('10%')}
      marginTop={hp('2.03%')}
      secondary={'center'}
      borderRadius={4}
      backgroundColor={'#eeeeee'}
      opacity={0.6}
    >
      <StyledSearchIconWrapper>
        <CustomIcon name={'Common-Search_20x20px'} size={20} color={'#6c6c6c'} />
      </StyledSearchIconWrapper>
      <StyledSearchInput placeholder={'Search Users'} placeholderTextColor={'#000'} onChangeText={props.onChangeText} />
    </StyledWrapper>
  );
};

const StyledUserAvatar = styled(FastImage)`
  width: ${hp('6.25%')};
  height: ${hp('6.25%')};
  border-radius: ${hp('3.125')};
  margin-right: ${wp('3.9%')};
`;

const StyledUserName = styled.Text`
  font-size: ${hp('2.34%')};
  font-family: ${font.MRegular};
  font-weight: 400;
  color: #000;
`;

const UserItem = props => {
  const {
    data: { profile_photo, name },
    toProfile,
  } = props;

  return (
    <StyledWrapper
      row
      secondary={'center'}
      paddingLeft={wp('4.44%')}
      paddingRight={wp('4.44%')}
      paddingTop={sizes.xsmallPadding}
      paddingBottom={sizes.xsmallPadding}
    >
      <StyledButton onPress={toProfile}>
        <StyledUserAvatar source={{ uri: profile_photo }} />
      </StyledButton>
      <StyledUserName>{name}</StyledUserName>
    </StyledWrapper>
  );
};

const FollowersModal = props => {
  const { navigation, title, isModalVisible, onToggleModal, data } = props;
  const [filteredUsers, setFilteredUsers] = useState(data);

  useEffect(() => {
    setFilteredUsers(data);
  }, [data]);

  const onClose = useCallback(() => {
    onToggleModal();
  }, [onToggleModal]);

  const onChangeText = useCallback(
    text => {
      if (!text) {
        setFilteredUsers(data);
      } else {
        const newFilteredUsers = data.filter(item => item.name.toUpperCase().includes(text.toUpperCase()));
        setFilteredUsers(newFilteredUsers);
      }
    },
    [data]
  );

  const toProfile = useCallback(
    userID => {
      onToggleModal();
      setTimeout(() => {
        if (userID !== DEFAULT_FOUNDER_ID) {
          navigation.push('ViewProfile', { uid: userID });
        }
      }, 1000);
    },
    [navigation, onToggleModal]
  );

  return (
    <Modal isVisible={isModalVisible} style={styles.modal} onRequestClose={onClose}>
      <StyledModalBody>
        <StyledWrapper paddingLeft={wp('4.44%')} paddingRight={wp('4.44%')} marginBottom={hp('2.8%')}>
          <CloseButton onPress={onClose} />
          <StyledFollowrsTitle>{title}</StyledFollowrsTitle>

          <SearchInput onChangeText={onChangeText} />
        </StyledWrapper>
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => <UserItem data={item} toProfile={() => toProfile(item.uid)} />}
          ItemSeparatorComponent={() => <StyledSeparator bgColor={'#000'} opacity={0.18} height={0.5} />}
          showsVerticalScrollIndicator={false}
        />
      </StyledModalBody>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
  },
});

export default FollowersModal;
