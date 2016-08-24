/**
* Calendar container component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  PanResponder,
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
  onChange?: (date: Moment) => void,
};
type Selector = 1 | 2 | 3;
const DAY_SELECTOR = 1;
const MONTH_SELECTOR = 2;
const YEAR_SELECTOR = 3;
type State = {
  stage: Selector,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
};

// TODO: Monitor change in props for selected.

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;
  _panResponder: PanResponder;

  constructor(props: Props) {
    super(props);
    this.state = {
      stage: DAY_SELECTOR,
      focus: Moment().startOf('month'),
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
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Allow for swipe gestures only when we are in DAY_SELECTOR mode.
        if (this.state.stage === DAY_SELECTOR) {
          return true;
        }
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        this._slide(gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        // Get the height, width and compute the threshold and offset for swipe.
        const {height, width} = Dimensions.get('window');
        // TODO: Add width percentage and max swipe properties.
        const threshold = _.min([width / 2, 250]);
        const maxOffset = _.max([height, width]);
        const dx = gestureState.dx;

        // If the threshold is met perform the necessary animations and updates.
        if (Math.abs(dx) > threshold) {
          // Animate to the outside of the device the current scene.
          LayoutAnimation.linear(() => {
            // After that animation, update the focus date and then swipe in
            // the corresponding updated scene.
            this.setState({
              focus: Moment(this.state.focus).add(dx < 0 ? 1 : -1, 'month'),
            });
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
        } else {
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
                style={styles.previousStage}>
              <Text>{this._stageText()}</Text>
            </TouchableHighlight>
          : null}
        </View>
        <View
          ref="wrapper"
          style={styles.stageWrapper}
          {...this._panResponder.panHandlers}>
          {
            this.state.stage === DAY_SELECTOR ?
            <DaySelector
              focus={this.state.focus}
              selected={this.props.selected}
              onChange={(date) => this.props.onChange && this.props.onChange(date)}/> :
            this.state.stage === MONTH_SELECTOR ?
            <MonthSelector
              focus={this.state.focus}
              onFocus={(focus) => {this.setState({focus}); this._nextStage()}}/> :
            this.state.stage === YEAR_SELECTOR ?
            <YearSelector
              focus={this.state.focus}
              onFocus={(focus) => {this.setState({focus}); this._nextStage()}}/> :
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
