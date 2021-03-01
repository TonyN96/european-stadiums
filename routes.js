const accounts = require("./app/controllers/accounts");
const dashboard = require('./app/controllers/dashboard');

module.exports = [
    { method: "GET", path: "/", config: accounts.index },
    { method: "GET", path: "/signup", config: accounts.showSignup },
    { method: "GET", path: "/login", config: accounts.showLogin },
    { method: "GET", path: "/logout", config: accounts.logout },
    { method: "POST", path: "/signup", config: accounts.signup },
    { method: "POST", path: "/login", config: accounts.login },

    { method: 'GET', path: '/add-stadiums', config: dashboard.index },
    { method: 'GET', path: '/stadiums', config: dashboard.stadiums },

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