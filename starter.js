const argv = require('yargs').argv;
const fs = require('fs');
const http = require('http');
const exec = require('child_process').exec;
const variables = require('./src/environments/defaults.json');
const result = {};

for (let i in argv) {
  if (argv.hasOwnProperty(i) && variables.hasOwnProperty(i)) {
    result[i] = Object.assign(variables[i], argv[i]);
  }
}

fs.writeFileSync('./src/environments/variables.json', JSON.stringify( Object.assign(variables, result) ));

exec('ng serve --host 0.0.0.0 --environment=dev --port 3680 --disable-host-check --public-host repo.braingines.com:3680');
