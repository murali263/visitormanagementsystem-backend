const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

var visitorSchema = mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  visitorName: {
    type: String,
  },
  referenceBy: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  visitDate: {
    type: Date,
  },
  email: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  visitingFrom: {
    type: String,
  },
  members: {
    type: Number,
  },
  visitTime: {
    type: String,
  },
  AdditionalInfo: {
    type: String,
  },
  checkin: {
    type: String,
  },
  checkout: {
    type: String,
  },
  checkinUid: {
    type: String,
  },
  checkoutUid: {
    type: String,
  },
  verificationCode: {
    type: String,
  },
  companyId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

var visitor = mongoose.model("visitor", visitorSchema);
module.exports = visitor;
