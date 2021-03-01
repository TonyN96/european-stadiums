'use strict';

const Accounts = {
    index: {
        handler: function (request, h) {
            return h.view('main', { title: 'Welcome to European Stadiums' });
        }
    },
    showSignup: {
        handler: function (request, h) {
            return h.view('signup', { title: 'Sign up for Donations' });
        }
    },
    signup: {
        handler: function (request, h) {
            return h.redirect('/stadiums');
        }
    },
    showLogin: {
        handler: function (request, h) {
            return h.view('login', { title: 'Login to European Stadiums' });
        }
    },
    login: {
        handler: function (request, h) {
            return h.redirect('/stadiums');
        }
    },
    logout: {
        handler: function (request, h) {
            return h.redirect('/');
        }
    }
};

module.exports = Accounts;