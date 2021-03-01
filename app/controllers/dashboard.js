const dashboard = {
    index: {
        handler: function (request, h) {
            return h.view('add-stadium', { title: 'Add a Stadium' });
        },
    },
    stadiums: {
        handler: function (request, h) {
            return h.view('stadiums', { title: 'European Stadiums' });
        },
    },
  };
  
module.exports = dashboard;