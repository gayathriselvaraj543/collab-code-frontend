// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import JoinRoomPage from "./pages/JoinRoomPage";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<ProtectedRoute><JoinRoomPage /></ProtectedRoute>} />
        <Route path="/editor/:roomID" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
