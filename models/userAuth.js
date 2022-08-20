const mongoose = require("mongoose");
var UserAuthSchema = mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  fname: {
    type: String,
    maxlength: 50,
  },
  lname: {
    type: String,
    maxlength: 50,
  },
  phonenumber: {
    type: Number,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
  companyId: {
    type: Number,
  },
  address: {
    type: Object,
    doorno: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: Number },
    default: null,
  },
  sname: {
    type: String,
  },
  sezlocation: {
    type: String,
  },
  created_on: {
    type: Number,
    default: Date.now(),
  },
  aadharno: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  uid: {
    type: String,
  },
});
var User1 = mongoose.model("User1", UserAuthSchema, "users");
module.exports = User1;
