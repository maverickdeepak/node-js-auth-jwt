const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("must be at a valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("must be at least 6 chars long"),
  ],
  async function (req, res) {
    const { email, password } = req.body;

    //   validate email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check if user already exists
    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "user with this email is already exists",
          },
        ],
      });
    }

    // bcrypt password
    let hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email: email,
      password: hashedPassword,
    });
    // console.log(hashedPassword);

    // create json web token for signup user
    const token = await jwt.sign({ email }, "thisisupersecretofapplication", {
      expiresIn: 3600,
    });

    // validation passed
    res.json({ email: email, token: token });
  }
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long."),
  ],
  async function (req, res) {
    const { email, password } = req.body;

    // validate email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check is email found in database
    const checkUserInDB = users.find((user) => {
      return user.email === email;
    });
    if (!checkUserInDB) {
      return res.status(400).json({
        error: {
          msg: "User not found with this email address",
        },
      });
    }
    const comparePassword = await bcrypt.compare(
      password,
      checkUserInDB.password
    );
    if (!comparePassword) {
      return res.status(400).json({
        error: {
          msg: "Invalid Password",
        },
      });
    }

    // generate token for logged in user
    const token = await jwt.sign({ email }, "thisisupersecretofapplication", {
      expiresIn: 3600,
    });

    res.json({ token: token });
  }
);

router.get("/all-users", function (req, res) {
  res.json({ users });
});

module.exports = router;
