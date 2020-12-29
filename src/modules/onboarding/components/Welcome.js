import React from 'react';
import { StyledMessageContainer, StyledMessageContentView } from './atoms';
import { MessageHeader, MessageBody } from './organisms';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const CONTENT = [
  'Tellascape is a user driven platform\nthat will keep track and organize all\nyour media content and details on\nyour journey map.',
  'Showcase the real you and share fun local hangouts with our community centric platform, designed with you in mind!',
  'With upcoming features to earn points\nand badges to build your experience\nlevels, we guarantee you have never\nseen anything like this before!',
  'Thank you for starting your\njourney with us!',
  '❤️  Tellascape Team.',
];

function Welcome(props) {
  const onBack = () => {
    props.navigation.goBack();
  };

  return (
    <StyledMessageContainer>
      <StyledMessageContentView>
        <MessageHeader source={images.WELCOME_IMAGE} onPress={onBack} headerText={'Ready\nto begin\nyour journey?'} />
        <MessageBody
          title={'Welcome to Tellascape!'}
          content={CONTENT}
          buttonText={'Meet Tellascape'}
          onPress={onBack}
        />
      </StyledMessageContentView>
    </StyledMessageContainer>
  );
}

export default Welcome;
