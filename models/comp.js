const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

var compSchema = mongoose.Schema({
  companyId: {
    type: String,
    maxlength: 10,
    unique: true,
  },
  compcode: {
    type: String,
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
  isActive: {
    type: Boolean,
    default: false,
  },
  GST: {
    type: String,
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

compSchema.pre("save", function () {
  var a = this;
  if (this.isNew) {
    return (a.companyId = Math.floor(new Date().valueOf() * Math.random()));
  }
});

var company = mongoose.model("company", compSchema, "companies");
module.exports = company;
