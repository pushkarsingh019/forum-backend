import cloudinary from "cloudinary";
import {v4 as uuid} from "uuid"

cloudinary.config({ 
    cloud_name: 'dvqzkx6sc', 
    api_key: '254948344819158', 
    api_secret: 'brREXIHfc61IWk0fUiaHxSxWFlE' 
});

export const uploadImage = async (imageUrl) => {
    let urlToReturn = ""
    await cloudinary.v2.uploader.upload(imageUrl, {public_id : uuid()} , (error, result) => {
        urlToReturn = result.url
    });
    return urlToReturn;
}