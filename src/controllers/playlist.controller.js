import mongoose ,{isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    if(!name || !description){
        throw new ApiError(400,"Name and description are required")
    }
    const playlist= await Playlist.create({
        name,
        description,
        owner:req.user._id
    })
    if(!playlist){
        throw new ApiError(500,"Something went wrong while creating the playlist")
    }
    return res.status(200).json(new ApiResponse(200,playlist,"playlist created successfully"));

})

const getUserPlaylists=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User id")
    }
    const playlists= await Playlist.find({owner:userId})

    if(!playlists){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,playlists,"User playlists fetched successfully"));

})

const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist ID")
    }
    const playlist= await Playlist.findById(playlistId).populate("videos")
    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,playlist,"playlist fetched successfully"));

})

const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video ID")
    }
    const updatedPlaylist= await Playlist.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $addFields:{
                videos:{
                    $setUnion:["$videos",[new mongoose.Types.ObjectId(videoId)]]
                }
            }
        },
        {
            $merge:{
                into:"playlists"
            }
        }
    ])
    if(!updatedPlaylist){
        throw new ApiError(404,"Playlist not found or video already added")
    }
    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Videos added to playlist successfully"));

})

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video ID");
    }
    const updatedPlaylist= await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new:true
        }
    )
    if(!updatedPlaylist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Videos remoed from playlist successfully"));

})

const deletePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist ID");
    }
    const deletedPlaylist= await Playlist.findByIdAndDelete(
        playlistId
    )
    if(!deletedPlaylist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,{},"Videos deleted from playlist successfully"));
})

const updatePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    const {name,description}=req
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist ID");
    }
    if(!name || !description){
        throw new ApiError(400,"Name or desription cannot be empty")
    }
    const updatedPlaylistDoc= await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
               name,
               description
            }
        },
        {
            new:true
        }
    )
    if(!updatedPlaylistDoc){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,updatedPlaylistDoc,"Videos updated successfully"));
})

export{
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist
}