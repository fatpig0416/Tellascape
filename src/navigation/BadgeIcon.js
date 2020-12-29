import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Component } from 'react';
import { connect } from 'react-redux';
import NotificationAction from '../modules/notification/reducers';
import CustomIcon from '../utils/icon/CustomIcon';
import theme from '../modules/core/theme';
const { font, colors } = theme;

class BadgeIcon extends Component {
  render() {
    const {
      navigation,
      tintColor,
      notification: { badgeCount },
    } = this.props;
    return (
      <View>
        <CustomIcon name={'Navbar_Notifications_32px'} size={30} color={tintColor} />
        {badgeCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badgeCount > 9 ? '9' : badgeCount}</Text>
            {badgeCount > 9 && <Text style={styles.superscript}>{'+'}</Text>}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: -8,
    top: -8,
    borderWidth: wp('0.15%'),
    borderColor: 'white',
    borderRadius: wp('4%'),
    backgroundColor: colors.aquaColor,
    width: wp('5.5%'),
    height: wp('5.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontFamily: font.MMedium,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: wp('3%'),
    lineHeight: wp('4%'),
  },
  superscript: {
    lineHeight: wp('2.5%'),
    fontSize: wp('3.5%'),
    fontFamily: font.MBold,
    color: 'white',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    notification: state.notification,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setBadgeCount: obj => {
      dispatch(NotificationAction.setBadgeCount(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BadgeIcon);
