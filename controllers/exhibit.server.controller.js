var exhibitController = function(Exhibit){
 var post = function(req,res){
   var exhibit = new Exhibit(req.body);
   if(!req.body.title){
     res.status(400);
     res.send('title is required');
   }
   else{
     exhibit.save();
     res.status(201);
     res.send(exhibit);
   }
 }

 var get = function(req,res){
     var query = {};
     if(req.query.title){
       query.title = req.query.title;
     }

     Exhibit.find(query,function(err,exhibits){
       if (err)
       res.status(500).send(err);
       else
         res.json(exhibits);
     });
   }

   return {
     post: post,
     get: get
   }
}

module.exports = exhibitController;
