var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', async function(req, res, next) {
  let result = false;
  let message= "";
  let userAlreadyExist = await userModel.findOne( {$or:[{username:req.body.username},{email: req.body.email}]} ) 
  if(userAlreadyExist==null) {

    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
   
      var newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      }
    )
    var userSaved = await newUser.save();

  })
    result = true;
    message = "inscription réussie"


  }
  else {
    message = 'username ou mot de passe déjà pris'
  }
  res.send({result,message});
});



router.post('/sign-in', async function(req, res, next) {
  var result = false;
  var message= "";

  var checkUser = await userModel.findOne(
    { email: req.body.email,
      // password: req.body.password,
     }
 )
 console.log("checkuser",checkUser);
  
     if(checkUser !== null) {

      await bcrypt.compare(req.body.password, checkUser.password, function(err, test) {

        if (test == true) {
          result = true
          message = "connexion réussie"
          res.send({result,message});

        } else {
          result = false;
          message = "mot de passe incorrect";
          res.send({result,message});

      }});

      } 
     else {
       result = false;
       message = "nom d'utilisateur non reconnu"
       res.send({result,message});
     }

});


module.exports = router;
