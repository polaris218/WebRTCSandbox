const argv = require('yargs').argv;
const fs = require('fs');
const exec = require('child_process').exec;
const variables = require('./src/environments/variables.json');
const result = {};

for (let i in argv) {
  if (argv.hasOwnProperty(i) && variables.hasOwnProperty(i)) {
    result[i] = Object.assign(variables[i], argv[i]);
  }
}

console.log('process: ', argv);

fs.writeFileSync('./src/environments/variables.json', JSON.stringify( Object.assign(variables, result) ));

exec('ng serve --port 8080');
