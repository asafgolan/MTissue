var should = require('should'),
    request = require('supertest'),
    app = ('../app.js'),
    mongoose = require('mongoose'),
    //Exhibit = mongoose.model('Exhibit');
    Exhibit = require('../models/exhibitModel'),
    agent = request.agent(app);

    describe('Exhibit CRUD Test', function(){
      it('should post an exhibit and return title and _id', function(done){
        var exhibitPost = {
          title:'new exhibit',
          language: 'new language',
          content: 'new content'
        }
        console.log(exhibitPost);
        agent.post('/api/exhibits')
          .send(exhibitPost)
          .expect(200)
          .end(function(err, results){
            console.log(err);
            //results.body.title.should.equal('new exhibit');
            results.body.should.have.property('_id');
            done()
          })
      })
      afterEach(function(done){
        Exhibit.remove().exec();
        done();
      })
    })

/**var should = require('should'),
        request = require('supertest'),
        app = require('../app.js'),
        mongoose = require('mongoose'),
        Book = mongoose.model('Book'),
        agent = request.agent(app);


    describe('Book Crud Test', function(){
        it('Should allow a book to be posted and return a read and _id', function(done){
            var bookPost = {title:'new Book', author:'Jon', genre:'Fiction'};

            agent.post('/api/books')
                .send(bookPost)
                .expect(200)
                .end(function(err, results){
                    results.body.read.should.not.equal(false);
                    results.body.should.have.property('_id');
                    done()
                })
        })

        afterEach(function(done){
            Book.remove().exec();
            done();
        })
    })**/
