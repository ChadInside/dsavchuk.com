const Token = require("../models/Token")
const jwt = require("jsonwebtoken")
require("dotenv").config()

class tokenServices {

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

   generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {accessToken, refreshToken}
  }


  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({user: userId})
    if (tokenData) {
      const updateToken = await Token.findOneAndUpdate({user: userId}, {$set: {refreshToken: refreshToken}})
      return updateToken;
    }
    const token = await Token.create({user: userId, refreshToken})
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.findOneAndDelete({refreshToken})
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({refreshToken})
    return tokenData;
  }

}

module.exports = new tokenServices();
