import { Router } from "express";
import{
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controllers.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();

router.use(verifyJWT);

router.route("/toggle/video/:videoId").post(toggleVideoLike)
router.route("/toggle/comment/:commentId").post(toggleCommentLike)
router.route("/toggle/tweet/:tweetId").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)

export default router