const express = require("express");
const User = require('../models/user.model');
const { set_user } = require('../middleware/user.auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "all field are required"
    });
  }

  try {
    const login_user = await User.findOne({ email: email });

 
    if (!login_user) {
      return res.status(401).json({
        ok: false,
        message: "not a verfyied user or user not found"
      });
    }

   
    if (login_user.password != password) {
      return res.status(401).json({
        ok: false,
        message: "not a verfyied user or wrong pass"
      });
    }

    const token = set_user(login_user);

    if (!token) {
      return res.status(500).json({
        ok: false,
        message: "not find token"
      });
    }

    res.cookie('cookie', token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });
 const { password:DbPassword, ...UserData } = login_user.toObject();
    return res.status(200).json({
      ok: true,
      message: "login succesfully",
      UserData
    });

  } catch (err) {
    console.log(err);

    
    return res.status(500).json({
      ok: false,
      message: "login user"
    });
  }
});

module.exports = router;
