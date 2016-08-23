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
        <View style={{flexDirection: 'row'}}>
          <Calendar style={{
            flex: 1,
            borderWidth: 1,
          }}/>
        </View>
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
