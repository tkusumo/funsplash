import React, { Component } from 'react';
import { View, Text, Dimensions, Image, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

class CollectionCard extends Component {
  renderPreviewImages = () => {
    const {
      coverPhoto,
      previewPhoto1,
      previewPhoto2,
      previewPhoto3,
      previewPhoto4,
    } = this.props;

    const images = [previewPhoto1, previewPhoto2, previewPhoto3, previewPhoto4];

    let i = 0;
    return images.map((image) => {
      if (coverPhoto !== image) {
        return (
          <Image
            key={i++}
            source={{ uri: image }}
            style={styles.previewImageStyle}/>
        );
      };
    });
  };

  render() {
    const {
      profileImage,
      profileName,
      collectionTitle,
      bio,
      coverPhoto,
      coverPhotoBy,
      coverPhotoColor,
      previewPhoto1,
      previewPhoto2,
      previewPhoto3,
      previewPhoto4,
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: coverPhotoColor }]}>
        <View style={styles.profileContainer}>
          <Image style={styles.profileImageStyle} source={{ uri: profileImage }}/>
          <Text style={styles.profileTextStyle}>{profileName}</Text>
        </View>
        <View >
          <Text style={styles.collectionTitleStyle}>{collectionTitle}</Text>
        </View>
        <View style={{ paddingLeft: 20, paddingTop: 10 }}>
          <Image
            source={{ uri: coverPhoto }}
            style={{ width: width - 70, height: 200, borderRadius: 6 }}/>
            <View style={styles.previewImageContainer}>
              {this.renderPreviewImages()}
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.coverPhotoByStyle}>Cover photo by {coverPhotoBy}.</Text>
            </View>
        </View>
      </View>
    );
  }
};

const styles = {
  container: {
    width: width - 30,
    height: 450,
    borderRadius: 15,
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 20,
  },
  profileImageStyle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileTextStyle: {
    paddingLeft: 5,
    color: 'white',
    fontSize: 18,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  collectionTitleStyle: {
    paddingLeft: 20,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  previewImageStyle: {
    width: (width - 74) / 3,
    height: (width - 74) / 3,
    borderRadius: 6,
  },
  previewImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    width: width - 70,
  },
  coverPhotoByStyle: {
    color: 'white',
    fontSize: 17,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
};

export default CollectionCard;
