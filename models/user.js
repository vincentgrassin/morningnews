var mongoose = require ('./bdd') // on recupere ce qui est exporté par bdd


  var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email:String,
    salt:String, // nécessaire pour cryptage avec crypt js (pas avec bcrypt)
    token:String,
});



var userModel = mongoose.model('users', userSchema);


module.exports = userModel;