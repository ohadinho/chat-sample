module.exports = function(app) {
  app.get('/', index);
  app.get('/chat',chat);
};

var index = function(req, res){
    res.render('index', { title: 'Express' });    
};



var chat = function(req, res){
    res.render('chat');
	res.render('chat', { sessionId: req.session.id});
};