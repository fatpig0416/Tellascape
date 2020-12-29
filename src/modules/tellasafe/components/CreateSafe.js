import React, { Component } from 'react';
import { View, FlatList, Alert, TextInput, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import { StyledWrapper, timelineStyles, StyledSeparator } from '../../core/common.styles';
import {
  Header,
  StyledBody,
  StyledBigText,
  UserItem,
  StyledCard,
  StyledListText,
  DetailEditButton,
  PlusButton,
  RedButton,
  InputText,
} from './molecules/Forms';

import * as geolib from 'geolib';
import _ from 'lodash/fp';
import { getUserCurrentLocation } from '../../../utils/funcs';

// Import reducers and selecotrs
import { connect } from 'react-redux';
import SafeActions from '../reducers/index';
import { createStructuredSelector } from 'reselect';
import { selectAccessToken, selectUid } from '../../auth/reducers';
import { selectGeofence, selectSettings } from '../reducers/index';

// Load utils
import CustomIcon from '../../../utils/icon/CustomIcon';
import { Loading } from '../../../utils';
import theme from '../../core/theme';
const { images, colors, font, sizes } = theme;

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    fontSize: wp('3.61%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#2f2f2f',
    borderBottomColor: '#9A999B',
    borderBottomWidth: 0.5,
    paddingBottom: wp('0.8%'),
    marginTop: wp('1.6%'),
    marginBottom: wp('1.5%'),
  },
  labelStyle: {
    fontSize: wp('2.5%'),
    fontFamily: font.MRegular,
    fontWeight: '500',
    color: '#9A999B',
  },
});

class CreateSafe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLineData: [],
      initialRegion: {
        latitude: -29.1482491,
        longitude: -51.1559028,
        latitudeDelta: 0.0922 * 1.5,
        longitudeDelta: 0.0421 * 1.5,
      },
      loading: false,
      coordinates: [],
      isCreated: false,
      messageText: '',
      selectedContacts: [],
      prevContact: 0,
      fistLoaded: true,
    };
    this.openMap = this.openMap.bind(this);
    this._renderSettings = this._renderSettings.bind(this);
  }

  componentDidMount = async () => {
    this.props.setGeofence(null);
    const flashIconImage = await this.getIconImageSource('privacy-handshake-icon-wrapcopy');
    const locationIconImage = await this.getIconImageSource('my_location-24px');
    CustomIcon.getImageSource('circle', 10, '#EFEFEF').then(source =>
      this.setState({
        timeLineData: [
          {
            icon: flashIconImage,
            title: 'Emergency Contacts',
          },
          {
            icon: locationIconImage,
            title: 'Actions',
          },
          {},
        ],
      })
    );

    this.props.navigation.addListener('didFocus', payload => {
      const selectedContacts = this.props.navigation.getParam('selectedContacts');
      if (selectedContacts && selectedContacts.length > 0) {
        this.setState({
          selectedContacts,
        });
      }
    });

    const obj = {
      token: this.props.access_token,
      onSuccess: this.onGetSettingsSuccess,
    };
    this.props.onGetSettings(obj);
  };

  onGetSettingsSuccess = response => {
    if (response.data) {
      // initialize selected contacts
      let selectedContacts = [];
      let lists = this.props.settings.contacts;
      for (var key in lists) {
        let username = lists[key].name;
        let name = username.split(' ');
        let obj = {
          recordID: key,
          phone: lists[key].phone,
          givenName: name[0],
          familyName: name[1],
        };
        selectedContacts.push(obj);
      }
      this.setState({
        selectedContacts,
        messageText: response.data.message || 'I need help right now',
        prevContact: selectedContacts.length,
      });
    }
  };

  componentDidUpdate() {
    if (!this.state.isCreated) {
      if (this.props.geofence) {
        var coordinates = [];
        const geofence = this.props.geofence;

        if (geofence.shape === 'polygon') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        } else if (geofence.shape === 'rectangle') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        } else if (geofence.shape === 'circle') {
          coordinates = geofence.data.coordinates[0].map(item => ({
            latitude: item[1],
            longitude: item[0],
          }));
        }

        const center = geolib.getCenterOfBounds(coordinates);
        const bounds = geolib.getBounds(coordinates);
        const latitudeDelta = Math.abs(center.latitude - bounds.minLat) * 2.6;
        const longitudeDelta = Math.abs(center.longitude - bounds.minLng) * 2.6;

        if (!_.isEqual(this.state.coordinates, coordinates)) {
          this.setState({
            coordinates: coordinates,
            initialRegion: {
              latitude: center.latitude,
              longitude: center.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            },
          });
        }
      }
      if (this.props.data) {
        // this.setState({loading: false});
      }
    } else {
      this.setState({
        isCreated: false,
      });
    }
  }

  openMap = () => {
    this.props.navigation.push('SafeMap', {
      isUpdate: false,
      original: 'safe',
    });
  };

  getIconImageSource = iconName => {
    return CustomIcon.getImageSource(iconName, 20, '#939393');
  };

  onGoBack = () => {
    this.props.navigation.navigate('Trending');
  };

  toAddContact = () => {
    this.props.navigation.navigate('AddContact', { previousContacts: this.state.selectedContacts });
  };

  onChangeMessageText = text => {
    this.setState({
      messageText: text,
    });
  };

  onSave = async () => {
    let location = await getUserCurrentLocation();
    const tellasafeObj = new FormData();

    let contact_lists = [];
    const { selectedContacts, prevContact } = this.state;

    selectedContacts.forEach(c => {
      if (c.phoneNumbers !== undefined) {
        let phoneNum = c.phoneNumbers[0].number;
        let phone = phoneNum.replace(/[\s\-&\/\\#,+()$~%.'":*?<>{}]+/g, '');
        let cleanPhoneNumber;
        if (phone.length > 10) {
          cleanPhoneNumber = '+1' + phone.substr(1);
        } else {
          cleanPhoneNumber = '+1' + phone;
        }
        let contactObj = {
          id: c.recordID,
          name: c.givenName + ' ' + c.familyName,
          phone: cleanPhoneNumber,
        };
        contact_lists.push(contactObj);
      } else {
        let contactObj = {
          id: c.recordID,
          name: c.givenName + ' ' + c.familyName,
          phone: c.phone,
        };
        contact_lists.push(contactObj);
      }
    });

    let message = this.state.messageText;
    if (_.isEmpty(message, true)) {
      message = 'I need help right now.';
    }
    tellasafeObj.append('token', this.props.access_token);
    tellasafeObj.append('message', message);
    tellasafeObj.append('contacts', JSON.stringify(contact_lists));
    tellasafeObj.append('isNew', selectedContacts.length > prevContact ? true : false);
    /*
    tellasafeObj.append('fenceBuffer', JSON.stringify(this.props.geofence.fenceBuffer));
    tellasafeObj.append('fenceJson', JSON.stringify(this.props.geofence.data));
    tellasafeObj.append('fenceType', this.props.geofence.shape);
    */
    try {
      let obj = {
        formData: tellasafeObj,
        saveSettingsSuccess: this.saveSettingsSuccess,
        saveSettingsFailure: this.saveSettingsFailure,
        location: location,
      };

      await this.props.onSaveSettings(obj);
      await this.props.setGeofence(null);
      this.setState({
        loading: true,
      });
    } catch (error) {
      Alert.alert('Warning', 'Tellasafe settings update failed.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  saveSettingsSuccess = response => {
    this._renderSettings(response.data);
  };

  _renderSettings = data => {
    Alert.alert('Tellasafe', 'Settings has been updated.', [
      {
        text: 'Okay, Thanks',
        onPress: () => {
          this.props.navigation.popToTop();
          this.props.navigation.navigate('HomeBottom');
        },
      },
    ]);
    this.setState({
      loading: false,
    });
  };

  saveSettingsFailure = () => {
    this.setState({ loading: false });
    Alert.alert('Warning', 'Tellasafe setting update failed, try again.', [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  onDelete = recordID => {
    Alert.alert('', 'Do you wants to remove this emergency contacts for alert notification ?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          const { selectedContacts } = this.state;
          let newSelectedContacts = [...selectedContacts];

          const delIndex = selectedContacts.findIndex(ele => ele.recordID === recordID);
          if (delIndex !== -1) {
            newSelectedContacts.splice(delIndex, 1);
          }

          this.setState({
            selectedContacts: newSelectedContacts,
          });
        },
      },
    ]);
  };

  renderDetail = (rowData, sectionID, rowID) => {
    const { selectedContacts } = this.state;

    const sectionTitleComp = <StyledBigText>{rowData.title}</StyledBigText>;
    let content = null;
    switch (sectionID) {
      case 0:
        content = (
          <StyledCard>
            <FlatList
              data={selectedContacts}
              renderItem={({ item }) => (
                <UserItem
                  data={item}
                  onPress={() => this.onDelete(item.recordID)}
                  onLongPress={() => this.onDelete(item.recordID)}
                />
              )}
              keyExtractor={(item, index) => '' + index}
              ItemSeparatorComponent={() => <StyledSeparator width={'100%'} height={0.5} bgColor={'#dddcde'} />}
            />
            {selectedContacts.length > 0 ? <StyledSeparator width={'100%'} height={0.5} bgColor={'#dddcde'} /> : null}

            <StyledWrapper row secondary={'center'} marginTop={wp('1.52%')} marginBottom={wp('1.52%')}>
              <PlusButton onPress={this.toAddContact} />
              <StyledListText>{'Add Contact'}</StyledListText>
            </StyledWrapper>
          </StyledCard>
        );
        break;
      case 1:
        content = (
          <StyledCard>
            {/* <DetailEditButton buttonText={'Send Message & Location'} onPress={this.openMap} /> */}
            <StyledWrapper marginTop={wp('1.5%')}>
              <Text style={styles.labelStyle}>{'Message Text'}</Text>
              <TextInput
                value={this.state.messageText}
                onChangeText={val => this.setState({ messageText: val })}
                underlineColorAndroid={'transparent'}
                style={styles.inputStyle}
              />
            </StyledWrapper>
          </StyledCard>
        );
        break;
      default:
        const isEnabled = true;
        content = (
          <StyledWrapper paddingBottom={wp('18.33%')}>
            <RedButton isEnabled={isEnabled} onPress={this.onSave} />
          </StyledWrapper>
        );
        break;
    }
    return (
      <View>
        {sectionTitleComp}
        {content}
      </View>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <>
            <KeyboardAwareScrollView scrollEnabled={true}>
              <StyledBody>
                <Timeline
                  style={timelineStyles.list}
                  listViewStyle={timelineStyles.listViewStyle}
                  data={this.state.timeLineData}
                  renderDetail={this.renderDetail}
                  lineColor={'rgba(215, 215, 215, 0.5)'}
                  lineWidth={2}
                  innerCircle={'icon'}
                  showTime={false}
                  circleSize={34}
                  circleColor={'#eaeaea'}
                  iconStyle={timelineStyles.iconStyle}
                  options={{
                    showsVerticalScrollIndicator: false,
                  }}
                />
              </StyledBody>
            </KeyboardAwareScrollView>
            <Header onBack={this.onGoBack} />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  access_token: selectAccessToken,
  uid: selectUid,
  geofence: selectGeofence,
  settings: selectSettings,
});

const mapDispatchToProps = dispatch => {
  return {
    setGeofence: obj => {
      dispatch(SafeActions.setGeofence(obj));
    },
    onSaveSettings: data => {
      dispatch(SafeActions.saveSettings(data));
    },
    onGetSettings: data => {
      dispatch(SafeActions.getSettings(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSafe);
