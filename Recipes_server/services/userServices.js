const User = require("../models/User")
const bcrypt = require("bcryptjs")
const tokenServices = require("./tokenServices")
const UserDto = require("../dtos/userDto")
const ApiError = require("../exceptions/apiError")

class userServices {

  async registration(nickname, password) {
    const candidate = await User.findOne({nickname})
    if (candidate) {
      throw ApiError.BadRequest(`Candidate with nickname ${nickname} already exists`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await User.create({nickname, password: hashPassword})
    const userDto = new UserDto(user)
    const tokens = tokenServices.generateTokens({...userDto})
    await tokenServices.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens, loginUser: userDto
    }
  }

  async login(nickname, password) {
    const user = await User.findOne({nickname})
    if (!user) {
      throw ApiError.BadRequest(`Candidate with nickname ${nickname} doesn't exist`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password is incorrect')
    }
    const userDto = new UserDto(user);
    const tokens = await tokenServices.generateTokens({...userDto})
    await tokenServices.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens, loginUser: userDto
    }
  }

  async logout(refreshToken) {
    const token = await tokenServices.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenServices.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenServices.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await User.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenServices.generateTokens({...userDto})
    await tokenServices.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens, loginUser: userDto
    }
  }

  async changePassword(nickname, password, newPassword) {
    const user = await User.findOne({nickname})
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password is incorrect')
    }
    const hashPassword = await bcrypt.hash(newPassword, 3)
    const userUpdated = await User.findOneAndUpdate({nickname}, {password: hashPassword}, {returnDocument: 'after'})
    const userDto = new UserDto(userUpdated)
    const tokens = tokenServices.generateTokens({...userDto})
    await tokenServices.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens, loginUser: userDto
    }
  }


  async getAllUsers() {
    const users = await User.find()
    const upd_users = users.map(user => ({_id: user._id, nickname: user.nickname}));
    return upd_users
  }


  async getUserById(userId) {
    const user = await User.findOne({_id: userId}).populate({path: 'recipes', populate: {path: 'tags'}}).populate({
      path: 'favouriteRecipes',
      populate: {path: 'tags'}
    })
    return {_id: user._id, nickname: user.nickname, recipes: user.recipes, favourite: user.favouriteRecipes}
  }

  //fixme very bad
  //rename or remove entirely
  async getOneUserBasicInfo(userId) {
    const user = await User.findOne({_id: userId})
    return user;
  }

  async deleteRecipe(deletedRecipe) {
    const user = await User.findOneAndUpdate({_id: deletedRecipe.userId}, {$pull: {recipes: deletedRecipe._id}}, {new: true})
    return user;
  }

  async addRecipeToUser(userId, recipeId) {
    // console.log(recipeId)
    const user = await User.findOneAndUpdate({_id: userId}, {"$push": {recipes: recipeId}}, {new: true})
    // console.log(user)
    return user
  }

  async addFavouriteRecipe(userId, recipeId) {
    const user = await User.findOneAndUpdate({_id: userId}, {"$addToSet": {favouriteRecipes: recipeId}}, {new: true})
    return user
  }

  async removeFavouriteRecipe(userId, recipeId) {
    const user = await User.findOneAndUpdate({_id: userId}, {"$pull": {favouriteRecipes: recipeId}}, {new: true})
    return user
  }


}

module.exports = new userServices();
