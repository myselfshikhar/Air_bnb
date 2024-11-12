const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync =  require("../utils/wrapAsync.js")
const ExpressError =  require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/reviews.js");


  
  



// reviews
//post review route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// Post review route with added error handling
// router.post("/", validateReview, wrapAsync(async (req, res) => {
//   const listing = await Listing.findById(req.params.id);

//   if (!listing) {
//       throw new ExpressError(404, "Listing not found"); // Handle the case where the listing is not found
//   }

//   const newReview = new Review(req.body.review);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// }));



    
    //delete review route
    router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

    module.exports = router;