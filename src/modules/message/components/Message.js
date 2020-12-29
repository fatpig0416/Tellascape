import React, { Component } from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, FlatList, SafeAreaView, View, StyleSheet, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
// Load theme
import theme from '../../core/theme';
const { font } = theme;
import { DEFAULT_FOUNDER_ID } from '../../../utils/vals';

// Import common styles
import { StyledButtonOverlay, StyledWrapper, StyledButton, StyledHorizontalContainer } from '../../core/common.styles';
import CustomIcon from '../../../utils/icon/CustomIcon';
import { connect } from 'react-redux';
import ContactAction from '../reducers/index';
import ExperienceActions from '../../experience/reducers/event/index';

const StyledContainer = styled.View`
  flex: 1;
  width: ${wp('100%')};
  height: ${hp('100%')};
  background-color: #e8e8e8;
`;

const StyledHeader = styled.View`
  width: ${wp('100%')};
`;

const StyledSearchIconWrapper = styled.View`
  margin-left: ${wp('2.22%')};
  margin-right: ${wp('2.22%')};
  align-items: center;
`;

const StyledSearchInput = styled.TextInput`
  width: 100%;
  padding: 0;
  font-size: ${wp('3.33%')};
  font-family: ${font.MRegular};
  color: #000;
`;

const SearchInput = props => {
  return (
    <StyledWrapper
      row
      width={'75.27%'}
      height={wp('8.88%')}
      borderRadius={wp('4.44%')}
      marginBottom={wp('1.11%')}
      secondary={'center'}
      backgroundColor={'#eeeeee'}
    >
      <StyledSearchIconWrapper>
        <CustomIcon name={'Common-Search_20x20px'} size={16} color={'#808080'} />
      </StyledSearchIconWrapper>
      <StyledSearchInput placeholder={'Search Users'} placeholderTextColor={'#808080'} {...props} />
    </StyledWrapper>
  );
};

const StyledCancelText = styled.Text`
  font-size: ${wp('3.33%')};
  font-family: ${font.MRegular};
  color: #fff;
`;

const StyledMessageText = styled.Text`
  font-size: ${wp('4.44%')};
  font-family: ${font.MBlack};
  color: #fff;
  letter-spacing: 0.33;
  align-self: center;
`;

const StyledPencilButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  align-self: center;
`;

const StyledUserAvatarWrapper = styled.TouchableOpacity`
  width: ${hp('6.9%')};
  height: ${hp('6.9%')};
  border-radius: ${hp('3.45%')};
  justify-content: center;
  align-items: center;
  padding: 2px 2px 2px 2px;
  border-color: #fe7f7e;
  margin-top: 10px;
  margin-left: 10px;
  border-width: ${wp('0.2%')};
`;
const StyledUserAvatar = styled.Image`
  width: ${hp('6.25%')};
  height: ${hp('6.25%')};
  border-radius: ${hp('3.125%')};
`;

const StyledUserNameText = styled.Text`
  font-size: ${hp('2.2%')};
  color: #000000;
  font-family: ${font.MRegular};
  font-weight: 500;
  margin-left: ${wp('3.33%')};
`;

const StyledNomessageText = styled.Text`
  font-size: ${wp('3.33%')};
  line-height: ${wp('5%')};
  font-family: ${font.MRegular};
  color: #131313;
  opacity: 0.8;
  margin-top: ${wp('5.27%')};
`;

const StyledDescriptionText = styled.Text`
  font-size: ${wp('3.33%')};
  line-height: ${wp('4.44%')};
  font-family: ${font.MRegular};
  color: #b8b8b8;
  opacity: 0.8;
  margin-top: ${wp('3.05%')};
  text-align: center;
`;

const Header = props => {
  const { searchText, onChangeText } = props;
  return (
    <StyledHeader>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgba(94,238,230,0.94)', 'rgba(54,206,202,0.94)']}
        style={styles.headerContainer}
      >
        <SafeAreaView>
          <StyledWrapper
            row
            width={'100%'}
            primary={'space-between'}
            secondary={'center'}
            style={{ marginTop: wp('4%') }}
          >
            <SearchInput value={searchText} onChangeText={onChangeText} />
            <StyledButton onPress={() => [Keyboard.dismiss(), onChangeText('')]}>
              <StyledCancelText>{'Clear'}</StyledCancelText>
            </StyledButton>
          </StyledWrapper>
        </SafeAreaView>
      </LinearGradient>
    </StyledHeader>
  );
};

const Nomessage = props => (
  <StyledWrapper width={wp('100%')} height={hp('85.2%')} primary={'center'} secondary={'center'}>
    <CustomIcon name={'Navbar_Messages_32px'} size={56} color={'#C2C2C2'} />
    <StyledNomessageText>{'You Don’t Have Messages Yet…'}</StyledNomessageText>
    <StyledDescriptionText>
      {'Direct Messages are private conversations\nbetween you and other people in Tellascape'}
    </StyledDescriptionText>
  </StyledWrapper>
);

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
    };
  }

  componentDidMount = () => {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {
        this._fetchData();
      }),
    ];
  };

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  _fetchData = () => {
    const obj = {
      token: this.props.auth.access_token,
    };
    this.props.onGetContacts(obj);
  };

  onChangeSearchText = text => {
    this.setState({
      searchText: text,
    });
  };

  navigateToProfile = uid => {
    if (uid !== DEFAULT_FOUNDER_ID) {
      this.props.setProfileLoad(false);
      this.props.navigation.push('ViewProfile', { uid: uid });
    }
  };

  navigateToChat = item => {
    let username = item.name;
    let uid = item.uid;
    this.props.navigation.navigate('Chat', { uid, title: username });
  };
  filterData = contacts => {
    const { searchText } = this.state;
    let filteredData = contacts;
    if (contacts.length > 0) {
      if (searchText.length > 0) {
        filteredData = contacts.filter(function(item) {
          const itemTitleData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textTitleData = searchText.toUpperCase();
          return itemTitleData.includes(textTitleData);
        });
      }
    }
    return filteredData;
  };
  render() {
    const { searchText } = this.state;
    const { contacts } = this.props.messages;
    let filterContactData = this.filterData(contacts);
    return (
      <StyledContainer>
        <Header onChangeText={this.onChangeSearchText} searchText={searchText} />
        {filterContactData.length > 0 ? (
          <FlatList
            data={filterContactData}
            renderItem={({ item }) => (
              <StyledHorizontalContainer>
                {/** User avatar */}
                <StyledUserAvatarWrapper>
                  <TouchableWithoutFeedback onPress={() => this.navigateToProfile(item.uid)}>
                    <StyledUserAvatar source={item.profile_photo ? { uri: item.profile_photo } : ''} />
                  </TouchableWithoutFeedback>
                </StyledUserAvatarWrapper>

                {/** User name */}
                <TouchableWithoutFeedback onPress={() => this.navigateToChat(item)}>
                  <StyledUserNameText>{`${item.name || ''}`}</StyledUserNameText>
                </TouchableWithoutFeedback>
              </StyledHorizontalContainer>
            )}
            //Setting the number of column
            contentContainerStyle={{ alignSelf: 'flex-start', marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Nomessage />
        )}
      </StyledContainer>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingLeft: wp('4%'),
    paddingRight: wp('2%'),
    paddingBottom: wp('2.2%'),
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    messages: state.messages,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetContacts: obj => {
      dispatch(ContactAction.getContact(obj));
    },
    setProfileLoad: obj => {
      dispatch(ExperienceActions.setProfileLoad(obj));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);
