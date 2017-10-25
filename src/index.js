import * as fs from 'fs';
import * as path from 'path';
import {sync as globSync} from 'glob';
import {sync as mkdirpSync} from 'mkdirp';

function ReactIntlAggregatePlugin(plugin_options) {
  this.plugin_options = plugin_options;
}

ReactIntlAggregatePlugin.prototype.apply = function (compiler) {
  let messagesPattern    = this.plugin_options.messagesPattern ||
                            '../../i18n/messages/**/*.json';
  let aggregateOutputDir = this.plugin_options.aggregateOutputDir ||
                            '../../i18n/aggregate/';
  let aggregateFilename  = this.plugin_options.aggregateFilename ||
                            'en-US';

  compiler.plugin('emit', function (compilation, callback) {
    const MESSAGES_PATTERN = path.resolve(__dirname, messagesPattern);
    const AGGREGATE_DIR    = path.resolve(__dirname, aggregateOutputDir);
    const AGGREGATE_FILE   = path.resolve(AGGREGATE_DIR, aggregateFilename +
                              '.json');

    console.log('Messages pattern: ' + MESSAGES_PATTERN);
    console.log('Aggregate dir: ' + AGGREGATE_DIR)
    let defaultMessages = globSync(MESSAGES_PATTERN)
      .map((filename) => fs.readFileSync(filename, 'utf8'))
      .map((file) => JSON.parse(file))
      .reduce((collection, descriptors) => {
        descriptors.forEach(({id, defaultMessage, description}) => {
          if (collection.hasOwnProperty(id) && collection[id].description !== description) {
            throw new Error(`Duplicate message id: ${id}`);
          }
          collection[id] = {};
          collection[id]["defaultMessage"] = defaultMessage;
          if (description) {
            collection[id].description = description;
          }
        });
        return collection;
      }, {});

    console.log('Creating directory: ' + AGGREGATE_DIR);
    mkdirpSync(AGGREGATE_DIR);
    console.log('Writing file: ' + AGGREGATE_FILE + ' with ' +
      Object.keys(defaultMessages).length + ' keys');
    let aggregateTranslations = JSON.stringify(defaultMessages, null, 2);
    fs.writeFileSync(AGGREGATE_FILE, aggregateTranslations);
    console.log('Aggregating translations JSON complete!');
    callback();
  });
};

module.exports = ReactIntlAggregatePlugin;
