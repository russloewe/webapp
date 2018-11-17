var expect = require("chai").expect;
var db = require("../db/db.js");
var db_article = require("../db/db_articles.js");

describe("Postgres Database direct test", function() {
  describe("Connecting to the database", function() {
    it("Authenticated user connected.", function(done1) {
      db.pool.connect((err, client, done2) => {
          if(err){ throw err}
          done1();
          done2();
      });
     
    }).timeout(1000);
  });
});

describe("Test user database internal api", function(){
    describe('.addUser()', function() {
        it('Should insert user record to database', function(done) {
            var user = {username: 'testuser5',
                    password: 'testpassword',
                    passsalt: 'testsalt',
                    email:    'testemail5',
                    user_type: 3};
            db.addUser(user, function(err, result) {
                expect(err).to.be.null;
                db.findByName('testuser5', function(err2, res) {
                    expect(err2).to.be.null;
                    expect(res.username).to.exist;
                    expect(res.username).to.be.a('string').and.to.equal('testuser5');
                    done();
                })
            });
        }).timeout(1000);
    });
    describe('.getAllUsers()', function(){
        it("Should get a list of all the users", function(done) {
            db.getAllUsers(function(err, results) {
                expect(err).to.be.null;
                expect(results).to.not.be.null;
                expect(results).to.be.a('array');
                expect(results[0]).to.have.property('username').and.to.be.a('string');
                expect(results[0]).to.have.property('password').and.to.be.a('string');
                expect(results[0]).to.have.property('passsalt').and.to.be.a('string');
                expect(results[0]).to.have.property('email').and.to.be.a('string');
                expect(results[0]).to.have.property('user_id').and.to.be.a('number');
                done();
            })
        })
    });
    describe('.findByName()', function () {
        it("Should return bob's record", function(done) {
            db.findByName("bob", function(err, result){
                expect(err).to.be.null;
                expect(result).to.have.property('username');
                expect(result.user_id).to.equal(2);
                done();
            })
        })
    });
    describe('.findById()', function () {
        it("Should return bob's record", function(done) {
            db.findById(2, function(err, result){
                expect(err).to.be.null;
                expect(result).to.have.property('username').and.to.equal('bob');
                expect(result.user_id).to.equal(2);
                done();
            })
        }).timeout(1000);
    });
    describe('.updateUser', function(){
        it('Should update the user email', function(done){
            db.findByName('testuser5', function(err, res) {
                expect(err).to.be.null;
                db.updateUser(res.user_id, 'email', 'newgmail2', function(err2,res2){
                    expect(err2).to.be.null;
                    db.findById(res.user_id, function(err3, res3){
                        expect(err3).to.be.null;
                        expect(res3.email).to.equal('newgmail2');
                        done();
                    });
                });
            });
        }).timeout(1000);
        it('Should update the user type', function(done){
            db.findByName('testuser5', function(err, res) {
                expect(err).to.be.null;
                db.updateUser(res.user_id, 'user_type', 5, function(err2,res2){
                    expect(err2).to.be.null;
                    db.findById(res.user_id, function(err3, res3){
                        expect(err3).to.be.null;
                        expect(res3.user_type).to.equal(5);
                        done();
                    });
                });
            });
        }).timeout(1000);
    });
    describe('.sqlAddUserFormat', function() {
        it("Should get right formatted string", function(done){
            const user = {username: 'testuser',
                          password: 'testpassword',
                          passsalt: 'testsalt',
                          email:    'testemail',
                          user_type: 3};
            const formatted = db.sqlAddUserFormat(user);
            expect(formatted).to.be.a('string');
            expect(formatted).to.equal("INSERT INTO users (username, password, passsalt, email, user_type, created_on) VALUES('testuser','testpassword','testsalt','testemail', 3, CURRENT_TIMESTAMP);");
            done();
        });
    });
    describe('.removeUserName()', function() {
        it('Should remove user using username', function(done) {
            db.removeUserName('testuser5', function(err, res) {
                expect(err).to.be.null;
                done();
            })
        }).timeout(1000);
    });
}) 

describe("Test article database internal api", function(){
    var test_id;
    before(function(done){
        article = {title: 'test article',
                   author: 'test author',
                   keywords: 'test test',
                   text: 'Article text body'};
        db_article.addArticle(article, "articles", function(err, result) {
                expect(err).to.be.null;
                db_article.getLastArticle("articles", function(err2, result2) {
                    expect(err2).to.be.null;
                    expect(result2).to.be.a('number');
                    console.log("Created article id: " + result2);
                    test_id = result2;
                    done();
                })
            });
        });

    describe('.getArticles()', function(){
        it("Should get a list of all the articles", function(done) {
            db_article.getArticles("articles", function(err, results) {
                expect(err).to.be.null;
                expect(results).to.not.be.null;
                expect(results).to.be.a('array');
                expect(results[0]).to.have.property('title').and.to.be.a('string');
                expect(results[0]).to.have.property('author').and.to.be.a('string');
                expect(results[0]).to.have.property('text').and.to.be.a('string');
                expect(results[0]).to.have.property('keywords').and.to.be.a('string');
                expect(results[0]).to.have.property('article_id').and.to.be.a('number');
                done();
            })
        }).timeout(1000);
    });
    describe('.findArticle()', function () {
        it("Should return test article", function(done) {
            db_article.findArticle(test_id,"articles",  function(err, result){
                expect(err).to.be.null;
                expect(result).to.not.be.null;
                expect(result).to.have.property('title').and.to.equal('test article');
                expect(result.article_id).to.equal(test_id);
                done();
            })
        }).timeout(1000);
    });
    describe('.updateArticle', function(){
        it('Should update the article keywords', function(done){
            const rand_key = Math.random().toString(36).substring(2, 20);
            const rand_text = Math.random().toString(36).substring(2, 20);
            const rand_title = Math.random().toString(36).substring(2, 20);
            const article = {article_id: test_id, 
                             keywords: rand_key,
                             title: rand_title,
                             text: rand_text}
                             
            db_article.updateArticle(article,"articles",  function(err,res){
                expect(err).to.be.null;
                db_article.findArticle(test_id,"articles",  function(err2, res2){
                    expect(err2).to.be.null;
                    expect(res2.keywords).to.equal(rand_key);
                    expect(res2.title).to.equal(rand_title);
                    expect(res2.text).to.equal(rand_text);
                    done();
                });
            });

        }).timeout(1000);
    });
    describe('.sqlAddArticleFormat', function() {
        it("Should get right formatted string", function(done){
            article = {title: 'test article',
                       author: 'test author',
                       keywords: 'test test',
                       text: 'Article text body'};
            const formatted = db_article.sqlAddArticleFormat(article, "articles");
            expect(formatted).to.be.a('string');
            expect(formatted).to.equal("INSERT INTO articles (title, author, keywords, text, created_on) VALUES('test article','test author','test test','Article text body', CURRENT_TIMESTAMP);");
            done();
        }).timeout(1000);
    });
    describe('.removeArticle()', function() {
        it('Should remove article: '+test_id, function(done) {
            db_article.removeArticle(test_id, "articles", function(err, res) {
                expect(err).to.be.null;
                db_article.findArticle(test_id, "articles", function(err2, res2){
                    expect(res2).to.be.null;
                    expect(err2).to.not.be.null;
                    done();
                })
            })
        }).timeout(1000);
    });
})
