var jwt = require('jsonwebtoken')
var key = require('../config/authConfig');
const db = require("../models/index");
const User = db.user;

module.exports = (req, res, next) => {
    try {
        if (req.headers.token) {
            // if (req.headers.token == "yk11__") {
            //     next();
            //     return;
            // }
            jwt.verify(req.headers.token, key.secret, async (err, decoded) => {
                if (err) {
                    res.status(401).json({ ERROR: "Token Expired!", status: false });
                    return;
                } else {
                    req.user = decoded;
                    if (req.user.Role == 'admin') {
                        next();
                        return;
                    } else if (req.user.Role == 'user') {
                        if (req.user.id == Number(req.query.userID)) {
                            next();
                            return;
                        } else if (Number(req.query.userID) && req.user.user_show) {
                            next();
                            return;
                        }
                        else { return res.status(401).json({ ERROR: "Unauthorized!", status: false }); }
                    }
                    else { return res.status(401).json({ ERROR: "Unauthorized!", status: false }); }

                }
            });
        } else res.status(401).json({ ERROR: "Unauthorized!", status: false });
    } catch (e) {
        console.log(e)
        res.status(401).json({ ERROR: "Token Expired!", status: false });
    }
};