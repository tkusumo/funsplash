import React, { Component } from 'react';
import { View, Text, Platform, Dimensions, TouchableHighlight,
  RefreshControl, StyleSheet, Animated, StatusBar,
  Alert, CameraRoll, AsyncStorage, Image, ScrollView }
  from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

//import { ScrollView, Image } from 'react-native-parallax';
import Unsplash from 'unsplash-js/native';
import Modal from 'react-native-root-modal';
import FitImage from 'react-native-fit-image';
import Carousel from 'react-native-snap-carousel';

import CollectionCard from './CollectionCard';
import { STATUS_BAR_HEIGHT } from '../constants';
import * as actions from '../actions';
import Config from '../Config';

const { width, height } = Dimensions.get('window');

const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = width / 1.5;
const PARALLAX_FACTOR = 0.4;
const unsplash = new Unsplash({
  applicationId: '88f3bb5bc812332d25b3ac46112d3c7d799560b06691384888b808888ede044f',
  secret: Config.UNSPLASH_KEY,
  callbackUrl: 'urn:ietf:wg:oauth:2.0:oob',
});

class CollectionScreen extends Component {
  state = {
    colls: [],
    collsPhotos: [],
    refreshing: false,
    modalVisible: false,
    currentIndex: 0,
    authorName: '',
    likes: 0,
    avatar: 'https://unsplash.it/32/32',
    carouselSize: 0,
    authorID: '',
    favIconColor: 'white',
    headerFavIconColor: '#263238',
  };

  static navigationOptions = ({ navigation, screenProps }) => {
    return ({
      headerRight: (
        <Icon
          name='favorite'
          size={27}
          color={screenProps.favColor}
          style={{ paddingRight: 15, paddingTop: (Platform.OS === 'android') ? 22 : 0 }}
          onPress={() => navigation.navigate('FavoriteScreen')}/>
        ),
    });
  };

  componentWillMount() {
    this.props.fetchCollectionsFromAPI(unsplash, 1);
  }

  async componentDidMount() {
    const savedPhotos = await AsyncStorage.getAllKeys();
    if (savedPhotos.length === 0) {
      this.setState({ headerFavIconColor: '#263238' });
    } else {
      this.setState({ headerFavIconColor: 'tomato' });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { collsPhotos, carouselSize } = this.state;

    let tempPhotos = collsPhotos;
    let tempSize = carouselSize;

    await this.setState({
      collsPhotos: tempPhotos.concat(nextProps.collectionPhotos),
      colls: nextProps.collections,
    });
    this.setState({ carouselSize: tempSize + this.state.collsPhotos.length });

    if (this.state.currentIndex === 0 && this.state.collsPhotos.length > 0) {
      const photo = this.state.collsPhotos[0];
      AsyncStorage.getItem(photo.id, (err, item) => {
        if (item) {
          this.setState({ favIconColor: 'tomato' });
        } else {
          this.setState({ favIconColor: 'white' });
        }
      });
      this.setState({
        authorName: photo.name,
        likes: photo.likes,
        avatar: photo.avatarMedium,
      });
    }

    if (nextProps.changeFavIconColor) {
      this.setState({ headerFavIconColor: nextProps.changeFavIconColor });
    }
  }

  saveToCameraRoll = async (image) => {
    if (Platform.OS === 'android') {
      // To be implemented
      Alert.alert('Sorry!!', 'Photo cannot be saved yet for Android devices!');
    } else {
      try {
        let success = await CameraRoll.saveToCameraRoll(image);
        if (success) {
          Alert.alert('Success', 'Photo added to camera roll!');
        }
      }
      catch (error) {
        if (error) {
          if (error.message === 'User denied access') {
            Alert.alert(
              'Failed to download!',
              'Allow funsplash app to access your Photos on Settings-Privacy-Photos on your iPhone.');
          }
        }
      }
    }
  };

  _renderCarouselPhotos = () => {
    const { colls } = this.state;

    return colls.map((pic) =>
      {
        if (pic.total_photos > 0) {
          return (
            <TouchableHighlight
              onPress={() => {
                  this.setState({
                    modalVisible: true,
                    authorID: pic.id,
                    carouselSize: 0,
                    collsPhotos: [],
                    currentIndex: 0,
                  });
                  this.props.fetchCollectionPhotosFromAPI(unsplash, 1, pic.id);
                  StatusBar.setBarStyle('light-content');
                }
              }
              activeOpacity={1}
              underlayColor='white'
              key={pic.id}>
              <View
                style={{
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <CollectionCard
                    profileImage={pic.user.profile_image.small}
                    profileName={pic.user.name}
                    collectionTitle={pic.title}
                    bio={pic.user.bio}
                    coverPhoto={pic.cover_photo.urls.small}
                    coverPhotoBy={pic.cover_photo.user.name}
                    coverPhotoColor={pic.cover_photo.color}
                    previewPhoto1={pic.preview_photos[0].urls.small}
                    previewPhoto2={pic.preview_photos[1].urls.small}
                    previewPhoto3={pic.preview_photos[2].urls.small}
                    previewPhoto4={pic.preview_photos[3].urls.small}
                  />
              </View>
            </TouchableHighlight>
          );
        }
      }
    );
  };

  _renderParallaxScrollView = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>
        { this._renderCarouselPhotos() }
      </ScrollView>
    );
  };

  _renderItem({ item, index }) {
    //console.log(item);
    return (
      <View style={styles.imageContainer}>
        <FitImage
          indicator
          indicatorColor='white'
          indicatorSize='large'
          source={{ uri: item.urlRegular }}
          originalWidth={width * 0.95}
          originalHeight={height * 0.75}
          borderRadius={10}
        />
      </View>
    );
  }

  onSnappingToItem(index) {
    const { collsPhotos, carouselSize, authorID } = this.state;

    this.setState({
      authorName: collsPhotos[index].name,
      likes: collsPhotos[index].likes,
      avatar: collsPhotos[index].avatarMedium,
      currentIndex: index,
    });

    if ((index + 1) === carouselSize) {
      this.props.fetchCollectionPhotosFromAPI(unsplash, ((index + 1) / 10) + 1, authorID);
    }

    AsyncStorage.getItem(collsPhotos[index].id, (err, item) => {
      if (item) {
        this.setState({ favIconColor: 'tomato' });
      } else {
        this.setState({ favIconColor: 'white' });
      }
    });
  }

  _favIconClicked = async (index) => {
    const { collsPhotos } = this.state;

    let photo = {
      id: collsPhotos[index].id,
      likes: collsPhotos[index].likes,
      urlRegular: collsPhotos[index].urlRegular,
      urlFull: collsPhotos[index].urlFull,
      name: collsPhotos[index].name,
      avatar: collsPhotos[index].avatarMedium,
      download: collsPhotos[index].download,
    };

    const value = await AsyncStorage.getItem(collsPhotos[index].id);
    if (value === null) {
      AsyncStorage.setItem(collsPhotos[index].id, JSON.stringify(photo), (err) => {
        if (!err) {
          Alert.alert('Success', 'Photo saved!');
          this.setState({ favIconColor: 'tomato' });
        }
      });
    } else {
      AsyncStorage.removeItem(collsPhotos[index].id, (err) => {
        if (!err) {
          this.setState({ favIconColor: 'white' });
        }
      });
    }

    this.setFavIcon();
  };

  async setFavIcon() {
    const value = await AsyncStorage.getAllKeys();
    if (value.length === 0) {
      this.props.setFavIconColor('#1c313a');
    } else if (value.length === 1) {
      this.props.setFavIconColor('tomato');
    }
  }

  render () {
    const { modalVisible, collsPhotos } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          style={{
            backgroundColor: '#101010',
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
          }}
          visible={modalVisible}
        >
          <View style={{ paddingTop: 30 }}>
            <Carousel
              ref={
                (c) => { this._carousel = c; }
              }
              data={collsPhotos}
              renderItem={this._renderItem}
              itemHeight={height * 0.8}
              itemWidth={width}
              sliderHeight={height * 0.8}
              sliderWidth={width}
              inactiveSlideOpacity={0.5}
              inactiveSlideScale={1}
              onSnapToItem={(index) => this.onSnappingToItem(index)}
              enableMomentum={false}
              decelerationRate={'fast'}
              removeClippedSubviews={true}
              shouldOptimizeUpdates={true}
            />
          </View>
          <View style={{ top: 50, left: 23, position: 'absolute' }}>
            <Icon
              name='highlight-off'
              size={30}
              color='white'
              underlayColor='transparent'
              onPress={() =>
                {
                  this.setState({
                    modalVisible: false,
                    collsPhotos: [],
                    authorName: '',
                    likes: '',
                    avatar: 'https://unsplash.it/640/425',
                    favIconColor: 'white',
                  });
                  StatusBar.setBarStyle('dark-content');
                }
              }
            />
          </View>
          <View style={styles.footerContainer}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
              <Icon
                name='get-app'
                size={28}
                color='white'
                underlayColor='#101010'
                onPress={() => (
                  this.saveToCameraRoll(collsPhotos[this._carousel.currentIndex].download))}
              />
              <Icon
                name='favorite'
                size={26}
                color={this.state.favIconColor}
                underlayColor='#101010'
                style={{ paddingLeft: 15 }}
                onPress={(index) => this._favIconClicked(this._carousel.currentIndex)}
                />
            </View>
            <View style={styles.likesContainer}>
              <Icon name='thumb-up' size={24} color='steelblue'/>
              <Text style={styles.likesText}>
                {this.state.likes}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
              bottom: 20,
              position: 'absolute',
            }}>
            <Image
              source={{ uri: this.state.avatar }}
              style={{ width: 30, height: 30, borderRadius: 15 }}/>
            <Text style={[styles.authorNameText]}>
              {this.state.authorName}
            </Text>
          </View>
        </Modal>
        <View style={styles.headerContainer}>
          <Icon
            name='view-carousel'
            size={28}
            color='#263238'
            underlayColor='#fff'
            style={styles.leftIcon}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Collections</Text>
          <Icon
            name='favorite'
            size={27}
            color={this.state.headerFavIconColor}
            underlayColor='#fff'
            style={styles.rightIcon}
            onPress={() => this.props.navigation.navigate('FavoriteScreen')}/>
        </View>
        { this._renderParallaxScrollView() }
      </View>
    );
  }
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    height: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT + 45 : STATUS_BAR_HEIGHT + 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: (Platform.OS === 'ios') ? 27 : 18,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'lightcoral',
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
    marginTop: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT - 20 : STATUS_BAR_HEIGHT - 5,
  },
  leftIcon: {
    paddingLeft: 15,
    paddingTop: (Platform.OS === 'android') ? 22 : 0,
  },
  rightIcon: {
    paddingRight: 15,
    paddingTop: (Platform.OS === 'android') ? 22 : 0,
  },
  image: {
    height: IMAGE_HEIGHT,
  },
  imageContainer: {
    width: width,
    height: height * 0.8,
    paddingLeft: 6,
    paddingRight: 5,
    borderRadius: 10,
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,3,0.3)',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
    fontWeight: 'bold',
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 150,
  },
  headerStyle: {
    backgroundColor: '#A2DED0',
    marginTop: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 18,
    padding: 7,
    color: '#fff',
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  authorNameText: {
    color: 'lightcoral',
    fontSize: 18,
    paddingLeft: 10,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  likesContainer: {
    flex: 1,
    flexDirection: 'row',
    right: 5,
    position: 'absolute',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 50,
    position: 'absolute',
  },
};

function mapStateToProps({ collections, storage }) {
  return {
    collections: collections.data,
    collectionPhotos: collections.photos,
    changeFavIconColor: storage.favIconColor,
  };
}

export default connect(mapStateToProps, actions)(CollectionScreen);
