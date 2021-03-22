const Accounts = require("./app/controllers/accounts");
const Stadiums = require('./app/controllers/stadiums');

module.exports = [
    { method: "GET", path: "/", config: Accounts.index },
    { method: "GET", path: "/signup", config: Accounts.showSignup },
    { method: "GET", path: "/login", config: Accounts.showLogin },
    { method: "GET", path: "/logout", config: Accounts.logout },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'GET', path: '/delete-account/{id}', config: Accounts.deleteAccount },
    { method: 'GET', path: '/admin-dashboard', config: Accounts.adminDashboard },

    { method: "POST", path: "/signup", config: Accounts.signup },
    { method: "POST", path: "/login", config: Accounts.login },

    { method: 'GET', path: '/home', config: Stadiums.index },
    { method: 'GET', path: '/add-stadium', config: Stadiums.addStadiumView },
    { method: 'POST', path: '/add-stadium', config: Stadiums.addStadium },
    { method: 'GET', path: '/delete-stadium/{id}', config: Stadiums.deleteStadium },
    { method: 'GET', path: '/edit-stadium/{id}', config: Stadiums.editStadiumView },
    { method: 'POST', path: '/edit-stadium/{id}', config: Stadiums.editStadium },

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