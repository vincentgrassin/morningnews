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
      var newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }
    )
    var userSaved = await newUser.save();
    result = true;
    message = "inscription réussie"

    }
  else {
    message = 'user ou mot de passe déjà pris'
  }
  res.send({result,message});
});



router.post('/sign-in', async function(req, res, next) {
  let result = false;
  console.log("body",req.body)
  var checkUser = await userModel.findOne(
    { email: req.body.email,
      password: req.body.password,
     }
 )
     console.log("checkbefore",checkUser)
     if(checkUser !== null) {
       result = true
       message = "connexion réussie"

      } 
     else {
       result = false;
       message = "mot de passe ou non d'utilisateur non reconnus"
     }
  console.log("checkUser",checkUser)
  res.send({result,message});
});


module.exports = router;
