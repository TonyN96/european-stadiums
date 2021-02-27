const homepage = {
    index: {
        handler: function (request, h) {
            return h.view('homepage', { title: 'Home' });
        },
    }
  };
  
  module.exports = homepage;