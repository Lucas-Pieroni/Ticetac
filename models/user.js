const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    password: String,
    email: String,
    userJourneys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'journeys' }],
});
  
var UserModel = mongoose.model('users', userSchema);

module.exports = UserModel