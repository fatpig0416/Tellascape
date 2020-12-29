import React, { Component } from 'react';
import styled from 'styled-components/native';

// Load theme
import theme from '../../../core/theme';
const { images } = theme;

// Import organisms
import PhotoZoomModal from '../organisms/PhotoZoomModal';
import LiveHeader from '../organisms/LiveHeader';
import LiveSubHeader from '../organisms/LiveSubHeader';
import ViewMedia from '../organisms/ViewMedia';
import GuestLists from '../organisms/GuestLists';
import Details from '../organisms/Details';

const StyledContainer = styled.View`
  flex: 1;
  background-color: #d9d9d9;
`;

export default class OtherUserExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaButtonType: 0, // 0: media button, 1: guests button, 2: details button
      selectedEntryIndex: 0,
      isZoomModalVisible: false,
    };
  }

  onPressHeaderButton = index => {
    this.setState({
      mediaButtonType: index,
      selected: null,
    });
  };

  onChangeFilterOption = value => {
    this.setState({
      selected: value,
    });
  };

  onGoBack = () => {
    // this.props.navigation.goBack();
  };

  onToggleZoomModal = () => {
    this.setState(prevState => ({
      isZoomModalVisible: !prevState.isZoomModalVisible,
    }));
  };

  onChangeSelectedEntryIndex = slideIndex => {
    this.setState({
      selectedEntryIndex: slideIndex,
    });
  };

  render() {
    const { mediaButtonType, selectedEntryIndex, isZoomModalVisible } = this.state;

    return (
      <StyledContainer>
        {/** Header section */}
        <LiveHeader onGoBack={this.onGoBack} name={'Pardeep Singhal'} avatarSource={''} title={'Blue Sky'} />
        <LiveSubHeader buttonType={mediaButtonType} onPress={this.onPressHeaderButton} />

        {/** Media */}
        {mediaButtonType === 0 ? (
          <ViewMedia
            mediaData={CAROUSEL_DATA}
            selectedEntryIndex={selectedEntryIndex}
            onChangeFilterOption={this.onChangeFilterOption}
            onChangeSelectedEntryIndex={this.onChangeSelectedEntryIndex}
            onToggleZoomModal={this.onToggleZoomModal}
          />
        ) : null}

        {/** Guest Lists */}
        {mediaButtonType === 1 ? (
          <GuestLists
            leaderData={OTHER_DATA}
            otherData={OTHER_DATA}
            peopleData={OTHER_DATA}
            navigation={this.props.navigation}
          />
        ) : null}

        {/** Details */}
        {mediaButtonType === 2 ? <Details data={DETAILS_DATA} /> : null}

        {/** Modals */}
        <PhotoZoomModal
          data={CAROUSEL_DATA[selectedEntryIndex]}
          isModalVisible={isZoomModalVisible}
          onCloseZoomMoal={this.onToggleZoomModal}
        />
      </StyledContainer>
    );
  }
}

const DETAILS_DATA = {
  addres: 'Address',
  likes: 10,
  comments: 10,
  isPrivate: false,
  sDate: '2020-03-28 17:47:23',
  eDate: '2020-04-01 17:47:25',
  eventSize: 5,
  media: 5,
  share_url: 'https://production.tellascape.com/share/5e7f406878ae567b371d6df2/kHemKugLDa',
  description:
    'An auto show, also known as a motor show or car show is a public exhibition of current automobile models, debuts, concept cars, or out-of-production classics ',
  parentID: '5e7b6ddbca516546d0639442',
  center: {
    lat: 29.90270364558749,
    lng: 73.89140669263331,
  },
};

const OTHER_DATA = [
  {
    userID: '5e7b6c07dc2efc5196305052',
    first_name: 'Pardeep',
    last_name: 'Singhal',
    users_name: 'Pardeep Singhal',
    profile_img:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    photo: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    likes: 2,
  },
  {
    userID: '5e7b6c07dc2efc5196305052',
    first_name: 'Pardeep',
    last_name: 'Singhal',
    users_name: 'Pardeep Singhal',
    profile_img:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    photo: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    likes: 2,
  },
  {
    userID: '5e7b6c07dc2efc5196305052',
    first_name: 'Pardeep',
    last_name: 'Singhal',
    users_name: 'Pardeep Singhal',
    profile_img:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    photo: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    likes: 2,
  },
  {
    userID: '5e7b6c07dc2efc5196305052',
    first_name: 'Pardeep',
    last_name: 'Singhal',
    users_name: 'Pardeep Singhal',
    profile_img:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    photo: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg?t=1585423547',
    likes: 2,
  },
];

const CAROUSEL_DATA = [
  {
    userPhoto: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg',
    userName: 'Pardeep Singhal',
    url:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/post_media/event/d2afaa5e944570dbeeb5db72/tlVc0t8BDc/n9lcOsA8Yp.jpg',
    likes: 10,
    commentCount: 4,
    comments: [
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments One',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments Two',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments Three',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
    ],
    title: 'Title One',
  },
  {
    userPhoto: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg',
    userName: 'Pardeep Singhal',
    url:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/post_media/event/d2afaa5e944570dbeeb5db72/tlVc0t8BDc/qZziuaLpQ9.png',
    likes: 10,
    commentCount: 0,
    comments: [],
    title: 'Title Two',
  },
  {
    userPhoto: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/390d0fbe5c06e7c52515c267/pr.jpg',
    userName: 'Pardeep Singhal',
    url:
      'https://tellascape-prod.s3.us-east-2.amazonaws.com/post_media/event/d2afaa5e944570dbeeb5db72/tlVc0t8BDc/n9lcOsA8Yp.jpg',
    likes: 10,
    commentCount: 4,
    comments: [
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments One',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments Two',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
      {
        id: 'GWFwY4KVZY',
        created_at: 1585313440,
        users_name: 'Pardeep Kumar',
        user_dir: '0ea7b8ce515ace1522468767',
        userID: '5e7c61be787c8164ea0a2552',
        content: 'Comments Three',
        media_id: 'n9lcOsA8Yp',
        iUrl: 'https://tellascape-prod.s3.us-east-2.amazonaws.com/user_media/0ea7b8ce515ace1522468767/pr.jpg',
      },
    ],
    title: 'Title Three',
  },
];
