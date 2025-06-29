// server/controllers/profileController.js
exports.getProfile = (req, res) => {
  res.render('profile', {
    title: "User Profile",
    user: req.user
  });
};


