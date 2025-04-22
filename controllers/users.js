const User = require("../models/user.js");

module.exports.signupForm =  (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.postSignup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser =  new User({username, email});
    
        const registeredUser =  await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        })
       
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
};

module.exports.loginForm =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.postLogin = async(req, res) => {
    req.flash( "success","Welcome back to Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logOut( (err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};