import mongoose ,{isValidObjectId} from "mongoose";
import {Video} from "../models/video.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getAllVideos=asyncHandler(async(req,res)=>{
    const {
        page=1,
        limit=10,
        query="",
        sortBy="createdAt",
        sortType="desc",
        userId
    }=req.query
    if(!req.user){
        throw new ApiError(401,"User must be logged In")
    }

    const match={
        ...(query?{title:{$regex:query,$options:"1"}}:{}),
        ...(userId?{owner:mongoose.Types.ObjectId(userId)}:{})
    }

    const videos= await Video.aggregate([
        {
            $match: match
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"videoByOwner",
            }
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                description:1,
                duration:1,
                views:1,
                isPublished:1,
                owner:{
                    $arrayElemAt:["$videoByOwner",0]
                }
            }
        },
        {
            $sort:{
                [sortBy]:sortType==="desc"?-1:1
            }
        },
        {
            $skip:(page-1)*parseInt(limit),
        },
        {
            $limit:parseInt(limit)
        }
    ]);
    if(!videos?.length){
        throw new ApiError(404,"videos not found")
    }
    return res.status(200).json(new ApiResponse(200,videos,"Videos fetched successfully"));
})

const publishAVideo=asyncHandler(async(req,res)=>{
    const {title,description,owner,duration}=req.body

    if(!title){
        throw new ApiError(400,"Title should not be empty")
    }
    if(!description){
        throw new ApiError(400,"Description should not be empty")
    }

    const videoFileLocalPath=req.files?.videoFile[0].path
    if(!videoFileLocalPath){
        throw new ApiError(400,"video file is required")
    }

    const thumbnailLocalPath=req.files?.thumbnail[0]?.path

    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required")
    }

    const videoFile= await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile){
        throw new ApiError(400,"cloudinary Error: video file is required")
    }
    if(!thumbnail){
        throw new ApiError(400,"cloudinary Error: thumbnail is required")
    }

    const videoDoc= await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        owner:req.user._id,
        duration
    })

    console.log(`Title : ${title}, Owner: ${owner}, duration:${duration}`);
    if(!videoDoc){
        throw new ApiError(500,"Something went wrong while publishing a video")
    }

    return res.status(200).json(new ApiResponse(200,videoDoc,"Video published successfully"))
})

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
    const video= await Video.findById(videoId).populate("owner","name email")
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    return res.status(200).json(new ApiResponse(200,video,"Video fetched successfully"))
})

const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {title,description}=req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
    let updateData={title,description};
    if(req.file){
        const thumbnailLocalPath=req.file.path
        if(!thumbnailLocalPath){
            throw new ApiError(400,"Thumbnail file is missing")
        }
        const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail.url){
            throw new ApiError(400,"Error while uploading thumbnail")
        }
        updateData.thumbnail=thumbnail.url
    }
    const updatedVideo= await Video.findByIdAndUpdate(
        videoId,
        {$set:updateData},
        {new:true,runValidators:true}
    )
    if(!updatedVideo){
        throw new ApiError(404,"video not found")
    }
    return res.status(200).json(new ApiResponse(200,updatedVideo,"Videos updated successfully"));
    return res.status(200).json(new ApiResponse(200,updatedVideo,"Video updated successfully"));

})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
    const deletedVideo= await Video.findByIdAndDelete(videoId);
    if(!deletedVideo){
        throw new ApiError(404,"video not found")
    }
    return res.status(200).json(new ApiResponse(200,deletedVideo,"Videos deleted successfully"));
})

const togglePublishStatus=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    video.isPublished=!video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200,video,"Videos publish status toggled successfully"));

})

export{
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}