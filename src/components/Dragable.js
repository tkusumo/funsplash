/*jshint esversion: 6 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder } from 'react-native';

export default class Dragable extends Component {
  state = {
    dragging: false,
    offsetTop: 0,
    offsetLeft: 0,
  };

  panResponder = {};

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }

  render() {
    const { children } = this.props;
    const { dragging, offsetTop, offsetLeft } = this.state;

    // Update style with the state of the drag thus far
    const style = {
      top: offsetTop,
      left: offsetLeft,
    };

    return (
      <View
        // Put all panHandlers into the View's props
        style={[style]}
        {...this.panResponder.panHandlers}>
        {children}
      </View>
    );
  }

  // Should we become active when the user presses down on the square?
  handleStartShouldSetPanResponder = () => {
    return true;
  };

  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = () => {
    this.setState({ dragging: true });
  };

  // Every time the touch/mouse moves
  handlePanResponderMove = (e, gestureState) => {
    const { onMove } = this.props;
    onMove({ x: gestureState.dy });

    // Keep track of how far we've moved in total (dx and dy)
    this.setState({
      offsetTop: gestureState.dy / 3.0,
      offsetLeft: gestureState.dx / 3.0,
    });
  };

  // When the touch/mouse is lifted
  handlePanResponderEnd = (e, gestureState) => {
    const { onEnd } = this.props;
    onEnd({ x: gestureState.dy });

    // The drag is finished. Set the initialTop and initialLeft so that
    // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
    this.setState({
      dragging: false,
      offsetTop: 0,
      offsetLeft: 0,
    });
  };
};
