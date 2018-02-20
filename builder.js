const argv = require('yargs').argv;
const fs = require('fs');
const exec = require('child_process').exec;
const variables = require('./src/environments/defaults.json');
const result = {};

for (let i in argv) {
  if (argv.hasOwnProperty(i) && variables.hasOwnProperty(i)) {
    result[i] = Object.assign(variables[i], argv[i]);
  }
}

fs.writeFileSync('./src/environments/variables.prod.json', JSON.stringify( Object.assign(variables, result) ));

exec('ng build --environment=prod');
