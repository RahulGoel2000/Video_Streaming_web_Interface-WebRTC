const authorize = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    p=req.url;
    return res.redirect("/login"+p);
  };
  
  const notAuthorize = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/");
  };
  
  module.exports = { authorize, notAuthorize };
  