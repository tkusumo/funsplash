/*jshint esversion: 6 */
import React, { PureComponent } from 'react';
import {
  View, Image, Text, StatusBar, CameraRoll,
  Dimensions, TouchableOpacity, Animated,
  StyleSheet, Platform, ActivityIndicator,
  Alert, AsyncStorage,
} from 'react-native';
import Modal from 'react-native-root-modal';
import { Icon } from 'react-native-elements';
import { navigation } from 'react-navigation';
import { connect } from 'react-redux';

import Dragable from './Dragable';
import * as actions from '../actions';

const { width, height } = Dimensions.get('window');
const calculateOpacity = x => Math.max(0, 150 - Math.abs(x)) / 100;

class Photo extends PureComponent {
  state = {
    modalVisible: false,
    modalDownloadVisible: false,
    modalOpacity: new Animated.Value(0),
    imageLoading: true,
    largeImageLoading: true,
    favorite: 'white',
    statusBarStyle: 'dark-content',
  };

  _favIconCLicked = async () => {
    let photo = {
      id: this.props.id,
      likes: this.props.likes,
      urlRegular: this.props.urlRegular,
      urlFull: this.props.urlFull,
      name: this.props.name,
      avatar: this.props.avatar,
      download: this.props.download,
    };

    let value = await AsyncStorage.getItem(this.props.id);
    if (value === null) {
      await AsyncStorage.setItem(this.props.id, JSON.stringify(photo), (err) => {
        if (!err) {
          Alert.alert('Success', 'Photo saved!');
          this.setState({ favorite: 'tomato' });
        }
      });
    } else {
      await AsyncStorage.removeItem(this.props.id, (err) => {
        if (!err) {
          this.setState({ favorite: 'white' });
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

  render() {
    const { modalVisible, modalOpacity, modalDownloadVisible } = this.state;

    let scale = this.state.modalOpacity.interpolate({
        inputRange: [0, 0.75],
        outputRange: [0.75, 1.0],
        extrapolate: 'clamp',
      });

    return (
      <View style={{ flex: 1, marginTop: 20, paddingBottom: 30 }}>
        <StatusBar
          barStyle={this.state.statusBarStyle}
        />
        <Modal
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
          }}
          visible={modalVisible}>
          <Modal
            style={{
              backgroundColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              width: 150,
              height: 150,
              opacity: 0.8,
              left: width / 3.25,
              top: height / 3.0,
              position: 'absolute',
              borderRadius: 15,
            }}
            visible={modalDownloadVisible}>
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
          </Modal>
          <Animated.View
            style={{
              opacity: modalOpacity,
              backgroundColor: '#101010',
              ...StyleSheet.absoluteFillObject,
            }}
          />
          <Dragable
            onMove={({ x }) =>
              {
                let newOpacity = calculateOpacity(x);
                modalOpacity.setValue(newOpacity);
              }
            }
            onEnd={({ x }) =>
              {
                let newOpacity = calculateOpacity(x);
                if (newOpacity < 0.5) {
                  this.setState({ modalVisible: false });
                  modalOpacity.setValue(0);
                  StatusBar.setBarStyle('dark-content');
                } else {
                  Animated.spring(modalOpacity, { toValue: 1 }).start();
                }
              }
            }>
            <Animated.View
              style={[
                styles.fullImageContainer,
                { opacity: 1 },
              ]}>
              <ActivityIndicator
                style={{
                  left: width / 2.30,
                  top: height / 2.6,
                  position: 'absolute',
                }}
                color='white'
                size='large'
                animating={this.state.largeImageLoading}/>
              <Animated.Image
                source={{ uri: this.props.urlRegular }}
                style={[styles.fullImageStyle, { transform: [{ scale }] }]}
                resizeMode={'cover'}
                onLoad={async () =>
                  {
                    this.setState({ largeImageLoading: false });
                    try {
                      const value = await AsyncStorage.getItem(this.props.id);
                      if (value !== null) {
                        this.setState({ favorite: 'tomato' });
                      } else {
                        this.setState({ favorite: 'white' });
                      }
                    }
                    catch (error) {
                      // Error retrieving data
                    };
                  }
                }
              />
              <Animated.View style={[styles.footerContainer, { opacity: modalOpacity }]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon
                    name='get-app'
                    size={28}
                    color='white'
                    underlayColor='#101010'
                    onPress={() =>
                      this.saveToCameraRoll(this.props.download)
                    }/>
                  <Icon
                    name='favorite'
                    size={26}
                    color={this.state.favorite}
                    style={{ paddingLeft: 15 }}
                    underlayColor='#101010'
                    onPress={() => this._favIconCLicked()}/>
                </View>
                <View style={styles.likesContainer}>
                  <Icon name='thumb-up' size={24} color='steelblue'/>
                  <Text style={styles.likesText}>
                    {this.props.likes}
                  </Text>
                </View>
              </Animated.View>
              <Animated.View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 10,
                  opacity: modalOpacity,
                }}>
                <Image
                  source={{ uri: this.props.avatar }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}/>
                <Text style={[styles.authorNameText]}>
                  {this.props.name}
                </Text>
              </Animated.View>
            </Animated.View>
          </Dragable>
        </Modal>
        <View style={styles.imageContainer}>
          <ActivityIndicator
            style={{
              left: (width * 0.80) / 2.17,
              top: (height * 0.62) / 2.15,
              position: 'absolute',
            }}
            size='large'
            animating={this.state.imageLoading}/>
          <TouchableOpacity
            onPress={() =>
              {
                Animated.spring(modalOpacity, { toValue: 1 }).start();
                this.setState({ modalVisible: true });
                StatusBar.setBarStyle('light-content');
              }
            }
            activeOpacity={1}>
            <Image
              source={{ uri: this.props.urlRegular }}
              style={styles.imageStyle}
              resizeMode={'cover'}
              onLoad={() => this.setState({ imageLoading: false })}
            />
          </TouchableOpacity>
          <View style={styles.likesBoxContainer}>
            <Icon name='thumb-up' size={23} color='steelblue'/>
            <Text style={[styles.likesText, { color: 'black' }]}>
              {this.props.likes}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  imageContainer: {
    backgroundColor: 'white',
    opacity: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    borderRadius: 10,
    width: width * 0.80,
  },
  fullImageContainer: {
    width: width * 0.97,
    height: height * 0.90,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: width * 0.80,
    height: height * 0.62,
    borderRadius: 10,
  },
  fullImageStyle: {
    flex: 1,
    borderRadius: 10,
    width: width * 0.97,
    height: height * 0.90,
  },
  likesBoxContainer: {
    bottom: 20,
    right: 0,
    position: 'absolute',
    opacity: 0.8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    paddingLeft: 8,
  },
  likesText: {
    fontSize: 18,
    padding: 7,
    color: 'white',
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin-Bold' : 'Roboto',
  },
  avatar: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  likesContainer: {
    flex: 1,
    flexDirection: 'row',
    right: 5,
    top: 5,
    position: 'absolute',
  },
  authorNameText: {
    color: 'lightcoral',
    fontSize: 22,
    paddingLeft: 10,
    fontFamily: (Platform.OS === 'ios') ?
        'Cochin' : 'Roboto',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
};

export default connect(null, actions)(Photo);
