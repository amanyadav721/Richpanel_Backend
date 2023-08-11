import express from "express";
import { signup, signin, signout } from "../controllers/auth.js";
import { stripe_pay } from "../controllers/stripe.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", isAuth, signout);
router.post("/payment", isAuth, stripe_pay);

export default router;
