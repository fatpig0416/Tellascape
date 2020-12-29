import React, { Component } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CachedImage } from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector';
import theme from '../../../core/theme';
import { StyledButton, StyledHorizontalContainer, StyledText } from '../../../core/common.styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import ExperienceActions from '../../reducers/event/index';
import { createStructuredSelector } from 'reselect';
import { selectAuth } from '../../../auth/reducers';
import { selectEventData } from '../../reducers/event';
const { colors, font, gradients } = theme;
import MediaView from '../organisms/MediaView';

const StyledCardView = styled.View`
  background-color: ${colors.White};
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.23);
  elevation: 1;
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
  margin-top: ${props => props.marginTop || 0};
  margin-right: ${props => props.marginRight || 0};
`;

const StyleCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledCardImage = styled.Image`
  width: 100%;
  height: ${props => props.height || 280};
  border-top-right-radius: ${props => props.borderTopRightRadius || 0};
  border-top-left-radius: ${props => props.borderTopLeftRadius || 0};
`;

const StyledPostFooterWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledTextContainer = styled.View`
  max-width: ${wp('70%')};
  padding-top: ${wp('5%')};
  padding-right: ${wp('10%')};
  padding-left: ${wp('10%')};
  padding-bottom: ${wp('5%')};
`;

const StyledPostTitle = styled.Text`
    padding-right: ${wp('0.3%')}
    padding-left: ${wp('0%')}
    padding-bottom: ${wp('0.3%')}
    padding-top: ${wp('1.3%')}
    width: ${wp('70%')};
    font-size: 13;
    color: #212121;
    line-height: 18;
    font-weight: 600;
    font-family: ${font.MLight};
`;

const StyledPostBody = styled.Text`
    padding-left: ${wp('1.3%')}
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
  padding-left: ${wp('2.3%')};
  padding-top: ${wp('2.3%')};
  padding-bottom: ${wp('2.3%')};
  padding-right: ${wp('3.3%')};
  font-weight: bold;
  color: #212121;
`;

const StyledReactionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${wp('1.0%')};
  padding-right: ${wp('1.0%')};
  padding-top: ${wp('1.0%')};
  padding-bottom: ${wp('1.0%')};
`;

const StyledDivider = styled.View`
  width: 100%;
  height: ${wp('0.1%')};
  background-color: #b1b1b1;
  align-self: center;
`;

const StyledRow = styled.View`
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding-left: ${props => props.paddingLeft || 0};
  padding-right: ${props => props.paddingRight || 0};
  padding-top: ${props => props.paddingTop || 0};
  padding-bottom: ${props => props.paddingBottom || 0};
`;

const StyleCardHeaderImage = styled.Image`
  width: 42;
  height: 42;
  border-radius: 21;
  resize-mode: cover;
`;

const StyleUsername = styled.Text`
  padding-top: ${wp('1.0%')};
  padding-bottom: ${wp('1.0%')};
  padding-right: ${wp('2.3%')};
  text-align-vertical: center;
  margin-left: ${wp('1.0%')};
  color: #212121;
  font-size: ${wp('4.0%')};
  font-weight: 600;
`;

const StyledTimeStamp = styled.Text`
  padding-top: ${wp('1.0%')};
  padding-bottom: ${wp('1.0%')};
  padding-right: ${wp('2.3%')};
  text-align-vertical: center;
  margin-left: ${wp('1.0%')};
  color: #8f8f8f;
`;

const StyledScrollView = styled.ScrollView`
  background-color: white;
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

const StyledUserAvatar = styled.Image`
  width: ${hp('4.25%')};
  height: ${hp('4.25%')};
  border-radius: ${hp('3.125%')};
`;

const StyledUserNameText = styled.Text`
  font-size: ${hp('1.5%')};
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

const StyledCommentWrapper = styled.View`
  padding-top: ${hp('2%')};
  padding-right: ${hp('2%')};
  padding-left: ${hp('2%')};
  padding-bottom: ${hp('1.5%')};
  flex-direction: row;
`;

const StyledCommentHeaderText = styled.Text`
  font-size: ${hp('2.5%')};
  color: #fe847c;
  font-family: ${font.MBold};
  font-weight: 600;
`;

const StyledCommentHeaderCount = styled.Text`
  font-size: ${hp('1.4%')};
  color: #fe847c;
  font-family: ${font.MMedium};
`;

const StyledCommentInput = styled.TextInput`
  height: ${hp('10.4%')};
  background-color: #f5f5f5;
  margin-top: ${hp('1%')};
  margin-left: ${wp('2%')};
  margin-right: ${hp('2%')};
  margin-bottom: ${hp('15%')};
  border-radius: 10;
  justify-content: flex-start;
  padding-top: ${hp('1.4%')};
  padding-left: ${hp('1.4%')};
`;

const StyledCommentTimestamp = styled.Text`
  padding-left: ${hp('1.5%')};
  font-size: ${hp('1.1%')};
  font-family: ${font.MLight};
  color: #b1b1b1;
`;

const StyledComment = styled.Text`
  padding-left: ${wp('4%')};
  max-width: ${wp('70%')};
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

const StyledSendButton = styled.TouchableOpacity`
  position: absolute;
  width: 40;
  height: 40;
  border-radius: 20;
  justify-content: center;
  align-items: center;
  margin-top: ${hp('1.4%')};
  background-color: #fe847c;
  overflow: hidden;
  bottom: ${hp('20%')};
  right: ${wp('8%')};
`;

const StyledSendButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const SendButton = ({ comment, onPress }) => (
  <StyledSendButton onPress={comment ? onPress : null}>
    <StyledSendButtonOverlay
      start={{ x: 0.28, y: 0 }}
      end={{ x: 0.72, y: 1 }}
      colors={comment ? gradients.Background : ['rgb(167, 167, 167)', 'rgb(167, 167, 167)']}
    />

    <CustomIcon name={'send-24px'} size={28} color={colors.White} />
  </StyledSendButton>
);

const Header = () => (
  <StyledHeader>
    <StyledHeaderOverlay start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={gradients.Background} />
  </StyledHeader>
);

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

const MoreButton = props => (
  <StyledHorizontalContainer marginTop={6} marginLeft={wp('3.11%')}>
    <CustomIcon name={!props.isMore ? 'expand_more-24px' : 'expand_less-24px'} size={30} color={'#ff8e77'} />
    <StyledButton {...props}>
      <StyledMoreText marginLeft={wp('8.06%')}>{!props.showMore ? 'More' : 'Less'}</StyledMoreText>
    </StyledButton>
  </StyledHorizontalContainer>
);

const StyledView = styled.View`
  flex: 1;
`;
class ViewEventMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      comment: '',
      comments: [],
      likes: 0,
      isModalVisible: false,
      reportDescription: '',
      moreOptions: [],
    };

    this.moreList = [
      {
        key: 0,
        label: 'Report Media',
      },
    ];

    this.post = this.props.navigation.getParam('data', 'default');
    this.parentID = this.props.navigation.getParam('parentID', 'default');
    this.childID = this.props.navigation.getParam('childID', 'default');
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // if (nextProps.experience.comments !== prevState.comments) {
  //   return { comments: nextProps.experience.comments, likes: nextProps.experience.likes };
  //   // }
  // }

  componentDidUpdate(prevProps) {
    if (this.props.event_data[0].likes !== prevProps.event_data[0].likes) {
      this.saveLikes();
    }
  }

  saveLikes() {
    this.setState({
      likes: this.props.event_data[0].likes,
    });
  }
  componentDidMount() {
    // this.onGetEventComments();
  }

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
    if (this.props.auth.uid !== item.userId) {
      if (option.label === 'Report Media') {
        this.toggleReportModal();
      }
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

  onShowMore = () => {
    this.setState(prevState => ({
      showMore: !prevState.showMore,
    }));
  };

  // onGetEventComments = () => {
  //   const obj = new FormData();
  //   obj.append('token', this.props.auth.access_token);
  //   obj.append('_method', 'POST');
  //   obj.append('parentID', this.parentID);
  //   obj.append('childID', this.childID);
  //   obj.append('mediaID', this.post.mediaId);

  //   this.props.onGetEventComments(obj);
  //   this.setState({
  //     comments: this.props.experience.comments,
  //     likes: this.props.experience.likes,
  //   });
  // };

  onAddComment = async () => {
    const { comment } = this.state;
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parentID', this.parentID);
    obj.append('childID', this.childID);
    obj.append('comment', comment);
    obj.append('mediaID', this.post.mediaId);
    await this.props.onAddEventComment(obj);
    this.setState({
      comment: '',
    });
  };

  onLikeEvent = async () => {
    let type = this.props.navigation.getParam('type');
    const { navigation: { state: { params: { data }, }, }, } = this.props;
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('parentID', this.parentID);
    if(type !== undefined && type==='trending'){
      obj.append('childID', data.user_child_id);
    }else{
      obj.append('childID', this.childID);
    }
    obj.append('mediaID', this.post.mediaId);
    obj.append('type', 'LiveEvent');
    let likeObj = {
      formData: obj,
      onSuccess: (response) => {},
      onFailure: () => {},
      onGetEventSuccess: () => {},
    };
    this.props.onLikeEvent(likeObj);
  };

  onUnlikeEvent = async () => {
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parentID', this.parentID);
    obj.append('childID', this.childID);
    obj.append('mediaID', this.post.mediaId);

    await this.props.onUnlikeEvent(obj);
  };

  renderPost(item) {
    return (
      <StyledCardView>
        <StyleCardHeader>
          <StyledRow paddingLeft={10} paddingRight={10} paddingBottom={6} paddingTop={10}>
            <CustomIcon
              name={'keyboard_arrow_left-24px'}
              size={38}
              color={'#626262'}
              onPress={() => this.props.navigation.goBack()}
            />

            <StyledUserAvatarWrapper>
              <CachedImage
                component={Image}
                indicator={ActivityIndicator}
                style={{
                  width: hp('4.25%'),
                  height: hp('4.25%'),
                  borderRadius: hp('3.125%'),
                }}
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

        {/* <CachedImage
          component={Image}
          indicator={ActivityIndicator}
          resizeMode={'cover'}
          style={styles.cardImage}
          source={{ uri: this.post.url }}video_url
        /> */}
        <MediaView
          uri={this.post.video_url ? this.post.video_url : this.post.url}
          width={'100%'}
          borderRadius={0}
          height={hp('40.25%')}
        />

        {this.renderPostFooter(item)}
      </StyledCardView>
    );
  }

  renderPostFooter(data) {
    return (
      <StyledPostFooterWrapper>
        <StyledTextContainer>
          <StyledPostTitle>{data.title}</StyledPostTitle>
          {
            //  <StyledPostBody>
            //   It was awesome I totally love to spend time with friends!{' '}
            // </StyledPostBody>
          }
        </StyledTextContainer>
        <StyledStatWrapper>
          <StyledReactionWrapper>
            <TouchableOpacity onPress={() => this.onLikeEvent()}>
              <StyledEmoji>🔥</StyledEmoji>
            </TouchableOpacity>
            <StyledCount>{data.likes !== undefined ? data.likes : 0}</StyledCount>
          </StyledReactionWrapper>
          <StyledDivider />
          <StyledReactionWrapper>
            <StyledEmoji>💬</StyledEmoji>
            <StyledCount>{data.comments !== undefined ? data.comments.length : 0}</StyledCount>
          </StyledReactionWrapper>
        </StyledStatWrapper>
      </StyledPostFooterWrapper>
    );
  }

  renderComment(item) {
    return (
      <StyledHorizontalContainer
        justifyContent={'space-between'}
        paddingLeft={wp('2.22%')}
        paddingRight={wp('2.22%')}
        paddingBottom={hp('1.5%')}
        paddingTop={hp('2%')}
      >
        <StyledHorizontalContainer>
          {/** User avatar */}
          <StyledUserAvatarWrapper>
            <StyledUserAvatar source={{ uri: item.iUrl }} />
          </StyledUserAvatarWrapper>
          {/** User name */}
          <View>
            <StyledHorizontalContainer>
              <StyledUserNameText>{item.users_name}</StyledUserNameText>
              <StyledCommentTimestamp>{moment.unix(item.created_at).fromNow(true)}</StyledCommentTimestamp>
            </StyledHorizontalContainer>
            <StyledComment>{item.content}</StyledComment>
          </View>
        </StyledHorizontalContainer>
      </StyledHorizontalContainer>
    );
  }

  render = () => {
    const { showMore, comment, comments } = this.state;
    const {
      navigation: {
        state: {
          params: { data },
        },
      },
    } = this.props;
    let mediaData = [];
    if (this.props.event_data && this.props.event_data.length > 0) {
      this.props.event_data[0].trending.map((item, index) => {
        if (item.mediaId === data.mediaId) {
          mediaData.push(item);
        }
      });
      if (mediaData.length === 0) {
        this.props.event_data[0].my_experience.map((item, index) => {
          if (item.mediaId === data.mediaId) {
            mediaData.push(item);
          }
        });
      }
      mediaData = mediaData[0];
    }

    return (
      <StyledView>
        <Header />
        <KeyboardAwareScrollView scrollEnabled={true}>
          {this.renderPost(mediaData)}
          <StyledCommentWrapper>
            <StyledCommentHeaderText>Comments</StyledCommentHeaderText>
            <StyledCommentHeaderCount>
              {mediaData.comments && mediaData.comments.length > 0 ? mediaData.comments.length : ''}
            </StyledCommentHeaderCount>
          </StyledCommentWrapper>
          <FlatList
            // data={!showMore ? mediaData.comments && mediaData.comments.slice(0, 4) : mediaData.comments}
            data={mediaData.comments}
            renderItem={({ item, index }) => this.renderComment(item)}
            ItemSeparatorComponent={() => <StyledDivider />}
            keyExtractor={(item, index) => '' + index}
            showsVerticalScrollIndicator={false}
          />

          {mediaData.comments && mediaData.comments.length > 4 ? (
            <MoreButton onPress={this.onShowMore} showMore={showMore} />
          ) : null}

          <StyledCommentInput
            placeholder="Type something..."
            numberOfLines={10}
            multiline={true}
            onChangeText={text =>
              this.setState({
                comment: text,
              })
            }
            value={comment}
          />

          <SendButton comment={comment} onPress={() => this.onAddComment()} />

          {this.reportModalView()}
        </KeyboardAwareScrollView>
      </StyledView>
    );
  };
}

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: hp('40.25%'),
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
    onAddEventComment: obj => {
      dispatch(ExperienceActions.addEventComment(obj));
    },
    onAddPostEventComment: obj => {
      dispatch(ExperienceActions.addPostEventComment(obj));
    },
    // onGetEventComments: obj => {
    //   dispatch(ExperienceActions.getEventComments(obj));
    // },
    onLikeEvent: obj => {
      dispatch(ExperienceActions.likeEvent(obj));
    },
    onUnlikeEvent: obj => {
      dispatch(ExperienceActions.unlikeEvent(obj));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewEventMedia);
