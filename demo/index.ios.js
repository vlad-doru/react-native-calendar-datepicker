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
          <Text style={styles.dateText}>
            {this.state.date ?
            this.state.date.format('DD-MM-YYYY h:mm a') :
            "No date selected"}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}></View>
          <Calendar
            onChange={(date) => this.setState({date})}
            selected={this.state.date}
            minDate={Moment().startOf('day')}
            maxDate={Moment().add(10, 'years').startOf('day')}
            //General Styling}
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              borderRadius: 5,
              alignSelf: 'center',
              marginTop: 20,
            }}
            barView={{
              backgroundColor: '#2196F3',
              padding: 10,
            }}
            barText={{
              fontWeight: 'bold',
              color: 'white',
            }}
            stageView={{
              padding: 0,
            }}
            // Day selector styling
            dayHeaderView={{
              backgroundColor: '#F5F5F5',
              borderBottomColor: '#BDBDBD',
            }}
            dayHeaderText={{
              fontWeight: 'bold',
              color: '#424242'
            }}
            dayRowView={{
              borderColor: '#BDBDBD',
              height: 38,
            }}
            dayText={{
              color: '#424242'
            }}
            dayTodayText={{
              fontWeight: 'bold',
              color: '#2196F3',
            }}
            daySelectedText={{
              backgroundColor: '#2196F3',
              borderRadius: 15,
              fontWeight: 'bold',
              color: 'white',
              overflow: 'hidden',
            }}
            />
          <View style={{flex: 1}}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#F5FCFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  }
});

AppRegistry.registerComponent('demo', () => demo);
