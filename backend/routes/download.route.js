const express = require('express');
const router = express.Router();
const Url = require('../models/data.model');
const { Parser } = require('json2csv'); 
const {verfy_user}=require("../middleware/user.auth")
router.get('/download-users',verfy_user ,async (req, res) => {
    try {
     
        const data = await Url.find(); 

        if (!data || data.length === 0) {
            return res.status(404).json({ ok: false, message: "Database khali hai!" });
        }

       
        const parser = new Parser();
        const csv = parser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users_data.csv');
        return res.status(200).send(csv);

    } catch (err) {
    
        console.log("Error during download:", err); 
        res.status(500).json({ ok: false, message: "Download nahi ho payega, server error" });
    }
});

module.exports = router;