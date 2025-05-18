import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";
export const generateImage = async (req, res) => {
    try {
        // logic to generate the image from the prompt 
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details either prompt or the user in generate Image section ' });
        }
        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }
        //To use the clipdrop api we have to create the multipart form data first 
        const formData = new FormData();
        formData.append('prompt', prompt);
        // sending the request 
        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })
        // converting the image to base64 
        const base64Image = Buffer.from(data,'binary').toString('base64');
        // generating the image url using the base64
        const resultImage = `data:image/png;base64,${base64Image}`
        // deductiong the user credit 
        await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance-1});

        res.json({success : true, message : "Image Generated", creditBalance : user.creditBalance - 1 , resultImage});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}