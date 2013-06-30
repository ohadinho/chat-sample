var logger;

module.exports = function(app, loggerInstance) {
  logger = loggerInstance;
  app.get('/', index);
  app.get('/chat',chat);
};

var index = function(req, res){
    logger.info('GET on /\n');
    res.render('index', { title: 'Express' });    
};



var chat = function(req, res){ 
    logger.info('GET on /chat\n');
    res.render('chat');
};