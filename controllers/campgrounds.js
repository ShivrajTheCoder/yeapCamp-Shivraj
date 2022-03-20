const Campground=require("../models/campground");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;

const geocoder=mbxGeocoding({accessToken:mapBoxToken});

const {cloudinary}=require("../cloudinary");

const exp=module.exports;



exp.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/index",{campgrounds});
};

exp.renderNewForm=(req,res)=>{
    res.render("./campgrounds/new");
};

exp.createCampgrounds=async(req,res,next)=>{

    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    // console.log(geoData.body.features[0].geometry);


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
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({ url:f.path, filename: f.filename}));
    campground.author=req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash("success","sucessfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};



exp.showCampgrounds=async (req,res)=>{
    // const {id}=req.params;
    // console.log(id);
    // const campground=await (await Campground.findById(req.params.id).populate("reviews")).populate("author");
    // now as we also want to populate the reviews so we will use this instead

    const campground=await (await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })).populate("author");

    // console.log(campground);
    // res.render("./campgrounds/show",{campground,msg:req.flash("success")});  //one way of displaying flash messages
    if(!campground)
    {
        req.flash("error","Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show",{campground});
};


exp.updateCampground=async (req,res)=>{
    const {id}=req.params;

    const campground=await Campground.findById(id);
    console.log(campground);
    
    if(!campground.author.equals(req.user.id))
    {
        req.flash("error","You can't edit this campground!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    const imgs=req.files.map(f=>({ url:f.path, filename: f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull:{images:{ filename:{$in: req.body.deleteImages}}}});
    }
    
    await campground.save();
    // console.log(campground);
    // const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash("success","successfully updated camground!");
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("You just sent a put request")
};

exp.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground)
    {
        req.flash("error","Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    // const campground=await Campground.findById(id);
    res.render("./campgrounds/edit",{campground});
    // res.send(campground);
}


exp.deleteCampgrounds=async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the campground!");
    res.redirect("/campgrounds");
};