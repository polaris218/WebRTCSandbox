// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as data from './variables.json';

export const environment = {
    production: false,
    webdev: {
        host: data['webdev'].host
    },
    api: {
        host: data['api'].host
    },
    socket: {
        url: data['socket'].url
    },
    upload: {
        url: 'http://yes.tomatl.org:3005/upload'
    },
    media: {
        images: '/assets/'
    },
    social: {
        prefix: 'http://www.gpu.audio/sb/'
    },
    postmessage: {
        origin: ['http://localhost:8081']
    }
};
