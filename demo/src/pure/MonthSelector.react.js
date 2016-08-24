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
  focus: Moment,
  onFocus?: (date: Moment) => void,
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
      group.push({
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
    console.log("ISH", focus);
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
                style={[styles.monthWrapper]}
                activeOpacity={0.8}
                underlayColor='transparent'
                onPress={() => this._onFocus(month.index)}>
                <Text style={[styles.monthText]}>
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
};

const styles = StyleSheet.create({
  groupWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  monthWrapper: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  monthText: {
  },
});
