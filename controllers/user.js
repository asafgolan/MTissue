var userController = function(User){
  post = function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'New User -Admin room!' });
    });
  }

  get = function(req, res) {
    User.find(function(err, users) {
      if (err)
        res.send(err);

      res.json(users);
    });
  };

   return {
     post: post,
     get: get
   }
}

module.exports = userController;
