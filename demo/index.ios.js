/**
 * Example app using the Calendar component.
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Calendar from './src/container/Calendar.react';

class demo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Calendar/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('demo', () => demo);
