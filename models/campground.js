const mongoose=require("mongoose");
const Review=require("./review");
const User = require("./user");
//defining mongoose.Schema in a variable as it is very frequently used
const Schema=mongoose.Schema;

const ImageSchema=new Schema({
    url:String,
    filename:String
})

const opts={toJSON:{virtuals:true}};

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
})

const campgroundSchema=new Schema({
    title:String,
    images:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            requierd:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
},opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

campgroundSchema.post("findOneAndDelete",async function(doc){
    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})


module.exports= mongoose.model("Campground",campgroundSchema);