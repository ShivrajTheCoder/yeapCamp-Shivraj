const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review");
const {campgroundSchema, reviewSchema}=require("../schemas");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const Campground=require("../models/campground");

const validateReview=(req,res,next)=>{
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



router.post("/",validateReview,catchAsync(async(req,res)=>{
    // res.send("You made it!!!");
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.flash("success","created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete("/:reviewId",catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // res.send("Delete me!!");
    res.flash("success","review deleted!");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
