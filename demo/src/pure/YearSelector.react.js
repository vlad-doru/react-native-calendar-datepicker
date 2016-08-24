/**
* YearSelector pure component.
* @flow
*/

import React, { Component, PropTypes } from 'react';
import {
  Slider,
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
  onFocus?: (date : Moment) => void,
};
type State = {
  year: Number,
};

export default class YearSelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor(props: Object) {
    super(props);
    this.state = {
      year: props.focus.year(),
    }
  }

  _onFocus = (year : number) : void => {
    let date = Moment(this.props.focus);
    date.year(year);
    this.props.onFocus && this.props.onFocus(date);
  }

  render() {
    return (
      <View style={[{
        // Wrapper view default style.
      },this.props.style]}>
        <Text>{this.state.year}</Text>
        <Slider
          // TODO: Property for minimum value.
          minimumValue={1900}
          maximumValue={2100}
          step={1}
          value={this.props.focus.year()}
          onValueChange={(year) => this.setState({year})}
          onSlidingComplete={(year) => this._onFocus(year)}
          />
      </View>
    );
  }
}
YearSelector.defaultProps = {
  focus: Moment().startOf('month'),
};

const styles = StyleSheet.create({
});
