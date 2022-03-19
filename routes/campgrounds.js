const express=require("express");
const router=express.Router({mergeParams:true});
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const Campground=require("../models/campground");
const Review=require("../models/review");
const {campgroundSchema, reviewSchema}=require("../schemas");
const {isLoggedIn}=require("../middleware");

const validateCampground=(req,res,next)=>{
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




router.get("/",catchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/index",{campgrounds});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./campgrounds/new");
})

router.get("/:id",catchAsync(async (req,res)=>{
    // const {id}=req.params;
    // console.log(id);
    const campground=await (await Campground.findById(req.params.id).populate("reviews")).populate("author");
    // console.log(campground);
    // res.render("./campgrounds/show",{campground,msg:req.flash("success")});  //one way of displaying flash messages
    if(!campground)
    {
        res.flash("error","Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show",{campground});
}));


router.get("/:id/edit",isLoggedIn,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground)
    {
        res.flash("error","Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit",{campground});
    // res.send(campground);
}));


//post routes
router.post("/",isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{

    


    // res.send(req.body);

    //basic valid check
    // if(!req.body.campground) throw new ExpressError("Invalid capmground data",400)
    
    //now using joi
    // const campgroundSchema=Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().required().min(0),
    //         image:Joi.string().required(),
    //         location:Joi.string().required(),
    //         description:Joi.string().required()
    //     }).required()
    // })
    
    // const {error}=campgroundSchema.validate(req.body);
    // // console.log(result);

    // if(error){
    //     const msg=error.details.map(el=>el.message).join(",");
    //     throw new ExpressError(msg,400);
    // }


    //later we decided to put the above function in a function for reusability


    const campground=new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    req.flash("success","sucessfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));


//put routes
router.put("/:id",isLoggedIn,validateCampground,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.flash("success","successfully updated camground!");
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("You just sent a put request")
}));

// delete route



router.delete("/:id",catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));


module.exports=router;
