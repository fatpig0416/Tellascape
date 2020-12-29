import React, { Component } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { FlatList } from 'react-native';
import Contacts from 'react-native-contacts';

import {
  StyledContainer,
  ContactHeader,
  SearchInput,
  StyledContactBody,
  ContactUserItem,
  EmergencyItem,
} from './molecules/Forms';
import { StyledSeparator } from '../../core/common.styles';
import { Loading } from '../../../utils';

const checkSelection = (recordID, selectedArrayData) => {
  const isSelection = selectedArrayData.findIndex(item => item.recordID === recordID);
  return isSelection !== -1;
};

export default class AddContact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      loading: true,
      selectedContacts: [],
    };
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        this.loadContacts();
      });
    } else {
      this.loadContacts();
    }

    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.updateContacts();
    });
  }

  updateContacts = () => {
    const selectedContacts = this.props.navigation.getParam('previousContacts');
    this.setState({
      selectedContacts,
    });
  };

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.warn('Permission to access contacts was denied');
      } else {
        this.setState({ contacts, loading: false });
      }
    });

    Contacts.getCount(count => {
      this.setState({ searchPlaceholder: `Search ${count} contacts` });
    });
  }

  onGoback = () => {
    const { selectedContacts } = this.state;

    this.props.navigation.navigate('CreateSafe', { selectedContacts });
  };

  onSearch = text => {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === '' || text === null) {
      this.loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text, (_err, contacts) => {
        this.setState({ contacts });
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text, (_err, contacts) => {
        this.setState({ contacts });
      });
    } else {
      Contacts.getContactsMatchingString(text, (_err, contacts) => {
        this.setState({ contacts });
      });
    }
  };

  onSelectContact = contactItem => {
    const { selectedContacts } = this.state;
    const existedIndex = selectedContacts.findIndex(item => item.recordID === contactItem.recordID);
    if (existedIndex !== -1) {
      selectedContacts.splice(existedIndex, 1);
    } else {
      if (selectedContacts.length < 3) {
        selectedContacts.push(contactItem);
      }
    }
    this.setState({
      selectedContacts,
    });
  };

  onAddContacts = () => {
    const { selectedContacts } = this.state;

    this.props.navigation.navigate('CreateSafe', { selectedContacts });
  };

  render() {
    const { loading, contacts, selectedContacts } = this.state;

    return (
      <StyledContainer bgColor={'#fff'}>
        <ContactHeader onBack={this.onGoback} onAddContacts={this.onAddContacts} />
        {loading ? (
          <Loading />
        ) : (
          <StyledContactBody>
            <SearchInput onChangeText={this.onSearch} />

            <EmergencyItem />
            <StyledSeparator width={'100%'} height={0.5} bgColor={'#dddcde'} />
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <ContactUserItem
                  data={item}
                  onPress={() => this.onSelectContact(item)}
                  isSelected={checkSelection(item.recordID, selectedContacts)}
                />
              )}
              keyExtractor={(_item, index) => '' + index}
              ItemSeparatorComponent={() => <StyledSeparator width={'100%'} height={0.5} bgColor={'#dddcde'} />}
            />
          </StyledContactBody>
        )}
      </StyledContainer>
    );
  }
}
