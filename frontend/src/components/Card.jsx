import React from "react";
import { userDataContext } from "../context/UserContext";
import { useContext } from "react";

function Card({ image }) {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  return (
    <div
      className={`w-[200px] h-[300px] bg-[#03032677] border-2 border-[#29015aee] rounded-2xl overflow-hidden cursor-pointer 
    shadow-md hover:shadow-blue-900 transition duration-300 ease-in-out transform hover:scale-105 hover:border-4  ${
      selectedImage == image ? "border-4 border-blue-500" : null
    }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className="h-full w-full object-cover" />
    </div>
  );
}

export default Card;
