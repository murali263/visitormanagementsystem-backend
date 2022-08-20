var express = require("express");
var router = express.Router();
var guard = require("../models/guard");
var bcryptjs = require("bcryptjs");
var userAuth = require("../models/userAuth");
const { uuid } = require("uuidv4");

router.post("/create-guard", async (req, res) => {
  try {
    let filter = {
      $or: [{ userName: req.body.userName }, { email: req.body.email }],
    };

    guard.find(filter, function (err, user) {
      if (user.length <= 0) {
        const newGuard = new guard(req.body);
        newGuard.save(function (err) {
          if (err) throw err;
          console.log(err);
        });

        let guardObj = {};
        guardObj.username = req.body.userName;
        guardObj.email = req.body.email;
        guardObj.phonenumber = req.body.phoneNumber;
        guardObj.role = "guard";
        guardObj.companyId = req.body.companyId;
        guardObj.password = bcryptjs.hashSync("Welcome@123", 10);
        guardObj.isActive = true;
        guardObj.uid = uuid();

        var newUser = new userAuth(guardObj);
        newUser.save();

        res.status(200).send({ status: 200, message: "saved", newGuard });
      } else {
        return res
          .status(400)
          .json({ message: "UserName or Email is already exists" });
      }
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.get("/get-guards", async (req, res) => {
  try {
    const guardList = await guard.find({ companyId: req.query.companyId });
    if (guardList) {
      res.status(200).send(guardList);
    } else {
      res.status(400).send({ message: err });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// for  deleting a guard
router.delete("/delete-guard", async (req, res) => {
  try {
    await guard.findOneAndDelete({ guardId: req.query.guardId });
    res.status(201).send({ status: 200, delete: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/update_guard_data", async (req, res) => {
  try {
    if (!req.body.companyId) {
      return res.status(400).send("companyID required");
    } else {
      const parentdata = await guard.findOneAndUpdate(
        { companyId: req.body.companyId },
        { $set: req.body },
        { returnNewDocument: true }
      );
      res.status(200).send({ updated: true, updatedObj: parentdata });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
