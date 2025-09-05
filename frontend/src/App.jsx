import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2"; // ✅ Add this
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import React, { useContext } from "react"; // ✅ Fix import

function App() {
  const { userData, isLoadingUser } = useContext(userDataContext);

  if (isLoadingUser) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "#fff",
          background: "#0b0b1a",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/customize" />}
      />
      <Route path="/home" element={<Home />} />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize" // ✅ lowercase
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customize2" // ✅ lowercase
        element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
}

export default App;
