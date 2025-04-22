const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


router
  .route("/")
  .get( wrapAsync( listingController.index ))  // INDEX ROUT
  .post(        // CREATE ROUT
    isLoggedIn,
    upload.single('image'),
     wrapAsync( listingController.createListing)
    );
 


    
 // NEW ROUT
router.get("/new", isLoggedIn , listingController.newForm);   


router
  .route("/:id")
  // UPDATE ROUT
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    wrapAsync(listingController.updateListing)
)
   // DELETE ROUT
   .delete(
     isLoggedIn,
     isOwner,
      wrapAsync( listingController.deleteListing)
    )
   // SHOW ROUT
   .get(wrapAsync(listingController.showListing)
);


// EDIT ROUT
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.editForm)
    );

module.exports = router;