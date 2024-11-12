const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");
const multer =require('multer');
const upload = multer ({storage});
//Index Route
  // //Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing)
);
// validateListing


  //New Route
  router.get("/new", isLoggedIn,listingController.renderNewForm);
  
  
router.route("/:id")
.get(wrapAsync(listingController.showListing) )
.put( isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);
// validateListing

  

  //Show Route
  // router.get("/:id", wrapAsync(listingController.showListing) );
  
  // //Create Route
  // router.post("/",validateListing, isLoggedIn,wrapAsync(listingController.createListing));
  
  // //Edit Route
  router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
  
  // //Update Route
  // router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
  
  // //Delete Route
  // router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
  
  module.exports = router;