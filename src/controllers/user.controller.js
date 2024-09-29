import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/Apiresponse.js";

const registerUser=asyncHandler(async (req,res,next)=>{
    //get user  details from frontend
    //validation -not empty
    //check if user alredy exists:username,email
    //upload them to cloudinary, avatar
    //create user object- create entry in db
    //remove password and refresh token from response
    //check for user creation


    let {username,password,email,fullname,avatar,coverImg,watchHistory,refreshToken}=req.body;
    
    if(
        [username,password,email,fullname].some((field)=>field?.trim()==="")
    ){
        throw new  ApiError(400,"All fields are required $^ ");
    }
    
    const existingUser=User.findOne({
        $or:[{username} , {email}]
    })

    if(existingUser) throw new ApiError(409,"User aleady exists");

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const CoverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) throw new ApiError(400,"avatar file is required /^");

    const avtar=await uploadOnCloudinary(avatarLocalPath);
    const coverimg=await uploadOnCloudinary(CoverImageLocalPath);

    if(!avtar) throw new ApiError(400,"Avatar is required /^");

     const user=await User.create({
        username:username.toLowerCase(),
        password,
        email,
        fullname,
        avatar:avtar.url,
        coverImg:coverimg?.url || "",
    });

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new ApiError(500,"some thing went wrong while registering /^");
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully ")
    )
});


export {registerUser};