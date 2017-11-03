/**
* YearSelector pure component.
* @flow
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Slider,
  View,
  Text,
  StyleSheet,
  Picker,
} from 'react-native';
import ViewPropTypes from '../util/ViewPropTypes';

// Component specific libraries.
import _ from 'lodash';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

type Props = {
  style?: ViewPropTypes.style,
  // Focus and onFocus for managing the calendar.
  focus: Moment,
  onFocus?: (date : Moment) => void,
  // Minimum and maximum date allowed.
  minDate: Moment,
  maxDate: Moment,
  // Styling properties.
  minimumTrackTintColor?: string,
  maximumTrackTintColor?: string,
  yearSlider?: Slider.propTypes.style,
  yearText?: Text.propTypes.style,
  yearSelectorType?: string,
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

  renderSliderOrDropdown(values) {
    if (this.props.yearSelectorType === 'dropdown') {
      return(
        <View>
          <Picker
            selectedValue={`${this.state.year}`}
            onValueChange={(year) => this.setState({year})}
          >
            {values}
          </Picker>
          <Icon.Button name="check" size={40} alignSelf="center" underlayColor="transparent" backgroundColor="transparent" borderRadius={0} color={"black"} onPress={() => this._onFocus(this.state.year)}/>
        </View>
      );
    }

    return(
      <View>
        <Slider
            minimumValue={this.props.minDate.year()}
            maximumValue={this.props.maxDate.year()}
            // TODO: Add a property for this.
            minimumTrackTintColor={this.props.minimumTrackTintColor}
            maximumTrackTintColor={this.props.maximumTrackTintColor}
            step={1}
            value={this.props.focus.year()}
            onValueChange={(year) => this.setState({year})}
            onSlidingComplete={(year) => this._onFocus(year)}
            style={[this.props.yearSlider]}
        />
        <Text style={[styles.yearText, this.props.yearText]}>
          {this.state.year}
        </Text>
      </View>
    );
  }

  render() {
    const values = Array(this.props.maxDate.year() - this.props.minDate.year() + 1).fill().map((_,i) => (
      <Picker.Item
        key={`${this.props.minDate.year() + i}`}
        value={`${this.props.minDate.year() + i}`}
        label={`${this.props.minDate.year() + i}`}
      />
    ));
    return (
      <View style={[{
        flexGrow: 1,
        // Wrapper view default style.
      },this.props.style]}>
        {this.renderSliderOrDropdown(values)}
      </View>
    );
  }
}
YearSelector.defaultProps = {
  focus: Moment().startOf('month'),
  minDate: Moment(),
  maxDate: Moment(),
};

const styles = StyleSheet.create({
  yearText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  }
});
