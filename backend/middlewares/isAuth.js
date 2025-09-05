import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
  try {
    console.log("=== Auth Middleware Debug ===");
    console.log("Cookies received:", req.cookies);
    console.log("Headers:", req.headers.cookie);
    
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found in cookies");
      return res.status(400).json({ message: "token not found" });
    }
    
    console.log("Token found:", token.substring(0, 20) + "...");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const verifytoken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, userId:", verifytoken.userId);
    
    req.userId = verifytoken.userId;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default isAuth;