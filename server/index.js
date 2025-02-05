import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database/dbConnect.js'
dotenv.config({});
const app = express();
const PORT  = process.env.PORT || 8080;


app.get("/", (req, res) => {
    res.send("Hello, World!");
});
connectDB();
app.listen(PORT, ()=>{
    console.log(`server is Listening at PORT ${PORT}`);
})

