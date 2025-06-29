// server/middleware/auth.js
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('infoErrors', 'Please login to access this page');
    res.redirect('/login');
  }
};

