import React, { Component } from 'react';
import { StyleSheet, View, Modal, Image, Keyboard, SafeAreaView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { database, auth } from 'react-native-firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import ExperienceActions from '../../reducers/event/index';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { isIphoneX } from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import {
  GiftedChat,
  Composer,
  Actions,
  InputToolbar,
  Bubble,
  Time,
  Avatar,
  utils,
  Message,
  Send,
  Day,
} from 'react-native-gifted-chat';

// Load theme
import theme from '../../../core/theme';
const { colors, font, gradients, sizes } = theme;

// Load utils
import { Loading } from '../../../../utils';
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../../utils/vals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Load common components
import {
  StyledHorizontalContainer,
  StyledButton,
  StyledText,
  StyledWrapper,
  StyledButtonOverlay,
  StyledSeparator,
} from '../../../core/common.styles';

import MessageSend from '../organisms/MessageSend';

const BackButton = props => (
  <StyledButton marginLeft={-12} {...props}>
    <CustomIcon name={'keyboard_arrow_left-24px'} size={props.iconSize} color={props.iconColor} />
  </StyledButton>
);

const StyledHeaderTitle = styled.Text`
  font-size: ${sizes.largeFontSize};
  color: #fff;
  font-family: ${font.MBold};
`;

const StyledMessageUserName = styled.Text`
  position: absolute;
  color: #8f8f8f;
  font-size: ${wp('2.78%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  top: -${wp('4%')};
  left: ${wp('3.33%')};
  opacity: 0.6;
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
`;

const StyledChatTitle = styled.Text`
  font-size: ${wp('3.5%')};
  font-family: ${font.MBold};
  color: #515151;
`;

const StyledModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16;
  top: ${isIphoneX() ? 40 : 20};
  width: ${wp('9%')};
  height: ${wp('9%')};
  border-radius: ${wp('5%')};
  /* border-color: #fff; */
  /* border-width: 2; */
  justify-content: center;
  align-items: center;
`;

const ModalCloseButton = props => (
  <StyledModalCloseButton style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute' }} {...props}>
    <CustomIcon name={'Close_16x16px'} size={14} color={'white'} />
  </StyledModalCloseButton>
);

class OpenChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowEmoji: false,
      msgText: '',
      messages: [],
      firebaseRef: database().ref('Event' + '-' + this.props.navigation.getParam('parentID', 'Default')),
    };
  }

  componentDidMount() {
    this.refOn(this.state.firebaseRef, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    this.setState({
      messages: [],
    });
    this.state.firebaseRef.off();
  }

  returnUserID() {
    return (auth().currentUser || {}).uid;
  }

  get user() {
    return {
      _id: this.returnUserID(),
      name: this.props.auth.first_name + ' ' + this.props.auth.last_name,
      avatar: this.props.auth.photo,
      id: this.returnUserID(),
    };
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;
    if (currText) {
      messageTextStyle = {
        fontSize: 12,
        lineHeight: Platform.OS === 'android' ? 34 : 20,
        color: 'black',
      };
    }

    return <Message {...props} messageTextStyle={messageTextStyle} />;
  }

  renderBubble(props) {
    return (
      <View>
        {props.currentMessage.user._id !== this.props.auth.uid ? (
          <StyledMessageUserName>{props.currentMessage.user.name}</StyledMessageUserName>
        ) : null}

        {props.currentMessage.user._id !== this.props.auth.uid ? (
          <StyledButtonOverlay
            borderRadius={15}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#fe7f7e', '#ffa06d']}
          />
        ) : null}
        <Bubble
          {...props}
          containerStyle={{
            left: {
              width: wp('69.1%'),
              padding: 0,
            },
            right: {
              width: wp('69.1%'),
              padding: 0,
            },
          }}
          wrapperStyle={{
            left: {
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              paddingTop: wp('3.33%'),
              paddingLeft: wp('3.33%'),
              paddingRight: wp('3.33%'),
              paddingBottom: wp('1.6%'),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            },
            right: {
              width: '100%',
              height: '100%',
              backgroundColor: '#E6E6E6',
              paddingTop: wp('3.33%'),
              paddingLeft: wp('3.33%'),
              paddingRight: wp('3.33%'),
              paddingBottom: wp('3.33%'),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            },
          }}
          textStyle={{
            left: {
              color: '#fff',
              fontSize: wp('3.33%'),
              fontFamily: font.MRegular,
              fontWeight: '500',
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              lineHeight: wp('5%'),
            },
            right: {
              color: '#212121',
              fontSize: wp('3.33%'),
              fontFamily: font.MRegular,
              fontWeight: '500',
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              lineHeight: wp('5%'),
            },
          }}
        />
      </View>
    );
  }

  renderAvatar = props => {
    if (props.currentMessage && props.currentMessage.user && props.currentMessage.user.photo) {
      return (
        <View>
          <Image
            source={{ uri: props.currentMessage.user.photo }}
            style={{ width: wp('8%'), height: wp('8%'), borderRadius: wp('4%') }}
          />
        </View>
      );
    }
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: {
            width: wp('7.78%'),
            height: wp('7.78%'),
            borderRadius: wp('3.89%'),
          },
        }}
        containerStyle={{
          left: {
            marginRight: 8,
          },
        }}
      />
    );
  };

  renderEmojiModal = () => {
    const { isShowEmoji } = this.state;
    return (
      <Modal visible={isShowEmoji} animationType={'fade'}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: hp('10%'), flex: 1 }}>
            <EmojiSelector
              onEmojiSelected={emoji => {
                this.setState(previousState => ({
                  msgText: previousState.msgText + emoji,
                  isShowEmoji: false,
                }));
              }}
              showSearchBar={true}
              showTabs={true}
              showHistory={true}
              showSectionTitles={true}
              category={Categories.all}
            />
          </View>
          <ModalCloseButton
            onPress={() => {
              this.setState({ isShowEmoji: false });
            }}
          />
        </View>
      </Modal>
    );
  };

  renderInputToolbar(props) {
    const {
      navigation: {
        state: {
          params: { isSend },
        },
      },
    } = this.props;
    if (isSend !== undefined && isSend === false) {
      return null;
    }
    return <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} />;
  }

  renderComposer = props => {
    return (
      <Composer
        {...props}
        placeholderTextColor={'#4E4E4E'}
        textInputStyle={styles.composerTextInput}
        stickSendButton={false}
        isAnonymous={this.state.isAnonymous}
      />
    );
  };

  renderDay = props => {
    return <Day {...props} wrapperStyle={styles.dayWrapperStyle} />;
  };

  renderTime = props => {
    return (
      <Time
        {...props}
        containerStyle={{
          left: {
            marginLeft: 0,
            marginRight: 0,
            marginTop: wp('1.38%'),
            marginBottom: 0,
          },
          right: {
            marginLeft: 0,
            marginRight: 0,
            marginTop: wp('1.38%'),
            marginBottom: 0,
          },
        }}
        timeTextStyle={{
          left: {
            fontSize: wp('2.78%'),
            color: '#000',
            fontFamily: font.MRegular,
            opacity: 0.6,
          },
          right: {
            fontSize: wp('2.78%'),
            color: '#8f8f8f',
            fontFamily: font.MRegular,
            opacity: 0.6,
          },
        }}
      />
    );
  };

  renderActions = props => {
    return (
      <Actions
        {...props}
        containerStyle={styles.actionContainer}
        icon={() => (
          <View
            style={{
              height: 24,
              width: 24,
            }}
          >
            <CustomIcon name={'icon_smile'} size={24} color={'#878787'} />
          </View>
        )}
        onPressActionButton={() => {
          this.setState({ isShowEmoji: true });
        }}
      />
    );
  };

  renderSend(props) {
    return <MessageSend {...props} />;
  }
  refOn = (ref, callback) => {
    ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  parse = snapshot => {
    const { text, user, createdAt } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    // const createdAt = new Date();
    const message = {
      id,
      _id,
      createdAt: new Date(createdAt),
      text,
      user,
    };
    return message;
  };

  timestamp() {
    return database.ServerValue.TIMESTAMP;
  }
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp(),
      };
      this.append(message);
    }
    Keyboard.dismiss();
  };

  append = message => this.state.firebaseRef.push(message);

  refOff(ref) {
    ref.off();
  }

  firebaseInstance(parentID) {
    return database().ref('Event' + '-' + parentID);
  }

  render() {
    const { messages, msgText } = this.state;
    const {
      navigation: {
        state: {
          params: { title, isSend },
        },
      },
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <StyledHeader>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={gradients.Background}
            style={styles.headerContainer}
          >
            <SafeAreaView>
              <StyledWrapper row primary={'space-between'} secondary={'center'}>
                <StyledWrapper row secondary={'center'}>
                  <BackButton
                    onPress={() => this.props.navigation.goBack()}
                    iconSize={sizes.xlargeIconSize}
                    iconColor={'#fff'}
                  />
                  <StyledWrapper row secondary={'center'} marginLeft={sizes.xsmallPadding}>
                    <StyledWrapper marginLeft={14}>
                      <StyledHeaderTitle>
                        {title.length < 33 ? title : title.substring(0, 33) + '...'}
                      </StyledHeaderTitle>
                    </StyledWrapper>
                  </StyledWrapper>
                </StyledWrapper>
              </StyledWrapper>
            </SafeAreaView>
          </LinearGradient>
        </StyledHeader>

        <View style={{ alignItems: 'center', paddingVertical: wp('3%') }}>
          <StyledChatTitle>{'EVENT CHAT'}</StyledChatTitle>
        </View>
        <StyledSeparator width={wp('100%')} height={0.5} bgColor={'#d1d1d1'} />
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
          <GiftedChat
            messages={messages}
            onSend={messages => this.send(messages)}
            user={{
              _id: this.props.auth.uid,
              name: this.props.auth.first_name,
              photo: this.props.auth.photo,
            }}
            onInputTextChanged={val => {
              this.setState({ msgText: val });
            }}
            textInputProps={{
              returnKeyType: 'done',
              multiline: false,
            }}
            text={msgText}
            minInputToolbarHeight={isSend !== undefined && isSend === false ? 0 : hp('5%')}
            renderActions={props => this.renderActions(props)}
            renderComposer={props => this.renderComposer(props)}
            renderSend={props => this.renderSend(props)}
            renderInputToolbar={props => this.renderInputToolbar(props)}
            renderMessage={props => this.renderMessage(props)}
            renderBubble={props => this.renderBubble(props)}
            renderTime={props => this.renderTime(props)}
            renderAvatar={props => this.renderAvatar(props)}
            renderDay={props => this.renderDay(props)}
            renderFooter={props => <View style={{ marginBottom: hp('5%') }} />}
            isKeyboardInternallyHandled={false}
            listViewProps={{
              nestedScrollEnabled: true,
              contentContainerStyle: {
                flexGrow: 1,
                justifyContent: 'flex-end',
              },
            }}
          />
        </KeyboardAwareScrollView>
        {this.renderEmojiModal()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    event_data: state.experience.event_data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPostEvent: obj => {
      dispatch(ExperienceActions.getPostEvent(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenChat);

const styles = StyleSheet.create({
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
  modalContainer: {
    margin: 0,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    flex: 1,
    left: 0,
    right: 0,
  },
  image: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
  },
  imageStyle: {
    width: '100%',
    height: hp('22.81%'),
    resizeMode: 'cover',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  composerTextInput: {
    flex: 1,
    paddingLeft: 0,
    paddingTop: 8,
    borderRadius: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingRight: 50,
    fontFamily: font.MRegular,
  },
  inputToolbarContainer: {
    borderTopWidth: 0,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: hp('3%'),
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayWrapperStyle: {
    marginBottom: 16,
  },
  headerContainer: {
    paddingVertical: wp('3%'),
    paddingHorizontal: wp('2%'),
  },
});
