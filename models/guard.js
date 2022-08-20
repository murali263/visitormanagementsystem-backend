const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
var guardSchema = mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  idProof: {
    type: String,
  },
  Address: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  ActiveLocation: {
    type: String,
  },
  guardId: {
    type: String,
    maxlength: 5,
    unique: true,
  },
  password: {
    type: String,
  },
  companyId: {
    type: String,
  },
  role: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
});
guardSchema.pre("save", function () {
  var a = this;
  if (this.isNew) {
    return (a.guardId = Math.floor(new Date().valueOf() * Math.random()));
  }
});

var guard = mongoose.model("guard", guardSchema);
module.exports = guard;
