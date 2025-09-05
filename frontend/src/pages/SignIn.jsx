import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext); // e.g., "http://localhost:9000"
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`, // <-- lowercase 'signin' must match backend
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data); // Update context with user data
      navigate("/"); // Navigate to home page after login
    } catch (error) {
      // safe error handling
      const message =
        error.response && error.response.data
          ? error.response.data.message
          : "Network or server error. Please try again.";

      alert(message);
      setErr(message);
      setUserData(null); // Clear user data on error
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] max-w-[500px] h-auto bg-[#41579800] backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-6 p-8 rounded-2xl"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-4 text-center">
          Sign In <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

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

        {err && <p className="text-red-500">*{err}</p>}

        <button
          type="submit"
          className="min-w-[150px] h-[55px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          className="text-gray-300 text-sm text-center"
          onClick={() => navigate("/signUp")}
        >
          Want to create a new Account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
