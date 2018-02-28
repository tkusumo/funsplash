/*jshint esversion: 6 */
import React, { Component, PureComponent } from 'react';
import { View, Dimensions, Text, Animated, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import * as actions from '../actions';
import Config from '../Config';
import Photo from './Photo';

const { height, width } = Dimensions.get('window');

class PhotosCarousel extends Component {
  _renderItem({ item, index }) {
    return (
      <Photo
        id={item.id}
        likes={item.likes}
        urlRegular={item.urlRegular || utm}
        urlFull={item.urlFull || utm}
        name={item.name}
        avatar={item.avatarMedium}
        download={item.download}
      />
    );
  }

  onSnappingToItem = (index) => {
    const { carouselSize } = this.props;

    if ((index + 1) === carouselSize)
    {
      this.props.fetchPhotosFromAPI(this.props.api, (carouselSize / 10) + 1);
    }

    this.props.onSnap(index);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Carousel
          ref={
            (c) => { this._carousel = c; }
          }
          data={this.props.photos}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width * 0.80}
          enableMomentum={false}
          onSnapToItem={(index) => this.onSnappingToItem(index)}
          decelerationRate={'fast'}
          removeClippedSubviews={true}
          shouldOptimizeUpdates={true}
        />
      </View>
    );
  }
}

export default connect(null, actions)(PhotosCarousel);
