var express = require("express");
var router = express.Router();
var User = require("../models/user");
var jwt = require("jsonwebtoken");
const verifytoken = require("../middlewares/auth");
const paginatedResults = require("../middlewares/pagination");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { v4: uuidv4 } = require("uuid");

router.get("/gettinguser", async (req, res, next) => {
  try {
    const result = await User.find({ username: req.body.username });
    res.status(201).json({ sucess: true, result: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ sucess: false });
  }
});

router.put("/gettinguser", async (req, res, next) => {
  try {
    const result = await User.find({ username: req.body.username });
    res.status(201).json({ sucess: true, result: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ sucess: false });
  }
});

router.post("/create-users", (req, res) => {
  let userData = req.body;
  userData.uid = uuidv4();
  let user = new User(userData);
  user.save((error, createusersdata) => {
    if (error) {
      console.log("Error occurred while storing Data In DB:" + error);
    } else {
      res.status(200).send(createusersdata);
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    user = await User.findOne({ username: req.body.username });
    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
        }
        if (isMatch) {
          if (user.isActive == true) {
            res.status(201).send({
              status: 200,
              message: "logged in",
              user: user,
              token: jwt.sign(
                { role: user.role, username: user.username },
                process.env.AUTH_KEY,
                { expiresIn: "8h" }
              ),
            });
          } else {
            res
              .status(201)
              .send({ status: 200, message: "user account is in-active" });
          }
        } else res.status(201).send({ status: 200, message: "Invalid Password" });
      });
    } else if (!user) {
      res.status(201).send({ status: 200, message: "Invalid Creditinals" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// to get the user
router.get(
  "/getUsers",
  verifytoken,
  paginatedResults(User),
  async (req, res) => {
    try {
      if (Object.keys(req.query).length == 1) {
        userslistObj = await User.find({}, {});
        usersList = [];

        for (let v of userslistObj) {
          if (v["role"] == "subadmin") {
            if (
              v["username"]
                .toLowerCase()
                .includes(req.query.searchkeyword.toLowerCase())
            ) {
              usersList.push(v);
            }
          }
          if (v.role == "admin") {
            if (
              v["sname"]
                .toLowerCase()
                .includes(req.query.searchkeyword.toLowerCase())
            ) {
              usersList.push(v);
            }
          }
        }

        res.status(200).json({ res: usersList, count: value });
      } else {
        sezUsers = await User.find({ scode: req.query.scode }, {});
        var value = await User.find({
          role: req.query.role,
          scode: req.query.scode,
        }).count();
        usersList = res.paginatedResults;
        res
          .status(200)
          .json({ res: usersList, sezUsers: sezUsers, count: value });
      }
    } catch (e) {
      console.log(e);
    }
  }
);

// to get the total user
router.get("/getTotalUsers", verifytoken, async (req, res) => {
  try {
    users = await User.find({}, {});
    res.status(200).json({ res: users });
  } catch (e) {
    console.log(e);
  }
});

// for  deleting a guard
router.delete("/delete-guard/:username", verifytoken, async (req, res) => {
  try {
    await User.findOneAndDelete({ username: req.params.username });
    res.status(200).json({ delete: true });
  } catch (e) {
    console.log(e);
  }
});

// update the user account status
router.put("/updatests", verifytoken, async (req, res) => {
  try {
    const users = await User.findOneAndUpdate(
      { username: req.body.username, role: req.body.role },
      { $set: { isActive: req.body.isActive } }
    );

    res.status(200).json({ updated: true });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// update the user details
router.post("/update-SezInAdmin", verifytoken, async (req, res) => {
  try {
    const users = await User.findOneAndUpdate(
      { scode: req.body.scode },
      { $set: { sname: req.body.sname, sezlocation: req.body.sezlocation } },
      { new: true }
    );

    res.status(200).json({ updated: true, res: "success" });
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete the user
router.delete("/delete-user/:username", verifytoken, async (req, res) => {
  try {
    const users = await User.findOneAndDelete({
      username: req.params.username,
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

//dashboard services
router.get("/d-TotalUsers", verifytoken, async (req, res) => {
  try {
    users = await User.find({}, {});

    res.status(200).json({ res: users });
  } catch (e) {
    console.log(e);
  }
});

router.get("/d-getSezUsers", verifytoken, async (req, res) => {
  try {
    if (Object.keys(req.query).length == 1) {
      users = await User.find({ scode: req.query.scode }, {});
      res.status(200).json({ res: users });
    } else if (Object.keys(req.query).length == 3) {
      users = await User.find(
        {
          $and: [
            {
              $or: [
                {
                  role: req.query.role1,
                },
                {
                  role: req.query.role2,
                },
              ],
            },
            {
              scode: req.query.scode,
            },
          ],
        },
        {}
      );
      res.status(200).json({ res: users });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/activate-user", (req, res) => {
  jwt.verify(
    req.body.token,
    process.env.AUTH_KEY,
    async function (err, decoded) {
      try {
        users = await User.find(
          { role: decoded.role, username: decoded.username },
          {}
        );
        if (users) {
          await User.findOneAndUpdate(
            { role: decoded.role, username: decoded.username },
            { $set: { isActive: true } }
          );
        }
        res.status(200).json({ res: "activated" });
      } catch (e) {
        console.log(e);
      }
    }
  );
});

router.get("/profile", verifytoken, async (req, res) => {
  userObj = await User.find({ username: req.query.username });
  res.status(200).json({ res: userObj });
});


// change password 
router.post('/change_password', async (req, res) => {

  console.log(req.body)

  user = await User.findOne({username:req.body.username});
  console.log(user);

  if (user) {
    bcrypt.compare(req.body.old_password, user.password, function (err, isMatch) {
      if (err) { console.log(err) }
      if (isMatch) {

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
          if (err) { console.log(err); }

          // hash the password using our new salt

          if (salt) {
            bcrypt.hash(req.body.new_password, salt, async function (err, hash) {
              if (err) return next(err);

              // override the cleartext password with the hashed one
              if (hash) {
                console.log(hash)
                data = await User.findOneAndUpdate({ username: req.body.username }, { $set: { password: hash } });

                res.status(201).send({ status: 200, message: "reseted" });
              }
            });
          }
        });
      }
      else {
        res.status(201).send({ status: 200, message: "Invalid password" });
      }
    });
  }
  else if (!user) {
    res.status(201).send({ status: 200, message: "Invalid creditinals" });
  }
});


// forgot Password
router.post("/forgot_password", async (req, res) => {
  user = await User.find({ email: req.body.email });
  if (user) {
    jwt.sign(
      { username: user[0]["username"], email: user[0]["email"] },
      process.env.AUTH_KEY,
      { expiresIn: "1h" },
      (err, signedtoken) => {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `vms535399@gmail.com`,
            pass: "vms@1234.",
          },
        });
        var mailOptions = {
          from: "vms535399@gmail.com",
          to: req.body.email,
          subject: "Password Reset Link",
          html:
            '<p>Click here <a href="http://localhost:4200/#/checkemail/' +
            signedtoken +
            '">' +
            signedtoken +
            "here</a> to reset your password</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.status(201).send({ status: 200, message: "email sent" });
          }
        });
      }
    );
  } else {
    res.status(201).send({ status: 200, message: "Invalid email" });
  }
});

// verify to token from forgot password
router.post("/verifytoken", (req, res) => {
  jwt.verify(
    req.body.token,
    process.env.AUTH_KEY,
    async function (err, decoded) {
      try {
        users = await User.find(
          { email: decoded["email"], username: decoded["username"] },
          {}
        );

        if (users.length > 0) {
          res
            .status(200)
            .json({
              res: "existed",
              userdata: { email: users[0].email, username: users[0].username },
            });
        }
      } catch (e) {
        console.log(e);
        res.status(200).json({ res: "expired" });
      }
    }
  );
});

// change password using forgot password
router.post("/changepassword", async (req, res) => {
  user = await User.find({
    $and: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (user) {
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        console.log(err);
      }

      // hash the password using our new salt
      if (salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
          if (err) {
            res.status(201).send({ status: 400, error: err });
          }

          // override the cleartext password with the hashed one
          if (hash) {
            data = await User.findOneAndUpdate(
              {
                $and: [
                  { username: req.body.username },
                  { email: req.body.email },
                ],
              },
              { $set: { password: hash } }
            );

            res.status(201).send({ status: 200, message: "reseted" });
          }
        });
      }
    });
  }
});

router.post("/getAdminsForSezList", verifytoken, async (req, res) => {
  sezmatchedObj = [];
  for (let v of req.body) {
    userObj = await User.find({
      $and: [{ scode: v.scode }, { role: "admin" }],
    });
    if (userObj.length > 0) {
      sezmatchedObj.push(userObj[0]);
    }
  }
  res.status(200).json({ res: sezmatchedObj });
});

//-------------------------murali----------------------//

router.put("/update-details", async (req, res) => {
  const userprofile = await User.findOneAndUpdate(
    { companyId: req.body.companyId },
    {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        username: req.body.username,
        phonenumber: req.body.phone,
      },
    }
  );

  if (!userprofile) {
    res.status(500).send({
      message: "User not found",
      status: "500",
      dataObject: {
        appName: "VMS",
        routeName: "Update User Details Route",
        data: "No Users found.",
      },
    });
    return;
  }
  res.status(200).send({
    message: "User Data  Updated Successfully",
    status: "200",
    dataObject: {
      appName: "VMS",
      routeName: "Update User profile",
      dataObject: [userprofile],
    },
  });
});

module.exports = router;
