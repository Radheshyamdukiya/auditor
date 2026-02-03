const express = require('express');
const router = express.Router();
const Url = require('../models/data.model');
const { verfy_user } = require('../middleware/user.auth');

router.get('/list', verfy_user, async (req, res) => {
  try {
    const { name, title } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "username required",
      });
    }

    
    let q = { name: name };
    if (title) q.title = title;

    const users = await Url.find(q).lean(); 
       
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, message: "no users found" });
    }

    res.status(200).json({ ok: true, message: "users fetched", data: users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "error in getting user" });
  }
});

module.exports = router;