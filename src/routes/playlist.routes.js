import { Router } from "express";
import{
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist
} from "../controllers/playlist.controller.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();
router.route("/").post(createPlaylist)

router.use(verifyJWT);
router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)
router.route("/user/:userId").get(getUserPlaylists)

export default router