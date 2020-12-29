import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import TextAvatar from 'react-native-text-avatar';
import styled from 'styled-components/native';

const bgColors = [
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e67e22', // carrot
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50', // midnight blue
];

const sumChars = str => {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
};

const generateBackgroundStyle = name => {
  let background;
  const i = sumChars(name) % bgColors.length;
  background = bgColors[i];

  return background;
};

const StyledUserAvatar = styled(FastImage)`
  width: ${wp('8.88%')};
  height: ${wp('8.88%')};
  border-radius: ${wp('4.44%')};
`;

const CustomTextAvatar = props => {
  const { givenName, familyName, hasThumbnail, thumbnailPath } = props.data;

  return (
    <>
      {hasThumbnail ? (
        <StyledUserAvatar source={{ uri: thumbnailPath }} />
      ) : (
        <TextAvatar
          backgroundColor={generateBackgroundStyle(`${givenName} ${familyName}`)}
          textColor={'#fff'}
          size={wp('8.88%')}
          type={'circle'} // optional
        >
          {`${givenName} ${familyName}`}
        </TextAvatar>
      )}
    </>
  );
};

export default CustomTextAvatar;
