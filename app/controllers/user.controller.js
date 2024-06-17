const db = require("../models/index");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig");
const User = db.user;
const BuilderUser = db.builderUser;
const Category = db.category;
const userCatergory = db.userCategory;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


exports.verifyUser = async (req, res) => {
    User.findOne({
        where: {
            [Op.or]: [
                { mobileNumber: req.body.mobileNumber },
                // { email: req.body.email },
            ],
        },
        raw: true,
        nest: true,
    })
        .then(async (user) => {
            if (!user) {
                return res.send({ error: "User Not found." });
            } else {
                const token = jwt.sign(
                    {
                        Email: req.body.email,
                        name: user.username,
                        mobileNumber: user.mobileNumber,
                        Role: user.role_id,
                        id: user.user_id,
                    },
                    authConfig.secret,
                    { expiresIn: 86400 }
                );
                if (token) {
                    let tokenAdd = await User.update(
                        { roken: token },
                        {
                            where: {
                                id: user.user_id,
                            },
                        }
                    )
                   
                }

                let category = await userCatergory.findAll({
                    where:{
                        user_id:user.user_id,
                    },
                    attributes:['user_id'],
                    include:[{model:Category,attributes:['category_id','category_name']}],
                    raw:true,
                })
                console.log(category,'category');
                // let userData = {};
                // Object.assign(userData, user);
                return res.send({
                    token,
                    user: {
                        email: user.email,
                        name: user.username,
                        mobileNumber: user.mobileNumber,
                        role_id: user.role_id,
                        user_id: user.user_id,
                        category:category
                    },
                    message: "valid",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.verifyUserLogin = async (req, res) => {
    User.findOne({
        where: {
            [Op.or]: [
                { mobileNumber: req.body.mobileNumber },
                // { email: req.body.email },
            ],
        },
        raw: true,
        nest: true,
    })
        .then(async (user) => {
            if (!user) {
                // return res.send({ error: "User Not found.",status:false });
                res.status(400).send({ error: "User Not found.", status: false });
            } else {
                res.status(200).send({ error: "User found.", status: true });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

// exports.resetPasswordRequest = (req, res) => {
//     // console.log(req.body.email)
//     User.findOne({
//         where: {
//             email: req.body.email,
//         },
//     })
//         .then((user) => {
//             if (!user) {
//                 res.send(JSON.stringify({ ERROR: "Email not found!" }));
//             } else {
//                 const securityCode = Math.floor(Math.random() * 1000000);
//                 // console.log(securityCode, user.id, 'securityCode')
//                 let obj = {};
//                 obj.security_code = String(securityCode);
//                 // console.log(obj, 'obj')

//                 User.update(
//                     { security_code: securityCode },
//                     {
//                         where: {
//                             user_id: user.user_id,
//                         },
//                     }
//                 )
//                     .then((articles) => {
//                         // console.log(articles)

//                     })
//                     .catch((e) => console.log(e));
//                 const transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     secure: false,
//                     auth: {
//                         user: authConfig.user,
//                         pass: authConfig.pass,
//                     },
//                 });
//                 transporter.verify(function (error, success) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log("Server is ready to take our messages");
//                     }
//                 });
//                 // var currentDateTime = new Date();
//                 const mailOptions = {
//                     from: authConfig.user,
//                     to: user.email,
//                     subject: "Reset Password",
//                     html:
//                         "<html><h3>You recently requested to reset your password! </h3><p>\
//           <h4>Hello " +
//                         user.username +
//                         "</h4> <td style='padding:0 15px;'><p>Your authentication code for Project is " +
//                         securityCode +
//                         ".</p>\
//               <p>Thank you,</p>\
//               <p>Admin Team.</p>\
//         </td>\
//           </p></html>",
//                 };

//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error);
//                         // JSON.stringify({
//                         //   message:
//                         //     "Password Reset link sent to your email .Please check the your email.Code Will be Valid For 10 min.",
//                         // })
//                     } else {
//                         res.send(
//                             JSON.stringify({
//                                 message:
//                                     "Password Reset link sent to your email .Please check the your email.Code Will be Valid For 10 min." + securityCode,
//                             })
//                         );
//                     }
//                 });
//             }
//         })
//         .catch((e) => console.log(e));
// };

// exports.updatePasswordByMail = (req, res) => {
//     // console.log(req.body)
//     User.findOne({
//         where: {
//             email: req.body.email,
//         },
//     })
//         .then((user) => {
//             if (!user) {
//                 return res.status(404).send({ message: "User Not found." });
//             }
//             if (
//                 user.security_code == req.body.security_code ||
//                 req.body.security_code == "000000"
//             ) {
//                 // update password, code verified
//                 const newPassword = bcrypt.hashSync(req.body.password, 8);
//                 User.update(
//                     { password: newPassword, security_code: null },
//                     { where: { user_id: user.user_id } }
//                 )
//                     .then((count) =>
//                         res.status(200).send({
//                             user,
//                             message: "Password update successfully",
//                             status: true,
//                         })
//                     )
//                     .catch((err) => {
//                         res.status(500).send({
//                             message: err.message,
//                             status: true,
//                         });
//                     });
//             } else {
//                 return res.status(200).send({
//                     message: "Security code does not match",
//                     status: false,
//                 });
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({ message: err.message });
//         });
// };


exports.getAllUsers = async (req, res) => {


    User.findAll({
        order: [["username", "asc"]],
        where: {
            role_id: 3
        }
        // attributes:[['id','key'],['name','value']]
    })
        .then((articles) => {
            res.status(200).send({ message: 'consumer get success', data: articles, status: true });
        })
        .catch((e) => console.log(e));
};

exports.getAllBuilderUsers = async (req, res) => {


    User.findAll({
        order: [["username", "asc"]],
        where: {
            role_id: 2
        }
        // attributes:[['id','key'],['name','value']]
    })
        .then((articles) => {
            res.status(200).send({ message: 'builder get success', data: articles, status: true });
        })
        .catch((e) => {
            res.send({ message: e?.message });
            console.log(e)
        });
};

exports.getCategoryById = async (req, res) => {
    userCatergory.findAll({
        include: [Category],
        where: {
            user_id: req.body.user_id
        },
        raw: true
        // attributes:[['id','key'],['name','value']]
    })
        .then((articles) => {
            res.status(200).send({ message: 'user category get success', data: articles, status: true });
        })
        .catch((e) => {
            res.status(400).send({ message: 'error', status: false });
            console.log(e)
        });
};
exports.getAllRolesUsers = async (req, res) => {
    User.findAll({
        order: [["username", "asc"]],
        attributes: ['user_id', 'username', 'email', 'mobileNumber',[Sequelize.fn('GROUP_CONCAT', Sequelize.col('UserCategories.category_id')), 'categories']],
        include: [{
            model: userCatergory,
            attributes: [],
          }],
        raw: true,
        group:['user_id']
        // attributes:[['id','key'],['name','value']]
    })
        .then((articles) => {
            res.status(200).send({ message: 'user role wise get success', data: articles, status: true });
        })
        .catch((e) => {
            res.status(400).send({ message: 'error', status: false });
            console.log(e)
        });
};

exports.getAllRoles = async (req, res) => {


    Category.findAll({
        raw: true
        // attributes:[['id','key'],['name','value']]
    })
        .then((articles) => {
            res.status(200).send({ message: 'role get success', data: articles, status: true });
        })
        .catch((e) => {
            res.status(400).send({ message: 'role error', status: false });
            console.log(e)
        });
};

exports.addRoleWiseUser = (req, res) => {
    console.log(req.body);
    User.findOne({
        where: {
            [Op.or]: [
                { mobileNumber: req.body.phone_number },
                // { email: req.body.email },
            ],
        },
        raw: true,
        nest: true,
    })
        .then(async (user) => {
            console.log(user)
            if (user) {
                return res.status(400).send({ message: 'User already exist.', status: false });
            } else {

                User.create({
                    username: req.body.name,
                    email: req.body.email,
                    mobileNumber: req.body.phone_number,
                    role_id: req.body.role == 1 ? 1 : 4,
                    otp: '',
                    token: ''
                })
                    .then(async (articles) => {
                        if (req.body.role != 1) {
                            let data = await userCatergory.create({
                                user_id: articles.user_id,
                                category_id: req.body.role,
                            })
                        } else {
                            let categoryData = []
                            await [1, 2, 3, 4, 5, 6].map((item) => {
                                categoryData.push({
                                    user_id: articles.user_id,
                                    category_id: item,
                                })
                            })
                            let data = await userCatergory.bulkCreate(categoryData)
                        }
                        return res.status(200).send({ message: 'user successfully added!.', status: false, userData: articles });
                    })
                    .catch((e) => res.status(400).send({ message: 'error.', status: false }));

            }
        })
        .catch((err) => {
            res.status(400).send({ message: 'error.', status: false })
        });

};

exports.addData = (req, res) => {
    User.findOne({
        where: {
            [Op.or]: [
                { mobileNumber: req.body.mobileNumber },
                // { email: req.body.email },
            ],
        },
        raw: true,
        nest: true,
    })
        .then(async (user) => {
            console.log(user)
            if (user) {
                return res.send({ error: "User already exist." });
            } else {
                User.findOne({
                    where: {
                        [Op.or]: [
                            { username: req.body.username },
                            { email: req.body.email },
                        ],
                    },
                })
                    .then((user) => {
                        if (!user) {
                            User.create({
                                username: req.body.username,
                                email: req.body.email,
                                mobileNumber: req.body.mobileNumber,
                                role_id: req.body.role,
                                otp: '',
                                token: ''
                            })
                                .then((articles) => {
                                    res.send(
                                        JSON.stringify({ response: "user successfully added!", status: true, userData: articles })
                                    );
                                })
                                .catch((e) => res.status(500).send({ message: err.message }));
                        } else
                            res.send(
                                JSON.stringify({
                                    errMessage:
                                        "Name or Email is already in use."
                                    , status: false
                                })
                            );
                    })
                    .catch((e) => {
                        res.status(500).send({ message: e.message });
                        // console.log(e.message)
                    });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });

};


exports.updateData = async (req, res) => {
    let user = await User.findOne({
        where: {
            user_id: { [Op.ne]: req.body.user_id },
            email: req.body.email
        }
    })
    if (user) {
        return res.send(
            JSON.stringify({ response: "Email already in use", status: false })
        );
    }
    User.update(
        {
            username: req.body.username,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            role_id: req.body.role,
            otp: '',
            token: '',
        },
        {
            where: {
                id: req.body.user_id,
            },
        }
    )
        .then((articles) => {
            res.send(
                JSON.stringify({ response: "user successfully updated!", status: true })
            );
        })
        .catch((e) => {
            res.send({ message: e?.message });
            console.log(e)
        });
};

exports.addBuilderData = (req, res) => {

    if (!req.body?.company_name) {
        return res.send(
            JSON.stringify({
                errMessage:
                    "Company name not provided"
                , status: false
            })
        );
    }
    User.findOne({
        where: {
            [Op.or]: [
                { username: req.body.username },
                { email: req.body.email },
            ],
        },
    })
        .then((user) => {
            if (!user) {
                User.create({
                    username: req.body.username,
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    role_id: req.body.role,
                    otp: '',
                    token: ''

                })
                    .then(async (articles) => {
                        // console.log(articles)

                        let data = await BuilderUser.create({
                            company_name: req.body.company_name,
                            user_id: articles.user_id,
                            created_by: articles.user_id,
                            updated_by: articles.user_id,
                        })
                        res.send(
                            JSON.stringify({ response: "user successfully added!", status: true, userData: articles })
                        );
                    })
                    .catch((e) => console.log(e));
            } else
                res.send(
                    JSON.stringify({
                        errMessage:
                            "Name or Email is already in use."
                        , status: false
                    })
                );
        })
        .catch((e) => {
            res.send({ message: e?.message });
            console.log(e)
        });
};