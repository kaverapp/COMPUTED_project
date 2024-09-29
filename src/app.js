import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app =express();

app.use(express.json({
    limit:"10kb",

}));
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}));

app.use(cors({
    origin:process.env.CORS_origin,
    methods:"GET,PUT,HEAD,POST,PATCH,DELETE",
    credentials:true,
    optionsSuccessStatus:200
}));
app.use(express.static("public"))
app.use(cookieParser());


//routes import
import userRouter from "./routes/user.routes.js";


//routes declaration

app.use("/api/v1/users",userRouter)   //here /api/v1/users is an prefix when u enter ths url in browser the control will be sent to theusrRouter

export {app};