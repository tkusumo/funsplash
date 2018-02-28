/*jshint esversion: 6 */
import React from 'react';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import './src/config/ReactotronConfig';
import Reactotron from 'reactotron-react-native';

import { Screens } from './src/config/router';
import store from './src/store';

export default class App extends React.Component {
  render() {
    Reactotron.log('starting the app');
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar
            backgroundColor="black"
            barStyle="dark-content"
          />
          <Screens/>
        </View>
      </Provider>
    );
  }
}

const styles = ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
