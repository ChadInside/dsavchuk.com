const {model, Schema} = require("mongoose")

const Ingredient = new Schema({

  name: {type: String, required: true},

})

module.exports = model("Ingredient", Ingredient)



