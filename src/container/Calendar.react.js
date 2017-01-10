/**
* Calendar container component.
* @flow
*/

console.ignoredYellowBox = ['Warning: Overriding '];

import React, { Component, PropTypes } from 'react';
import {
  LayoutAnimation,
  Slider,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';
// Pure components importing.
import YearSelector from '../pure/YearSelector.react';
import MonthSelector from '../pure/MonthSelector.react';
import DaySelector from '../pure/DaySelector.react';

type Stage = "day" | "month" | "year";
const DAY_SELECTOR : Stage = "day";
const MONTH_SELECTOR : Stage = "month";
const YEAR_SELECTOR : Stage = "year";

type Props = {
  // The core properties.
  selected?: Moment,
  onChange?: (date: Moment) => void,
  slideThreshold?: number,
  // Minimum and maximum date.
  minDate: Moment,
  maxDate: Moment,
  // The starting stage for selection. Defaults to day.
  startStage: Stage,
  // General styling properties.
  style?: View.propTypes.style,
  barView?: View.propTypes.style,
  barText?: Text.propTypes.style,
  stageView?: View.propTypes.style,
  // Styling properties for selecting the day.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayTodayText?: Text.propTypes.style,
  daySelectedText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the month.
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the year.
  yearMinTintColor?: string,
  yearMaxTintColor?: string,
  yearSlider?: Slider.propTypes.style,
  yearText?: Text.propTypes.style,
};
type State = {
  stage: Stage,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
};

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: props.startStage,
      focus: Moment(props.selected).startOf('month'),
    }
  }

  _stageText = () : string => {
    if (this.state.stage === DAY_SELECTOR) {
      return this.state.focus.format('MMMM YYYY');
    } else {
      return this.state.focus.format('YYYY');
    }
  }

  _previousStage = () : void => {
    if (this.state.stage === DAY_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: YEAR_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  };

  _nextStage = () : void => {
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: DAY_SELECTOR})
    }
    if (this.state.stage === YEAR_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    LayoutAnimation.easeInEaseOut();
  };

  _changeFocus = (focus : Moment) : void => {
    this.setState({focus});
    this._nextStage();
  };

  render() {
    const barStyle = StyleSheet.flatten([styles.barView, this.props.barView]);
    return (
      <View style={[{
        minWidth: 300,
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row',
        }}>
          <TouchableHighlight
              activeOpacity={this.state.stage !== YEAR_SELECTOR ? 0.8 : 1}
              underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
              onPress={this._previousStage}
              style={[styles.barView, this.props.barView]}>
            <Text style={this.props.barText}>
              {this._stageText()}
            </Text>
          </TouchableHighlight>
        </View>
        <View
          style={[styles.stageWrapper, this.props.stageView]}>
          {
            this.state.stage === DAY_SELECTOR ?
            <DaySelector
              focus={this.state.focus}
              selected={this.props.selected}
              onFocus={this._changeFocus}
              onChange={(date) => this.props.onChange && this.props.onChange(date)}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Control properties
              slideThreshold={this.props.slideThreshold}
              // Transfer the corresponding styling properties.
              dayHeaderView={this.props.dayHeaderView}
              dayHeaderText={this.props.dayHeaderText}
              dayRowView={this.props.dayRowView}
              dayView={this.props.dayView}
              daySelectedView={this.props.daySelectedView}
              dayText={this.props.dayText}
              dayTodayText={this.props.dayTodayText}
              daySelectedText={this.props.daySelectedText}
              dayDisabledText={this.props.dayDisabledText}
              /> :
            this.state.stage === MONTH_SELECTOR ?
            <MonthSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Styling properties
              monthText={this.props.monthText}
              monthDisabledText={this.props.monthDisabledText}
              /> :
            this.state.stage === YEAR_SELECTOR ?
            <YearSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Styling properties
              minimumTrackTintColor={this.props.yearMinTintColor}
              maximumTrackTintColor={this.props.yearMaxTintColor}
              yearSlider={this.props.yearSlider}
              yearText={this.props.yearText}
              /> :
            null
          }
        </View>
      </View>
    );
  }
}
Calendar.defaultProps = {
  minDate: Moment(),
  maxDate: Moment().add(10, 'years'),
  startStage: DAY_SELECTOR,
};

const styles = StyleSheet.create({
  barView: {
    flexGrow: 1,
    padding: 5,
    alignItems: 'center',
  },
  nextStage: {
    padding: 5,
    alignItems: 'center',
  },
  stageWrapper: {
    padding: 5,
    overflow: 'hidden',
  },
});
