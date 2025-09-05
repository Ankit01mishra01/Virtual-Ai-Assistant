import React, { useContext, useRef, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize() {
  const {
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    handleCurrentUser,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black flex justify-center items-center flex-col px-4 py-10">
      <IoMdArrowRoundBack
        className="absolute top-5 left-5 text-white cursor-pointer text-3xl"
        onClick={() => navigate("/home")}
      />
      <h1 className="text-4xl font-extrabold text-gray-100 text-center mb-10 tracking-wide">
        Select your{" "}
        <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">
          Assistant Image
        </span>
      </h1>

      {/* Image Cards */}
      <div className="w-[90%] flex justify-center items-center flex-wrap gap-6 mb-12">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />

        {/* Upload Card */}
        <div
          className={`w-[200px] h-[300px] bg-[#03032677] border-2 border-[#29015aee] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-blue-900 transition duration-300 ease-in-out transform hover:scale-105 hover:border-4 flex items-center justify-center ${
            selectedImage === "input" ? "border-4 border-blue-500" : ""
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <LuImagePlus className="text-white w-[40px] h-[40px]" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Show button if an image is selected or uploaded */}
      {(selectedImage || frontendImage) && (
        <button
          type="submit"
          className="min-w-[220px] h-[60px] 
             bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
             hover:from-indigo-700 hover:via-blue-600 hover:to-purple-700
             text-white text-lg font-semibold tracking-wide 
             rounded-full shadow-[0_8px_25px_rgba(0,0,255,0.4)]
             transition-all duration-300 transform hover:scale-110 hover:shadow-[0_10px_30px_rgba(59,130,246,0.6)]"
          onClick={() => navigate("/customize2")}
        >
          Confirm Selection
        </button>
      )}
    </div>
  );
}

export default Customize;
