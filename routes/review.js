const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync =  require("../utils/wrapAsync.js")
const ExpressError =  require("../utils/ExpressError.js");
const {reviewSchema}= require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



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
  
  



// reviews
//post review route
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review Created");

    res.redirect(`/listings/${listing._id}`);
    
    }));

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
    router.delete("/:reviewId", wrapAsync(async(req,res)=>{
      let{id,reviewId}=req.params;
      await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash("success"," review deleted");

      res.redirect(`/listings/${id}`);
    }));

    module.exports = router;