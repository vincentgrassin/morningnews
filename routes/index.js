var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var articleModel = require ('../models/article');

//Bcrypt config
  // const bcrypt = require('bcrypt');
  // const saltRounds = 10;
// Crypto js 
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");
var uid2 = require("uid2");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', async function(req, res, next) {
  let result = false;
  let message= "";
  let tokenUser;
  let userAlreadyExist = await userModel.findOne( {$or:[{username:req.body.username},{email: req.body.email}]} ) 
  if(userAlreadyExist==null) {

  // HASH MOT DE PASSSE AVEC CRYPT JS
    var salt = uid2(32);
    var newUser = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: SHA256(req.body.password + salt).toString(encBase64),
      salt:salt,
      token:uid2(32)
    }
  )
  var userSaved = await newUser.save();

  // HASH MOT DE PASSSE AVEC BCRYPT
    // bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    //   var newUser = new userModel({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: req.body.password,
    //   }
    // )
    // var userSaved = await newUser.save();
  // })
    result = true;
    message = "inscription réussie"
    tokenUser = userSaved.token

  }
  else {
    message = 'username ou mot de passe déjà pris'
  }
  res.send({result,message,tokenUser});
});



router.post('/sign-in', async function(req, res, next) {
  var result = false;
  var message= "";
  var tokenUser ="";
  var checkUser = await userModel.findOne(
    { email: req.body.email,
     }
 )
 console.log("checkuser",checkUser);
  
     if(checkUser !== null) {
  // COMPARE MOT DE PASSSE AVEC CRYPT JS
      var hash = SHA256(req.body.password + checkUser.salt).toString(encBase64);
      if(hash == checkUser.password)
        {
          result = true
          message = "connexion réussie";
          tokenUser = checkUser.token
        }
      else { 
          result = false;
          message = "mot de passe incorrect";
      }

// COMPARE MOT DE PASSSE AVEC BCRYPT
      // await bcrypt.compare(req.body.password, checkUser.password, function(err, test) {

      //   if (test == true) {
      //     result = true
      //     message = "connexion réussie"
      //     res.send({result,message});

      //   } else {
      //     result = false;
      //     message = "mot de passe incorrect";
      //     res.send({result,message});

      // }});

      } 
     else {
       result = false;
       message = "nom d'utilisateur non reconnu"
     }
     console.log(tokenUser)
     res.send({result,message,tokenUser});

});

// Route pour récupérer le POST des différents article ajouté
router.post('/add-article', async function(req,res,next){

    var userAddArticle = await userModel.findOne({token:req.body.token}).populate('articles').exec();
    
    var isInWishListDb = false;
    for(let i =0;i<userAddArticle.articles.length;i++) {
        if(req.body.title == userAddArticle.articles[i].title) {
          isInWishListDb = true;
         }
      }
    if(isInWishListDb==false) {
    var newArticle = new articleModel({
      title: req.body.title,
      description: req.body.description,
      img: req.body.img,
      url: req.body.url   
  })

    var articleSaved = await newArticle.save();
    var array = userAddArticle.articles;
    array.push(articleSaved._id);
    await userModel.updateOne({_id:userAddArticle._id},{articles:array})

  
}
  res.json({userAddArticle})
});


router.post('/wishlist-article', async function(req, res, next) {
  var userConnected = await userModel.findOne({token:req.body.token}).populate('articles').exec();

  res.json({articles:userConnected.articles});
});



module.exports = router;
