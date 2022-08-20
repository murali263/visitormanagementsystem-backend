const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
var sezSchema = mongoose.Schema({
  sname: {
    type: String,
    unique: true,
    maxlength: 50,
  },
  sezlocation: {
    type: String,
  },

  scode: {
    type: String,
    maxlength: 50,
    unique: true,
  },
  sid: {
    type: Number,
  },
});

sezSchema.pre("save", function () {
  var a = this;
  if (this.isNew) {
    return (a.scode = Math.floor(new Date().valueOf() * Math.random()));
  }
});

var Sez = mongoose.model("Sez", sezSchema);
module.exports = Sez;
