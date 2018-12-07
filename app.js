var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var app=express();
mongoose.connect("mongodb://localhost/blogdb");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
var blogSchema=new mongoose.Schema({
   title:String,
   img:String,
   body:String,
   createdtime:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//INDEX ROUTES
app.get("/blog",function(req,res){
   Blog.find({},function(err,posts){
     if(err)
         console.log("Error in /blog");
     else
        res.render("index",{posts:posts});
   });
});
app.get("/",function(req,res){
   res.redirect("/blog"); 
});
//NEW BLOG ROUTE
app.get("/blog/new",function(req, res) {
   res.render("new"); 
});

//POST BLOG ROUTE
app.post("/blog",function(req,res){
    Blog.create(req.body.post,function(err,newpost){
       if(err)
        console.log("Error in post new blogpost");
       else
        res.redirect("/blog"); 
    });
});

//SHOW BLOG ROUTE
app.get("/blog/:id",function(req,res){
   Blog.findById(req.params.id,function(err,newpost){
      if(err)
      console.log("error in show");
      else
      res.render("show",{post:newpost});
   }); 
});

//EDIT BLOG
app.get("/blog/:id/edit",function(req, res) {
   Blog.findById(req.params.id,function(err,editpost){
      if(err)
      console.log("Error in edit");
      else
      {
          res.render("edit",{post:editpost});
      }
   }); 
});

//UPDATE BLOG
app.put("/blog/:id",function(req,res){
   Blog.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatedpost) {
      if(err)
      console.log("Error in update");
      else
      res.redirect("/blog/"+req.params.id);
   }); 
});

//DELETE POST
app.delete("/blog/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err)
       console.log("Error in delete");
       else
       res.redirect("/blog")
   }); 
});
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Blog app started..!");
});