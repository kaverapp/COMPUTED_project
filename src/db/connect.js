import mongoose from "mongoose";
import {DB_NMAE} from "../constants.js";

let CONNECTION_url=process.env.MONGODB_url;

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_url}/${DB_NMAE}`)
        console.log(`\n mongodb connected !* DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("could not connect due to some error",error);
        process.exit(1);
    }
};

export default connectDB;