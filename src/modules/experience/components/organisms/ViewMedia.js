import React, { useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import ProgressiveImage from './ProgressiveImage';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes } = theme;

// Import common components
import { StyledWrapper, StyledSeparator, StyledButton } from '../../../core/common.styles';

// Import organisms
import ExperienceFilter from '../../../profile/components/organisms/ExperienceFilter';
import PhotoCarouseItem from './PhotoCarouseItem';

const cardWidth = Dimensions.get('window').width - wp('2.22%') * 2;

const StyledScroll = styled(KeyboardAwareScrollView)`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || 'transparent'};
`;

const StyledMediaHeader = styled.View`
  position: absolute;
  top: 4;
  width: ${wp('100%')};
  padding-left: ${wp('2.2%')};
  padding-right: ${wp('2.2%')};
  flex-direction: row;
  justify-content: space-between;
`;

const StyledMediaHeaderItem = styled.View`
  flex: 1;
  height: 2;
  opacity: ${props => (props.isActive ? 1 : 0.6)};
  background-color: #ffffff;
  margin-left: 3;
  margin-right: 3;
`;

const MediaHeader = ({ data, selectedMediaIndex }) => (
  <StyledMediaHeader>
    {data.map((ele, index) => (
      <StyledMediaHeaderItem isActive={index === selectedMediaIndex} key={'' + index} />
    ))}
  </StyledMediaHeader>
);

const StyledDetailTitle = styled.Text`
  font-size: ${sizes.middleLargeFontSize};
  color: #282828;
  font-family: ${font.MSemiBold};
`;

const StyledDetailDescription = styled.Text`
  font-size: ${wp('3.05%')};
  color: #565656;
  font-family: ${font.MRegular};
  margin-top: ${sizes.xxsmallPadding};
`;

const DetailSection = props => (
  <StyledWrapper
    width={wp('100%')}
    row
    primary={'space-between'}
    paddingTop={sizes.smallPadding}
    paddingLeft={sizes.smallPadding}
    paddingRight={sizes.smallPadding}
    paddingBottom={sizes.smallPadding}
  >
    <StyledWrapper flex={1}>
      {props.description ? <StyledDetailTitle>{props.description}</StyledDetailTitle> : null}
      <StyledDetailDescription>{props.content}</StyledDetailDescription>
    </StyledWrapper>
    <TimeAgo time={props.time * 1000} style={styles.eventCreatedTime} hideAgo={true} />
  </StyledWrapper>
);

const StyledLikesIconText = styled.Text`
  font-size: ${wp('3.05%')};
  color: #515151;
  font-family: ${font.MMedium};
  margin-left: ${wp('2.22%')};
`;

const LikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.smallIconSize} color={iconColor || '#282828'} />
        <StyledLikesIconText>{count}</StyledLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

const StyledCommentUserAvatar = styled(FastImage)`
  width: ${wp('6.66%')};
  height: ${wp('6.66%')};
  border-radius: ${wp('3.33%')};
`;

const StyledCommentUserName = styled.Text`
  font-size: ${wp('3.33%')};
  color: #282828;
  font-family: ${font.MSemiBold};
`;

const StyledCommentContent = styled.Text`
  font-size: ${wp('3.05%')};
  color: #565656;
  font-family: ${font.MRegular};
`;

const CommentItem = props => {
  const { iUrl, users_name, content, created_at } = props.data;

  return (
    <TouchableWithoutFeedback onLongPress={props.onLongPress}>
      <StyledWrapper
        width={wp('100%')}
        row
        secondary={'center'}
        paddingLeft={sizes.smallPadding}
        paddingRight={sizes.smallPadding}
        paddingTop={sizes.smallPadding}
        paddingBottom={sizes.smallPadding}
      >
        <TouchableWithoutFeedback onPress={props.onPress}>
          <StyledCommentUserAvatar source={{ uri: iUrl }} />
        </TouchableWithoutFeedback>
        <StyledWrapper flex={1} marginLeft={sizes.smallPadding}>
          <StyledWrapper width={'100%'} row primary={'space-between'}>
            <StyledCommentUserName>{users_name}</StyledCommentUserName>
            <TimeAgo time={created_at * 1000} style={styles.commentHeaderTimeAgo} hideAgo={true} />
          </StyledWrapper>
          <StyledCommentContent>{content}</StyledCommentContent>
        </StyledWrapper>
      </StyledWrapper>
    </TouchableWithoutFeedback>
  );
};

const StyledCommentInput = styled.TextInput`
  width: 100%;
  height: ${hp('5%')};
  border-radius: ${hp('2.5%')};
  padding-left: ${wp('4.5%')};
  padding-right: ${wp('4.5%')};
  /* padding-top: ${sizes.smallPadding};
  padding-bottom: ${sizes.smallPadding}; */
  background-color: #f5f5f5;
  color: #363636;
  font-family: ${font.MRegular};
  font-size: ${wp('3.05%')};
`;

const StyledSendButton = styled.TouchableOpacity`
  width: ${hp('5%')};
  height: ${hp('5%')};
  border-radius: ${hp('2.5%')};
  background-color: #d5d5d5;
  justify-content: center;
  align-items: center;
`;

const SendButton = props => (
  <StyledSendButton {...props}>
    <CustomIcon name={'PE-Send_20x20px'} size={sizes.smallIconSize} color={!props.isEdit ? '#fefefe' : props.color} />
  </StyledSendButton>
);

const StyledMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: ${wp('2.22%')};
  margin-top: ${sizes.xxsmallPadding};
`;

const StyledMoreText = styled.Text`
  font-size: ${wp('3.33%')};
  font-family: ${font.MMedium};
`;

const MoreButton = props => (
  <StyledMoreButton {...props}>
    <CustomIcon
      name={!props.isMore ? 'expand_more-24px' : 'expand_less-24px'}
      size={sizes.normalIconSize}
      color={props.color}
    />
    <StyledMoreText marginLeft={wp('8.06%')} style={{ color: props.color }}>
      {!props.isMore ? 'More' : 'Less'}
    </StyledMoreText>
  </StyledMoreButton>
);

const StyledEditButton = styled.TouchableOpacity`
  flex-direction: row;
  padding-left: ${sizes.normalPadding};
  padding-right: ${sizes.normalPadding};
  margin-left: ${props => (props.marginLeft === 0 ? 0 : sizes.smallPadding)};
  margin-right: ${sizes.smallPadding};
  height: ${hp('4.8%')};
  border-radius: ${hp('2.9%')};
  border-width: 0.5;
  border-color: #d3d3d3;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
`;

const StyledEidtText = styled.Text`
  font-size: ${wp('3.8%')};
  font-family: ${font.MLight};
  font-weight: 500;
  color: #212121;
  margin-left: ${props => props.marginLeft || 0};
`;

const StyledGradeWrapper = styled.View`
  position: absolute;
  right: ${wp('2.22%')};
  top: ${wp('2.22%')};
`;

const StyledPhotoInfoContainer = styled.View`
  position: absolute;
  width: ${wp('100%')};
  padding-left: ${wp('2.22%')};
  padding-right: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  flex-direction: row;
  justify-content: space-between;
`;

const StyledPhotoAvatarWrapper = styled(FastImage)`
  width: ${wp('7.22%')};
  height: ${wp('7.22%')};
  border-radius: ${wp('3.61%')};
  background-color: ${colors.White};
  justify-content: center;
  align-items: center;
  margin-right: ${sizes.smallPadding};
`;

const StyledPhotoAvatar = styled(FastImage)`
  width: ${wp('6.66%')};
  height: ${wp('6.66%')};
  border-radius: ${wp('3.33%')};
`;

const StyledUserName = styled.Text`
  font-size: ${sizes.normalFontSize};
  color: #ffffff;
  font-family: ${font.MBold};
`;

const StyledPhotoZoomButton = styled.TouchableOpacity`
  width: ${wp('6.94%')};
  height: ${wp('6.94%')};
  border-radius: ${wp('3.47%')};
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  margin-left: ${props => props.marginLeft || 0};
`;

const PhotoZoomButton = props => {
  const { iconName, iconSize, marginLeft } = props;

  return (
    <StyledPhotoZoomButton onPress={props.onPress} marginLeft={marginLeft}>
      <CustomIcon name={iconName || 'Scale_16x16'} size={iconSize || sizes.smallIconSize} color={'#ffffff'} />
    </StyledPhotoZoomButton>
  );
};

const StyledImageWrapper = styled(FastImage)`
  width: 100%;
  height: ${wp('64.4%')};
  border-top-left-radius: 15;
  border-top-right-radius: 15;
`;

const StyledImageView = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
`;

const StyledInfoWrapper = styled.View`
  width: 100%;
  padding-left: ${wp('2.22%')};
  padding-top: ${wp('1.11%')};
  padding-bottom: ${wp('2.5%')};
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  /* justify-content: space-between; */
`;

const StyledButtonWrapper = styled.View`
  position: absolute;
  left: ${wp('2.22%')};
  bottom: ${wp('2.22%')};
  width: ${cardWidth - wp('4.44%')};
  flex-direction: row;
  justify-content: space-between;
`;

const StyledInfoTitle = styled.Text`
  font-size: ${wp('3.33%')};
  line-height: ${wp('4.44%')};
  color: #282828;
  font-family: ${font.MSemiBold};
`;

const StyledInfoDescription = styled.Text`
  font-size: ${wp('3.055%')};
  color: #565656;
  font-family: ${font.MRegular};
  line-height: ${wp('3.888%')};
`;

const StyledEditText = styled.Text`
  font-size: ${wp('2.777%')};
  color: #515151;
  font-family: ${font.MSemiBold};
  margin-left: 6.5;
`;

const StyledEditWrapper = styled.View`
  justify-content: flex-end;
  padding-top: ${wp('2.22%')};
  padding-left: ${wp('1.11%')};
`;

const StyledCommentContainer = styled.View`
  width: ${wp('25.83%')};
  height: ${wp('6.66%')};
  border-radius: ${wp('3.33%')};
  background-color: 'rgba(0,0,0,0.3)';
  flex-direction: row;
  align-items: center;
`;

const StyledCommentWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledCommentText = styled.Text`
  font-size: ${wp('2.77%')};
  font-family: ${font.MSemiBold};
  color: #fefefe;
  margin-left: ${wp('1.18%')};
`;

const UploadComment = props => {
  const { count, iconName, iconSize } = props;

  return (
    <StyledCommentWrapper>
      <CustomIcon name={iconName || 'Comment-Small_12x12px'} size={12} color={'#FEFEFE'} />
      <StyledCommentText>{count}</StyledCommentText>
    </StyledCommentWrapper>
  );
};

const MyUploadCard = props => {
  const {
    data: { title, userId, userPhoto, userName, mediaId, comments, likes, is_liked, is_default, url, video_url },
  } = props;
  const { onPressZoom, description, onEditMedia, onSetDefaultMedia, onDeleteMedia, type, uid, founder_uid } = props;
  const starColor =
    type !== undefined
      ? type === 'event'
        ? theme.orange.icon
        : type === 'station'
        ? theme.blue.icon
        : theme.cyan.icon
      : theme.orange.icon;
  return (
    <View style={styles.uploadCard}>
      <StyledImageWrapper>
        <StyledImageView source={{ uri: url }} />
        <StyledButtonWrapper>
          <StyledCommentContainer>
            <UploadComment count={likes} iconName={'Love-Small_12x12px'} />
            <StyledSeparator width={1} height={wp('3.33%')} bgColor={'#F7FDFF'} opacity={0.6} />
            <UploadComment count={comments.length} />
          </StyledCommentContainer>
          <StyledWrapper row>
            {uid === founder_uid && (
              <PhotoZoomButton onPress={() => onSetDefaultMedia(props.data)} iconName={'grade-24px'} iconSize={18} />
            )}
            <PhotoZoomButton onPress={onPressZoom} marginLeft={wp('2.22%')} />
            <PhotoZoomButton
              onPress={() => onDeleteMedia(props.data)}
              iconName={'Delete_16x16'}
              iconSize={18}
              marginLeft={wp('2.22%')}
            />
          </StyledWrapper>
        </StyledButtonWrapper>
      </StyledImageWrapper>
      <StyledGradeWrapper>
        {is_default !== undefined && is_default === 1 ? (
          <CustomIcon name={'grade-24px'} size={sizes.largeIconSize} color={starColor} />
        ) : null}
      </StyledGradeWrapper>

      <StyledInfoWrapper>
        {title ? <StyledInfoTitle>{title}</StyledInfoTitle> : null}
        {description ? <StyledInfoDescription>{description}</StyledInfoDescription> : null}
        <StyledEditWrapper>
          <StyledWrapper>
            <StyledButton onPress={() => onEditMedia(props.data)}>
              <StyledWrapper row secondary={'center'}>
                <CustomIcon name={'Edit_16x16'} size={13} color={'#282828'} />
                <StyledEditText>{'Edit'}</StyledEditText>
              </StyledWrapper>
            </StyledButton>
          </StyledWrapper>
        </StyledEditWrapper>
      </StyledInfoWrapper>
    </View>
  );
};

// const MyUploadItem = props => {
//   const {
//     title,
//     userId,
//     userPhoto,
//     userName,
//     mediaId,
//     comments,
//     likes,
//     is_liked,
//     is_default,
//     url,
//     video_url,
//   } = props.data;
//   const { onPressZoom, description, onEditMedia, onSetDefaultMedia, onDeleteMedia } = props;
//   return (
//     <View style={{ paddingBottom: 10 }}>
//       <StyledWrapper>
//         <ProgressiveImage width={wp('100%')} height={wp('100%')} source={{ uri: url }} />
//         <StyledGradeWrapper>
//           {is_default !== undefined && is_default === 1 ? (
//             <CustomIcon name={'grade-24px'} size={sizes.largeIconSize} color={'#fe847c'} />
//           ) : null}
//         </StyledGradeWrapper>
//         <StyledPhotoInfoContainer>
//           <StyledWrapper row secondary={'center'}>
//             <StyledPhotoAvatarWrapper>
//               <StyledPhotoAvatar source={{ uri: userPhoto }} />
//             </StyledPhotoAvatarWrapper>
//             <StyledUserName>{userName}</StyledUserName>
//           </StyledWrapper>

//           <StyledWrapper row>
//             {/* <PhotoZoomButton iconName={'more_horiz-24px'} /> */}
//             <PhotoZoomButton onPress={onPressZoom} />
//           </StyledWrapper>
//         </StyledPhotoInfoContainer>
//       </StyledWrapper>
//       <DetailSection description={description} content={title} />
//       <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 20 }}>
//         <EditButton
//           onPress={() => onEditMedia(props.data)}
//           iconName={'PE-Edit_20x20px'}
//           buttonText={'Edit'}
//           marginLeft={0}
//         />
//         <EditButton onPress={() => onSetDefaultMedia(mediaId)} buttonText={'Set Default'} />
//         <EditButton onPress={() => onDeleteMedia(mediaId)} buttonText={'Delete'} />
//       </View>
//     </View>
//   );
// };

// const EditButton = props => (
//   <StyledEditButton {...props}>
//     {props.iconName ? <CustomIcon name={props.iconName} size={12} color={'#ff8e77'} /> : null}
//     <StyledEidtText marginLeft={props.iconName && 10}>{props.buttonText}</StyledEidtText>
//   </StyledEditButton>
// );

const ViewMedia = props => {
  const {
    mediaData,
    description,
    selectedEntryIndex,
    onChangeSelectedEntryIndex,
    onToggleZoomModal,
    onTogglePhotoMoreModal,
    onSendComment,
    onChangeFilterOption,
    selectedFilter,
    onEditMedia,
    onSetDefaultMedia,
    onDeleteMedia,
    onLikeEvent,
    refer,
    onActivity,
    optionsData,
    type,
    onRefresh,
    isRefresh = false,
    onPressCommentAvtar,
    uid,
    founder_uid,
    paused,
    onChangePaused,
    onLongPressComment,
  } = props;

  // Data for selected carousel
  const selectedCarouselData = mediaData[selectedEntryIndex];
  const [comment, setComment] = useState('');
  const [isMore, setIsMore] = useState(false);
  const changeComment = useCallback(text => {
    setComment(text);
  }, []);
  const toggleMore = useCallback(text => {
    setIsMore(prevState => !prevState);
  }, []);
  const onSnapToItem = useCallback(
    slideIndex => {
      onChangeSelectedEntryIndex(slideIndex);
      setIsMore(false);
    },
    [onChangeSelectedEntryIndex]
  );
  const onLike = useCallback(() => {
    onLikeEvent(selectedCarouselData);
  }, [onLikeEvent, selectedCarouselData]);
  let newOptionData = optionsData.filter(item => item.value !== 'uploads');

  const savedFilterId = newOptionData.findIndex(item => item.value === selectedFilter);
  const sendButtonColor =
    type !== undefined
      ? type === 'event'
        ? theme.orange.icon
        : type === 'station'
        ? theme.blue.icon
        : theme.cyan.icon
      : theme.orange.icon;
  return (
    <>
      <StyledSeparator bgColor={'#000'} opacity={0.18} height={0.5} />
      {/** Filter section */}
      <ExperienceFilter
        optionsData={newOptionData}
        savedFilterId={savedFilterId}
        onChangeFilterOption={onChangeFilterOption}
        textColor={'#515151'}
        iconColor={'#b8b8b8'}
        isSeparatorExisted={true}
      />
      <StyledScroll
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        backgroundColor={selectedFilter !== 'uploads' ? '#fff' : '#d8d8d8'}
        extraScrollHeight={hp('2%')}
        contentContainerStyle={{ paddingBottom: hp('3%') }}
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
        {/** Media carousel */}
        {selectedFilter !== 'uploads' ? (
          <>
            <StyledWrapper>
              <Carousel
                ref={refer}
                data={mediaData}
                renderItem={({ item, index }) => (
                  <PhotoCarouseItem
                    data={item}
                    type={type}
                    onPressZoom={onToggleZoomModal}
                    onPressMore={onTogglePhotoMoreModal}
                    index={index}
                    selectedEntryIndex={selectedEntryIndex}
                    paused={paused}
                    onChangePaused={onChangePaused}
                    selectedFilter={selectedFilter}
                  />
                )}
                sliderWidth={wp('100%')}
                itemWidth={wp('100%')}
                activeSlideAlignment={'center'}
                // firstItem={selectedEntryIndex}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                removeClippedSubviews={false}
                onSnapToItem={onSnapToItem}
              />
              {mediaData.length > 1 ? <MediaHeader data={mediaData} selectedMediaIndex={selectedEntryIndex} /> : null}
            </StyledWrapper>

            {mediaData.length > 0 ? (
              <>
                <DetailSection
                  description={selectedCarouselData.title}
                  // content={description}
                  content={''}
                  time={selectedCarouselData.created_at}
                />
                <StyledWrapper row paddingLeft={sizes.smallPadding}>
                  <LikesIconDetail iconName={'love-big_16x16'} count={selectedCarouselData.likes} onPress={onLike} />
                  <LikesIconDetail
                    disabled
                    iconName={'comments-big_16x16'}
                    count={selectedCarouselData.comments.length}
                    marginLeft={wp('7.78%')}
                  />
                  <LikesIconDetail
                    iconName={'Activity_16x16'}
                    count={'Activity'}
                    marginLeft={wp('7.78%')}
                    onPress={() => {
                      if (onActivity) {
                        onActivity(selectedCarouselData);
                      }
                    }}
                  />
                </StyledWrapper>
                {selectedCarouselData.comments !== undefined && selectedCarouselData.comments.length > 0 ? (
                  <StyledWrapper marginTop={sizes.smallPadding}>
                    <FlatList
                      data={
                        !isMore
                          ? selectedCarouselData.comments.slice(
                              selectedCarouselData.comments.length > 3 ? selectedCarouselData.comments.length - 3 : 0
                            )
                          : selectedCarouselData.comments
                      }
                      renderItem={({ item, index }) => (
                        <CommentItem
                          data={item}
                          onPress={() => onPressCommentAvtar(item.userID)}
                          onLongPress={() => onLongPressComment(item)}
                        />
                      )}
                      keyExtractor={(item, index) => '' + index}
                      inverted={true}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                      ListHeaderComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                      ListFooterComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                    />
                  </StyledWrapper>
                ) : null}

                {selectedCarouselData.comments !== undefined && selectedCarouselData.comments.length > 3 ? (
                  <StyledWrapper>
                    <MoreButton isMore={isMore} onPress={toggleMore} color={sendButtonColor} />
                  </StyledWrapper>
                ) : null}
                <View style={styles.commentContainer}>
                  <TextInput
                    placeholder={'Say Something…'}
                    placeholderTextColor={'#363636'}
                    value={comment}
                    onChangeText={changeComment}
                    scrollEnabled={false}
                    style={styles.commentTextStyle}
                    multiline={true}
                  />
                  <SendButton
                    isEdit={!!comment}
                    onPress={() => onSendComment(comment, selectedCarouselData, changeComment)}
                    color={sendButtonColor}
                  />
                </View>
              </>
            ) : null}
          </>
        ) : (
          <StyledWrapper marginTop={wp('2.22%')} paddingBottom={wp('8.33%')}>
            <FlatList
              data={mediaData}
              renderItem={({ item, index }) => {
                return (
                  // <MyUploadItem
                  //   data={item}
                  //   description={description}
                  //   onPressZoom={() => {
                  //     onToggleZoomModal();
                  //     onChangeSelectedEntryIndex(index);
                  //   }}
                  //   onEditMedia={onEditMedia}
                  //   onSetDefaultMedia={onSetDefaultMedia}
                  //   onDeleteMedia={onDeleteMedia}
                  // />
                  <MyUploadCard
                    data={item}
                    description={description}
                    onPressZoom={() => {
                      onToggleZoomModal();
                      onChangeSelectedEntryIndex(index);
                    }}
                    type={type}
                    onEditMedia={onEditMedia}
                    onSetDefaultMedia={onSetDefaultMedia}
                    onDeleteMedia={onDeleteMedia}
                    uid={uid}
                    founder_uid={founder_uid}
                  />
                );
              }}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
            />
          </StyledWrapper>
        )}
      </StyledScroll>
    </>
  );
};

const styles = StyleSheet.create({
  commentHeaderTimeAgo: {
    fontSize: wp('3.03%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#b8b8b8',
  },
  uploadCard: {
    width: cardWidth,
    // height: wp('86.67%'),
    backgroundColor: 'white',
    borderRadius: 15,
    borderBottomWidth: 0,
    shadowColor: 'rgb(90,97,105)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 1,
    marginLeft: wp('2.22%'),
    marginBottom: wp('2.22%'),
  },
  eventCreatedTime: {
    fontSize: wp('3.03%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#b8b8b8',
  },
  commentContainer: {
    paddingLeft: wp('4.5%'),
    marginHorizontal: sizes.smallPadding,
    paddingBottom: wp('1%'),
    backgroundColor: '#f5f5f5',
    borderRadius: hp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sizes.smallPadding,
  },
  commentTextStyle: {
    flex: 1,
    fontSize: wp('3.05%'),
    fontFamily: font.MRegular,
    marginRight: wp('2%'),
    color: '#363636',
    padding: 0,
  },
});

export default ViewMedia;
