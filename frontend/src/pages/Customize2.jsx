import React from "react";
import { useState, useContext } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const navigate = useNavigate();
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );

  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    // Validate input
    if (!assistantName.trim()) {
      alert("Please enter an assistant name");
      return;
    }
    
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("AssistantName", assistantName);
      if (backendImage) {
        formData.append("AssistantImage", backendImage);
      } else if (selectedImage) {
        formData.append("imageUrl", selectedImage);
      }
      
      console.log("Sending data:", { assistantName, backendImage: !!backendImage, selectedImage });
      
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Update result:", result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      console.error("Update assistant error:", error);
      let errorMessage = "Unknown error occurred";
      
      if (error.response) {
        // Server responded with error status
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.status === 401 || 
            (error.response.status === 400 && error.response.data.message === "token not found")) {
          errorMessage = "You are not logged in. Please sign in again.";
          alert(errorMessage);
          navigate("/signin");
          return;
        } else {
          errorMessage = error.response.data.message || error.response.data.error || 'Failed to update assistant';
        }
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Please check if the backend server is running on http://localhost:8000";
      } else {
        // Something else happened
        console.error("Error message:", error.message);
        errorMessage = error.message || "Network error occurred";
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-950 to-black">
      <IoMdArrowRoundBack
        className="absolute top-5 left-5 text-white cursor-pointer text-3xl"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-4xl font-extrabold text-gray-100 text-center mb-10 tracking-wide">
        Enter Your{" "}
        <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">
          Assistant Name
        </span>
      </h1>

      <input
        type="text"
        placeholder="Enter your Assistant Name"
        className="w-[600px] h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      <button
        type="submit"
        className="mt-6 min-w-[220px] h-[60px] 
       bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
       hover:from-indigo-700 hover:via-blue-600 hover:to-purple-700
       text-white text-lg font-semibold tracking-wide 
       rounded-full shadow-[0_8px_25px_rgba(0,0,255,0.4)]
       transition-all duration-300 transform hover:scale-110 hover:shadow-[0_10px_30px_rgba(59,130,246,0.6)]"
        disabled={loading}
        onClick={() => {
          handleUpdateAssistant();
        }}
      >
        {loading ? "Creating..." : "Create Your Assistant"}
      </button>
    </div>
  );
}

export default Customize2;
