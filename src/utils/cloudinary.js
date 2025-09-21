
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , // Click 'View API Keys' above to copy your Cloud name
        api_key: process.env.CLOUDINARY_API_KEY , // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys
    }); 


const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // Safely remove local file after upload
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (fsErr) {
      console.error("Error deleting local file:", fsErr);
    }
    return response;
  } catch (error) {
    // Attempt to clean up local file if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (fsErr) {
      console.error("Error deleting local file after upload failure:", fsErr);
    }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export {uploadOnCloudinary};