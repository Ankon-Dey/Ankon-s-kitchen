require('../models/database');

const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');


/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    res.render('index', { title: "Ankon's Kitchen - Home", categories, food } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: "Ankon's Kitchen - Categories", categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: "Ankon's Kitchen - Categoreis", categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: "Ankon's Kitchen - Recipe", recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: "Ankon's Kitchen - Search", recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: "Ankon's Kitchen - Explore Latest", recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: "Ankon's Kitchen - Explore Latest", recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: "Ankon's Kitchen - Submit Recipe", infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}

/**
 * GET /contact
 * Contact Page
*/
exports.contact = (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('contact', { title: "Ankon's Kitchen - Contact", infoErrorsObj, infoSubmitObj } );
}
exports.contactOnPost = (req, res) => {
  try {
    let contactFormData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    }
    // Here you can add code to send email using nodemailer or any other service
    console.log(contactFormData);
    req.flash('infoSubmit', 'Your message has been sent.');
    res.redirect('/contact');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/contact');
  }
}
/**
 * GET /about
 * About Page
*/
exports.about = (req, res) => {
  res.render('about', { title: "Ankon's Kitchen - About" } );
}
/**
 * GET /privacy-policy
 * Privacy Policy Page
*/
exports.privacyPolicy = (req, res) => {
  res.render('privacy-policy', { title: "Ankon's Kitchen - Privacy Policy" } );
}
/**
 * GET /terms-of-use
 * Terms of Use Page
*/
exports.termsOfUse = (req, res) => {
  res.render('terms-of-use', { title: "Ankon's Kitchen - Terms of Use" } );
}


/** GET /login - Show Login Page */
exports.login = (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  res.render('login', { title: "Ankon's Kitchen - Login", infoErrorsObj });
};

/** POST /login - Handle Login */
exports.loginOnPost = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

/** GET /register - Show Register Page */
exports.register = (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  res.render('register', { title: "Ankon's Kitchen - Register", infoErrorsObj });
};

/** POST /register - Handle Registration */
exports.registerOnPost = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash('infoErrors', 'Email already registered');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();
    req.flash('infoSubmit', 'You have registered successfully. Please login.');
    res.redirect('/login');

  } catch (error) {
    console.error(error);
    req.flash('infoErrors', 'Registration failed. Try again.');
    res.redirect('/register');
  }
};

/** GET /logout - Handle Logout */
exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      req.flash('infoErrors', 'Logout failed.');
      return res.redirect('/');
    }
    req.flash('infoSubmit', 'You have been logged out successfully.');
    res.redirect('/login');
  });
};

// Delete Recipe
async function deleteRecipe(){
  try {
    await Recipe.deleteOne({ name: 'New Recipe From Form' });
  } catch (error) {
    console.log(error);
  }
}
deleteRecipe();

// Profile Page
exports.profile = async (req, res) => {
  try {
    const recipes = await Recipe.find({ email: req.user.email });

    res.render('profile', {
      title: `${req.user.name}'s Profile`,
      user: req.user,
      recipes
    });
  } catch (err) {
    req.flash('infoErrors', 'Error loading profile');
    res.redirect('/');
  }
};
// Download Recipe
exports.downloadRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe.email !== req.user.email) {
      req.flash('infoErrors', 'Unauthorized');
      return res.redirect('/profile');
    }

    const content = `
Recipe Name: ${recipe.name}
Description: ${recipe.description}
Ingredients: ${recipe.ingredients.join(', ')}
Category: ${recipe.category}
`;

    const filePath = path.join(__dirname, '../../public/downloads', `${recipe.name}.txt`);
    fs.writeFileSync(filePath, content);

    res.download(filePath, `${recipe.name}.txt`, err => {
      if (err) {
        console.error(err);
        req.flash('infoErrors', 'Download failed');
        res.redirect('/profile');
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('infoErrors', 'Recipe not found');
    res.redirect('/profile');
  }
};

//Update Recipe
async function updateRecipe(){
  try {
    const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
    res.n; // Number of documents matched
    res.nModified; // Number of documents modified
  } catch (error) {
    console.log(error);
  }
}
updateRecipe();
