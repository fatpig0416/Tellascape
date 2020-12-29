import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledButton, StyledWrapper } from '../../core/common.styles';
import styled from 'styled-components/native';
// Load utils
import { truncate } from '../../../utils/funcs';
import CustomIcon from '../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../core/theme';
const { font, sizes } = theme;

const StyledLikesIconText = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.44%')};
  color: #000000;
  font-family: ${font.MSemiBold};
  margin-left: ${wp('1.736%')};
`;

const LikesIconDetail = props => {
  const { onPress, disabled, marginLeft, iconName, iconColor, count } = props;

  return (
    <StyledButton onPress={onPress} disabled={disabled || false}>
      <StyledWrapper row secondary={'center'} marginLeft={marginLeft || undefined}>
        <CustomIcon name={iconName} size={sizes.smallIconSize} color={iconColor || '#7B7B7B'} />
        <StyledLikesIconText>{count}</StyledLikesIconText>
      </StyledWrapper>
    </StyledButton>
  );
};

const PostFooter = ({ data }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.textContainer}>
        <Text style={styles.postTitle}>{data.title}</Text>
        <Text style={styles.postBody}>{truncate(data.description, 70)}</Text>
      </View>
      <View style={styles.statWrapper}>
        <View style={styles.reactionWrapper}>
          <LikesIconDetail iconName={'Love-Small_12x12px'} count={data.like_count} disabled />
        </View>
        <View style={styles.divider} />
        <View style={styles.reactionWrapper}>
          <LikesIconDetail disabled iconName={'Comment-Small_12x12px'} count={data.comment_count} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingLeft: wp('2.2%'),
    paddingRight: wp('2.2%'),
    paddingTop: wp('2.2%'),
    paddingBottom: wp('2.2%'),
  },
  emoji: {
    paddingLeft: wp('2.3%'),
    paddingRight: wp('1.0%'),
    paddingTop: wp('2.3%'),
    paddingBottom: wp('2.3%'),
  },
  count: {
    paddingLeft: wp('2.2%'),
    paddingRight: wp('2.2%'),
    paddingTop: wp('2.2%'),
    paddingBottom: wp('2.2%'),
    fontWeight: 'bold',
    color: '#999BA1',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#999BA1',
    alignSelf: 'center',
  },
  statWrapper: {
    borderBottomRightRadius: 23,
    borderLeftWidth: 1,
    borderLeftColor: '#999BA1',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postBody: {
    color: '#999BA1',
    fontWeight: '500',
  },
  textContainer: {
    maxWidth: wp('70%'),
    padding: wp('2.22%'),
  },
});

export default PostFooter;
