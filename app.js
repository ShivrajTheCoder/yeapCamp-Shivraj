if(process.env.NODE_ENV!== "production"){
    require("dotenv").config();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');



const Campground=require("./models/campground");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const catchAsync=require("./utils/catchAsync");
const ExpressError=require("./utils/ExpressError");
// const Joi=require("joi");
const {campgroundSchema, reviewSchema}=require("./schemas");
const Review=require("./models/review");


const usersRoutes=require("./routes/users");
const campgroundsRoutes=require("./routes/campgrounds");
const reviewsRoutes=require("./routes/reviews");

main().then(() => {
    console.log("Connected!!");
}).catch(err => {
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true});
}


//middlewares
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.engine('ejs',ejsMate);


const sessionConfig={
    secret:"thisisthesecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        name:"session",//no using the default name i.e session_id
        httpOnly:true,// for security must read more on this
        // secure:true, will only work on https local host is not secure
        expires: Date.now()+1000*60*60*24*7, // setting expiry date of one week
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));// it should be used before passport.session
//serving static files

app.use(express.static(path.join(__dirname,"public")));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(mongoSanitize({
    replaceWith: '_'
}))


app.use((req,res,next)=>{
    // the details of user is stored in req object as req.user
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


app.use("/",usersRoutes);
app.use("/campgrounds",campgroundsRoutes);

// note by default we won't get access to id in the routes
// you need to metion mergreParams inside of the router on the top
app.use("/campgrounds/:id/reviews",reviewsRoutes);



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))



//get routes
app.get("/",(req,res)=>{
    // res.send("Hello form yelp camp");
    res.render("home");
})


//this will run for every single request
//note the order here matters it will run only when nothin matching the request 
// is found else the respective code will run as normal

app.all("*",(req,res,next)=>{
    //first method
    // res.send("404!!!");
    //better method
    next(new ExpressError("Page not found",404));
})


app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message("Something went horibbly wrong!");
    res.status(statusCode).render("./error",{err});
    // res.send("Something went horibbly wrong!!");
})

app.listen(3000,()=>{
    console.log("listening");
})