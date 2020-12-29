import React, { Component } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Image from 'react-native-image-progress';
import Video from 'react-native-video';

// Load common styles
import { StyledButton, StyledWrapper } from '../../../core/common.styles';

const FILE_TYPES = [
  { extension: 'jpg', mediaType: 'image' },
  { extension: 'png', mediaType: 'image' },
  { extension: 'mp4', mediaType: 'video' },
];

const ImageView = props => {
  const { uri, width, height, borderRadius } = props;
  return (
    <Image
      source={{ uri }}
      style={[styles.mediaContainer, { width, height, borderRadius: borderRadius || 0 }]}
      imageStyle={{ borderRadius: borderRadius !== null || borderRadius !== undefined ? borderRadius : 15 }}
    />
  );
};

const VideoView = props => {
  const {
    isDisablePossible,
    uri,
    rate,
    paused,
    volume,
    muted,
    ignoreSilentSwitch,
    onLoad,
    onBuffer,
    onProgress,
    onPress,
    width,
    height,
    borderRadius,
    resizeMode,
  } = props;

  if (isDisablePossible) {
    return (
      <StyledWrapper onPress={onPress}>
        <Video
          source={{
            uri,
            // headers: {
            //   range: 'bytes=0',
            // },
          }}
          style={[styles.mediaContainer, { width, height, borderRadius: borderRadius || 0 }]}
          rate={rate}
          paused={paused}
          volume={volume}
          muted={muted}
          ignoreSilentSwitch={ignoreSilentSwitch}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onBuffer={onBuffer}
          onProgress={onProgress}
          onEnd={() => null}
          repeat={true}
          allowsExternalPlayback={true}
        />
      </StyledWrapper>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Video
        source={{
          uri,
          // headers: {
          //   range: 'bytes=0',
          // },
        }}
        style={[styles.mediaContainer, { width, height, borderRadius: borderRadius || 0 }]}
        rate={rate}
        paused={paused}
        volume={volume}
        muted={muted}
        ignoreSilentSwitch={ignoreSilentSwitch}
        resizeMode={resizeMode}
        onLoad={onLoad}
        onBuffer={onBuffer}
        onProgress={onProgress}
        onEnd={() => null}
        repeat={true}
        allowsExternalPlayback={true}
      />
    </TouchableWithoutFeedback>
  );
};

export default class MediaView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rate: 1,
      paused: false,
      volume: 1,
      muted: true,
      ignoreSilentSwitch: null,
      duration: 0.0,
      currentTime: 0.0,
      imageHeight: 0,
    };
  }

  onLoad = data => {
    this.setState({ duration: data.duration });
  };

  onProgress = data => {
    this.setState({ currentTime: data.currentTime });
  };

  onBuffer = ({ isBuffering }) => {
    this.setState({ isBuffering });
  };

  onPlay = () => {
    this.setState(prevState => ({
      paused: !prevState.paused,
    }));
  };

  checkMediaType = uri => {
    const extension = uri.split('.').pop();
    const fileType = FILE_TYPES.find(ele => ele.extension === extension.toLowerCase());
    if (!fileType) {
      return 'image';
    }
    return fileType.mediaType;
  };

  render() {
    const { uri, width, height, borderRadius, isDisablePossible, resizeMode = 'cover', isMute = true } = this.props;
    const { rate, volume, muted, paused, ignoreSilentSwitch } = this.state;

    if (this.checkMediaType(uri) === 'image') {
      return <ImageView uri={uri} width={width} height={height} borderRadius={borderRadius} />;
    }

    return (
      <VideoView
        // possibility for playing
        isDisablePossible={isDisablePossible}
        // uri
        uri={uri}
        resizeMode={resizeMode}
        // options
        rate={rate}
        paused={paused}
        volume={volume}
        muted={isMute}
        ignoreSilentSwitch={ignoreSilentSwitch}
        // for controlling
        onPress={this.onPlay}
        onLoad={this.onLoad}
        onBuffer={this.onBuffer}
        onProgress={this.onProgress}
        // for styling
        width={width}
        height={height}
        borderRadius={borderRadius}
      />
    );
  }
}

const styles = StyleSheet.create({
  mediaContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
  },
  imageStyle: {
    borderRadius: 15,
  },
});
