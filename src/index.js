import dotenv from "dotenv";
import connectDb from "./db/connect.js"
import {app} from "./app.js"

dotenv.config({
    path:"./.env"
});

connectDb()
    .then(res=>{
        app.listen(process.env.PORT ||3000,()=>{
            console.log(`Server is Running on The ~Port: ~${process.env.PORT}`);
            
        })
    })
    .catch(err=>{console.log("MONGODB connection Failed ???",err);
    })