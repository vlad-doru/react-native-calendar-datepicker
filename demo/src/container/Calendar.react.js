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

type Props = {
  children?: any,
  style?: View.propTypes.style,
  selected: Moment,
};
type Selector = 1 | 2 | 3;
const DAY_SELECTOR = 1;
const MONTH_SELECTOR = 2;
const YEAR_SELECTOR = 3;
type State = {
  stage: Selector,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
  // The selected date that will be encapsulated in the state.
  selected: Moment,
};

// TODO: Monitor change in props for selected.

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: DAY_SELECTOR,
      focus: Moment().startOf('month'),
      selected: props.selected,
    }
  }

  _previousStage = () : void => {
    if (this.state.stage === DAY_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: YEAR_SELECTOR})
    }
  };

  _nextStage = () : void => {
    if (this.state.stage === MONTH_SELECTOR) {
      this.setState({stage: DAY_SELECTOR})
    }
    if (this.state.stage === YEAR_SELECTOR) {
      this.setState({stage: MONTH_SELECTOR})
    }
  };

  componentWillUpdate() {
    // Automatically insert animations.
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={[{
        // Wrapper view default style.
      },this.props.style]}>
        <View style={{
          flexDirection: 'row',
        }}>
          {this.state.stage !== DAY_SELECTOR ?
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='transparent'
                onPress={this._nextStage}
                style={styles.nextStage}>
              <Text>Back</Text>
            </TouchableHighlight>
          : null}
          {this.state.stage !== YEAR_SELECTOR ?
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='transparent'
                onPress={this._previousStage}
                style={styles.previousStage}>
              <Text>Stage selector</Text>
            </TouchableHighlight>
          : null}
        </View>
        <View style={styles.stageWrapper}>
          {
            this.state.stage === DAY_SELECTOR ?
            <DaySelector
              focus={this.state.focus}
              selected={this.state.selected}/> :
            this.state.stage === MONTH_SELECTOR ?
            <MonthSelector/> :
            this.state.stage === YEAR_SELECTOR ?
            <YearSelector/> :
            null
          }
        </View>
      </View>
    );
  }
}
Calendar.defaultProps = {
  selected: Moment(),
};

const styles = StyleSheet.create({
  previousStage: {
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
