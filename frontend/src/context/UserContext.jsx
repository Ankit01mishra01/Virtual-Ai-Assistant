import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext(null);

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  // ensure axios sends cookies for every request
  axios.defaults.baseURL = serverUrl;
  axios.defaults.withCredentials = true;

  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      // Handle authentication errors gracefully
      if (error.response?.status === 400 || error.response?.status === 401) {
        // User is not logged in - this is expected behavior
        console.log("User not logged in");
        setUserData(null);
      } else {
        // Other errors (network, server errors, etc.)
        console.error("Error fetching current user:", error);
        setUserData(null);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    isLoadingUser,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    handleCurrentUser,
    getGeminiResponse,
  };

  // IMPORTANT: provide the object itself (not { value })
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
