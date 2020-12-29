import React, { useState, useCallback, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes, images } = theme;

// Import common components
import { StyledWrapper, StyledSeparator, StyledButton, StyledButtonOverlay } from '../../../core/common.styles';

// Import organism
// import Filter from '../../../profile/components/organisms/Filter';
import CardView from './CardView';
import moment from 'moment';

const FILTER_DATA = [
  {
    option: 'All',
    value: null,
  },
  {
    option: 'Events',
    value: 'event',
  },
  {
    option: 'Memories',
    value: 'memory',
  },
  {
    option: 'Stations',
    value: 'station',
  },
];

const GRADIENT_DATA = {
  event: {
    angle: 132.44,
    colors: ['#FFB86D', '#FF7B7A'],
  },
  station: {
    angle: 152.26,
    colors: ['#60C4F4', '#67A0FE'],
  },
  memory: {
    angle: 122.8,
    colors: ['#45D8BF', '#3AB1BE'],
  },
};

// const cardWidth = Dimensions.get('window').width - wp('2.22%') * 2;

const StyledEventTypeText = styled.Text`
  font-size: ${wp('3.88%')};
  font-family: ${font.MExtraBold};
  color: ${props => props.color || '#454545'}; /** default color of experience type text */
`;

const StyledBigText = styled.Text`
  font-size: ${wp('3.88%')};
  font-family: ${font.MExtraBold};
  color: ${props => props.color || '#454545'}; /** default color of experience type text */
  /* text-transform: uppercase; */
`;

const StyledLiveWrapper = styled.View`
  position: absolute;
  left: ${wp('1.66%')};
  top: ${wp('1.66%')};
  height: ${wp('5.27%')};
  border-radius: ${wp('2.635')};
  background-color: #fff;
  flex-direction: row;
  padding-left: ${wp('1.66%')};
  padding-right: ${wp('1.66%')};
  align-items: center;
`;

const StyledLiveCircleWrapper = styled.View`
  width: ${wp('2.22%')};
  height: ${wp('2.22%')};
  border-radius: ${wp('1.11%')};
  /* overflow: hidden; */
  margin-right: 3;
  justify-content: center;
  align-items: center;
  background-color: red;
`;

const LiveCircle = props => {
  const { eventType } = props;
  return (
    <StyledLiveCircleWrapper>
      <StyledButtonOverlay
        borderRadius={wp('1.11%')}
        locations={[0, 1]}
        colors={GRADIENT_DATA[eventType].colors}
        useAngle={true}
        angle={GRADIENT_DATA[eventType].angle}
        angleCenter={{ x: 0.5, y: 0.5 }}
      />
    </StyledLiveCircleWrapper>
  );
};

const StyledLiveText = styled.Text`
  font-size: ${wp('3.05%')};
  font-family: ${font.MRegular};
  font-weight: 700;
  color: #454545;
`;

const Live = props => {
  return (
    <StyledLiveWrapper>
      <LiveCircle {...props} />
      <StyledLiveText>{'LIVE'}</StyledLiveText>
    </StyledLiveWrapper>
  );
};

const StyledItemDescriptionWrapper = styled.View`
  position: absolute;
  left: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
`;

const StyledItem = styled.TouchableOpacity`
  width: ${wp('75%')};
  height: ${wp('50%')};
  border-radius: 15;
  margin-left: ${wp('2.22%')};
`;

const StyledItemPhoto = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 15;
`;

const Item = props => {
  const { onPress } = props;
  const { iUrl, type, title, sDate, eDate } = props.data;

  let now = moment().format('YYYY-MM-DD HH:mm:ss');
  let startDate = moment(sDate).format('YYYY-MM-DD HH:mm:ss');
  let endDate = moment(eDate).format('YYYY-MM-DD HH:mm:ss');
  let isLive = false;
  if (now > startDate && now < endDate) {
    isLive = true;
  }
  return (
    <StyledItem
      activeOpacity={1}
      onPress={() => onPress(props.data)}
      style={{ backgroundColor: colors.placeholderColor }}
    >
      <FastImage
        source={{ uri: iUrl, priority: FastImage.priority.high }}
        style={{ width: wp('75%'), height: wp('50%'), borderRadius: 15 }}
      />
      {isLive ? <Live eventType={type} /> : null}
      <StyledItemDescriptionWrapper>
        <StyledBigText color={'#fff'}>{title}</StyledBigText>
      </StyledItemDescriptionWrapper>
    </StyledItem>
  );
};

const StyledShowText = styled.Text`
  font-size: ${wp('3.33%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #999ba1;
  margin-right: ${wp('2.22%')};
`;

const ShowButton = props => (
  <StyledButton {...props}>
    <StyledWrapper row>
      <StyledShowText>{props.status ? 'Show Less' : 'Show All'}</StyledShowText>
      <CustomIcon name={'expand_more-24px'} size={20} color={'#999ba1'} />
    </StyledWrapper>
  </StyledButton>
);

const TrendingCarousel = props => {
  const { eventType, status, onChangeStatus, onEventPress, onPressAvatar, onPressLike } = props;
  const eventString = eventType === 'event' ? 'Events' : eventType === 'station' ? 'Stations' : 'Memories';
  // const onShowAll = useCallback(() => {
  //   onChangeStatus(!status);
  // }, [onChangeStatus]);

  return (
    <StyledWrapper marginTop={wp('5.55%')}>
      <StyledWrapper
        row
        width={'100%'}
        primary={'space-between'}
        paddingLeft={wp('4.44%')}
        paddingRight={wp('4.44%')}
        marginBottom={wp('2.22%')}
      >
        <StyledEventTypeText>{eventString}</StyledEventTypeText>
        {<ShowButton onPress={onChangeStatus} status={status} />}
        {/* <Filter  onSelect={selected} selected={selectedFilterOption} /> */}
      </StyledWrapper>
      {!status ? (
        <Carousel
          ref={c => {}}
          data={props.data}
          renderItem={({ item, index }) => <Item data={item} onPress={onEventPress} />} // destruct props
          sliderWidth={wp('100%')}
          itemWidth={wp('77.22%')}
          activeSlideAlignment={'start'}
          firstItem={0}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          removeClippedSubviews={false}
          onSnapToItem={slideIndex => {}}
        />
      ) : (
        <FlatList
          data={props.data}
          contentContainerStyle={{ paddingBottom: wp('8.33%') }}
          renderItem={({ item, index }) => (
            <CardView
              data={item}
              onPressEvent={onEventPress}
              onPressAvatar={onPressAvatar}
              onPressLike={() => onPressLike(item)}
            />
          )}
          keyExtractor={(item, index) => '' + index}
          showsVerticalScrollIndicator={false}
          // onEndReached={this.onLoadMore}
          onEndReachedThreshold={0.4}
          // ListFooterComponent={this.renderFooter}
        />
      )}
    </StyledWrapper>
  );
};

export default TrendingCarousel;
