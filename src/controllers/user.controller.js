import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";

const generateAcessANDRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessTok = user.generateAccessToken();
        const refreshTok = user.generateRefreshToken();

        user.refreshToken = refreshTok;
        await user.save({ validateBeforeSave: false });

        return { accessTok, refreshTok };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh $ acess token")
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    //get user  details from frontend
    //validation -not empty
    //check if user alredy exists:username,email
    //upload them to cloudinary, avatar
    //create user object- create entry in db
    //remove password and refresh token from response
    //check for user creation


    let { username, password, email, fullname, avatar, coverImg, watchHistory, refreshToken } = req.body;

    if (
        [username, password, email, fullname].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required $^ ");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) throw new ApiError(409, "User aleady exists");

    //console.table(req.files)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const CoverImageLocalPath = req.files?.coverImg?.[0]?.path;

    //console.log(avatarLocalPath);

    if (!avatarLocalPath) throw new ApiError(400, "avatar file is required /^");

    const avtar = await uploadOnCloudinary(avatarLocalPath);
    const coverimg = await uploadOnCloudinary(CoverImageLocalPath);

    if (!avtar) throw new ApiError(400, "Avatar is required /^");

    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        fullname,
        avatar: avtar.url,
        coverImg: coverimg?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //console.log(createdUser);

    if (!createdUser) throw new ApiError(500, "some thing went wrong while registering /^");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully ")
    )
});


const loginUser = asyncHandler(async (req, res) => {
    //get user  details from frontend
    //validation -not empty
    //find the user
    //check for password
    //generate refresh token
    //generate access token
    //send cookie

    let { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }
    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )
    if (!user) throw new ApiError(404, "user does not exists");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(404, "invalid credentials/^");

    const { accessTok, refreshTok } = await generateAcessANDRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("acessToken", accessTok, options)
        .cookie("refreshToken", refreshTok, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessTok, refreshTok,

                }, {
                message: "user logged in successfully"
            }
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        rq.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfull"))
})


const refreshAcessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) throw new ApiError(401,"unauthorised request");

  try {
     const decodedToken= await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
  
     const user=await User.findById(decodedToken?._id);
  
     if(!user) throw new ApiError(401,"invalid refresh token/^");
  
     if(incomingRefreshToken!==user?.refreshToken) throw new ApiError(401,"refresh token is expired or used/^");
  
     const options={
      httpOnly:true,
      secure:true
     };
  
     const {accessToken,newRefreshToken}=await generateAcessANDRefreshToken(user._id);
  
     return res
         .status(200
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",newRefreshToken,options)
         .json(
          new ApiResponse(
              200,
              {accessToken,refreshToken:newRefreshToken},
              "acess token refreshed !"
          )
         )
         )
  } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token/^")
  }
})  

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken
};