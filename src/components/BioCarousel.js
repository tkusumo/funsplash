import React, { Component, PureComponent } from 'react';
import { View, Text, Image, Platform, Dimensions, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { WebBrowser } from 'expo';
import * as actions from '../actions';

const { width, height } = Dimensions.get('window');

class BioCarousel extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.photos && nextProps.photos.length > 0) {
      this._carousel.snapToItem(nextProps.bioIndex, animated = true);
    }
  }

  _renderItem({ item, index }) {
    return (
      <View style={styles.bioContainer}>
        <View style={styles.nameContainer}>
          <TouchableHighlight
            onPress={() => {
              WebBrowser.openBrowserAsync(item.profile);}
            }
          >
            <Image
              source={{ uri: item.avatarLarge }}
              style={{ width: 46, height: 46, borderRadius: 23 }}
            />
          </TouchableHighlight>
          <Text style={[styles.nameText, { paddingLeft: 5 }]}>{item.name}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name='person-pin-circle' size={24} color='steelblue' style={{ marginTop: 5 }}/>
          <Text style={styles.locationText}>
            {item.location === null ? 'unknown' : item.location}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Carousel
        ref={
          (c) => { this._carousel = c; }
        }
        data={this.props.photos}
        renderItem={this._renderItem}
        itemHeight={110}
        sliderHeight={110}
        sliderWidth={width * 0.95}
        vertical={true}
        inactiveSlideOpacity={0.1}
        inactiveSlideScale={0.3}
        scrollEnabled={false}
        enableMomentum={false}
        decelerationRate={'fast'}
        removeClippedSubviews={true}
        shouldOptimizeUpdates={true}
      />
    );
  }
};

const styles = {
  bioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 110,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 25,
    color: '#263238',
    paddingTop: 3,
    fontFamily: (Platform.OS === 'ios') ?
        'Papyrus' :
        'Roboto',
  },
  locationText: {
    paddingLeft: 3,
    paddingTop: 10,
    color: 'steelblue',
    fontFamily: (Platform.OS === 'ios') ?
        'Papyrus' : 'Roboto',
  },
};

function mapStateToProps({ bio }) {
  return { bioIndex: bio.idx };
}

export default connect(mapStateToProps, actions)(BioCarousel);
