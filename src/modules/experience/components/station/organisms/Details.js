import React, { useState, useCallback } from 'react';
import { Share, TouchableOpacity, RefreshControl } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
const moment = require('moment');

// Load utils
import CustomIcon from '../../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../../core/theme';
const { font, sizes, colors, blue } = theme;

// Import common components
import { StyledWrapper, StyledSeparator } from '../../../../core/common.styles';

// Import organisms
import MapArea from './MapArea';

const StyledScroll = styled(KeyboardAwareScrollView)`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || 'transparent'};
`;

const StyledMapContainer = styled.View`
  width: 100%;
  height: ${wp('83.3%')};
  background-color: ${colors.LightGreyTwo};
  overflow: hidden;
`;

const StyledDetailTitle = styled.Text`
  font-size: ${wp('3.33%')};
  color: #282828;
  font-family: ${font.MSemiBold};
  margin-right: ${sizes.smallPadding};
`;

const StyledDetailDescription = styled.Text`
  font-size: ${wp('3.055%')};
  color: #565656;
  font-family: ${font.MRegular};
  margin-top: ${sizes.xxsmallPadding};
`;

const DetailSection = props => (
  <StyledWrapper
    width={'100%'}
    backgroundColor={'#fff'}
    paddingTop={wp('2.22%')}
    paddingLeft={wp('2.22%')}
    paddingRight={wp('2.22%')}
    paddingBottom={wp('2.22%')}
    marginBottom={wp('0.3%')}
  >
    <StyledDetailDescription>{props.content}</StyledDetailDescription>
  </StyledWrapper>
);

const StyledDetailInfoTitle = styled.Text`
  flex: 1.5;
  color: #808080;
  font-size: 12;
  line-height: 18;
  font-family: ${font.MRegular};
  text-align: right;
`;

const StyledDetailInfoDescription = styled.Text`
  flex: 3;
  padding-left: ${wp('4.17%')};
  color: #282828;
  font-size: 12;
  line-height: 18;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const StyledActivityText = styled.Text`
  margin-left: ${sizes.xsmallPadding};
  margin-right: ${sizes.smallPadding};
  color: #282828;
  font-size: 12;
  line-height: 18;
  font-family: ${font.MRegular};
  font-weight: 500;
`;

const StyledActivityWrapper = styled.View`
  flex: 3;
  padding-left: ${wp('4.17%')};
  flex-direction: row;
  align-items: center;
`;

const DetailItem = props => {
  const { title, description, likes, comments, onPress } = props;
  return (
    <StyledWrapper row marginBottom={sizes.normalPadding} secondary={'center'}>
      <StyledDetailInfoTitle>{title}</StyledDetailInfoTitle>
      {title === 'Activity' ? (
        <StyledActivityWrapper>
          <CustomIcon name={'love-big_16x16'} size={sizes.smallIconSize} color={'#282828'} />
          <StyledActivityText>{likes}</StyledActivityText>
          <CustomIcon name={'comments-big_16x16'} size={sizes.smallIconSize} color={'#282828'} />
          <StyledActivityText>{comments}</StyledActivityText>
        </StyledActivityWrapper>
      ) : (
        <TouchableOpacity style={{ flex: 3 }} onPress={onPress} disabled={onPress ? false : true}>
          <StyledDetailInfoDescription style={{ color: props.color }}>{description}</StyledDetailInfoDescription>
        </TouchableOpacity>
      )}
    </StyledWrapper>
  );
};

const StyledOpenButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledOpenButtonText = styled.Text`
  color: ${props => props.color || '#515151'};
  font-size: ${wp('2.78%')};
  font-family: ${font.MRegular};
  margin-left: ${sizes.smallPadding};
`;

const OpenButton = props => (
  <StyledOpenButton {...props}>
    <CustomIcon
      name={props.iconName || 'Navbar_Messages_32px'}
      size={sizes.smallIconSize}
      color={props.iconColor || '#282828'}
    />
    <StyledOpenButtonText color={props.textColor}>{props.buttonText}</StyledOpenButtonText>
  </StyledOpenButton>
);

const CardDetail = ({
  hostName,
  address,
  status,
  startDate,
  endDate,
  eventSize,
  media,
  onShare,
  likes,
  comments,
  onOpenChat,
  onPressHost,
  weather,
  title,
  description,
}) => (
  <StyledWrapper style={{ margin: 15 }}>
    <StyledWrapper
      width={'100%'}
      row
      backgroundColor={'#fff'}
      paddingTop={sizes.smallPadding}
      paddingBottom={sizes.smallPadding}
      secondary={'center'}
      marginBottom={sizes.normalPadding}
    >
      <OpenButton buttonText={'Share'} iconName={'PE-Share_20x20px'} onPress={onShare} />
    </StyledWrapper>

    <StyledWrapper
      backgroundColor={'#fff'}
      marginLeft={sizes.normalPadding}
      marginRight={sizes.normalPadding}
      paddingTop={sizes.largePadding}
      paddingBottom={8}
      style={{ borderRadius: 10 }}
    >
      {address && <DetailItem title={'Address'} description={address} />}
      <DetailItem title={'Host'} description={hostName} color={blue.text} onPress={onPressHost} />
      <DetailItem title={'Description'} description={description} />
      <DetailItem title={'Activity'} likes={likes} comments={comments} />
      <DetailItem title={'Status'} description={status} />
      <DetailItem title={'Started at'} description={startDate} />
      <DetailItem title={'Size'} description={eventSize} />
      <DetailItem title={'Media'} description={media} />
      <DetailItem title={'Weather'} description={weather} />
    </StyledWrapper>
  </StyledWrapper>
);

const AddressBar = props => (
  <StyledWrapper
    row
    primary={'center'}
    width={'100%'}
    paddingTop={sizes.smallPadding}
    paddingBottom={sizes.smallPadding}
    backgroundColor={'#fff'}
    marginBottom={wp('0.3%')}
  >
    <StyledDetailTitle>{props.address}</StyledDetailTitle>
    {/* <CustomIcon name={'Copy-Address_20x20px'} size={sizes.smallIconSize} color={'#282828'} /> */}
  </StyledWrapper>
);

const Details = props => {
  const {
    data: {
      address,
      likes,
      comments,
      isPrivate,
      sDate,
      eDate,
      eventSize,
      media,
      share_url,
      description,
      parentID,
      center,
      weather,
      founder,
      title,
    },
    onOpenChat,
    onShareOpen,
    onRefresh,
    isRefresh = false,
  } = props;
  let weatherCondition = weather !== '' || weather !== undefined ? weather.temp + '°F ' + weather.type : '';
  const onShare = useCallback(async () => {
    try {
      await Share.share({
        url: share_url,
        message: 'Post Event',
      });
    } catch (error) {
      console.log(`Share Error Handling IS: ${error.message} `);
    }
  }, [share_url]);

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
      <StyledWrapper flex={1} width={wp('100%')}>
        <StyledSeparator bgColor={'#000'} opacity={0.18} height={0.5} />
        {address && <AddressBar address={'address'} />}

        <DetailSection content={description} />
        <CardDetail
          hostName={founder}
          address={address}
          comments={comments}
          likes={likes}
          status={isPrivate ? 'Private' : 'Public'}
          startDate={moment(sDate).format('DD MMM YYYY hh:mm A')}
          eventSize={eventSize}
          media={`${media} Files`}
          share_url={share_url}
          onShare={onShareOpen}
          onOpenChat={onOpenChat}
          onPressHost={props.onPressHost}
          weather={weatherCondition}
          title={title}
          description={description}
        />
      </StyledWrapper>
    </StyledScroll>
  );
};

export default Details;
