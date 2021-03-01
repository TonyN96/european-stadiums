const accounts = require("./app/controllers/accounts");
const stadiums = require('./app/controllers/stadiums');

module.exports = [
    { method: "GET", path: "/", config: accounts.index },
    { method: "GET", path: "/signup", config: accounts.showSignup },
    { method: "GET", path: "/login", config: accounts.showLogin },
    { method: "GET", path: "/logout", config: accounts.logout },

    { method: "POST", path: "/signup", config: accounts.signup },
    { method: "POST", path: "/login", config: accounts.login },

    { method: 'GET', path: '/home', config: stadiums.index },
    { method: 'GET', path: '/add-stadium', config: stadiums.addStadium },

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