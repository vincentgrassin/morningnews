var mongoose = require ('./bdd') // on recupere ce qui est exporté par bdd


  var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email:String,

});



var userModel = mongoose.model('users', userSchema);


module.exports = userModel;