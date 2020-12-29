import React, { Component } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CachedImage } from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import moment from 'moment';
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector';
import { isIphoneX } from 'react-native-iphone-x-helper';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import theme from '../../../core/theme';
import { StyledText, StyledButton } from '../../../core/common.styles';
import { connect } from 'react-redux';
import ExperienceActions from '../../reducers/event';
import { createStructuredSelector } from 'reselect';
import { selectAuth } from '../../../auth/reducers';
import { selectEventData } from '../../reducers/event';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledHorizontalContainer, StyledWrapper } from '../../../core/common.styles';
const { images, colors, font, gradients, sizes } = theme;

const StyledPageHeader = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: ${hp('2%')};
`;

const StyledCardView = styled.View`
  background-color: ${colors.White};
  border-radius: 21;
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.23);
  elevation: 10;
  margin-bottom: ${props => props.marginBottom || 20};
  margin-left: ${props => props.marginLeft || 15};
  margin-top: ${props => props.marginTop || 20};
  margin-right: ${props => props.marginRight || 15};
`;

const StyleCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyleCardHeaderImage = styled.Image`
  width: 42;
  height: 42;
  border-radius: 21;
  resize-mode: cover;
`;

const StyleUsername = styled.Text`
  padding-top: 2;
  padding-bottom: 2;
  padding-right: 2;
  text-align-vertical: center;
  margin-left: 5;
  color: #212121;
  font-size: ${wp('4.0%')};
  font-weight: 600;
`;

const StyledTimeStamp = styled.Text`
  padding-top: 2;
  padding-bottom: 2;
  padding-right: 2;
  text-align-vertical: center;
  margin-left: 5;
  color: #8f8f8f;
`;

const StyledCardImage = styled.Image`
  width: 100%;
  height: ${props => props.height || 480};
  border-top-right-radius: ${props => props.borderTopRightRadius || 0};
  border-top-left-radius: ${props => props.borderTopLeftRadius || 0};
`;

const StyledRow = styled.View`
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
`;

const StyledPostFooterWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledTextContainer = styled.View`
  max-width: ${wp('70%')};
  padding-top: 10;
  padding-right: 10;
  padding-left: 10;
  padding-bottom: 10;
`;

const StyledShareEventContainer = styled.TouchableOpacity`
  height: ${hp('5%')};
  border-radius: 20;
  background-color: ${colors.White};
  margin-top: ${hp('1.5%')};
  margin-bottom: ${hp('1.5%')};
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const StyledPostTitle = styled.Text`
  padding-right: ${wp('1.3%')};
  padding-left: ${wp('1.3%')};
  padding-bottom: ${wp('1.3%')};
  padding-top: ${wp('1.3%')};
  font-size: 14;
  width: ${wp('70%')};
  color: #212121;
  line-height: 18;
  font-weight: 600;
  font-family: ${font.MLight};
`;

const StyledUserNameText = styled.Text`
  font-size: ${hp('2.2%')};
  color: #000000;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-left: ${wp('3.33%')};
`;

const StyledPostBody = styled.Text`
  padding-left: ${wp('1.3%')};
  color: #626262;
  font-weight: 500;
`;

const StyledStatWrapper = styled.View`
  border-bottom-right-radius: 23;
  border-left-width: 1;
  border-left-color: #999ba1;
`;

const StyledEmoji = styled.Text`
  padding-left: ${wp('2.3%')};
  padding-right: ${wp('1.0%')};
  padding-top: ${wp('2.3%')};
  padding-bottom: ${wp('2.3%')};
`;

const StyledCount = styled.Text`
  padding-left: ${wp('1.3%')};
  padding-top: ${wp('2.3%')};
  padding-bottom: ${wp('2.3%')};
  padding-right: ${wp('3.3%')};
  font-weight: bold;
  color: #212121;
`;

const StyledReactionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 5;
  padding-right: 5;
  padding-top: 5;
  padding-bottom: 5;
`;

const StyledDivider = styled.View`
  width: 100%;
  height: 1;
  background-color: #999ba1;
  align-self: center;
`;

const StyledHeaderWrapper = styled.View`
  flex: 1;
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
  height: ${hp('7%')};
`;

const StyledHeaderOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const StyledContentWrapper = styled.View`
  flex: 1;
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: ${props => props.height / 2 || 0};
`;

const StyledGradientButton = styled.TouchableOpacity`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: ${props => props.marginLeft || 0};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.02);
`;

const StyledUserAvatarWrapper = styled.View`
  width: ${hp('4.9%')};
  height: ${hp('4.9%')};
  border-radius: ${hp('3.45%')};
  justify-content: center;
  align-items: center;
  padding: 2px 2px 2px 2px;
  border-color: #fe7f7e;
  border-width: ${wp('0.2%')};
`;

const MoreIconButton = props => (
  <StyledButton {...props}>
    <CustomIcon name={'more_horiz-24px'} size={36} color={'#626262'} />
  </StyledButton>
);

const GradientButton = ({ width, height, onPress, children, isActive, marginLeft }) => {
  return (
    <StyledGradientButton marginLeft={marginLeft} width={width} height={height} onPress={onPress} disabled={!isActive}>
      <StyledButtonOverlay
        height={height}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isActive ? gradients.Background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
      />

      {children}
    </StyledGradientButton>
  );
};

const StyledModalBodyWrapper = styled.View`
  background-color: ${colors.White};
  padding-top: 20;
  padding-right: 20;
  padding-bottom: 20;
  padding-left: 20;
  border-radius: 10;
`;

const StyledModalHeader = styled.Text`
  text-align: center;
  font-size: 20;
  font-weight: 600;
  color: rgb(167, 167, 167);
`;

const StyledTextInput = styled.TextInput`
  border-bottom-width: 1;
  border-bottom-color: rgb(167, 167, 167);
  padding-top: 5;
  padding-right: 5;
  padding-bottom: 5;
  padding-left: 5;
  margin-top: 20;
  margin-bottom: 10;
  width: ${wp('72%')};
  align-self: center;
  color: rgb(167, 167, 167);
`;

const Header = () => (
  <StyledHeader>
    <StyledHeaderOverlay start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={gradients.Background} />
  </StyledHeader>
);

const StyledLikesIconText = styled.Text`
  font-size: ${sizes.middleFontSize};
  color: #515151;
  font-family: ${font.MSemiBold};
  margin-left: ${sizes.smallPadding};
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

const PostFooter = data => {
  return (
    <StyledPostFooterWrapper>
      <StyledTextContainer>
        <StyledPostTitle>Wow! Amazing event</StyledPostTitle>
        <StyledPostBody>It was awesome, I totally love to spend time with friends</StyledPostBody>
      </StyledTextContainer>
      <StyledStatWrapper>
        <StyledReactionWrapper>
          {/* <StyledEmoji>🔥</StyledEmoji>
          <StyledCount>47</StyledCount> */}
          <LikesIconDetail iconName={'love-big_16x16'} count={47} disabled />
        </StyledReactionWrapper>
        <StyledDivider />
        <StyledReactionWrapper>
          {/* <StyledEmoji> 💬</StyledEmoji>
          <StyledCount>27</StyledCount> */}
          <LikesIconDetail iconName={'comments-big_16x16'} count={27} disabled />
        </StyledReactionWrapper>
      </StyledStatWrapper>
    </StyledPostFooterWrapper>
  );
};

const TrendingFeed = props => {
  const { item } = props;

  return (
    <StyledCardView>
      <StyleCardHeader>
        <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={6} paddingTop={10}>
          <StyleCardHeaderImage source={item.avatar} />
          <StyledRow flexDirection={'column'}>
            <StyleUsername>{item.name}</StyleUsername>
            <StyledTimeStamp>3 min</StyledTimeStamp>
          </StyledRow>
        </StyledRow>

        <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={10} paddingTop={10}>
          {
            //   <CustomIcon
            //   name={'bookmark_border-24px'}
            //   size={30}
            //   color={'#626262'}
            // />
          }
          <CustomIcon name={'more_horiz-24px'} size={30} color={'#626262'} />
        </StyledRow>
      </StyleCardHeader>
      <StyledCardImage source={item.photo} />
      <PostFooter data={item} />
    </StyledCardView>
  );
};

const UploadsItem = props => {
  const { item } = props;

  return (
    <StyledCardView>
      <StyledCardImage source={item.photo} borderTopRightRadius={20} borderTopLeftRadius={20} height={hp('40%')} />
      <PostFooter data={item} />
    </StyledCardView>
  );
};

const StyledReportInput = styled.TextInput`
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-left: ${wp('2%')};
  margin-right: ${hp('2%')};
  margin-bottom: ${hp('1%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
`;

const StyledEditButtonWrapper = styled.View`
  flex: 1;
`;

const StyledEditButton = styled.TouchableOpacity`
  flex-direction: row;
  padding-left: 10;
  padding-right: 10;
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

const EditButton = props => (
  <StyledEditButton {...props}>
    {props.iconName ? <CustomIcon name={props.iconName} size={12} color={'#ff8e77'} /> : null}
    <StyledEidtText marginLeft={props.iconName && 10}>{props.buttonText}</StyledEidtText>
  </StyledEditButton>
);

class EventMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      selectedIndex: 0,
      isModalVisible: false,
      reportDescription: '',
      isEditMediaModalVisible: false,
      mediaTitle: '',
      editMediaItem: null,
    };

    this.moreList = [
      {
        key: 0,
        label: 'Report Media',
      },
    ];

    this.childID = this.props.navigation.getParam('childID', 'default');
    this.parentID = this.props.navigation.getParam('parentID', 'default');
  }

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  toggleReportModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onSubmitReport = async () => {
    this.setState({ loading: true });
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parent_id', this.parentID);
    obj.append('child_id', this.child_ID);
    obj.append('message', this.state.reportDescription);
    obj.append('type', 'event');

    await this.props.onReportEvent(obj);
    this.toggleReportModal();
    this.setState({ loading: false });
  };

  reportModalView = () => (
    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>
      <StyledModalBodyWrapper>
        <StyledModalHeader>Report Media</StyledModalHeader>
        <StyledReportInput
          placeholder="Report description"
          placeholderTextColor={'rgb(167, 167, 167)'}
          numberOfLines={10}
          multiline={true}
          onChangeText={text =>
            this.setState({
              reportDescription: text,
            })
          }
          value={this.state.reportDescription}
        />

        <GradientButton
          width={wp('72%')}
          height={hp('3.9%')}
          marginLeft={wp('4.5%')}
          onPress={() => {
            this.onSubmitReport();
          }}
          isActive={this.state.reportDescription}
        >
          {!this.state.loading ? (
            <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
              {'Submit'}
            </StyledText>
          ) : (
            <ActivityIndicator size="small" color="black" style={styles.activityIndicator} />
          )}
        </GradientButton>
      </StyledModalBodyWrapper>
    </Modal>
  );

  onSelectMoreData = (option, item) => {
    if (option.label === 'Leave Event') {
      const eventObj = new FormData();
      eventObj.append('token', this.props.auth.access_token);
      eventObj.append('_method', 'PUT');
      eventObj.append('parentID', this.parentID);
      eventObj.append('childID', this.childID);
      let obj = {
        formData: eventObj,
        leaveEventSuccess: () => {},
        leaveEventFailure: () => {},
      };
      this.props.onLeaveEvent(obj);
      this.props.navigation.navigate('Trending');
    }

    if (this.props.auth.uid !== item.userId) {
      if (option.label === 'Report Media') {
        this.toggleReportModal();
      }
    }

    if (option.label === 'My Privacy') {
      // this.setState({
      //   isPrivayModalVisible: true,
      // });
    }
  };

  mediaOption = item => {
    const moreOptions = [];
    if (this.props.auth.uid !== item.userId) {
      moreOptions.push({
        key: 0,
        label: 'Report Media',
      });
    }
    return moreOptions;
  };

  onShowMoreList = () => {
    this.selector.open();
  };

  _trendingFeed = item => {
    return (
      <StyledCardView>
        <StyleCardHeader>
          <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={6} paddingTop={10}>
            <StyledUserAvatarWrapper>
              <CachedImage
                component={Image}
                indicator={ActivityIndicator}
                style={styles.cardHeaderImage}
                source={{ uri: item.userPhoto }}
              />
            </StyledUserAvatarWrapper>
            <StyledRow flexDirection={'column'}>
              <StyleUsername>{item.userName}</StyleUsername>
              <StyledTimeStamp>{moment.unix(item.created_at).fromNow(true)}</StyledTimeStamp>
            </StyledRow>
          </StyledRow>

          <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={10} paddingTop={10}>
            {/* <CustomIcon name={'bookmark_border-24px'} size={30} color={'#626262'} /> */}
            {/* More icon button */}
            {this.props.auth.uid !== item.userId ? (
              <ModalSelector
                data={this.mediaOption(item)}
                onChange={option => this.onSelectMoreData(option, item)}
                ref={selector => {
                  this.selector = selector;
                }}
                customSelector={<MoreIconButton onPress={this.onShowMoreList} />}
                cancelText={'Cancel'}
                overlayStyle={styles.overlayStyle}
                optionContainerStyle={styles.optionContainerStyle}
                optionStyle={styles.optionStyle}
                optionTextStyle={styles.optionTextStyle}
                sectionStyle={styles.sectionStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
              />
            ) : null}
          </StyledRow>
        </StyleCardHeader>

        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navigation.navigate('ViewMediaEvent', {
              data: item,
              type: 'trending',
              childID: this.childID,
              parentID: this.parentID,
            })
          }
        >
          <CachedImage
            component={Image}
            indicator={ActivityIndicator}
            resizeMode={'cover'}
            style={styles.trendingImage}
            source={{ uri: item.url }}
          />
        </TouchableWithoutFeedback>

        <StyledPostFooterWrapper>
          <StyledTextContainer>
            <StyledPostTitle>{item.title}</StyledPostTitle>
            {
              // <StyledPostBody>
              //   It was awesome, I totally love to spend time with friends
              // </StyledPostBody>
            }
          </StyledTextContainer>
          <StyledStatWrapper>
            <StyledReactionWrapper>
              <StyledEmoji>🔥</StyledEmoji>
              <StyledCount>{item.likes}</StyledCount>
            </StyledReactionWrapper>
            <StyledDivider />
            <StyledReactionWrapper>
              <StyledEmoji> 💬</StyledEmoji>
              <StyledCount>{item.comments && item.comments.length}</StyledCount>
            </StyledReactionWrapper>
          </StyledStatWrapper>
        </StyledPostFooterWrapper>
      </StyledCardView>
    );
  };

  renderTrending() {
    const { trending, my_experience } = this.props.event_data[0];
    return (
      <FlatList
        data={trending}
        renderItem={({ item, index }) => this._trendingFeed(item)}
        keyExtractor={(item, index) => '' + index}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  editMediaModalView = () => (
    <Modal
      isVisible={this.state.isEditMediaModalVisible}
      onBackdropPress={() => this.setState({ isEditMediaModalVisible: false })}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <TouchableOpacity
          style={{ right: 20, top: 36, position: 'absolute' }}
          onPress={() => this.setState({ isEditMediaModalVisible: false })}
        >
          <CustomIcon name={'Close_16x16px'} size={24} color={'white'} />
        </TouchableOpacity>
        <StyledModalBodyWrapper>
          <StyledModalHeader>Update Media Title</StyledModalHeader>
          <StyledReportInput
            placeholder="Title"
            placeholderTextColor={'rgb(167, 167, 167)'}
            numberOfLines={10}
            multiline={true}
            onChangeText={text =>
              this.setState({
                mediaTitle: text,
              })
            }
            value={this.state.mediaTitle}
            // value={this.state.editMediaItem !== null ? this.state.editMediaItem.title : this.state.mediaTitle}
          />

          <GradientButton
            width={wp('72%')}
            height={hp('3.9%')}
            marginLeft={wp('4.5%')}
            onPress={() => {
              // this.onSubmitReport();
              if (this.props.event_data.length > 0) {
                const obj = {
                  title: this.state.mediaTitle,
                  parentID: this.props.event_data[0].parentID,
                  childID: this.props.event_data[0].child_ID,
                  mediaID: this.state.editMediaItem.mediaId,
                  token: this.props.auth.access_token,
                  _method: 'PUT',
                };
                this.props.onEditMedia(obj);
                this.setState({ isEditMediaModalVisible: false, mediaTitle: '' });
              }
            }}
            isActive={this.state.mediaTitle}
          >
            {!this.state.loading ? (
              <StyledText fontSize={hp('1.7%')} color={colors.White} fontFamily={font.MMedium} fontWeight={'500'}>
                {'Submit'}
              </StyledText>
            ) : (
              <ActivityIndicator size="small" color="black" style={styles.activityIndicator} />
            )}
          </GradientButton>
        </StyledModalBodyWrapper>
      </KeyboardAwareScrollView>
    </Modal>
  );

  uploadsItem = item => {
    return (
      <StyledCardView>
        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navigation.navigate('ViewMediaEvent', {
              data: item,
              type: 'myupload',
              childID: this.childID,
              parentID: this.parentID,
            })
          }
        >
          <View>
            <CachedImage
              component={Image}
              indicator={ActivityIndicator}
              resizeMode={'cover'}
              style={styles.uploadsImage}
              source={{ uri: item.url }}
            />
            <View
              style={{
                position: 'absolute',
                right: wp('2.22%'),
                top: wp('2.22%'),
              }}
            >
              {item.is_default !== undefined && item.is_default === 1 ? (
                <CustomIcon name={'grade-24px'} size={28} color={'#fe847c'} />
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>

        <StyledHorizontalContainer justifyContent="space-between">
          <StyledEditButtonWrapper>
            <StyledTextContainer>
              <StyledPostTitle>{item.title}</StyledPostTitle>
            </StyledTextContainer>

            <StyledHorizontalContainer
              justifyContent="space-between"
              paddingLeft={10}
              paddingRight={10}
              paddingBottom={5}
            >
              <EditButton
                iconName={'PE-Edit_20x20px'}
                buttonText={'Edit'}
                onPress={() => {
                  this.setState({ editMediaItem: item }, () => {
                    this.setState({ isEditMediaModalVisible: true, mediaTitle: item.title });
                  });
                }}
              />
              <EditButton
                buttonText={'Set Default'}
                onPress={() => {
                  if (this.props.event_data.length > 0) {
                    const obj = {
                      parentID: this.props.event_data[0].parentID,
                      childID: this.props.event_data[0].child_ID,
                      mediaID: item.mediaId,
                      userID: this.props.auth.uid,
                      token: this.props.auth.access_token,
                      _method: 'PUT',
                    };
                    this.props.onSetDefaultMedia(obj);
                  }
                }}
              />
              <EditButton
                buttonText={'Delete'}
                onPress={() => {
                  Alert.alert('Delete Media', 'Are you want to sure delete media!', [
                    { text: 'Dismiss', onPress: () => {} },
                    {
                      text: 'OK',
                      onPress: () => {
                        if (this.props.event_data.length > 0) {
                          const obj = {
                            mediaID: item.mediaId,
                            parentID: this.props.event_data[0].parentID,
                            childID: this.props.event_data[0].child_ID,
                            token: this.props.auth.access_token,
                            _method: 'DELETE',
                            userID: item.userId,
                          };
                          this.props.onDeleteMedia(obj);
                        }
                      },
                    },
                  ]);
                }}
              />
            </StyledHorizontalContainer>
          </StyledEditButtonWrapper>
          <StyledStatWrapper>
            <StyledReactionWrapper>
              <StyledEmoji>🔥</StyledEmoji>
              <StyledCount>{item.likes}</StyledCount>
            </StyledReactionWrapper>
            <StyledDivider />
            <StyledReactionWrapper>
              <StyledEmoji> 💬</StyledEmoji>
              <StyledCount>{item.comments !== undefined ? item.comments.length : 0}</StyledCount>
            </StyledReactionWrapper>
          </StyledStatWrapper>
        </StyledHorizontalContainer>
      </StyledCardView>
    );
  };

  renderUploads() {
    const { trending, my_experience } = this.props.event_data[0];
    return (
      <FlatList
        data={my_experience}
        renderItem={({ item, index }) => this.uploadsItem(item)}
        keyExtractor={(item, index) => '' + index}
        showsVerticalScrollIndicator={false}
      />
    );
  }
  render() {
    const parent_id = this.props.navigation.getParam('parentID', 'default');
    const child_id = this.props.navigation.getParam('childID', 'default');
    const { userData } = this.state;

    return (
      <StyledContentWrapper>
        <Header />
        <StyledPageHeader>
          <CustomIcon
            name={'keyboard_arrow_left-24px'}
            size={38}
            color={'#626262'}
            onPress={() => this.props.navigation.goBack()}
          />
          <StyledHeaderWrapper>
            <StyledText
              textAlign={'center'}
              color={'#fe8879'}
              fontSize={hp('2.5%')}
              fontFamily={font.MMedium}
              fontWeight={'500'}
              alignSelf={'center'}
            >
              {'Event Media'}
            </StyledText>
          </StyledHeaderWrapper>
        </StyledPageHeader>
        <SegmentedControlTab
          values={['Trending', 'My Uploads']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
          tabsContainerStyle={styles.tabsContainerStyle}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
        />
        {this.state.selectedIndex === 0 && this.renderTrending()}
        {this.state.selectedIndex === 1 && this.renderUploads()}
        {this.reportModalView()}
        {this.editMediaModalView()}
      </StyledContentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  tabsContainerStyle: {
    height: 50,
    backgroundColor: '#F2F2F2',
  },
  tabStyle: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  activeTabStyle: {
    backgroundColor: 'white',
    borderBottomColor: '#45D8BF',
    borderBottomWidth: 3,
    borderTopColor: colors.White,
    borderTopWidth: 0,
  },
  tabTextStyle: {
    color: '#888888',
    fontWeight: 'bold',
    borderBottomColor: '#45D8BF',
    borderBottomWidth: 3,
  },
  activeTabTextStyle: {
    color: '#444444',
  },
  trendingImage: {
    width: '100%',
    height: hp('50.25%'),
  },
  uploadsImage: {
    width: '100%',
    height: hp('40.25%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardHeaderImage: {
    width: hp('4.25%'),
    height: hp('4.25%'),
    borderRadius: hp('3.125%'),
  },
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  optionContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  optionStyle: {
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
  },
  cancelStyle: {
    backgroundColor: 'white',
    height: hp('8%'),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTextStyle: {
    fontSize: hp('2.27%'),
    color: '#007aff',
    fontFamily: font.MSemiBold,
  },
  sectionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTextStyle: {
    fontSize: hp('2%'),
    color: '#8f8f8f',
    fontFamily: font.MMedium,
  },
});

const mapStateToProps = createStructuredSelector({
  auth: selectAuth,
  event_data: selectEventData,
});

const mapDispatchToProps = dispatch => {
  return {
    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
    onSetDefaultMedia: obj => {
      dispatch(ExperienceActions.setDefaultMedia(obj));
    },
    onEditMedia: obj => {
      dispatch(ExperienceActions.editMedia(obj));
    },
    onDeleteMedia: obj => {
      dispatch(ExperienceActions.deleteMedia(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventMedia);
