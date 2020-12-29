import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyledMessageTitle, StyledMessageContent } from '../atoms';
import { MessageGradientButton } from '../molecules';

// Load common components from common styles
import { StyledWrapper } from '../../../core/common.styles';

const StyledBodyWrapper = styled.View`
  flex: 1;
  padding-left: ${wp('4.44%')};
  padding-right: ${wp('4.44%')};
  padding-top: ${wp('2.22%')};
  padding-bottom: ${wp('2.22%')};
`;

const MessageBody = props => {
  const { title, content } = props;

  return (
    <StyledBodyWrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', height: '100%' }}>
        <StyledMessageTitle>{title}</StyledMessageTitle>

        <StyledWrapper marginTop={5}>
          {content.map((item, index) => (
            <StyledMessageContent key={'' + index}>{item}</StyledMessageContent>
          ))}
        </StyledWrapper>

        <StyledWrapper marginTop={24} secondary={'center'}>
          <MessageGradientButton {...props} />
        </StyledWrapper>
      </ScrollView>
    </StyledBodyWrapper>
  );
};
export default MessageBody;
