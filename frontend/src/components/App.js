import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Conversation from "./Conversation";

export default function App() {  
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conversations" element={<Home />} />
          <Route path="/conversations/:id" element={<Conversation />} />
        </Routes>
      </BrowserRouter>
    );
}