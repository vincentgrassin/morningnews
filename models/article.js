// Création d'un model article qui regroupe toutes les infos d'un articles //


var mongoose = require('mongoose')

var articlesSchema = mongoose.Schema({
    title: String,
    description: String,
    img: String,
    url: String,
    language: String
})

module.exports = mongoose.model('articles', articlesSchema)