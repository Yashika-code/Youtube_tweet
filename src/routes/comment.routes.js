import { Router } from "express";
import{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controllers.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();

router.use(verifyJWT); // ✅

router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router