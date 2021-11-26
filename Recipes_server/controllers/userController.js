const User = require("../models/Recipe")
const Token = require("../models/Token")
const userServices = require("../services/userServices")
const recipeServices = require("../services/recipeServices")
const Recipe = require("../models/Recipe");
const {validationResult} = require("express-validator")
const ApiError = require("../exceptions/apiError")


class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()))
      }
      const {nickname, password} = req.body;
      const userData = await userServices.registration(nickname, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const {nickname, password} = req.body;
      const userData = await userServices.login(nickname, password)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userServices.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json(token)
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userServices.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userServices.getAllUsers();
      return res.json(users)
    } catch (e) {
      next(e);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const userId = req.params.userID
      const user = await userServices.getOneUser(userId)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async addFavourite(req, res, next) {
    try {
      const userId = req.user.id;
      const recipeID = req.params.recipeID;

      const user = await userServices.getOneUser(userId);
      const recipe = await recipeServices.getRecipeById(recipeID)
      if (user || recipe) {
        await userServices.addFavouriteRecipe(userId, recipeID)
        await recipeServices.addFavouriteRecipe(userId, recipeID)
      }
//fixme wtf is "OK"?
      return res.json("Ok")
    } catch (e) {
      next(e)
    }
  }


}

module.exports = new UserController()
