import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Image from 'react-native-image-progress';
import styled from 'styled-components/native';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import ExperienceActions from '../../experience/reducers/event/index';
import uuid from 'uuid';
import theme from '../../core/theme';
import ProgressiveImage from '../../experience/components/organisms/ProgressiveImage';
import { isJoinedEvent } from '../../../utils/funcs';
import moment from 'moment';
const { images, font } = theme;
const { width, height } = Dimensions.get('window');
const RADIUS = 15;
const TOTAL_SPACE_ROW = wp('11.1%'); // 4.44% * 2 + 2.22%

const LANDSCAPE_ROW = 'LANDSCAPE_ROW';
const LANDSCAPE_ROW_REVERTED = 'LANDSCAPE_ROW_REVERTED';
const PORTRAIT_ROW = 'PORTRAIT_ROW';
const PORTRAIT_ROW_REVERTED = 'PORTRAIT_ROW_REVERTED';
const GRID = 'GRID';
const GRID_REVERTED = 'GRID_REVERTED';
const SINGLE = 'SINGLE';

const THEME = [LANDSCAPE_ROW, LANDSCAPE_ROW_REVERTED, PORTRAIT_ROW, PORTRAIT_ROW_REVERTED, GRID, GRID_REVERTED, SINGLE];

const styles = StyleSheet.create({
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - wp('8.88%'), // 4.44%(16 <- 360 width) * 2
    marginTop: wp('2.22%'),
  },
});

const _4by3 = 4 / 3;

const StyledImageWrapper = styled.View``;

const StyledIconImage = styled.Image`
  height: ${wp('5.55%')};
  width: ${wp('5.55%')};
  position: absolute;
  bottom: 0;
  margin-left: ${wp('2.22%')};
  margin-bottom: ${wp('2.22%')};
`;

const renderIcon = (type) => {
  let icon;
  switch (type) {
    case 'event':
      icon = images.MARKER_EVENT;
      break;
    case 'memories':
      icon = images.MARKER_MEMORY;
      break;
    case 'station':
      icon = images.MARKER_STATION;
      break;
    default:
      break;
  }
  return icon;
};

const GridImage = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View>
        <ProgressiveImage
          source={{ uri: props.data.url }}
          width={props.width}
          height={props.height}
          borderRadius={props.borderRadius}
          backgroundColor={'white'}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

class SubGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type, data, onPress } = this.props;

    if (type === LANDSCAPE_ROW) {
      const left = data[0];
      const right = data[1];

      const leftWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const leftHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const rightWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const rightHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      return (
        <View style={styles.rowContainer}>
          <StyledImageWrapper>
            <GridImage
              data={left}
              width={leftWidth}
              height={leftHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(left)}
            />
            <StyledIconImage source={renderIcon(left.type)} />
          </StyledImageWrapper>
          <StyledImageWrapper>
            <GridImage
              data={right}
              width={rightWidth}
              height={rightHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(right)}
            />
            <StyledIconImage source={renderIcon(right.type)} />
          </StyledImageWrapper>
        </View>
      );
    } else if (type === LANDSCAPE_ROW_REVERTED) {
      const left = data[0];
      const right = data[1];

      const leftWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const leftHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const rightWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const rightHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;

      return (
        <View style={styles.rowContainer}>
          <StyledImageWrapper>
            <GridImage
              data={left}
              width={leftWidth}
              height={leftHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(left)}
            />
            <StyledIconImage source={renderIcon(left.type)} />
          </StyledImageWrapper>
          <StyledImageWrapper>
            <GridImage
              data={right}
              width={rightWidth}
              height={rightHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(right)}
            />
            <StyledIconImage source={renderIcon(right.type)} />
          </StyledImageWrapper>
        </View>
      );
    } else if (type === PORTRAIT_ROW) {
      const left = data[0];
      const right = data[1];

      const leftWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const leftHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;
      const rightWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const rightHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;

      return (
        <View style={styles.rowContainer}>
          <StyledImageWrapper>
            <GridImage
              data={left}
              width={leftWidth}
              height={leftHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(left)}
            />
            <StyledIconImage source={renderIcon(left.type)} />
          </StyledImageWrapper>
          <StyledImageWrapper>
            <GridImage
              data={right}
              width={rightWidth}
              height={rightHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(right)}
            />
            <StyledIconImage source={renderIcon(right.type)} />
          </StyledImageWrapper>
        </View>
      );
    } else if (type === PORTRAIT_ROW_REVERTED) {
      const left = data[0];
      const right = data[1];

      const leftWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const leftHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;
      const rightWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const rightHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;

      return (
        <View style={styles.rowContainer}>
          <StyledImageWrapper>
            <GridImage
              data={left}
              width={leftWidth}
              height={leftHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(left)}
            />
            <StyledIconImage source={renderIcon(left.type)} />
          </StyledImageWrapper>
          <StyledImageWrapper>
            <GridImage
              data={right}
              width={rightWidth}
              height={rightHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(right)}
            />
            <StyledIconImage source={renderIcon(right.type)} />
          </StyledImageWrapper>
        </View>
      );
    } else if (type === GRID) {
      const topLeft = data[0];
      const bottomLeft = data[1];
      const topRight = data[2];
      const bottomRight = data[3];

      const topLeftWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const topLeftHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const bottomLeftWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const bottomLeftHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;
      const bottomRightWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const bottomRightHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const topRightWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const topRightHeight = topLeftHeight + bottomLeftHeight - bottomRightHeight;

      return (
        <View style={styles.rowContainer}>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledImageWrapper>
              <GridImage
                data={topLeft}
                width={topLeftWidth}
                height={topLeftHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(topLeft)}
              />
              <StyledIconImage source={renderIcon(topLeft.type)} />
            </StyledImageWrapper>
            <StyledImageWrapper marginTop={wp('2.22%')}>
              <GridImage
                data={bottomLeft}
                width={bottomLeftWidth}
                height={bottomLeftHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(bottomLeft)}
              />
              <StyledIconImage source={renderIcon(bottomLeft.type)} />
            </StyledImageWrapper>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledImageWrapper>
              <GridImage
                data={topRight}
                width={topRightWidth}
                height={topRightHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(topRight)}
              />
              <StyledIconImage source={renderIcon(topRight.type)} />
            </StyledImageWrapper>
            <StyledImageWrapper marginTop={wp('2.22%')}>
              <GridImage
                data={bottomRight}
                width={bottomRightWidth}
                height={bottomRightHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(bottomRight)}
              />
              <StyledIconImage source={renderIcon(bottomRight.type)} />
            </StyledImageWrapper>
          </View>
        </View>
      );
    } else if (type === GRID_REVERTED) {
      const topLeft = data[0];
      const bottomLeft = data[1];
      const topRight = data[2];
      const bottomRight = data[3];

      const topRightWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const topRightHeight = ((width - TOTAL_SPACE_ROW) * 16) / 21;
      const bottomRightWidth = ((width - TOTAL_SPACE_ROW) * 4) / 7;
      const bottomRightHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const topLeftWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const topLeftHeight = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const bottomLeftWidth = ((width - TOTAL_SPACE_ROW) * 3) / 7;
      const bottomLeftHeight = topRightHeight + bottomRightHeight - topLeftHeight;

      return (
        <View style={styles.rowContainer}>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledImageWrapper>
              <GridImage
                data={topLeft}
                width={topLeftWidth}
                height={topLeftHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(topLeft)}
              />
              <StyledIconImage source={renderIcon(topLeft.type)} />
            </StyledImageWrapper>
            <StyledImageWrapper marginTop={wp('2.22%')}>
              <GridImage
                data={bottomLeft}
                width={bottomLeftWidth}
                height={bottomLeftHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(bottomLeft)}
              />
              <StyledIconImage source={renderIcon(bottomLeft.type)} />
            </StyledImageWrapper>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledImageWrapper>
              <GridImage
                data={topRight}
                width={topRightWidth}
                height={topRightHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(topRight)}
              />
              <StyledIconImage source={renderIcon(topRight.type)} />
            </StyledImageWrapper>
            <StyledImageWrapper marginTop={wp('2.22%')}>
              <GridImage
                data={bottomRight}
                width={bottomRightWidth}
                height={bottomRightHeight}
                borderRadius={RADIUS}
                onPress={() => onPress(bottomRight)}
              />
              <StyledIconImage source={renderIcon(bottomRight.type)} />
            </StyledImageWrapper>
          </View>
        </View>
      );
    } else {
      const image = data;
      const imageWidth = width - wp('8.88%');
      const imageHeight = (imageWidth * image.height) / image.width;

      return (
        <View style={styles.rowContainer}>
          <StyledImageWrapper>
            <GridImage
              data={image}
              width={imageWidth}
              height={imageHeight}
              borderRadius={RADIUS}
              onPress={() => onPress(image)}
            />
            <StyledIconImage source={renderIcon(image.type)} />
          </StyledImageWrapper>
        </View>
      );
    }
  }
}

class ImageGrid extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;

    var sumOfWidth = 0;
    var maxWidth = 0;
    this.data &&
      this.data.forEach((item) => {
        sumOfWidth += item.width;
        if (item.width > maxWidth) {
          maxWidth = item.width;
        }
      });
    const averageWidth = sumOfWidth / _.size(this.data);
    const cutWidth = averageWidth + (maxWidth - averageWidth) * 0.5;

    var largeLandscapeImages = [];
    var otherImages = [];

    this.data &&
      this.data.forEach((item) => {
        const { width, ratio } = item;
        if (ratio >= _4by3) {
          if (width >= cutWidth) {
            largeLandscapeImages.push(item);
          } else {
            otherImages.push(item);
          }
        } else {
          otherImages.push(item);
        }
      });

    const types = [];
    var index = 0;
    while (index < _.size(this.data)) {
      const randType = THEME[Math.floor(Math.random() * _.size(THEME))];

      if (_.size(types) > 0 && index > 0) {
        const prevType = types[_.size(types) - 1];

        if (randType === LANDSCAPE_ROW) {
          if (prevType === LANDSCAPE_ROW || prevType === GRID || prevType === PORTRAIT_ROW) {
          } else {
            if (_.size(this.data) - index > 2) {
              index += 2;
              types.push(randType);
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }

        if (randType === LANDSCAPE_ROW_REVERTED) {
          if (prevType === LANDSCAPE_ROW_REVERTED || prevType === GRID_REVERTED || prevType === PORTRAIT_ROW_REVERTED) {
          } else {
            if (_.size(this.data) - index > 2) {
              index += 2;
              types.push(randType);
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }

        if (randType === PORTRAIT_ROW) {
          if (prevType === PORTRAIT_ROW || prevType === GRID || prevType === LANDSCAPE_ROW) {
          } else {
            if (_.size(this.data) - index > 2) {
              index += 2;
              types.push(randType);
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }

        if (randType === PORTRAIT_ROW_REVERTED) {
          if (prevType === PORTRAIT_ROW_REVERTED || prevType === GRID_REVERTED || prevType === LANDSCAPE_ROW_REVERTED) {
          } else {
            if (_.size(this.data) - index > 2) {
              index += 2;
              types.push(randType);
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }

        if (randType === GRID) {
          if (
            prevType === GRID ||
            prevType === GRID_REVERTED ||
            prevType === LANDSCAPE_ROW ||
            prevType === PORTRAIT_ROW
          ) {
          } else {
            if (_.size(this.data) - index > 4) {
              index += 4;
              types.push(randType);
            } else if (_.size(this.data) - index == 4) {
              if (prevType === LANDSCAPE_ROW_REVERTED) {
                index += 1;
                types.push(SINGLE);
                index += 2;
                types.push(PORTRAIT_ROW_REVERTED);
              } else if (prevType === PORTRAIT_ROW_REVERTED) {
                index += 1;
                types.push(SINGLE);
                index += 2;
                types.push(prevType === LANDSCAPE_ROW_REVERTED);
              } else if (prevType === SINGLE) {
                index += 2;
                types.push(prevType === LANDSCAPE_ROW_REVERTED);
                index += 1;
                types.push(SINGLE);
              }
            } else if (_.size(this.data) - index == 3) {
              if (prevType === LANDSCAPE_ROW_REVERTED) {
                index += 2;
                types.push(PORTRAIT_ROW_REVERTED);
              } else if (prevType === PORTRAIT_ROW_REVERTED) {
                index += 2;
                types.push(prevType === LANDSCAPE_ROW_REVERTED);
              }
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }

        if (randType === GRID_REVERTED) {
          if (
            prevType === GRID ||
            prevType === GRID_REVERTED ||
            prevType === LANDSCAPE_ROW_REVERTED ||
            prevType === PORTRAIT_ROW_REVERTED
          ) {
          } else {
            if (_.size(this.data) - index > 4) {
              index += 4;
              types.push(randType);
            } else if (_.size(this.data) - index == 4) {
              if (prevType === LANDSCAPE_ROW) {
                index += 1;
                types.push(SINGLE);
                index += 2;
                types.push(PORTRAIT_ROW);
              } else if (prevType === PORTRAIT_ROW) {
                index += 1;
                types.push(SINGLE);
                index += 2;
                types.push(prevType === LANDSCAPE_ROW);
              } else if (prevType === SINGLE) {
                index += 2;
                types.push(prevType === PORTRAIT_ROW);
                index += 1;
                types.push(SINGLE);
              }
            } else if (_.size(this.data) - index == 3) {
              if (prevType === LANDSCAPE_ROW) {
                index += 2;
                types.push(PORTRAIT_ROW);
              } else if (prevType === PORTRAIT_ROW) {
                index += 2;
                types.push(prevType === LANDSCAPE_ROW);
              }
            } else if (_.size(this.data) - index == 2) {
              index += 1;
              types.push(SINGLE);
            } else if (_.size(this.data) - index <= 1) {
              index += 1;
            }
          }
        }
      } else {
        if (
          randType === LANDSCAPE_ROW ||
          randType === LANDSCAPE_ROW_REVERTED ||
          randType === PORTRAIT_ROW ||
          randType === PORTRAIT_ROW_REVERTED
        ) {
          index += 2;
        } else if (randType === GRID || randType === GRID_REVERTED) {
          index += 4;
        } else if (randType === SINGLE) {
          index += 1;
        }
        types.push(randType);
      }
    }

    var indexOfTheme = 0;
    var indexOfOthers = 0;
    var indexOfLargeLandscape = 0;
    this.collections = [];

    types.forEach((type) => {
      if (
        type === LANDSCAPE_ROW ||
        type === LANDSCAPE_ROW_REVERTED ||
        type === PORTRAIT_ROW ||
        type === PORTRAIT_ROW_REVERTED
      ) {
        if (indexOfOthers < _.size(otherImages) - 2) {
          this.collections.push({
            id: uuid.v4(),
            type: type,
            data: [otherImages[indexOfOthers], otherImages[indexOfOthers + 1]],
          });
          indexOfOthers += 2;
          indexOfTheme++;
        }
      }

      if (type === GRID || type === GRID_REVERTED) {
        if (indexOfOthers < _.size(otherImages) - 4) {
          this.collections.push({
            id: uuid.v4(),
            type: type,
            data: [
              otherImages[indexOfOthers],
              otherImages[indexOfOthers + 1],
              otherImages[indexOfOthers + 2],
              otherImages[indexOfOthers + 3],
            ],
          });

          indexOfOthers += 4;
          indexOfTheme++;
        }
      }

      if (type === SINGLE) {
        if (indexOfLargeLandscape < _.size(largeLandscapeImages)) {
          this.collections.push({
            id: uuid.v4(),
            type: type,
            data: largeLandscapeImages[indexOfLargeLandscape],
          });

          indexOfLargeLandscape++;
          indexOfTheme++;
        }
      }
    });
  }

  onEventPress = async (item) => {
    this.props.setEventLoad(false);
    let isJoin = await isJoinedEvent(this.props.navigation, this.props.experience, item.parentID, item.childID);
    if (!isJoin) {
      let now = moment().format('YYYY-MM-DD HH:mm:ss');
      let sDate = moment(item.sDate).format('YYYY-MM-DD HH:mm:ss');
      let eDate = moment(item.eDate).format('YYYY-MM-DD HH:mm:ss');
      if (now > eDate || item.is_deleted === 1) {
        // Post Event
        this.props.navigation.navigate('PostEvent', {
          parentID: item.parentID,
          childID: item.childID,
        });
      } else if (now > sDate && now < eDate) {
        // Live Event
        this.props.navigation.navigate('LiveEvent', {
          parentID: item.parentID,
          childID: item.childID,
        });
      } else {
        // View EVent
        this.props.navigation.navigate('ViewEvent', {
          parentID: item.parentID,
          childID: item.childID,
        });
      }
    }
  };

  render() {
    return (
      <FlatList
        data={this.collections}
        renderItem={({ item }) => {
          return (
            <SubGrid onPress={(item) => this.onEventPress(item)} key={item.id} type={item.type} data={item.data} />
          );
        }}
        scrollEnabled={false}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageGrid);