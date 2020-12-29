import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../modules/core/theme';
import CustomIcon from '../utils/icon/CustomIcon';
import Tooltip from 'react-native-walkthrough-tooltip';
import Experience from '../modules/experience/components/Experience';
import ExperienceActions from '../modules/experience/reducers/event/index';
import { connect } from 'react-redux';
import StationActions from '../modules/experience/reducers/station';
import MemoryActions from '../modules/experience/reducers/memory';
import AnimatedProgressWheel from 'react-native-progress-wheel';

/** Safe mode */
import SafeAlert from '../modules/tellasafe/components/SafeAlert';
const { colors } = theme;

const StyledPlusButton = styled.View`
  width: 65;
  height: 65;
  border-radius: 35;
  justify-content: center;
  align-items: center;
  margin-top: 5;
  background-color: ${props => props.backgroundColor || '#41cabf'};
  overflow: hidden;
`;

const StylePluseWrapper = styled.View`
  width: 65;
  height: 65;
  border-radius: 35;
  justify-content: center;
  align-items: center;
  margin-top: 5;
  background-color: ${props => props.backgroundColor || '#41cabf'};
  overflow: hidden;
`;

const StyledButtonOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
const StyledArcView = styled.View`
  width: 80;
  height: 80;
  padding-top: 2;
  margin-top: -20;
  align-items: center;
  background-color: white;
  border-radius: 40;
`;

const StyledPlusAbsoluteContainer = styled.View`
  position: absolute;
`;

class PlusButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isSafeAlert: false,
      isLongFirst: true,
      isVisibleAlert: false,
    };
    this.counter;
  }

  onCloseToggle = () => {
    this.setState({ isOpen: false, isVisibleAlert: false, isSafeAlert: false });
  };

  onToggle = () => {
    const { experience, station, memory } = this.props;
    const { isSafeAlert, isVisibleAlert } = this.state;
    if (experience.activeExperience !== undefined && experience.activeExperience !== null) {
      this.props.setJoinEventClose(null);
      this.props.setEventLoad(false);
      this.props.navigation.navigate('JoinEvent', {
        parentID: experience.activeExperience.parentID,
        childID: experience.activeExperience.childID,
      });
    } else if (station.activeStation !== undefined && station.activeStation !== null) {
      this.props.setJoinEventClose(null);
      this.props.setStationLoad(false);
      this.props.navigation.navigate('JoinStation', {
        parentID: station.activeStation.parentID,
        childID: station.activeStation.childID,
      });
    } else if (memory.activeMemory !== undefined && memory.activeMemory !== null) {
      this.props.setJoinEventClose(null);
      this.props.setMemoryLoad(false);
      this.props.navigation.navigate('JoinMemory', {
        parentID: memory.activeMemory.parentID,
        childID: memory.activeMemory.childID,
      });
    } else {
      if (isVisibleAlert || isSafeAlert) {
        this.onStopLongPress();
      } else {
        if (this.props.showClose) {
          if (
            this.props.route === 'CreateEvent' ||
            this.props.route === 'CreateStation' ||
            this.props.route === 'PlanMemory'
          ) {
            this.props.navigation.popToTop();
            this.props.navigation.navigate('HomeBottom');
          } else {
            this.props.navigation.pop();
          }
        } else {
          this.setState(prevState => ({
            isOpen: !prevState.isOpen,
          }));
        }
      }
    }
    this.setState({
      isVisibleAlert: false,
      isSafeAlert: false,
    });
  };

  onLongPress = () => {
    const { experience, station, memory } = this.props;
    let isLongPress = true;
    if (
      (experience.activeExperience !== undefined && experience.activeExperience !== null) ||
      (station.activeStation !== undefined && station.activeStation !== null) ||
      (memory.activeMemory !== undefined && memory.activeMemory !== null)
    ) {
      isLongPress = false;
    }

    if (!this.state.isOpen && isLongPress && !this.props.showClose) {
      this.counter = setTimeout(() => {
        this.setState({
          isVisibleAlert: true,
        });
      }, 1500);
      this.setState(prevState => ({
        isSafeAlert: true,
      }));
    }
  };
  onStopLongPress = () => {
    this.setState({
      isSafeAlert: false,
      isVisibleAlert: false,
    });
    this.setState(prevState => ({
      isOpen: prevState.isOpen,
    }));
    clearTimeout(this.counter);
  };

  onCloseSafeAlert = () => {
    this.setState({
      isSafeAlert: false,
      isVisibleAlert: false,
    });
  };

  onPressOut = () => {
    const { isVisibleAlert } = this.state;
    if (!isVisibleAlert) {
      this.onStopLongPress();
    }
  };

  render() {
    const { isOpen, isSafeAlert, isVisibleAlert } = this.state;
    const { navigation, showClose, experience, route, station, memory } = this.props;
    const { routeName, params } = navigation.state.routes[navigation.state.index];
    let xIconColor = colors.White;
    if (route === 'CreateEvent' || route === 'EditEvent') {
      xIconColor = theme.orange.icon;
    } else if (route === 'CreateStation' || route === 'EditStation') {
      xIconColor = theme.blue.icon;
    } else if (route === 'PlanMemory') {
      xIconColor = theme.cyan.icon;
    } else if (route === 'Map') {
      if (params.original !== undefined && params.original === 'station') {
        xIconColor = theme.blue.icon;
      } else if (params.original !== undefined && params.original === 'memory') {
        xIconColor = theme.cyan.icon;
      } else {
        xIconColor = theme.orange.icon;
      }
    } else {
      xIconColor = colors.White;
    }
    return (
      <StyledArcView>
        <Tooltip
          childContentSpacing={5}
          tooltipStyle={styles.tootipStyle}
          contentStyle={styles.tootipContent}
          arrowSize={styles.tooltipArrow}
          displayInsets={styles.tooltopDisplayInsets}
          isVisible={isOpen || isVisibleAlert}
          backgroundColor={isSafeAlert ? 'rgba(10,18,19,0.94)' : 'rgba(0,0,0,0.8)'}
          arrowStyle={styles.arrowStyle}
          content={
            isSafeAlert && isVisibleAlert ? (
              <SafeAlert onCloseToggle={this.onCloseSafeAlert} navigation={navigation} />
            ) : (
              <Experience navigation={navigation} onToggle={this.onToggle} onCloseToggle={this.onCloseToggle} />
            )
          }
          placement="top"
          onClose={() => {}}
        >
          <TouchableOpacity
            onPress={this.onToggle}
            onLongPress={this.onLongPress}
            onPressOut={this.onPressOut}
            activeOpacity={0.5}
          >
            {isSafeAlert ||
            (experience.activeExperience !== undefined && experience.activeExperience !== null) ||
            ((station.activeStation !== undefined && station.activeStation !== null) ||
              (memory.activeMemory !== undefined && memory.activeMemory !== null)) ? (
              !isSafeAlert ? (
                <StyledPlusButton ref={ref => (this.touchable = ref)}>
                  <StyledButtonOverlay
                    start={{ x: 0.28, y: 0 }}
                    end={{ x: 0.72, y: 1 }}
                    colors={['#6C6C6C', '#6C6C6C']}
                  />
                  <CustomIcon
                    name={'close-24px'}
                    size={30}
                    color={
                      experience.activeExperience !== null
                        ? colors.Orange
                        : station.activeStation !== null
                        ? theme.blue.icon
                        : theme.cyan.icon
                    }
                  />
                </StyledPlusButton>
              ) : (
                <>
                  {!isVisibleAlert ? (
                    <StylePluseWrapper>
                      <StyledButtonOverlay
                        start={{ x: 0.28, y: 0 }}
                        end={{ x: 0.72, y: 1 }}
                        colors={['#6C6C6C', '#6C6C6C']}
                      />

                      <CustomIcon
                        name={'close-24px'}
                        size={30}
                        color={
                          experience.activeExperience !== null
                            ? colors.Orange
                            : station.activeStation !== null
                            ? theme.blue.icon
                            : theme.cyan.icon
                        }
                      />

                      <StyledPlusAbsoluteContainer>
                        <AnimatedProgressWheel
                          progress={100}
                          width={2}
                          size={65}
                          animateFromValue={0}
                          duration={1500}
                          color={'#ff6c6f'}
                          fullColor={'#e14e55'}
                        />
                      </StyledPlusAbsoluteContainer>
                    </StylePluseWrapper>
                  ) : (
                    <>
                      <StyledPlusButton backgroundColor={!isVisibleAlert ? 'transparent' : 'rgba(0,0,0,0.54)'}>
                        <CustomIcon name={'close-24px'} size={30} color={'#FF6C6F'} />
                      </StyledPlusButton>
                    </>
                  )}
                </>
              )
            ) : (
              <StyledPlusButton ref={ref => (this.touchable = ref)}>
                <StyledButtonOverlay
                  start={{ x: 0.28, y: 0 }}
                  end={{ x: 0.72, y: 1 }}
                  colors={
                    route === 'Map' ||
                    route === 'CreateEvent' ||
                    route === 'EditEvent' ||
                    route === 'CreateStation' ||
                    route === 'EditStation' ||
                    route === 'PlanMemory'
                      ? ['#6C6C6C', '#6C6C6C']
                      : ['#45D8BFFF', '#2E87BE00']
                  }
                />
                {experience.activeExperience !== undefined && experience.activeExperience === null ? (
                  <CustomIcon
                    name={showClose ? 'close-24px' : !isOpen ? 'add-24px' : 'close-24px'}
                    size={!isOpen ? 30 : 35}
                    color={xIconColor}
                  />
                ) : (
                  <CustomIcon name={'close-24px'} size={!isOpen ? 45 : 35} color={colors.White} />
                )}
              </StyledPlusButton>
            )}
          </TouchableOpacity>
        </Tooltip>
      </StyledArcView>
    );
  }
}

const styles = StyleSheet.create({
  tootipContent: {
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 20,
    shadowColor: 'red',
  },
  tootipStyle: {
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  tooltipArrow: { width: 32, height: 16 },
  tooltopDisplayInsets: { top: 0, bottom: 0, left: 0, right: 0 },
  arrowStyle: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.LightGreyTwo,
    transform: [{ rotate: '180deg' }],
    margin: 0,
    marginLeft: 0,
    borderWidth: 0,
    borderColor: 'black',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    experience: state.experience,
    station: state.station,
    memory: state.memory,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setJoinEventClose: obj => {
      dispatch(ExperienceActions.setJoinEventClose(obj));
    },
    setEventLoad: obj => {
      dispatch(ExperienceActions.setEventLoad(obj));
    },
    setStationLoad: obj => {
      dispatch(StationActions.setStationLoad(obj));
    },
    setMemoryLoad: obj => {
      dispatch(MemoryActions.setMemoryLoad(obj));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlusButton);
