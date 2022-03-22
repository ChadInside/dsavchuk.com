// noinspection JSCheckFunctionSignatures

const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
require('dotenv').config();

// noinspection JSCheckFunctionSignatures
class TokenServices {
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      const updateToken = await
      Token.findOneAndUpdate({ user: userId }, { $set: { refreshToken } });
      return updateToken;
    }
    return Token.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.findOneAndDelete({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenServices();
