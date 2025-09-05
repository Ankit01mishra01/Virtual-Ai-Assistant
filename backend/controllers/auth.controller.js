import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

// ---------------- LOGIN ----------------
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = await genToken(user._id);
    console.log("Generated token for user:", user._id);

    // set cookie - simplified for localhost development
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false
    });
    console.log("Cookie set successfully");

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error in Login controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- SIGNUP ----------------
export const signUp = async (req, res) => {
  try {
    console.log("Request body:", req.body); // log incoming data
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = await genToken(user._id);
    console.log("Generated token for new user:", user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    });
    console.log("Signup cookie set successfully");

    return res.status(201).json({ message: "User created successfully", token, user });
  } catch (error) {
    console.error("Full error details:", error); // log full object
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// ---------------- LOGOUT ----------------
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in LogOut controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

