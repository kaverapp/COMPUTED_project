import {Router} from "express";
import { loginUser, logoutUser, refreshAcessToken, registerUser } from "../controllers/user.controller.js";
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

export default router;