import fs from "fs";
import path from "path";

export const deleteImage = (imageName) => {
    const filePath = path.join("./uploads" , imageName);
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.log(error.message);
    }
};
