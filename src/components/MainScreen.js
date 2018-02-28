/*jshint esversion: 6 */
import React, { Component } from 'react';
import { View, Text, Platform, ScrollView,
  RefreshControl, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import Unsplash from 'unsplash-js/native';
import { connect } from 'react-redux';
import { NavigationActions, navigation } from 'react-navigation';

import PhotosCarousel from './PhotosCarousel';
import BioCarousel from './BioCarousel';
import Config from '../Config';
import { STATUS_BAR_HEIGHT } from '../constants';

import * as actions from '../actions';

const unsplash = new Unsplash({
  applicationId: '88f3bb5bc812332d25b3ac46112d3c7d799560b06691384888b808888ede044f',
  secret: Config.UNSPLASH_KEY,
  callbackUrl: 'urn:ietf:wg:oauth:2.0:oob',
});

const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const TODAY = new Date();

class MainScreen extends Component {
  state = {
    unsplashPhotos: [],
    refreshing: false,
    totalPhotos: 0,
    favIconColor: '#1c313a',
  };

  async componentDidMount() {
    const savedPhotos = await AsyncStorage.getAllKeys();
    if (savedPhotos.length === 0) {
      this.setState({ refreshing: true, favIconColor: '#1c313a' });
    } else {
      this.setState({ refreshing: true, favIconColor: 'tomato' });
    }

    this.props.fetchPhotosFromAPI(unsplash, 1);
  }

  async componentWillReceiveProps(nextProps) {
    const { unsplashPhotos } = this.state;

    let tempPhotos = await unsplashPhotos;
    tempPhotos = tempPhotos.concat(nextProps.photos);

    this.setState({
      unsplashPhotos: tempPhotos,
      refreshing: false,
      totalPhotos: tempPhotos.length,
    });

    if (nextProps.changeFavIconColor) {
      this.setState({ favIconColor: nextProps.changeFavIconColor });
    }

    if (this.state.totalPhotos === 10) {
      this.props.onSnap(0);
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, unsplashPhotos: [], totalPhotos: 0 });
    this.props.fetchPhotosFromAPI(unsplash, 1);
  };

  unsplashPhotos = () => {
    if (this.state.totalPhotos > 0) {
      return (
        <View>
          <Text style={{ fontSize: 10, alignSelf: 'flex-end', paddingRight: 5 }}>
            Photos provided by Unsplash!
          </Text>
        </View>
      );
    }
  };

  render() {
    const { photos } = this.props;
    const { unsplashPhotos, refreshLoad } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon
            name='view-day'
            size={28}
            color='#263238'
            style={styles.leftIcon}
            onPress={() => this.props.navigation.navigate('CollectionScreen')}
          />
          <Text style={styles.headerTitle}>{days[TODAY.getDay()]}</Text>
          <Icon
            name='favorite'
            size={27}
            color={this.state.favIconColor}
            style={styles.rightIcon}
            onPress={() => this.props.navigation.navigate('FavoriteScreen')}/>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              />
            }>
          <View style={styles.bioDetailContainer}>
            <BioCarousel photos={unsplashPhotos}/>
          </View>
          <View style={styles.bodyContainer}>
            <PhotosCarousel
              photos={unsplashPhotos}
              api={unsplash}
              carouselSize={this.state.totalPhotos}
              navigation={this.props.navigation}/>
          </View>
          {this.unsplashPhotos()}
        </ScrollView>
      </View>
    );
  }
}

const styles = ({
  container: {
    flex: 1,
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
  bioDetailContainer: {
    backgroundColor: '#fff',
  },
  bodyContainer: {
    backgroundColor: '#fff',
  },
});

function mapStateToProps({ photos, storage }) {
  return { photos: photos.data, changeFavIconColor: storage.favIconColor };
}

export default connect(mapStateToProps, actions)(MainScreen);
