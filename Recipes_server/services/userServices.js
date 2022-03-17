const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokenServices = require('./tokenServices');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/apiError');
const Recipe = require('../models/Recipe');
const utils = require('../utils/utils');

class UserServices {
  async registration(nickname, password) {
    const candidate = await User.findOne({ nickname });
    if (candidate) {
      throw ApiError.BadRequest(`Candidate with nickname ${nickname} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    // fixme hardcoded admin creation
    const roles = [];
    if (nickname === 'admin') roles.push('admin');
    //
    const user = await User.create({ nickname, password: hashPassword, roles });
    const userDto = new UserDto(user);
    const tokens = tokenServices.generateTokens({ ...userDto });
    await tokenServices.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens, loginUser: userDto,
    };
  }

  async login(nickname, password) {
    const user = await User.findOne({ nickname });
    if (!user) {
      throw ApiError.BadRequest(`User with nickname ${nickname} doesn't exist`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password is incorrect');
    }
    const userDto = new UserDto(user);
    const tokens = tokenServices.generateTokens({ ...userDto });
    await tokenServices.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens, loginUser: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenServices.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenServices.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenServices.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenServices.generateTokens({ ...userDto });
    await tokenServices.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens, loginUser: userDto,
    };
  }

  async changePassword(nickname, password, newPassword) {
    const user = await User.findOne({ nickname });
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password is incorrect');
    }
    const hashPassword = await bcrypt.hash(newPassword, 3);
    const userUpdated = await User.findOneAndUpdate({ nickname }, { password: hashPassword }, { returnDocument: 'after' });
    const userDto = new UserDto(userUpdated);
    const tokens = tokenServices.generateTokens({ ...userDto });
    await tokenServices.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens, loginUser: userDto,
    };
  }

  async getAllUsers() {
    const users = await User.find();
    const userDtos = users.map((user) => new UserDto(user));
    return userDtos;
  }

  async getUserByIdPopulated(userId) {
    const user = await User.findOne({ _id: userId })
      .populate({
        path: 'recipes',
        populate: [{ path: 'tags' }, { path: 'ingredients._id', model: 'Ingredient', select: 'name' }],
      })
      .populate({
        path: 'favouriteRecipes',
        populate: [{ path: 'tags' }, { path: 'ingredients._id', model: 'Ingredient', select: 'name' }],
      });

    return {
      _id: user._id,
      nickname: user.nickname,
      recipes: utils.recipesFormatIngredients(user.recipes),
      favourite: utils.recipesFormatIngredients(user.favouriteRecipes),
    };
  }

  async getUserByIdNotPopulated(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async deleteRecipe(deletedRecipe) {
    const user = await User.findOneAndUpdate(
      { _id: deletedRecipe.userId },
      { $pull: { recipes: deletedRecipe._id } },
      { new: true },
    );
    return user;
  }

  async addRecipeToUser(userId, recipeId) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { recipes: recipeId } },
      { new: true },
    );
    return user;
  }

  async addFavouriteRecipe(userId, recipeId) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { favouriteRecipes: recipeId } },
      { new: true },
    );
    return user;
  }

  async removeFavouriteRecipe(userId, recipeId) {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favouriteRecipes: recipeId } },
      { new: true },
    );
    return user;
  }

  async getRecipesByUserId(userId) {
    try {
      return await Recipe.find({ userId })
        .populate('tags', 'name')
        .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
        .exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getFavouriteRecipesByUserId(userId) {
    try {
      console.log(userId);
      return await Recipe.find({ favouritedByUsers: { $in: [userId] } })
        .populate('tags', 'name')
        .populate({ path: 'ingredients._id', model: 'Ingredient', select: 'name' })
        .exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = new UserServices();
