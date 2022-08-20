const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

var SubCompanySchema = mongoose.Schema({
  companyId: {
    type: String,
    maxlength: 10,
    unique: true,
  },
  companyname: {
    type: String,
  },
  companylogo: {
    type: String,
  },
  addressline1: {
    type: String,
  },
  addressline2: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  spoc: {
    type: Array,
  },
  type: {
    type: String,
  },
  parentCompanyId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

SubCompanySchema.pre("save", function () {
  var a = this;
  if (this.isNew) {
    return (a.companyId = Math.floor(new Date().valueOf() * Math.random()));
  }
});

var SubCompany = mongoose.model("SubCompany", SubCompanySchema, "companies");
module.exports = SubCompany;
