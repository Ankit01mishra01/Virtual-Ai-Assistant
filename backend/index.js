import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import path from "path"
import { fileURLToPath } from "url"
import geminiResponse from "./gemini.js"


const app=express()

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin:"http://localhost:5173",
  credentials: true 
}))
const port=process.env.PORT || 8000
app.use(express.json())
app.use(cookieParser())

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend server is working!" })
})

// Auth test route
app.get("/auth-test", (req, res) => {
  console.log("Auth test - cookies:", req.cookies);
  console.log("Auth test - headers:", req.headers.cookie);
  res.json({ 
    message: "Auth test endpoint", 
    cookies: req.cookies,
    hasCookieHeader: !!req.headers.cookie 
  })
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
// Connect to database first, then start server




const startServer = async () => {
  try {
    await connectDb()
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
