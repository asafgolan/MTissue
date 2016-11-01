var productController = function(Product) {

  var post = function(req, res) {
    var product = new Product(req.body);
    if (!req.body.title) {
      res.status(400);
      res.send('title is required');
    } else {
      product.save();
      res.status(201);
      res.send(product);
    }
  }
  var get = function(req, res) {
    var query = {};
    if (req.query.title) {
      query.title = req.query.title;
    }

    Product.find(function(err, products) {
      if (err)
        res.status(500).send(err);
      else
        res.json(products);
    });
  }

  return {
    post: post,
    get: get
  }
}

module.exports = productController;
