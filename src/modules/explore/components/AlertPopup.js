import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Dimensions,
  Alert,
  View,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import TimeAgo from 'react-native-timeago';
// Import Explore and Experience actions
import { connect } from 'react-redux';
import ExploreAction from '../../home/reducers/index';
import AlertActions from '../../tellasafe/reducers';
import ExperienceActions from '../../experience/reducers/event';
// Load theme
import theme from '../../core/theme';
const { font, sizes } = theme;

// Load common components from common styles
import { StyledButton, StyledSeparator, IconButton, StyledWrapper } from '../../core/common.styles';

// Load utils
import Loading from '../../../utils/loading';
import CustomIcon from '../../../utils/icon/CustomIcon';
import _ from 'lodash';
import CommonModal from '../../profile/components/organisms/CommonModal';
import DescriptionInputModal from '../../experience/components/organisms/DescriptionInputModal';
import { facebookShare } from '../../../utils/funcs';

const moreModalData = [
  { label: 'Edit Alert', value: 'edit' },
  { label: 'Delete Alert', value: 'delete' },
  { label: 'Report Alert', value: 'report' },
  { label: 'Share', value: 'share' },
];

const StyledTitleText = styled.Text`
  color: #212121;
  font-family: ${font.MSemiBold};
  font-size: ${wp('4.44%')};
  line-height: ${wp('5.27%')};
`;

const StyledHandlerWrapper = styled.View`
  width: ${wp('100%')};
  align-items: center;
`;

const StyledHandler = styled.TouchableOpacity`
  width: ${wp('9.16%')};
  height: ${wp('0.83%')};
  border-radius: 2;
  background-color: #dcdcdc;
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('1.11%')};
`;

const HandlerButton = props => {
  return (
    <StyledHandlerWrapper>
      <StyledButton {...props}>
        <StyledHandler />
      </StyledButton>
    </StyledHandlerWrapper>
  );
};

const StyledLikesIconText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #515151;
  font-family: ${font.MRegular};
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

const StyledDescriptionText = styled.Text`
  font-size: ${wp('2.77%')};
  color: #515151;
  font-family: ${font.MRegular};
`;

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
  );
};

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

const StyledCommentInput = styled.TextInput`
  width: 100%;
  height: ${hp('5%')};
  border-radius: ${hp('2.5%')};
  padding-left: ${wp('4.5%')};
  padding-right: ${wp('4.5%')};
  background-color: #f5f5f5;
  color: #363636;
  font-family: ${font.MRegular};
  font-size: ${wp('3.05%')};
`;

const StyledSendButton = styled.TouchableOpacity`
  position: absolute;
  width: ${hp('5%')};
  height: ${hp('5%')};
  border-radius: ${hp('2.5%')};
  background-color: #d5d5d5;
  right: ${sizes.smallPadding};
  top: ${sizes.smallPadding};
  justify-content: center;
  align-items: center;
`;

const SendButton = props => (
  <StyledSendButton {...props}>
    <CustomIcon name={'PE-Send_20x20px'} size={sizes.smallIconSize} color={!props.isEdit ? '#fefefe' : props.color} />
  </StyledSendButton>
);

const StyledCloseButton = styled.TouchableOpacity`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
  align-self: flex-end;
  margin-right: 8;
  margin-bottom: 8;
  justify-content: center;
  align-items: center;
  background-color: 'rgba(0,0,0,0.3)';
`;

const CloseButton = props => (
  <StyledCloseButton {...props}>
    <CustomIcon name={'Close_16x16px'} size={12} color={'white'} />
  </StyledCloseButton>
);

class AlertPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      title: '',
      likes: 0,
      comments: 0,
      slideIndex: 0,
      paused: false,
      isBuffer: false,
      muted: true,

      isMore: false,
      comment: '',
      keyboardHeight: 0,
      isMoreModalVisible: false,
      isReportModalVisible: false,
    };

    this.eventPopupBottom = new Animated.Value(0);
  }

  componentWillMount() {
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow(e) {
    // console.log('e.endCoordinates.height ===>>>', e.endCoordinates.height);
  }

  _keyboardDidHide(e) {}

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidMount = async () => {
    this.subs = [
      this.props.navigation.addListener('didBlur', () => {
        this.setState({ paused: true });
      }),
    ];
  };

  changeComment = text => {
    this.setState({
      comment: text,
    });
  };

  toggleMore = () => {
    this.setState(prevState => ({
      isMore: !prevState.isMore,
    }));
  };

  onFocusComments = () => {
    Animated.timing(this.eventPopupBottom, {
      toValue: isIphoneX() ? 346 : 260,
      duration: 500,
    }).start();
  };

  onSendComment = () => {
    const { parentID, child_ID } = this.props.alert_data[0];
    const obj = {
      parentID: parentID,
      childID: child_ID,
      comment: this.state.comment,
      token: this.props.auth.access_token,
    };
    this.props.onAddAlertComment(obj);

    if (this.state.comment) {
      this.setState({
        comment: '',
      });
    }
    this.dismissKeyboard();
  };

  dismissKeyboard = () => {
    Keyboard.dismiss();
    Animated.timing(this.eventPopupBottom, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  onToggleMoreModal = () => {
    this.setState(prevState => ({
      isMoreModalVisible: !prevState.isMoreModalVisible,
    }));
  };

  onToggleReportModal = () => {
    this.setState(prevState => ({
      isReportModalVisible: !prevState.isReportModalVisible,
    }));
  };

  deleteAlert = () => {
    const { parentID, child_ID } = this.props.alert_data[0];
    this.setState({ isLoading: true });
    const obj = {
      parentID: parentID,
      token: this.props.auth.access_token,
      uid: this.props.auth.uid,
      _method: 'DELETE',
      type: 'explore',
      onSuccess: () => {},
      onSuccessMarkers: () => {
        this.onToggleMoreModal();
        this.setState({ isLoading: false });
        this.props.onDismissEventPopup();
      },
      onFail: msg => {
        this.onToggleMoreModal();
        this.setState({ isLoading: false });
        Alert.alert('Delete Alert', msg);
      },
    };
    this.props.onDeleteAlert(obj);
  };

  editAlert = () => {
    const { parentID, child_ID, title, description, category } = this.props.alert_data[0];
    this.props.navigation.navigate('EditAlert', {
      parentID: parentID,
      childID: child_ID,
      title: title,
      description: description,
      category: category,
      routeName: 'Explore',
    });
  };

  onSubmitReport = (description, onChangeDescription) => {
    const { parentID, child_ID } = this.props.alert_data[0];
    this.setState({ isLoading: true });
    const obj = new FormData();
    obj.append('token', this.props.auth.access_token);
    obj.append('_method', 'POST');
    obj.append('parent_id', parentID);
    obj.append('child_id', child_ID);
    obj.append('message', description);
    obj.append('type', 'alert');

    this.onToggleReportModal();
    this.props.onReportEvent(obj);
    this.setState({ isLoading: false });
    onChangeDescription('');
  };

  onFaceBookshare = () => {
    if (this.props.alert_data && this.props.alert_data.length > 0) {
      const { title, description, share_url } = this.props.alert_data[0];
      try {
        let shareLinkContent = {
          contentType: 'link',
          quote: description,
          contentUrl: share_url,
          contentTitle: title,
          contentDescription: description,
          // commonParameters: {
          //   hashtag: '#tellascpe',
          // },
        };
        facebookShare(shareLinkContent);
      } catch (error) {
        console.log(`Share Error Handling IS: ${error.message} `);
      }
    }
  };

  onPressMoreModalItem = value => {
    switch (value) {
      case 'delete':
        Alert.alert('Delete', 'Do you really wants to remove this alert ?', [
          {
            text: 'Dismiss',
            onPress: () => {
              this.onToggleMoreModal();
            },
          },
          {
            text: 'Yes, Delete it!',
            style: 'destructive',
            onPress: () => {
              this.deleteAlert();
            },
          },
        ]);
        break;
      case 'edit':
        this.onToggleMoreModal();
        this.editAlert();
        break;
      case 'report':
        this.onToggleMoreModal();
        setTimeout(() => this.onToggleReportModal(), 500);
        break;
      case 'share':
        this.onToggleMoreModal();
        setTimeout(() => this.onFaceBookshare(), 500);
        break;
      default:
        break;
    }
  };

  render() {
    const { isMore, comment, isMoreModalVisible, isReportModalVisible } = this.state;
    const { eventData } = this.props;
    if (this.props.alert_data && this.props.alert_data.length > 0) {
      const { isLoading, slideIndex } = this.state;
      const { title, myChildID, description, founder_uid } = this.props.alert_data[0];
      const {
        eventData: { type, parentID, title: eventTitle },
        explore: { joinedEventsList },
        style: propsStyle,
        onDismissEventPopup,
      } = this.props;

      const sendButtonColor =
        type !== undefined
          ? type === 'event'
            ? theme.orange.icon
            : type === 'station'
            ? theme.blue.icon
            : type === 'alert'
            ? theme.tellasafe.text
            : theme.cyan.icon
          : theme.orange.icon;

      let commentData = [];
      if (this.props.alert_data && this.props.alert_data.length > 0) {
        commentData = this.props.alert_data[0].comments;
      }

      return (
        <Animated.View style={propsStyle}>
          {isLoading ? (
            <Loading />
          ) : (
            <View>
              <CloseButton onPress={onDismissEventPopup} />
              <View style={styles.container}>
                <HandlerButton onPress={onDismissEventPopup} />
                <StyledWrapper width={wp('100%')} paddingLeft={wp('4.44%')} paddingRight={wp('4.44%')}>
                  <StyledWrapper width={'100%'} row primary={'space-between'} secondary={'center'}>
                    <StyledTitleText>{title}</StyledTitleText>
                    {founder_uid === this.props.auth.uid && (
                      <IconButton
                        iconName={'more_horiz-24px'}
                        iconSize={24}
                        iconColor={'#000'}
                        onPress={() => this.onToggleMoreModal()}
                      />
                    )}
                  </StyledWrapper>

                  {description ? (
                    <StyledWrapper marginTop={8}>
                      <StyledDescriptionText>{description}</StyledDescriptionText>
                    </StyledWrapper>
                  ) : null}

                  <StyledWrapper row marginTop={8}>
                    {/* <LikesIconDetail
                    iconName={'love-big_16x16'} // Views_21x13px
                    count={(trending.length > 0 && trending[slideIndex].likes) || 0}
                    disabled
                  /> */}
                    <LikesIconDetail disabled iconName={'comments-big_16x16'} count={commentData.length} />
                  </StyledWrapper>
                </StyledWrapper>

                <StyledWrapper width={wp('100%')} marginTop={wp('4.44%')} paddingBottom={25}>
                  <FlatList
                    data={
                      !isMore ? commentData.slice(commentData.length > 3 ? commentData.length - 3 : 0) : commentData
                    }
                    renderItem={({ item, index }) => <CommentItem data={item} onPress={() => {}} />}
                    keyExtractor={(item, index) => '' + index}
                    inverted={true}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                    ListHeaderComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                    ListFooterComponent={() => <StyledSeparator height={0.5} bgColor={'#000'} opacity={0.18} />}
                  />
                  {commentData !== undefined && commentData.length > 3 ? (
                    <StyledWrapper>
                      <MoreButton isMore={isMore} onPress={this.toggleMore} color={sendButtonColor} />
                    </StyledWrapper>
                  ) : null}

                  <StyledWrapper
                    width={'100%'}
                    paddingLeft={sizes.smallPadding}
                    paddingRight={sizes.smallPadding}
                    paddingTop={sizes.smallPadding} //   padding-bottom: ${wp('16%')};
                  >
                    <StyledCommentInput
                      placeholder={'Say Something…'}
                      placeholderTextColor={'#363636'}
                      value={comment}
                      onChangeText={this.changeComment}
                      onFocus={this.onFocusComments}
                      onSubmitEditing={this.onSendComment}
                      onBlur={this.dismissKeyboard}
                    />
                    <SendButton isEdit={!!comment} onPress={this.onSendComment} color={sendButtonColor} />
                  </StyledWrapper>

                  <CommonModal
                    modalData={moreModalData}
                    isModalVisible={isMoreModalVisible}
                    isBlur={true}
                    onCancelModal={this.onToggleMoreModal}
                    onPressModalItem={this.onPressMoreModalItem}
                  />
                  <DescriptionInputModal
                    title={'Report'}
                    placeholder={'Report description'}
                    isModalVisible={isReportModalVisible}
                    experienceType={'safe'}
                    onToggleModal={this.onToggleReportModal}
                    onSubmit={this.onSubmitReport}
                  />
                </StyledWrapper>
              </View>
            </View>
          )}
        </Animated.View>
      );
    } else {
      return <Loading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    borderTopLeftRadius: wp('4.2%'),
    borderTopRightRadius: wp('4.2%'),
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // overflow: 'hidden',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    explore: state.explore,
    experience: state.experience,
    event_data: state.experience.event_data,
    station: state.station,
    station_data: state.station.station_data,
    memory: state.memory,
    memory_data: state.memory.memory_data,
    alert_data: state.tellasafe.alert_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onJoinEvent: obj => {
      dispatch(ExploreAction.joinEventRequest(obj));
    },
    onAddAlertComment: obj => {
      dispatch(AlertActions.addAlertComment(obj));
    },
    onDeleteAlert: obj => {
      dispatch(AlertActions.deleteAlert(obj));
    },
    onReportEvent: obj => {
      dispatch(ExperienceActions.reportEvent(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertPopup);
