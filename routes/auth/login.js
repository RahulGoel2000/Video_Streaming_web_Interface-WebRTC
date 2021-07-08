const express = require("express");
const route = express.Router();
const { notAuthorize } = require("../../functions/authFunc");
const passport = require("passport");


route.get("/", notAuthorize, (req, res) => {
  res.render("auth/login.ejs", { tabName: "meet" });
  
});
route.post(
  "/",
    
  passport.authenticate("local", {
    successRedirect: "/redirect",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
module.exports = route;
