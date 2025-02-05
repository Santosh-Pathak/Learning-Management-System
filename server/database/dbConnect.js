import mongoose from 'mongoose';


const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connectecd SuccessFully");
        
    } catch (error) {
        console.log("Error while COnnecting to Datahase" + error);
    }
}
export default connectDB;