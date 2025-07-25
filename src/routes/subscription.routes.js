import { Router } from "express";
import{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controllers.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();

router.use(verifyJWT);
router.route("/c/:channelId").get(getSubscribedChannels).post(toggleSubscription)

router.route("/u/:subscriberId").get(getUserChannelSubscribers)

export default router