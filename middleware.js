module.exports.isLoggedIn=(req,res,next)=>{
    //store the url the user was trying to access and redirect them there instead of 
    // the /campgrounds after they successfully login
    // console.log(req.path,req.originalUrl)


    //we store it in the session by creating a variable
    req.session.returnTo=req.originalUrl;
    // the details of user is stored in req object as req.user
    // console.log("User...",req.user);
    if(!req.isAuthenticated())
    {
        req.flash("error","You need to login first!");
        return res.redirect("/login");
    }
    next();
}