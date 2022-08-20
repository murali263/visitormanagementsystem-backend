const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
var managerSchema = mongoose.Schema({
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
  Department: {
    type: String,
  },
  managerId: {
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
managerSchema.pre("save", function () {
  var a = this;
  if (this.isNew) {
    return (a.managerId = Math.floor(new Date().valueOf() * Math.random()));
  }
});

var manager = mongoose.model("manager", managerSchema);
module.exports = manager;
