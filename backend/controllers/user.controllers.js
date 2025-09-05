import User from "../models/user.model.js"
import geminiResponse from "../gemini.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import moment from "moment"

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error("Get current user error:", error)
    return res.status(500).json({ message: "Failed to get current user" })
  }
}


export const updateAssistant = async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file);
    console.log("User ID from token:", req.userId);
    
    const { AssistantName, imageUrl } = req.body;
    let AssistantImage;
    
    // Validate required data
    if (!AssistantName && !req.file && !imageUrl) {
      return res.status(400).json({ message: "At least assistant name or image is required" });
    }
    
    if (req.file) {
      // For uploaded files
      AssistantImage = `http://localhost:8000/uploads/${req.file.filename}`;
      console.log("File uploaded, image URL:", AssistantImage);
    } else if (imageUrl) {
      AssistantImage = imageUrl;
      console.log("Using provided image URL:", AssistantImage);
    } else {
      // Keep existing image if no new one provided
      const existingUser = await User.findById(req.userId);
      AssistantImage = existingUser?.AssistantImage || "";
      console.log("Keeping existing image:", AssistantImage);
    }
    
    const updateData = {};
    if (AssistantName) updateData.AssistantName = AssistantName;
    if (AssistantImage !== undefined) updateData.AssistantImage = AssistantImage;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("Updated user:", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Update assistant error:", error);
    return res.status(500).json({ 
      message: "Failed to update assistant", 
      error: error.message 
    });
  }
}


export const askToAssistant= async (req,res)=>{
  try{
    const {command}=req.body;
const user=await User.findById(req.userId);
const userName=user.name;

const AssistantName=user.AssistantName;
const result= await geminiResponse(command, AssistantName, userName);

const jsonMatch=result.match(/{[\s\S]*}/);
if(!jsonMatch){
  return res.status(400).json({response:"sorry,ican't help with that."})
}

const gemResult=JSON.parse(jsonMatch[0]);
console.log(gemResult)
const type=gemResult.type;
switch(type){
  case 'get-date':
    return res.json({
      type,
      userInput:gemResult.userInput,
      response: `current date is ${moment().format("YYYY-MM-DD")}`
    });
  case 'get-time':
    return res.json({
      type,
      userInput: gemResult.userInput,
      response: `current time is ${moment().format("hh:mm A")}`
    });
    case 'get-day':
    return res.json({
      type,
      userInput: gemResult.userInput,
      response: `current day is ${moment().format("dddd")}`
    });
    case 'get-month':
    return res.json({
      type,
      userInput: gemResult.userInput,
      response: `current month is ${moment().format("MMMM")}`
    });
    case 'google-search':
    case 'youtube-search':
    case 'youtube-play':
    case 'youtube-open':
    case 'youtube_search':
    case 'youtube_play':
    case 'general':
    case 'calculator-open':
    case 'instagram-open':
    case 'facebook-open':
    case 'VsCode-open':
    case 'weather-show':
    case 'weather-open':
    case 'chatgpt-open':
    case 'gmail-open':
      return res.json({
        type,
        userInput: gemResult.userInput,
        response: gemResult.response,
      });
    default:
      return res.status(400).json({ message: "Unknown command type" });
}

  }catch(error){
    console.error("Ask assistant error:", error);
    return res.status(500).json({ 
      message: "Ask assistant error",
      error: error.message 
    });
  }
}
