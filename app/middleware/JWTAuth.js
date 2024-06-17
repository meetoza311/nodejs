var jwt = require('jsonwebtoken')
var key = require('../config/authConfig');
const db = require("../models/index");
const User = db.user;


module.exports = (req, res, next) => {
    
    try{
        if(req.headers.token){
            // if(req.headers.token == "yk11__"){
            //     next();
            //     return;
            // }
            jwt.verify(req.headers.token,key.secret, async(err, decoded) => {
                
                if (err) {
                    res.status(401).json({ ERROR: "Token Expired!",status:false });
                    return;
                } else {
                    
                    req.user = decoded;
                    let tokenUser = await User.findOne({
                        where: { id: req.user.id },
                        attributes: ['authToken'],
                        raw: true,
                    })
                    if (tokenUser && tokenUser.authToken == req.headers.token) {
                        next();
                        return;  
                    } 
                    else  {return res.status(401).json({ ERROR: "Unauthorized!",status:false });}
                }
            });
        } else res.status(401).json({ ERROR: "Unauthorized!",status:false });
    }catch(e){
        console.log(e)
        res.status(401).json({ ERROR: "Token Expired!",status:false });
    }
};