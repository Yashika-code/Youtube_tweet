import mongoose,{isValidObjectId} from "mongoose";
import {Subscription} from "../models/subscriptions.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    const subscriberId=req.user._id
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel ID")
    }
    if(subscriberId.toString()===channelId.toString()){
        throw new ApiError(400,"You cannot subscribe to your own channel")
    }
    const existingSubscription= await Subscription.findOne({
        subscriber:subscriberId,
        channel:channelId
    })
    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200,{},"Unsubscribed successfully"));    
    }
    await Subscription.create({subscriber:subscriberId,channel:channelId})
    return res.status(200).json(new ApiResponse(200,{},"Subscribed successfully"));

})

const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.user._id
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel ID")
    }
    const subscribersDocs= await Subscription.find({
        channel:channelId,
    }).populate("subscriber","_id name email")
    if(!subscribersDocs){
        throw new ApiError(404,"Subscriber list is not found")
    }
    return res.status(200).json(new ApiResponse(200,subscribersDocs,"Subscribers fetched successfully"));

})

const getSubscribedChannels=asyncHandler(async(req,res) => {
    const {subscriberId}=req.user._id
    const SubscribedChannels= await Subscription.find({
        subscriber:subscriberId,
    }).populate("channel","_id name email")
    if(!SubscribedChannels){
        throw new ApiError(404,"Channel list not found")
    }
    return res.status(200).json(new ApiResponse(200,SubscribedChannels,"subscribed channels fetched successfully"));

})

export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
