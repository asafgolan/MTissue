var should = require('should'),
    sinon = require('sinon');



describe('exhibit controller tests:', function(){
  describe('Post', function(){
    var Exhibit = function(exhibit){this.save = function(){}};

    var req = {
      body: {
        language: 'arabic'
      }
    }

    var res = {
      status: sinon.spy(),
      send: sinon.spy()
    }

    var exhibitController =  require('../controllers/exhibit.server.controller.js')(Exhibit);
    exhibitController.post(req,res);

    res.status.calledWith(400).should.equal(true, 'bad status' + res.status.args [0][0]);
    res.send.calledWith('title is required').should.equal(true);
  });
});
