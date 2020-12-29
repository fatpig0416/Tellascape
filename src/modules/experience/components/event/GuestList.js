import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import ExperienceActions from '../../reducers/event/index';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Accordion from 'react-native-collapsible/Accordion';
import SwitchSelector from 'react-native-switch-selector';
import LinearGradient from 'react-native-linear-gradient';
const moment = require('moment');
// Import actions and reselect
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAuth } from '../../../auth/reducers';
import { selectEventData, selectGuestListData, selectOtherUserMediaData } from '../../reducers/event';
// Load common components
import {
  StyledView,
  StyledButton,
  StyledHorizontalContainer,
  StyledWrapper,
  StyledSeparator,
} from '../../../core/common.styles';
// Load utils
import { Loading } from '../../../../utils';
import CustomIcon from '../../../../utils/icon/CustomIcon';
// Load theme
import theme from '../../../core/theme';
const { images, colors, font, gradients, sizes } = theme;

const StyledContainer = styled.View`
  flex: 1;
  background-color: #d9d9d9;
`;

const StyledGradientOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
  height: ${hp('12.1875%')};
  justify-content: flex-end;
  padding-bottom: 8;
  padding-left: ${wp('5.55%')};
  padding-right: ${wp('5.55%')};
`;

const BackButton = props => (
  <StyledButton marginLeft={-12} {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={props.iconSize} color={props.iconColor} />
  </StyledButton>
);

const IconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={props.iconName} size={props.iconSize} color={'#fff'} />
  </StyledButton>
);

const StyledHeaderTitle = styled.Text`
  font-size: ${sizes.largeFontSize};
  color: #fff;
  font-family: ${font.MBold};
`;

const StyledHeaderAvatarWrapper = styled(FastImage)`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  background-color: ${colors.White};
  justify-content: center;
  align-items: center;
`;

const StyledHeaderAvatar = styled(FastImage)`
  width: ${wp('8.33%')};
  height: ${wp('8.33%')};
  border-radius: ${wp('4.165%')};
`;

const StyledHeaderUsername = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #fff;
  font-family: ${font.MBold};
`;

const Header = props => {
  const { onGoBack, avatarSource, name, title } = props;

  return (
    <StyledHeader>
      <StyledGradientOverlay start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={gradients.Background} />
      <StyledWrapper row primary={'space-between'} secondary={'center'}>
        <StyledWrapper row>
          <BackButton onPress={onGoBack} iconSize={sizes.xlargeIconSize} iconColor={'#fff'} />
          <StyledWrapper row secondary={'center'} marginLeft={sizes.xsmallPadding}>
            <StyledHeaderAvatarWrapper>
              <StyledHeaderAvatar source={avatarSource} />
            </StyledHeaderAvatarWrapper>
            <StyledWrapper marginLeft={sizes.xsmallPadding}>
              <StyledHeaderUsername>{name}</StyledHeaderUsername>
              <StyledHeaderTitle>{title}</StyledHeaderTitle>
            </StyledWrapper>
          </StyledWrapper>
        </StyledWrapper>
        <IconButton marginLeft={sizes.normalPadding} iconName={'more_horiz-24px'} iconSize={sizes.xlargeIconSize} />
      </StyledWrapper>
    </StyledHeader>
  );
};

const StyledMediaButtonText = styled.Text`
  font-family: ${font.MSemiBold};
  font-size: ${sizes.middleFontSize};
  color: ${props => props.color};
  margin-top: ${sizes.xxsmallPadding};
`;

const MediaButton = props => {
  const { buttonType, isFocused } = props;
  let iconName = '';
  let buttonText = '';
  const iconColor = !isFocused ? '#b1b1b1' : '#ff9076';
  const textColor = !isFocused ? '#b8b8b8' : '#ff9076';

  switch (buttonType) {
    case 'media':
      iconName = 'PE-Media_40x20px';
      buttonText = 'Media';
      break;
    case 'guests':
      iconName = 'PE-GuestList_40x20px';
      buttonText = 'Guests';
      break;
    case 'details':
      iconName = 'PE-Details_40x20px';
      buttonText = 'Details';
      break;
    default:
      break;
  }

  return (
    <StyledButton {...props}>
      <StyledWrapper secondary={'center'}>
        <CustomIcon name={iconName} size={18} color={iconColor} />
        <StyledMediaButtonText color={textColor}>{buttonText}</StyledMediaButtonText>
      </StyledWrapper>
    </StyledButton>
  );
};

const StyledHeaderSearchWrapper = styled.View`
  width: ${wp('100%')};
  height: ${hp('8.75%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  background-color: #ffffff;
  padding-left: ${wp('4.72%')};
  padding-right: ${wp('4.72%')};
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
  elevation: 1;
`;

const StyledSearchWrapper = styled.TouchableOpacity`
  width: ${wp('13.89%')};
  height: ${hp('4.7%')};
  background-color: #eeeeee;
  border-radius: ${hp('2.35%')};
  justify-content: center;
  align-items: center;
`;

const SearchButton = props => (
  <StyledSearchWrapper {...props}>
    <CustomIcon name={'search-24px1'} size={24} color={'#6C6C6C'} />
  </StyledSearchWrapper>
);

const StyledInputWrapper = styled.View`
  width: ${wp('81.67%')};
  height: ${hp('4.69%')};
  border-radius: ${hp('2.345%')};
  padding-left: ${wp('5.56%')};
  padding-right: ${wp('5.56%')};
  background-color: #eeeeee;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledSearchInputText = styled.TextInput`
  flex: 1;
  padding: 0;
  font-size: ${hp('2.3%')};
  font-family: ${font.MRegular};
`;

const SearchInputText = props => (
  <StyledInputWrapper>
    <StyledSearchInputText placeholder={'Search Users'} {...props} />
    <StyledButton onPress={props.onPress}>
      <CustomIcon name={'search-24px1'} size={24} color={'#6c6c6c'} />
    </StyledButton>
  </StyledInputWrapper>
);

const StyledHeaderSearch = props => (
  <StyledHeaderSearchWrapper>
    <BackButton onPress={props.onGoBack} iconSize={42} iconColor={'#6C6C6C'} />
    <StyledHeaderTitle>{'Guest List'}</StyledHeaderTitle>
    {!props.isSearchable ? (
      <SearchButton onPress={props.onPressSearch} />
    ) : (
      <SearchInputText onPress={props.onPressSearch} onChangeText={props.onSearch} />
    )}
  </StyledHeaderSearchWrapper>
);

const StyledCard = styled.View`
  width: ${wp('95.56%')};
  margin-left: ${wp('2.22%')};
  margin-right: ${wp('2.22%')};
  padding-top: ${hp('2.3%')};
  padding-bottom: ${hp('2.3%')};
  background-color: ${colors.White};
  margin-top: ${hp('1.7%')};
  border-radius: 15;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
  elevation: 1;
`;

const StyledCardTitleText = styled.Text`
  font-size: ${hp('2.5%')};
  color: #fe7f73;
  font-family: ${font.MBold};
  margin-left: ${wp('4.44%')};
  margin-bottom: ${props => props.marginBottom || 0};
`;

const StyledUserAvatarWrapper = styled.View`
  width: ${hp('6.5625%')};
  height: ${hp('6.5625%')};
  border-radius: ${hp('3.28125%')};
  justify-content: center;
  align-items: center;
  padding: 1px 1px 1px 1px;
  border-color: #fe7f7e;
  border-width: ${wp('0.2%')};
`;

const StyledUserAvatar = styled(FastImage)`
  width: ${hp('6.25%')};
  height: ${hp('6.25%')};
  border-radius: ${hp('3.125%')};
`;

const StyledLeaderName = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: #494949;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const StyledLeaderTitle = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: #515151;
  font-family: ${font.MSemiBold};
  margin-bottom: ${sizes.smallPadding};
  align-self: center;
`;

const StyledLikesText = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #ff9076;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.xsmallPadding};
`;

const HEXAGON_WIDTH = 18;
const HEXAGON_HEIGHT = 20;
const HEXAGON_COLOR = '#ffa06d';
const StyledHexagon = styled.View`
  width: ${HEXAGON_WIDTH};
  height: ${HEXAGON_HEIGHT / 2};
`;

const StyledHexagonInner = styled.View`
  width: ${HEXAGON_WIDTH};
  height: ${HEXAGON_HEIGHT / 2};
  background-color: ${HEXAGON_COLOR};
  align-items: center;
  justify-content: center;
`;

const StyledHexagnAfter = styled.View`
  position: absolute;
  bottom: -${HEXAGON_HEIGHT / 4};
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-left-width: ${HEXAGON_WIDTH / 2};
  border-left-color: transparent;
  border-right-width: ${HEXAGON_WIDTH / 2};
  border-right-color: transparent;
  border-top-width: ${HEXAGON_HEIGHT / 4};
  border-top-color: ${HEXAGON_COLOR};
`;

const StyledHexagonBefore = styled.View`
  position: absolute;
  top: -${HEXAGON_HEIGHT / 4};
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-left-width: ${HEXAGON_WIDTH / 2};
  border-left-color: transparent;
  border-right-width: ${HEXAGON_WIDTH / 2};
  border-right-color: transparent;
  border-bottom-width: ${HEXAGON_HEIGHT / 4};
  border-bottom-color: ${HEXAGON_COLOR};
`;

const StyledHexagonTextWrapper = styled.View`
  position: absolute;
  left: 0;
  top: ${-HEXAGON_HEIGHT / 4};
  width: ${HEXAGON_WIDTH};
  height: ${HEXAGON_HEIGHT};
  justify-content: center;
  align-items: center;
`;

const StyledHexagonText = styled.Text`
  font-size: ${sizes.smallFontSize};
  color: #ffffff;
  font-family: ${font.MBold};
`;

const Hexagon = props => (
  <StyledHexagon>
    <StyledHexagonInner />
    <StyledHexagonBefore />
    <StyledHexagnAfter />
  </StyledHexagon>
);

const StyledHexagonWrapper = styled.View`
  position: absolute;
  left: ${-HEXAGON_WIDTH / 2};
  top: ${HEXAGON_HEIGHT / 2};
`;

const LeaderItem = props => {
  const { first_name, last_name, likes, photo } = props.data;
  return (
    <StyledWrapper secondary={'center'} paddingLeft={wp('3.33%')} paddingRight={wp('3.33%')}>
      <StyledWrapper>
        <StyledUserAvatarWrapper>
          <StyledUserAvatar source={{ uri: photo }} />
        </StyledUserAvatarWrapper>
        <StyledHexagonWrapper>
          <Hexagon />
          <StyledHexagonTextWrapper>
            <StyledHexagonText>{2}</StyledHexagonText>
          </StyledHexagonTextWrapper>
        </StyledHexagonWrapper>
      </StyledWrapper>
      <StyledLeaderName>{`${first_name} ${last_name}`}</StyledLeaderName>
      <StyledWrapper row paddingTop={sizes.xxsmallPadding} secondary={'center'}>
        <CustomIcon name={'Events_16px'} size={sizes.xsmallIconSize} color={'#ff9076'} />
        <StyledLikesText>{likes}</StyledLikesText>
      </StyledWrapper>
    </StyledWrapper>
  );
};

const StyledUserNameText = styled.Text`
  font-size: ${hp('2.2%')};
  color: #000000;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-left: ${wp('3.33%')};
`;

const StyledMoreText = styled.Text`
  font-size: ${hp('2%')};
  color: #fe847c;
  font-family: ${font.MMedium};
`;

const MoreButton = props => (
  <StyledHorizontalContainer marginTop={6} marginLeft={wp('3.11%')}>
    <CustomIcon name={!props.isMore ? 'expand_more-24px' : 'expand_less-24px'} size={30} color={'#ff8e77'} />
    <StyledButton {...props}>
      <StyledMoreText marginLeft={wp('8.06%')}>{!props.isMore ? 'More' : 'Less'}</StyledMoreText>
    </StyledButton>
  </StyledHorizontalContainer>
);

const StyledBlockButton = styled.TouchableOpacity`
  width: ${wp('33.89%')};
  height: ${hp('4%')};
  border-radius: 5;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;

const StyledBlockButtonText = styled.Text`
  font-size: ${hp('1.7%')};
  font-family: ${font.MMedium};
  color: #000000;
`;

const BlockButton = props => (
  <StyledBlockButton {...props}>
    <StyledBlockButtonText>{props.title}</StyledBlockButtonText>
  </StyledBlockButton>
);

const StyledInviteButton = styled.TouchableOpacity`
  justify-content: center;
  height: ${hp('3.6%')};
  padding-left: ${wp('4.1%')};
  padding-right: ${wp('4.1%')};
  border-radius: 5;
  background-color: #f5f5f5;
`;

const InviteButton = props => (
  <StyledInviteButton {...props}>
    <StyledBlockButtonText>{props.title}</StyledBlockButtonText>
  </StyledInviteButton>
);

const StyledRemoveButton = styled.TouchableOpacity`
  width: ${wp('22.78%')};
  height: ${hp('4%')};
  border-radius: 5;
  border-width: ${wp('0.2%')};
  border-color: #ff3b30;
  justify-content: center;
  align-items: center;
  margin-left: 11;
`;

const StyledRemoveText = styled.Text`
  font-size: ${hp('1.7%')};
  font-family: ${font.MSemiBold};
  color: #ff3b30;
`;

const RemoveButton = props => (
  <StyledRemoveButton {...props}>
    <StyledRemoveText>{'Remove'}</StyledRemoveText>
  </StyledRemoveButton>
);

const ItemSeparator = styled.View`
  width: 100%;
  height: 0.5;
  background-color: rgba(0, 0, 0, 0.87);
  opacity: 0.2;
`;

const StyledSwitchWrapper = styled.View`
  width: ${wp('36%')};
`;

class InviteFriend extends Component {
  constructor(props) {
    super(props);

    this.event_post_id = props.navigation.getParam('parentID', 'default');
    this.event_post_cid = props.navigation.getParam('childID', 'default');
    this.sendRequest = this.sendRequest.bind(this);
    this.guestLists = this.props.event_data[0];
    //this.currentExperienceData = this.props.experience.data.find(ele => ele.parentID === this.event_post_id);

    this.state = {
      // is searchable
      isSearchable: false,

      // is RSVP
      isRSVP: false,

      // invited data
      // originalInvitedData: this.props.event_data[0].invited_user,
      // invitedData: this.props.event_data[0].invited_user,
      // originalRsvpData: this.props.event_data[0].rsvp_user,
      // rsvpData: this.props.event_data[0].rsvp_user,
      originalInvitedData: this.guestLists.guests,
      invitedData: this.guestLists.guests,
      originalRsvpData: this.guestLists.rsvp_user,
      rsvpData: this.guestLists.rsvp_user,

      isInvitedMore: false,

      // people(you may know) data
      originalPeopleData: this.guestLists.people_may_know,
      peopleData: this.guestLists.people_may_know,
      // originalPeopleData: this.guestLists.friends,
      // peopleData: this.guestLists.friends,

      isPeopleMore: false,

      // others data
      originalOthersData: this.guestLists.Others,
      othersData: this.guestLists.Others,
      // originalOthersData: this.guestLists.other_user,
      // othersData: this.guestLists.other_user,

      isOthersMore: false,

      // expanded data
      activeInvitedSections: [],
      activePeopleSections: [],
      activeOthersSections: [],
    };
  }

  componentDidMount() {
    // Get Guest Lists
    // const req = {
    //   token: this.props.auth.access_token,
    //   parentID: this.event_post_id,
    // };
    // this.props.onGuestLists(req);
  }

  /**
   * Invite a friend
   *
   */
  sendRequest = item => {
    /**
     * Call api for inviting friend
     *
     */
    if (this.props.event_data && this.props.event_data.length > 0) {
      const obj = {
        parentID: this.props.event_data[0].parentID,
        childID: this.props.event_data[0].child_ID,
        userID: item.userID,
        token: this.props.auth.access_token,
      };
      this.props.onInviteUser(obj);
    }

    /**
     * Update the guest list data without listening the response of calling the API
     *
     */
    const { originalInvitedData, originalPeopleData, originalOthersData } = this.state;

    let newInvitedData = [...originalInvitedData];
    let newPeopleData = [...originalPeopleData];
    let newOthersData = [...originalOthersData];

    // inviting in people section
    const invitedPeopleIndex = originalPeopleData.findIndex(ele => ele.userID === item.userID);
    if (invitedPeopleIndex !== -1) {
      // remove item in the people data
      newPeopleData.splice(invitedPeopleIndex, 1);
    }

    // inviting in others section
    const invitedOthersIndex = originalPeopleData.findIndex(ele => ele.userID === item.userID);
    if (invitedOthersIndex !== -1) {
      // remove item in the others data
      newOthersData.splice(invitedOthersIndex, 1);
    }

    // add item in the invited data
    newInvitedData.unshift(item);

    this.setState({
      originalInvitedData: newInvitedData,
      originalPeopleData: newPeopleData,
      originalOthersData: newOthersData,
      invitedData: newInvitedData,
      peopleData: newPeopleData,
      othersData: newOthersData,
    });
  };

  /**
   * Delete an invited user
   *
   */
  deleteInvite = item => {
    /**
     * Call api for inviting friend
     *
     */
    const obj = {
      parentID: this.event_post_id,
      childID: this.event_post_cid,
      userID: item.userID,
      token: this.props.auth.access_token,
    };
    this.props.onDeleteInvitedUser(obj);

    /**
     * Update the guest list data without listening the response of calling the API
     *
     */
    const { originalInvitedData, originalRsvpData } = this.state;

    let newInvitedData = [...originalInvitedData];
    let newRsvpData = [...originalRsvpData];

    // deleting the user in Invited data
    const deletedInvitedIndex = originalInvitedData.findIndex(ele => ele.userID === item.userID);
    if (deletedInvitedIndex !== -1) {
      newInvitedData.splice(deletedInvitedIndex, 1);
    }

    // deleting the user in Invited data
    const deletedRsvpIndex = originalRsvpData.findIndex(ele => ele.userID === item.userID);
    if (deletedRsvpIndex !== -1) {
      newRsvpData.splice(deletedRsvpIndex, 1);
    }

    this.setState({
      originalInvitedData: newInvitedData,
      originalRsvpData: newRsvpData,
      invitedData: newInvitedData,
      rsvpData: newRsvpData,
    });
  };

  onPressExperience = async item => {
    this.props.navigation.navigate('LiveEvent', {
      parentID: this.event_post_id,
      userID: item.userID,
    });
  };

  /**
   * Search
   *
   */
  getUsersByName = (userArray, searchName) => {
    if (userArray && userArray.length > 0) {
      const result = userArray.filter(item => {
        const userName = item.users_name.toUpperCase();
        const changedSearchName = searchName.toUpperCase();
        return userName.indexOf(changedSearchName) > -1;
      });

      return result;
    }
    return [];
  };

  onSearch = text => {
    const { originalInvitedData, originalPeopleData, originalOthersData, originalRsvpData } = this.state;

    const newInvitedData = this.getUsersByName(originalInvitedData, text);
    const newPeopleData = this.getUsersByName(originalPeopleData, text);
    const newOthersData = this.getUsersByName(originalOthersData, text);
    const newRsvpData = this.getUsersByName(originalRsvpData, text);

    this.setState({
      invitedData: newInvitedData,
      peopleData: newPeopleData,
      othersData: newOthersData,
      rsvpData: newRsvpData,
    });
  };

  /**
   * Change the possibility for searching
   *
   */
  onPressSearch = () => {
    this.setState(prevState => ({
      isSearchable: !prevState.isSearchable,
    }));
  };

  navigateToProfile = uid => {
    // this.props.navigation.push('ViewProfile', { uid: uid });
    this.props.navigation.push('OtherUserExperience', { uid: uid });
  };

  // ----------------------------------------------- Section for rendering user item --------------------------------------- //
  //
  //
  /**
   * User item bottom render section
   *
   */
  _renderInvitedHeader = (content, index, isActive, sections) => {
    /**
     * content: item data
     * index: the current item index
     * isActive: if the item is expanded, the value is true
     * sections: the current Array data - that is Users data
     */
    return (
      <StyledHorizontalContainer
        justifyContent={'space-between'}
        paddingLeft={wp('2.22%')}
        paddingRight={wp('2.22%')}
        paddingBottom={3.5}
        paddingTop={3.5}
      >
        <StyledHorizontalContainer>
          {/** User avatar */}
          <StyledUserAvatarWrapper>
            <TouchableWithoutFeedback onPress={() => this.navigateToProfile(content.userID)}>
              <StyledUserAvatar source={content.photo ? { uri: content.photo } : ''} />
            </TouchableWithoutFeedback>
          </StyledUserAvatarWrapper>

          {/** User name */}
          <StyledUserNameText>{`${content.users_name || ''}`}</StyledUserNameText>
        </StyledHorizontalContainer>

        {/** More button */}
        <StyledButton>
          <CustomIcon name={'Arrow_16x16px'} size={sizes.xsmallIconSize} color={'#b1b1b1'} />
        </StyledButton>
      </StyledHorizontalContainer>
    );
  };

  _renderOthersHeader = (content, index, isActive, sections) => {
    /**
     * content: item data
     * index: the current item index
     * isActive: if the item is expanded, the value is true
     * sections: the current Array data - that is Users data
     */
    return (
      <StyledHorizontalContainer
        justifyContent={'space-between'}
        paddingLeft={wp('2.22%')}
        paddingRight={wp('2.22%')}
        paddingBottom={3.5}
        paddingTop={3.5}
      >
        <StyledHorizontalContainer>
          {/** User avatar */}
          <StyledUserAvatarWrapper>
            <TouchableWithoutFeedback onPress={() => this.navigateToProfile(content.userID)}>
              <StyledUserAvatar source={content.photo ? { uri: content.photo } : ''} />
            </TouchableWithoutFeedback>
          </StyledUserAvatarWrapper>

          {/** User name */}
          <StyledUserNameText>{`${content.users_name || ''}`}</StyledUserNameText>
        </StyledHorizontalContainer>

        {/** More button */}
        {/* <InviteButton
          title={'Invite'}
          onPress={() => this.sendRequest(content)} /////----- Send an invite to the guest in People/Ohters section -----/////
        /> */}
      </StyledHorizontalContainer>
    );
  };

  /**
   * User item bottom render section
   *
   */
  _renderInvitedSectionContent = (content, index, isActive, sections) => {
    /**
     * content: item data
     * index: the current item index
     * isActive: if the item is expanded, the value is true
     * sections: the current Array data - that is Users data
     */
    return (
      <StyledHorizontalContainer
        justifyContent={'space-between'}
        paddingBottom={9}
        paddingLeft={wp('2.22%')}
        paddingRight={wp('2.22%')}
      >
        {/** Block button && Media button */}
        <StyledHorizontalContainer>
          <BlockButton title={'Block All Media'} onPress={() => {}} />
          <RemoveButton onPress={() => this.deleteInvite(content)} />
        </StyledHorizontalContainer>

        {/** Experience button */}

        {content.media_count !== undefined && content.media_count === 0 ? null : (
          <StyledButton>
            <CustomIcon
              onPress={() => {
                this.onPressExperience(content);
              }}
              name={'PE-Experience_40x40px'}
              size={24}
              color={'#ff9970'}
            />
          </StyledButton>
        )}
      </StyledHorizontalContainer>
    );
  };

  /**
   * Separator
   *
   */
  _renderFooter = section => {
    return <ItemSeparator />;
  };
  //
  //
  // ----------------------------------------------- Section for rendering user item --------------------------------------- //

  /**
   * Update expanded Invited items
   *
   */
  _updateInvitedSections = activeSections => {
    this.setState({ activeInvitedSections: activeSections });
  };

  /**
   * Update expanded People you may know items
   *
   */
  _updatePeopleSections = activeSections => {
    this.setState({ activePeopleSections: activeSections });
  };

  /**
   * Update expanded Others items
   *
   */
  _updateOthersSections = activeSections => {
    this.setState({ activeOthersSections: activeSections });
  };

  /**
   * Update the flags for moreInvited, morePeople, moreOthers
   *
   */
  onMoreInvited = () => {
    this.setState(prevState => ({
      isInvitedMore: !prevState.isInvitedMore,
    }));
  };
  onMorePeople = () => {
    this.setState(prevState => ({
      isPeopleMore: !prevState.isPeopleMore,
    }));
  };
  onMoreOthers = () => {
    this.setState(prevState => ({
      isOthersMore: !prevState.isOthersMore,
    }));
  };

  /**
   * Change the status of RSVP
   *
   */
  onChangeRSVP = () => {
    this.setState(prevState => ({
      isRSVP: !prevState.isRSVP,
    }));
  };

  /**
   * Go back
   *
   */
  onGoBack = () => {
    this.props.navigation.goBack();
    // if (this.props.event_data && this.props.event_data.length > 0) {
    //   if (moment(this.props.event_data[0].startDate).isBefore(moment())) {
    //     this.props.navigation.navigate('LiveEvent', {
    //       parentID: this.props.event_data[0].parentID,
    //     });
    //   } else {
    //     this.props.navigation.navigate('LiveEvent', {
    //       parentID: this.props.event_data[0].parentID,
    //     });
    //   }
    // }
  };

  render() {
    const {
      // is searchable
      isSearchable,
      isRSVP,

      // invited data
      invitedData,
      rsvpData,
      isInvitedMore,

      // people(you may know) data
      peopleData,
      isPeopleMore,

      // others data
      othersData,
      isOthersMore,

      // expanded data
      activeInvitedSections,
      activePeopleSections,
      activeOthersSections,
    } = this.state;

    const options = [{ label: 'All', value: 'all' }, { label: 'RSVP', value: 'rsvp' }];

    const dataForInviteSection = !isRSVP
      ? !isInvitedMore
        ? invitedData.slice(0, 7)
        : invitedData
      : !isInvitedMore
      ? rsvpData.slice(0, 7)
      : rsvpData;

    const isInvitedMoreVisible = !isRSVP ? (invitedData.length > 7 ? true : false) : rsvpData.length > 7 ? true : false;

    const eventData = this.props.event_data[0];

    return (
      <StyledContainer>
        {this.guestLists && this.guestLists.invited_user.length > 0 ? (
          <StyledView>
            <Header
              onGoBack={this.onGoBack}
              name={eventData.name}
              avatarSource={{ uri: eventData.founder_photo }}
              title={eventData.title}
            />
            {/**
             * Search Header
             *
             */}
            <StyledWrapper
              row
              primary={'space-between'}
              paddingLeft={wp('12.36%')}
              paddingRight={wp('12.36%')}
              paddingBottom={sizes.smallPadding}
              paddingTop={sizes.smallPadding}
              backgroundColor={colors.White}
            >
              <MediaButton buttonType={'media'} onPress={() => {}} />
              <MediaButton buttonType={'guests'} onPress={() => {}} isFocused={true} />
              <MediaButton buttonType={'details'} onPress={() => {}} />
            </StyledWrapper>
            <StyledSeparator bgColor={'#000000'} height={hp('0.15625')} opacity={0.18} />
            <StyledWrapper
              width={'100%'}
              backgroundColor={colors.White}
              paddingBottom={sizes.normalPadding}
              paddingTop={sizes.normalPadding}
            >
              <StyledLeaderTitle>{'LEADER BOARD'}</StyledLeaderTitle>
              <FlatList
                data={eventData.leader_board}
                renderItem={({ item, index }) => <LeaderItem data={item} />}
                keyExtractor={(item, index) => '' + index}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <StyledWrapper marginTop={hp('1.325%')}>
                    <StyledSeparator width={hp('0.16%')} height={hp('3.6%')} bgColor={'#d1d1d1'} />
                  </StyledWrapper>
                )}
              />
            </StyledWrapper>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/**
               * Invited
               *
               */}

              <StyledCard>
                <StyledHorizontalContainer
                  justifyContent={'space-between'}
                  marginBottom={hp('2.5%')}
                  paddingRight={wp('2.22%')}
                >
                  <StyledCardTitleText>{'Invited'}</StyledCardTitleText>
                  {/** All || RSVP switch section */}
                  <StyledSwitchWrapper>
                    <SwitchSelector
                      options={options}
                      initial={isRSVP ? 1 : 0}
                      onPress={() => this.onChangeRSVP()}
                      buttonColor={'#ffffff'}
                      backgroundColor={'#f5f5f5'}
                      selectedColor={'#000'}
                      hasPadding={true}
                      height={hp('4.7%')}
                      textStyle={styles.switchNormalText}
                      selectedTextStyle={styles.switchSelectedText}
                      borderColor={'transparent'}
                    />
                  </StyledSwitchWrapper>
                </StyledHorizontalContainer>

                {dataForInviteSection.length > 0 ? (
                  <>
                    <Accordion
                      sections={dataForInviteSection}
                      activeSections={activeInvitedSections}
                      renderHeader={this._renderInvitedHeader}
                      renderContent={this._renderInvitedSectionContent}
                      renderFooter={this._renderFooter}
                      onChange={this._updateInvitedSections}
                      touchableComponent={TouchableWithoutFeedback}
                      expandMultiple={false}
                    />

                    {isInvitedMoreVisible ? <MoreButton onPress={this.onMoreInvited} isMore={isInvitedMore} /> : null}
                  </>
                ) : null}
              </StyledCard>
              {/**
               * People You May Know
               *
               */}
              {!isRSVP && peopleData.length > 0 ? (
                <StyledCard>
                  <StyledCardTitleText marginBottom={hp('2.5%')}>{'People You May Know'}</StyledCardTitleText>

                  <Accordion
                    sections={!isPeopleMore ? peopleData.slice(0, 4) : peopleData}
                    activeSections={activePeopleSections}
                    renderHeader={this._renderOthersHeader}
                    renderContent={() => null}
                    renderFooter={this._renderFooter}
                    onChange={this._updatePeopleSections}
                    touchableComponent={TouchableWithoutFeedback}
                    expandMultiple={false}
                  />
                  <MoreButton onPress={this.onMorePeople} isMore={isPeopleMore} />
                </StyledCard>
              ) : null}

              {/**
               * Others

               */}
              {!isRSVP && othersData.length > 0 ? (
                <StyledCard>
                  <StyledCardTitleText marginBottom={hp('2.5%')}>{'Others'}</StyledCardTitleText>

                  <Accordion
                    sections={!isOthersMore ? othersData.slice(0, 4) : othersData}
                    activeSections={activeOthersSections}
                    renderHeader={this._renderOthersHeader}
                    renderContent={() => null}
                    renderFooter={this._renderFooter}
                    onChange={this._updateOthersSections}
                    touchableComponent={TouchableWithoutFeedback}
                    expandMultiple={false}
                  />
                  <MoreButton onPress={this.onMoreOthers} isMore={isOthersMore} />
                </StyledCard>
              ) : null}
            </ScrollView>
          </StyledView>
        ) : (
          <Loading />
        )}
      </StyledContainer>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  switchNormalText: {
    color: '#6c6c6c',
    fontSize: hp('1.7%'),
    fontFamily: font.MMedium,
    fontWeight: '400',
  },
  switchSelectedText: {
    color: '#000000',
    fontSize: hp('1.7%'),
    fontFamily: font.MMedium,
    fontWeight: '400',
  },
});

const mapStateToProps = createStructuredSelector({
  auth: selectAuth,
  event_data: selectEventData,
  // guestLists: selectGuestListData,
});

const mapDispatchToProps = dispatch => {
  return {
    onInviteUser: obj => {
      dispatch(ExperienceActions.addInvite(obj));
    },
    onDeleteInvitedUser: obj => {
      dispatch(ExperienceActions.deleteInvite(obj));
    },
    onGuestLists: obj => {
      dispatch(ExperienceActions.getGuestLists(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteFriend);
