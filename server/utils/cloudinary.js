import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.v2.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Media upload failed");
    }
};

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const deleteResponse = await cloudinary.v2.uploader.destroy(publicId);
        return deleteResponse;
    } catch (error) {
        console.error("Delete error:", error);
        throw new Error("Media deletion failed");
    }
};


export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        const deleteResponse = await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: "video",
        });
        return deleteResponse;
    } catch (error) {
        console.error("Video delete error:", error);
        throw new Error("Video deletion failed");
    }
};
