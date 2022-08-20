var express = require("express");
var router = express.Router();
var manager = require("../models/manager");
var bcryptjs = require("bcryptjs");
var userAuth = require("../models/userAuth");
const { uuid } = require("uuidv4");

router.post("/create-manager", async (req, res) => {
  try {
    let filter = {
      $or: [{ userName: req.body.userName }, { email: req.body.email }],
    };
    manager.find(filter, function (err, user) {
      if (user.length <= 0) {
        const newManager = new manager(req.body);
        newManager.save(function (err) {
          if (err) throw err;
          console.log(err);
        });
        let managerObj = {};
        managerObj.username = req.body.userName;
        managerObj.email = req.body.email;
        managerObj.phonenumber = req.body.phoneNumber;
        managerObj.role = "manager";
        managerObj.companyId = req.body.companyId;
        managerObj.password = bcryptjs.hashSync("Welcome@123", 10);
        managerObj.isActive = true;
        managerObj.uid = uuid();

        var newUser = new userAuth(managerObj);
        newUser.save();

        res.status(200).send({ status: 200, message: "saved", newManager });
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

router.get("/get-manager", async (req, res) => {
  try {
    const managerList = await manager.find({ companyId: req.query.companyId });
    if (managerList) {
      res.status(200).send(managerList);
    } else {
      res.status(400).send({ message: err });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// for  deleting a guard
router.delete("/delete-manager", async (req, res) => {
  try {
    await manager.findOneAndDelete({ managerId: req.query.managerId });
    res.status(201).send({ status: 200, delete: true });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/update_manager_data", async (req, res) => {
  try {
    if (!req.body.companyId) {
      return res.status(400).send("companyID required");
    } else {
      const parentdata = await manager.findOneAndUpdate(
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
