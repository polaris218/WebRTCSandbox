import * as data from './variables.prod.json';

export const environment = {
  production: true,
    api: {
        host: data['api'].host
    },
    socket: {
        url: data['socket'].url
    },
    upload: {
        url: data['upload'].url
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
