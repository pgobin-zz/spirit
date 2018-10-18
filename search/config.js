// ASCII
const figlet = require('figlet');

// Greet
const greet = () => {
  figlet.text('ENIGMA', {
    font: 'Calvin S',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    console.log('spirit//search system v1.0')
  });
}

greet()

// Elasticsearch
const elasticsearch = require('elasticsearch');
const eclient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// Validate connection
eclient.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('Elasticsearch cluster is down!');
  } else {
    // console.log('All is well');
  }
});

module.exports.eclient = eclient;
