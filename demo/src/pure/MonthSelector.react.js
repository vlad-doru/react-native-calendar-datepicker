/**
* MonthSelector pure component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';

type Props = {
  style?: View.propTypes.style,
  // Controls the focus of the calendar.
  focus: Moment,
  onFocus?: (date: Moment) => void,
  // Minimum and maximum valid dates.
  minDate: Moment,
  maxDate: Moment,
};
type State = {
  months: Array<Array<Object>>,
};

export default class MonthSelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Object) {
    super(props);

    const months = Moment.months();
    let groups = [];
    let group = [];
    _.map(months, (month, index) => {
      if (index % 3 === 0) {
        group = [];
        groups.push(group);
      }
      // Check if the month is valid.
      let maxChoice = Moment(this.props.focus).month(index).endOf('month');
      let minChoice = Moment(this.props.focus).month(index).startOf('month');
      group.push({
        valid: this.props.maxDate.diff(minChoice, 'seconds') >= 0 &&
               this.props.minDate.diff(maxChoice, 'seconds') <= 0,
        name: month,
        index,
      });
    })
    this.state = {
      months: groups,
    };
  }

  _onFocus = (index : number) : void => {
    let focus = Moment(this.props.focus);
    focus.month(index);
    this.props.onFocus && this.props.onFocus(focus);
  }

  render() {
    return (
      <View style={[{
        // Wrapper view default style.
      },this.props.style]}>
        {_.map(this.state.months, (group, i) =>
          <View key={i} style={[styles.groupWrapper]}>
            {_.map(group, (month, j) =>
              <TouchableHighlight
                key={j}
                style={styles.monthWrapper}
                activeOpacity={month.valid ? 0.8 : 1}
                underlayColor='transparent'
                onPress={() => month.valid && this._onFocus(month.index)}>
                <Text style={[
                  // TODO: Add for text styles as properties.
                  styles.monthText,
                  month.valid ? null : styles.disabledMonth,
                ]}>
                  {month.name}
                </Text>
              </TouchableHighlight>
            )}
          </View>
        )}
      </View>
    );
  }
}
MonthSelector.defaultProps = {
  focus: Moment(),
  minDate: Moment(),
  maxDate: Moment(),
};

const styles = StyleSheet.create({
  groupWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  monthWrapper: {
    flex: 1,
  },
  monthText: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  disabledMonth: {
    color: 'grey',
    borderColor: 'grey',
  },
});
