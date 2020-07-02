const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route  POST api/users
// @desc   Register User
// @access Public

router.post(
  "/",
  [
    check("name", "Name is require").not().isEmpty(),
    check("surname", "Surname is require").not().isEmpty(),
    check("email", "Email is require").isEmail(),
    check("password")
      .isLength({ min: 4 })
      .withMessage("Password length minimum 4 characters")
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
      .withMessage(
        "Password must contain lowercase character, uppercase character, one digit, one special symbol"
      ),
  ],
  async (req, res) => {
    // Check request validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring
    const { email, name, surname, password } = req.body;

    try {
      // Check duplicate user in DB
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }
      // New User model
      user = new User({
        name,
        surname,
        email,
        password,
      });

      // Bcrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
