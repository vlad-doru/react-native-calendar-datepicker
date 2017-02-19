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
import Calendar from 'react-native-calendar-datepicker';
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
    const BLUE = '#2196F3';
    const WHITE = '#FFFFFF';
    const GREY = '#BDBDBD';
    const BLACK = '#424242';
    const LIGHT_GREY = '#F5F5F5';

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
          <View style={{flexGrow: 1}}></View>
          <Calendar
            onChange={(date) => this.setState({date})}
            selected={this.state.date}
            finalStage="month"
            minDate={Moment().startOf('day')}
            maxDate={Moment().add(10, 'years').startOf('day')}
            //General Styling}
            style={{
              borderWidth: 1,
              borderColor: GREY,
              borderRadius: 5,
              alignSelf: 'center',
              marginTop: 20,
            }}
            barView={{
              backgroundColor: BLUE,
              padding: 10,
            }}
            barText={{
              fontWeight: 'bold',
              color: WHITE,
            }}
            stageView={{
              padding: 0,
            }}
            // Day selector styling
            dayHeaderView={{
              backgroundColor: LIGHT_GREY,
              borderBottomColor: GREY,
            }}
            dayHeaderText={{
              fontWeight: 'bold',
              color: BLACK,
            }}
            dayRowView={{
              borderColor: LIGHT_GREY,
              height: 40,
            }}
            dayText={{
              color: BLACK,
            }}
            dayDisabledText={{
              color: GREY,
            }}
            dayTodayText={{
              fontWeight: 'bold',
              color: BLUE,
            }}
            daySelectedText={{
              fontWeight: 'bold',
              backgroundColor: BLUE,
              color: WHITE,
              borderRadius: 15,
              borderColor: "transparent",
              overflow: 'hidden',
            }}
            // Styling month selector.
            monthText={{
              color: BLACK,
              borderColor: BLACK,
            }}
            monthDisabledText={{
              color: GREY,
              borderColor: GREY,
            }}
            monthSelectedText={{
              fontWeight: 'bold',
              backgroundColor: BLUE,
              color: WHITE,
              overflow: 'hidden',
            }}
            // Styling year selector.
            yearMinTintColor={BLUE}
            yearMaxTintColor={GREY}
            yearText={{
              color: BLACK,
            }}
            />
          <View style={{flexGrow: 1}}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
