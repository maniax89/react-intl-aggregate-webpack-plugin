# react-intl-aggregate-webpack-plugin

Small webpack plugin designed to take the output from `babel-plugin-react-intl` and aggregate it into one file.
An error will be thrown if there are messages in different components that use the same `id`.

It will output code that looks like:

```json
{
  "some-translation-id" : {
    "defaultMessage" : "I am a message",
    "description"    : "I am a description that helps translators"
  }
}
```

## Installation

```sh
$ npm install react-intl-aggregate-webpack-plugin
```

## Usage

In your webpack config file:

```javascript
var ReactIntlAggregatePlugin = require('react-intl-aggregate-webpack-plugin');
var I18N_DIR                 = '../../i18n/';
...
var config = {
  ...
  plugins: [
    ...
    new ReactIntlAggregatePlugin({
      messagesPattern: I18N_DIR + 'messages/**/*.json',
      aggregateOutputDir: I18N_DIR + 'aggregate/',
      aggregateFilename: 'en-US'
    })
  ]
}
...
module.exports = config;
```

## options

- **`aggregatePattern`**: The glob pattern used to retrieve the aggregate files for processing. Defaults to: `../../i18n/messages/**/*.json`.

- **`aggregateOutputDir`**: The target location where the plugin will output a `.json` file of the same basename corresponding to each aggregate file processed. Defaults to: `../../i18n/aggregate/`.

- **`aggregateFilename`**: The name of the file to be output that will get `.json` appended to it. Defaults to: `en-US`.

- **`translatorFunction`**: (optional) Allows you to pass a translator function to translate the message, receives the final message text as a parameter
