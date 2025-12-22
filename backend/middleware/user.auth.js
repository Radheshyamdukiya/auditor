const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const admin =require('../models/admin.model');
const set_user = (user) => {
    if (!user) return null;

    return jwt.sign(
        {
            id: user._id,
            name: user.name
        },
        process.env.PASS,
        { expiresIn: "7d" }
    );
};

const verfy_user = async (req, res, next) => {
    const token = req.cookies.cookie;

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "Login required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.PASS);

       
        const cur_user = await User.findById(decoded.id).select("name") || await admin.findById(decoded.id).select('name');

        if (!cur_user) {
            return res.status(401).json({
                ok: false,
                message: "User not found in middleware"
            });
        }
        req.user = cur_user.name;
        next();
    } catch (err) {
        return res.status(401).json({
            ok: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = {
    set_user,
    verfy_user
};
