import mongoose from "mongoose";
import {DB_NMAE} from "../constants.js";

let DB_url=process.env.MONGODB_url || "mongodb://127.0.0.1:27017";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${DB_url}/${DB_NMAE}`)
        console.log(`\n mongodb connected !* DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("could not connect due to some error",error);
        process.exit(1);
    }
};

export default connectDB;