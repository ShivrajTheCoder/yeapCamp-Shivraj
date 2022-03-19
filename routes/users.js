const express=require("express");
const router=express.Router();
const User=require("../models/user");
const catchAsync=require("../utils/catchAsync");
const passport=require("passport")

router.get("/register",(req,res)=>{
    res.render("./users/register");
})

router.post("/register",catchAsync(async(req,res,next)=>{
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
    
}))

router.get("/login",(req,res)=>{
    res.render("./users/login");
})

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),catchAsync(async(req,res)=>{
    // console.log(req.session.returnTo);
    const redirectUrl=req.session.returnTo || "/campgrounds"
    req.flash("success","welcome back!");
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}))

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Good bye!");
    res.redirect("/campgrounds");
})

module.exports=router;