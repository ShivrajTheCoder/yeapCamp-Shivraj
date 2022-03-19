const mongoose=require("mongoose");
const Review=require("./review");
const User = require("./user");
//defining mongoose.Schema in a variable as it is very frequently used
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    image:String,
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