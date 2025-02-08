import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/dbConnect.js";
import userRoute from "./routes/user.route.js";
dotenv.config({});
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://localhost:8000", // Allow only this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

//API's
app.use("/api/v1/user", userRoute);

//DUmmy Code
// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });
connectDB();
app.listen(PORT, () => {
  console.log(`server is Listening at PORT ${PORT}`);
});
