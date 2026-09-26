const express = require("express");
const controller = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");
const router = express.Router();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/get-me", authUser, controller.getMe);
module.exports = router;
