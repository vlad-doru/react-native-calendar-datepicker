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

// Unicode characters
const LEFT_CHEVRON = '\u276E';
const RIGHT_CHEVRON = '\u276F';

type Props = {
  // The core properties.
  selected?: Moment,
  onChange?: (date: Moment) => void,
  slideThreshold?: number,
  // Minimum and maximum date.
  minDate: Moment,
  maxDate: Moment,
  // The starting stage for selection. Defaults to day.
  // Can be overwritten by finalStage.
  startStage: Stage,
  // The final stage for selection. Default to day. If month then the user will
  // not be able to select the month.
  finalStage: Stage,
  // General styling properties.
  style?: View.propTypes.style,
  barView?: View.propTypes.style,
  barText?: Text.propTypes.style,
  stageView?: View.propTypes.style,
  showArrows: boolean,
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
  monthSelectedText?: Text.propTypes.style,
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
  monthOffset?: number,
};

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    const stage = String(props.startStage) < String(props.finalStage) ?
                  props.finalStage : props.startStage;
    this.state = {
      stage: stage,
      focus: Moment(props.selected).startOf('month'),
      monthOffset: 0,
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

  _previousMonth = () : void => {
    this.setState({monthOffset: -1});
  };

  _nextMonth = () : void => {
    this.setState({monthOffset: 1});
  };

  _changeFocus = (focus : Moment) : void => {
    this.setState({focus, monthOffset: 0});
    if (this.props.finalStage != DAY_SELECTOR &&
        this.state.stage == this.props.finalStage) {
      this.props.onChange && this.props.onChange(focus);
    } else {
      this._nextStage();
    }
  };

  render() {
    const barStyle = StyleSheet.flatten([styles.barView, this.props.barView]);

    const previousMonth = Moment(this.state.focus).subtract(1, 'month');
    const previousMonthValid = this.props.minDate.diff(Moment(previousMonth).endOf('month'), 'seconds') <= 0;
    const nextMonth = Moment(this.state.focus).add(1, 'month');
    const nextMonthValid = this.props.maxDate.diff(Moment(nextMonth).startOf('month'), 'seconds') >= 0;

    return (
      <View style={[{
        minWidth: 300,
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={[styles.barView, this.props.barView]}>
            { this.props.showArrows && this.state.stage === DAY_SELECTOR && previousMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._previousMonth}
              >
                <Text style={this.props.barText}>{LEFT_CHEVRON}</Text>
              </TouchableHighlight> : <View/>
            }

            <TouchableHighlight
              activeOpacity={this.state.stage !== YEAR_SELECTOR ? 0.8 : 1}
              underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
              onPress={this._previousStage}
              style={{ alignSelf: 'center' }}
            >
              <Text style={this.props.barText}>
                {this._stageText()}
              </Text>
            </TouchableHighlight>

            { this.props.showArrows && this.state.stage === DAY_SELECTOR && nextMonthValid ?
              <TouchableHighlight
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                underlayColor={barStyle ? barStyle.backgroundColor : 'transparent'}
                onPress={this._nextMonth}
              >
                <Text style={this.props.barText}>{RIGHT_CHEVRON}</Text>
              </TouchableHighlight> : <View/>
            }
          </View>
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
              monthOffset={this.state.monthOffset}
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
              selected={this.props.selected}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
              // Styling properties
              monthText={this.props.monthText}
              monthDisabledText={this.props.monthDisabledText}
              selectedText={this.props.monthSelectedText}
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
  finalStage: DAY_SELECTOR,
  showArrows: true,
};

const styles = StyleSheet.create({
  barView: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
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
