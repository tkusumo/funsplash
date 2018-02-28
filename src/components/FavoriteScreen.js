import React, { Component } from 'react';
import {
  View, Text, ScrollView, Platform,
  AsyncStorage, Dimensions, Image, StyleSheet,
  CameraRoll, Alert, ActivityIndicator } from 'react-native';
import FitImage from 'react-native-fit-image';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-root-modal';
import { connect } from 'react-redux';
import * as actions from '../actions';

const { width, height } = Dimensions.get('window');

class FavoriteScreen extends Component {
  state = {
    photos: [],
    modalDownloadVisible: false,
  };

  componentWillMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        let photos = [];
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          let key = store[i][0];
          let value = JSON.parse(store[i][1]);
          photos.push(value);
        });
        this.setState({ photos: photos });
      });
    });
  };

  saveToCameraRoll = async (image) => {
    if (Platform.OS === 'android') {
      // To be implemented
      Alert.alert('Sorry!!', 'Photo cannot be saved yet for Android devices!');
    } else {
      this.setState({ modalDownloadVisible: true });
      try {
        let success = await CameraRoll.saveToCameraRoll(image);
        if (success) {
          this.setState({ modalDownloadVisible: false });
          Alert.alert('Success', 'Photo added to camera roll!');
        }
      }
      catch (error) {
        if (error) {
          if (error.message === 'User denied access') {
            this.setState({ modalDownloadVisible: false });
            Alert.alert(
              'Failed to download!',
              'Allow funsplash app to access your Photos on Settings-Privacy-Photos on your iPhone.');
          }
        }
      }
    }
  };

  renderPhotos = () => {
    const { photos } = this.state;
    return photos.map((item) => {
      return (
        <View key={item.id} style={{ backgroundColor: '#fff' }}>
          <Modal
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
            }}
            visible={this.state.modalDownloadVisible}>
            <View style={{
              backgroundColor: 'gray',
              width: 150,
              height: 150,
              opacity: 0.3,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <ActivityIndicator
                size='large'
                animating={true}
                color='white'/>
              <Text
                style={{
                  paddingTop: 20,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Saving....
              </Text>
            </View>
          </Modal>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <FitImage
              source={{ uri: item.urlRegular }}
              style={{ borderRadius: 10 }}/>
            <View style={styles.likesContainer}>
              <Icon name='thumb-up' size={22} color='steelblue'/>
              <Text style={styles.likesNameText}>
                {item.likes}
              </Text>
            </View>
          </View>
          <View style={styles.authorContainer}>
            <Icon
              name='file-download'
              size={28}
              onPress={() => (
                this.saveToCameraRoll(item.download)
              )}/>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.avatar}/>
                <Text style={[styles.nameText, { paddingLeft: 5 }]}>{item.name}</Text>
            </View>
            <Icon
              name='delete'
              size={28}
              onPress={async () =>
                {
                  let tempPhotos = photos;
                  AsyncStorage.removeItem(item.id, (err) => {
                    let index = 0;
                    if (!err) {
                      Alert.alert('Success', 'Photo removed!');
                      for (i = 0; i < photos.length; i++) {
                        if (item.id === photos[i].id) {
                          index = i;
                        }
                      }

                      tempPhotos.splice(index, 1);
                      this.setState({ photos: tempPhotos });
                      if (this.state.photos.length === 0) {
                        this.props.setFavIconColor('#1c313a');
                      }
                    }
                  });
                }
              }
            />
          </View>
        </View>
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          {this.renderPhotos()}
        </ScrollView>
      </View>
    );
  }
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  image: {
    width: width,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 15,
    color: 'lightcoral',
    paddingTop: 3,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  likesNameText: {
    fontSize: 17,
    padding: 7,
    color: 'black',
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' :
        'Roboto',
  },
  likesContainer: {
    bottom: 20,
    right: 0,
    position: 'absolute',
    opacity: 0.8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    paddingLeft: 8,
  },
};

export default connect(null, actions)(FavoriteScreen);
