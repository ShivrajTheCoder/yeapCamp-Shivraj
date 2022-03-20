const {campgroundSchema, reviewSchema}=require("./schemas");
const ExpressError=require("./utils/ExpressError");
const Campground=require("./models/campground");
const Review=require("./models/review");


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


module.exports.validateCampground=(req,res,next)=>{
    // const campgroundSchema=Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().required().min(0),
    //         image:Joi.string().required(),
    //         location:Joi.string().required(),
    //         description:Joi.string().required()
    //     }).required()
    // })
    //this code has been now put inside schemas.js

    
    const {error}=campgroundSchema.validate(req.body);
    // console.log(result);

    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;

    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user.id))
    {
        // console.log(campground.author,req.user.id);
        req.flash("error","You can't edit this campground!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;

    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user_id))
    {
        req.flash("error","You can't edit this campground!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateReview=(req,res,next)=>{
    console.log(req.body);
    const {error}=reviewSchema.validate(req.body);
    console.log(error);
    // console.log("error is inside me!");
    if(error)
    {
        
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        
        next();
    }
}
