var mongoose = require('mongoose'); //on créé la variable mongoose, génère la connexion à la BDD et exporte mongoose


var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
  }
  
  mongoose.connect('mongodb+srv://dbVincent:dbvincent@cluster0-tyh07.mongodb.net/mynews?retryWrites=true&w=majority',
      options,         
      function(err) {
       console.log("hello errors are",err);
      }
  );


module.exports = mongoose;