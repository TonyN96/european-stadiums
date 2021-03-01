"use strict";

const Stadiums = {
    index: {
        handler: function (request, h) {
            return h.view('home', {
                title: 'European Stadiums',
                stadiums: this.stadiums,
            });
        },
    },
    addStadiumView: {
        handler: function (request, h) {
            return h.view('add-stadium', { title: 'Add a Stadium' });
        },
    },
    addStadium: {
        handler: function (request, h) {
            const data = request.payload;
            var userEmail = request.auth.credentials.id;
            data.user = this.users[userEmail];
            this.stadiums.push(data);
            return h.redirect("/home");
        },
    },
};

module.exports = Stadiums;