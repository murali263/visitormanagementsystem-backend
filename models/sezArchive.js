const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
var sezArchiveSchema = mongoose.Schema({
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

var Sez = mongoose.model("SezArchive", sezArchiveSchema);
module.exports = Sez;
