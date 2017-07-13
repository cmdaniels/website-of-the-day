var express = require('express');
var app = express();
var Pageres = require('pageres');
var fs = require('fs');
var reddit = require('redditor');
var filenamifyUrl = require('filenamify-url');
var wotd;

// Init Website of the Day
reddit.get('/r/InternetIsBeautiful/new.json', function(err, resp) {
  if(err) {
    throw err;
  } else {
    // Newest post
    var post = resp.data.children[0].data;
    wotd = {
      url: post.url,
      slug: filenamifyUrl(post.url),
      date: new Date()
    };
    var pageres = new Pageres({
      filename: 'thumbnail',
      delay: 2
    }).src(wotd.slug, ['1920x1080'])
      .dest(__dirname + '/public/')
      .run()
      .then(function() {
        console.log('Initialized wotd');
      });
  }
});

function newWotd(res) {
  reddit.get('/r/InternetIsBeautiful/new.json', function(err, resp) {
    if(err) {
      throw err;
    } else {
      console.log('received reddit data');
      var post = resp.data.children[0].data;
      wotd = {
        url: post.url,
        slug: filenamifyUrl(post.url),
        date: new Date()
      };
      console.log('new wotd: ', wotd);
      var pageres = new Pageres({
        filename: 'thumbnail',
        delay: 2
      }).src(wotd.slug, ['1920x1080'])
        .dest(__dirname + '/public/')
        .run()
        .then(function() {
          console.log('took screenshot, sending new wotd');
          res.send(wotd);
        });
    }
  });
}

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/wotd', function(req, res) {
  console.log('/wotd called');
  console.log('wotd date: ' + wotd.date.toDateString());
  console.log('today\'s date: ' + new Date().toDateString());
  if(wotd.date.toDateString() === new Date().toDateString()) {
    console.log('wotd is up to date, sending wotd');
    res.send(wotd);
  } else {
    console.log('wotd is not up to date, calling newWotd()');
    newWotd(res);
  }
});

app.listen(process.env.PORT || 3000, function(){
  console.log('WOTD is listening on port ' + (process.env.PORT || 3000) + '!');
});
