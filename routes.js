const Accounts = require("./app/controllers/accounts");
const stadiums = require('./app/controllers/stadiums');

module.exports = [
    { method: "GET", path: "/", config: Accounts.index },
    { method: "GET", path: "/signup", config: Accounts.showSignup },
    { method: "GET", path: "/login", config: Accounts.showLogin },
    { method: "GET", path: "/logout", config: Accounts.logout },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },

    { method: "POST", path: "/signup", config: Accounts.signup },
    { method: "POST", path: "/login", config: Accounts.login },

    { method: 'GET', path: '/home', config: stadiums.index },
    { method: 'GET', path: '/add-stadium', config: stadiums.addStadiumView },
    { method: 'POST', path: '/add-stadium', config: stadiums.addStadium },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
            },
        },
        options: { auth: false }
    },
];