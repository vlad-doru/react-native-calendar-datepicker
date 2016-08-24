/**
* DaySelector pure component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  TouchableHighlight,
  LayoutAnimation,
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
  onChange?: (date: Moment) => void,
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
      days: this._computeDays(props),
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.focus != nextProps.focus ||
        this.props.selected != nextProps.selected) {
      this.setState({
        days: this._computeDays(nextProps),
      })
    }
  }

  _computeDays = (props: Object) : Array<Array<Object>> => {
    let result = [];
    const currentMonth = props.focus.month();
    let iterator = Moment(props.focus);
    while (iterator.month() === currentMonth) {
      if (iterator.weekday() === 0 || result.length === 0) {
        result.push(_.times(7, _.constant({})));
      }
      let week = result[result.length - 1];
      week[iterator.weekday()] = {
        date: iterator.date(),
        selected: iterator.isSame(props.selected, 'day'),
        today: iterator.isSame(Moment(), 'day'),
      };
      // Add it to the result here.
      iterator.add(1, 'day');
    }
    LayoutAnimation.easeInEaseOut();
    return result;
  };

  _onChange = (day : Object) : void => {
    let date = Moment(this.props.focus).add(day.date - 1 , 'day');
    this.props.onChange && this.props.onChange(date);
  }

  render() {
    const weekViewStyle = StyleSheet.flatten([styles.weekView]) || {};
    return (
      <View style={[{
        // This helps us to have the same size for the wrapper, regardless of
        // the number of weeks in a month.
        // TODO: Enable this via property.
        // paddingBottom: (6 - this.state.days.length) * Number(weekViewStyle.height),
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
              <TouchableHighlight
                key={j}
                style={[styles.dayView]}
                activeOpacity={0.8}
                underlayColor='transparent'
                onPress={() => this._onChange(day)}>
                <Text style={[
                  day.today ? styles.todayText : null,
                  day.selected ? styles.selectedText : null,
                  styles.dayText,
                ]}>
                  {day.date}
                </Text>
              </TouchableHighlight>
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
    height: 40,
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
  },
  headerView: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
  },
  dayView: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  daynameView: {
    flex: 1,
    alignItems: 'center',
  },
  selectedText: {
    borderWidth: 1,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  dayText: {
    padding: 5,
    width: 32,
    textAlign: 'center',
    margin: 5,
  },
  todayText: {
    fontWeight: 'bold',
    borderBottomWidth: 1,
  },
});
