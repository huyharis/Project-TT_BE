const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const json = require("./data/blog.json");

const blogSchema = new Schema({
    title   : String,
    content : String,
    author : String,
    imageURL: String
});

const Blog =  mongoose.model('blog', blogSchema);
// Blog.insertMany(json, function(err){
//     if(err) console.log(err);
// })
module.exports = Blog;