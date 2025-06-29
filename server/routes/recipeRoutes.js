// server/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Add middleware to protect the profile route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('infoErrors', 'Please log in to view your profile');
  res.redirect('/login');
}

// Recipe and static pages
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/contact', recipeController.contact);
router.post('/contact', recipeController.contactOnPost);
router.get('/about', recipeController.about);
router.get('/privacy-policy', recipeController.privacyPolicy);
router.get('/terms-of-use', recipeController.termsOfUse);
router.get('/login', recipeController.login);
router.post('/login', recipeController.loginOnPost);
router.get('/register', recipeController.register);
router.post('/register', recipeController.registerOnPost);
router.get('/logout', recipeController.logout);
router.get('/profile', ensureAuthenticated, recipeController.profile);
router.get('/download/:id', ensureAuthenticated, recipeController.downloadRecipe);

module.exports = router;
