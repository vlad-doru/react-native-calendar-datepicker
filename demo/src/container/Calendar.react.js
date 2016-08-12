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
// Pure components importing.
import YearSelector from '../pure/YearSelector.react';
import MonthSelector from '../pure/MonthSelector.react';
import DaySelector from '../pure/DaySelector.react';

type Props = {
  children?: any,
  style?: View.propTypes.style,
};
type Selector = 1 | 2 | 3;
const DAY_SELECTOR = 1;
const MONTH_SELECTOR = 2;
const YEAR_SELECTOR = 3;
type State = {
  stage: Selector,
};

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: DAY_SELECTOR,
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

  componentWillUpdate() {
    // Automatically insert animations.
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={[{

        // Wrapper view default style.
      },this.props.style]}>
        <TouchableHighlight onPress={this._previousStage}>
          <Text>Stage Selector</Text>
        </TouchableHighlight>
        <View style={{overflow: "hidden"}}>
          <View style={{
            height: this.state.stage !== DAY_SELECTOR ? 0 : undefined,
          }}>
            <DaySelector/>
          </View>
          <View style={{
            height: this.state.stage !== MONTH_SELECTOR ? 0 : undefined,
          }}>
            <MonthSelector/>
          </View>
          <View style={{
            height: this.state.stage !== YEAR_SELECTOR ? 0 : undefined,
          }}>
            <YearSelector/>
          </View>
        </View>
      </View>
    );
  }
}
Calendar.defaultProps = {};

const styles = StyleSheet.create({
});
