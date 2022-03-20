const express=require("express");
const router=express.Router({mergeParams:true});
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const Campground=require("../models/campground");
const Review=require("../models/review");
const campgrounds=require("../controllers/campgrounds");

const {storage}=require("../cloudinary/index");

const multer  = require('multer')
const upload = multer({ storage })

const {isLoggedIn,validateCampground,isAuthor}=require("../middleware");

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campgrounds.createCampgrounds));
    



router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn,
        isAuthor,
        upload.array("image"),
        validateCampground,
        catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,
        catchAsync(campgrounds.deleteCampgrounds));


router.get("/:id/edit",isLoggedIn,isAuthor,
    catchAsync(campgrounds.renderEditForm));

module.exports=router;

