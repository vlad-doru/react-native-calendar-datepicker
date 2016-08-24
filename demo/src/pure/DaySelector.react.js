/**
* DaySelector pure component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';

type Props = {
  style?: View.propTypes.style,
  focus: Moment,
  selected: Moment,
};
type State = {
  days: Array<Array<number>>,
};

export default class DaySelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      days: this._computeDays(props.focus),
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.focus != nextProps.focus) {
      this.setState({
        days: this._computeDays(nextProps.focus),
      })
    }
  }

  _computeDays(focus: Moment) : Array<Array<number>> {
    let result = [];
    const currentMonth = focus.month();
    let iterator = Moment(focus);
    while (iterator.month() === currentMonth) {
      if (iterator.weekday() === 0 || result.length === 0) {
        result.push(_.times(7, _.constant(undefined)));
      }
      let week = result[result.length - 1];
      week[iterator.weekday()] = iterator.date();
      // Add it to the result here.
      iterator.add(1, 'day');
    }
    return result;
  }

  render() {
    return (
      <View style={[{
        // Wrapper view default style.
      },this.props.style]}>
        {_.map(this.state.days, (week, i) =>
          <View key={i} style={[styles.weekView]}>
            {_.map(week, (day, j) =>
              <View key={j} style={[styles.dayView]}>
                <Text>{day}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
DaySelector.defaultProps = {
  focus: Moment().startOf('month'),
  selected: Moment()
};

const styles = StyleSheet.create({
  weekView: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
  },
  dayView: {
    flex: 1,
    alignItems: 'center',
  },
});
