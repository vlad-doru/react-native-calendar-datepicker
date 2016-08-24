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
  days: Array<Array<Object>>,
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

  _computeDays = (focus: Moment) : Array<Array<Object>> => {
    let result = [];
    const currentMonth = focus.month();
    let iterator = Moment(focus);
    while (iterator.month() === currentMonth) {
      if (iterator.weekday() === 0 || result.length === 0) {
        result.push(_.times(7, _.constant({})));
      }
      let week = result[result.length - 1];
      week[iterator.weekday()] = {
        date: iterator.date(),
        selected: iterator.isSame(this.props.selected, 'day'),
      };
      // Add it to the result here.
      iterator.add(1, 'day');
    }
    return result;
  };

  render() {
    const weekViewStyle = StyleSheet.flatten([styles.weekView])
    return (
      <View style={[{
        // This helps us to have the same size for the wrapper, regardless of
        // the number of weeks in a month.
        paddingBottom: (6 - this.state.days.length) * weekViewStyle.height,
      },this.props.style]}>
        <View style={[styles.headerView]}>
          {_.map(Moment.weekdaysShort(true), (day) =>
            <View key={day} style={[styles.daynameView]}>
              <Text>
                {day}
              </Text>
            </View>
          )}
        </View>
        {_.map(this.state.days, (week, i) =>
          <View key={i} style={[
              styles.weekView,
              i === this.state.days.length - 1 ? {
                borderBottomWidth: 0,
              } : null,
            ]}>
            {_.map(week, (day, j) =>
              <View key={j} style={[styles.dayView]}>
                <Text style={[]}>
                  {day.date}
                </Text>
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
  selected: Moment(),
};

const styles = StyleSheet.create({
  weekView: {
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    height: 30,
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
  },
  dayView: {
    flex: 1,
    alignItems: 'center',
  },
  headerView: {
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    height: 30,
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
  },
  daynameView: {
    flex: 1,
    alignItems: 'center',
  },
});
