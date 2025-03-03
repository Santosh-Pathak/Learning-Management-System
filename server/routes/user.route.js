import express from "express";
import { register, login, logout ,getUserProfile} from "../controllers/user.controller.js";
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile").get(isAuthenticated,getUserProfile);

export default router;