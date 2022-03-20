const Campground=require("../models/campground");
const Review=require("../models/review");
const exp=module.exports;

exp.createReview=async(req,res)=>{
    // res.send("You made it!!!");
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
};

exp.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // res.send("Delete me!!");
    req.flash("success","review deleted!");
    res.redirect(`/campgrounds/${id}`);
}