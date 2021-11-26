const {model, Schema, ObjectId} = require("mongoose")

const Token = new Schema({

  user: {type: ObjectId, ref: 'User', required: true},
  refreshToken: {type: String, required: true},

})

module.exports = model("Token", Token)




