import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import CardExampleControlled from '../components/CardExampleControlled';
// Import some examples from material-ui
// import CardExampleControlled from '../CardExampleControlled.jsx';
// import RaisedButtonExampleSimple from '../RaisedButtonExampleSimple.jsx';
// import DatePickerExampleSimple from '../DatePickerExampleSimple.jsx';

storiesOf('Material-UI', module)
  // Add the `muiTheme` decorator to provide material-ui support to your stories.
  // If you do not specify any arguments it starts with two default themes
  // You can also configure `muiTheme` as a global decorator.
  .addDecorator(muiTheme())
  .add('Card Example Controlled', () => (
    <CardExampleControlled />
  ));
  // .add('Raised Button Example Simple', () => (
  //   <RaisedButtonExampleSimple />
  // ))
  // .add('Date Picker Example Simple', () => (
  //   <DatePickerExampleSimple />
  // ));