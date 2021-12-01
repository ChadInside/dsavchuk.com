const express = require('express');
const router = express.Router();
const recipeController = require("../controllers/recipeController")
const userController = require("../controllers/userController")
const {body} = require("express-validator")
const authMiddleware = require("../middlewares/authMiddleware")


router.get('/all', recipeController.getAllRecipes);
router.post('/new-recipe', authMiddleware, recipeController.createRecipe)
router.put('/new-recipe/:recipeID', authMiddleware, recipeController.updateRecipe)
router.get('/recipe/:recipeID',  authMiddleware, recipeController.getRecipe);
router.delete('/recipe/:recipeID', authMiddleware, recipeController.deleteRecipe);

router.get('/tags', authMiddleware, recipeController.getAllTags)
router.get('/ingredients', authMiddleware, recipeController.getAllIngredients)

router.post('/recipe/favourite/:recipeID',authMiddleware, userController.changeFavourite)

//should be in userRouter
router.get('/users/all', authMiddleware, userController.getUsers)
router.get('/user/:userID', userController.getOneUser)
router.post('/registration', body('nickname').notEmpty(), body('password').isLength({min: 3, max: 18}), userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/change-password', authMiddleware, userController.changePassword)
router.get('/refresh', userController.refresh)

module.exports = router;
