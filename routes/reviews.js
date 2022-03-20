const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review");
const {campgroundSchema, reviewSchema}=require("../schemas");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const Campground=require("../models/campground");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware");
const reveiws=require("../controllers/reviews");


router.post("/",isLoggedIn,validateReview,catchAsync(reveiws.createReview))


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(reveiws.deleteReview))

module.exports=router;
