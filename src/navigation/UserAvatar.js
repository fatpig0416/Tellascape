import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components';
import { connect } from 'react-redux';
import ExperienceActions from '../modules/experience/reducers/event';
import FastImage from 'react-native-fast-image';

import theme from '../modules/core/theme';
const { images } = theme;

const StyledImage = styled(FastImage)`
  width: ${wp('10.55')};
  height: ${wp('10.55')};
  border-radius: ${wp('5.275')};
`;

class UserAvatar extends Component {
  static navigationOptions = { title: '', header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderImage = (image = '') => (image === null || image.length === 0 ? images.PROFILE : { uri: image });

  render = () => {
    const { photo } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.setProfileLoad(false);
          this.props.navigation.navigate('ViewProfile', { uid: this.props.auth.uid });
        }}
      >
        <View>
          <StyledImage source={this.renderImage(photo && photo)} />
        </View>
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = state => {
  return {
    photo: state.auth.photo,
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAvatar);
