const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/all', recipeController.getAllRecipes);
router.post('/new-recipe', authMiddleware, recipeController.createRecipe);
router.put('/new-recipe/:recipeId', authMiddleware, recipeController.updateRecipe);
router.get('/recipe/:recipeId', authMiddleware, recipeController.getRecipe);
router.delete('/recipe/:recipeId', authMiddleware, recipeController.deleteRecipe);

router.get('/tags', authMiddleware, recipeController.getAllTags);
router.delete('/tags/:tagId', authMiddleware, recipeController.deleteTag);

router.get('/ingredients', authMiddleware, recipeController.getAllIngredients);
router.delete('/ingredients/:ingredientId', authMiddleware, recipeController.deleteIngredient);

router.post('/recipe/favourite/:recipeId', authMiddleware, userController.changeFavourite);

// should be in userRouter
router.get('/users/all', authMiddleware, userController.getUsers);
router.get('/user/:userId', userController.getOneUser);
router.post('/registration', body('nickname').notEmpty(), body('password').isLength({ min: 3, max: 18 }), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/change-password', authMiddleware, userController.changePassword);
router.get('/refresh', userController.refresh);

module.exports = router;
