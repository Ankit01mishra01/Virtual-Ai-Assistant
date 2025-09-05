import React, { useContext } from "react";
import bg from "../assets/authBg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log({ name, email, password });

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log("Signup successful:", result.data);
      setUserData(result.data);
      // Navigate to customize page after successful signup
      navigate("/customize");
    } catch (error) {
      console.error("Error during signup:", error);
      // You can add state to show error message to user
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] max-w-[500px] h-auto bg-[#41579800] backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-6 p-8 rounded-2xl"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-[30px] font-semibold mb-4 text-center">
          Register for <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password with Eye Toggle */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full pr-12"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center text-white hover:text-blue-400"
          >
            {showPassword ? (
              <FaRegEyeSlash size={20} />
            ) : (
              <FaRegEye size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="min-w-[150px] h-[55px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300"
        >
          Sign Up
        </button>
        <p
          className="text-gray-300 text-sm text-center"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
