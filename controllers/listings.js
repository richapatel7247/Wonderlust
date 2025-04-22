
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find( {} );
    res.render("./listings/index.ejs", {allListings});
};

module.exports.newForm = (req, res) => {
   
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let {title, description, price, country, location} = req.body;
    await Listing.insertOne({title :title, description : description, image : {url, filename}, price : price, country : country, location : location, owner : req.user._id});
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");  
};

module.exports.showListing =  async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ 
        path : "review",
        populate : {
            path : "author"},
    }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

module.exports.editForm =  async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("./listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing =  async (req, res) => {
    let { id } = req.params;
    
    let { title, description, price, country, location } = req.body;
   
    await Listing.findByIdAndUpdate(id, {
        title :title, description : description, price : price, country : country, location : location
    },

    { runValidators : true, new : true });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        await Listing.findByIdAndUpdate(id, {
           image : {url, filename}
        },
        { runValidators : true, new : true });
    }

    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
};