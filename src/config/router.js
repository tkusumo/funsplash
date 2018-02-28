import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import MainScreen from '../components/MainScreen';
import CollectionScreen from '../components/CollectionScreen';
import FavoriteScreen from '../components/FavoriteScreen';
import { STATUS_BAR_HEIGHT } from '../constants';

const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const TODAY = new Date();

export const Screens = StackNavigator({
  MainScreen: {
    screen: MainScreen,
    navigationOptions: (props) => ({
      header: null,
    }),
    //   title: days[TODAY.getDay()],
    //   headerStyle: {
    //     backgroundColor: '#fff',
    //     borderBottomColor: '#fff',
    //     height: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT + 54 : STATUS_BAR_HEIGHT + 60,
    //   },
    //   headerTitleStyle: {
    //     fontSize: 25,
    //     fontWeight: 'bold',
    //     color: '#263238',
    //     fontFamily: (Platform.OS === 'ios') ?
    //         'Cochin-Bold' : 'Roboto',
    //     marginTop: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT - 18 : STATUS_BAR_HEIGHT - 3,
    //   },
    //   headerLeft:
    //     <Icon
    //       name='view-day'
    //       size={28}
    //       color='#1c313a'
    //       style={{ paddingLeft: 15, paddingTop: (Platform.OS === 'android') ? 22 : 0 }}
    //       onPress={() => props.navigation.navigate('CollectionScreen')}
    //     />,
    // }),
  },
  CollectionScreen: {
    screen: CollectionScreen,
    navigationOptions: (props) => ({
      header: null,
    }),
    // navigationOptions: (props, screenProps) => ({
    //   title: 'Collections',
    //   headerStyle: {
    //     backgroundColor: '#fff',
    //     borderBottomColor: '#fff',
    //     height: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT + 54 : STATUS_BAR_HEIGHT + 60,
    //   },
    //   headerTitleStyle: {
    //     fontSize: 25,
    //     fontWeight: 'bold',
    //     color: '#263238',
    //     fontFamily: (Platform.OS === 'ios') ?
    //         'Cochin-Bold' : 'Roboto',
    //     marginTop: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT - 19 : STATUS_BAR_HEIGHT - 3,
    //   },
    //   headerLeft:
    //     <Icon
    //       name='view-carousel'
    //       size={32}
    //       color='#1c313a'
    //       style={{
    //         paddingLeft: 15,
    //         paddingTop: (Platform.OS === 'android') ? 22 : 0,
    //       }}
    //       onPress={() => props.navigation.goBack()}
    //     />,
    // }),
  },
  FavoriteScreen: {
    screen: FavoriteScreen,
    navigationOptions: (props) => ({
      title: 'My Favorites',
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomColor: '#fff',
        height: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT + 35 : STATUS_BAR_HEIGHT + 60,
      },
      headerTitleStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'lightcoral',
        fontFamily: (Platform.OS === 'ios') ?
            'Cochin-Bold' : 'Roboto',
        marginTop: (Platform.OS === 'ios') ? STATUS_BAR_HEIGHT - 20 : STATUS_BAR_HEIGHT - 3,
      },
      headerLeft:
        <Icon
          name='arrow-back'
          size={32}
          color='lightcoral'
          style={{
            paddingLeft: 15,
            paddingTop: (Platform.OS === 'android') ? 22 : 0,
          }}
          onPress={() => props.navigation.goBack()}
        />,
    }),
  },
});
