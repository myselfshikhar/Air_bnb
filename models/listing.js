const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      set: function(v) {
        // If the image is an object and has a URL, return the URL
        if (typeof v === 'object' && v !== null && v.url) {
          return v.url;
        }
        // If the image is an empty string or falsy, use the default
        return v === "" || !v
          ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v;
      },
    },


    // image: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) => {
    //     // Trim extra spaces and return the default image if empty
    //     const trimmed = typeof v === "string" ? v.trim() : v;
    //     return !trimmed || trimmed === "" ? 
    //       "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
    //       : trimmed;
    //   },
    // },


    // image: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) => {
    //     // If v is an object and contains a URL, return the URL; otherwise return v as is (string)
    //     return typeof v === "object" && v !== null && v.url ? v.url : v;
    //   },
    // },



    // image: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) => {
    //     // If v is an object and contains a URL, return the URL, otherwise return v as it is
    //     return typeof v === "object" && v !== null && v.url ? v.url : v;
    //   },
    // },


    // image:{
    //   url:String,
    //   filename:String,
    // },
    


    // image: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) =>
    //     v === ""
    //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //       : v,
    // },




    // image: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //   set: (v) => {
    //     return typeof v === "object" && v !== null && v.url ? v.url : v;
    //   },
    // },
    price: Number,
    location: String,
    country: String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing) {
    await Review.deleteMany({_id : {$in:listing.reviews}})  
  }
});

  const Listing = mongoose.model("Listing", listingSchema);
  module.exports = Listing;