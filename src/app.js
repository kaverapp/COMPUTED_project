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

app.get("/",(req,res)=>{
    
})

export {app};