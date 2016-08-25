/**
* Calendar container component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  LayoutAnimation,
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
  // Minimum and maximum date.
  minDate: Moment,
  maxDate: Moment,
  // The starting stage for selection. Defaults to day.
  startStage: Stage,
  // Styling properties.
  style?: View.propTypes.style,
  barView?: View.propTypes.style,
  barText?: Text.propTypes.style,

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
    } else if (this.state.stage === MONTH_SELECTOR) {
      return this.state.focus.format('YYYY');
    } else {
      return '';
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
    return (
      <View style={[{
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row',
        }}>
          {this.state.stage !== YEAR_SELECTOR ?
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='transparent'
                onPress={this._previousStage}
                style={[styles.barView, this.props.barView]}>
              <Text style={this.props.barText}>
                {this._stageText()}
              </Text>
            </TouchableHighlight>
          : null}
        </View>
        <View
          style={styles.stageWrapper}>
          {
            this.state.stage === DAY_SELECTOR ?
            <DaySelector
              focus={this.state.focus}
              selected={this.props.selected}
              onFocus={this._changeFocus}
              onChange={(date) => this.props.onChange && this.props.onChange(date)}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}/> :
            this.state.stage === MONTH_SELECTOR ?
            <MonthSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}/> :
            this.state.stage === YEAR_SELECTOR ?
            <YearSelector
              focus={this.state.focus}
              onFocus={this._changeFocus}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}/> :
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
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  nextStage: {
    padding: 5,
    alignItems: 'center',
  },
  stageWrapper: {
    padding: 5,
  },
});
