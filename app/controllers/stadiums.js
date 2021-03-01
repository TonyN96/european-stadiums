const stadiums = {
    index: {
        handler: function (request, h) {
            return h.view('home', { title: 'European Stadiums' });
        },
    },
    addStadium: {
        handler: function (request, h) {
            return h.view('add-stadium', { title: 'Add a Stadium' });
        },
    },
  };
  
module.exports = stadiums;