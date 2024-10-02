import {Router} from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAcessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import  {verifyJWT}  from "../middleware/auth.middleware.js"

const router=Router();

router.route("/register").post(
    
    upload.fields([
        {
         name:"avatar",
         maxCount:1
        },
        {
            name:"coverImg",
            maxCount:1
        }
    ]),
    registerUser)
// router.route("/login").post(loginUser);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAcessToken);

router.route("/change-password").post(verifyJWT,changeCurrentPassword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-account-details").patch(verifyJWT,updateAccountDetails);

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar);

router.route("/cover-img").patch(verifyJWT,upload.single("coverImg"),updateUserCoverImage);

router.route("/c/:username").get(verifyJWT,getUserChannelProfile);

router.route("/history").get(verifyJWT,getWatchHistory);

export default router;