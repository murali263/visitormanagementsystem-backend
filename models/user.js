const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose.set("useCreateIndex", true);

const SALT_WORK_FACTOR = 10;
var UserSchema = mongoose.Schema({
  fname: {
    type: String,
    maxlength: 50,
  },
  lname: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    default: null,
  },
  username: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  aadharno: {
    type: String,
  },
  password: {
    type: String,
  },

  role: {
    type: String,
    enum: ["admin", "superadmin", "guard", "manager"],
  },
  scode: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
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
  uid: {
    type: String,
  },
  created_on: {
    type: Number,
    default: Date.now(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: Number,
  },
});


UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;

      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
var User = mongoose.model("User", UserSchema);
module.exports = User;
