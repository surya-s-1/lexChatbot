import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Conversation from "./Conversation";
import Login from "./Login";
import Register from "./Register";

export default function App() {  
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/conversations" element={<Home />} />
          <Route path="/conversations/:id" element={<Conversation />} />
        </Routes>
      </BrowserRouter>
    );
}