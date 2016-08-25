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
import Moment from 'moment';

type State = {
  date?: Moment,
};

class demo extends Component {
  state: State

  constructor(props: Object) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>
            {this.state.date ?
            this.state.date.format() :
            "No date selected"}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Calendar
            onChange={(date) => this.setState({date})}
            selected={this.state.date}
            minDate={Moment().startOf('day')}
            maxDate={Moment().add(10, 'years').startOf('day')}
            style={{
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
    marginTop: 30,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('demo', () => demo);
