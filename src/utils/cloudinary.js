
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , // Click 'View API Keys' above to copy your Cloud name
        api_key: process.env.CLOUDINARY_API_KEY , // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys
    }); 

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null;
  }
};

export {uploadOnCloudinary};