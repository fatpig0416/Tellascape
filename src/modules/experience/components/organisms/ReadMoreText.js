import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReadMore from 'react-native-read-more-text';
// Load common components
import { StyledWrapper, StyledButton } from '../../../core/common.styles';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';

// Load theme
import theme from '../../../core/theme';
const { font } = theme;

const StyledMoreText = styled.Text`
  font-size: ${wp('3.055%')};
  color: #ff9076;
  font-family: ${font.MSemiBold};
  margin-left: 4;
`;

const MoreButton = props => {
  const { handlePress, isMore } = props;

  return (
    <StyledButton onPress={handlePress}>
      <StyledWrapper row secondary={'center'} marginLeft={-4}>
        <CustomIcon name={isMore ? 'expand_more-24px' : 'expand_less-24px'} size={20} color={'#ff9076'} />
        <StyledMoreText>{isMore ? 'more' : 'less'}</StyledMoreText>
      </StyledWrapper>
    </StyledButton>
  );
};

const StyledDescription = styled.Text`
  font-size: ${wp('3.05%')};
  line-height: ${wp('4.72%')};
  font-family: ${font.MRegular};
  font-weight: 500;
  color: #8f8f8f;
  margin-left: ${props => props.marginLeft || 0};
`;

const ReadMoreText = props => {
  const { content, limitLines } = props;

  return (
    <ReadMore
      numberOfLines={limitLines || 3}
      renderTruncatedFooter={handlePress => <MoreButton isMore handlePress={handlePress} />}
      renderRevealedFooter={handlePress => <MoreButton handlePress={handlePress} />}
      onReady={this._handleTextReady}
    >
      <StyledDescription>{content}</StyledDescription>
    </ReadMore>
  );
};

export default ReadMoreText;
