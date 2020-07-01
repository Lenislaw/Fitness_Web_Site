const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      res.status(200).json({ msg: "User Get Works" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
