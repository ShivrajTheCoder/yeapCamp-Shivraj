const Campground=require("../models/campground");
const Review=require("../models/review");
const User=require("../models/user");
const exp=module.exports;


exp.renderRegister=(req,res)=>{
    res.render("./users/register");
};

exp.register=async(req,res,next)=>{
    // res.send(req.body);
    try{
    const {username, email ,password}=req.body;
    const user=new User({ email ,username});
    const registeredUser=await User.register(user,password);
    // this is to automatically login as soon as the user registers
    req.login(registeredUser,err=>{
        if(err) return next(err)
        req.flash("success","welcome to yelp camp");
        res.redirect("/campgrounds");
    })}catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
    
};

exp.renderLogin=(req,res)=>{
    res.render("./users/login");
};

exp.login=async(req,res)=>{
    // console.log(req.session.returnTo);
    const redirectUrl=req.session.returnTo || "/campgrounds"
    req.flash("success","welcome back!");
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

exp.logout=(req,res)=>{
    req.logout();
    req.flash("success","Good bye!");
    res.redirect("/campgrounds");
};