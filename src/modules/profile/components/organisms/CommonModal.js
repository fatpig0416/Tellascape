import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, Dimensions, Modal } from 'react-native';
import TimeAgo from 'react-native-timeago';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';

// Load utils
import CustomIcon from '../../../../utils/icon/CustomIcon';
import { EXPERIENCE } from '../../../../utils/vals';
const { MEDIA_FILTER_DATA } = EXPERIENCE;

// Load theme
import theme from '../../../core/theme';
const { colors, font, sizes } = theme;

// Import common components
import { StyledSeparator } from '../../../core/common.styles';

const CONTENT_WIDTH = wp('95.56%');
const CONTENT_HEIGHT = wp('15.55%');
const CONTENT_BORDER_RADIUS = 14;

const StyledModalContainer = styled.View`
  width: ${wp('100%')};
  height: ${hp('100%')};
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const StyledModalBody = styled.View`
  width: ${CONTENT_WIDTH};
  background-color: 'rgba(249,249,249,0.78)';
  border-radius: ${CONTENT_BORDER_RADIUS};
  justify-content: center;
  align-items: center;
`;

const StyledContentButton = styled.TouchableOpacity`
  width: 100%;
  height: ${CONTENT_HEIGHT};
  justify-content: center;
  align-items: center;
`;

const StyledContentText = styled.Text`
  font-size: ${wp('5%')};
  color: #007aff;
  text-align: center;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

const StyledCancelButton = styled.TouchableOpacity`
  border-radius: ${CONTENT_BORDER_RADIUS};
  margin-top: ${wp('2.22%')};
  margin-bottom: ${wp('13.33%')};
  width: ${CONTENT_WIDTH};
  height: ${CONTENT_HEIGHT};
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const ContentButton = props => {
  const { content } = props;

  return (
    <StyledContentButton {...props}>
      <StyledContentText>{content}</StyledContentText>
    </StyledContentButton>
  );
};

const CancelButton = props => (
  <StyledCancelButton {...props}>
    <StyledContentText fontWeight={'bold'}>{'Cancel'}</StyledContentText>
  </StyledCancelButton>
);

const CommonModal = props => {
  const { isModalVisible, isBlur, onPressModalItem, onCancelModal, modalData } = props;

  const onPressContent = useCallback(
    value => {
      onPressModalItem(value);
    },
    [onPressModalItem]
  );

  const onPressCancel = useCallback(() => {
    onCancelModal();
  }, [onCancelModal]);

  const _renderModalBody = useCallback(() => {
    return (
      <StyledModalContainer>
        <StyledModalBody>
          <FlatList
            data={modalData}
            renderItem={({ item }) => <ContentButton content={item.label} onPress={() => onPressContent(item.value)} />}
            keyExtractor={(item, index) => '' + index}
            ItemSeparatorComponent={() => (
              <StyledSeparator width={CONTENT_WIDTH} height={1} bgColor={'rgba(17,17,17,0.5)'} opacity={0.5} />
            )}
            scrollEnabled={false}
          />
        </StyledModalBody>
        <CancelButton onPress={onPressCancel} />
      </StyledModalContainer>
    );
  }, [modalData, onPressCancel, onPressContent]);

  return (
    <Modal visible={isModalVisible} style={styles.modalContainer} onRequestClose={onCancelModal} >
      {isBlur ? <BlurView blurType="light">{_renderModalBody()}</BlurView> : _renderModalBody()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
});

export default CommonModal;
