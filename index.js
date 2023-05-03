//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-bharath:14362348@cluster0.lisc3.mongodb.net/portfolioDB", {useNewUrlParser : true});

const potfolioSchema = {
    name : String,
    email : String,
    phone : Number,
    messsage : String
}

const portfolio = mongoose.model("portfolio", potfolioSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/experience",function(req,res){
  res.render("experience");
});

app.get("/contact",function(req,res){
  res.render("contact");
});


app.post("/contact", function(req,res){
    const data = (
    {
        name : req.body.Name,
        email : req.body.Email,
        phone : req.body.Number,
        messsage : req.body.Message
    }
    )

    portfolio.insertMany(data, function(err){
        if(err){
            console.log("error")
        }
        else{
            console.log("Saved Successfully")
        }
    })

    res.render("contact");

  });

//Blog

const blogSchema = {
  title : String,
  content : String
};

const Post = mongoose.model("Post", blogSchema);


app.get("/blogHome",function(req,res){
  Post.find({},function(err,posts)
  {
    res.render("blogHome",{
      posts : posts
      
    });

  });
  
});  

app.get("/compose",function(req,res){
  res.sendFile(__dirname+ "/views/compose.html");
});

app.post("/compose" ,function(req,res){
  const post = new Post ({
    title : req.body.postTitle,
    content : req.body.postBody
  });

  post.save(function(err)
  {
    if(!err)
    {
      res.redirect("/");
    }
  });

  
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });


let port = process.env.PORT;


app.listen(port || 9999, function() {
  console.log("Server has started successfully");
});
