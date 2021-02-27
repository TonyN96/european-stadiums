const Homepage = require('./app/controllers/homepage');

module.exports = [
    { method: 'GET', path: '/', config: Homepage.index },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
            },
        },
    },
];