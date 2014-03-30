
/**
 * Module dependencies.
 */

var express = require('express')
  , request = require('request')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var apicache = require('apicache').options({ debug: true }).middleware;

var app = express();

var proxyurl = 'http://data.nbcnews.com/drone/api/query/nbcnews/webapp/1.0/';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api', function(req, res) {
    console.log('test');
  url = proxyurl + req.url;
  req.pipe(request(url)).pipe(res);
});
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
