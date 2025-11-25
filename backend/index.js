import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

//use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get Port
const PORT = process.env.PORT || 8080;

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})