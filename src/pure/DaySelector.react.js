/**
* DaySelector pure component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  PanResponder,
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
  // Focus and selection control.
  focus: Moment,
  selected?: Moment,
  onChange?: (date: Moment) => void,
  onFocus?: (date: Moment) => void,
  slideThreshold?: number,
  // Minimum and maximum dates.
  minDate: Moment,
  maxDate: Moment,
  // Styling properties.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayTodayText?: Text.propTypes.style,
  daySelectedText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
};
type State = {
  days: Array<Array<Object>>,
};

export default class DaySelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;
  _panResponder: PanResponder;

  constructor(props: Props) {
    super(props);
    this.state = {
      days: this._computeDays(props),
    }
  }

  _slide = (dx : number) => {
    this.refs.wrapper.setNativeProps({
      style: {
        left: dx,
      }
    })
  };

  componentWillMount() {
    // Hook the pan responder to interpretate gestures.
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
          return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        this._slide(gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        // Get the height, width and compute the threshold and offset for swipe.
        const {height, width} = Dimensions.get('window');
        const threshold = this.props.slideThreshold || _.min([width / 3, 250]);
        const maxOffset = _.max([height, width]);
        const dx = gestureState.dx;
        const newFocus = Moment(this.props.focus).add(dx < 0 ? 1 : -1, 'month');
        const valid =
          this.props.maxDate.diff(
            Moment(newFocus).startOf('month'), 'seconds') >= 0 &&
          this.props.minDate.diff(
            Moment(newFocus).endOf('month'), 'seconds') <= 0;

        // If the threshold is met perform the necessary animations and updates,
        // and there is at least one valid date in the new focus perform the
        // update.
        if (Math.abs(dx) > threshold && valid) {
          // Animate to the outside of the device the current scene.
          LayoutAnimation.linear(() => {
            // After that animation, update the focus date and then swipe in
            // the corresponding updated scene.
            this.props.onFocus && this.props.onFocus(newFocus);
            LayoutAnimation.easeInEaseOut();
            setTimeout(() => {
              this._slide(dx < 0 ? maxOffset : -maxOffset)
              setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this._slide(0)
              }, 0)
            }, 0)
          });
          this._slide(dx > 0 ? maxOffset : -maxOffset);
          return;
        } else {
          // Otherwise cancel the animation.
          LayoutAnimation.spring();
          this._slide(0);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        LayoutAnimation.spring();
        this._slide(0)
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
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
        valid: this.props.maxDate.diff(iterator, 'seconds') >= 0 &&
               this.props.minDate.diff(iterator, 'seconds') <= 0,
        date: iterator.date(),
        selected: props.selected && iterator.isSame(props.selected, 'day'),
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
    return (
      <View>
        <View style={[styles.headerView, this.props.dayHeaderView]}>
          {_.map(Moment.weekdaysShort(true), (day) =>
            <Text key={day} style={[styles.headerText, this.props.dayHeaderText]}>
              {day}
            </Text>
          )}
        </View>
        <View ref="wrapper" {...this._panResponder.panHandlers}>
          {_.map(this.state.days, (week, i) =>
            <View key={i} style={[
                styles.rowView,
                this.props.dayRowView,
                i === this.state.days.length - 1 ? {
                  borderBottomWidth: 0,
                } : null,
              ]}>
              {_.map(week, (day, j) =>
                <TouchableHighlight
                  key={j}
                  style={[
                    styles.dayView,
                    this.props.dayView,
                    day.selected ? this.props.daySelectedView : null
                  ]}
                  activeOpacity={day.valid ? 0.8 : 1}
                  underlayColor='transparent'
                  onPress={() => day.valid && this._onChange(day)}>
                  <Text style={[
                    styles.dayText,
                    this.props.dayText,
                    day.today ? this.props.dayTodayText : null,
                    day.selected ? styles.selectedText : null,
                    day.selected ? this.props.daySelectedText : null,
                    day.valid ? null : styles.disabledText,
                    day.valid ? null : this.props.dayDisabledText,
                  ]}>
                    {day.date}
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
DaySelector.defaultProps = {
  focus: Moment().startOf('month'),
  minDate: Moment(),
  maxDate: Moment(),
};

const styles = StyleSheet.create({
  headerView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    height: 35,
  },
  headerText: {
    flexGrow: 1,
    minWidth: 40,
    textAlign: 'center',
  },
  rowView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    height: 35,
  },
  dayView: {
    flexGrow: 1,
    margin: 5,
  },
  dayText: {
    flexGrow: 1,
    minWidth: 30,
    padding: 5,
    textAlign: 'center',
  },
  selectedText: {
    borderRadius: 5,
    borderWidth: 1,
    fontWeight: 'bold',
  },
  disabledText: {
    borderColor: 'grey',
    color: 'grey',
  },
});
