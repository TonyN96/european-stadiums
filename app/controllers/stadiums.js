const stadiums = {
    index: {
        handler: function (request, h) {
            return h.view('home', { title: 'European Stadiums' });
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
            return h.redirect("/index");
        },
    },
};

module.exports = stadiums;