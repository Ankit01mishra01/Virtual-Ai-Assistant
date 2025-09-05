import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import AIImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognition = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      setUserData(null);
    }
  };

  const startRecognition = () => {
    try {
      recognition.current?.start();
      setIsListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error);
      }
    }
  };

  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterance);
  };

  // ✅ Wrapped in useCallback
  const handleCommand = useCallback((data) => {
    console.log("🎯 handleCommand called with:", data);
    const { type, userInput, response } = data || {};

    console.log("🔊 Speaking response:", response);
    speak(response);

    if (type === "google-search" && userInput) {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator-open") {
      window.open(`https://www.calculator.com`, "_blank");
    }

    if (type === "youtube-open") {
      const opened = window.open(`https://www.youtube.com`, "_blank");
      if (!opened) {
        alert("YouTube popup was blocked. Please allow popups for this site.");
      }
    }

    if (type === "weather-open") {
      window.open(`https://www.weather.com`, "_blank");
    }

    if (type === "chatgpt-open") {
      window.open(`https://chat.openai.com`, "_blank");
    }

    if (type === "gmail-open") {
      window.open(`https://mail.google.com`, "_blank");
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "VSCode-open") {
      window.open(`https://code.visualstudio.com/`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  }, []);

  useEffect(() => {
    if (!userData?.AssistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.lang = "en-US";

    recognition.current = recognitionInstance;

    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognitionInstance.start();
          console.log("🎤 Recognition started");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("🎤 Recognition start error:", error);
          }
        }
      }
    };

    recognitionInstance.onstart = () => {
      isRecognizingRef.current = true;
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      isRecognizingRef.current = false;
      setIsListening(false);
    };

    if (!isSpeakingRef.current) {
      setTimeout(() => {
        safeRecognition();
      }, 1000);
    }

    recognitionInstance.onerror = (event) => {
      console.warn("🎤 Recognition error:", event.error);
      isRecognizingRef.current = false;
      setIsListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognitionInstance.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (
        transcript.toLowerCase().includes(userData.AssistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognitionInstance.stop();
        isRecognizingRef.current = false;
        setIsListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 1000);

    safeRecognition();

    return () => {
      recognitionInstance.stop();
      setIsListening(false);
      clearInterval(fallback);
      recognitionInstance.onresult = null;
      recognitionInstance.onerror = null;
    };
  }, [userData?.AssistantName, getGeminiResponse, handleCommand]); // ✅ added handleCommand

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02032d] flex justify-center items-center flex-col gap-[15px] relative">
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[20px] left-[20px] rounded-full text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[20px] right-[20px] px-[20px] py-[10px] rounded-full text-[19px]"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden">
        {userData?.AssistantImage ? (
          <img
            src={userData.AssistantImage}
            alt="Assistant"
            className="h-full w-full object-cover rounded-3xl shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded-3xl shadow-lg flex items-center justify-center">
            <span className="text-white text-lg">No Image Selected</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="rounded-3xl p-[2px] bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
          <div className="bg-[#0b0b1a]/90 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-bold bg-white/10">
              {userData?.AssistantName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-lg font-semibold truncate">
                {userData?.AssistantName || "Your Assistant"}
              </h2>

              {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
              {aiText && <img src={AIImg} alt="" className="w-[200px]" />}

              <h1 className="text-white text-[18px] font-bold text-wrap">
                {userText ? userText : aiText ? aiText : null}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
