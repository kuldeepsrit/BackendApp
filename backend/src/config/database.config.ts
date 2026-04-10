import mongoose from "mongoose";

import { Env } from "./env.config";

const connectDatabase = async()=>{
   try{
    await mongoose.connect(Env.MONGO_URI , {
        serverSelectionTimeoutMS:8000,
        socketTimeoutMS:45000,
        connectTimeoutMS:10000  });

        console.log("Connected to Mongo Database");
 }catch(error){
    console.log("Error to connecting mongo database", error);
    process.exit(1);
  }};

 export default connectDatabase;
 
 export {mongoose};