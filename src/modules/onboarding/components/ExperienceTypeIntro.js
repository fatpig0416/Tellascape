import React from 'react';
import { StyledMessageContainer, StyledMessageContentView } from './atoms';
import { MessageHeader, MessageBody } from './organisms';

// Load theme
import theme from '../../core/theme';
const { images } = theme;

const CONTENT = [
  'You can plan an event private or public, \nto help curate and organize the guestlist and all the media taken at everything from \na concert, wedding, to just a small get together.',
  'Now you can easily access media, authenticated using geofence technology, at your experience, without any hassle.',
  'Create a station to share a local fun spot, from a great restaurant to a hidden waterfall.',
  'Others can then view your station on explore page. and join in the fun!',
];

function ExperienceTypeIntro(props) {
  return (
    <StyledMessageContainer>
      <StyledMessageContentView>
        <MessageHeader
          source={images.EXPERIENCE_TYPES}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <MessageBody
          title={'Create Your Own Points of Interest!'}
          content={CONTENT}
          buttonText={'Perfect 👌'}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </StyledMessageContentView>
    </StyledMessageContainer>
  );
}

export default ExperienceTypeIntro;
