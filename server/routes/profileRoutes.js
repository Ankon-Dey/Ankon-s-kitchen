// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/profile', ensureAuthenticated, profileController.getProfile);
// GET: Edit Profile
router.get('/profile/edit', ensureAuthenticated, (req, res) => {
  res.render('profile-edit', {
    user: req.user,
    title: 'Edit Profile'
  });
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/profiles'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Update profile
router.post('/profile/edit', upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.bio = req.body.bio || user.bio;

    if (req.file) {
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});

module.exports = router;