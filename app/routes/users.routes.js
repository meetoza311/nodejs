const userController = require("../controllers/user.controller");
const verifyToken = require('../middleware/JWTAuth')

module.exports = (app) => {
  app.post("/user/login", userController.verifyUser);
  app.post("/user/verfiy", userController.verifyUserLogin);
  // app.post("/user/resetPassword", userController.resetPasswordRequest);
  // app.post("/user/updatePassword", userController.updatePasswordByMail);
  app.get("/user/list/consumer",userController.getAllUsers);
  app.get("/user/list/builder",userController.getAllBuilderUsers);
  app.get("/user/list/roleWise",userController.getAllRolesUsers);
  app.post("/user/list/categoriesById",userController.getCategoryById);

  // normal user
  app.post("/user/data/add", userController.addData);
  app.get("/user/role/list", userController.getAllRoles);
  app.post("/user/data/roleWise", userController.addRoleWiseUser);
  app.put("/user/data/update", [verifyToken], userController.updateData);

  // builder user
  app.post("/user/data/add/builder", userController.addBuilderData);
  app.put("/user/data/update", [verifyToken], userController.updateData);
};
