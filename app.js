const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // EJS-mate layout engine for working with EJS templates
const wrapAsync =  require("./utils/wrapAsync.js")
const ExpressError =  require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");




const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // Use ejs-mate to manage layouts in EJS templates
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files (e.g., CSS, JavaScript) from the `public/` directory




app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing =(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let error_msg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error_msg);
  }
  else{
    next();
  }
};

const validateReview =(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let error_msg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error_msg);
  }
  else{
    next();
  }
};


//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

// //Create Route
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400,"send valid data for listing")
  // }

    const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");

}));

// //Edit Route
app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// //Update Route
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
  // if(!req.body.allListings){
  //   throw new ExpressError(400,"send valid data for listing")
  // }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// //Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));


// reviews
//post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);

}));


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


// app.use((err,req,res)=>{
//   res.send("something went wrong");
// }
// );

app.all("*", (req, res, next) => {
  // Log to confirm this is hit
  next(new ExpressError(404, "Page Not Found"));
});

// app.use((err, req, res, next) => {
//   // console.error("Error occurred:", err); // Log the error
//   let { statusCode=500 , message="error"  } = err;
//   // res.status (statusCode).render("error.ejs",{message});
//   // res.status(statusCode).send(message);
//   // res.render(error.ejs);
//   res.status (statusCode).render("error.ejs",{message});
// });

app.use((err, req, res, next) => {
  // console.error("Error occurred:", err); // Log the error
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status (statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
  res.render("error.ejs",{err});
});



app.listen(3000, () => {
  console.log("server is listening to port 3000");
});