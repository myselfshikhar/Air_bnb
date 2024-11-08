const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // EJS-mate layout engine for working with EJS templates
// const wrapAsync =  require("./utils/wrapAsync.js")
const ExpressError =  require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}= require("./schema.js");
// const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



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





app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews)






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