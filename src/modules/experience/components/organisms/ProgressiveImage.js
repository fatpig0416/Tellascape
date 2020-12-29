import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
// Load common styles
import { StyledWrapper } from '../../../core/common.styles';

const StyledImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

const StyledLoading = styled.ActivityIndicator`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ProgressiveImage = (props) => {
  const { width, height, backgroundColor, source, borderRadius = 0 } = props; // width and height of the container
  const [loading, setLoading] = useState(true);
  const onLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <StyledWrapper
      width={width}
      height={height}
      primary={'center'}
      secondary={'center'}
      style={{borderRadius:borderRadius}}
      backgroundColor={backgroundColor || 'rgba(0,0,0,0.1)'}
    >
      {loading ? <StyledLoading size="small" color="black" /> : null}
      <StyledImage source={source} onLoadEnd={onLoadEnd} style={{ borderRadius: borderRadius }} />
    </StyledWrapper>
  );
};

export default ProgressiveImage;
