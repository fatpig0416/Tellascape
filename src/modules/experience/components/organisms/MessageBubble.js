import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';

import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';
import theme from '../../../core/theme';
const { images, colors, font, gradients } = theme;

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            ...styles.standardFont,
            ...styles.slackMessageText,
            ...messageTextProps.textStyle,
            ...messageTextStyle,
          }}
        />
      );
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} imageStyle={[styles.slackImage, messageImageProps.imageStyle]} />;
    }
    return null;
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name;
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps);
      }
      return (
        <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
          {username}
        </Text>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{
            left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle],
          }}
        />
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    const messageHeader = (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
      </View>
    );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity onLongPress={this.onLongPress} accessibilityTraits="text" {...this.props.touchableProps}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <View>
              {this.renderCustomView()}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  standardFont: {
    fontSize: 12,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
    fontFamily: font.MMedium,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: font.MMedium,
  },
  time: {
    textAlign: 'left',
    fontSize: 11,
    fontFamily: font.MMedium,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
});
