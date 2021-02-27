const Dashboard = require('./app/controllers/dashboard');

module.exports = [
    { method: 'GET', path: '/', config: Dashboard.index },
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