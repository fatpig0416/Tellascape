import React, { useState, useCallback } from 'react';
import {
  FlatList,
  TouchableWithoutFeedback,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { font, sizes, blue, orange, cyan } = theme;

// Import common components
import { StyledWrapper, StyledSeparator, StyledButton, StyledButtonOverlay } from '../../../core/common.styles';

const StyledScroll = styled(KeyboardAwareScrollView)`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || 'transparent'};
`;

const StyledLeaderTitle = styled.Text`
  font-size: ${sizes.normalFontSize};
  /* color: #515151; */
  color: ${props => props.color};
  font-family: ${font.MBold};
  margin-top: ${wp('2.5%')};
  margin-bottom: ${wp('2.5%')};
  align-self: center;
  letter-spacing: 0.3;
`;

const StyledLeaderName = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.16%')};
  color: #565656;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-top: ${wp('1.388%')};
`;

const StyledLikesText = styled.Text`
  font-size: ${wp('2.778%')};
  /* color: #ff9076; */
  color: ${props => props.color};
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.xsmallPadding};
`;

const StyledUserAvatarWrapper = styled.View`
  width: ${wp('11.11%')};
  height: ${wp('11.11%')};
  border-radius: ${hp('5.555%')};
  justify-content: center;
  align-items: center;
  /* border-color: #fe7f7e; */
  border-color: ${props => props.color};
  border-width: ${wp('0.2%')};
`;

const StyledUserAvatar = styled(FastImage)`
  width: ${wp('10%')};
  height: ${wp('10%')};
  border-radius: ${wp('5%')};
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
  background-color: ${props => props.color};
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
  border-top-color: ${props => props.color};
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
  border-bottom-color: ${props => props.color};
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
  <StyledHexagon {...props}>
    <StyledHexagonInner {...props} />
    <StyledHexagonBefore {...props} />
    <StyledHexagnAfter {...props} />
  </StyledHexagon>
);

const StyledHexagonWrapper = styled.View`
  position: absolute;
  left: ${-HEXAGON_WIDTH / 2};
  top: ${HEXAGON_HEIGHT / 2};
`;

const StyledInviteButton = styled.TouchableOpacity`
  position: absolute;
  align-self: center;
  width: ${wp('75.55%')};
  height: ${wp('10%')};
  align-items: center;
  justify-content: center;
  box-shadow: 4px 6px 27px rgba(40, 76, 98, 0.2);
`;

const StyledInviteText = styled.Text`
  font-size: ${wp('4.16%')};
  color: #fff;
  font-family: ${font.MBold};
  text-align: center;
`;

const LeaderItem = props => {
  const { toExperience, toProfile, isMoreThree, color } = props;
  const { first_name, last_name, likes, photo, profile_img, userID } = props.data;
  return (
    <StyledWrapper
      secondary={'center'}
      // paddingLeft={wp('3.33%')}
      // paddingRight={wp('3.33%')}
      width={!isMoreThree ? wp('33.33%') : wp('22.22%')}
      paddingBottom={wp('2.22%')}
      paddingTop={wp('2.22%')}
    >
      <StyledWrapper>
        <TouchableWithoutFeedback onPress={() => toExperience(props.data)}>
          <StyledUserAvatarWrapper color={color}>
            <StyledUserAvatar source={{ uri: profile_img }} />
          </StyledUserAvatarWrapper>
        </TouchableWithoutFeedback>
        <StyledHexagonWrapper>
          <Hexagon color={color} />
          <StyledHexagonTextWrapper>
            <StyledHexagonText>{likes}</StyledHexagonText>
          </StyledHexagonTextWrapper>
        </StyledHexagonWrapper>
      </StyledWrapper>
      <StyledButton onPress={() => toExperience(props.data)}>
        <StyledLeaderName>{`${first_name} ${last_name[0] || ''}`}</StyledLeaderName>
        {likes === 0 ? null : (
          <StyledWrapper row paddingTop={sizes.xxsmallPadding} primary={'center'} secondary={'center'}>
            <CustomIcon name={'Events_16px'} size={sizes.xsmallIconSize} color={color} />
            <StyledLikesText color={color}>{likes}</StyledLikesText>
          </StyledWrapper>
        )}
      </StyledButton>
    </StyledWrapper>
  );
};

const StyledCard = styled.View`
  width: ${wp('95.56%')};
  border-radius: 15;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(90, 97, 105, 0.12);
  margin-top: ${wp('2.22%')};
  padding-top: ${wp('2.22%')};
  padding-bottom: ${wp('2.22%')};
`;

const StyledCardTitle = styled.Text`
  font-size: ${wp('3.88%')};
  color: ${props => props.color};
  font-family: ${font.MExtraBold};
  margin-left: ${wp('1.94%')};
`;

const StyledCardUserAvatarWrapper = styled.View`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  justify-content: center;
  align-items: center;
  border-color: ${props => props.color};
  border-width: ${wp('0.2%')};
`;

const StyledCardUserAvatar = styled(FastImage)`
  width: ${wp('7.77%')};
  height: ${wp('7.77%')};
  border-radius: ${wp('3.885%')};
`;

const StyledCardUserName = styled.Text`
  font-size: ${wp('3.33%')};
  color: #282828;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.normalPadding};
`;

const CardUserItem = props => {
  const {
    data: { first_name, last_name, photo, profile_img, userID, hasAnonymous },
    toProfile,
    toExperience,
    color,
    onGuestPress,
  } = props;

  return (
    <StyledWrapper
      row
      width={'100%'}
      primary={'space-between'}
      secondary={'center'}
      paddingTop={sizes.xsmallPadding}
      paddingBottom={sizes.xsmallPadding}
      paddingRight={sizes.smallPadding}
    >
      <StyledWrapper row secondary={'center'} paddingLeft={sizes.smallPadding}>
        <StyledButton onPress={() => toProfile(userID, hasAnonymous)}>
          <StyledCardUserAvatarWrapper color={color}>
            <StyledCardUserAvatar source={{ uri: profile_img }} />
          </StyledCardUserAvatarWrapper>
        </StyledButton>
      </StyledWrapper>
      <StyledButton
        style={{ flex: 1, flexDirection: 'row', height: wp('8.88%'), alignItems: 'center' }}
        onPress={() => {
          if (onGuestPress) {
            onGuestPress(props.data);
          } else {
            toExperience(props.data);
          }
        }}
      >
        <StyledCardUserName style={{ flex: 1 }}>{`${first_name} ${last_name || ''}`}</StyledCardUserName>
        <TouchableOpacity onPress={() => toExperience(props.data)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <CustomIcon name={'Arrow_16x16px'} size={14} color={'#b1b1b1'} />
        </TouchableOpacity>
      </StyledButton>
    </StyledWrapper>
  );
};

const StyledMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: ${sizes.normalPadding};
  margin-top: ${sizes.xxsmallPadding};
`;

const StyledMoreText = styled.Text`
  font-size: ${hp('2%')};
  /* color: #fe847c; */
  color: ${props => props.color};
  font-family: ${font.MMedium};
`;

const MoreButton = props => (
  <StyledMoreButton {...props}>
    <CustomIcon
      name={!props.isMore ? 'expand_more-24px' : 'expand_less-24px'}
      size={sizes.normalIconSize}
      // color={'#ff8e77'}
      color={props.color}
    />
    <StyledMoreText color={props.color} marginLeft={wp('8.06%')}>
      {!props.isMore ? 'More' : 'Less'}
    </StyledMoreText>
  </StyledMoreButton>
);

const LIMIT_NUMBER = 3;
const CardSeparator = () => <StyledSeparator bgColor={'#000'} opacity={0.18} height={0.5} />;
const Card = props => {
  const {
    data,
    cardTitle,
    toProfile,
    toExperience,
    isMore,
    toggleMore,
    color,
    onPressBlock,
    onPressRemove,
    disabled = false,
    onGuestPress,
  } = props;
  return (
    <>
      {data.length > 0 ? (
        <StyledCard>
          <StyledWrapper paddingLeft={wp('2.22%')} paddingRight={wp('2.22%')} paddingBottom={wp('2.22%')}>
            <StyledCardTitle color={color}>{cardTitle}</StyledCardTitle>
          </StyledWrapper>
          <CardSeparator />
          <FlatList
            data={!isMore ? data.slice(0, LIMIT_NUMBER) : data}
            renderItem={({ item, index }) => (
              <>
                <CardUserItem
                  color={color}
                  data={item}
                  toProfile={toProfile}
                  toExperience={toExperience}
                  onGuestPress={onGuestPress}
                />
              </>
            )}
            keyExtractor={(item, index) => '' + index}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <CardSeparator />}
            // ListHeaderComponent={() => <CardSeparator />}
            // ListFooterComponent={() => <CardSeparator />}
          />
          {data.length > LIMIT_NUMBER ? (
            <StyledWrapper>
              <MoreButton color={color} isMore={isMore} onPress={toggleMore} />
            </StyledWrapper>
          ) : null}
        </StyledCard>
      ) : null}
    </>
  );
};

const InviteButton = props => {
  return (
    <>
      {props.isVisible === true ? (
        <StyledWrapper width={wp('100%')} height={hp('5%')} marginTop={wp('5.5%')} marginBottom={wp('2.5%')}>
          <StyledInviteButton {...props}>
            <StyledButtonOverlay
              borderRadius={wp('5%')}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={theme.gradients.Background}
            />
            <StyledInviteText>{props.title}</StyledInviteText>
          </StyledInviteButton>
        </StyledWrapper>
      ) : null}
    </>
  );
};

const Leader = props => {
  const { data, toExperience, toProfile, color } = props;
  return (
    <>
      {data.length > 0 ? (
        <StyledWrapper width={wp('100%')} backgroundColor={'#fff'}>
          <StyledSeparator width={wp('100%')} bgColor={'#000'} opacity={0.18} height={1} />
          <StyledLeaderTitle color={color}>{'LEADER BOARD'}</StyledLeaderTitle>
          <StyledSeparator width={wp('100%')} bgColor={'#000'} opacity={0.18} height={1} />
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <LeaderItem
                color={color}
                data={item}
                toProfile={toProfile}
                toExperience={toExperience}
                isMoreThree={data.length > 3}
              />
            )}
            keyExtractor={(item, index) => '' + index}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <StyledWrapper marginTop={wp('4.44%')}>
                <StyledSeparator width={0.5} height={wp('6.67%')} bgColor={'#d1d1d1'} />
              </StyledWrapper>
            )}
          />
        </StyledWrapper>
      ) : null}
    </>
  );
};

const GuestLists = props => {
  const {
    isFounderJoined,
    leaderData,
    hostData,
    otherData,
    peopleData,
    toExperience,
    experienceType,
    navigateProfile,
    onRefresh,
    isRefresh = false,
    onPressBlock,
    onPressRemove,
    isActionButtons,
    onGuestPress,
    guestData,
    toInviteGuestList,
    isInviteButtonVisible,
  } = props;
  const [isMorePeople, setIsMorePeople] = useState(false);
  const [isMoreOthers, setIsMoreOthers] = useState(false);
  const specificTheme = experienceType === 'station' ? blue : experienceType === 'memory' ? cyan : orange;

  const toProfile = useCallback((userID, hasAnonymous) => {
    navigateProfile(userID, hasAnonymous);
  });
  const toInviteGuest = useCallback(() => {
    toInviteGuestList();
  });
  const toggleMorePeople = useCallback(() => {
    setIsMorePeople(prevState => !prevState);
  }, []);
  const toggleMoreOthers = useCallback(() => {
    setIsMoreOthers(prevState => !prevState);
  }, []);

  return (
    <StyledScroll
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefresh}
          onRefresh={() => {
            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      }
    >
      <StyledWrapper width={'100%'} secondary={'center'} paddingBottom={sizes.normalPadding}>
        <InviteButton title={'Invite'} isVisible={isInviteButtonVisible} onPress={toInviteGuest} />
        <Leader color={specificTheme.text} data={leaderData} toProfile={toProfile} toExperience={toExperience} />
        {isFounderJoined && (
          <Card
            color={specificTheme.text}
            cardTitle={'Host'}
            data={hostData}
            isMore={isMorePeople}
            toggleMore={toggleMorePeople}
            toProfile={toProfile}
            toExperience={toExperience}
            onPressBlock={onPressBlock}
            onPressRemove={onPressRemove}
            disabled={true}
            onGuestPress={onGuestPress}
          />
        )}
        {guestData && (
          <Card
            color={specificTheme.text}
            cardTitle={'Guest Admin'}
            data={guestData}
            isMore={isMorePeople}
            toggleMore={toggleMorePeople}
            toProfile={toProfile}
            toExperience={toExperience}
            onPressBlock={onPressBlock}
            onPressRemove={onPressRemove}
            disabled={true}
            onGuestPress={onGuestPress}
          />
        )}
        <Card
          color={specificTheme.text}
          cardTitle={'People You May Know'}
          data={peopleData}
          isMore={isMorePeople}
          toggleMore={toggleMorePeople}
          toProfile={toProfile}
          toExperience={toExperience}
          onPressBlock={onPressBlock}
          onPressRemove={onPressRemove}
          disabled={!isActionButtons}
          onGuestPress={onGuestPress}
        />
        <Card
          color={specificTheme.text}
          cardTitle={'Others'}
          data={otherData}
          isMore={isMoreOthers}
          toggleMore={toggleMoreOthers}
          toProfile={toProfile}
          toExperience={toExperience}
          onPressBlock={onPressBlock}
          onPressRemove={onPressRemove}
          disabled={!isActionButtons}
          onGuestPress={onGuestPress}
        />
      </StyledWrapper>
    </StyledScroll>
  );
};

const styles = StyleSheet.create({
  swipeButtonText: {
    fontFamily: font.MMedium,
    color: 'white',
    alignSelf: 'center',
    letterSpacing: 0.3,
  },
  swipeButtonContainer: {
    backgroundColor: theme.colors.LightGreyTwo,
    height: '80%',
    justifyContent: 'center',
    marginRight: wp('1.5%'),
    marginTop: '5%',
  },
});

export default GuestLists;
