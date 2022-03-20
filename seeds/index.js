const mongoose=require("mongoose");
const Campground=require("../models/campground");
const cities=require("./cities");
const {descriptors,places}=require("./seedHelpers");

main().then(() => {
    console.log("Connected!!");
}).catch(err => {
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });
}


const sample=array=>array[Math.floor(Math.random()* array.length)];

const seedDb=async ()=>{
    await Campground.deleteMany({});
    // const c=new Campground({title:"laal pul"});
    // await c.save();
    // console.log(c);

    //adding 50 cities to the database for usage in the app

    for(let i=0;i<200;i++)
    {
        const random1000=Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*500)
        const newCamp=new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            author:"6234c7ed340ef47d8638d3cc",
            location:`${cities[random1000].city},${cities[random1000].state}`,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ipsum voluptas, soluta esse doloribus architecto delectus, ex nesciunt commodi nihil cumque tenetur at quasi natus vel, fugiat ipsa accusamus earum.",
            price,
            geometry : { 
                "type" : "Point",
                 "coordinates" : [ 
                     cities[random1000].longitude,
                     cities[random1000].latitude
                  ] 
                },
            images: [
                {
                  url: 'https://res.cloudinary.com/dzd53baqf/image/upload/v1647760433/YelpCamp/izfgaqtzid04kix4swkv.png',
                  filename: 'YelpCamp/izfgaqtzid04kix4swkv',
                },
                {
                  url: 'https://res.cloudinary.com/dzd53baqf/image/upload/v1647760434/YelpCamp/atqmx7qszjihiyy9oj99.jpg',
                  filename: 'YelpCamp/atqmx7qszjihiyy9oj99',
                }
              ]
        })
        await newCamp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})