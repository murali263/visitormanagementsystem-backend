const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

var ArchiveSchema = mongoose.Schema({
    ///first-name
    fname: {
        type: String,
        maxlength: 50,
    },

    ///last-name
    lname: {
        type: String,
        maxlength: 50,
    },

    ///eamil
    email: {
        type: String,
        default: null,
        required: false,
        unique: false,
    },
    username: {
        type: String,
        unique: true,
        required: false,
    },
    phonenumber: {
        type: Number,
        unique: true,
        required: true,
    },
    aadharno: {
        type: Number,
        required: false,
        default: null,
    },
    ///salt
    slat: {
        type: String,
        default: "string",
    },

    ///password
    password: {
        type: String,
        required: true,
    },

    ///role
    role: {
        type: String,
        enum: ["admin", "superadmin", "guard", "subadmin"],
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
    created_on: {
        type: Number,
        default: Date.now(),
    },
});

var ArchiveSchema = mongoose.model("archive", ArchiveSchema);
module.exports = ArchiveSchema;
